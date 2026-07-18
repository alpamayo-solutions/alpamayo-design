<script setup lang="ts">
import type { DataTableFilterMetaData } from 'primevue/datatable';

defineProps<{
    filterModel: DataTableFilterMetaData;
    filterCallback: () => void;
    options: Array<{ label: string; value: string | boolean | number }>;
    placeholder?: string;
}>();
</script>

<template>
    <VoltSelect
        v-model="filterModel.value"
        :options="options"
        optionLabel="label"
        optionValue="value"
        :placeholder="placeholder || 'All'"
        showClear
        class="w-full"
        @update:modelValue="filterCallback"
    />
</template>
