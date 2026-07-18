import { defineStory } from './_types';

export default defineStory({
    component: 'AlpIconRail',
    group: 'Signature',
    title: 'Icon Rail',
    description:
        'Desktop-only primary-900 icon rail — one entry per top-level NavSection, emits select(key) on click, #footer slot pinned at the bottom (e.g. a Settings link).',
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
                            { key: 'vpn', label: 'VPN', icon: 'pi pi-globe', to: '/fleet/vpn' }
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
                activeKey: 'fleet'
            },
            slots: {
                footer: '<a href="#" class="flex flex-col items-center gap-1 w-full px-1 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"><i class="pi pi-cog text-[15px]"></i><span class="text-[9px] leading-none font-medium">Settings</span></a>'
            }
        }
    ],
    snippet:
        '<AlpIconRail :sections="sections" :active-key="activeKey" @select="onSelect">\n  <template #footer><NuxtLink to="/settings">Settings</NuxtLink></template>\n</AlpIconRail>',
    sourcePath: 'components/alp/nav/AlpIconRail.vue'
});
