# AGENTS.md — alpamayo-design

## What this is

The **source of truth for the Alpamayo design system**: design tokens, Volt (PrimeVue
pass-through) wrappers, presentational `Alp*` components, the `alpamayo` PrimeVue
preset, brand assets (logos, favicon), and fonts (Poppins, alp-icons, Material
Symbols). Ships as a source-shipped **Nuxt layer**: `@alpamayo-solutions/design`.

This repo is **public**. Never commit customer-identifiable content — not in code,
demo copy, stories, docs, or commit messages.

## How to consume

```jsonc
// package.json — no registry, no token (public repo, git tags):
"@alpamayo-solutions/design": "github:alpamayo-solutions/alpamayo-design#semver:^0.1.0"
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    extends: ['@alpamayo-solutions/design']
});
```

```css
/* your tailwind entry */
@import 'tailwindcss';
@import 'tailwindcss-primeui';
@import '@alpamayo-solutions/design/assets/css/tailwind.css';
```

- Peer deps you must have: `vue`, `primevue`, `vue-i18n`, `tailwind-merge`,
  `tailwindcss-primeui`, `primeicons`.
- Design cards load Poppins/Material Symbols from Google Fonts; only the custom alp-icons font is embedded.
- The layer auto-imports `Volt*` and `Alp*` components, applies the PrimeVue
  unstyled config + `alpamayo` preset, registers `v-tooltip`/`v-badge`/
  `v-styleclass`/`v-animateonscroll` and Toast/Confirmation services, loads the
  design tokens CSS, and serves brand assets at `/brand/...` + `/favicon.ico`.
- If you use `@nuxtjs/i18n`, the layer's `design.*` keys merge automatically;
  without it, `AlpFilterChip`/`AlpListToolbar` need a vue-i18n instance providing
  those keys.

## Component discipline (for agents building UIs)

1. Components over raw HTML — every button/input/card/badge comes from this
   package (`VoltButton`, `AlpCard`, …).
2. Severity/size/variant props first; Tailwind color classes only where no prop
   covers it.
3. Every user-visible string goes through `t()` in the consuming app.
4. To find the right component: check the Claude Design project — every card's
   footer names its component, source path, package version, and a snippet. The
   `components.json` in the Design project maps card → component machine-readably.
5. **Never copy card HTML into an app.** Cards are rendered previews of these
   components, not code.

## How to change the design system

1. Change/add the component in `components/`, its story in `stories/`, and tests.
   CI enforces story completeness (`npm run check:stories`).
2. `npm test && npm run generate && npm run typecheck` must pass.
3. Commit with `PATCH:` (fixes/tweaks) or `MINOR:` (new components/capabilities)
   to release; plain subjects don't release.
4. Rebuild + upsert the Claude Design mirror: `npm run design:build`, then run
   `/design-upsert` in Claude Code.
5. Never hand-edit `design-sync/dist/`.

## The mirror rule (IMPORTANT)

**claude.ai/design is a generated mirror; this repo is the source of truth.**
Any change made in the Claude Design project — an edited card, a prototyped
variant, a new pattern sketched there — MUST be ported back into this repo as a
component + story change, rebuilt, and re-upserted. Un-ported Design-side edits
are overwritten by the next `/design-upsert`. If you find a Design-side edit that
isn't in this repo, treat it as an open change request: port it or flag it —
never silently discard it.

## Releasing

CI (GitHub Actions) on `main`: commit subjects starting with `MINOR:`/`PATCH:`
bump the version, tag `vX.Y.Z`, and publish a GitHub Release with the packed
tarball + design-sync bundle. Consumers track via `#semver:` ranges.
