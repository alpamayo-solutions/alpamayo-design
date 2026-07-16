<template>
    <DataTable
        ref="el"
        unstyled
        :alwaysShowPaginator="alwaysShowPaginator"
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #paginatorcontainer="slotProps">
            <div class="flex flex-wrap gap-2 items-center justify-between w-full">
                <select
                    v-if="rowsPerPageOptions && rowsPerPageOptions.length"
                    :value="slotProps.rows"
                    class="text-sm border border-surface-200 dark:border-surface-600 rounded-md px-2 py-1.5 bg-white dark:bg-surface-800 !text-surface-700 dark:!text-surface-200"
                    @change="
                        (slotProps as any).rowsChangeCallback(
                            Number(($event.target as HTMLSelectElement).value)
                        )
                    "
                >
                    <option v-for="opt in rowsPerPageOptions" :key="opt" :value="opt">
                        {{ opt }} / page
                    </option>
                </select>
                <div v-else />
                <div class="flex flex-wrap gap-2 items-center justify-center">
                    <SecondaryButton
                        text
                        rounded
                        @click="slotProps.firstPageCallback"
                        :disabled="slotProps.page === 0"
                    >
                        <template #icon>
                            <AngleDoubleLeftIcon />
                        </template>
                    </SecondaryButton>
                    <SecondaryButton
                        text
                        rounded
                        @click="slotProps.prevPageCallback"
                        :disabled="slotProps.page === 0"
                    >
                        <template #icon>
                            <AngleLeftIcon />
                        </template>
                    </SecondaryButton>
                    <div class="items-center justify-center gap-2 hidden sm:flex">
                        <SecondaryButton
                            v-for="pageLink of slotProps.pageLinks"
                            :key="pageLink"
                            :text="slotProps.page + 1 !== pageLink"
                            rounded
                            @click="() => slotProps.changePageCallback(pageLink - 1)"
                            :class="[
                                'shrink-0 min-w-10 h-10',
                                slotProps.page + 1 === pageLink ? '!bg-primary-500 !text-white' : ''
                            ]"
                        >
                            {{ pageLink }}
                        </SecondaryButton>
                    </div>
                    <SecondaryButton
                        text
                        rounded
                        @click="slotProps.nextPageCallback"
                        :disabled="slotProps.page === slotProps.pageCount! - 1"
                    >
                        <template #icon>
                            <AngleRightIcon />
                        </template>
                    </SecondaryButton>
                    <SecondaryButton
                        text
                        rounded
                        @click="slotProps.lastPageCallback"
                        :disabled="slotProps.page === slotProps.pageCount! - 1"
                    >
                        <template #icon>
                            <AngleDoubleRightIcon />
                        </template>
                    </SecondaryButton>
                </div>
            </div>
        </template>
        <template #loadingicon>
            <SpinnerIcon class="animate-spin text-[2rem] w-8 h-8" />
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </DataTable>
</template>

<script setup lang="ts">
import AngleDoubleLeftIcon from '@primevue/icons/angledoubleleft';
import AngleDoubleRightIcon from '@primevue/icons/angledoubleright';
import AngleLeftIcon from '@primevue/icons/angleleft';
import AngleRightIcon from '@primevue/icons/angleright';
import SpinnerIcon from '@primevue/icons/spinner';
import DataTable, { type DataTablePassThroughOptions, type DataTableProps } from 'primevue/datatable';
import { ref } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';
import auraDataTablePreset from '../../presets/alpamayo/datatable/index.js';

interface Props extends /* @vue-ignore */ DataTableProps {
    rowsPerPageOptions?: number[];
    /** Hidden on single-page results by default (PrimeVue defaults to true). */
    alwaysShowPaginator?: boolean;
}
withDefaults(defineProps<Props>(), { alwaysShowPaginator: false });

const theme = ref<DataTablePassThroughOptions>(auraDataTablePreset);

const el = ref();
defineExpose({
    exportCSV: (...args: any[]) => el.value?.exportCSV?.(...args)
});
</script>
