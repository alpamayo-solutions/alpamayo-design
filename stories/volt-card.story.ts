import { defineStory } from './_types';

export default defineStory({
    component: 'VoltCard',
    group: 'Components',
    title: 'Card',
    description: 'Generic content container with title/subtitle/content/footer slots.',
    variants: [
        {
            name: 'default',
            slots: {
                title: 'edge-node-07',
                subtitle: 'Line 4 retrofit',
                content: '<p class="text-sm text-surface-600">Last deployment succeeded 2 hours ago.</p>',
                footer: '<span class="text-xs text-surface-400">Updated 2h ago</span>'
            }
        }
    ],
    snippet:
        '<VoltCard>\n  <template #title>edge-node-07</template>\n  <template #content>Last deployment succeeded 2 hours ago.</template>\n</VoltCard>',
    sourcePath: 'components/volt/Card.vue'
});
