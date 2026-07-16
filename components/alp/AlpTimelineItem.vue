<template>
    <div class="flex gap-4 relative">
        <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10" :class="dotBg">
            <i :class="[icon, iconColor, 'text-xs']" />
        </div>
        <div class="flex-1 pb-1">
            <div class="flex items-center gap-2 mb-0.5">
                <span class="font-medium text-sm text-surface-800 dark:text-surface-100">{{ version }}</span>
                <AlpStatusPill :label="status" :severity="severity" />
            </div>
            <p class="text-xs text-surface-500">{{ note }}</p>
            <p class="text-xs text-surface-400 mt-0.5">{{ time }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import AlpStatusPill from './AlpStatusPill.vue';

defineProps<{
    version: string;
    status: string;
    severity: 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';
    note: string;
    time: string;
    icon: string;
    dotBg: string;
    iconColor: string;
}>();
</script>
