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
