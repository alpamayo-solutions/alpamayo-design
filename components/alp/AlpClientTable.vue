<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableExpandedRows, DataTableFilterMeta } from 'primevue/datatable';
import AlpEmptySection from './AlpEmptySection.vue';

type AlpClientTableRowClickEvent = { data: any; originalEvent?: Event };

const props = withDefaults(
    defineProps<{
        items: unknown[];
        loading?: boolean;
        paginator?: boolean;
        rows?: number;
        dataKey?: string | ((row: unknown) => string);
        rowsPerPageOptions?: number[];
        filters?: DataTableFilterMeta;
        filterDisplay?: 'menu' | 'row';
        globalFilterFields?: string[];
        rowTo?: (row: any) => string | null | undefined;
        rowHover?: boolean;
        emptyIcon?: string;
        emptyMessage?: string;
        expandedRows?: unknown[] | DataTableExpandedRows;
    }>(),
    {
        loading: false,
        paginator: true,
        rows: 10,
        dataKey: 'id',
        rowsPerPageOptions: () => [10, 25, 50],
        filters: undefined,
        filterDisplay: undefined,
        globalFilterFields: undefined,
        rowTo: undefined,
        rowHover: true,
        emptyIcon: 'pi pi-inbox',
        emptyMessage: undefined,
        expandedRows: undefined
    }
);

const emit = defineEmits<{
    rowClick: [event: AlpClientTableRowClickEvent];
    'update:filters': [value: DataTableFilterMeta];
    'update:expandedRows': [value: unknown[] | DataTableExpandedRows];
    rowExpand: [event: AlpClientTableRowClickEvent];
    rowCollapse: [event: AlpClientTableRowClickEvent];
}>();

const { t } = useI18n();

const filterModel = computed({
    get: () => props.filters,
    set: (value: DataTableFilterMeta | undefined) => emit('update:filters', value ?? {})
});

// Row detail belongs inside the table. Without this the caller has to render a
// separate panel below it and track the open row itself.
//
// PrimeVue changes the SHAPE of expandedRows depending on dataKey: with a dataKey
// (our default) it indexes a plain object by that key and ignores arrays entirely,
// so an array of rows silently never expands. Callers shouldn't have to know that
// — accept the natural array form and translate both ways.
const keyField = computed(() => (typeof props.dataKey === 'string' ? props.dataKey : ''));

function rowKey(row: unknown): string {
    return String((row as Record<string, unknown>)?.[keyField.value]);
}

const expandedModel = computed({
    get: () => {
        const value = props.expandedRows;
        if (!keyField.value || !Array.isArray(value)) return value;
        return Object.fromEntries(value.map((row) => [rowKey(row), true]));
    },
    set: (value: unknown[] | DataTableExpandedRows | undefined) => {
        // Hand back the same shape the caller gave us, so v-model stays type-stable.
        // Anything that isn't an explicit object map is treated as array mode.
        const objectMode =
            !!props.expandedRows &&
            !Array.isArray(props.expandedRows) &&
            typeof props.expandedRows === 'object';
        if (!keyField.value || objectMode) {
            emit('update:expandedRows', value ?? []);
            return;
        }
        const keys = new Set(Object.keys(value ?? {}));
        emit(
            'update:expandedRows',
            props.items.filter((row) => keys.has(rowKey(row)))
        );
    }
});

const resolvedEmptyMessage = computed(() => props.emptyMessage ?? t('design.table.emptyMessage'));

function onRowClick(event: AlpClientTableRowClickEvent) {
    emit('rowClick', event);
    const target = props.rowTo?.(event.data);
    if (target) navigateTo(target);
}
</script>

<template>
    <VoltDataTable
        :value="items"
        :loading="loading"
        :paginator="paginator"
        :rows="rows"
        :rowsPerPageOptions="rowsPerPageOptions"
        :dataKey="dataKey"
        v-model:filters="filterModel"
        :filterDisplay="filterDisplay"
        :globalFilterFields="globalFilterFields"
        :rowHover="rowHover"
        v-model:expandedRows="expandedModel"
        responsiveLayout="scroll"
        class="text-sm"
        @row-click="onRowClick"
        @row-expand="emit('rowExpand', $event)"
        @row-collapse="emit('rowCollapse', $event)"
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
        <template v-if="$slots.expansion" #expansion="slotProps">
            <slot name="expansion" v-bind="slotProps" />
        </template>
        <slot />
    </VoltDataTable>
</template>
