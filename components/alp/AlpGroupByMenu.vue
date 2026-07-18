<script setup lang="ts">
// Generic group-by control — a single-select combobox. Generalized on the
// move: the source hardcoded a task-board-specific dimension list (status /
// assignee / priority / tags / due date / type); here the caller supplies
// its own option set via `options`, so this component carries no
// caller-domain vocabulary. Emits only — the caller owns the grouped state.
import { useI18n } from 'vue-i18n';

defineProps<{
    options: Array<{ key: string; label: string }>;
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const { t } = useI18n();
</script>

<template>
    <VoltSelect
        :modelValue="modelValue"
        :options="options"
        optionLabel="label"
        optionValue="key"
        :aria-label="t('design.groupBy.trigger')"
        v-tooltip.top="t('design.groupBy.trigger')"
        class="!h-8 min-w-[11rem] text-xs shrink-0"
        @update:modelValue="(value: string) => emit('update:modelValue', value)"
    />
</template>
