<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Menu from 'primevue/menu';

/**
 * Shared header action row for detail pages.
 *
 * Provides:
 *   - default slot for custom inline actions (Share, presence avatars, etc.)
 *   - inline Edit button (NuxtLink) when `editHref` + `showEdit` are set
 *   - overflow Menu hosting destructive actions (Delete) and any extra items
 *     supplied via the `extraOverflowItems` prop
 *
 * Destructive actions live behind the overflow menu so they can never be
 * triggered accidentally by a stray click on the page header.
 */

interface OverflowItem {
    label: string;
    icon?: string;
    class?: string;
    command: () => void;
}

const props = defineProps<{
    showEdit?: boolean;
    editHref?: string;
    editLabel?: string;
    destructiveLabel?: string;
    destructiveIcon?: string;
    extraOverflowItems?: OverflowItem[];
}>();

const emit = defineEmits<{
    (e: 'delete'): void;
    (e: 'edit'): void;
}>();

const { t } = useI18n();

const menuRef = ref();

function toggleMenu(event: Event) {
    menuRef.value?.toggle(event);
}

const overflowItems = computed<OverflowItem[]>(() => {
    const items: OverflowItem[] = [];
    if (props.extraOverflowItems?.length) {
        items.push(...props.extraOverflowItems);
    }
    if (props.destructiveLabel) {
        items.push({
            label: props.destructiveLabel,
            icon: props.destructiveIcon ?? 'pi pi-trash',
            class: 'text-danger-600',
            command: () => emit('delete')
        });
    }
    return items;
});

const editLabelResolved = computed(() => props.editLabel ?? t('design.actions.edit'));
</script>

<template>
    <div class="flex items-center gap-2">
        <slot />
        <NuxtLink v-if="showEdit && editHref" v-slot="{ href, navigate }" custom :to="editHref">
            <VoltButton
                as="a"
                :href="href"
                severity="secondary"
                outlined
                size="small"
                icon="pi pi-pencil"
                :label="editLabelResolved"
                @click="
                    emit('edit');
                    navigate($event);
                "
            />
        </NuxtLink>
        <VoltButton
            v-else-if="showEdit"
            type="button"
            severity="secondary"
            outlined
            size="small"
            icon="pi pi-pencil"
            :label="editLabelResolved"
            @click="emit('edit')"
        />
        <template v-if="overflowItems.length">
            <VoltButton
                type="button"
                severity="ghost"
                text
                size="small"
                icon="pi pi-ellipsis-h"
                class="!h-8 !w-8 !p-0"
                :aria-label="t('design.actions.more')"
                @click="toggleMenu"
            />
            <Menu ref="menuRef" :model="overflowItems" :popup="true" />
        </template>
    </div>
</template>
