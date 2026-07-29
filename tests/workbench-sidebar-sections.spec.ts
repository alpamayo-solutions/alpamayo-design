import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SidebarSection from '../layers/workbench/components/SidebarSection.vue';
import SidebarSections from '../layers/workbench/components/SidebarSections.vue';

describe('AlpWorkbenchSidebarSection', () => {
    it('renders a header button whose expanded state drives the chevron', () => {
        const collapsed = mount(SidebarSection, {
            props: { title: 'Unified Namespace', expanded: false }
        });
        const header = collapsed.get('button.alp-workbench-sidebar-section-header');
        expect(header.attributes('aria-expanded')).toBe('false');
        expect(collapsed.find('.pi-chevron-right').exists()).toBe(true);

        const expanded = mount(SidebarSection, {
            props: { title: 'Unified Namespace', expanded: true }
        });
        expect(expanded.get('button.alp-workbench-sidebar-section-header').attributes('aria-expanded')).toBe(
            'true'
        );
        expect(expanded.find('.pi-chevron-down').exists()).toBe(true);
    });

    it('emits update:expanded when the header is clicked', async () => {
        const wrapper = mount(SidebarSection, {
            props: { title: 'Catalogs', expanded: false }
        });
        await wrapper.get('button.alp-workbench-sidebar-section-header').trigger('click');
        expect(wrapper.emitted('update:expanded')).toEqual([[true]]);
    });

    it('renders the body only while expanded', () => {
        const slots = { default: "<p class='body'>rows</p>" };
        expect(
            mount(SidebarSection, { props: { title: 'X', expanded: false }, slots })
                .find('.body')
                .exists()
        ).toBe(false);
        expect(
            mount(SidebarSection, { props: { title: 'X', expanded: true }, slots })
                .find('.body')
                .exists()
        ).toBe(true);
    });

    it('renders badge and actions slots inside the header without nesting them in the toggle button', () => {
        const wrapper = mount(SidebarSection, {
            props: { title: 'Metadata Types', expanded: false },
            slots: {
                badge: "<button class='count'>65</button>",
                actions: "<button class='cog'>cog</button>"
            }
        });
        // A button inside a button is invalid HTML and swallows the inner click.
        expect(
            wrapper.get('button.count').element.closest('button.alp-workbench-sidebar-section-header')
        ).toBeNull();
        expect(
            wrapper.get('button.cog').element.closest('button.alp-workbench-sidebar-section-header')
        ).toBeNull();
    });

    it('labels the section body by its header', () => {
        const wrapper = mount(SidebarSection, {
            props: { title: 'Open Elements', expanded: true, sectionId: 'open-elements' },
            slots: { default: '<p>rows</p>' }
        });
        const headingId = wrapper
            .get('button.alp-workbench-sidebar-section-header span.alp-workbench-sidebar-section-title')
            .attributes('id');
        expect(headingId).toBeTruthy();
        expect(wrapper.get('.alp-workbench-sidebar-section-body').attributes('aria-labelledby')).toBe(
            headingId
        );
    });
});

describe('AlpWorkbenchSidebarSections', () => {
    it('renders its children in order and marks expanded children as growing', () => {
        const wrapper = mount(SidebarSections, {
            slots: {
                default: `
          <div class="alp-workbench-sidebar-section" data-expanded="true">a</div>
          <div class="alp-workbench-sidebar-section" data-expanded="false">b</div>
        `
            }
        });
        const sections = wrapper.findAll('.alp-workbench-sidebar-section');
        expect(sections).toHaveLength(2);
        expect(sections.map((s) => s.attributes('data-expanded'))).toEqual(['true', 'false']);
    });
});
