import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AlpShareButton from '../components/alp/AlpShareButton.vue';
import en from '../i18n/locales/en/design.json';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

// Minimal functional stubs for the Volt primitives this shell composes —
// enough to drive create/copy/revoke behavior without pulling in PrimeVue's
// overlay/focus-trap machinery. Mirrors tests/alp-quick-create-card.spec.ts.
const VoltButtonStub = {
    props: ['label', 'disabled', 'icon'],
    emits: ['click'],
    template: '<button :disabled="disabled" :data-icon="icon" @click="$emit(\'click\')">{{ label }}</button>'
};
const VoltInputNumberStub = {
    props: ['modelValue', 'min', 'max'],
    emits: ['update:modelValue'],
    template:
        '<input class="ttl-input" type="number" :value="modelValue" :min="min" :max="max" @input="$emit(\'update:modelValue\', Number($event.target.value))" />'
};
const VoltInputTextStub = {
    props: ['modelValue', 'type', 'readonly'],
    emits: ['update:modelValue'],
    template:
        '<input :class="type === \'password\' ? \'password-input\' : \'url-input\'" :value="modelValue" :readonly="readonly" @input="$emit(\'update:modelValue\', $event.target.value)" />'
};
const VoltMessageStub = {
    props: ['severity'],
    template: '<div class="volt-message" :data-severity="severity"><slot /></div>'
};

const globalConfig = {
    plugins: [i18n],
    components: {
        VoltButton: VoltButtonStub,
        VoltInputNumber: VoltInputNumberStub,
        VoltInputText: VoltInputTextStub,
        VoltMessage: VoltMessageStub
    },
    stubs: { teleport: true }
};

describe('AlpShareButton', () => {
    it('opens the popover when the trigger is clicked', async () => {
        const w = mount(AlpShareButton, { global: globalConfig });
        expect(w.find('.ttl-input').exists()).toBe(false);
        await w.find('button').trigger('click');
        expect(w.find('.ttl-input').exists()).toBe(true);
    });

    it('emits create with ttlDays and password when the create button is clicked', async () => {
        const w = mount(AlpShareButton, { global: globalConfig });
        await w.find('button').trigger('click');
        await w.find('.ttl-input').setValue(3);
        await w.find('.password-input').setValue('s3cr3t');
        const createButton = w.findAll('button').find((b) => b.text() === en.design.share.createButton)!;
        await createButton.trigger('click');
        expect(w.emitted('create')).toEqual([[{ ttlDays: 3, password: 's3cr3t' }]]);
    });

    it('disables the trigger button while loading', () => {
        const w = mount(AlpShareButton, { props: { loading: true }, global: globalConfig });
        expect(w.find('button').attributes('disabled')).toBeDefined();
    });

    it('shows the copied confirmation once a link exists and copied is true', () => {
        const w = mount(AlpShareButton, {
            props: { shareUrl: 'https://example.com/s/abc123', copied: true },
            global: globalConfig
        });
        expect(w.text()).toContain(en.design.share.copied);
    });

    it('renders the error line', () => {
        const w = mount(AlpShareButton, { props: { error: 'Share link failed.' }, global: globalConfig });
        expect(w.find('.volt-message').exists()).toBe(true);
        expect(w.text()).toContain('Share link failed.');
    });

    it('clamps the ttl input above maxTtlDays', async () => {
        const w = mount(AlpShareButton, { props: { maxTtlDays: 5 }, global: globalConfig });
        await w.find('button').trigger('click');
        await w.find('.ttl-input').setValue(30);
        const createButton = w.findAll('button').find((b) => b.text() === en.design.share.createButton)!;
        await createButton.trigger('click');
        expect(w.emitted('create')).toEqual([[{ ttlDays: 5, password: '' }]]);
    });
});
