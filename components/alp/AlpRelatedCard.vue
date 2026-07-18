<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    title: string;
    count: number;
    page: number;
    pageSize: number;
    loading?: boolean;
    error?: string;
    emptyText?: string;
}>();

const emit = defineEmits<{
    (e: 'page', value: number): void;
}>();

const { t } = useI18n();

const totalPages = computed(() => Math.max(1, Math.ceil(props.count / props.pageSize)));
const showPagination = computed(() => props.count > props.pageSize);
const rangeStart = computed(() => (props.count === 0 ? 0 : (props.page - 1) * props.pageSize + 1));
const rangeEnd = computed(() => Math.min(props.page * props.pageSize, props.count));
const resolvedEmptyText = computed(() => props.emptyText ?? t('design.related.emptyDefault'));
</script>

<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col"
    >
        <div
            class="px-5 py-3.5 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between gap-3"
        >
            <div class="min-w-0">
                <p class="text-sm font-semibold text-surface-800 dark:text-surface-100">
                    {{ title }}
                    <span class="text-surface-400 font-normal">({{ count }})</span>
                </p>
                <p v-if="showPagination" class="text-xs text-surface-400 tabular-nums">
                    {{ rangeStart }}–{{ rangeEnd }} of {{ count }}
                </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <div
                    v-if="showPagination"
                    class="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 tabular-nums"
                >
                    <VoltButton
                        type="button"
                        severity="ghost"
                        text
                        size="small"
                        icon="pi pi-chevron-left"
                        class="!h-8 !w-8 !p-0"
                        :disabled="page <= 1"
                        :aria-label="t('design.related.previous')"
                        @click="emit('page', page - 1)"
                    />
                    <span>{{ page }} / {{ totalPages }}</span>
                    <VoltButton
                        type="button"
                        severity="ghost"
                        text
                        size="small"
                        icon="pi pi-chevron-right"
                        class="!h-8 !w-8 !p-0"
                        :disabled="page >= totalPages"
                        :aria-label="t('design.related.next')"
                        @click="emit('page', page + 1)"
                    />
                </div>
                <slot name="actions" />
            </div>
        </div>

        <div v-if="error" class="px-5 py-6 text-sm text-danger-600 dark:text-danger-400 flex-1">
            <i class="pi pi-exclamation-triangle mr-2" />{{ error }}
        </div>
        <div v-else-if="loading" class="px-5 py-6 text-sm text-surface-400 flex-1">
            <i class="pi pi-spin pi-spinner mr-2" />{{ t('design.related.loading') }}
        </div>
        <div v-else-if="count === 0" class="px-5 py-8 text-sm text-surface-400 italic text-center flex-1">
            {{ resolvedEmptyText }}
        </div>
        <div v-else class="flex-1">
            <slot />
        </div>
    </div>
</template>
