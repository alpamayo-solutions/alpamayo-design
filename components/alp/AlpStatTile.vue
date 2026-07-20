<script setup lang="ts">
// Real NuxtLink component — the string `:is="'NuxtLink'"` renders an inert
// <nuxtlink> at runtime (NuxtLink is a compile-time auto-import, not a global).
import { NuxtLink } from '#components';

withDefaults(
    defineProps<{
        label: string;
        value?: string | number;
        sub?: string;
        href?: string;
        clickable?: boolean;
        mono?: boolean;
        sensitive?: boolean;
    }>(),
    { value: undefined, sub: undefined, href: undefined, clickable: false, mono: false, sensitive: false }
);
</script>

<template>
    <component
        :is="href ? NuxtLink : 'div'"
        :to="href"
        class="rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 block"
        :class="[
            (href || clickable) && 'hover:border-primary-300 dark:hover:border-primary-700 transition-colors'
        ]"
    >
        <p
            class="text-xs uppercase tracking-wide text-surface-500 dark:text-surface-400 font-semibold truncate"
            :class="sensitive && 'sensitive'"
        >
            {{ label }}
        </p>
        <slot>
            <p
                v-if="value !== undefined && value !== null && value !== ''"
                class="text-base font-bold text-surface-800 dark:text-surface-100 mt-1 truncate"
                :class="[mono ? 'font-mono' : 'tabular-nums', sensitive && 'sensitive']"
            >
                {{ value }}
            </p>
            <p v-else class="text-base font-bold text-surface-300 dark:text-surface-600 tabular-nums mt-1">
                —
            </p>
        </slot>
        <p v-if="sub" class="text-xs text-surface-400 mt-0.5 truncate">{{ sub }}</p>
    </component>
</template>
