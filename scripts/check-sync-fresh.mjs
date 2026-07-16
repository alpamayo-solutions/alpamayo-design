#!/usr/bin/env node
// Fails if design-sync/dist is missing or stale relative to HEAD + working tree.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = join(root, 'design-sync/dist/components.json');
if (!existsSync(manifestPath)) {
    console.error('STALE: design-sync/dist missing. Run: npm run design:build');
    process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const head = execSync('git rev-parse HEAD', { cwd: root }).toString().trim();
const dirty = execSync('git status --porcelain -- components assets presets stories i18n', { cwd: root })
    .toString()
    .trim();
if (manifest.commit !== head || dirty) {
    console.error(
        `STALE: manifest commit ${manifest.commit.slice(0, 7)} vs HEAD ${head.slice(0, 7)}${dirty ? ' (working tree dirty)' : ''}. Run: npm run design:build`
    );
    process.exit(1);
}
console.log('FRESH');
