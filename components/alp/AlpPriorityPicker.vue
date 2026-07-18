<script setup lang="ts">
// Inline priority dropdown (ClickUp-style): the chip trigger opens a popup
// menu of priority options. Emits only — the caller owns persistence.
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
    priority?: number | null;
    disabled?: boolean;
}>();

const emit = defineEmits<{ update: [priority: number] }>();

const { t } = useI18n();
const menuRef = ref<{ toggle: (event: Event) => void } | null>(null);

const severities: Record<number, string> = { 0: 'secondary', 1: 'info', 2: 'warn', 3: 'danger' };
const labelKeys: Record<number, string> = {
    0: 'design.priority.none',
    1: 'design.priority.low',
    2: 'design.priority.medium',
    3: 'design.priority.high'
};

const current = computed(() => props.priority ?? 0);
const currentLabel = computed(() => t(labelKeys[current.value] ?? labelKeys[0]!));

const model = computed<MenuItem[]>(() =>
    [0, 1, 2, 3].map((value) => ({
        key: String(value),
        value,
        label: t(labelKeys[value]!),
        severity: severities[value],
        command: () => emit('update', value)
    }))
);

function toggle(event: Event) {
    if (props.disabled) return;
    menuRef.value?.toggle(event);
}
</script>

<template>
    <span class="inline-flex" data-card-control="true">
        <VoltButton
            type="button"
            severity="ghost"
            text
            size="small"
            class="!h-6 !p-0"
            :disabled="disabled"
            :aria-label="t('design.priority.trigger')"
            v-tooltip.top="t('design.priority.trigger')"
            @click="toggle"
        >
            <VoltTag
                v-if="current"
                :value="currentLabel"
                :severity="(severities[current] as any) || 'secondary'"
            />
            <span
                v-else
                class="inline-flex items-center gap-1 rounded-full border border-dashed border-surface-300 px-1.5 py-0.5 text-xs text-surface-400 dark:border-surface-600"
            >
                <i class="pi pi-flag text-[10px]" />
                {{ t('design.priority.trigger') }}
            </span>
        </VoltButton>
        <VoltMenu ref="menuRef" :model="model" :popup="true">
            <template #item="{ item, props: itemProps }">
                <a v-bind="itemProps.action" class="flex items-center justify-between gap-3 px-3 py-1.5">
                    <VoltTag :value="item.label" :severity="(item.severity as any) || 'secondary'" />
                    <i v-if="item.value === current" class="pi pi-check-circle text-xs text-success-500" />
                </a>
            </template>
        </VoltMenu>
    </span>
</template>
