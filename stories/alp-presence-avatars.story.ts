import { defineStory } from './_types';

export default defineStory({
    component: 'AlpPresenceAvatars',
    group: 'Components',
    title: 'Presence Avatars',
    description:
        'Stacked initials avatars for users currently viewing/editing a record, with an editing indicator dot.',
    variants: [
        {
            name: 'viewing',
            props: {
                users: [
                    { sub: 'u1', name: 'Alex Doe', mode: 'view' },
                    { sub: 'u2', name: 'Kim Muster', mode: 'view' }
                ]
            }
        },
        {
            name: 'one-editing',
            props: {
                users: [
                    { sub: 'u1', name: 'Alex Doe', mode: 'edit' },
                    { sub: 'u2', name: 'Kim Muster', mode: 'view' }
                ]
            }
        },
        {
            name: 'empty',
            props: {
                users: []
            }
        }
    ],
    snippet: '<AlpPresenceAvatars :users="presentUsers" />',
    sourcePath: 'components/alp/AlpPresenceAvatars.vue'
});
