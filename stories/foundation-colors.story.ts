import { defineStory } from './_types';

export default defineStory({
    component: 'AlpColorScale',
    group: 'Foundations',
    title: 'Color Scales',
    description: 'Brand token scales 50–950: blue primary, orange secondary, neutral surface.',
    variants: [
        {
            name: 'primary',
            props: {
                label: 'Primary',
                varPrefix: 'primary',
                steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
            }
        },
        {
            name: 'secondary',
            props: {
                label: 'Secondary',
                varPrefix: 'secondary',
                steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
            }
        },
        {
            name: 'surface',
            props: {
                label: 'Surface',
                varPrefix: 'surface',
                steps: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
                withBorder: true
            }
        }
    ],
    snippet: '/* tokens */ var(--primary-500) · bg-primary-500 · text-secondary-500',
    sourcePath: 'assets/css/tokens.css'
});
