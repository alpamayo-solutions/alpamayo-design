<template>
    <div
        class="relative rounded-xl border overflow-hidden"
        :class="
            online
                ? 'border-success-200 dark:border-success-900'
                : degraded
                  ? 'border-warning-200 dark:border-warning-900'
                  : 'border-danger-200 dark:border-danger-900'
        "
        :style="{
            background: online ? 'var(--success-50)' : degraded ? 'var(--warning-50)' : 'var(--danger-50)'
        }"
    >
        <div
            class="absolute left-0 top-0 bottom-0 w-1"
            :class="online ? 'bg-success-500' : degraded ? 'bg-warning-500' : 'bg-danger-500'"
        />

        <div class="pl-5 pr-4 pt-4 pb-4">
            <div class="flex items-start justify-between gap-2 mb-3">
                <div class="flex items-center gap-2.5">
                    <div
                        class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
                        :class="
                            online
                                ? 'border-success-200 dark:border-success-800'
                                : degraded
                                  ? 'border-warning-200 dark:border-warning-800'
                                  : 'border-danger-200 dark:border-danger-800'
                        "
                        :style="{
                            background: online
                                ? 'var(--success-100)'
                                : degraded
                                  ? 'var(--warning-100)'
                                  : 'var(--danger-100)'
                        }"
                    >
                        <i
                            class="pi pi-server text-sm"
                            :class="
                                online
                                    ? 'text-success-700 dark:text-success-400'
                                    : degraded
                                      ? 'text-warning-700 dark:text-warning-400'
                                      : 'text-danger-700 dark:text-danger-400'
                            "
                        />
                    </div>
                    <div class="min-w-0">
                        <p
                            class="font-semibold text-sm text-surface-800 dark:text-surface-100 leading-tight truncate sensitive"
                        >
                            {{ name }}
                        </p>
                        <p class="text-xs text-surface-500 mt-0.5 sensitive">{{ org }}</p>
                    </div>
                </div>
                <div
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 border"
                    :class="
                        online
                            ? 'bg-success-100 dark:bg-success-900/40 border-success-200 dark:border-success-800 text-success-700 dark:text-success-400'
                            : degraded
                              ? 'bg-warning-100 dark:bg-warning-900/40 border-warning-200 dark:border-warning-800 text-warning-700 dark:text-warning-400'
                              : 'bg-danger-100 dark:bg-danger-900/40 border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400'
                    "
                >
                    <span class="relative flex h-1.5 w-1.5">
                        <span
                            v-if="online"
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"
                        />
                        <span
                            class="relative inline-flex rounded-full h-1.5 w-1.5"
                            :class="online ? 'bg-success-500' : degraded ? 'bg-warning-500' : 'bg-danger-500'"
                        />
                    </span>
                    {{ online ? 'Online' : degraded ? 'Degraded' : 'Offline' }}
                </div>
            </div>

            <div
                class="border-t mb-3"
                :class="
                    online
                        ? 'border-success-100 dark:border-success-900/30'
                        : degraded
                          ? 'border-warning-100 dark:border-warning-900/30'
                          : 'border-danger-100 dark:border-danger-900/30'
                "
            />

            <div class="flex items-center gap-2 flex-wrap">
                <div
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700"
                >
                    <i class="pi pi-sitemap text-xs text-primary-400" />
                    <span class="text-xs font-bold text-surface-700 dark:text-surface-200">{{ nodes }}</span>
                    <span class="text-xs text-surface-400">nodes</span>
                </div>
                <div
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700"
                >
                    <i class="pi pi-wave-pulse text-xs text-info-400" />
                    <span class="text-xs font-bold text-surface-700 dark:text-surface-200">{{
                        sensors
                    }}</span>
                    <span class="text-xs text-surface-400">sensors</span>
                </div>
                <div
                    v-if="alerts > 0"
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800"
                >
                    <i class="pi pi-exclamation-triangle text-xs text-warning-600 dark:text-warning-400" />
                    <span class="text-xs font-bold text-warning-700 dark:text-warning-300">{{ alerts }}</span>
                    <span class="text-xs text-warning-600 dark:text-warning-400">alerts</span>
                </div>
                <div
                    v-else
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-surface-800/60 border border-success-100 dark:border-success-900/40"
                >
                    <i class="pi pi-check-circle text-xs text-success-500" />
                    <span class="text-xs text-success-600 dark:text-success-400">clear</span>
                </div>
                <div class="ml-auto text-xs text-surface-400 shrink-0">{{ lastSeen }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
    org: string;
    online: boolean;
    degraded: boolean;
    nodes: number;
    sensors: number;
    alerts: number;
    lastSeen: string;
}>();
</script>
