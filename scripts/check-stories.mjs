#!/usr/bin/env node
// Every component in components/{volt,alp} (including nested subdirectories, e.g.
// components/alp/nav/) must have a story referencing it.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function findVueFiles(dir) {
    const files = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) files.push(...findVueFiles(full));
        else if (entry.name.endsWith('.vue')) files.push(full);
    }
    return files;
}

const components = [];
for (const dir of ['components/volt', 'components/alp']) {
    for (const f of findVueFiles(join(root, dir))) {
        const name = f.split('/').pop().replace('.vue', '');
        components.push(dir.includes('volt') ? `Volt${name}` : name);
    }
}
const storyDir = join(root, 'stories');
const covered = new Set();
for (const f of readdirSync(storyDir)) {
    if (!f.endsWith('.story.ts')) continue;
    const src = readFileSync(join(storyDir, f), 'utf8');
    const m = src.match(/component:\s*'([^']+)'/);
    if (m) covered.add(m[1]);
    // additional components exercised in one story: `// also-covers: VoltTabList, VoltTab`
    for (const extra of src.matchAll(/also-covers:\s*([A-Za-z0-9, ]+)/g)) {
        extra[1].split(',').forEach((n) => covered.add(n.trim()));
    }
}
const missing = components.filter((c) => !covered.has(c));
if (missing.length) {
    console.error(`Missing stories for ${missing.length} component(s):\n  ${missing.join('\n  ')}`);
    process.exit(1);
}
console.log(`All ${components.length} components covered by stories.`);
