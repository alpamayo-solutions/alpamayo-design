<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4"
    >
        <p class="text-xs font-semibold text-surface-700 dark:text-surface-200 mb-0.5">{{ title }}</p>
        <p class="text-2xl font-bold text-success-600 mb-3">{{ value }}</p>
        <svg viewBox="0 0 160 40" class="w-full h-10" preserveAspectRatio="none">
            <rect x="2" y="22" width="12" height="18" rx="2" fill="var(--primary-300)" />
            <rect x="18" y="16" width="12" height="24" rx="2" fill="var(--primary-400)" />
            <rect x="34" y="20" width="12" height="20" rx="2" fill="var(--primary-300)" />
            <rect x="50" y="10" width="12" height="30" rx="2" fill="var(--primary-500)" />
            <rect x="66" y="14" width="12" height="26" rx="2" fill="var(--primary-400)" />
            <rect x="82" y="6" width="12" height="34" rx="2" fill="var(--primary-600)" />
            <rect x="98" y="12" width="12" height="28" rx="2" fill="var(--primary-500)" />
            <rect x="114" y="18" width="12" height="22" rx="2" fill="var(--primary-400)" />
            <rect x="130" y="8" width="12" height="32" rx="2" fill="var(--primary-500)" />
            <rect x="146" y="4" width="12" height="36" rx="2" fill="var(--primary-600)" />
        </svg>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    value: string;
}>();
</script>
