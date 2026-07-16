import { defineStory } from './_types';

export default defineStory({
    component: 'VoltMegaMenu',
    group: 'Components',
    title: 'MegaMenu',
    description: 'Multi-column top-level navigation menu.',
    variants: [
        {
            name: 'default',
            props: {
                model: [
                    {
                        label: 'Fleet',
                        items: [
                            [
                                {
                                    label: 'Devices',
                                    items: [
                                        {
                                            label: 'edge-node-01'
                                        },
                                        {
                                            label: 'edge-node-07'
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        label: 'Deployments'
                    },
                    {
                        label: 'Reports'
                    }
                ]
            }
        }
    ],
    snippet: '<VoltMegaMenu :model="menuItems" />',
    sourcePath: 'components/volt/MegaMenu.vue'
});
