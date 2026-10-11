import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import VoltDialog from '../components/volt/Dialog.vue';

async function closeButton(locale?: Record<string, unknown>) {
    const wrapper = mount(VoltDialog, {
        props: { visible: true, header: 'Assign models', closable: true },
        global: {
            plugins: [[PrimeVue, { unstyled: true, ...(locale ? { locale } : {}) }]],
        },
        attachTo: document.body
    });
    await flushPromises();
    // PrimeVue teleports the dialog to <body>.
    const buttons = [...document.body.querySelectorAll('[role="dialog"] button')];
    const label = buttons.length ? (buttons.at(-1)!.getAttribute('aria-label') ?? '') : undefined;
    wrapper.unmount();
    return label;
}

describe('the Volt Dialog close button', () => {
    it("is named from the PrimeVue locale's aria.close", async () => {
        expect(await closeButton({ aria: { close: 'Schließen' } })).toBe('Schließen');
    });

    it('falls back to "Close" when the locale names none', async () => {
        expect(await closeButton({ aria: { search: 'Suchen' } })).toBe('Close');
    });
});
