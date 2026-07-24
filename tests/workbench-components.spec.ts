import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ActivityRail from '../layers/workbench/components/ActivityRail.vue';
import BottomPanel from '../layers/workbench/components/BottomPanel.vue';
import ContextMenu from '../layers/workbench/components/ContextMenu.vue';
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
        AlpWorkbenchIconButton: IconButton
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
        await wrapper.get('[aria-label="Close Fill level"]').trigger('click');
        expect(wrapper.emitted('close')?.[0]).toEqual(['one']);
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
