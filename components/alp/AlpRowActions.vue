<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MenuItem } from 'primevue/menuitem';

/**
 * Kebab (three-dots) action menu for DataTable rows. Merges two former app
 * components into one contract:
 *   - pass `items` to render a caller-built MenuItem[] verbatim
 *   - omit `items` to get the common edit/delete pair for free — `editLink`
 *     navigates on click, otherwise Edit emits `edit`; `deleteLabel`
 *     overrides the default Delete label
 */
const props = defineProps<{
    items?: MenuItem[];
    editLink?: string;
    deleteLabel?: string;
    ariaLabel?: string;
}>();

const emit = defineEmits<{
    delete: [];
    edit: [];
}>();

const { t } = useI18n();
const menuRef = ref();

function toggle(event: Event) {
    menuRef.value?.toggle(event);
}

const resolvedItems = computed<MenuItem[]>(() => {
    if (props.items) return props.items;
    const rows: MenuItem[] = [];
    if (props.editLink) {
        const link = props.editLink;
        rows.push({
            label: t('design.actions.edit'),
            icon: 'pi pi-pencil',
            command: () => navigateTo(link)
        });
    } else {
        rows.push({ label: t('design.actions.edit'), icon: 'pi pi-pencil', command: () => emit('edit') });
    }
    rows.push({
        label: props.deleteLabel || t('design.actions.delete'),
        icon: 'pi pi-trash',
        class: 'text-danger-600 dark:text-danger-400',
        command: () => emit('delete')
    });
    return rows;
});
</script>

<template>
    <div class="inline-flex">
        <VoltButton
            type="button"
            severity="ghost"
            text
            size="small"
            icon="pi pi-ellipsis-v"
            class="!h-8 !w-8 !p-0"
            :aria-label="ariaLabel || t('design.actions.more')"
            @click.stop="toggle"
        />
        <VoltMenu ref="menuRef" :model="resolvedItems" :popup="true" />
    </div>
</template>
