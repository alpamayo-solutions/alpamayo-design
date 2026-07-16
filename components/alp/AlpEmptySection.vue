<script setup lang="ts">
import { computed } from 'vue';

/**
 * EmptySection — generic empty-state placeholder for cards/sections whose
 * entire body has no content to show (no linked machines, no rollouts yet,
 * no infrastructure, etc.).
 *
 * Replaces ad-hoc `--` placeholders that look like missing data instead of
 * an intentionally-empty state. Use ONLY when the whole section is empty;
 * keep inline `—` for missing individual values in tables.
 *
 * Required:
 *   - `message`: human-readable explanation (caller supplies via `t(...)`)
 *
 * Optional:
 *   - `icon`: PrimeIcons or alp-icons class (e.g. `pi pi-inbox`)
 *   - `severity`: 'success' | 'info' | 'warn' | 'danger' — colors the icon
 *   - `actionLabel` + `actionHref`: render a small CTA NuxtLink
 *
 * Part of Change E (information-design quick wins).
 */
const props = defineProps<{
    icon?: string;
    message: string;
    severity?: 'success' | 'info' | 'warn' | 'danger';
    actionLabel?: string;
    actionHref?: string;
}>();

const iconColorClass = computed(() => {
    switch (props.severity) {
        case 'success':
            return 'text-success-500 dark:text-success-400';
        case 'info':
            return 'text-info-500 dark:text-info-400';
        case 'warn':
            return 'text-warning-500 dark:text-warning-400';
        case 'danger':
            return 'text-danger-500 dark:text-danger-400';
        default:
            return 'text-surface-400 dark:text-surface-500';
    }
});
</script>

<template>
    <div
        class="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center text-surface-500 dark:text-surface-400"
    >
        <i v-if="icon" :class="[icon, iconColorClass]" class="text-3xl" aria-hidden="true" />
        <p class="text-sm font-semibold">{{ message }}</p>
        <NuxtLink
            v-if="actionLabel && actionHref"
            :to="actionHref"
            class="text-xs text-primary-600 hover:underline"
        >
            {{ actionLabel }}
        </NuxtLink>
    </div>
</template>
