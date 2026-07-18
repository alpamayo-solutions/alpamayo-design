<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { NavItem, NavSection } from './AlpSidebar.vue';

const props = defineProps<{
    sections: NavSection[];
    open: boolean;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const { t } = useI18n();

// Nuxt auto-imports (no explicit import — matches the playground precedent).
// Unlike AlpSidebar there is no `activePath` override prop, so this always reads the route.
const route = useRoute();

const openModel = computed({
    get: () => props.open,
    set: (value: boolean) => emit('update:open', value)
});

const expandedSections = ref<Set<string>>(new Set());

function isItemActive(item: NavItem): boolean {
    return !!item.to && (route.path === item.to || route.path.startsWith(item.to + '/'));
}

function isSectionActive(section: NavSection): boolean {
    if (section.to && (route.path === section.to || route.path.startsWith(section.to + '/'))) return true;
    return section.items.some(isItemActive);
}

// Close the drawer whenever navigation actually happens (item click, or a route change
// triggered some other way while the drawer happened to be open).
watch(
    () => route.path,
    () => {
        openModel.value = false;
    }
);

watch(openModel, (isOpen) => {
    if (!isOpen) return;
    const active = props.sections.find(isSectionActive);
    if (active) expandedSections.value = new Set([active.key]);
});

function onSectionClick(section: NavSection) {
    if (section.items.length === 0) {
        if (section.to) navigateTo(section.to);
        openModel.value = false;
        return;
    }
    const next = new Set(expandedSections.value);
    if (next.has(section.key)) next.delete(section.key);
    else next.add(section.key);
    expandedSections.value = next;
}
</script>

<template>
    <Teleport to="body">
        <!-- Backdrop -->
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="openModel"
                class="fixed inset-0 bg-black/40 z-[60] md:hidden"
                data-testid="drawer-backdrop"
                @click="openModel = false"
            />
        </Transition>

        <!-- Drawer panel -->
        <Transition
            enter-active-class="transition-transform duration-300 ease-out"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition-transform duration-200 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
        >
            <div
                v-if="openModel"
                class="fixed inset-y-0 left-0 z-[70] w-72 flex flex-col bg-white dark:bg-surface-900 shadow-2xl md:hidden"
            >
                <!-- Header -->
                <div class="flex items-center justify-between px-4 h-14 flex-shrink-0">
                    <div class="flex items-center gap-2">
                        <slot name="brand" />
                    </div>
                    <VoltButton
                        type="button"
                        severity="ghost"
                        text
                        icon="pi pi-times"
                        class="!h-9 !w-9 !p-0"
                        :aria-label="t('design.nav.closeDrawer')"
                        data-testid="drawer-close"
                        @click="openModel = false"
                    />
                </div>

                <!-- Nav sections -->
                <nav class="flex-1 overflow-y-auto p-3 space-y-0.5">
                    <template v-for="section in sections" :key="section.key">
                        <VoltButton
                            type="button"
                            severity="ghost"
                            text
                            fluid
                            class="!justify-start !gap-3 !px-3 !py-2.5 !rounded-lg !text-sm !font-semibold"
                            :class="
                                isSectionActive(section)
                                    ? '!bg-primary-900 !text-white hover:!bg-primary-900'
                                    : '!text-surface-700 dark:!text-surface-200 hover:!bg-surface-100 dark:hover:!bg-surface-800'
                            "
                            data-testid="drawer-section"
                            @click="onSectionClick(section)"
                        >
                            <i
                                :class="[
                                    section.icon || 'pi pi-circle',
                                    'text-base w-5 text-center flex-shrink-0'
                                ]"
                            />
                            <span class="flex-1 text-left">{{ section.label }}</span>
                            <i
                                v-if="section.items.length > 0"
                                class="pi pi-chevron-down text-xs transition-transform duration-200 flex-shrink-0"
                                :class="expandedSections.has(section.key) ? 'rotate-180' : ''"
                            />
                        </VoltButton>

                        <Transition
                            enter-active-class="transition-all duration-200 ease-out overflow-hidden"
                            enter-from-class="max-h-0 opacity-0"
                            enter-to-class="max-h-96 opacity-100"
                            leave-active-class="transition-all duration-150 ease-in overflow-hidden"
                            leave-from-class="max-h-96 opacity-100"
                            leave-to-class="max-h-0 opacity-0"
                        >
                            <div
                                v-if="section.items.length > 0 && expandedSections.has(section.key)"
                                class="space-y-0.5 mt-0.5"
                            >
                                <NuxtLink
                                    v-for="item in section.items"
                                    :key="item.key"
                                    :to="item.to"
                                    class="flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg text-sm transition-colors"
                                    :class="
                                        isItemActive(item)
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                                            : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                                    "
                                    data-testid="drawer-item"
                                >
                                    <i
                                        :class="[
                                            item.icon || 'pi pi-circle',
                                            'text-xs w-4 text-center flex-shrink-0'
                                        ]"
                                    />
                                    <span class="flex-1 truncate">{{ item.label }}</span>
                                    <VoltBadge
                                        v-if="item.badge !== undefined"
                                        :value="item.badge"
                                        severity="secondary"
                                        class="flex-shrink-0"
                                    />
                                </NuxtLink>
                            </div>
                        </Transition>
                    </template>
                </nav>

                <!-- Caller-provided footer (e.g. a pinned Settings link) -->
                <div class="p-3 flex-shrink-0">
                    <slot name="footer" />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
