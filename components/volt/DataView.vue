<template>
    <DataView
        unstyled
        :alwaysShowPaginator="alwaysShowPaginator"
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template
            #paginatorcontainer="{
                page,
                pageCount,
                pageLinks,
                changePageCallback,
                firstPageCallback,
                lastPageCallback,
                prevPageCallback,
                nextPageCallback
            }"
        >
            <div class="flex flex-wrap gap-2 items-center justify-center mt-16">
                <SecondaryButton text rounded @click="firstPageCallback" :disabled="page === 0">
                    <template #icon>
                        <AngleDoubleLeftIcon />
                    </template>
                </SecondaryButton>
                <SecondaryButton text rounded @click="prevPageCallback" :disabled="page === 0">
                    <template #icon>
                        <AngleLeftIcon />
                    </template>
                </SecondaryButton>
                <div class="items-center justify-center gap-2 hidden sm:flex">
                    <SecondaryButton
                        v-for="pageLink of pageLinks"
                        :key="pageLink"
                        :text="page + 1 !== pageLink"
                        rounded
                        @click="() => changePageCallback(pageLink - 1)"
                        :class="['shrink-0 min-w-10 h-10', { 'bg-highlight!': page + 1 === pageLink }]"
                    >
                        {{ pageLink }}
                    </SecondaryButton>
                </div>
                <SecondaryButton text rounded @click="nextPageCallback" :disabled="page === pageCount! - 1">
                    <template #icon>
                        <AngleRightIcon />
                    </template>
                </SecondaryButton>
                <SecondaryButton text rounded @click="lastPageCallback" :disabled="page === pageCount! - 1">
                    <template #icon>
                        <AngleDoubleRightIcon />
                    </template>
                </SecondaryButton>
            </div>
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </DataView>
</template>

<script setup lang="ts">
import AngleDoubleLeftIcon from '@primevue/icons/angledoubleleft';
import AngleDoubleRightIcon from '@primevue/icons/angledoubleright';
import AngleLeftIcon from '@primevue/icons/angleleft';
import AngleRightIcon from '@primevue/icons/angleright';
import DataView, { type DataViewPassThroughOptions, type DataViewProps } from 'primevue/dataview';
import { ref } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';
import auraDataViewPreset from '../../presets/alpamayo/dataview/index.js';

interface Props extends /* @vue-ignore */ DataViewProps {
    /** Hidden on single-page results by default (PrimeVue defaults to true). */
    alwaysShowPaginator?: boolean;
}
withDefaults(defineProps<Props>(), { alwaysShowPaginator: false });

const theme = ref<DataViewPassThroughOptions>(auraDataViewPreset);
</script>
