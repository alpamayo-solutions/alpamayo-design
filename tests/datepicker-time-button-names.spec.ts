import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import VoltDatePicker from '../components/volt/DatePicker.vue';

async function timeButtonNames(locale?: Record<string, unknown>) {
    const wrapper = mount(VoltDatePicker, {
        props: { inline: true, showTime: true, showSeconds: true, hourFormat: '12' },
        global: {
            plugins: [[PrimeVue, { unstyled: true, ...(locale ? { locale } : {}) }]]
        },
        attachTo: document.body
    });
    await flushPromises();
    const buttons = [...wrapper.element.querySelectorAll('[data-pc-section="timepicker"] button')];
    const names = buttons.map((button) => button.getAttribute('aria-label') ?? '');
    wrapper.unmount();
    return names;
}

describe('the Volt DatePicker time picker buttons', () => {
    it('are named from the PrimeVue locale', async () => {
        const names = await timeButtonNames({
            nextHour: 'Nächste Stunde',
            prevHour: 'Vorherige Stunde',
            nextMinute: 'Nächste Minute',
            prevMinute: 'Vorherige Minute',
            nextSecond: 'Nächste Sekunde',
            prevSecond: 'Vorherige Sekunde',
            am: 'vorm.',
            pm: 'nachm.'
        });
        expect(names).toEqual([
            'Nächste Stunde',
            'Vorherige Stunde',
            'Nächste Minute',
            'Vorherige Minute',
            'Nächste Sekunde',
            'Vorherige Sekunde',
            'vorm.',
            'nachm.'
        ]);
    });

    it("fall back to PrimeVue's English names", async () => {
        const names = await timeButtonNames();
        expect(names).toHaveLength(8);
        expect(names.every((name) => name.length > 0)).toBe(true);
        expect(names).toContain('Next Hour');
        expect(names).toContain('pm');
    });
});
