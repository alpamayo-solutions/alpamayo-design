import { defineStory } from './_types';

export default defineStory({
    component: 'AlpNavbar',
    group: 'Signature',
    title: 'Navbar',
    description:
        'Pure slot shell for the app topbar band — #brand, #center, #actions slots plus a built-in mobile hamburger toggle (v-model:mobileMenuOpen) meant to drive an AlpMobileDrawer.',
    variants: [
        {
            name: 'default',
            props: {
                mobileMenuOpen: false
            },
            slots: {
                brand: '<span class="text-lg font-bold text-surface-800 dark:text-surface-100">Acme</span>',
                center: '<div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-400 text-sm"><i class="pi pi-search text-xs"></i><span>Search…</span></div>',
                actions:
                    '<i class="pi pi-cog text-surface-500"></i><i class="pi pi-moon text-surface-500"></i>'
            }
        }
    ],
    snippet:
        '<AlpNavbar v-model:mobile-menu-open="mobileMenuOpen">\n  <template #brand><span>Acme</span></template>\n  <template #center><AppSearchButton /></template>\n  <template #actions><AppUserMenu /></template>\n</AlpNavbar>',
    sourcePath: 'components/alp/nav/AlpNavbar.vue'
});
