import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
            const html = readFileSync(join(dist, card.path), 'utf8');
            expect(html.startsWith('<!-- @dsCard group="'), card.path).toBe(true);
            expect(html, card.path).toContain('@dsMeta');
            expect(html, card.path).toContain('data-story-footer');
            expect(html, card.path).not.toContain('<script');
        }
    });
});
