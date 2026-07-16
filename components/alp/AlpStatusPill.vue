<template>
    <span
        class="inline-flex items-center gap-1.5 font-medium"
        :class="[shapeClass, sizeClass, severityClass, status && 'capitalize']"
    >
        <span
            v-if="dot"
            class="rounded-full"
            :class="[dotSizeClass, dotColorClass, animated && 'animate-pulse']"
        />
        <slot>{{ resolvedLabel }}</slot>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Severity = 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';
type Shape = 'pill' | 'chip';
type Size = 'sm' | 'md';

const props = withDefaults(
    defineProps<{
        label?: string;
        severity?: Severity;
        status?: string;
        dot?: boolean;
        animated?: boolean;
        shape?: Shape;
        size?: Size;
    }>(),
    {
        label: undefined,
        severity: 'neutral',
        status: undefined,
        dot: false,
        animated: false,
        shape: 'pill',
        size: 'sm'
    }
);

const STATUS_SEVERITY: Record<string, Severity> = {
    active: 'success',
    completed: 'success',
    deployed: 'success',
    planning: 'info',
    draft: 'info',
    pending: 'info',
    on_hold: 'warning',
    paused: 'warning',
    review: 'warning',
    inactive: 'neutral',
    archived: 'neutral',
    cancelled: 'neutral',
    failed: 'neutral'
};

const SEVERITY_BG_TEXT: Record<Severity, string> = {
    success: 'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400',
    warning: 'bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
    danger: 'bg-danger-100 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400',
    info: 'bg-info-100 dark:bg-info-900/20 text-info-600 dark:text-info-400',
    help: 'bg-help-100 dark:bg-help-900/20 text-help-600 dark:text-help-400',
    neutral: 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-300'
};

const SEVERITY_DOT: Record<Severity, string> = {
    success: 'bg-success-500',
    warning: 'bg-warning-400',
    danger: 'bg-danger-500',
    info: 'bg-info-400',
    help: 'bg-help-500',
    neutral: 'bg-surface-400'
};

const resolvedSeverity = computed<Severity>(() => {
    if (props.status) return STATUS_SEVERITY[props.status.toLowerCase()] ?? 'neutral';
    return props.severity;
});
const resolvedLabel = computed(() => props.label ?? props.status?.replace(/_/g, ' '));
const severityClass = computed(() => SEVERITY_BG_TEXT[resolvedSeverity.value]);
const dotColorClass = computed(() => SEVERITY_DOT[resolvedSeverity.value]);
const shapeClass = computed(() => (props.shape === 'pill' ? 'rounded-full' : 'rounded'));
const sizeClass = computed(() => (props.size === 'md' ? 'text-sm px-2.5 py-1' : 'text-xs px-2 py-0.5'));
const dotSizeClass = computed(() => (props.size === 'md' ? 'w-2 h-2' : 'w-1.5 h-1.5'));
</script>
