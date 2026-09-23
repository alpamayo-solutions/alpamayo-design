import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import EditorGroup from '../layers/workbench/components/EditorGroup.vue';
import TabStrip from '../layers/workbench/components/TabStrip.vue';

/**
 * A tab can carry its own secondary action, beside its close button.
 *
 * Added because of what a consumer does otherwise: float a tab-scoped control
 * over the tab's CONTENT. In the Workbench that button sat at the top right of
 * the pane and painted over whatever the embedded app drew in that corner —
 * in one case directly over the app's own account menu.
 *
 * The strip knows nothing about what an action does. It renders what it is
 * given and emits the tab id with the action id, so this package never learns
 * what an "app" is and ships no strings: the label arrives translated.
 */

const VoltTabs = { props: ['value'], emits: ['update:value'], template: '<div><slot /></div>' };
const VoltTabList = { template: '<div><slot /></div>' };
const VoltTab = {
    props: ['value'],
    emits: ['click'],
    template: '<button type="button" @click="$emit(\'click\')"><slot /></button>'
};
const VoltButton = {
    props: ['icon', 'ariaLabel'],
    emits: ['click'],
    template: '<button type="button" :aria-label="ariaLabel" @click="$emit(\'click\', $event)"><slot /></button>'
};
const VoltMenu = { props: ['model', 'popup'], template: '<div />' };

const global = {
    components: { VoltTabs, VoltTabList, VoltTab, VoltButton, VoltMenu, AlpWorkbenchTabStrip: TabStrip }
};

const TABS = [
    { id: 'plant', label: 'Plant map' },
    {
        id: 'trace',
        label: 'Traceability',
        actions: [{ id: 'standalone', icon: 'pi pi-external-link', label: 'Open standalone' }]
    }
];

const mountStrip = () => mount(TabStrip, { props: { activeId: 'trace', tabs: TABS }, global });

describe('a tab that carries its own action', () => {
    it('renders the action only on the tab that declares one', () => {
        expect(mountStrip().findAll('[data-tab-action]')).toHaveLength(1);
    });

    it('emits the tab and the action, leaving the meaning to the consumer', async () => {
        const strip = mountStrip();
        await strip.get('[data-tab-action="standalone"]').trigger('click');
        expect(strip.emitted('action')).toEqual([['trace', 'standalone']]);
    });

    it('neither selects nor closes the tab it sits on', async () => {
        // Two things keep this true, and both are asserted: the action is a
        // sibling of the tab control rather than a child of it (the same shape
        // the close button has), and its handler stops propagation anyway.
        // Closing here would be worse than useless — the thing the action acts
        // on would be gone.
        const strip = mountStrip();
        const action = strip.get('[data-tab-action="standalone"]');
        const tab = strip.findAll('[data-testid="workbench-tab"]')[1]!;
        expect(tab.element.contains(action.element)).toBe(false);

        await action.trigger('click');
        expect(strip.emitted('close')).toBeUndefined();
        expect(strip.emitted('select')).toBeUndefined();
    });

    it('gives the action an accessible name and a tooltip', () => {
        const action = mountStrip().get('[data-tab-action="standalone"]');
        expect(action.attributes('aria-label')).toBe('Open standalone');
        expect(action.attributes('title')).toBe('Open standalone');
        expect(action.classes()).toContain('pi-external-link');
    });

    it('leaves a tab without actions exactly as it was', () => {
        // The denominator: every existing consumer passes no actions at all
        // and must keep rendering its close button and nothing else.
        const strip = mount(TabStrip, { props: { tabs: [{ id: 'plant', label: 'Plant map' }] }, global });
        expect(strip.findAll('[data-tab-action]')).toHaveLength(0);
        expect(strip.findAll('.alp-workbench-tab-close')).toHaveLength(1);
    });

    it('reaches the group that owns the strip', async () => {
        // EditorGroup is what a consumer actually mounts; an event the strip
        // emits into a component that drops it would be invisible.
        const group = mount(EditorGroup, { props: { groupId: 'left', activeId: 'trace', tabs: TABS }, global });
        await group.get('[data-tab-action="standalone"]').trigger('click');
        expect(group.emitted('action')).toEqual([['trace', 'standalone']]);
    });
});
