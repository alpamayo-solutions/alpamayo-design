import { defineStory } from './_types';

export default defineStory({
    component: 'AlpSidebar',
    group: 'Signature',
    title: 'Sidebar',
    description:
        'Desktop accordion sidebar — direct links for sections with no items, expand/collapse accordion for sections with items, active state from activePath (falls back to the current route), #item scoped-slot escape hatch, #footer slot pinned at the bottom.',
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
                    }
                ],
                activePath: '/fleet/vpn'
            },
            slots: {
                footer: '<a href="#" class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-surface-500 dark:text-surface-400"><i class="pi pi-cog text-sm w-4 text-center flex-shrink-0"></i><span>Settings</span></a>'
            }
        }
    ],
    snippet:
        '<AlpSidebar :sections="sections" :active-path="route.path">\n  <template #footer><NuxtLink to="/settings">Settings</NuxtLink></template>\n</AlpSidebar>',
    sourcePath: 'components/alp/nav/AlpSidebar.vue'
});
