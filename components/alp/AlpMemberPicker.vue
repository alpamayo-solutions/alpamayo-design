<script setup lang="ts">
// Inline single-select member dropdown (ClickUp-style): the avatar/label chip
// opens a popup menu of members. Emits only — the caller owns persistence.
// Presentational shell: takes plain `MemberOption[]` (no app member type) and
// a ready-to-use `avatar` URL string (avatar-URL construction is app-domain
// and lives in the wrapper, not here).
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MenuItem } from 'primevue/menuitem';

export interface MemberOption {
    id: string;
    label: string;
    avatar?: string;
    sublabel?: string;
}

const props = defineProps<{
    options: MemberOption[];
    modelValue: string | null;
    placeholder?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [id: string | null] }>();

const { t } = useI18n();
const menuRef = ref<{ toggle: (event: Event) => void } | null>(null);

function initial(label: string): string {
    return (label || '?').charAt(0).toUpperCase();
}

function onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
}

const selected = computed(() => props.options.find((o) => o.id === props.modelValue) ?? null);

const model = computed<MenuItem[]>(() => [
    {
        key: '__unassigned',
        memberId: null,
        isUnassigned: true,
        label: t('design.member.unassigned'),
        command: () => emit('update:modelValue', null)
    },
    ...props.options.map((option) => ({
        key: option.id,
        memberId: option.id,
        label: option.label,
        avatar: option.avatar,
        sublabel: option.sublabel,
        command: () => emit('update:modelValue', option.id)
    }))
]);

function toggle(event: Event) {
    if (props.disabled) return;
    menuRef.value?.toggle(event);
}
</script>

<template>
    <span class="inline-flex -ml-1.5" data-card-control="true">
        <VoltButton
            type="button"
            severity="ghost"
            text
            size="small"
            class="!h-6 !gap-1.5 !rounded-full !px-1 !py-0"
            :disabled="disabled"
            :aria-label="t('design.member.trigger')"
            v-tooltip.top="t('design.member.trigger')"
            @click="toggle"
        >
            <template v-if="selected">
                <span
                    class="relative inline-flex w-5 h-5 rounded-full overflow-hidden bg-primary-500 text-white items-center justify-center text-[10px] font-semibold flex-shrink-0"
                >
                    {{ initial(selected.label) }}
                    <img
                        v-if="selected.avatar"
                        :src="selected.avatar"
                        loading="lazy"
                        decoding="async"
                        class="absolute inset-0 w-full h-full object-cover"
                        @error="onImgError"
                    />
                </span>
                <span
                    class="sensitive max-w-[120px] truncate text-xs text-surface-600 dark:text-surface-300"
                    >{{ selected.label }}</span
                >
            </template>
            <template v-else>
                <span
                    class="w-5 h-5 rounded-full border border-dashed border-surface-400 dark:border-surface-500"
                />
                <span class="text-xs text-surface-400">{{
                    placeholder || t('design.member.unassigned')
                }}</span>
            </template>
        </VoltButton>
        <VoltMenu ref="menuRef" :model="model" :popup="true">
            <template #item="{ item, props: itemProps }">
                <a
                    v-bind="itemProps.action"
                    class="flex items-center justify-between gap-2 px-3 py-1.5 text-xs"
                >
                    <span class="inline-flex min-w-0 items-center gap-2">
                        <span
                            v-if="item.isUnassigned"
                            class="w-5 h-5 rounded-full border border-dashed border-surface-400 flex-shrink-0"
                        />
                        <span
                            v-else
                            class="relative inline-flex w-5 h-5 rounded-full overflow-hidden bg-primary-500 text-white items-center justify-center text-[10px] font-semibold flex-shrink-0"
                        >
                            {{ initial(item.label) }}
                            <img
                                v-if="item.avatar"
                                :src="item.avatar"
                                class="absolute inset-0 w-full h-full object-cover"
                                @error="onImgError"
                            />
                        </span>
                        <span class="min-w-0">
                            <span
                                :class="item.isUnassigned ? 'text-surface-500' : 'sensitive truncate block'"
                                >{{ item.label }}</span
                            >
                            <span v-if="item.sublabel" class="block truncate text-[10px] text-surface-400">{{
                                item.sublabel
                            }}</span>
                        </span>
                    </span>
                    <i
                        v-if="item.memberId === (modelValue ?? null)"
                        class="pi pi-check-circle text-xs text-success-500 flex-shrink-0"
                    />
                </a>
            </template>
        </VoltMenu>
    </span>
</template>
