import { defineStory } from './_types';

// also-covers: VoltAccordionContent, VoltAccordionHeader, VoltAccordionPanel
export default defineStory({
    component: 'VoltAccordion',
    group: 'Components',
    title: 'Accordion',
    description:
        'Collapsible panel group composed from VoltAccordion / VoltAccordionPanel / VoltAccordionHeader / VoltAccordionContent.',
    variants: [
        {
            name: 'default',
            props: {
                value: '0'
            },
            slots: {
                default:
                    '<div class="p-2 text-sm"><p class="font-semibold text-surface-700 mb-1">Rollout history</p><p class="text-surface-500">Composed from VoltAccordionPanel / VoltAccordionHeader / VoltAccordionContent — see snippet.</p></div>'
            }
        }
    ],
    snippet:
        '<VoltAccordion value="0">\n  <VoltAccordionPanel value="0">\n    <VoltAccordionHeader>Rollout history</VoltAccordionHeader>\n    <VoltAccordionContent>5 deployments in the last 30 days for edge-node-07.</VoltAccordionContent>\n  </VoltAccordionPanel>\n</VoltAccordion>',
    sourcePath: 'components/volt/Accordion.vue'
});
