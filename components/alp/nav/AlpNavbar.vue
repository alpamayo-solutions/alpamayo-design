<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Pure slot shell for the app topbar band — outer bar structure/classes only.
 * The composing app supplies brand, center (e.g. search/project selector), and
 * actions (e.g. locale/theme/user-menu) content; only the mobile hamburger toggle
 * (driving `mobileMenuOpen`, meant to open an AlpMobileDrawer) is built in.
 */
const props = defineProps<{
    mobileMenuOpen: boolean;
}>();

const emit = defineEmits<{
    'update:mobileMenuOpen': [value: boolean];
}>();

const { t } = useI18n();

const mobileMenuOpenModel = computed({
    get: () => props.mobileMenuOpen,
    set: (value: boolean) => emit('update:mobileMenuOpen', value)
});
</script>

<template>
    <header
        class="flex items-center h-14 px-2 pt-0 pb-0 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-2 md:pt-2 flex-shrink-0 relative z-50 bg-white dark:bg-surface-950 md:bg-transparent border-b border-surface-200 dark:border-surface-800 md:border-b-0"
    >
        <!-- Left: mobile hamburger + brand (brand hidden on mobile — the drawer carries its own) -->
        <div class="flex items-center gap-1 flex-shrink-0 md:w-60">
            <VoltButton
                type="button"
                severity="ghost"
                text
                icon="pi pi-bars"
                class="md:hidden !h-9 !w-9 !p-0"
                :aria-label="t('design.nav.toggleMenu')"
                data-testid="navbar-mobile-toggle"
                @click="mobileMenuOpenModel = !mobileMenuOpenModel"
            />

            <div class="hidden md:flex items-center gap-0 flex-shrink-0 mr-3">
                <slot name="brand" />
            </div>
        </div>

        <!-- Center + actions (desktop only) -->
        <div class="hidden md:flex min-w-0 flex-1 items-center gap-3">
            <div class="min-w-0 flex-1">
                <slot name="center" />
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
                <slot name="actions" />
            </div>
        </div>
    </header>
</template>
