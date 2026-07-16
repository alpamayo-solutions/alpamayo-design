import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import en from '../i18n/locales/en/design.json';
import type { Story } from '../stories/_types';

const stories = import.meta.glob<{ default: Story }>('../stories/*.story.ts', { eager: true });
const comps = import.meta.glob<{ default: unknown }>('../components/{volt,alp}/*.vue', { eager: true });

function resolveComp(name: string) {
    for (const [path, mod] of Object.entries(comps)) {
        const file = path.split('/').pop()!.replace('.vue', '');
        if ((path.includes('/volt/') ? `Volt${file}` : file) === name) return (mod as any).default;
    }
    return null;
}

const globalConfig = {
    plugins: [
        [PrimeVue, { unstyled: true }],
        ToastService,
        ConfirmationService,
        createI18n({ legacy: false, locale: 'en', messages: { en } })
    ],
    directives: { tooltip: Tooltip, badge: {}, styleclass: {}, animateonscroll: {} },
    stubs: { NuxtLink: { template: '<a><slot /></a>' }, teleport: true },
    components: Object.fromEntries(
        Object.entries(comps).map(([path, mod]) => {
            const file = path.split('/').pop()!.replace('.vue', '');
            return [path.includes('/volt/') ? `Volt${file}` : file, (mod as any).default];
        })
    )
};

describe('every story variant mounts', () => {
    for (const [path, mod] of Object.entries(stories)) {
        const id = path.split('/').pop()!.replace('.story.ts', '');
        const story = mod.default;
        if (!story.component) continue;
        const comp = resolveComp(story.component);
        it(`${id} resolves ${story.component}`, () => {
            expect(comp).toBeTruthy();
        });
        for (const v of story.variants) {
            it(`${id} / ${v.name}`, () => {
                const w = mount(comp as any, {
                    props: v.props as any,
                    slots: (v.slots as any) ?? {},
                    global: globalConfig as any
                });
                expect(w.html().length).toBeGreaterThan(0);
            });
        }
    }
});
