import { defineStory } from './_types';

// also-covers: VoltTabList, VoltTab, VoltTabPanels, VoltTabPanel
export default defineStory({
    component: 'VoltTabs',
    group: 'Components',
    title: 'Tabs',
    description:
        'Tabbed navigation composed from VoltTabs / VoltTabList / VoltTab / VoltTabPanels / VoltTabPanel.',
    variants: [
        {
            name: 'default',
            props: {
                value: 'overview'
            },
            slots: {
                default:
                    '<div class="text-sm"><p class="font-semibold text-surface-700 mb-1">Tabs are composed from VoltTabList / VoltTab / VoltTabPanels / VoltTabPanel.</p><p class="text-surface-500">See snippet for the real composition.</p></div>'
            }
        }
    ],
    snippet:
        '<VoltTabs value="overview">\n  <VoltTabList>\n    <VoltTab value="overview">Overview</VoltTab>\n    <VoltTab value="logs">Logs</VoltTab>\n  </VoltTabList>\n  <VoltTabPanels>\n    <VoltTabPanel value="overview">Node summary for edge-node-07…</VoltTabPanel>\n    <VoltTabPanel value="logs">Recent log lines…</VoltTabPanel>\n  </VoltTabPanels>\n</VoltTabs>',
    sourcePath: 'components/volt/Tabs.vue'
});
