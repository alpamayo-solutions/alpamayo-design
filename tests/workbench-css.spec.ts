import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(__dirname, '..');
const workbenchCss = readFileSync(join(root, 'layers/workbench/assets/css/workbench.css'), 'utf8');
const tokensCss = readFileSync(join(root, 'assets/css/tokens.css'), 'utf8');
const editorSplit = readFileSync(join(root, 'layers/workbench/components/EditorSplit.vue'), 'utf8');

/** Written by the consuming app on `.alp-workbench`, per the layer's contract. */
const APP_SUPPLIED = ['--alp-workbench-logomark'];

function definedProperties(...sources: string[]) {
    const defined = new Set<string>();
    for (const src of sources) {
        // Optional quotes so a Vue style-binding object counts as a definition too.
        for (const m of src.matchAll(/^\s*['"]?(--[\w-]+)['"]?\s*:/gm)) defined.add(m[1]!);
    }
    return defined;
}

function referencedProperties(src: string) {
    return [...src.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]!);
}

describe('workbench stylesheet', () => {
    /**
     * `.alp-workbench-context-menu-item--destructive` used to be coloured with
     * `--p-red-500`, a PrimeVue theme token this package never defines. An
     * undefined custom property makes the whole declaration invalid, so Delete
     * silently rendered in the same colour as every other menu item. Nothing
     * about that failure is visible in a component test — the reference has to
     * be checked against what the package actually ships.
     */
    it('only references custom properties the package defines', () => {
        // EditorSplit writes --alp-workbench-split-ratio as an inline style, so
        // its own source counts as a definition site.
        const defined = definedProperties(workbenchCss, tokensCss, editorSplit);
        const dangling = [...new Set(referencedProperties(workbenchCss))].filter(
            (name) => !APP_SUPPLIED.includes(name) && !defined.has(name)
        );
        expect(dangling).toEqual([]);
    });

    /**
     * PrimeVue overlays teleport to document.body. Tokens scoped to the
     * `.alp-workbench` element resolve to nothing out there, which renders
     * context menus, popovers and dialogs fully transparent in any app where
     * the workbench is a nested route rather than the page root.
     */
    it('defines its tokens at the document root so teleported overlays resolve them', () => {
        const rootBlock = workbenchCss.match(/(?:^|\n):root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
        const rootTokens = [...rootBlock.matchAll(/^\s*(--alp-workbench-[\w-]+)\s*:/gm)].map((m) => m[1]!);
        const allTokens = new Set(
            [...workbenchCss.matchAll(/^\s*(--alp-workbench-[\w-]+)\s*:/gm)].map((m) => m[1]!)
        );

        expect(rootTokens.length).toBeGreaterThan(0);
        expect([...allTokens].sort()).toEqual([...new Set(rootTokens)].sort());
    });
});
