<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Popover from 'primevue/popover';
import { useI18n } from 'vue-i18n';
import AlpFilterChip from './AlpFilterChip.vue';

export interface FilterChipDef {
    key: string;
    label: string;
    value: string;
}
export interface MoreFilterOption {
    label: string;
    value: string;
}
export interface MoreFilter {
    key: string;
    label: string;
    options: MoreFilterOption[];
    value: string | null;
    placeholder?: string;
}
export interface SavedView {
    key: string;
    label: string;
}

const props = defineProps<{
    search?: string;
    searchPlaceholder?: string;
    chips: FilterChipDef[];
    moreFilters?: MoreFilter[];
    savedViews?: SavedView[];
    activeSavedView?: string | null;
    totalCount?: number;
    totalLabel?: string;
}>();

const emit = defineEmits<{
    (e: 'update:search', value: string): void;
    (e: 'remove-chip', key: string): void;
    (e: 'update:filter', key: string, value: string | null): void;
    (e: 'apply-saved-view', key: string | null): void;
    (e: 'clear-all'): void;
}>();

const { t } = useI18n();

// Local input buffer — updates instantly on every keystroke so the input
// never visually lags behind the user. Emit to parent is debounced.
const inputBuffer = ref(props.search ?? '');
watch(
    () => props.search,
    (v) => {
        const next = v ?? '';
        if (next !== inputBuffer.value) inputBuffer.value = next;
    }
);
let searchTimer: ReturnType<typeof setTimeout> | null = null;
function onSearchInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    inputBuffer.value = v;
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => emit('update:search', v), 300);
}

const popoverRef = ref();
function togglePopover(e: Event) {
    popoverRef.value?.toggle(e);
}

const activeFilterCount = computed(
    () => (props.moreFilters || []).filter((f) => f.value !== null && f.value !== '').length
);
</script>

<template>
    <div class="flex flex-col gap-2">
        <!-- Row 1: search + filter button + saved-views + result count + actions -->
        <div class="flex items-center gap-2 flex-wrap">
            <div v-if="props.search !== undefined" class="relative w-56 shrink-0">
                <i
                    class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm z-10 pointer-events-none"
                />
                <VoltInputText
                    :value="inputBuffer"
                    :placeholder="props.searchPlaceholder || t('design.toolbar.search')"
                    class="pl-9 w-full text-sm !h-8"
                    @input="onSearchInput"
                />
            </div>

            <VoltButton
                v-if="props.moreFilters && props.moreFilters.length"
                v-tooltip.top="t('design.toolbar.filtersButton')"
                type="button"
                severity="ghost"
                size="small"
                icon="pi pi-filter"
                outlined
                class="relative !h-8 !w-8 !border-surface-200 !bg-transparent !p-0 !text-surface-700 hover:!bg-surface-50 dark:!border-surface-700 dark:!text-surface-200 dark:hover:!bg-surface-800"
                :aria-label="t('design.toolbar.filtersButton')"
                @click="togglePopover"
            >
                <span
                    v-if="activeFilterCount"
                    class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-semibold bg-primary-500 text-white tabular-nums"
                    >{{ activeFilterCount }}</span
                >
            </VoltButton>

            <Popover ref="popoverRef">
                <div class="space-y-3 p-2 min-w-64">
                    <div v-for="f in props.moreFilters" :key="f.key">
                        <label class="block text-xs uppercase tracking-wide text-surface-500 mb-1">
                            {{ f.label }}
                        </label>
                        <VoltSelect
                            :modelValue="f.value"
                            :options="f.options"
                            optionLabel="label"
                            optionValue="value"
                            :placeholder="
                                f.placeholder ||
                                t('design.toolbar.allOption', { label: f.label.toLowerCase() })
                            "
                            showClear
                            class="w-full"
                            @update:modelValue="(v: string | null) => emit('update:filter', f.key, v)"
                        />
                    </div>
                </div>
            </Popover>

            <VoltSelect
                v-if="props.savedViews && props.savedViews.length"
                :modelValue="props.activeSavedView ?? null"
                :options="props.savedViews"
                optionLabel="label"
                optionValue="key"
                :placeholder="t('design.toolbar.savedView')"
                showClear
                class="!w-44 text-sm !h-8"
                @update:modelValue="(v: string | null) => emit('apply-saved-view', v)"
            />

            <div class="ml-auto flex items-center gap-2">
                <span
                    v-if="props.totalCount !== undefined"
                    class="text-xs text-surface-500 dark:text-surface-400 whitespace-nowrap"
                >
                    {{ props.totalCount }} {{ props.totalLabel || t('design.toolbar.items') }}
                </span>
                <div
                    v-if="$slots.actions"
                    class="flex items-center gap-2 [&_[data-pc-name=button][data-p-severity]]:!bg-transparent [&_[data-pc-name=button][data-p-severity]]:!text-surface-700 [&_[data-pc-name=button][data-p-severity]]:!border-surface-200 hover:[&_[data-pc-name=button][data-p-severity]]:!bg-surface-50 dark:[&_[data-pc-name=button][data-p-severity]]:!text-surface-200 dark:[&_[data-pc-name=button][data-p-severity]]:!border-surface-700 dark:hover:[&_[data-pc-name=button][data-p-severity]]:!bg-surface-800"
                    :class="
                        props.totalCount !== undefined
                            ? 'pl-2 border-l border-surface-200 dark:border-surface-700'
                            : ''
                    "
                >
                    <slot name="actions" />
                </div>
            </div>
        </div>

        <!-- Row 2: active filter chips + clear all (only when filters active) -->
        <div v-if="props.chips.length" class="flex items-center gap-2 flex-wrap">
            <AlpFilterChip
                v-for="chip in props.chips"
                :key="chip.key"
                :label="chip.label"
                :value="chip.value"
                removable
                @remove="emit('remove-chip', chip.key)"
            />
            <VoltButton
                v-if="props.chips.length >= 2"
                type="button"
                severity="ghost"
                size="small"
                :label="t('design.toolbar.clearAll')"
                @click="emit('clear-all')"
            />
        </div>
    </div>
</template>
