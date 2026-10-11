import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import VoltPassword from '../components/volt/Password.vue';

/**
 * PrimeVue 4 renders Password's field as a nested InputText addressed through
 * the `pcInputText` pass-through section. Without one the input has no class
 * at all and shows as a bare native box beside the styled fields.
 */
describe('password preset', () => {
    const inputClasses = (props: Record<string, unknown> = {}) =>
        mount(VoltPassword, {
            props: { feedback: false, ...props },
            global: { plugins: [[PrimeVue, { unstyled: true }]] }
        })
            .get('input')
            .classes();

    it('gives the field the same surface, border, padding and height as InputText', () => {
        const classes = inputClasses();

        expect(classes).toContain('bg-surface-0');
        expect(classes).toContain('border');
        expect(classes).toContain('border-surface-300');
        expect(classes).toContain('h-[2.125rem]');
        expect(classes.some((c) => c.startsWith('px-'))).toBe(true);
    });

    it('marks an invalid field with the danger border', () => {
        const classes = inputClasses({ invalid: true });

        expect(classes).toContain('border-danger');
        expect(classes).not.toContain('border-surface-300');
    });

    it('uses the disabled surface when the field is disabled', () => {
        const classes = inputClasses({ disabled: true });

        expect(classes).toContain('bg-surface-200');
        expect(classes).not.toContain('bg-surface-0');
    });
});
