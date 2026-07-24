import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchActivityRail',
    group: 'Components',
    title: 'Workbench Activity Rail',
    description: 'Narrow application switcher with a neutral, consumer-supplied logomark mask.',
    variants: [
        {
            name: 'applications',
            props: {
                activeId: 'core',
                items: [
                    { id: 'core', label: 'PREKIT Core', logomark: true },
                    { id: 'mes', label: 'MES', icon: 'pi pi-box' }
                ]
            }
        }
    ],
    snippet: '<AlpWorkbenchActivityRail :items="apps" active-id="core" />',
    sourcePath: 'layers/workbench/components/ActivityRail.vue'
});
