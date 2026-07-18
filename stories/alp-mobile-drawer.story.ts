import { defineStory } from './_types';

export default defineStory({
    component: 'AlpMobileDrawer',
    group: 'Signature',
    title: 'Mobile Drawer',
    description:
        'Mobile-only nav drawer (Teleport to body, backdrop + slide-in panel), v-model:open, #brand and #footer slots; accordion sections mirror AlpSidebar, active state from the current route.',
    variants: [
        {
            name: 'open',
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
                    }
                ],
                open: true
            },
            slots: {
                brand: '<span class="text-base font-bold text-surface-800 dark:text-surface-100">Acme</span>',
                footer: '<a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-surface-700 dark:text-surface-200"><i class="pi pi-cog text-base w-5 text-center flex-shrink-0"></i><span>Settings</span></a>'
            }
        }
    ],
    snippet:
        '<AlpMobileDrawer v-model:open="mobileMenuOpen" :sections="sections">\n  <template #brand><span>Acme</span></template>\n  <template #footer><NuxtLink to="/settings">Settings</NuxtLink></template>\n</AlpMobileDrawer>',
    sourcePath: 'components/alp/nav/AlpMobileDrawer.vue'
});
