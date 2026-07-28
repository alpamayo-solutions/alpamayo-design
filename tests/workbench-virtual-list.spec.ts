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

    it('renders the final row with no gap when scrolled to the end', async () => {
        const { wrapper, viewport } = mountList(120);
        // (items.length - visibleRows) * rowHeight -- the scroll offset that puts the last
        // row exactly at the bottom of the viewport.
        Object.defineProperty(viewport, 'scrollTop', { value: (200 - 5) * 24, configurable: true });
        viewport.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();
        const rendered = wrapper.findAll('.row');
        expect(rendered[rendered.length - 1]!.text()).toBe('row-199');
        // No gap: the rendered rows are a contiguous run ending at the last item.
        const ids = rendered.map((row) => Number(row.text().replace('row-', '')));
        for (let i = 1; i < ids.length; i += 1) {
            expect(ids[i]).toBe(ids[i - 1]! + 1);
        }
    });

    it('keeps rendering every current row when items shrinks past a stale scroll position', async () => {
        const { wrapper, viewport } = mountList(120);
        // Scroll deep into the 200-item list...
        Object.defineProperty(viewport, 'scrollTop', { value: 24 * 166, configurable: true });
        viewport.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.row').length).toBeGreaterThan(0);

        // ...then the parent replaces items with a much shorter list, with no scroll event in
        // between (e.g. the sidebar's element list is replaced wholesale after a save).
        await wrapper.setProps({ items: items.slice(0, 5) });
        await wrapper.vm.$nextTick();

        const rendered = wrapper.findAll('.row');
        expect(rendered).toHaveLength(5);
        expect(rendered[0]!.text()).toBe('row-0');
        expect(rendered[4]!.text()).toBe('row-4');
    });

    it('re-measures via ResizeObserver when the viewport resizes with no scroll event, and disconnects on unmount', async () => {
        // happy-dom's ResizeObserver is a non-functional stub (observe/disconnect are no-ops
        // and no callback ever fires), so a real resize can't be simulated here. Instead this
        // swaps in a fake that records what the component wires up, and invokes the captured
        // callback itself to prove the component reacts to it.
        class FakeResizeObserver {
            static instances: FakeResizeObserver[] = [];
            observedTargets: Element[] = [];
            disconnected = false;
            constructor(public callback: ResizeObserverCallback) {
                FakeResizeObserver.instances.push(this);
            }
            observe(target: Element): void {
                this.observedTargets.push(target);
            }
            unobserve(): void {}
            disconnect(): void {
                this.disconnected = true;
            }
        }

        const OriginalResizeObserver = globalThis.ResizeObserver;
        globalThis.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;

        try {
            const wrapper = mount(VirtualList, {
                props: { items, rowHeight: 24, overscan: 2 },
                slots: {
                    default: `<template #default="{ item }"><span class="row">{{ item.id }}</span></template>`
                },
                attachTo: document.body
            });
            const viewport = wrapper.get('.alp-workbench-virtual-list').element as HTMLElement;
            Object.defineProperty(viewport, 'clientHeight', { value: 120, configurable: true });

            expect(FakeResizeObserver.instances).toHaveLength(1);
            const observer = FakeResizeObserver.instances[0]!;
            expect(observer.observedTargets).toEqual([viewport]);
            expect(wrapper.findAll('.row').length).toBeLessThan(items.length);

            // Simulate the viewport growing with no intervening scroll event -- e.g. a
            // sibling sidebar section collapsing and this section's share of the height
            // growing to fit every row.
            Object.defineProperty(viewport, 'clientHeight', { value: 200 * 24, configurable: true });
            observer.callback([], observer as unknown as ResizeObserver);
            await wrapper.vm.$nextTick();

            expect(wrapper.findAll('.row')).toHaveLength(items.length);

            wrapper.unmount();
            expect(observer.disconnected).toBe(true);
        } finally {
            globalThis.ResizeObserver = OriginalResizeObserver;
        }
    });
});
