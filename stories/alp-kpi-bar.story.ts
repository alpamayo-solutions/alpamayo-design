import { defineStory } from './_types';

export default defineStory({
    component: 'AlpKpiBar',
    group: 'Components',
    title: 'KPI Bar',
    description: 'Responsive grid layout shell for a row of AlpKpiCard tiles — no domain-specific props.',
    variants: [
        {
            name: 'default',
            slots: {
                default:
                    '<AlpKpiCard label="Online" value="18" sub="" color-class="text-success-600 dark:text-success-400" /><AlpKpiCard label="Offline" value="2" sub="" color-class="text-danger-600 dark:text-danger-400" /><AlpKpiCard label="Degraded" value="1" sub="" color-class="text-warning-600 dark:text-warning-400" /><AlpKpiCard label="Total" value="21" sub="devices" /><AlpKpiCard label="VPN" value="19 / 21" sub="nodes connected" />'
            }
        }
    ],
    snippet:
        '<AlpKpiBar>\n  <AlpKpiCard label="Online" value="18" sub="" />\n  <AlpKpiCard label="Offline" value="2" sub="" />\n</AlpKpiBar>',
    sourcePath: 'components/alp/AlpKpiBar.vue'
});
