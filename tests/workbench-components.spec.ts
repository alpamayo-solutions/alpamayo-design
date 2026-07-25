import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import ActivityRail from '../layers/workbench/components/ActivityRail.vue';
import BottomPanel from '../layers/workbench/components/BottomPanel.vue';
import ContextMenu from '../layers/workbench/components/ContextMenu.vue';
import EditorGroup from '../layers/workbench/components/EditorGroup.vue';
import EditorSplit from '../layers/workbench/components/EditorSplit.vue';
import IconButton from '../layers/workbench/components/IconButton.vue';
import ResizeHandle from '../layers/workbench/components/ResizeHandle.vue';
import TabStrip from '../layers/workbench/components/TabStrip.vue';

const VoltButton = {
    props: ['icon', 'ariaLabel'],
    emits: ['click'],
    template:
        '<button type="button" :aria-label="ariaLabel || $attrs[\'aria-label\']" @click="$emit(\'click\', $event)"><slot /><i v-if="icon" :class="icon" /></button>'
};
const VoltTabs = {
    props: ['value'],
    emits: ['update:value'],
    template: '<div><slot /></div>'
};
const VoltTabList = { template: '<div><slot /></div>' };
const VoltTab = {
    props: ['value'],
    emits: ['click'],
    template: '<button type="button" @click="$emit(\'click\')"><slot /></button>'
};
const VoltMenu = {
    props: ['model', 'popup'],
    template:
        '<div><button v-for="item in model" :key="item.id" @click="item.command()">{{ item.label }}</button></div>'
};
const global = {
    components: {
        VoltButton,
        VoltTabs,
        VoltTabList,
        VoltTab,
        VoltMenu,
        AlpWorkbenchIconButton: IconButton,
        AlpWorkbenchResizeHandle: ResizeHandle,
        AlpWorkbenchTabStrip: TabStrip
    }
};

describe('workbench components', () => {
    it('emits icon-button clicks through the Volt control', async () => {
        const wrapper = mount(IconButton, {
            props: { label: 'Settings', icon: 'pi pi-cog' },
            global
        });
        await wrapper.get('button').trigger('click');
        expect(wrapper.emitted('click')).toHaveLength(1);
        expect(wrapper.get('button').attributes('aria-label')).toBe('Settings');
    });

    it('emits the selected activity item', async () => {
        const wrapper = mount(ActivityRail, {
            props: {
                activeId: 'core',
                items: [
                    { id: 'core', label: 'PREKIT Core', logomark: true },
                    { id: 'mes', label: 'MES', icon: 'pi pi-box' }
                ]
            },
            global
        });
        await wrapper.get('[aria-label="MES"]').trigger('click');
        expect(wrapper.emitted('select')?.[0]).toEqual(['mes']);
    });

    it('emits tab selection and close separately', async () => {
        const wrapper = mount(TabStrip, {
            props: {
                activeId: 'one',
                tabs: [{ id: 'one', label: 'Fill level', icon: 'pi pi-chart-line', preview: true }]
            },
            global
        });
        await wrapper.get('[data-testid="workbench-tab"]').trigger('click');
        expect(wrapper.emitted('select')?.[0]).toEqual(['one']);
        await wrapper.get('[data-testid="workbench-tab"]').trigger('dblclick');
        expect(wrapper.emitted('pin')?.[0]).toEqual(['one']);
        await wrapper.get('[aria-label="Close Fill level"]').trigger('click');
        expect(wrapper.emitted('close')?.[0]).toEqual(['one']);
    });

    it('keeps dirty tabs keyboard closable while showing the unsaved indicator', async () => {
        const wrapper = mount(TabStrip, {
            props: {
                activeId: 'one',
                tabs: [{ id: 'one', label: 'New alarm', dirty: true }]
            },
            global
        });

        expect(wrapper.find('[aria-label="Unsaved changes"]').exists()).toBe(true);
        const close = wrapper.get('[aria-label="Close New alarm"]');
        const tab = wrapper.get('[data-testid="workbench-tab"]');
        expect(close.element.tagName).toBe('BUTTON');
        expect(tab.element.contains(close.element)).toBe(false);

        await close.trigger('click');
        expect(wrapper.emitted('close')?.[0]).toEqual(['one']);
    });

    it('emits draggable tab placement', async () => {
        const wrapper = mount(TabStrip, {
            props: {
                activeId: 'one',
                draggable: true,
                tabs: [
                    { id: 'one', label: 'Fill level' },
                    { id: 'two', label: 'New alarm' }
                ]
            },
            global
        });
        const tabs = wrapper.findAll('[data-testid="workbench-tab"]');
        await tabs[0]!.trigger('dragstart');
        expect(wrapper.emitted('drag-start')?.[0]?.[0]).toBe('one');
        expect(tabs[0]!.attributes('draggable')).toBe('true');

        await tabs[1]!.trigger('drop');
        expect(wrapper.emitted('drop-tab')?.[0]?.[0]).toBe('two');

        await wrapper.get('.alp-workbench-tab-strip').trigger('drop');
        expect(wrapper.emitted('drop-tab')?.[1]?.[0]).toBeUndefined();

        await tabs[0]!.trigger('dragend');
        expect(wrapper.emitted('drag-end')).toHaveLength(1);
    });

    it('activates a panel mode and exposes the animated content wrapper', async () => {
        const wrapper = mount(BottomPanel, {
            props: { open: false, mode: 'terminal' },
            global
        });
        await wrapper.get('[aria-label="Open Chat"]').trigger('click');
        expect(wrapper.emitted('activate')?.[0]).toEqual(['chat']);
        expect(wrapper.find('[data-testid="workbench-panel-content"]').exists()).toBe(true);
    });

    it('emits keyboard resize deltas from the separator', async () => {
        const wrapper = mount(ResizeHandle, { props: { value: 292 } });
        await wrapper.get('[role="separator"]').trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('resize')?.[0]).toEqual([16]);
    });

    it('uses vertical arrows for a horizontal separator', async () => {
        const wrapper = mount(ResizeHandle, {
            props: { value: 50, orientation: 'horizontal', step: 5 }
        });
        const separator = wrapper.get('[role="separator"]');
        expect(separator.attributes('aria-orientation')).toBe('horizontal');
        await separator.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.emitted('resize')?.[0]).toEqual([5]);
        await separator.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('resize')).toHaveLength(1);
    });

    it('emits group focus, split, tab, and edge-drop intents', async () => {
        const wrapper = mount(EditorGroup, {
            props: {
                groupId: 'group-1',
                tabs: [{ id: 'one', label: 'Fill level' }],
                activeId: 'one',
                focused: true,
                draggable: true,
                dragActive: true
            },
            slots: { default: '<div data-testid="editor-content">Editor</div>' },
            global
        });

        expect(wrapper.find('[role="region"]').exists()).toBe(true);
        await wrapper.get('[role="region"]').trigger('pointerdown');
        expect(wrapper.emitted('focus')?.[0]).toEqual(['group-1']);

        await wrapper.get('[aria-label="Split editor right"]').trigger('click');
        expect(wrapper.emitted('split')?.[0]).toEqual(['horizontal']);
        await wrapper.get('[aria-label="Split editor down"]').trigger('click');
        expect(wrapper.emitted('split')?.[1]).toEqual(['vertical']);

        await wrapper.get('[data-testid="workbench-tab"]').trigger('click');
        expect(wrapper.emitted('select')?.[0]).toEqual(['one']);
        await wrapper.get('[data-testid="workbench-tab"]').trigger('dblclick');
        expect(wrapper.emitted('pin')?.[0]).toEqual(['one']);
        await wrapper.get('[aria-label="Close Fill level"]').trigger('click');
        expect(wrapper.emitted('close')?.[0]).toEqual(['one']);

        await wrapper.get('[data-testid="workbench-tab"]').trigger('dragstart');
        expect(wrapper.emitted('drag-start')?.[0]?.[0]).toBe('one');
        await wrapper.get('[data-edge="right"]').trigger('drop');
        expect(wrapper.emitted('edge-drop')?.[0]?.[0]).toBe('right');
        await wrapper.get('[data-testid="editor-group-content"]').trigger('drop');
        expect(wrapper.emitted('drop-tab')?.[0]?.[0]).toBeUndefined();
    });

    it('uses Material Symbols split-screen glyphs and emits close-group', async () => {
        const wrapper = mount(EditorGroup, {
            props: {
                groupId: 'group-2',
                tabs: [{ id: 'one', label: 'Fill level' }],
                showCloseAction: true
            },
            global
        });

        const splitRight = wrapper.get('[aria-label="Split editor right"]');
        const splitDown = wrapper.get('[aria-label="Split editor down"]');
        expect(splitRight.get('.material-symbols-outlined').text()).toBe('splitscreen_vertical_add');
        expect(splitDown.get('.material-symbols-outlined').text()).toBe('splitscreen_add');

        await wrapper.get('[aria-label="Close editor group"]').trigger('click');
        expect(wrapper.emitted('close-group')).toHaveLength(1);
    });

    it('hides group split and edge-drop actions when disabled', () => {
        const wrapper = mount(EditorGroup, {
            props: {
                groupId: 'group-1',
                tabs: [],
                showSplitActions: false,
                dragActive: false
            },
            global
        });
        expect(wrapper.find('[aria-label="Split editor right"]').exists()).toBe(false);
        expect(wrapper.find('[data-edge]').exists()).toBe(false);
    });

    it('clamps keyboard split ratios and maps handle orientation', async () => {
        const wrapper = mount(EditorSplit, {
            props: { splitId: 'split-1', direction: 'horizontal', ratio: 0.5 },
            slots: { first: '<div>First</div>', second: '<div>Second</div>' },
            global
        });
        expect(wrapper.findComponent(ResizeHandle).exists()).toBe(true);
        const handle = wrapper.getComponent(ResizeHandle);
        expect(handle.props('orientation')).toBe('vertical');

        handle.vm.$emit('resize', 10);
        expect(wrapper.emitted('update:ratio')?.[0]?.[0]).toBeCloseTo(0.55);

        await wrapper.setProps({ ratio: 0.79 });
        handle.vm.$emit('resize', 10);
        expect(wrapper.emitted('update:ratio')?.[1]?.[0]).toBe(0.8);

        const vertical = mount(EditorSplit, {
            props: { splitId: 'split-2', direction: 'vertical', ratio: 0.5 },
            slots: { first: '<div>First</div>', second: '<div>Second</div>' },
            global
        });
        expect(vertical.getComponent(ResizeHandle).props('orientation')).toBe('horizontal');
    });

    it('converts pointer movement into a clamped split ratio', () => {
        const wrapper = mount(EditorSplit, {
            props: { splitId: 'split-1', direction: 'horizontal', ratio: 0.5 },
            slots: { first: '<div>First</div>', second: '<div>Second</div>' },
            global
        });
        expect(wrapper.find('[data-testid="workbench-editor-split"]').exists()).toBe(true);
        vi.spyOn(
            wrapper.get('[data-testid="workbench-editor-split"]').element,
            'getBoundingClientRect'
        ).mockReturnValue({
            width: 1000,
            height: 600,
            top: 0,
            right: 1000,
            bottom: 600,
            left: 0,
            x: 0,
            y: 0,
            toJSON: () => ({})
        });

        wrapper.getComponent(ResizeHandle).vm.$emit('start', {
            clientX: 500,
            clientY: 300
        } as PointerEvent);
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: 900, clientY: 300 }));
        expect(wrapper.emitted('update:ratio')?.[0]?.[0]).toBe(0.8);
        window.dispatchEvent(new PointerEvent('pointerup'));
    });

    it('maps workbench actions into the Volt menu', async () => {
        const wrapper = mount(ContextMenu, {
            props: {
                items: [{ id: 'edit', label: 'Edit', icon: 'pi pi-pencil' }]
            },
            global
        });
        await wrapper.get('button').trigger('click');
        expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'edit', label: 'Edit' });
    });
});
