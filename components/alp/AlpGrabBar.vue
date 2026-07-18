<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    grabs: { cardId: string; title: string }[];
}>();

const emit = defineEmits<{
    release: [cardId: string];
}>();

const { t } = useI18n();
</script>

<template>
    <div
        v-if="grabs.length > 0"
        class="flex items-center gap-3 px-4 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg mb-4"
    >
        <i class="pi pi-bolt text-green-600 dark:text-green-400 animate-pulse" />
        <span class="text-xs font-medium text-green-700 dark:text-green-300">{{
            t('design.presence.workingOn')
        }}</span>
        <div class="flex flex-wrap gap-1.5">
            <span
                v-for="grab in grabs"
                :key="grab.cardId"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs"
            >
                {{ grab.title }}
                <VoltButton
                    type="button"
                    severity="ghost"
                    text
                    size="small"
                    icon="pi pi-times"
                    class="ml-0.5 !h-5 !w-5 !p-0 !text-green-600 hover:!text-green-900 dark:!text-green-400 dark:hover:!text-green-100"
                    :aria-label="t('design.presence.release')"
                    v-tooltip.top="t('design.presence.release')"
                    @click="emit('release', grab.cardId)"
                />
            </span>
        </div>
    </div>
</template>
