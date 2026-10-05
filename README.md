# alpamayo-design

Alpamayo design system — tokens, Volt/PrimeVue wrappers, `Alp*` components,
brand assets. Ships as a source-shipped Nuxt layer.

## Install

```jsonc
"@alpamayo-solutions/design": "github:alpamayo-solutions/alpamayo-design#semver:^0.1.0"
```

```ts
export default defineNuxtConfig({ extends: ['@alpamayo-solutions/design'] });
```

See [AGENTS.md](./AGENTS.md) for the full consumption + contribution contract.

### Optional workbench layer

Dense, IDE-style application shells can opt into the workbench tokens without
changing the default Alpamayo preset:

```ts
export default defineNuxtConfig({
    extends: ['@alpamayo-solutions/design', '@alpamayo-solutions/design/layers/workbench']
});
```

Apply `alp-workbench` to the application shell. The layer contributes only a
stylesheet, so consumers that extend the base layer alone are unaffected.

Its `--alp-workbench-*` tokens are declared on `:root` rather than on
`.alp-workbench`, because PrimeVue overlays teleport to `document.body` and
would otherwise resolve none of them. Dark mode therefore follows `.dark` on the
document root (as the base theme already does), with `.alp-workbench.dark` still
honoured for a workbench that carries its own theme class.

For rapid cross-repository development, use a local package dependency:

```jsonc
"@alpamayo-solutions/design": "file:../../alpamayo-design"
```

With npm's default `install-links=false`, the installed package is a symlink to
the source checkout. Changes to source-shipped files are then available to the
Nuxt dev server without publishing a package first. Switch the dependency back
to the released package version before production delivery.

## Develop

```bash
npm install
npm run dev            # playground with all stories at /
npm test               # vitest
npm run check:stories  # every component must have a story
npm run design:build   # build Claude Design cards + manifest
```

The Claude Design project is a generated mirror of this repo — see the mirror
rule in AGENTS.md.

### Workbench keyboard navigation

- Tab strips emit `select` for Left/Right, Home/End, Enter/Space and Shift+Tab.
  `Delete` emits `close`; the consumer owns dirty-change confirmation. Forward
  Tab leaves the strip. These shortcuts are scoped to the strip.
- The `tablist` owns only the tabs (through `aria-owns`); each tab's action and
  close buttons sit beside it in the Tab order. Pass `panel-id` to point the
  tabs at the element showing the active tab; `EditorGroup` does this for its
  content, which becomes the `tabpanel` named by the active tab.
- Editor groups emit `focus` when focus enters through the keyboard as well as
  through pointer interaction.
- Sidebar headers support Left/Right collapse/expand; activity buttons support
  Up/Down and Home/End.
- Virtual lists support Up/Down, Home/End and Page Up/Page Down, scrolling and
  focusing the primary native control even across the virtual window. Inputs and
  nested action buttons retain their own keys. `reach-end` asks the caller for
  another cursor page; loading guards and retry behavior remain caller-owned.
  The exposed `focusIndex(index)` restores focus to a loaded row.
- The opt-in `layers/workbench/utils/keyboard.ts` helper `navigateList(event,
selector)` adds vertical navigation to bounded lists of native controls. It
  respects disabled controls, text editing, modifiers and handled events.

### Accessibility of PrimeVue components

The `alpamayo` preset corrects these PrimeVue 4 defaults (global preset and Volt
wrappers alike):

- Select, MultiSelect, Listbox: overlay focus guards are no longer
  `aria-hidden` while focusable (`presets/alpamayo/focus-guard.js`).
- Select, MultiSelect: the filter input is named by `filterPlaceholder`, else
  the PrimeVue locale's `aria.search`, else "Search". Set `aria.search` in the
  app's PrimeVue locale to translate it; override one component with
  `:pt="{ pcFilter: { root: { 'aria-label': '…' } } }"`.
- MultiSelect: the checkbox inside each option is display only (hidden from
  assistive technology, not focusable); the option itself carries
  `aria-selected` and takes the click.

Material Symbols inside a named control: write
`<span class="material-symbols-outlined" data-icon="close" aria-hidden="true" />`
instead of putting the ligature name in the text, so the name is neither read
out nor compared with the control's label.

Known gap: Dialog and Drawer focus traps (`primevue/focustrap`) still create
`aria-hidden` focus guards with `tabindex="0"` (primefaces/primevue#7949). The
directive builds them in DOM code with no pass-through, so the preset cannot
change them; only patching the directive object would. axe-core 4.14 does not
report them on an open modal Dialog.
