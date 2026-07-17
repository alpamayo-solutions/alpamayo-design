<script setup lang="ts">
import { computed } from 'vue';
import AlpStatusDot from './AlpStatusDot.vue';
import AlpStatusPill from './AlpStatusPill.vue';
import AlpEmptySection from './AlpEmptySection.vue';

export type AlpFeedSeverity = 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';

export interface AlpFeedItem {
    id: string;
    severity: AlpFeedSeverity;
    severityLabel: string;
    title: string;
    sub?: string | null;
    time?: string | null;
    href?: string | null;
    /** Upstream source system slug (e.g. 'prometheus', 'headscale'). */
    source?: string | null;
    /** Human-readable source label rendered in a small badge. Falls back to `source`. */
    sourceLabel?: string | null;
}

const props = withDefaults(
    defineProps<{
        items: AlpFeedItem[];
        emptyMessage: string;
        emptyIcon?: string;
        /**
         * When true (default), entries are sorted by severity descending
         * (danger → warning → info → help → neutral → success) so the most
         * urgent items always surface first. Disable for callers that
         * already pre-sort (e.g. a chronological deployment failure list).
         */
        sortBySeverity?: boolean;
    }>(),
    { emptyIcon: undefined, sortBySeverity: true }
);

const SEVERITY_RANK: Record<AlpFeedSeverity, number> = {
    danger: 0,
    warning: 1,
    info: 2,
    help: 3,
    neutral: 4,
    success: 5
};

const sortedItems = computed<AlpFeedItem[]>(() => {
    if (!props.sortBySeverity) return props.items;
    // Decorate-sort-undecorate to preserve insertion order for equal ranks
    // (sort() is not guaranteed stable across engines historically; this also
    // sidesteps any ambiguity).
    return props.items
        .map((item, idx) => ({ item, idx, rank: SEVERITY_RANK[item.severity] ?? 99 }))
        .sort((a, b) => (a.rank === b.rank ? a.idx - b.idx : a.rank - b.rank))
        .map((entry) => entry.item);
});

function sourceBadgeLabel(item: AlpFeedItem): string | null {
    const label = item.sourceLabel ?? item.source ?? null;
    return label ? label : null;
}
</script>

<template>
    <div v-if="sortedItems.length" class="divide-y divide-surface-100 dark:divide-surface-700">
        <component
            :is="item.href ? 'NuxtLink' : 'div'"
            v-for="item in sortedItems"
            :key="item.id"
            :to="item.href ?? undefined"
            class="flex items-start gap-3 px-4 py-3"
            :class="item.href ? 'hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors' : ''"
        >
            <AlpStatusDot :severity="item.severity" size="w-2 h-2" class="mt-1.5" />
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                    <p class="text-sm font-medium text-surface-800 dark:text-surface-100">{{ item.title }}</p>
                    <span v-if="item.time" class="inline-flex items-center gap-1 text-xs text-surface-400 shrink-0 tabular-nums" :title="`Triggered ${item.time} ago`">
                        <i class="pi pi-clock text-xs" />
                        <span>{{ item.time }}</span>
                    </span>
                </div>
                <p v-if="item.sub || sourceBadgeLabel(item)" class="text-xs text-surface-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span
                        v-if="sourceBadgeLabel(item)"
                        class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
                        :title="`Source: ${sourceBadgeLabel(item)}`"
                        >{{ sourceBadgeLabel(item) }}</span
                    >
                    <span v-if="item.sub" class="sensitive truncate">{{ item.sub }}</span>
                </p>
            </div>
            <AlpStatusPill :label="item.severityLabel" :severity="item.severity" class="shrink-0" />
        </component>
    </div>
    <div v-else class="px-4 py-6">
        <AlpEmptySection :icon="emptyIcon ?? 'pi pi-bell'" :message="emptyMessage" />
    </div>
</template>
