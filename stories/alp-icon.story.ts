import { defineStory } from './_types';

// A bare icon takes the page's text colour; the story frame sets none on its dark side.
const INK = 'text-surface-900 dark:text-surface-0';

export default defineStory({
    component: 'AlpIcon',
    group: 'Components',
    title: 'Icon',
    description:
        'Alpamayo icon from an external sprite. Line colour follows currentColor; accent parts use --icon-accent.',
    variants: [
        { name: 'small', props: { name: 'database', class: INK } },
        { name: 'detail', props: { name: 'database', variant: 'detail', size: 48, class: INK } },
        {
            name: 'accent',
            props: { name: 'database', size: 32, class: INK, style: '--icon-accent: var(--secondary-500)' }
        }
    ],
    snippet: '<AlpIcon name="opc-ua" variant="detail" :size="28" />',
    sourcePath: 'components/alp/AlpIcon.vue'
});
