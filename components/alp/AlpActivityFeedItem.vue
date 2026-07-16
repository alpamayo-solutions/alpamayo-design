<template>
    <div class="flex items-start gap-3 px-5 py-3">
        <div
            class="w-7 h-7 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center shrink-0 mt-0.5"
        >
            <i :class="[icon, 'text-xs text-surface-500']" />
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-sm text-surface-700 dark:text-surface-200">
                <span class="font-medium">{{ actor }}</span>
                {{ action }}
                <span class="font-medium sensitive">{{ target }}</span>
            </p>
            <p class="text-xs text-surface-400 mt-0.5">{{ time }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    actor: string;
    action: string;
    target: string;
    icon: string;
    time: string;
}>();
</script>
