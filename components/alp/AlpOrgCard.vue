<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-5 flex items-start gap-4"
    >
        <div
            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 dark:bg-primary-900"
            style="background: var(--primary-50)"
        >
            <i class="pi pi-building text-primary-500 text-lg" />
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-surface-800 dark:text-surface-100 truncate sensitive">{{
                    name
                }}</span>
                <VoltBadge :value="status" severity="success" />
            </div>
            <p class="text-xs text-surface-400 mt-0.5 sensitive">{{ location }}</p>
            <div class="flex gap-3 mt-2 text-xs text-surface-500">
                <span><i class="pi pi-server mr-1" />{{ nodes }} nodes</span>
                <span><i class="pi pi-cog mr-1" />{{ machines }} machines</span>
                <span v-if="alerts > 0" class="text-warning-500"
                    ><i class="pi pi-exclamation-triangle mr-1" />{{ alerts }} alert</span
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
    location: string;
    nodes: number;
    machines: number;
    alerts: number;
    status: string;
}>();
</script>
