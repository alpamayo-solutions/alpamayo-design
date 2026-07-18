<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
    defineProps<{
        lastFetchedAt: Date | null;
        loading: boolean;
        /**
         * Render the inline refresh button. Set to false in contexts where the
         * indicator sits inside another interactive element (e.g. a `<button>`
         * collapsible header) or where a separate explicit Sync action already
         * exists nearby.
         */
        showRefresh?: boolean;
    }>(),
    { showRefresh: true }
);

defineEmits<{
    refresh: [];
}>();

const { t } = useI18n();

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
    timer = setInterval(() => {
        now.value = Date.now();
    }, 5000);
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});

function timeAgo(date: Date): string {
    const seconds = Math.floor((now.value - date.getTime()) / 1000);
    if (seconds < 5) return t('design.staleness.justNow');
    if (seconds < 60) return t('design.staleness.secondsAgo', { seconds });
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t('design.staleness.minutesAgo', { minutes });
    const hours = Math.floor(minutes / 60);
    return t('design.staleness.hoursAgo', { hours });
}

const text = computed(() => {
    if (!props.lastFetchedAt) return t('design.staleness.noData');
    return timeAgo(props.lastFetchedAt);
});

const isStale = computed(() => {
    if (!props.lastFetchedAt) return true;
    return now.value - props.lastFetchedAt.getTime() > 120_000;
});
</script>

<template>
    <div class="flex items-center gap-2 text-xs">
        <span :class="isStale ? 'text-warning-500' : 'text-surface-400 dark:text-surface-500'">
            {{ text }}
        </span>
        <VoltButton
            v-if="props.showRefresh"
            type="button"
            severity="ghost"
            text
            size="small"
            :icon="loading ? 'pi pi-spin pi-refresh' : 'pi pi-refresh'"
            class="!h-7 !w-7 !p-0"
            :disabled="loading"
            :aria-label="t('design.staleness.refresh')"
            v-tooltip.top="t('design.staleness.refresh')"
            @click="$emit('refresh')"
        />
    </div>
</template>
