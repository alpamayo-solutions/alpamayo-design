<script setup lang="ts">
// Generic sort control — a combobox to pick the sort field, plus an asc/desc
// toggle. Generalized the same way as AlpGroupByMenu: the caller supplies
// the field options (including any "manual/unsorted" entry, e.g.
// `{ key: '', label: 'Manual' }`) via `options` instead of a hardcoded
// task-domain field list. Emits only — the caller applies the sort.
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    options: Array<{ key: string; label: string }>;
    modelValue: string;
    dir: 'asc' | 'desc';
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'update:dir', value: 'asc' | 'desc'): void;
}>();

const { t } = useI18n();
</script>

<template>
    <div class="flex items-center gap-1 shrink-0">
        <VoltSelect
            :modelValue="modelValue"
            :options="options"
            optionLabel="label"
            optionValue="key"
            :placeholder="t('design.sort.trigger')"
            :aria-label="t('design.sort.trigger')"
            class="!h-8 !w-28 text-xs"
            @update:modelValue="(value: string) => emit('update:modelValue', value)"
        >
            <template #dropdownicon>
                <i class="pi pi-sort-alt text-xs" />
            </template>
        </VoltSelect>
        <!-- Direction toggle only appears once a sort field is chosen (no dead
             disabled button when the field is empty/manual). -->
        <VoltButton
            v-if="modelValue"
            type="button"
            severity="secondary"
            outlined
            size="small"
            :icon="dir === 'desc' ? 'pi pi-sort-amount-down' : 'pi pi-sort-amount-up'"
            class="!h-8 !w-8 !p-0"
            :aria-label="dir === 'desc' ? t('design.sort.desc') : t('design.sort.asc')"
            v-tooltip.top="dir === 'desc' ? t('design.sort.desc') : t('design.sort.asc')"
            @click="emit('update:dir', dir === 'asc' ? 'desc' : 'asc')"
        />
    </div>
</template>
