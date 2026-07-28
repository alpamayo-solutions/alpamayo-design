import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import VirtualList from '../layers/workbench/components/VirtualList.vue';

const items = Array.from({ length: 200 }, (_, index) => ({ id: `row-${index}` }));

function mountList(height: number) {
    const wrapper = mount(VirtualList, {
        props: { items, rowHeight: 24, overscan: 2 },
        slots: { default: `<template #default="{ item }"><span class="row">{{ item.id }}</span></template>` },
        attachTo: document.body
    });
    const viewport = wrapper.get('.alp-workbench-virtual-list').element as HTMLElement;
    Object.defineProperty(viewport, 'clientHeight', { value: height, configurable: true });
    return { wrapper, viewport };
}

describe('AlpWorkbenchVirtualList', () => {
    it('renders only the rows that fit the viewport plus overscan', async () => {
        const { wrapper, viewport } = mountList(120);
        viewport.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();
        const rendered = wrapper.findAll('.row');
        expect(rendered.length).toBeGreaterThan(0);
        expect(rendered.length).toBeLessThan(items.length);
        expect(rendered[0]!.text()).toBe('row-0');
    });

    it('reserves the full scroll height so the scrollbar reflects the whole list', () => {
        const { wrapper } = mountList(120);
        const spacer = wrapper.get('.alp-workbench-virtual-list-spacer').element as HTMLElement;
        expect(spacer.style.height).toBe(`${200 * 24}px`);
    });

    it('advances the rendered window as the viewport scrolls', async () => {
        const { wrapper, viewport } = mountList(120);
        Object.defineProperty(viewport, 'scrollTop', { value: 24 * 50, configurable: true });
        viewport.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.row')[0]!.text()).not.toBe('row-0');
        expect(wrapper.text()).toContain('row-50');
    });

    it('renders every row when the list is shorter than the viewport', async () => {
        const wrapper = mount(VirtualList, {
            props: { items: items.slice(0, 3), rowHeight: 24 },
            slots: {
                default: `<template #default="{ item }"><span class="row">{{ item.id }}</span></template>`
            },
            attachTo: document.body
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.row')).toHaveLength(3);
    });
});
