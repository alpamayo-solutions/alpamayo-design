<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AlpEmptySection from './AlpEmptySection.vue';

type AlpRelatedRowClickEvent = { data: any; originalEvent?: Event };

const props = withDefaults(
    defineProps<{
        items: unknown[];
        dataKey?: string;
        loading?: boolean;
        paginator?: boolean;
        rows?: number;
        rowsPerPageOptions?: number[];
        rowTo?: (row: any) => string | null | undefined;
        rowHover?: boolean;
        emptyIcon?: string;
        emptyMessage?: string;
    }>(),
    {
        dataKey: 'id',
        loading: false,
        paginator: false,
        rows: 10,
        rowsPerPageOptions: () => [10, 25, 50],
        rowTo: undefined,
        rowHover: true,
        emptyIcon: 'pi pi-inbox',
        emptyMessage: undefined
    }
);

const emit = defineEmits<{
    rowClick: [event: AlpRelatedRowClickEvent];
}>();

const { t } = useI18n();

const resolvedEmptyMessage = computed(() => props.emptyMessage ?? t('design.related.emptyMessage'));

function onRowClick(event: AlpRelatedRowClickEvent) {
    emit('rowClick', event);
    const target = props.rowTo?.(event.data);
    if (target) navigateTo(target);
}
</script>

<template>
    <VoltDataTable
        :value="items"
        :dataKey="dataKey"
        :loading="loading"
        :paginator="paginator"
        :rows="rows"
        :rowsPerPageOptions="rowsPerPageOptions"
        :rowHover="rowHover"
        responsiveLayout="scroll"
        class="text-sm"
        @row-click="onRowClick"
    >
        <template v-if="!$slots.empty" #empty>
            <AlpEmptySection :icon="emptyIcon" :message="resolvedEmptyMessage" />
        </template>
        <slot />
    </VoltDataTable>
</template>
