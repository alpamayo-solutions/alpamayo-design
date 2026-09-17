import { afterEach, expect, it } from 'vitest';
import { defineComponent, ref } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import SidebarSections from '../layers/workbench/components/SidebarSections.vue';
import SidebarSection from '../layers/workbench/components/SidebarSection.vue';
import VirtualList from '../layers/workbench/components/VirtualList.vue';

afterEach(() => {
    document.body.innerHTML = '';
});

it('navigates real section headers, expanded virtual lists, and category boundaries', async () => {
    const app = defineComponent({
        components: { SidebarSections, SidebarSection, VirtualList },
        setup: () => ({ open: ref(false) }),
        template: `<SidebarSections>
          <SidebarSection title="Catalog" v-model:expanded="open">
            <VirtualList :items="['One','Two']" :row-height="30"><template #default="{item}"><button>{{item}}</button></template></VirtualList>
          </SidebarSection>
          <SidebarSection title="Administration" :expanded="false" />
        </SidebarSections>`
    });
    const w = mount(app, { attachTo: document.body });
    const header = w.get('.alp-workbench-sidebar-section-header');
    await header.trigger('keydown', { key: 'ArrowRight' });
    await flushPromises();
    await header.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toBe('One');
    const key = async (value: string) => {
        document.activeElement!.dispatchEvent(
            new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true })
        );
        await flushPromises();
    };
    await key('ArrowDown');
    expect(document.activeElement?.textContent).toBe('Two');
    await key('ArrowDown');
    expect(document.activeElement?.textContent).toContain('Administration');
    await key('ArrowUp');
    expect(document.activeElement?.textContent).toBe('Two');
    await key('ArrowUp');
    expect(document.activeElement?.textContent).toBe('One');
    await key('ArrowUp');
    expect(document.activeElement).toBe(header.element);
    await key('ArrowLeft');
    expect(header.attributes('aria-expanded')).toBe('false');
    await key('ArrowDown');
    expect(document.activeElement?.textContent).toContain('Administration');
    await key('ArrowUp');
    await key('ArrowRight');
    await key('ArrowRight');
    expect(document.activeElement?.textContent).toBe('One');
    await key('ArrowLeft');
    expect(document.activeElement).toBe(header.element);
    w.unmount();
});

it('keeps secondary actions in the Tab order and out of the sidebar arrow path', async () => {
    const w = mount(
        {
            components: { SidebarSections, SidebarSection },
            template: `<SidebarSections>
          <SidebarSection title="Open editors" :expanded="true">
            <button data-editor>Editor</button><button data-sidebar-action>Close editor</button>
          </SidebarSection>
          <SidebarSection title="Namespace" :expanded="false" />
        </SidebarSections>`
        },
        { attachTo: document.body }
    );
    await w.get('[data-editor]').trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toContain('Namespace');
    await w.findAll('.alp-workbench-sidebar-section-header')[1]!.trigger('keydown', { key: 'ArrowUp' });
    expect(document.activeElement?.textContent).toBe('Editor');
    const close = w.get('[data-sidebar-action]').element as HTMLButtonElement;
    close.focus();
    expect(document.activeElement).toBe(close);
    expect(close.getAttribute('tabindex')).toBeNull();
    w.unmount();
});
