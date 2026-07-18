import { defineStory } from './_types';

export default defineStory({
    component: 'AlpEditConflictBanner',
    group: 'Components',
    title: 'Edit Conflict Banner',
    description: 'Warning banner shown when another user is already editing the same record.',
    variants: [
        {
            name: 'no-conflict',
            props: {
                users: []
            }
        },
        {
            name: 'one-editor',
            props: {
                users: [{ sub: 'u1', name: 'Alex Doe', mode: 'edit' }]
            }
        },
        {
            name: 'multiple-editors',
            props: {
                users: [
                    { sub: 'u1', name: 'Alex Doe', mode: 'edit' },
                    { sub: 'u2', name: 'Kim Muster', mode: 'edit' }
                ]
            }
        }
    ],
    snippet: '<AlpEditConflictBanner :users="editingUsers" />',
    sourcePath: 'components/alp/AlpEditConflictBanner.vue'
});
