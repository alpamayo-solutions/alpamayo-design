<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

export interface NavItem {
    key: string;
    label: string;
    icon?: string;
    to?: string;
    badge?: string | number;
    children?: NavItem[];
}

export interface NavSection {
    key: string;
    label?: string;
    icon?: string;
    to?: string;
    items: NavItem[];
}

const props = defineProps<{
    sections: NavSection[];
    activePath?: string;
}>();

// Nuxt auto-import (no explicit import — matches the playground precedent). `activePath`
// lets a caller pin the active state explicitly; when omitted, the current route decides.
const route = useRoute();
const currentPath = computed(() => props.activePath ?? route.path);

const expandedSections = ref<Set<string>>(new Set());

function isItemActive(item: NavItem, section: NavSection): boolean {
    if (!item.to) return false;
    const { to } = item;
    if (currentPath.value === to) return true;
    if (currentPath.value.startsWith(to + '/')) {
        const hasMoreSpecific = section.items.some(
            (other) =>
                !!other.to &&
                other.to !== to &&
                (other.to === currentPath.value ||
                    (currentPath.value.startsWith(other.to + '/') && other.to.length > to.length))
        );
        if (!hasMoreSpecific) return true;
    }
    return false;
}

function isSectionActive(section: NavSection): boolean {
    if (section.to && (currentPath.value === section.to || currentPath.value.startsWith(section.to + '/')))
        return true;
    return section.items.some((item) => isItemActive(item, section));
}

function syncExpanded() {
    for (const section of props.sections) {
        if (section.items.length > 0 && isSectionActive(section)) {
            expandedSections.value.add(section.key);
        }
    }
}

onMounted(syncExpanded);
watch(currentPath, syncExpanded);
watch(
    () => props.sections,
    () => syncExpanded()
);

function toggleSection(section: NavSection) {
    const next = new Set(expandedSections.value);
    if (next.has(section.key)) next.delete(section.key);
    else next.add(section.key);
    expandedSections.value = next;
}
</script>

<template>
    <aside
        class="hidden md:flex flex-col bg-surface-50 dark:bg-surface-800 w-60 flex-shrink-0 border-r border-surface-200 dark:border-surface-700 overflow-y-auto"
    >
        <nav class="flex flex-col px-2 pt-3 pb-2 gap-0.5 flex-1">
            <template v-for="section in sections" :key="section.key">
                <!-- No sub-items: direct link -->
                <NuxtLink
                    v-if="section.items.length === 0 && section.to"
                    :to="section.to"
                    class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    :class="
                        isSectionActive(section)
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100'
                    "
                    data-testid="sidebar-section"
                >
                    <i :class="[section.icon || 'pi pi-circle', 'text-sm w-4 text-center flex-shrink-0']" />
                    <span>{{ section.label }}</span>
                </NuxtLink>

                <!-- Sections with sub-items: accordion header + collapsible items -->
                <template v-else-if="section.items.length > 0">
                    <button
                        type="button"
                        class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        :class="
                            isSectionActive(section)
                                ? 'text-surface-900 dark:text-surface-50'
                                : 'text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 hover:text-surface-800 dark:hover:text-surface-100'
                        "
                        data-testid="sidebar-section"
                        @click="toggleSection(section)"
                    >
                        <i
                            :class="[section.icon || 'pi pi-circle', 'text-sm w-4 text-center flex-shrink-0']"
                        />
                        <span class="flex-1 text-left">{{ section.label }}</span>
                        <i
                            class="text-xs text-surface-400 dark:text-surface-500 transition-transform duration-200"
                            :class="
                                expandedSections.has(section.key)
                                    ? 'pi pi-chevron-down'
                                    : 'pi pi-chevron-right'
                            "
                        />
                    </button>

                    <Transition
                        enter-active-class="overflow-hidden transition-all duration-200 ease-out"
                        enter-from-class="max-h-0 opacity-0"
                        enter-to-class="max-h-96 opacity-100"
                        leave-active-class="overflow-hidden transition-all duration-150 ease-in"
                        leave-from-class="max-h-96 opacity-100"
                        leave-to-class="max-h-0 opacity-0"
                    >
                        <div
                            v-if="expandedSections.has(section.key)"
                            class="flex flex-col gap-0.5 ml-3 pl-3 border-l border-surface-200 dark:border-surface-700 mb-1"
                        >
                            <template v-for="item in section.items" :key="item.key">
                                <slot name="item" :item="item" :active="isItemActive(item, section)">
                                    <component
                                        :is="item.to ? 'NuxtLink' : 'div'"
                                        :to="item.to"
                                        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                                        :class="
                                            isItemActive(item, section)
                                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-medium'
                                                : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100'
                                        "
                                        data-testid="sidebar-item"
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
                                    </component>
                                </slot>
                            </template>
                        </div>
                    </Transition>
                </template>
            </template>
        </nav>

        <!-- Caller-provided footer (e.g. a pinned Settings link) -->
        <div class="px-2 pb-3 pt-2 border-t border-surface-200 dark:border-surface-700">
            <slot name="footer" />
        </div>
    </aside>
</template>
