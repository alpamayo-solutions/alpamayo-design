<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableFilterMeta } from 'primevue/datatable';
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
        emptyMessage: undefined
    }
);

const emit = defineEmits<{
    rowClick: [event: AlpClientTableRowClickEvent];
    'update:filters': [value: DataTableFilterMeta];
}>();

const { t } = useI18n();

const filterModel = computed({
    get: () => props.filters,
    set: (value: DataTableFilterMeta | undefined) => emit('update:filters', value ?? {})
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
        responsiveLayout="scroll"
        class="text-sm"
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
