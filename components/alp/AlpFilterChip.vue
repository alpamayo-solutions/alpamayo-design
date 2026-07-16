<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{ label: string; value?: string; removable?: boolean }>();
defineEmits<{ (e: 'remove'): void }>();

const { t } = useI18n();
</script>

<template>
    <span
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
    >
        <span class="font-medium">{{ label }}<span v-if="value">:</span></span>
        <span v-if="value" class="sensitive">{{ value }}</span>
        <VoltButton
            v-if="removable"
            v-tooltip.top="t('design.toolbar.removeFilter')"
            type="button"
            severity="ghost"
            text
            size="small"
            icon="pi pi-times"
            class="ml-0.5 !h-4 !w-4 !rounded-full !p-0 !text-xs !text-surface-400 hover:!bg-danger-50 hover:!text-danger-600 dark:!text-surface-500 dark:hover:!bg-danger-900/20 dark:hover:!text-danger-400"
            :aria-label="t('design.toolbar.removeFilter')"
            @click="$emit('remove')"
        />
    </span>
</template>
