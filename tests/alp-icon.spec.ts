import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AlpIcon from '../components/alp/AlpIcon.vue';
import { ALP_ICON_IDS } from '../composables/alpIconIds';
import { alpIconId, isAlpIcon } from '../composables/alpIcons';
import { renderAlpIcons } from '../scripts/build-alp-icons.mjs';
import ActivityRail from '../layers/workbench/components/ActivityRail.vue';
import ContextMenu from '../layers/workbench/components/ContextMenu.vue';
import TabStrip from '../layers/workbench/components/TabStrip.vue';

const root = join(__dirname, '..');
const source = join(root, 'assets/icons/alp');
const manifest = JSON.parse(readFileSync(join(source, 'manifest.json'), 'utf8'));

const VoltButton = { template: '<button type="button"><slot /></button>' };
const VoltMenu = {
    props: ['model'],
    template:
        '<ul><li v-for="item in model" :key="item.id"><slot name="itemicon" :item="item" />{{ item.label }}</li></ul>'
};
const global = { components: { VoltButton, VoltMenu } };

describe('icon source', () => {
    it('keeps the committed output equal to what the source generates', () => {
        for (const [path, content] of Object.entries(renderAlpIcons())) {
            expect(readFileSync(join(root, path), 'utf8'), path).toBe(content);
        }
    });

    it('lists every drawing of both variants in the generated ids', () => {
        const expected = Object.keys(manifest).sort();
        expect(ALP_ICON_IDS).toEqual(expected);
        for (const variant of ['detail', 'small']) {
            const drawn = readdirSync(join(source, variant)).map((file) => file.replace('.svg', ''));
            expect(drawn.sort()).toEqual(expected);
        }
    });

    it('gives each id one symbol in each sprite, with accent parts on the variable', () => {
        for (const variant of ['detail', 'small']) {
            const sprite = readFileSync(join(root, `public/icons/alp-${variant}.svg`), 'utf8');
            const ids = [...sprite.matchAll(/<symbol id="([^"]+)"/g)].map((match) => match[1]);
            expect(ids).toEqual([...ALP_ICON_IDS]);
            expect(sprite).toContain('var(--icon-accent, currentColor)');
            expect(sprite).not.toContain('class=');
        }
    });
});

describe('protocol icons', () => {
    it('are drawings on currentColor and the accent, with no embedded image', () => {
        for (const variant of ['detail', 'small']) {
            const sprite = readFileSync(join(root, `public/icons/alp-${variant}.svg`), 'utf8');
            expect(sprite).not.toContain('<image');
        }
    });
});

describe('icon strings', () => {
    it('fits every icon into what the PREKIT server accepts and maps it back', () => {
        for (const id of ALP_ICON_IDS) {
            const name = `alp_${id.replaceAll('-', '_')}`;
            expect(name).toMatch(/^[a-z0-9_]{1,64}$/);
            expect(isAlpIcon(name)).toBe(true);
            expect(alpIconId(name)).toBe(id);
        }
    });

    it('rejects strings that are not icons in the set', () => {
        for (const value of [
            'pi pi-box',
            'opc-ua',
            'alp_opc-ua',
            'alp_',
            'alp_no_such_icon',
            '',
            undefined,
            7
        ]) {
            expect(isAlpIcon(value)).toBe(false);
            expect(alpIconId(value)).toBeUndefined();
        }
    });
});

describe('AlpIcon', () => {
    it('references the small sprite by default and hides from assistive technology', () => {
        const svg = mount(AlpIcon, { props: { name: 'opc-ua' } }).get('svg');
        expect(svg.attributes('aria-hidden')).toBe('true');
        expect(svg.get('use').attributes('href')).toBe('/icons/alp-small.svg#opc-ua');
    });

    it('references the sprite of the requested variant at the requested size', () => {
        const svg = mount(AlpIcon, { props: { name: 'mqtt', variant: 'detail', size: 28 } }).get('svg');
        expect(svg.get('use').attributes('href')).toBe('/icons/alp-detail.svg#mqtt');
        expect(svg.attributes('width')).toBe('28');
        expect(svg.attributes('height')).toBe('28');
    });
});

describe('workbench surfaces', () => {
    const rail = (icon: string) =>
        mount(ActivityRail, { props: { items: [{ id: 'one', label: 'One', icon }] }, global });
    const strip = (icon: string, actionIcon = 'pi pi-box') =>
        mount(TabStrip, {
            props: {
                activeId: 'one',
                tabs: [
                    {
                        id: 'one',
                        label: 'One',
                        icon,
                        actions: [{ id: 'act', label: 'Act', icon: actionIcon }]
                    }
                ]
            },
            global
        });

    it('draws an alp_ rail icon detailed at 28 px', () => {
        const wrapper = rail('alp_opc_ua');
        expect(wrapper.get('use').attributes('href')).toBe('/icons/alp-detail.svg#opc-ua');
        expect(wrapper.get('svg').attributes('width')).toBe('28');
        expect(wrapper.find('i').exists()).toBe(false);
    });

    it('keeps other rail icons as an icon class', () => {
        const wrapper = rail('pi pi-box');
        expect(wrapper.find('svg').exists()).toBe(false);
        expect(wrapper.get('i').classes()).toEqual(['pi', 'pi-box']);
    });

    it('draws an alp_ tab icon small', () => {
        const wrapper = strip('alp_mqtt');
        expect(wrapper.get('[data-testid="workbench-tab"] use').attributes('href')).toBe(
            '/icons/alp-small.svg#mqtt'
        );
    });

    it('keeps other tab icons as an icon class', () => {
        const wrapper = strip('pi pi-chart-line');
        expect(wrapper.find('svg').exists()).toBe(false);
        expect(wrapper.get('i').classes()).toEqual(['pi', 'pi-chart-line']);
    });

    it('draws an alp_ tab action icon', () => {
        const action = strip('pi pi-box', 'alp_sync').get('[data-tab-action="act"]');
        expect(action.get('use').attributes('href')).toBe('/icons/alp-small.svg#sync');
    });

    it('draws alp_ menu icons and leaves a menu of icon classes to PrimeVue', () => {
        const menu = (icon: string) =>
            mount(ContextMenu, { props: { items: [{ id: 'one', label: 'One', icon }] }, global });
        expect(menu('alp_sync').get('use').attributes('href')).toBe('/icons/alp-small.svg#sync');
        expect(menu('pi pi-box').find('[data-pc-section="itemicon"]').exists()).toBe(false);
    });
});
