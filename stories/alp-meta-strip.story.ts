import { defineStory } from './_types';

export default defineStory({
    component: 'AlpMetaStrip',
    group: 'Signature',
    title: 'Meta Strip',
    description: 'Grid of small labelled metadata fields (serial, firmware, location, …).',
    variants: [
        {
            name: 'default',
            props: {
                items: [
                    {
                        label: 'Serial',
                        value: 'SN-04471',
                        mono: true
                    },
                    {
                        label: 'Firmware',
                        value: '2.4.1'
                    },
                    {
                        label: 'Location',
                        value: 'Line 4 — Bay 2',
                        sensitive: true
                    }
                ]
            }
        }
    ],
    snippet: "<AlpMetaStrip :items=\"[{ label: 'Serial', value: 'SN-04471', mono: true }]\" />",
    sourcePath: 'components/alp/AlpMetaStrip.vue'
});
