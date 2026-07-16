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
                    '<VoltTabList><VoltTab value="overview">Overview</VoltTab><VoltTab value="devices">Devices</VoltTab></VoltTabList><VoltTabPanels><VoltTabPanel value="overview">Fleet summary for Line 4 retrofit.</VoltTabPanel><VoltTabPanel value="devices">edge-node-07 status details.</VoltTabPanel></VoltTabPanels>'
            }
        }
    ],
    snippet:
        '<VoltTabs value="overview">\n  <VoltTabList>\n    <VoltTab value="overview">Overview</VoltTab>\n    <VoltTab value="logs">Logs</VoltTab>\n  </VoltTabList>\n  <VoltTabPanels>\n    <VoltTabPanel value="overview">Node summary for edge-node-07…</VoltTabPanel>\n    <VoltTabPanel value="logs">Recent log lines…</VoltTabPanel>\n  </VoltTabPanels>\n</VoltTabs>',
    sourcePath: 'components/volt/Tabs.vue'
});
