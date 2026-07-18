<script setup lang="ts">
export interface BadgeItem {
    label: string;
    severity?: string;
    icon?: string;
}

defineProps<{
    badges?: BadgeItem[];
}>();

const SEVERITY_CLASSES: Record<string, string> = {
    success:
        'border-success-200 bg-success-50 text-success-600 dark:border-success-800 dark:bg-success-900/20 dark:text-success-400',
    warning:
        'border-warning-200 bg-warning-50 text-warning-600 dark:border-warning-800 dark:bg-warning-900/20 dark:text-warning-400',
    danger: 'border-danger-200 bg-danger-50 text-danger-600 dark:border-danger-800 dark:bg-danger-900/20 dark:text-danger-400',
    info: 'border-info-200 bg-info-50 text-info-600 dark:border-info-800 dark:bg-info-900/20 dark:text-info-400',
    neutral:
        'border-surface-200 bg-white text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300'
};

function badgeClasses(severity?: string): string {
    return SEVERITY_CLASSES[severity || 'neutral'] || SEVERITY_CLASSES.neutral || '';
}
</script>

<template>
    <span v-if="badges?.length" class="inline-flex items-center gap-1 align-middle">
        <span
            v-for="(badge, index) in badges"
            :key="`${badge.label}:${index}`"
            class="inline-flex h-5 items-center justify-center rounded border px-1 text-xs font-semibold"
            :class="badgeClasses(badge.severity)"
            :title="badge.label"
            :aria-label="badge.label"
        >
            <i v-if="badge.icon" :class="[badge.icon, 'text-xs']" />
            <span v-else>{{ badge.label?.slice(0, 1) }}</span>
        </span>
    </span>
</template>
