<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export interface PresenceUser {
    sub: string;
    name: string;
    mode: string;
}

const props = defineProps<{
    users: readonly PresenceUser[];
}>();

const { t } = useI18n();

const editingNames = computed(() => props.users.map((u) => u.name).join(', '));
</script>

<template>
    <div
        v-if="users.length"
        class="flex items-center gap-2 px-4 py-3 rounded-lg bg-warning-50 dark:bg-warning-950 border border-warning-200 dark:border-warning-800 text-warning-700 dark:text-warning-300 text-sm"
    >
        <span class="material-symbols-outlined text-base">warning</span>
        <span>
            <strong>{{ editingNames }}</strong>
            {{ t('design.presence.editWarning', users.length) }}
        </span>
    </div>
</template>
