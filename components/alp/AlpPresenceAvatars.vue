<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PresenceUser } from './AlpEditConflictBanner.vue';

const props = defineProps<{
    users: readonly PresenceUser[];
}>();

const { t } = useI18n();

function initials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function title(user: PresenceUser): string {
    return user.mode === 'edit' ? `${user.name} ${t('design.presence.editingSuffix')}` : user.name;
}

const COLORS = [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-cyan-500'
];

function colorClass(sub: string): string {
    let hash = 0;
    for (let i = 0; i < sub.length; i++) hash = (hash * 31 + sub.charCodeAt(i)) | 0;
    return COLORS[Math.abs(hash) % COLORS.length] || COLORS[0] || 'bg-primary-500';
}
</script>

<template>
    <div v-if="props.users.length" class="flex items-center gap-1">
        <div
            v-for="user in props.users"
            :key="user.sub"
            :title="title(user)"
            class="relative flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-medium border-2 border-surface-0 dark:border-surface-900 -ml-2 first:ml-0"
            :class="colorClass(user.sub)"
        >
            {{ initials(user.name || '?') }}
            <span
                v-if="user.mode === 'edit'"
                class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-warning-500 border border-surface-0 dark:border-surface-900"
            />
        </div>
        <span class="text-xs text-surface-500 ml-1">
            {{ t('design.presence.viewing', { count: props.users.length }) }}
        </span>
    </div>
</template>
