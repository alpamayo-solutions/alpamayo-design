<script setup lang="ts">
// Inline due-date control: a compact icon button that opens a calendar dropdown
// anchored exactly under the trigger (teleported to <body> so it escapes a
// clipping ancestor, e.g. a board column's overflow). Icon-only when no date
// is set (keeps the trigger compact), icon + date when set. Selecting or
// clearing a date emits the change; the caller owns persistence.
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlpAnchoredDropdown } from '../../composables/useAlpAnchoredDropdown';

const props = defineProps<{
    dueDate?: string | Date | null;
    disabled?: boolean;
}>();

const emit = defineEmits<{ update: [dueDate: Date | null] }>();

const { t } = useI18n();
const { open, triggerRef, panelRef, pos, toggle, close } = useAlpAnchoredDropdown();

// Normalise whatever the caller passes (ISO string OR Date object) into a
// local Date, guarding against invalid input either way.
function toDate(v: string | Date | null | undefined): Date | null {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    const d = new Date(String(v).slice(0, 10) + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
}

function toISO(v: string | Date | null | undefined): string {
    const d = toDate(v);
    if (!d) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const model = computed<Date | null>(() => toDate(props.dueDate));
const dateLabel = computed(() => toISO(props.dueDate));

// Overdue styling: the date is in the past (strictly before today's start).
// This control has no notion of "done" — that's caller state — so overdue is
// purely a function of the date itself.
const isOverdue = computed(() => {
    const d = model.value;
    if (!d) return false;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return d.getTime() < startOfToday.getTime();
});

function onTrigger() {
    if (props.disabled) return;
    toggle();
}

function pick(value: Date | null) {
    emit('update', value ?? null);
    close();
}
</script>

<template>
    <span ref="triggerRef" class="inline-flex" data-card-control="true">
        <VoltButton
            type="button"
            severity="ghost"
            text
            size="small"
            class="!h-6 !gap-1 !px-1 !py-0 !text-xs !text-surface-600 dark:!text-surface-300"
            :class="[
                !dueDate && '!w-6 !px-0 !text-surface-400',
                isOverdue && '!text-danger-600 dark:!text-danger-400'
            ]"
            :disabled="disabled"
            :aria-label="t('design.date.trigger')"
            v-tooltip.top="dueDate ? dateLabel : t('design.date.trigger')"
            @click="onTrigger"
        >
            <i class="pi pi-calendar text-xs" />
            <span v-if="dueDate" class="tabular-nums">{{ dateLabel }}</span>
        </VoltButton>
        <Teleport to="body">
            <div
                v-if="open"
                ref="panelRef"
                class="fixed z-[1200]"
                :style="{ top: `${pos.top}px`, left: `${pos.left}px` }"
                data-card-control="true"
                @click.stop
            >
                <VoltDatePicker
                    :modelValue="model"
                    inline
                    dateFormat="yy-mm-dd"
                    showButtonBar
                    :manualInput="false"
                    :aria-label="t('design.date.trigger')"
                    @update:modelValue="pick"
                />
            </div>
        </Teleport>
    </span>
</template>
