<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    code: string;
    class?: string;
}>();

const normalized = computed(() => props.code.toLowerCase());
</script>

<template>
    <span
        :class="[
            'inline-flex items-center justify-center overflow-hidden rounded-sm shadow-[0_0_0_1px_rgba(0,0,0,0.08)] leading-none align-middle',
            props.class
        ]"
        :aria-label="code"
        role="img"
    >
        <!-- Germany -->
        <svg
            v-if="normalized === 'de'"
            viewBox="0 0 5 3"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            class="w-full h-full block"
        >
            <rect width="5" height="3" fill="#000000" />
            <rect width="5" height="2" y="1" fill="#DD0000" />
            <rect width="5" height="1" y="2" fill="#FFCE00" />
        </svg>

        <!-- Switzerland -->
        <svg
            v-else-if="normalized === 'de-ch' || normalized === 'ch'"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            class="w-full h-full block"
        >
            <rect width="32" height="32" fill="#D52B1E" />
            <rect x="13" y="6" width="6" height="20" fill="#ffffff" />
            <rect x="6" y="13" width="20" height="6" fill="#ffffff" />
        </svg>

        <!-- United Kingdom -->
        <svg
            v-else-if="normalized === 'en' || normalized === 'gb' || normalized === 'uk'"
            viewBox="0 0 60 30"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            class="w-full h-full block"
        >
            <rect width="60" height="30" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" stroke-width="6" />
            <path d="M0,0 L60,30" stroke="#C8102E" stroke-width="4" transform="translate(0,4)" />
            <path d="M60,0 L0,30" stroke="#C8102E" stroke-width="4" transform="translate(0,-4)" />
            <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" stroke-width="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" />
        </svg>

        <!-- Fallback: small text label -->
        <span v-else class="text-xs font-mono font-bold text-surface-500">{{
            code.slice(0, 2).toUpperCase()
        }}</span>
    </span>
</template>
