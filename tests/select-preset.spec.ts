import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';

import VoltSelect from '../components/volt/Select.vue';

describe('select preset', () => {
    it('lets a searchable Select filter consume the full overlay width', async () => {
        const wrapper = mount(VoltSelect, {
            props: {
                modelValue: null,
                options: ['Helium Flow Rate', 'Beam Plate Voltage'],
                filter: true,
                appendTo: 'self'
            },
            global: { plugins: [[PrimeVue, { unstyled: true }]] }
        });

        await wrapper.get('[role="combobox"]').trigger('click');
        await nextTick();

        const input = wrapper.get('[role="searchbox"]');
        expect(input.classes()).toContain('w-full');
        expect(input.element.parentElement?.classList).toContain('relative');
        expect(input.element.parentElement?.classList).toContain('block');
        expect(wrapper.get('[data-pc-section="header"]').classes()).toContain('block');
        expect(wrapper.get('[data-pc-section="header"]').classes()).not.toContain('w-full');
        expect(wrapper.get('[data-pc-section="overlay"]').classes()).toContain('w-0');
    });
});
