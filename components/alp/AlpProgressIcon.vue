<script lang="ts">
// Pure helpers, absorbed from the app's task-status-icon catalog (this
// component is their only remaining consumer) and re-exported here so
// callers that need the raw fraction/predicate outside the component
// (e.g. a legend, a sort comparator) don't need a separate util import.
//
// Generalized on the move: rather than gating on a curated, task-domain
// catalog of five fixed keys (0/25/50/75/100 — owned by the app's
// board-column icon picker, which is out of scope for this package),
// `isProgressIcon` accepts any `progress-<0-100>` key so this component
// works for any caller-defined progress scale.

/** True when `key` is a `progress-<0-100>` ring key (vs a PrimeIcons class). */
export function isProgressIcon(key?: string | null): boolean {
    if (!key) return false;
    const m = /^progress-(\d{1,3})$/.exec(key);
    if (!m) return false;
    const pct = Number(m[1]);
    return Number.isFinite(pct) && pct >= 0 && pct <= 100;
}

/**
 * Fill fraction (0..1) encoded in a `progress-*` key. Returns null when the
 * key is not a progress ring.
 */
export function progressFraction(key?: string | null): number | null {
    if (!isProgressIcon(key)) return null;
    const pct = Number(String(key).replace('progress-', ''));
    return Number.isFinite(pct) ? Math.max(0, Math.min(1, pct / 100)) : null;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        icon?: string | null;
        color?: string | null;
        // Controls both the box (progress ring / dot) and the font-size the
        // PrimeIcon inherits. Kept tiny by default so it drops in where the
        // old 8px column dot lived.
        sizeClass?: string;
    }>(),
    {
        icon: null,
        color: null,
        sizeClass: 'w-2.5 h-2.5 text-[0.7rem]'
    }
);

// Neutral grey fallback matches the old dot default.
const tint = computed(() => props.color || '#94a3b8');
const isProgress = computed(() => isProgressIcon(props.icon));
const isPi = computed(() => !!props.icon && props.icon.startsWith('pi-') && !isProgress.value);
// Ring circumference trick: r = 15.9155 → 2·π·r ≈ 100, so the dash length is
// the percentage directly.
const dash = computed(() => {
    const frac = progressFraction(props.icon) ?? 0;
    return `${Math.round(frac * 100)} 100`;
});
</script>

<template>
    <span :class="['inline-flex items-center justify-center shrink-0 leading-none', sizeClass]" :style="{ color: tint }">
        <!-- Progress ring: track + clockwise fill, tinted by currentColor -->
        <svg v-if="isProgress" viewBox="0 0 36 36" class="w-full h-full" aria-hidden="true">
            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" stroke-width="4" stroke-opacity="0.25" />
            <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="dash"
                transform="rotate(-90 18 18)"
            />
        </svg>
        <!-- Curated PrimeIcon, inherits font-size from the wrapper, tinted -->
        <i v-else-if="isPi" :class="['pi', icon]" aria-hidden="true" />
        <!-- Empty / unknown → an OUTLINED circle (colour on the ring, not filled)
             so the default icon is visually distinct from a solid colour swatch. -->
        <span v-else class="w-full h-full rounded-full border-2" :style="{ borderColor: tint }" />
    </span>
</template>
