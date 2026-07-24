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
scoped stylesheet, so consumers that extend the base layer alone are unaffected.

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
