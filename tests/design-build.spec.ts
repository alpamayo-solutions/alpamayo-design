import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import schema from '../design-sync/schema/components.schema.json';

const root = join(__dirname, '..');
const dist = join(root, 'design-sync/dist');

describe('design-sync build output', () => {
    it.skipIf(!existsSync(dist))('manifest matches schema shape', () => {
        const manifest = JSON.parse(readFileSync(join(dist, 'components.json'), 'utf8'));
        expect(manifest.package).toBe('@alpamayo-solutions/design');
        expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(manifest.commit.length).toBeGreaterThanOrEqual(7);
        expect(manifest.cards.length).toBeGreaterThan(0);
        for (const card of manifest.cards) {
            for (const key of (schema as any).properties.cards.items.required) {
                expect(card, `card ${card.path} missing ${key}`).toHaveProperty(key);
            }
            expect(card.path).toMatch(/^[a-z]+\/[a-z0-9-]+\.html$/);
        }
    });
    it.skipIf(!existsSync(dist))('every card starts with @dsCard and carries @dsMeta + footer', () => {
        const manifest = JSON.parse(readFileSync(join(dist, 'components.json'), 'utf8'));
        for (const card of manifest.cards) {
            const cardPath = join(dist, card.path);
            const html = readFileSync(cardPath, 'utf8');
            expect(html.startsWith('<!-- @dsCard group="'), card.path).toBe(true);
            expect(html, card.path).toContain('@dsMeta');
            expect(html, card.path).toContain('data-story-footer');
            expect(html, card.path).not.toContain('<script');
            expect(html, card.path).not.toContain('<link');
            // Poppins/Material Symbols load from Google Fonts instead of being data-URI
            // inlined — inlining all font weights blew every card up to ~4.5M, far past
            // what the platform upsert expects. Only the custom alp-icons woff is inlined.
            expect(html, card.path).toContain('fonts.googleapis.com');
            expect(statSync(cardPath).size, card.path).toBeLessThan(500_000);
            // The Design pane's renderer strips @layer blocks and inerts @property —
            // the compat pass must have lowered both out of every card.
            expect(html, card.path).not.toContain('@layer');
            expect(html, card.path).not.toContain('@property');
        }
    });
    it.skipIf(!existsSync(dist))('pane card index (_ds_manifest.json) mirrors the manifest', () => {
        const manifest = JSON.parse(readFileSync(join(dist, 'components.json'), 'utf8'));
        const project = JSON.parse(readFileSync(join(root, 'design-sync/project.json'), 'utf8'));
        const index = JSON.parse(readFileSync(join(dist, '_ds_manifest.json'), 'utf8'));
        expect(index.namespace).toBe(project.dsNamespace);
        expect(index.source).toBe('spa');
        expect(index.cards.map((c: { path: string }) => c.path).sort()).toEqual(
            manifest.cards.map((c: { path: string }) => c.path).sort()
        );
    });
});
