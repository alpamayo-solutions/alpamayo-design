<template>
    <div class="flex items-center gap-4 px-5 py-3">
        <span class="relative flex h-3 w-3 shrink-0">
            <span
                v-if="online"
                class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-success-400"
            />
            <span
                class="relative inline-flex rounded-full h-3 w-3"
                :class="online ? 'bg-success-500' : 'bg-danger-500'"
            />
        </span>
        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-surface-800 dark:text-surface-100 truncate sensitive">
                {{ name }}
            </p>
            <p class="text-xs text-surface-400 truncate sensitive">{{ org }}</p>
        </div>
        <div class="shrink-0 text-xs text-surface-400 w-20 text-right">{{ lastSeen }}</div>
        <div class="shrink-0 text-xs font-mono text-surface-500 w-14 text-right">{{ revision }}</div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
    org: string;
    online: boolean;
    lastSeen: string;
    revision: string;
}>();
</script>
