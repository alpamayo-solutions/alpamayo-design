import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AlpStatusDot from '../components/alp/AlpStatusDot.vue';
import AlpStatusPill from '../components/alp/AlpStatusPill.vue';
import AlpMetricBar from '../components/alp/AlpMetricBar.vue';
import AlpEmptySection from '../components/alp/AlpEmptySection.vue';

describe('AlpStatusDot status mapping', () => {
    it('maps online to success and animates', () => {
        const w = mount(AlpStatusDot, { props: { status: 'online' } });
        expect(w.html()).toContain('bg-success-500');
        expect(w.html()).toContain('animate-ping');
    });
    it('maps offline to danger without ping', () => {
        const w = mount(AlpStatusDot, { props: { status: 'offline' } });
        expect(w.html()).toContain('bg-danger-500');
        expect(w.html()).not.toContain('animate-ping');
    });
    it('keeps severity API working', () => {
        const w = mount(AlpStatusDot, { props: { severity: 'warning' } });
        expect(w.html()).toContain('bg-warning-400');
    });
});

describe('AlpStatusPill status mapping', () => {
    it('maps deployed to success and humanizes label', () => {
        const w = mount(AlpStatusPill, { props: { status: 'deployed' } });
        expect(w.html()).toContain('bg-success-100');
        expect(w.text()).toBe('deployed');
    });
    it('humanizes underscores', () => {
        const w = mount(AlpStatusPill, { props: { status: 'on_hold' } });
        expect(w.text()).toBe('on hold');
        expect(w.html()).toContain('bg-warning-100');
    });
    it('unknown status falls back to neutral', () => {
        const w = mount(AlpStatusPill, { props: { status: 'weird_state' } });
        expect(w.html()).toContain('bg-surface-100');
    });
});

describe('AlpMetricBar', () => {
    it('block variant shows label and value', () => {
        const w = mount(AlpMetricBar, { props: { label: 'CPU', value: 42, barColor: 'bg-primary-500' } });
        expect(w.text()).toContain('CPU');
        expect(w.text()).toContain('42%');
    });
    it('inline variant auto-colors by threshold', () => {
        const w = mount(AlpMetricBar, { props: { value: 95, variant: 'inline', autoColor: true } });
        expect(w.html()).toContain('bg-danger-500');
    });
    it('inline variant renders em dash for null', () => {
        const w = mount(AlpMetricBar, { props: { value: null, variant: 'inline' } });
        expect(w.text()).toContain('—');
    });
    it('invertThreshold treats low as bad', () => {
        const w = mount(AlpMetricBar, {
            props: { value: 5, variant: 'inline', autoColor: true, invertThreshold: true }
        });
        expect(w.html()).toContain('bg-danger-500');
    });
});

describe('AlpEmptySection', () => {
    it('renders message and severity icon color', () => {
        const w = mount(AlpEmptySection, {
            props: { message: 'No deployments yet', icon: 'pi pi-inbox', severity: 'info' },
            global: { stubs: { NuxtLink: true } }
        });
        expect(w.text()).toContain('No deployments yet');
        expect(w.html()).toContain('text-info-500');
    });
});
