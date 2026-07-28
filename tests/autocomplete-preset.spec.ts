import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import VoltAutoComplete from '../components/volt/AutoComplete.vue';

/**
 * PrimeVue 4 renders single-select AutoComplete as a nested InputText addressed
 * through the `pcInputText` pass-through section, not through `input` (which
 * only applies in multiple mode). Without a `pcInputText` section the control
 * inherits no surface: invisible on a light card, and a bare bordered box in
 * dark mode.
 */
describe('autocomplete preset', () => {
    const inputClasses = (props: Record<string, unknown> = {}) =>
        mount(VoltAutoComplete, {
            props,
            global: { plugins: [[PrimeVue, { unstyled: true }]] }
        })
            .get('input')
            .classes();

    it('gives the single-select input a surface, border and padding', () => {
        const classes = inputClasses();

        expect(classes).toContain('bg-surface-0');
        expect(classes).toContain('dark:bg-surface-950');
        expect(classes).toContain('border');
        expect(classes).toContain('border-surface-300');
        expect(classes).toContain('dark:border-surface-700');
        expect(classes.some((c) => c.startsWith('py-'))).toBe(true);
        expect(classes.some((c) => c.startsWith('px-'))).toBe(true);
    });

    it('marks an invalid single-select input with the danger border', () => {
        const classes = inputClasses({ invalid: true });

        expect(classes).toContain('border-danger');
        expect(classes).not.toContain('border-surface-300');
    });

    it('uses the disabled surface when the control is disabled', () => {
        const classes = inputClasses({ disabled: true });

        expect(classes).toContain('bg-surface-200');
        expect(classes).not.toContain('bg-surface-0');
    });

    it('keeps the multiple-select input transparent inside its chip container', () => {
        const classes = inputClasses({ multiple: true });

        expect(classes).toContain('bg-transparent');
        expect(classes).not.toContain('bg-surface-0');
    });
});
