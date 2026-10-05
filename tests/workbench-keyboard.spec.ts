import { afterEach, describe, expect, it } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import TabStrip from '../layers/workbench/components/TabStrip.vue';
import VirtualList from '../layers/workbench/components/VirtualList.vue';
import SidebarSection from '../layers/workbench/components/SidebarSection.vue';
import { navigateList } from '../layers/workbench/utils/keyboard';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('Workbench keyboard behavior', () => {
    it('activates tabs once, wraps within the strip, and leaves forward Tab alone', async () => {
        const wrapper = mount(TabStrip, {
            props: {
                activeId: 'a',
                tabs: [
                    { id: 'a', label: 'A' },
                    { id: 'b', label: 'B' }
                ]
            },
            attachTo: document.body
        });
        const tabs = wrapper.findAll('[role="tab"]');
        (tabs[0]!.element as HTMLElement).focus();
        await tabs[0]!.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('select')).toEqual([['b']]);
        expect(document.activeElement).toBe(tabs[1]!.element);
        await tabs[1]!.trigger('keydown', { key: 'Tab', shiftKey: true });
        expect(document.activeElement).toBe(tabs[0]!.element);
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        tabs[0]!.element.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
        await tabs[0]!.trigger('keydown', { key: 'Delete' });
        expect(wrapper.emitted('close')).toEqual([['a']]);
        await wrapper.setProps({ tabs: [{ id: 'a', label: 'A' }] });
        const reverse = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });
        wrapper.get('[role="tab"]').element.dispatchEvent(reverse);
        expect(reverse.defaultPrevented).toBe(false);
        wrapper.unmount();
    });

    it('keeps exactly one tab in the Tab sequence, the first when none is active', async () => {
        const tabs = [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' }
        ];
        const wrapper = mount(TabStrip, { props: { activeId: 'gone', tabs } });
        const reachable = () =>
            wrapper.findAll('[role="tab"]').filter((tab) => (tab.element as HTMLElement).tabIndex === 0);
        expect(reachable().map((tab) => tab.text())).toEqual(['A']);
        await wrapper.setProps({ activeId: 'b' });
        expect(reachable().map((tab) => tab.text())).toEqual(['B']);
        wrapper.unmount();
    });

    it('moves focus across a virtual window and requests another page only at the boundary', async () => {
        const wrapper = mount(VirtualList, {
            props: { items: Array.from({ length: 50 }, (_, i) => i), rowHeight: 24 },
            slots: { default: '<template #default="{ item }"><button>{{ item }}</button></template>' },
            attachTo: document.body
        });
        await wrapper.get('button').trigger('keydown', { key: 'End' });
        await flushPromises();
        expect(document.activeElement?.textContent).toBe('49');
        expect(wrapper.findAll('button').length).toBeLessThan(50);
        document.activeElement!.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
        );
        await nextTick();
        expect(wrapper.emitted('reach-end')).toHaveLength(1);
        document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        await flushPromises();
        expect(document.activeElement?.textContent).toBe('0');
        wrapper.unmount();
    });

    it('does not steal input or nested row-action keys', async () => {
        const wrapper = mount(VirtualList, {
            props: { items: ['a', 'b'], rowHeight: 30 },
            slots: { default: '<button>Open</button><button>Delete</button><input />' },
            attachTo: document.body
        });
        const buttons = wrapper.findAll('button');
        (buttons[1]!.element as HTMLElement).focus();
        await buttons[1]!.trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement).toBe(buttons[1]!.element);
        const input = wrapper.get('input');
        (input.element as HTMLElement).focus();
        await input.trigger('keydown', { key: 'End' });
        expect(document.activeElement).toBe(input.element);
        wrapper.unmount();
    });

    it('expands/collapses sections without toggling on repeated direction keys', async () => {
        const wrapper = mount(SidebarSection, { props: { title: 'Items', expanded: false } });
        await wrapper.get('button').trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('update:expanded')).toEqual([[true]]);
        await wrapper.setProps({ expanded: true });
        await wrapper.get('button').trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('update:expanded')).toHaveLength(1);
        await wrapper.get('button').trigger('keydown', { key: 'ArrowLeft' });
        expect(wrapper.emitted('update:expanded')?.at(-1)).toEqual([false]);
        wrapper.unmount();
    });

    it('skips disabled entries and preserves Shift+Tab in an opted-in list', () => {
        const root = document.createElement('div');
        root.innerHTML = '<button>A</button><button disabled>B</button><button>C</button>';
        root.addEventListener('keydown', (event) => navigateList(event, 'button'));
        document.body.append(root);
        root.querySelector('button')!.focus();
        document.activeElement!.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
        );
        expect(document.activeElement?.textContent).toBe('C');
    });
});
