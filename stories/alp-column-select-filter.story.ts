import { defineStory } from './_types';

export default defineStory({
    component: 'AlpColumnSelectFilter',
    group: 'Components',
    title: 'Column Select Filter',
    description:
        'DataTable column filter dropdown — bound to a PrimeVue #filter slot filterModel/filterCallback pair.',
    variants: [
        {
            name: 'default',
            props: {
                filterModel: { value: null, matchMode: 'equals' },
                filterCallback: () => {},
                options: [
                    { label: 'Online', value: 'online' },
                    { label: 'Offline', value: 'offline' }
                ],
                placeholder: 'All statuses'
            }
        }
    ],
    snippet:
        '<template #filter="{ filterModel, filterCallback }">\n  <AlpColumnSelectFilter :filter-model="filterModel" :filter-callback="filterCallback" :options="options" />\n</template>',
    sourcePath: 'components/alp/AlpColumnSelectFilter.vue'
});
