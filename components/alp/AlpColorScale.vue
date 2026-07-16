<template>
    <section>
        <AlpSectionHeader :label="label" />
        <div class="flex gap-1.5">
            <div v-for="step in steps" :key="step" class="flex-1 flex flex-col items-center gap-1.5">
                <div
                    class="w-full h-14 rounded-lg shadow-sm"
                    :class="withBorder ? 'border border-surface-200 dark:border-surface-700' : ''"
                    :style="{ background: `var(--${varPrefix}-${step})` }"
                />
                <span class="text-xs font-semibold text-surface-500">{{ step }}</span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        varPrefix: string;
        steps: number[];
        withBorder?: boolean;
    }>(),
    {
        withBorder: false
    }
);
</script>
