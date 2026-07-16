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
