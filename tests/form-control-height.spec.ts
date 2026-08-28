import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import type { Component } from 'vue';
import { describe, expect, it } from 'vitest';

import VoltButton from '../components/volt/Button.vue';
import VoltInputText from '../components/volt/InputText.vue';
import VoltSelect from '../components/volt/Select.vue';

const controls: Array<[string, Component]> = [
    ['button', VoltButton as Component],
    ['input', VoltInputText as Component],
    ['select', VoltSelect as Component]
];

const sizes = [
    ['small', 'h-[1.75rem]'],
    [undefined, 'h-[2.125rem]'],
    ['large', 'h-[2.875rem]']
] as const;

describe('form-control height contract', () => {
    it.each(sizes)('uses one %s height across button, input, and select', (size, height) => {
        for (const [name, component] of controls) {
            const wrapper = mount(component, {
                props: size ? { size } : {},
                global: { plugins: [[PrimeVue, { unstyled: true }]] }
            });

            expect(wrapper.get('[data-pc-section="root"]').classes(), name).toContain(height);
        }
    });
});
