import { defineStory } from './_types';

export default defineStory({
    component: null,
    group: 'Foundations',
    title: 'Typography',
    description:
        'Poppins is the brand typeface, loaded as static weights 100–900 (incl. italics) plus the alp-icons and material-symbols icon fonts. Headings use semibold/bold; body copy uses regular/medium.',
    variants: [
        {
            name: 'weights'
        },
        {
            name: 'icon-fonts'
        }
    ],
    snippet:
        "@import '../fonts/poppins/index.css';\n.heading { font-family: 'Poppins', sans-serif; font-weight: 600; }",
    sourcePath: 'assets/fonts/poppins/index.css'
});
