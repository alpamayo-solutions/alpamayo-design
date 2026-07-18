import { defineStory } from './_types';

export default defineStory({
    component: 'AlpBadgeRow',
    group: 'Components',
    title: 'Badge Row',
    description:
        'Inline row of small severity-colored badges, e.g. for integration/connection status next to an entity name.',
    variants: [
        {
            name: 'mixed-severity',
            props: {
                badges: [
                    { label: 'GitHub', severity: 'success', icon: 'pi pi-github' },
                    { label: 'Sync stale', severity: 'warning' },
                    { label: 'Odoo', severity: 'neutral' }
                ]
            }
        },
        {
            name: 'single-danger',
            props: {
                badges: [{ label: 'Connection failed', severity: 'danger', icon: 'pi pi-times-circle' }]
            }
        },
        {
            name: 'empty',
            props: {
                badges: []
            }
        }
    ],
    snippet: "<AlpBadgeRow :badges=\"[{ label: 'GitHub', severity: 'success', icon: 'pi pi-github' }]\" />",
    sourcePath: 'components/alp/AlpBadgeRow.vue'
});
