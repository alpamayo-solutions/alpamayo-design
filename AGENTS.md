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

- **Shell + wrapper components (tier 3)** — four presentational shells added in
  phase 3c. All four are emit-only: no network, no persistence, no app-specific
  types. They render whatever plain-data props they're given and let the caller
  (or a thin app-side wrapper) own I/O and app-type mapping — same discipline as
  the nav-chrome gating rule above.
    - `AlpMemberPicker.vue` — inline single-select member dropdown (avatar/label
      chip → popup menu). Exports the shared `MemberOption` type
      (`{ id, label, avatar?, sublabel? }`); takes `options: MemberOption[]`,
      `modelValue: string | null`, optional `placeholder`/`disabled`; emits
      `update:modelValue`. An explicit "unassigned" entry is always offered.
    - `AlpMemberFilter.vue` — multi-select member filter (board-toolbar style).
      Same `MemberOption[]` shape via `options`, `modelValue: string[]`; emits
      `update:modelValue`. Selected value renders as up to 3 stacked
      avatars/initials plus a `+N` overflow marker — **never names** in the
      collapsed value, regardless of `MemberOption.label`.
    - `AlpQuickCreateCard.vue` — title input + inline assignee/type/label/
      project pickers, mirroring a typical inline task-quick-create layout.
      Props: `assigneeOptions?: MemberOption[]`, `labelOptions?`,
      `typeOptions?`, `projectOptions?` (>1 entries switch the project field
      from static text to a picker), `projectName?`, `creating?`. Emits
      `create` with the resolved payload (`title`, `assigneeId`, `labelIds`,
      `typeKey?`, `projectSlug?`) and `cancel`. Label creation is app-domain —
      the wrapper resolves `labelOptions`; this shell only ever selects from
      that list. Exposes a **`controls-extra` slot** in the inline-controls
      row as the extensibility point for app-specific controls (e.g. priority,
      due-date pickers) — the consumer owns any injected control's state and
      merges it into its own `create` payload; the shell stays payload-agnostic
      about anything placed there.
    - `AlpShareButton.vue` — trigger button + anchored popover share-link flow
      (TTL-days input, optional password, create/copy/revoke). Props:
      `shareUrl?`, `loading?`, `copied?`, `error?`, `maxTtlDays?` (default 7).
      Emits `create` (`{ ttlDays, password }`), `copy`, `revoke`. No network, no
      clipboard access, no `copied`-reset timer — the wrapper owns link
      creation, the clipboard write, and resetting `copied`, then reflects
      `loading`/`copied`/`error`/`shareUrl` back down as props. The two popover
      states are driven purely by whether `shareUrl` is set. Form-field ids are
      generated per-instance with Vue's `useId()` so two instances on one page
      never collide on `<label for>` association.
    - `useAlpServerTable` (`composables/useAlpServerTable.ts`) — framework-
      agnostic server-table state machine. Takes a caller-supplied
      `fetch: (params: ServerTableFetchParams) => Promise<{ items: T[]; total: number }>`
      (page/pageSize/sort/filters in, items/total out) plus optional
      `pageSize`/`initialSort`; holds no knowledge of any particular API
      client — `fetch` is the only I/O boundary. Owns `page`/`pageSize`/`sort`/
      `filters`/`loading`/`error`/`items`/`total` and drives `fetch` on mount
      and on every state change: immediately for `setPage`/`setSort`,
      debounced (~250ms) for `setFilter` (which also resets to page 1). A
      monotonic request token discards stale responses from a superseded
      fetch, and a failed refresh leaves prior `items`/`total` untouched
      rather than blanking the table. Clears its pending debounce timer on
      unmount so a stale filter-debounce fetch can't fire after the consuming
      component is gone.
    - `AlpAppShell` (`components/alp/nav/AlpAppShell.vue`) gained an
      **`#above-content` slot**, rendered above `<main>` inside the shell's
      content column (only mounted when the slot is used) — for callers that
      need a pinned banner/toolbar (e.g. a stale-data notice, a bulk-action
      bar) above the routed page content without it scrolling away with the
      page.
    - **Consumption pattern:** consumers either use these shells directly with
      plain-data props, or wrap them the same way as the phase-3
      `EntityActionMenu` → `AlpRowActions` pattern — the app wrapper keeps its
      own file name/props/emits, imports the shell, and maps its own app types
      (e.g. an app's `Member`/`User` model) onto the shell's prop shape (e.g.
      `MemberOption`) at the call boundary, forwarding emits back out.

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
