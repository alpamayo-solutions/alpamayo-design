<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
    defineProps<{
        page: number;
        pageSize: number;
        totalRecords: number;
        pageSizeOptions?: number[];
    }>(),
    {
        pageSizeOptions: () => [5, 10, 20, 50]
    }
);

const emit = defineEmits<{
    (e: 'page', payload: { page: number; rows: number }): void;
}>();

const { t } = useI18n();

const totalPages = computed(() => Math.ceil(props.totalRecords / props.pageSize));
const showPagination = computed(() => props.totalRecords > 0);
const pageSizeSelectOptions = computed(() =>
    props.pageSizeOptions.map((value) => ({ label: t('design.table.pageSizeOption', { value }), value }))
);
</script>

<template>
    <div v-if="showPagination" class="flex items-center justify-between gap-3 mt-4">
        <VoltSelect
            :modelValue="pageSize"
            :options="pageSizeSelectOptions"
            optionLabel="label"
            optionValue="value"
            class="min-w-32 text-sm"
            @update:modelValue="(rows: number) => emit('page', { page: 0, rows })"
        />

        <div class="flex items-center gap-1">
            <VoltButton
                type="button"
                :disabled="page === 1"
                severity="ghost"
                text
                size="small"
                icon="pi pi-chevron-left"
                class="!h-8 !w-8 !p-0"
                :aria-label="t('design.table.previousPage')"
                @click="emit('page', { page: page - 2, rows: pageSize })"
            />
            <span class="text-sm text-surface-500 px-2 tabular-nums">{{ page }} / {{ totalPages }}</span>
            <VoltButton
                type="button"
                :disabled="page * pageSize >= totalRecords"
                severity="ghost"
                text
                size="small"
                icon="pi pi-chevron-right"
                class="!h-8 !w-8 !p-0"
                :aria-label="t('design.table.nextPage')"
                @click="emit('page', { page: page, rows: pageSize })"
            />
        </div>
    </div>
</template>
