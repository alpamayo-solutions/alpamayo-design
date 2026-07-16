import { defineStory } from './_types';

export default defineStory({
    component: 'VoltAutoComplete',
    group: 'Components',
    title: 'AutoComplete',
    description: 'Typeahead input with a suggestion list, e.g. for searching devices.',
    variants: [
        {
            name: 'default',
            props: {
                placeholder: 'Search devices…',
                suggestions: ['edge-node-01', 'edge-node-02', 'edge-node-07']
            }
        },
        {
            name: 'disabled',
            props: {
                placeholder: 'Search devices…',
                disabled: true
            }
        },
        {
            name: 'invalid',
            props: {
                placeholder: 'Search devices…',
                invalid: true
            }
        }
    ],
    snippet: '<VoltAutoComplete v-model="query" :suggestions="results" placeholder="Search devices…" />',
    sourcePath: 'components/volt/AutoComplete.vue'
});
