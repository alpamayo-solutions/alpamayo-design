// Guards the design.* i18n contract (Task A9): every locale must define the
// exact same key set, and every design.* key referenced anywhere in
// components/alp/** or composables/** must actually exist in the locale
// files (not just stubbed locally in a test). This is a permanent regression
// guard — Tasks A1-A8 all stubbed design.* messages locally in their own
// specs because the locale files didn't have the keys yet; this test is
// what closes that gap for good.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '../i18n/locales/en/design.json';
import de from '../i18n/locales/de/design.json';
import deCh from '../i18n/locales/de-ch/design.json';

const root = join(__dirname, '..');

function flattenKeys(obj: unknown, prefix = ''): string[] {
    if (typeof obj !== 'object' || obj === null) return [prefix];
    return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
        flattenKeys(value, prefix ? `${prefix}.${key}` : key)
    );
}

function findFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) files.push(...findFiles(full, extensions));
        else if (extensions.some((ext) => entry.name.endsWith(ext))) files.push(full);
    }
    return files;
}

function referencedDesignKeys(dirs: string[], extensions: string[]): Set<string> {
    const keys = new Set<string>();
    for (const dir of dirs) {
        if (!statSync(join(root, dir), { throwIfNoEntry: false })?.isDirectory()) continue;
        for (const file of findFiles(join(root, dir), extensions)) {
            const src = readFileSync(file, 'utf8');
            for (const match of src.matchAll(/design\.[a-zA-Z]+\.[a-zA-Z]+/g)) {
                keys.add(match[0]);
            }
        }
    }
    return keys;
}

describe('design.* i18n contract', () => {
    const enKeys = flattenKeys(en).sort();
    const deKeys = flattenKeys(de).sort();
    const deChKeys = flattenKeys(deCh).sort();

    it('en, de, and de-ch define the exact same key set', () => {
        expect(deKeys).toEqual(enKeys);
        expect(deChKeys).toEqual(enKeys);
    });

    it('de-ch has no ß (Swiss German uses ss)', () => {
        const withEszett = flattenKeys(deCh)
            .filter((key) => typeof key === 'string')
            .map((key) => ({ key, value: getByPath(deCh, key) }))
            .filter(({ value }) => typeof value === 'string' && value.includes('ß'));
        expect(withEszett).toEqual([]);
    });

    it('every design.* key referenced under components/alp/** exists in en/design.json', () => {
        const referenced = referencedDesignKeys(['components/alp'], ['.vue']);
        const missing = [...referenced].filter((key) => !enKeys.includes(key)).sort();
        expect(missing).toEqual([]);
    });

    it('every design.* key referenced under composables/** exists in en/design.json', () => {
        const referenced = referencedDesignKeys(['composables'], ['.ts']);
        const missing = [...referenced].filter((key) => !enKeys.includes(key)).sort();
        expect(missing).toEqual([]);
    });
});

function getByPath(obj: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, part) => {
        if (typeof acc !== 'object' || acc === null) return undefined;
        return (acc as Record<string, unknown>)[part];
    }, obj);
}
