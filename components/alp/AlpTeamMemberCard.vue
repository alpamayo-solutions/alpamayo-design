<template>
    <div
        class="flex items-center gap-3 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 px-4 py-3"
    >
        <AlpAvatar :initials="initials" :bg-color="avatarColor" size="w-9 h-9 text-sm" />
        <div>
            <p class="text-sm font-medium text-surface-800 dark:text-surface-100">{{ name }}</p>
            <p class="text-xs text-surface-400">{{ role }}</p>
        </div>
        <VoltBadge v-if="badge" :value="badge" :severity="badgeSeverity" class="ml-2" />
    </div>
</template>

<script setup lang="ts">
import AlpAvatar from './AlpAvatar.vue';

withDefaults(
    defineProps<{
        name: string;
        initials: string;
        role: string;
        avatarColor?: string;
        badge?: string;
        badgeSeverity?: string;
    }>(),
    {
        avatarColor: 'var(--primary-500)',
        badge: undefined,
        badgeSeverity: undefined
    }
);
</script>
