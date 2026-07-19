import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AlpMemberPicker from '../components/alp/AlpMemberPicker.vue';
import AlpMemberFilter from '../components/alp/AlpMemberFilter.vue';

// design.member.* keys aren't stubbed here — this task adds them directly to
// i18n/locales/*/design.json (see task-A2-report.md for why: the live
// i18n-contract.spec.ts guard requires every design.* reference under
// components/alp/** to already exist in en/design.json, so deferring the
// locale entries to a later task would leave `npm test` red). We still load
// the real plugin so the strings render as intended, not as raw keys.
import en from '../i18n/locales/en/design.json';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

// Minimal functional stubs for the Volt primitives — enough to drive
// selection behavior and render the #item/#value/#option slots without
// pulling in PrimeVue's overlay/focus-trap machinery. Mirrors the pattern in
// tests/tier2-batch-b.spec.ts, extended to actually render scoped slots
// (the tier2 VoltMenuStub ignores #item entirely, which this suite needs).
const VoltButtonStub = {
    props: ['disabled'],
    emits: ['click'],
    template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>'
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
const VoltMultiSelectStub = defineComponent({
    props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'placeholder', 'filter'],
    emits: ['update:modelValue'],
    template: `
        <div>
            <div class="value-slot"><slot name="value" /></div>
            <ul>
                <li v-for="opt in options" :key="opt[optionValue]" @click="toggle(opt)">
                    <slot name="option" :option="opt" />
                </li>
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

describe('AlpMemberPicker', () => {
    const options = [
        { id: 'u1', label: 'Alex Doe', avatar: 'https://example.test/u1.png' },
        { id: 'u2', label: 'Kim Muster' }
    ];
    const globalConfig = {
        plugins: [i18n],
        components: { VoltButton: VoltButtonStub, VoltMenu: VoltMenuStub },
        directives: { tooltip: {} }
    };

    it('renders one menu row per option plus an unassigned row', () => {
        const w = mount(AlpMemberPicker, { props: { options, modelValue: null }, global: globalConfig });
        expect(w.findAll('li')).toHaveLength(3);
        expect(w.text()).toContain('Alex Doe');
        expect(w.text()).toContain('Kim Muster');
    });

    it('emits update:modelValue with the id when an option is selected', async () => {
        const w = mount(AlpMemberPicker, { props: { options, modelValue: null }, global: globalConfig });
        const items = w.findAll('li a');
        await items[1]!.trigger('click'); // Alex Doe
        expect(w.emitted('update:modelValue')).toEqual([['u1']]);
    });

    it('emits update:modelValue with null when unassigned is selected', async () => {
        const w = mount(AlpMemberPicker, { props: { options, modelValue: 'u1' }, global: globalConfig });
        const items = w.findAll('li a');
        await items[0]!.trigger('click'); // Unassigned row
        expect(w.emitted('update:modelValue')).toEqual([[null]]);
    });

    it('renders an <img> for an option with an avatar', () => {
        const w = mount(AlpMemberPicker, { props: { options, modelValue: null }, global: globalConfig });
        expect(w.find('img[src="https://example.test/u1.png"]').exists()).toBe(true);
    });

    it('renders an initials circle (no <img>) for an option without an avatar', () => {
        const w = mount(AlpMemberPicker, { props: { options, modelValue: null }, global: globalConfig });
        const rows = w.findAll('li');
        const kimRow = rows.find((r) => r.text().includes('Kim Muster'))!;
        expect(kimRow.find('img').exists()).toBe(false);
        expect(kimRow.text()).toContain('K');
    });

    it('carries the sensitive blur class on the member-name label (screen-share convention)', () => {
        const w = mount(AlpMemberPicker, { props: { options, modelValue: null }, global: globalConfig });
        const rows = w.findAll('li');
        const alexRow = rows.find((r) => r.text().includes('Alex Doe'))!;
        expect(alexRow.find('span.sensitive').text()).toBe('Alex Doe');
    });
});

describe('AlpMemberFilter', () => {
    const options = [
        { id: 'u1', label: 'Alex Doe', avatar: 'https://example.test/u1.png' },
        { id: 'u2', label: 'Kim Muster' },
        { id: 'u3', label: 'Sam Lee' },
        { id: 'u4', label: 'Jo Novak' }
    ];
    const globalConfig = {
        plugins: [i18n],
        components: { VoltMultiSelect: VoltMultiSelectStub },
        directives: { tooltip: {} }
    };

    it('renders every option in the multiselect', () => {
        const w = mount(AlpMemberFilter, { props: { options, modelValue: [] }, global: globalConfig });
        expect(w.text()).toContain('Alex Doe');
        expect(w.text()).toContain('Kim Muster');
        expect(w.text()).toContain('Sam Lee');
        expect(w.text()).toContain('Jo Novak');
    });

    it('re-emits update:modelValue with the id array when a selection changes', async () => {
        const w = mount(AlpMemberFilter, { props: { options, modelValue: ['u1'] }, global: globalConfig });
        await w.findAll('ul li')[1]!.trigger('click'); // toggle u2 on
        expect(w.emitted('update:modelValue')).toEqual([[['u1', 'u2']]]);
    });

    it('shows up to 3 stacked avatars/initials and a +N marker beyond that', () => {
        const w = mount(AlpMemberFilter, {
            props: { options, modelValue: ['u1', 'u2', 'u3', 'u4'] },
            global: globalConfig
        });
        const valueSlot = w.find('.value-slot');
        expect(valueSlot.findAll('img, span.rounded-full').length).toBeGreaterThanOrEqual(3);
        expect(valueSlot.text()).toContain('+1');
    });

    it('carries the sensitive blur class on the option-row label (screen-share convention)', () => {
        const w = mount(AlpMemberFilter, { props: { options, modelValue: [] }, global: globalConfig });
        const rows = w.findAll('ul li');
        const alexRow = rows.find((r) => r.text().includes('Alex Doe'))!;
        expect(alexRow.find('span.sensitive').text()).toBe('Alex Doe');
    });
});
