import { defineStory } from './_types';

export default defineStory({
    component: 'AlpTeamMemberCard',
    group: 'Signature',
    title: 'Team Member Card',
    description: 'Team member card with avatar initials, role, and optional badge.',
    variants: [
        {
            name: 'default',
            props: {
                name: 'Chris N.',
                initials: 'CN',
                role: 'Field Engineer'
            }
        },
        {
            name: 'with-badge',
            props: {
                name: 'Alex L.',
                initials: 'AL',
                role: 'Solutions Architect',
                badge: 'Lead',
                badgeSeverity: 'success'
            }
        }
    ],
    snippet: '<AlpTeamMemberCard name="Chris N." initials="CN" role="Field Engineer" />',
    sourcePath: 'components/alp/AlpTeamMemberCard.vue'
});
