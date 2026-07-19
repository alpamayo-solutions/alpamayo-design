import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AlpQuickCreateCard from '../components/alp/AlpQuickCreateCard.vue';
import AlpMemberPicker from '../components/alp/AlpMemberPicker.vue';
import en from '../i18n/locales/en/design.json';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

// Minimal functional stubs for the Volt primitives this shell composes —
// enough to drive selection behavior without pulling in PrimeVue's
// overlay/Teleport machinery. Mirrors tests/member-pickers.spec.ts (VoltMenu)
// and tests/tier2-batch-b.spec.ts (VoltSelect).
const VoltButtonStub = {
    props: ['disabled', 'loading', 'label'],
    emits: ['click'],
    template: '<button :disabled="disabled" @click="$emit(\'click\')">{{ label }}<slot /></button>'
};
const VoltInputTextStub = {
    props: ['modelValue', 'placeholder', 'disabled'],
    emits: ['update:modelValue'],
    template:
        '<input :value="modelValue" :placeholder="placeholder" :disabled="disabled" @input="$emit(\'update:modelValue\', $event.target.value)" />'
};
const VoltMenuStub = defineComponent({
    props: ['model'],
    template: `
        <ul>
            <li v-for="item in model" :key="item.key">
                <slot name="item" :item="item" :props="{ action: { onClick: () => item.command && item.command() } }" />
            </li>
        </ul>
    `
});
const VoltSelectStub = defineComponent({
    props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'placeholder'],
    emits: ['update:modelValue'],
    template:
        '<div class="volt-select"><ul><li v-for="opt in options" :key="opt[optionValue]" @click="$emit(\'update:modelValue\', opt[optionValue])">{{ opt[optionLabel] }}</li></ul></div>'
});
const VoltMultiSelectStub = defineComponent({
    props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'placeholder'],
    emits: ['update:modelValue'],
    template: `
        <div class="volt-multiselect">
            <ul>
                <li v-for="opt in options" :key="opt[optionValue]" @click="toggle(opt)">{{ opt[optionLabel] }}</li>
            </ul>
        </div>
    `,
    methods: {
        toggle(opt: Record<string, unknown>) {
            const id = opt[this.optionValue as string];
            const current = this.modelValue as string[];
            const next = current.includes(id as string)
                ? current.filter((v) => v !== id)
                : [...current, id as string];
            this.$emit('update:modelValue', next);
        }
    }
});

const globalConfig = {
    plugins: [i18n],
    components: {
        VoltButton: VoltButtonStub,
        VoltInputText: VoltInputTextStub,
        VoltMenu: VoltMenuStub,
        VoltSelect: VoltSelectStub,
        VoltMultiSelect: VoltMultiSelectStub,
        AlpMemberPicker
    },
    directives: { tooltip: {} }
};

const assigneeOptions = [
    { id: 'u1', label: 'Alex Doe' },
    { id: 'u2', label: 'Kim Muster' }
];
const labelOptions = [
    { id: 'l1', label: 'Bug', color: '#ef4444' },
    { id: 'l2', label: 'Feature' }
];

describe('AlpQuickCreateCard', () => {
    it('renders a title input', () => {
        const w = mount(AlpQuickCreateCard, { global: globalConfig });
        expect(w.find('input').exists()).toBe(true);
    });

    it('emits create with the title and selected assignee/labels', async () => {
        const w = mount(AlpQuickCreateCard, {
            props: { assigneeOptions, labelOptions },
            global: globalConfig
        });

        await w.find('input').setValue('Ship the thing');

        // Pick an assignee via the composed AlpMemberPicker (unassigned + 2 options).
        const memberItems = w.findAll('li a');
        await memberItems[1]!.trigger('click'); // Alex Doe

        // Pick a label via the stubbed multiselect.
        const labelItems = w.find('.volt-multiselect').findAll('li');
        await labelItems[0]!.trigger('click'); // Bug

        const createButton = w.findAll('button').find((b) => b.text() === 'Create')!;
        await createButton.trigger('click');

        expect(w.emitted('create')).toEqual([
            [
                {
                    title: 'Ship the thing',
                    assigneeId: 'u1',
                    labelIds: ['l1'],
                    typeKey: undefined,
                    projectSlug: undefined
                }
            ]
        ]);
    });

    it('emits cancel when the cancel button is clicked', async () => {
        const w = mount(AlpQuickCreateCard, { global: globalConfig });
        const cancelButton = w.findAll('button').find((b) => b.text() === 'Cancel')!;
        await cancelButton.trigger('click');
        expect(w.emitted('cancel')).toEqual([[]]);
    });

    it('disables the create button while creating', () => {
        const w = mount(AlpQuickCreateCard, { props: { creating: true }, global: globalConfig });
        const createButton = w.findAll('button').find((b) => b.text() === 'Create')!;
        expect(createButton.attributes('disabled')).not.toBeUndefined();
    });

    it('shows no project picker with 0 or 1 project option', () => {
        const none = mount(AlpQuickCreateCard, { global: globalConfig });
        expect(none.find('.volt-select').exists()).toBe(false);

        const one = mount(AlpQuickCreateCard, {
            props: { projectOptions: [{ slug: 'demo', label: 'Demo Project' }] },
            global: globalConfig
        });
        expect(one.find('.volt-select').exists()).toBe(false);
    });

    it('shows a project picker when projectOptions.length > 1', () => {
        const w = mount(AlpQuickCreateCard, {
            props: {
                projectOptions: [
                    { slug: 'demo', label: 'Demo Project' },
                    { slug: 'other', label: 'Other Project' }
                ]
            },
            global: globalConfig
        });
        expect(w.find('.volt-select').exists()).toBe(true);
        expect(w.find('.volt-select').text()).toContain('Demo Project');
        expect(w.find('.volt-select').text()).toContain('Other Project');
    });
});
