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

- **All `@import`s must precede any other statement** (including `@plugin`).
  Vite's postcss-import runs before Tailwind and silently DROPS any `@import`
  that follows a non-import statement — a misplaced `@plugin` line deletes this
  package's entire stylesheet from production builds with no error.

- Peer deps you must have — **pin the majors**; npm-latest PrimeVue is v5, which
  this layer does not support yet, and npm installs mismatched peers with only a
  warning:

    ```bash
    npm install primevue@^4.5.4 primeicons@^7.0.0 vue-i18n@^11 tailwind-merge@^3 tailwindcss-primeui@^0.6
    ```

- Design cards load Poppins/Material Symbols from Google Fonts; only the custom alp-icons font is embedded.
- The layer auto-imports `Volt*` and `Alp*` components, applies the PrimeVue
  unstyled config + `alpamayo` preset, registers `v-tooltip`/`v-badge`/
  `v-styleclass`/`v-animateonscroll` and Toast/Confirmation services, loads the
  design tokens CSS, and serves brand assets at `/brand/...` + `/favicon.ico`.
- i18n: the layer does NOT auto-merge locale messages. Import its `design.*`
  keys explicitly in each locale entry and spread them, e.g.
  `import design from '@alpamayo-solutions/design/i18n/locales/en/design.json'`
  → `export default { ...common, ...design }`. `AlpFilterChip`/`AlpListToolbar`
  need those keys in the active vue-i18n instance.
- Deep imports are part of the public contract: consumers import
  `components/volt/*.vue`, `components/alp/*.vue` (incl. type-only imports like
  `AlpListToolbar.vue`'s `FilterChipDef`), and `i18n/locales/*/design.json`
  directly. package.json therefore deliberately ships **no `exports` map** —
  adding one without matching subpath patterns (`"./components/*"`, `"./i18n/*"`,
  `"./assets/*"`) breaks every consumer on their next version bump.

- **Nav chrome** (`components/alp/nav/`) — `AlpNavbar`, `AlpIconRail`,
  `AlpSidebar`, `AlpMobileDrawer`, and `AlpAppShell` (which composes the other
  four with the same responsive orchestration as a typical app layout — CSS-only
  `md:` breakpoints baked into the children, zero JS breakpoints in the shell
  itself). All four data-driven parts share one contract, exported from
  `AlpSidebar.vue`:

    ```ts
    export interface NavItem {
        key: string;
        label: string;
        icon?: string;
        to?: string;
        badge?: string | number;
        children?: NavItem[];
    }
    export interface NavSection {
        key: string;
        label?: string;
        icon?: string;
        to?: string;
        items: NavItem[];
    }
    ```

    **Gating is entirely the consuming app's responsibility.** These components
    render whatever `sections`/`items` they're given — they do not know about
    roles, permissions, or feature flags, and per the coupling rule (Global
    Constraints) they never can (`useAuth`/`usePermissions`/`useContextualNav`
    are app-only, not importable from this package). Pre-filter
    `sections`/`items` for the current user/role/platform-scope _before_
    passing them in; the package cannot do that filtering for you and will
    happily render an item that should have been hidden. `AlpAppShell` takes
    `sections` (main nav), an optional `railSections` (defaults to `sections`
    when omitted), `activeKey`, and `activePath`; it owns only the
    mobile-drawer-open state and the rail-select → sidebar-expand interplay —
    no auth state of its own.

- **Table shells** (`components/alp/AlpListTable.vue`, `AlpClientTable.vue`) —
  server/lazy-paginated and client-side `DataTable` wrappers respectively.
  Same props/emits shape as a typical entity list/table pair (`items`,
  `lazy`/`paginator`, `loading`, `rows`, `filters`, `globalFilterFields`,
  `rowTo` + row-click → `navigateTo`, `emptyMessage`). Empty state falls back
  to `design.table.emptyMessage` when the caller doesn't override it via the
  `emptyMessage` prop.

- **Confirm dialog** (`components/alp/AlpConfirmDialog.vue`) — generic
  confirm/cancel modal with an optional notes textarea. Its own copy
  (`design.confirm.cancel`/`confirm`/`notesPlaceholder`) comes from the
  package's i18n keys; `entityName`, `message`, `title`, and `confirmLabel`
  stay caller-supplied props — domain-specific text does not belong in
  `design.*`.

- **Composables** (`composables/`, auto-imported by the layer the same way as
  `Volt*`/`Alp*` components) — `useAlpDarkMode`, `useAlpBlurSensitive`,
  `useAlpAnchoredDropdown`, `useAlpMobileView`, `useAlpMarkdown`,
  `useAlpExportCsv`, `useAlpPlural`. Notably:
    - `useAlpBlurSensitive()` returns `{ blurMode, toggle }` and toggles a
      `.blur-mode` class on `<html>`, persisted via a `blur-sensitive` cookie.
      **Every element that renders customer-identifiable data must carry
      `class="sensitive"`** (org/project/machine names, IPs, serial numbers,
      emails, network CIDRs, hostnames, external IDs) — the package's
      `assets/css/tokens.css` blurs `:root.blur-mode .sensitive` purely via CSS,
      so wiring a screen-share/demo toggle to `toggle()` is the entire
      integration; no per-component blur logic needed.
    - `useAlpDarkMode()` returns `{ isDark, toggleDarkMode, initDarkMode }` and
      keeps the same `theme` cookie name and `darkTheme` state key as the common
      app-side dark-mode pattern it was extracted from, so cutting an app over
      to this composable does not reset users' theme preference.

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
