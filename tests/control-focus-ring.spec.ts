import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';

import VoltCheckbox from '../components/volt/Checkbox.vue';
import VoltRadioButton from '../components/volt/RadioButton.vue';
import VoltSelect from '../components/volt/Select.vue';
import VoltToggleSwitch from '../components/volt/ToggleSwitch.vue';

const global = { plugins: [[PrimeVue, { unstyled: true }]] as never };

/**
 * Keyboard focus on a select, checkbox, radio or switch was a 1 px ring in
 * the primary colour laid over the control's own 1 px border: it read as the
 * border getting slightly darker, which a keyboard user cannot find on a
 * form. The ring is 2 px now, and on the small controls it stands off the
 * box so it is not mistaken for the border at all.
 */
describe('form control keyboard focus', () => {
    it.each([
        ['checkbox', VoltCheckbox, { binary: true, modelValue: false }],
        ['radio button', VoltRadioButton, { value: 'a', modelValue: null }],
        ['toggle switch', VoltToggleSwitch, { modelValue: false }]
    ])('rings a focused %s apart from its border', (_name, component, props) => {
        const wrapper = mount(component as never, { props: props as never, global });
        const box = wrapper.get('[data-pc-section="box"], [data-pc-section="slider"]');

        expect(box.classes()).toContain('peer-focus-visible:ring-2');
        expect(box.classes()).toContain('peer-focus-visible:ring-offset-2');
        expect(box.classes()).not.toContain('peer-focus-visible:ring-1');
    });

    it('rings a focused select with more than its border', async () => {
        const wrapper = mount(VoltSelect, {
            props: { modelValue: null, options: ['Comment', 'Scrap'] },
            global
        });
        const root = wrapper.get('[data-pc-name="select"]');
        expect(root.classes()).not.toContain('ring-2');

        await wrapper.get('[role="combobox"]').trigger('focus');
        await nextTick();

        expect(root.classes()).toContain('ring-2');
    });
});
