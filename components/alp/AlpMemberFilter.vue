<script setup lang="ts">
// Multi-select member filter (board-toolbar style): a combobox dropdown of
// assignable members whose selected value renders as stacked avatars/initials
// only (never names), at a locked width, plus a `+N` overflow marker.
// Presentational shell: takes plain `MemberOption[]` — no app member type,
// no avatar-URL construction (the wrapper builds those).
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MemberOption } from './AlpMemberPicker.vue';

const props = defineProps<{
    options: MemberOption[];
    modelValue: string[];
    placeholder?: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [ids: string[]] }>();

const { t } = useI18n();

function initial(label: string): string {
    return (label || '?').charAt(0).toUpperCase();
}

function onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
}

const optionById = computed(() => new Map(props.options.map((o) => [o.id, o])));
// Up to 3 stacked avatars for the selected value, plus a "+N" overflow marker.
const selectedShown = computed(
    () =>
        props.modelValue
            .map((id) => optionById.value.get(id))
            .filter(Boolean)
            .slice(0, 3) as MemberOption[]
);
const selectedExtra = computed(() => Math.max(0, props.modelValue.length - 3));

const label = computed(() => props.placeholder ?? t('design.member.filterLabel'));
</script>

<template>
    <VoltMultiSelect
        :modelValue="modelValue"
        :options="options"
        optionLabel="label"
        optionValue="id"
        filter
        :placeholder="label"
        :emptyMessage="t('design.member.filterEmpty')"
        :emptyFilterMessage="t('design.member.filterEmpty')"
        :aria-label="label"
        v-tooltip.top="label"
        class="shrink-0 !h-8 !w-32 text-xs"
        @update:modelValue="emit('update:modelValue', $event)"
    >
        <!-- Selected value: avatars/initials only (locked width, never names). -->
        <template #value>
            <span v-if="modelValue.length" class="flex items-center">
                <span
                    v-for="(o, i) in selectedShown"
                    :key="o.id"
                    class="relative inline-flex w-5 h-5 rounded-full overflow-hidden bg-primary-500 text-white items-center justify-center text-[10px] font-semibold ring-2 ring-white dark:ring-surface-800"
                    :class="i > 0 ? '-ml-2' : ''"
                >
                    {{ initial(o.label) }}
                    <img
                        v-if="o.avatar"
                        :src="o.avatar"
                        class="absolute inset-0 w-full h-full object-cover"
                        @error="onImgError"
                    />
                </span>
                <span
                    v-if="selectedExtra"
                    class="-ml-2 inline-flex w-5 h-5 rounded-full bg-surface-300 dark:bg-surface-600 text-surface-700 dark:text-surface-100 items-center justify-center text-[10px] font-semibold ring-2 ring-white dark:ring-surface-800"
                    >+{{ selectedExtra }}</span
                >
            </span>
            <span v-else class="flex items-center gap-1.5 text-surface-400">
                <i class="pi pi-users text-sm" />
                <span>{{ label }}</span>
            </span>
        </template>
        <template #option="{ option }">
            <div class="flex items-center gap-2">
                <span
                    class="relative inline-flex w-5 h-5 rounded-full overflow-hidden bg-primary-500 text-white items-center justify-center text-[10px] font-semibold flex-shrink-0"
                >
                    {{ initial(option.label) }}
                    <img
                        v-if="option.avatar"
                        :src="option.avatar"
                        class="absolute inset-0 w-full h-full object-cover"
                        @error="onImgError"
                    />
                </span>
                <span class="sensitive truncate">{{ option.label }}</span>
            </div>
        </template>
    </VoltMultiSelect>
</template>
