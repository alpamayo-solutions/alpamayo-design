<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4"
    >
        <div class="flex items-start justify-between mb-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" :class="iconBg">
                <i :class="[icon, iconColor]" style="font-size: 1rem" />
            </div>
            <AlpStatusPill :label="status" :severity="severity" dot />
        </div>
        <p class="text-sm font-semibold text-surface-800 dark:text-surface-100">{{ name }}</p>
        <p class="text-xs text-surface-400 mt-0.5">{{ desc }}</p>
        <div
            class="mt-3 pt-3 border-t border-surface-100 dark:border-surface-700 flex justify-between text-xs text-surface-400"
        >
            <span>{{ meta1 }}</span>
            <span>{{ meta2 }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import AlpStatusPill from './AlpStatusPill.vue';

defineProps<{
    name: string;
    desc: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    status: string;
    severity: 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';
    meta1: string;
    meta2: string;
}>();
</script>
