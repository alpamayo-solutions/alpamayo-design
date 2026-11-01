<script setup lang="ts">
import type { AlpIconId } from '../../composables/alpIconIds';

withDefaults(
    defineProps<{
        /** Icon id, e.g. `opc-ua`. For a string such as `alp_opc_ua`, pass it through `alpIconId`. */
        name: AlpIconId;
        variant?: 'detail' | 'small';
        /** Pixels as a number, or any CSS length as a string. */
        size?: number | string;
    }>(),
    {
        variant: 'small',
        size: 16
    }
);
</script>

<template>
    <svg
        class="alp-icon"
        :class="`alp-icon--${variant}`"
        :width="size"
        :height="size"
        aria-hidden="true"
        focusable="false"
    >
        <use :href="`/icons/alp-${variant}.svg#${name}`" />
    </svg>
</template>

<style>
.alp-icon {
    /* Tailwind's reset makes every svg a block, which breaks the icon out of a line of text. */
    display: inline-block;
    flex: none;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.alp-icon--detail {
    stroke-width: 8;
}

.alp-icon--small {
    stroke-width: var(--alp-icon-stroke, 2);
}
</style>
