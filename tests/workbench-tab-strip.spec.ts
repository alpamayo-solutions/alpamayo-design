import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import EditorGroup from '../layers/workbench/components/EditorGroup.vue';
import IconButton from '../layers/workbench/components/IconButton.vue';
import TabStrip from '../layers/workbench/components/TabStrip.vue';

/**
 * What every consumer of the tab strip needs and none should rebuild: its
 * accessible names in the consumer's language, focus that follows the arrow
 * keys along the strip, and an active tab that is never left past an edge.
 */

const VoltButton = {
    props: ['icon', 'ariaLabel'],
    emits: ['click'],
    template:
        '<button type="button" :aria-label="ariaLabel || $attrs[\'aria-label\']" @click="$emit(\'click\', $event)"><slot /></button>'
};
const global = {
    components: { VoltButton, AlpWorkbenchIconButton: IconButton, AlpWorkbenchTabStrip: TabStrip }
};

const TABS = [
    { id: 'a', label: 'Fill level' },
    { id: 'b', label: 'New alarm', dirty: true },
    { id: 'c', label: 'Line 3' },
    { id: 'd', label: 'Shift report' }
];

/** The accessible names of everything in the wrapper that carries one. */
const names = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('[aria-label]').map((element) => element.attributes('aria-label'));

afterEach(() => {
    document.body.innerHTML = '';
});

describe('tab strip names', () => {
    it('names the unsaved marker and the close buttons in English by default', () => {
        const strip = mount(TabStrip, { props: { activeId: 'a', tabs: TABS.slice(0, 2) }, global });
        expect(names(strip)).toEqual(['Close Fill level', 'Unsaved changes', 'Close New alarm']);
    });

    it('takes both names from the consumer', () => {
        const strip = mount(TabStrip, {
            props: {
                activeId: 'a',
                tabs: TABS.slice(0, 2),
                dirtyLabel: 'Ungespeicherte Änderungen',
                closeLabel: (tabLabel: string) => `${tabLabel} schliessen`
            },
            global
        });
        expect(names(strip)).toEqual([
            'Fill level schliessen',
            'Ungespeicherte Änderungen',
            'New alarm schliessen'
        ]);
    });

    it('names an editor group in English by default', () => {
        const group = mount(EditorGroup, {
            props: { groupId: 'g', activeId: 'a', tabs: TABS.slice(0, 2), showCloseAction: true },
            global
        });
        expect(names(group)).toEqual([
            'Editor group',
            'Editor group',
            'Close Fill level',
            'Unsaved changes',
            'Close New alarm',
            'Split editor right',
            'Split editor down',
            'Close editor group'
        ]);
    });

    it('passes the consumer names through an editor group, its own buttons included', () => {
        const group = mount(EditorGroup, {
            props: {
                groupId: 'g',
                activeId: 'a',
                tabs: TABS.slice(0, 2),
                showCloseAction: true,
                label: 'Editorgruppe',
                dirtyLabel: 'Ungespeicherte Änderungen',
                closeTabLabel: (tabLabel: string) => `${tabLabel} schliessen`,
                splitRightLabel: 'Editor nach rechts teilen',
                splitDownLabel: 'Editor nach unten teilen',
                closeGroupLabel: 'Editorgruppe schliessen'
            },
            global
        });
        expect(names(group)).toEqual([
            'Editorgruppe',
            'Editorgruppe',
            'Fill level schliessen',
            'Ungespeicherte Änderungen',
            'New alarm schliessen',
            'Editor nach rechts teilen',
            'Editor nach unten teilen',
            'Editorgruppe schliessen'
        ]);
    });
});

describe('tab strip keyboard focus', () => {
    /** A strip whose consumer activates what the strip selects, as a real one does. */
    function mountControlled(activeId: string) {
        const wrapper = mount(TabStrip, {
            props: {
                activeId,
                tabs: TABS,
                onSelect: (id: string) => void wrapper.setProps({ activeId: id })
            },
            global,
            attachTo: document.body
        });
        const press = async (key: string) => {
            await (document.activeElement as HTMLElement).dispatchEvent(
                new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
            );
            await nextTick();
        };
        const focused = () => document.activeElement?.textContent?.trim();
        const inTabSequence = () =>
            wrapper
                .findAll('[role="tab"]')
                .filter((tab) => (tab.element as HTMLElement).tabIndex === 0)
                .map((tab) => tab.text());
        (
            wrapper.findAll('[role="tab"]')[TABS.findIndex((tab) => tab.id === activeId)]!
                .element as HTMLElement
        ).focus();
        return { wrapper, press, focused, inTabSequence };
    }

    it('moves focus one tab per arrow key and wraps at both ends', async () => {
        const { press, focused, wrapper } = mountControlled('a');
        expect(focused()).toBe('Fill level');
        await press('ArrowRight');
        expect(focused()).toBe('New alarm');
        await press('ArrowRight');
        expect(focused()).toBe('Line 3');
        await press('ArrowLeft');
        expect(focused()).toBe('New alarm');
        await press('ArrowLeft');
        await press('ArrowLeft');
        expect(focused()).toBe('Shift report');
        await press('ArrowRight');
        expect(focused()).toBe('Fill level');
        wrapper.unmount();
    });

    it('jumps to the first and last tab on Home and End', async () => {
        const { press, focused, wrapper } = mountControlled('b');
        await press('End');
        expect(focused()).toBe('Shift report');
        await press('Home');
        expect(focused()).toBe('Fill level');
        wrapper.unmount();
    });

    it('keeps the focused tab as the only one in the Tab sequence', async () => {
        const { press, inTabSequence, wrapper } = mountControlled('a');
        expect(inTabSequence()).toEqual(['Fill level']);
        await press('End');
        expect(inTabSequence()).toEqual(['Shift report']);
        wrapper.unmount();
    });

    it('leaves focus where it is for a key the strip does not own', async () => {
        const { press, focused, wrapper } = mountControlled('b');
        await press('ArrowDown');
        await press('a');
        expect(focused()).toBe('New alarm');
        expect(wrapper.emitted('select')).toBeUndefined();
        wrapper.unmount();
    });
});

describe('tab strip keeps its active tab in sight', () => {
    /** The tab label of every element asked to scroll into view, in order. */
    let revealed: string[];
    const original = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');

    beforeEach(() => {
        revealed = [];
        Object.defineProperty(Element.prototype, 'scrollIntoView', {
            configurable: true,
            value: vi.fn(function (this: Element) {
                revealed.push(this.querySelector('[role="tab"]')?.textContent?.trim() ?? '');
            })
        });
    });
    afterEach(() => {
        if (original) Object.defineProperty(Element.prototype, 'scrollIntoView', original);
        else delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView;
    });

    it('reveals the active tab when the strip appears', () => {
        mount(TabStrip, { props: { activeId: 'd', tabs: TABS }, global });
        expect(revealed).toEqual(['Shift report']);
    });

    it('reveals the newly active tab when the consumer activates another one', async () => {
        const strip = mount(TabStrip, { props: { activeId: 'a', tabs: TABS }, global });
        revealed.length = 0;
        await strip.setProps({ activeId: 'c' });
        await nextTick();
        expect(revealed).toEqual(['Line 3']);
    });

    it('reveals a tab that is opened and activated in the same update', async () => {
        const strip = mount(TabStrip, { props: { activeId: 'a', tabs: TABS }, global });
        revealed.length = 0;
        await strip.setProps({ activeId: 'e', tabs: [...TABS, { id: 'e', label: 'Batch 12' }] });
        await nextTick();
        expect(revealed).toEqual(['Batch 12']);
    });

    it('scrolls nothing when the tabs change but the active one does not', async () => {
        const strip = mount(TabStrip, { props: { activeId: 'a', tabs: TABS }, global });
        expect(revealed).toEqual(['Fill level']);
        revealed.length = 0;
        await strip.setProps({ tabs: [...TABS, { id: 'e', label: 'Batch 12' }] });
        await nextTick();
        expect(revealed).toEqual([]);
    });

    it('scrolls nothing when no tab is active', () => {
        mount(TabStrip, { props: { activeId: 'gone', tabs: TABS }, global });
        expect(revealed).toEqual([]);
    });
});
