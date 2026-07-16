#!/usr/bin/env node
// Post-process playground generate output into self-contained @dsCard HTML + components.json.
import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { transform as lightningTransform } from 'lightningcss';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(root, 'design-sync/dist');
const PUB = join(root, 'playground/.output/public');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const commit = execSync('git rev-parse HEAD', { cwd: root }).toString().trim();

if (!existsSync(join(PUB, 'story'))) {
    console.error('No generate output. Run: npm run generate');
    process.exit(1);
}

// Parse story metadata (title/group/etc.) straight from the story files.
function parseStory(id) {
    const storyPath = join(root, 'stories', `${id}.story.ts`);
    if (!existsSync(storyPath)) {
        console.error(`Story file missing for generated route: ${id} (stories/${id}.story.ts)`);
        process.exit(1);
    }
    const src = readFileSync(storyPath, 'utf8');
    const g = (re) => src.match(re)?.[1] ?? null;
    return {
        component: g(/component:\s*'([^']+)'/),
        group: g(/group:\s*'([^']+)'/),
        title: g(/title:\s*'([^']+)'/),
        sourcePath: g(/sourcePath:\s*'([^']+)'/),
        snippet: (g(/snippet:\s*'((?:[^'\\]|\\.)*)'/) ?? g(/snippet:\s*"((?:[^"\\]|\\.)*)"/) ?? '').replace(
            /\\n/g,
            '\n'
        ),
        // Variant names sit at a fixed 12-space indent as the first key of each `variants[]` entry
        // (`variants: [ { name: '...', props: {...} } ]`). Anchoring to that indent avoids
        // over-matching `name:` keys that appear *inside* a variant's `props` object (several
        // stories pass a `name` prop, e.g. AlpBillingRow/AlpEnergyBar/AlpOrgCard), which always
        // sit one level deeper (16+ spaces).
        variants: [...src.matchAll(/^ {12}name: '([^']+)'/gm)].map((m) => m[1])
    };
}

// Cards must stay well under the platform's upsert size expectations. Only the custom
// alp-icons woff (39K, not available on any CDN) is worth inlining as a data URI — inlining
// all 18 Poppins weights + Material Symbols woff2 blew every card up to ~4.5M. Poppins and
// Material Symbols load from Google Fonts instead, same as the interim hand-built library.
const GOOGLE_FONTS_IMPORTS =
    "@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');\n" +
    "@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');\n";

// The Design System pane renders cards through a sanitizer/shadow context that drops or
// inerts modern CSS: @layer blocks (which hold ~all Tailwind 4 utilities), @property
// declarations (which establish the --tw-* variable defaults), and native nesting.
// Lower all of it to plain, boring CSS the pane provably renders (the interim hand-written
// library used exactly that):
//   1. @property --x { initial-value: V } → collected into one `:root, :host { --x: V }` rule.
//   2. @layer blocks unwrapped in place (source order already encodes the cascade we want).
//   3. lightningcss with older browser targets compiles away native nesting and static
//      modern color syntax (oklab/oklch). var()-dependent color-mix() stays — the pane
//      rendered the interim library's color-mix() fine.
function compatCss(css) {
    const rootVars = [];
    const ast = postcss.parse(css);
    ast.walkAtRules('property', (at) => {
        const name = at.params.trim();
        let initial = null;
        at.walkDecls('initial-value', (d) => {
            initial = d.value;
        });
        if (initial !== null && name.startsWith('--')) rootVars.push(`${name}: ${initial}`);
        at.remove();
    });
    ast.walkAtRules('layer', (at) => {
        if (at.nodes && at.nodes.length) at.replaceWith(at.nodes);
        else at.remove();
    });
    let out = ast.toString();
    if (rootVars.length) out = `:root, :host {\n${rootVars.join(';\n')};\n}\n${out}`;
    out = Buffer.from(
        lightningTransform({
            filename: 'card.css',
            code: Buffer.from(out),
            // chrome 100 / firefox 100 / safari 15.4 — old enough that nesting and modern
            // color syntax get compiled away, new enough to keep grid/flex/custom props.
            targets: { chrome: 100 << 16, firefox: 100 << 16, safari: (15 << 16) | (4 << 8) },
            minify: false,
            errorRecovery: true
        }).code
    ).toString();
    return out;
}

// Inline every same-origin stylesheet into the page.
function inlineCss(html) {
    return html.replace(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g, (tag, href) => {
        if (/^https?:/.test(href)) return tag; // external (none expected)
        const cssPath = join(PUB, href.replace(/^\//, ''));
        if (!existsSync(cssPath)) return tag;
        let css = readFileSync(cssPath, 'utf8');
        // Inline only the alp-icons font url as a data URI; leave Poppins/Material Symbols
        // font urls untouched (their @font-face blocks get dropped below — they're covered
        // by the Google Fonts imports instead).
        css = css.replace(/url\(([^)]+\.(woff2?|ttf))\)/g, (u, fontHref) => {
            const clean = fontHref.replace(/["']/g, '');
            if (!/alpamayo-icons/i.test(clean)) return u;
            const real = clean.startsWith('/') ? join(PUB, clean.slice(1)) : join(dirname(cssPath), clean);
            if (!existsSync(real)) return u;
            const ext = clean.endsWith('.woff2')
                ? 'font/woff2'
                : clean.endsWith('.woff')
                  ? 'font/woff'
                  : 'font/ttf';
            return `url(data:${ext};base64,${readFileSync(real).toString('base64')})`;
        });
        // Drop @font-face blocks that weren't inlined above (Poppins, Material Symbols) —
        // their src still points at a relative /_nuxt/ path that 404s once the card is
        // standalone. The Google Fonts @import covers those families instead.
        css = css.replace(/@font-face\{[^}]*\}/g, (block) => (block.includes('data:font') ? block : ''));
        css = compatCss(css);
        return `<style>${GOOGLE_FONTS_IMPORTS}${css}</style>`;
    });
}

rmSync(OUT, { recursive: true, force: true });
const cards = [];
for (const id of readdirSync(join(PUB, 'story'))) {
    const pagePath = join(PUB, 'story', id, 'index.html');
    if (!existsSync(pagePath)) continue;
    const meta = parseStory(id);
    if (!meta.group) {
        console.error(`Story ${id}: could not parse group`);
        process.exit(1);
    }
    let html = readFileSync(pagePath, 'utf8');
    html = inlineCss(html);
    // Strip nuxt hydration scripts and unused preload/prefetch/payload links — cards are static.
    html = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/<link[^>]+rel="(modulepreload|preload|prefetch)"[^>]*>/g, '');
    const cardMeta = {
        package: pkg.name,
        version: pkg.version,
        commit,
        component: meta.component,
        sourcePath: meta.sourcePath,
        story: `stories/${id}.story.ts`,
        snippet: meta.snippet
    };
    const relPath = `${meta.group.toLowerCase()}/${id}.html`;
    const out = `<!-- @dsCard group="${meta.group}" -->\n<!-- @dsMeta ${JSON.stringify(cardMeta)} -->\n${html}`;
    mkdirSync(join(OUT, dirname(relPath)), { recursive: true });
    writeFileSync(join(OUT, relPath), out);
    cards.push({
        path: relPath,
        group: meta.group,
        type: meta.group === 'Foundations' ? 'foundation' : 'component',
        title: meta.title ?? id,
        component: meta.component,
        sourcePath: meta.sourcePath ?? '',
        story: `stories/${id}.story.ts`,
        variants: meta.variants,
        snippet: meta.snippet
    });
}

const manifest = {
    package: pkg.name,
    version: pkg.version,
    commit,
    generatedAt: new Date().toISOString(),
    cards: cards.sort((a, b) => a.path.localeCompare(b.path))
};
writeFileSync(join(OUT, 'components.json'), JSON.stringify(manifest, null, 2));

// Also emit the Design System pane's own card index. The pane renders from a compiled
// _ds_manifest.json; the platform's self-check does not reliably recompile it after an
// upsert replaces cards, which leaves the pane showing a stale card list. Shipping the
// index with the bundle (and upserting it) makes the pane state deterministic.
const projectCfg = JSON.parse(readFileSync(join(root, 'design-sync/project.json'), 'utf8'));
const dsManifest = {
    namespace: projectCfg.dsNamespace,
    components: [],
    startingPoints: [],
    cards: manifest.cards.map((c) => ({ path: c.path, group: c.group })),
    templates: [],
    hasThumbnailHtml: false,
    globalCssPaths: [],
    tokens: [],
    themes: [],
    fonts: [],
    brandFonts: [],
    source: 'spa'
};
writeFileSync(join(OUT, '_ds_manifest.json'), JSON.stringify(dsManifest));
console.log(`Built ${cards.length} cards → design-sync/dist/`);
