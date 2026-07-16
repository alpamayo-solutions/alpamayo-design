import { defineStory } from './_types';

export default defineStory({
    component: 'AlpBillingRow',
    group: 'Signature',
    title: 'Billing Row',
    description: 'Line item in a billing list — status pill, name, amount.',
    variants: [
        {
            name: 'paid',
            props: {
                status: 'Paid',
                severity: 'success',
                name: 'Line 4 retrofit — July',
                amount: 'CHF 4,200'
            }
        },
        {
            name: 'pending',
            props: {
                status: 'Pending',
                severity: 'warning',
                name: 'Line 4 retrofit — August',
                amount: 'CHF 3,950'
            }
        },
        {
            name: 'overdue',
            props: {
                status: 'Overdue',
                severity: 'danger',
                name: 'Line 4 retrofit — June',
                amount: 'CHF 4,100'
            }
        }
    ],
    snippet:
        '<AlpBillingRow status="Overdue" severity="danger" name="Line 4 retrofit — June" amount="CHF 4,100" />',
    sourcePath: 'components/alp/AlpBillingRow.vue'
});
