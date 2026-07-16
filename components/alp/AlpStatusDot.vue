<template>
    <span class="relative flex shrink-0" :class="size">
        <span
            v-if="animated"
            class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            :class="ringClass"
        />
        <span class="relative inline-flex rounded-full" :class="[size, resolvedColor]" />
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Severity = 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';

const props = withDefaults(
    defineProps<{
        color?: string;
        severity?: Severity;
        animated?: boolean;
        size?: string;
        ringColor?: string;
    }>(),
    {
        color: undefined,
        severity: undefined,
        animated: false,
        size: 'h-2 w-2',
        ringColor: undefined
    }
);

const SEVERITY_DOT: Record<Severity, string> = {
    success: 'bg-success-500',
    warning: 'bg-warning-400',
    danger: 'bg-danger-500',
    info: 'bg-info-400',
    help: 'bg-help-500',
    neutral: 'bg-surface-400'
};

const SEVERITY_RING: Record<Severity, string> = {
    success: 'bg-success-400',
    warning: 'bg-warning-300',
    danger: 'bg-danger-400',
    info: 'bg-info-300',
    help: 'bg-help-400',
    neutral: 'bg-surface-300'
};

const resolvedColor = computed(
    () => props.color ?? (props.severity ? SEVERITY_DOT[props.severity] : 'bg-surface-400')
);
const ringClass = computed(
    () => props.ringColor ?? (props.severity ? SEVERITY_RING[props.severity] : resolvedColor.value)
);
</script>
