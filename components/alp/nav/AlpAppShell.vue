<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import AlpNavbar from './AlpNavbar.vue';
import AlpIconRail from './AlpIconRail.vue';
import AlpSidebar from './AlpSidebar.vue';
import AlpMobileDrawer from './AlpMobileDrawer.vue';
import type { NavSection } from './AlpSidebar.vue';

/**
 * Composes the four nav-chrome parts (navbar, icon rail, sidebar, mobile drawer) with the
 * same responsive orchestration as the source app layout: everything is CSS-responsive
 * (`md:` classes baked into the child components) — there are no JS breakpoints here.
 *
 * Desktop (`md:`): AlpNavbar on top; below it, AlpIconRail + a bordered panel containing
 * AlpSidebar and the content panel, laid out side by side.
 * Mobile: rail + sidebar are hidden (their own `hidden md:flex`); the navbar's built-in
 * hamburger toggles an internal `mobileMenuOpen` ref that drives AlpMobileDrawer.
 */
const props = defineProps<{
    sections: NavSection[];
    railSections?: NavSection[];
    activeKey?: string;
    activePath?: string;
}>();

const effectiveRailSections = computed(() => props.railSections ?? props.sections);

const mobileMenuOpen = ref(false);

// Rail active-key: caller-driven via `activeKey`, but updated immediately on selection so
// the rail highlights without waiting for the caller to re-render with a new prop.
const internalActiveKey = ref(props.activeKey);
watch(
    () => props.activeKey,
    (value) => {
        internalActiveKey.value = value;
    }
);

// Rail select -> sidebar interplay: selecting a rail entry that has no direct route (a
// grouping section, e.g. "Fleet") can't navigate on its own, so we feed AlpSidebar an
// `active-path` override pointing at the matching section (or its first item) — AlpSidebar
// derives its own expand state from `activePath`, so this expands the section without
// reaching into AlpSidebar's internals. The override is cleared as soon as the caller's
// `activePath` prop actually changes (i.e. real navigation happened).
const sidebarActivePathOverride = ref<string | undefined>();
const effectiveActivePath = computed(() => sidebarActivePathOverride.value ?? props.activePath);

watch(
    () => props.activePath,
    () => {
        sidebarActivePathOverride.value = undefined;
    }
);

const sidebarRef = ref<InstanceType<typeof AlpSidebar> | null>(null);

async function handleRailSelect(key: string) {
    internalActiveKey.value = key;

    const fullSection =
        props.sections.find((s) => s.key === key) ?? effectiveRailSections.value.find((s) => s.key === key);
    const targetPath = fullSection?.to ?? fullSection?.items[0]?.to;
    if (targetPath) {
        sidebarActivePathOverride.value = targetPath;
    }

    // Scroll the (possibly long, accordion-expanded) sidebar back into view.
    await nextTick();
    const el = sidebarRef.value?.$el as HTMLElement | undefined;
    el?.scrollTo?.({ top: 0, behavior: 'smooth' });
}
</script>

<template>
    <div class="flex flex-col h-screen overflow-hidden bg-white dark:bg-surface-950">
        <AlpNavbar v-model:mobile-menu-open="mobileMenuOpen">
            <template #brand><slot name="navbar-brand" /></template>
            <template #center><slot name="navbar-center" /></template>
            <template #actions><slot name="navbar-actions" /></template>
        </AlpNavbar>

        <!-- Body: desktop = padding wraps rail + panel; mobile = edge-to-edge -->
        <div class="flex flex-1 overflow-hidden md:px-2 md:pb-2 md:pt-1 md:gap-2">
            <AlpIconRail
                :sections="effectiveRailSections"
                :active-key="internalActiveKey"
                @select="handleRailSelect"
            />

            <!-- Unified panel: accordion sidebar + main content, one rounded unit -->
            <div
                class="flex flex-1 overflow-hidden md:rounded-xl md:border md:border-surface-200 md:dark:border-surface-700 bg-white dark:bg-surface-900"
            >
                <AlpSidebar ref="sidebarRef" :sections="sections" :active-path="effectiveActivePath">
                    <template #footer><slot name="sidebar-footer" /></template>
                </AlpSidebar>

                <!-- Main content -->
                <div
                    class="flex flex-col flex-1 min-w-0 dark:text-surface-100 overflow-hidden bg-white dark:bg-surface-900"
                >
                    <main class="flex-1 overflow-y-auto overflow-x-clip p-4 sm:p-6">
                        <slot />
                    </main>
                </div>
            </div>
        </div>
    </div>

    <AlpMobileDrawer :sections="sections" v-model:open="mobileMenuOpen">
        <template #brand><slot name="navbar-brand" /></template>
        <template #footer><slot name="drawer-footer" /></template>
    </AlpMobileDrawer>
</template>
