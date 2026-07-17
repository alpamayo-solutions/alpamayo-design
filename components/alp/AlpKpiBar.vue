<template>
    <div class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
        <slot />
    </div>
</template>

<script setup lang="ts">
// Responsive KPI grid — a pure layout shell. Generalized on the move: the
// source (FleetKpiBar) hardcoded five fleet-domain cards (online/offline/
// degraded/total/VPN) with their labels baked into the template, in
// violation of this package's "caller-domain labels come via props" rule.
// AlpKpiBar drops all of that: it just lays out whatever AlpKpiCard (or
// other) children the caller passes into the default slot, using
// AlpKpiCard's own existing props/slot shape — no new API surface needed.
</script>
