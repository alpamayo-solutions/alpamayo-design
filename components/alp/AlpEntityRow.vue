<script setup lang="ts">
defineProps<{
    to?: string;
}>();
</script>

<template>
    <NuxtLink
        v-if="to"
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
    </NuxtLink>
    <div
        v-else
        class="flex items-center justify-between gap-3 px-5 py-3 transition-colors"
        :class="to && 'hover:bg-surface-50 dark:hover:bg-surface-700/30'"
    >
        <div class="min-w-0 flex-1 flex items-center gap-2">
            <slot />
        </div>
        <div v-if="$slots.right" class="shrink-0 flex items-center gap-2">
            <slot name="right" />
        </div>
    </div>
</template>
