<script setup lang="ts">
// Real NuxtLink component — the string `:is="'NuxtLink'"` renders an inert
// <nuxtlink> at runtime (NuxtLink is a compile-time auto-import, not a global).
import { NuxtLink } from '#components';

defineProps<{
    to?: string;
}>();
</script>

<template>
    <component
        :is="to ? NuxtLink : 'div'"
        :to="to"
        class="flex items-center justify-between gap-3 px-5 py-3 transition-colors"
        :class="to && 'hover:bg-surface-50 dark:hover:bg-surface-700/30'"
    >
        <div class="min-w-0 flex-1 flex items-center gap-2">
            <slot />
        </div>
        <div v-if="$slots.right" class="shrink-0 flex items-center gap-2">
            <slot name="right" />
        </div>
    </component>
</template>
