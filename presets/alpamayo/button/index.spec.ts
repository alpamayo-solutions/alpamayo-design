import { describe, expect, it } from 'vitest';
import buttonPreset from './index.js';

function solidButtonClassEntries(severity: string) {
    const result = (buttonPreset as any).root({
        props: {
            severity,
            text: false,
            outlined: false,
            plain: false,
            link: false,
            fluid: false,
            iconPos: null,
            label: 'x',
            size: null
        },
        context: {},
        parent: { instance: {} },
        instance: {}
    });
    return (result.class as unknown[]).filter(
        (entry): entry is Record<string, boolean> => typeof entry === 'object' && entry !== null
    );
}

describe('Button preset', () => {
    it('uses the shared on-fill text colour for solid success buttons, like every other severity (bug #14)', () => {
        const entries = solidButtonClassEntries('success');

        const correctEntry = entries.find((entry) => 'text-on-severity-fill' in entry);
        expect(correctEntry).toBeDefined();
        expect(correctEntry!['text-on-severity-fill']).toBe(true);

        const buggyKeyExists = entries.some((entry) =>
            Object.keys(entry).some((key) => key.includes('dark:text-success-900'))
        );
        expect(buggyKeyExists).toBe(false);
    });

    it('gives info/warn/danger/help solid buttons the same on-fill text colour', () => {
        for (const severity of ['info', 'warn', 'danger', 'help']) {
            const entries = solidButtonClassEntries(severity);
            const entry = entries.find((candidate) => 'text-on-severity-fill' in candidate);
            expect(entry, `severity=${severity}`).toBeDefined();
        }
    });
});
