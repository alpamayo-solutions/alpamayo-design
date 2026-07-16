<template>
    <div class="min-h-screen bg-surface-50 p-8 space-y-4">
        <h1 class="text-xl font-bold text-surface-900">alpamayo-design playground</h1>
        <div class="flex gap-3">
            <VoltButton label="Primary" />
            <VoltButton label="Danger" severity="danger" />
            <VoltTag value="Deployed" severity="success" />
        </div>
        <NuxtPage />
    </div>
</template>
