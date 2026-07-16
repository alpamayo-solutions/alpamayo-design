<template>
    <div>
        <div class="flex items-center gap-2 mb-1.5">
            <span class="text-xs font-medium text-surface-600 dark:text-surface-300 w-16 capitalize">{{
                colorKey
            }}</span>
            <div class="flex gap-1 flex-1">
                <div v-for="step in steps" :key="step" class="flex-1 flex flex-col items-center gap-1">
                    <div
                        class="w-full h-10 rounded-md shadow-sm"
                        :style="{ background: `var(--${colorKey}-${step})` }"
                        :title="`${colorKey}-${step}`"
                    />
                    <span class="text-xs text-surface-400">{{ step }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    colorKey: string;
    steps: number[];
}>();
</script>
