<template>
    <div
        class="flex items-center gap-3 rounded-lg px-3 py-2.5"
        :class="
            status === 'OK'
                ? 'bg-success-50 dark:bg-success-900/10'
                : status === 'Warn'
                  ? 'bg-warning-50 dark:bg-warning-900/10'
                  : 'bg-danger-50 dark:bg-danger-900/10'
        "
    >
        <span
            class="w-2 h-2 rounded-full shrink-0"
            :class="
                status === 'OK' ? 'bg-success-500' : status === 'Warn' ? 'bg-warning-500' : 'bg-danger-500'
            "
        />
        <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-surface-800 dark:text-surface-100">{{ protocol }}</p>
            <p class="text-xs text-surface-600 truncate">{{ endpoint }}</p>
        </div>
        <div class="text-right shrink-0">
            <p class="text-xs font-mono text-surface-700 dark:text-surface-200">{{ tags }}/s</p>
            <p class="text-xs text-surface-600">{{ latency }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    protocol: string;
    endpoint: string;
    tags: number;
    latency: string;
    status: string;
}>();
</script>
