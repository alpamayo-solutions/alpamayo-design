<template>
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
            <div class="relative flex w-4 h-4">
                <span
                    v-if="online"
                    class="absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-60 animate-ping"
                />
                <span
                    class="relative inline-flex rounded-full w-4 h-4 items-center justify-center"
                    :class="online ? 'bg-success-500' : 'bg-danger-500'"
                >
                    <i :class="[icon, 'text-white']" style="font-size: 0.5rem" />
                </span>
            </div>
            <div>
                <p class="text-sm font-medium text-surface-800 dark:text-surface-100">{{ name }}</p>
                <p class="text-xs text-surface-400">{{ type }}</p>
            </div>
        </div>
        <div class="text-right">
            <p
                class="text-sm font-semibold"
                :class="online ? 'text-surface-700 dark:text-surface-200' : 'text-surface-400'"
            >
                {{ value }}
            </p>
            <p class="text-xs text-surface-400">{{ unit }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
    type: string;
    online: boolean;
    icon: string;
    value: string | number;
    unit: string;
}>();
</script>
