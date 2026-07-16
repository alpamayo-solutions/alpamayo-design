import { defineStory } from './_types';

export default defineStory({
    component: 'VoltPassword',
    group: 'Components',
    title: 'Password',
    description: 'Masked password input with optional reveal toggle and strength feedback.',
    variants: [
        {
            name: 'default',
            props: {
                placeholder: 'Password',
                feedback: false
            }
        },
        {
            name: 'toggle-mask',
            props: {
                placeholder: 'Password',
                toggleMask: true,
                feedback: false
            }
        }
    ],
    snippet: '<VoltPassword v-model="password" toggleMask :feedback="false" />',
    sourcePath: 'components/volt/Password.vue'
});
