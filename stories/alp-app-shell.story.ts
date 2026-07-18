import { defineStory } from './_types';

export default defineStory({
    component: 'AlpAppShell',
    group: 'Signature',
    title: 'App Shell',
    description:
        'Composes the four nav-chrome parts (navbar, icon rail, sidebar, mobile drawer) with the same CSS-only responsive orchestration as the source app layout — no JS breakpoints. Desktop shows navbar + icon rail + accordion sidebar + content panel side by side; mobile hides rail/sidebar and wires the navbar hamburger to the mobile drawer. Resize the preview to see the cutover.',
    variants: [
        {
            name: 'default',
            props: {
                sections: [
                    { key: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', to: '/', items: [] },
                    {
                        key: 'fleet',
                        label: 'Fleet',
                        icon: 'pi pi-server',
                        items: [
                            { key: 'devices', label: 'Devices', icon: 'pi pi-box', to: '/fleet/devices' },
                            { key: 'vpn', label: 'VPN', icon: 'pi pi-globe', to: '/fleet/vpn', badge: 3 }
                        ]
                    },
                    {
                        key: 'projects',
                        label: 'Projects',
                        icon: 'pi pi-folder',
                        items: [
                            {
                                key: 'active',
                                label: 'Active',
                                icon: 'pi pi-check-circle',
                                to: '/projects/active'
                            }
                        ]
                    },
                    {
                        key: 'settings',
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        to: '/settings',
                        items: []
                    }
                ],
                activePath: '/fleet/vpn'
            },
            slots: {
                'navbar-brand':
                    '<div class="flex items-center gap-2"><i class="pi pi-box text-xl text-primary-600"></i><span class="text-lg font-bold text-surface-800 dark:text-surface-100">Acme</span></div>',
                'navbar-center':
                    '<button type="button" class="flex items-center gap-2 px-3 py-0 h-8 w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-400 dark:text-surface-500 text-sm"><i class="pi pi-search text-xs"></i><span class="flex-1 text-left">Search…</span></button>',
                'navbar-actions':
                    '<i class="pi pi-moon text-surface-500 dark:text-surface-400 px-2"></i><i class="pi pi-cog text-surface-500 dark:text-surface-400 px-2"></i>',
                'sidebar-footer':
                    '<a href="#" class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-surface-500 dark:text-surface-400"><i class="pi pi-question-circle text-sm w-4 text-center flex-shrink-0"></i><span>Help</span></a>',
                'drawer-footer':
                    '<a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-surface-700 dark:text-surface-200"><i class="pi pi-question-circle text-base w-5 text-center flex-shrink-0"></i><span>Help</span></a>',
                default:
                    '<div class="rounded-xl border border-dashed border-surface-300 dark:border-surface-700 p-8 text-center text-sm text-surface-400 dark:text-surface-500">Page content goes here</div>'
            }
        }
    ],
    snippet:
        '<AlpAppShell :sections="sections" :active-path="route.path">\n  <template #navbar-brand><span>Acme</span></template>\n  <template #navbar-center><SearchButton /></template>\n  <template #navbar-actions><ThemeToggle /></template>\n  <template #sidebar-footer><NuxtLink to="/settings">Settings</NuxtLink></template>\n  <template #drawer-footer><NuxtLink to="/settings">Settings</NuxtLink></template>\n\n  <!-- default slot: page content -->\n  <PageBody />\n</AlpAppShell>',
    sourcePath: 'components/alp/nav/AlpAppShell.vue'
});
