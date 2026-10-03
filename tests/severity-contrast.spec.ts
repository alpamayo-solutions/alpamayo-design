import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import badgePreset from '../presets/alpamayo/badge/index.js';
import badgeDirectivePreset from '../presets/alpamayo/badgedirective/index.js';
import buttonPreset from '../presets/alpamayo/button/index.js';
import messagePreset from '../presets/alpamayo/message/index.js';
import tagPreset from '../presets/alpamayo/tag/index.js';
import toastPreset from '../presets/alpamayo/toast/index.js';

/**
 * Every severity-coloured element of the preset must keep its text at WCAG AA
 * (4.5:1) in both schemes, at rest and on hover. The colours are not checked
 * against a list of expected classes: each preset is rendered for its props,
 * its Tailwind colour classes are resolved through tokens.css, and the pair
 * the browser would paint is measured. The danger button's `#ef4444` with
 * white text (3.76:1) is what this guards against.
 */

const tokensCss = readFileSync(join(__dirname, '..', 'assets/css/tokens.css'), 'utf8');

type Scheme = 'light' | 'dark';
type Rgb = [number, number, number];

function block(src: string, selector: string) {
    const start = src.indexOf(`${selector} {`);
    if (start < 0) throw new Error(`no block ${selector}`);
    let depth = 0;
    for (let i = src.indexOf('{', start); i < src.length; i++) {
        if (src[i] === '{') depth++;
        if (src[i] === '}' && --depth === 0) return src.slice(start, i + 1);
    }
    throw new Error(`unclosed block ${selector}`);
}

function declarations(src: string) {
    const out = new Map<string, string>();
    for (const m of src.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)) out.set(m[1]!, m[2]!.trim());
    return out;
}

const palette = declarations(block(tokensCss, ':root'));
const semanticLayer = block(tokensCss, '@layer alp-semantic');
const semantic: Record<Scheme, Map<string, string>> = {
    light: declarations(block(semanticLayer, ':root')),
    dark: declarations(block(semanticLayer, '.dark'))
};

function hex(value: string, scheme: Scheme): string | null {
    const ref = value.match(/^var\(--([\w-]+)\)$/);
    if (ref) return lookup(ref[1]!, scheme);
    return /^#[0-9a-f]{6}$/i.test(value) ? value : null;
}

function lookup(name: string, scheme: Scheme): string | null {
    const value = semantic[scheme].get(name) ?? palette.get(name);
    return value ? hex(value, scheme) : null;
}

/** A Tailwind colour name (`danger-fill`, `surface-900`, `white`) in a scheme. */
function colour(name: string, scheme: Scheme): { rgb: Rgb; alpha: number } | null {
    const arbitrary = name.match(/^\[rgba\((\d+),(\d+),(\d+),([\d.]+)\)\]$/);
    if (arbitrary) {
        const [r, g, b, a] = arbitrary.slice(1).map(Number);
        return { rgb: [r!, g!, b!], alpha: a! };
    }
    const [base, opacity] = name.split('/');
    const resolved =
        base === 'white'
            ? '#ffffff'
            : base === 'primary'
              ? lookup('primary-500', scheme)
              : lookup(base!, scheme);
    if (!resolved) return null;
    const rgb = [1, 3, 5].map((i) => parseInt(resolved.slice(i, i + 2), 16)) as Rgb;
    return { rgb, alpha: opacity ? Number(opacity) / 100 : 1 };
}

function luminance([r, g, b]: Rgb) {
    const lin = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a: Rgb, b: Rgb) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi! + 0.05) / (lo! + 0.05);
}

function over(fg: { rgb: Rgb; alpha: number }, bg: Rgb): Rgb {
    return fg.rgb.map((c, i) => Math.round(c * fg.alpha + bg[i]! * (1 - fg.alpha))) as Rgb;
}

/** What an element can sit on: the scheme's page and card surfaces. */
const PAGE: Record<Scheme, string[]> = {
    light: ['surface-0', 'surface-50', 'surface-100'],
    dark: ['surface-800', 'surface-900', 'surface-950', 'primary-900']
};

function classTokens(result: { class: unknown }) {
    const tokens: string[] = [];
    const walk = (entry: unknown) => {
        if (typeof entry === 'string') tokens.push(...entry.split(/\s+/).filter(Boolean));
        else if (Array.isArray(entry)) entry.forEach(walk);
        else if (entry && typeof entry === 'object')
            for (const [key, on] of Object.entries(entry)) if (on) walk(key);
    };
    walk(result.class);
    return tokens;
}

type State = { scheme: Scheme; hover: boolean };

/** `text-*` / `bg-*` utilities that are not colours. */
const NOT_A_COLOUR = /^(xs|sm|base|lg|\d?xl|center|left|right|justify|clip-\w+|\[(?!rgba).*\])$/;

/**
 * The colours of one property (`text` or `bg`) that can win in a state.
 * `dark:hover:` beats everything; where only `dark:` and `hover:` compete,
 * both are returned so the check holds whichever the cascade picks.
 */
function candidates(tokens: string[], property: 'text' | 'bg', { scheme, hover }: State) {
    const byVariant = new Map<string, string[]>();
    for (const token of tokens) {
        const m = token.match(/^((?:dark:|hover:)*)(text|bg)-(.+)$/);
        if (!m || m[2] !== property) continue;
        if (m[3] === 'transparent') {
            byVariant.set(m[1]!, [...(byVariant.get(m[1]!) ?? []), 'transparent']);
            continue;
        }
        if (NOT_A_COLOUR.test(m[3]!)) continue;
        // A colour this package does not define (Tailwind's own `orange-500`,
        // or `danger` without a step) is either a different palette or no
        // colour at all; both escape this check, so they fail it.
        if (!colour(m[3]!, scheme)) throw new Error(`${token}: not a colour of this package`);
        byVariant.set(m[1]!, [...(byVariant.get(m[1]!) ?? []), m[3]!]);
    }
    const pick = (...variants: string[]) => variants.flatMap((v) => byVariant.get(v) ?? []);
    if (scheme === 'dark' && hover) {
        if (byVariant.has('dark:hover:')) return pick('dark:hover:');
        const both = pick('dark:', 'hover:');
        return both.length ? both : pick('');
    }
    const order = scheme === 'dark' ? ['dark:', ''] : hover ? ['hover:', ''] : [''];
    for (const variant of order) if (byVariant.has(variant)) return pick(variant);
    return [];
}

/** Worst text contrast of a rendered class list in one state. */
function worstRatio(tokens: string[], state: State) {
    const texts = candidates(tokens, 'text', state);
    if (!texts.length) throw new Error(`no text colour in ${state.scheme}${state.hover ? ' hover' : ''}`);
    const fills = candidates(tokens, 'bg', state).filter((bg) => bg !== 'transparent');
    const pages = PAGE[state.scheme].map((p) => colour(p, state.scheme)!.rgb);
    const backgrounds = fills.length
        ? fills.flatMap((bg) => pages.map((page) => over(colour(bg, state.scheme)!, page)))
        : pages;
    let worst = Infinity;
    for (const text of texts)
        for (const bg of backgrounds)
            worst = Math.min(worst, ratio(over(colour(text, state.scheme)!, bg), bg));
    return worst;
}

const STATES: State[] = [
    { scheme: 'light', hover: false },
    { scheme: 'light', hover: true },
    { scheme: 'dark', hover: false },
    { scheme: 'dark', hover: true }
];

const SEVERITIES = ['danger', 'warn', 'success', 'info', 'help', 'contrast', 'secondary'] as const;
const AA = 4.5;

function expectAA(name: string, tokens: string[]) {
    for (const state of STATES) {
        const label = `${name} (${state.scheme}${state.hover ? ', hover' : ''})`;
        expect(worstRatio(tokens, state), label).toBeGreaterThanOrEqual(AA);
    }
}

function button(severity: string, variant: 'solid' | 'text' | 'outlined' | 'link') {
    return classTokens(
        (buttonPreset as any).root({
            props: {
                severity,
                text: variant === 'text',
                outlined: variant === 'outlined',
                link: variant === 'link',
                plain: false,
                fluid: false,
                iconPos: null,
                label: 'x',
                size: null
            },
            context: {},
            parent: { instance: {} },
            instance: {}
        })
    );
}

describe('severity colours meet WCAG AA', () => {
    for (const severity of SEVERITIES)
        for (const variant of ['solid', 'text', 'outlined', 'link'] as const)
            it(`button ${severity} ${variant}`, () =>
                expectAA(`button ${severity} ${variant}`, button(severity, variant)));

    for (const severity of SEVERITIES) {
        it(`badge ${severity}`, () =>
            expectAA(
                `badge ${severity}`,
                classTokens((badgePreset as any).root({ props: { severity, value: '3', size: null } }))
            ));
        it(`tag ${severity}`, () =>
            expectAA(`tag ${severity}`, classTokens((tagPreset as any).root({ props: { severity } }))));
    }

    for (const flag of ['danger', 'warning', 'success', 'info', 'help'])
        it(`badge directive ${flag}`, () =>
            expectAA(
                `v-badge ${flag}`,
                classTokens((badgeDirectivePreset as any).root({ context: { [flag]: true } }))
            ));

    for (const severity of ['error', 'warn', 'success', 'info', 'contrast', 'secondary']) {
        it(`message ${severity}`, () =>
            expectAA(
                `message ${severity}`,
                classTokens((messagePreset as any).root({ props: { severity } }))
            ));

        const toast = { props: { message: { severity, summary: 'x' } } };
        const card = classTokens((toastPreset as any).message(toast));
        it(`toast ${severity}`, () => expectAA(`toast ${severity}`, card));
        it(`toast ${severity} detail`, () =>
            expectAA(`toast ${severity} detail`, [
                ...card.filter((token) => !/^(dark:)?text-/.test(token)),
                ...classTokens((toastPreset as any).detail(toast))
            ]));
    }
});
