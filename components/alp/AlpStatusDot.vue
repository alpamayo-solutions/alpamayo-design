<template>
    <span class="relative flex shrink-0" :class="size">
        <span
            v-if="isAnimated"
            class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            :class="ringClass"
        />
        <span class="relative inline-flex rounded-full" :class="[size, resolvedColor]" />
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Severity = 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';
type DeviceStatus = 'online' | 'offline' | 'degraded' | 'maintenance' | 'unknown';

const props = withDefaults(
    defineProps<{
        color?: string;
        severity?: Severity;
        status?: DeviceStatus;
        animated?: boolean;
        size?: string;
        ringColor?: string;
    }>(),
    {
        color: undefined,
        severity: undefined,
        status: undefined,
        animated: false,
        size: 'h-2 w-2',
        ringColor: undefined
    }
);

const STATUS_SEVERITY: Record<DeviceStatus, Severity> = {
    online: 'success',
    offline: 'danger',
    degraded: 'warning',
    maintenance: 'info',
    unknown: 'neutral'
};

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

const resolvedSeverity = computed<Severity | undefined>(
    () => props.severity ?? (props.status ? STATUS_SEVERITY[props.status] : undefined)
);
const isAnimated = computed(() => props.animated || props.status === 'online');
const resolvedColor = computed(
    () => props.color ?? (resolvedSeverity.value ? SEVERITY_DOT[resolvedSeverity.value] : 'bg-surface-400')
);
const ringClass = computed(
    () =>
        props.ringColor ??
        (resolvedSeverity.value ? SEVERITY_RING[resolvedSeverity.value] : resolvedColor.value)
);
</script>
