import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import VoltDatePicker from '../components/volt/DatePicker.vue';

function mountPicker(locale?: Record<string, unknown>) {
    return mount(VoltDatePicker, {
        props: { inline: true },
        global: {
            plugins: [[PrimeVue, { unstyled: true, ...(locale ? { locale } : {}) }]]
        },
        attachTo: document.body
    });
}

function navNames(element: Element) {
    const header = element.querySelector('[data-pc-section="header"]');
    const buttons = [...(header?.children ?? [])].filter((child) => child.tagName === 'BUTTON');
    return buttons.map((button) => button.getAttribute('aria-label') ?? '');
}

describe('the Volt DatePicker previous/next buttons', () => {
    it('are named after the view on screen: month, then year, then decade', async () => {
        const wrapper = mountPicker({
            prevMonth: 'Vorheriger Monat',
            nextMonth: 'Nächster Monat',
            prevYear: 'Vorheriges Jahr',
            nextYear: 'Nächstes Jahr',
            prevDecade: 'Vorheriges Jahrzehnt',
            nextDecade: 'Nächstes Jahrzehnt'
        });
        await flushPromises();
        expect(navNames(wrapper.element)).toEqual(['Vorheriger Monat', 'Nächster Monat']);

        await wrapper.find('[data-pc-section="selectmonth"]').trigger('click');
        await flushPromises();
        expect(navNames(wrapper.element)).toEqual(['Vorheriges Jahr', 'Nächstes Jahr']);

        await wrapper.find('[data-pc-section="selectyear"]').trigger('click');
        await flushPromises();
        expect(navNames(wrapper.element)).toEqual(['Vorheriges Jahrzehnt', 'Nächstes Jahrzehnt']);
        wrapper.unmount();
    });

    it("fall back to PrimeVue's English names", async () => {
        const wrapper = mountPicker();
        await flushPromises();
        expect(navNames(wrapper.element)).toEqual(['Previous Month', 'Next Month']);
        wrapper.unmount();
    });
});
