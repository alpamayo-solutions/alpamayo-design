import { defineStory } from './_types';

export default defineStory({
    component: 'VoltBreadcrumb',
    group: 'Components',
    title: 'Breadcrumb',
    description: 'Hierarchical location trail for nested project/device navigation.',
    variants: [
        {
            name: 'default',
            props: {
                home: {
                    icon: 'pi pi-home',
                    url: '/'
                },
                model: [
                    {
                        label: 'Projects'
                    },
                    {
                        label: 'Line 4 retrofit'
                    },
                    {
                        label: 'Deployments'
                    }
                ]
            }
        }
    ],
    snippet:
        "<VoltBreadcrumb :home=\"{ icon: 'pi pi-home', url: '/' }\" :model=\"[{ label: 'Projects' }, { label: 'Line 4 retrofit' }]\" />",
    sourcePath: 'components/volt/Breadcrumb.vue'
});
