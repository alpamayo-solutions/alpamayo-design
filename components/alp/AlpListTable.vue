<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableFilterMeta, DataTableStateEvent } from 'primevue/datatable';
import AlpEmptySection from './AlpEmptySection.vue';

type AlpListTableRowClickEvent = { data: any; originalEvent?: Event };

const props = withDefaults(
    defineProps<{
        items: unknown[];
        lazy?: boolean;
        loading?: boolean;
        rows: number;
        totalRecords: number;
        first: number;
        sortField?: string;
        sortOrder?: number;
        filters?: DataTableFilterMeta;
        filterDisplay?: 'menu' | 'row';
        globalFilterFields?: string[];
        stateStorage?: 'session' | 'local';
        stateKey?: string;
        dataKey?: string;
        rowsPerPageOptions?: number[];
        rowTo?: (row: any) => string | null | undefined;
        emptyIcon?: string;
        emptyMessage?: string;
    }>(),
    {
        lazy: true,
        loading: false,
        sortField: '',
        sortOrder: 1,
        filters: undefined,
        filterDisplay: undefined,
        globalFilterFields: undefined,
        stateStorage: undefined,
        stateKey: undefined,
        dataKey: 'id',
        rowsPerPageOptions: () => [10, 25, 50, 100],
        rowTo: undefined,
        emptyIcon: 'pi pi-inbox',
        emptyMessage: undefined
    }
);

const emit = defineEmits<{
    page: [event: { page: number; rows: number }];
    sort: [event: { sortField: string; sortOrder: number }];
    filter: [event: { filters: DataTableFilterMeta }];
    'update:filters': [value: DataTableFilterMeta];
    'state-restore': [event: DataTableStateEvent];
    'state-save': [event: DataTableStateEvent];
    rowClick: [event: AlpListTableRowClickEvent];
}>();

const { t } = useI18n();

const filterModel = computed({
    get: () => props.filters,
    set: (value: DataTableFilterMeta | undefined) => emit('update:filters', value ?? {})
});

const resolvedEmptyMessage = computed(() => props.emptyMessage ?? t('design.table.emptyMessage'));

function onRowClick(event: AlpListTableRowClickEvent) {
    emit('rowClick', event);
    const target = props.rowTo?.(event.data);
    if (target) navigateTo(target);
}
</script>

<template>
    <VoltDataTable
        :value="items"
        :loading="loading"
        :lazy="lazy"
        paginator
        :alwaysShowPaginator="false"
        :rows="rows"
        :totalRecords="totalRecords"
        :first="first"
        :sortField="sortField"
        :sortOrder="sortOrder"
        v-model:filters="filterModel"
        :filterDisplay="filterDisplay"
        :globalFilterFields="globalFilterFields"
        :stateStorage="stateStorage"
        :stateKey="stateKey"
        removableSort
        :dataKey="dataKey"
        scrollable
        scrollHeight="flex"
        rowHover
        :rowsPerPageOptions="rowsPerPageOptions"
        @page="$emit('page', $event)"
        @sort="$emit('sort', $event)"
        @filter="$emit('filter', $event)"
        @update:filters="$emit('update:filters', $event)"
        @state-restore="$emit('state-restore', $event)"
        @state-save="$emit('state-save', $event)"
        @row-click="onRowClick"
    >
        <template v-if="$slots.header" #header>
            <slot name="header" />
        </template>
        <template #empty>
            <slot v-if="$slots.empty" name="empty" />
            <AlpEmptySection v-else :icon="emptyIcon" :message="resolvedEmptyMessage" />
        </template>
        <template v-if="$slots.footer" #footer>
            <slot name="footer" />
        </template>
        <slot />
    </VoltDataTable>
</template>
