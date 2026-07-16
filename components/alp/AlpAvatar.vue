<template>
    <div
        class="rounded-full flex items-center justify-center font-bold text-white shrink-0"
        :class="[size, bgClass]"
        :style="bgColor ? { background: bgColor } : undefined"
    >
        {{ initials }}
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        initials: string;
        size?: string;
        bgClass?: string;
        bgColor?: string;
    }>(),
    {
        size: 'w-8 h-8 text-xs',
        bgClass: 'bg-primary-500',
        bgColor: undefined
    }
);
</script>
