<script setup lang="ts">
// Presentational share-link shell: a trigger button + an anchored popover
// with a TTL-days input, an optional password input, and a create/copy/revoke
// flow. No network, no clipboard — the caller (app wrapper) owns link
// creation, clipboard writes, and the `copied` reset timer, then reflects
// `loading`/`copied`/`error`/`shareUrl` back down as props. Two popover
// states driven purely by `shareUrl`: a create form when unset, a
// copy/revoke result view once a link exists.
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlpAnchoredDropdown } from '../../composables/useAlpAnchoredDropdown';

const props = withDefaults(
    defineProps<{
        shareUrl?: string;
        loading?: boolean;
        copied?: boolean;
        error?: string;
        maxTtlDays?: number;
    }>(),
    {
        maxTtlDays: 7
    }
);

const emit = defineEmits<{
    (e: 'create', opts: { ttlDays: number; password: string }): void;
    (e: 'copy'): void;
    (e: 'revoke'): void;
}>();

const { t } = useI18n();
const { open, triggerRef, panelRef, pos, toggle } = useAlpAnchoredDropdown();

function clampTtl(value: number | null | undefined): number {
    const raw = Number(value ?? 1);
    if (Number.isNaN(raw)) return 1;
    return Math.max(1, Math.min(props.maxTtlDays, Math.round(raw)));
}

const ttlDays = ref(clampTtl(props.maxTtlDays));
const password = ref('');

watch(
    () => props.maxTtlDays,
    () => {
        ttlDays.value = clampTtl(ttlDays.value);
    }
);

function onTtlInput(value: number | null) {
    ttlDays.value = clampTtl(value);
}

function onTrigger() {
    if (props.loading) return;
    toggle();
}

function create() {
    emit('create', { ttlDays: ttlDays.value, password: password.value });
}

function copy() {
    emit('copy');
}

function revoke() {
    password.value = '';
    emit('revoke');
}
</script>

<template>
    <span ref="triggerRef" class="inline-flex">
        <VoltButton
            type="button"
            severity="secondary"
            outlined
            size="small"
            :icon="loading ? 'pi pi-spin pi-spinner' : copied ? 'pi pi-check' : 'pi pi-share-alt'"
            :label="copied ? t('design.share.copied') : t('design.share.trigger')"
            :disabled="loading"
            @click="onTrigger"
        />
        <Teleport to="body">
            <div
                v-if="open"
                ref="panelRef"
                class="fixed z-[1200] w-72 rounded-md border border-surface-200 bg-white p-3 shadow-lg dark:border-surface-700 dark:bg-surface-800"
                :style="{ top: `${pos.top}px`, left: `${pos.left}px` }"
                @click.stop
            >
                <template v-if="!shareUrl">
                    <label
                        class="block text-xs font-medium text-surface-600 dark:text-surface-300"
                        for="alp-share-ttl"
                    >
                        {{ t('design.share.ttlLabel') }}
                    </label>
                    <VoltInputNumber
                        id="alp-share-ttl"
                        :modelValue="ttlDays"
                        :min="1"
                        :max="maxTtlDays"
                        showButtons
                        class="mt-1 w-full"
                        @update:modelValue="onTtlInput"
                    />
                    <label
                        class="mt-3 block text-xs font-medium text-surface-600 dark:text-surface-300"
                        for="alp-share-password"
                    >
                        {{ t('design.share.passwordLabel') }}
                    </label>
                    <VoltInputText
                        id="alp-share-password"
                        v-model="password"
                        type="password"
                        autocomplete="new-password"
                        class="mt-1 w-full"
                    />
                    <VoltButton
                        class="mt-3 w-full"
                        severity="primary"
                        size="small"
                        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-link'"
                        :label="t('design.share.createButton')"
                        :disabled="loading"
                        @click="create"
                    />
                </template>
                <template v-else>
                    <label
                        class="block text-xs font-medium text-surface-600 dark:text-surface-300"
                        for="alp-share-url"
                    >
                        {{ t('design.share.urlLabel') }}
                    </label>
                    <VoltInputText
                        id="alp-share-url"
                        :modelValue="shareUrl"
                        readonly
                        class="sensitive mt-1 w-full"
                    />
                    <p v-if="copied" class="mt-2 text-xs text-success-600 dark:text-success-400">
                        {{ t('design.share.copied') }}
                    </p>
                    <div class="mt-3 flex gap-2">
                        <VoltButton
                            class="flex-1"
                            severity="success"
                            outlined
                            size="small"
                            :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-copy'"
                            :label="t('design.share.copyButton')"
                            :disabled="loading"
                            @click="copy"
                        />
                        <VoltButton
                            class="flex-1"
                            severity="danger"
                            outlined
                            size="small"
                            icon="pi pi-trash"
                            :label="t('design.share.revokeButton')"
                            :disabled="loading"
                            @click="revoke"
                        />
                    </div>
                </template>
            </div>
        </Teleport>
        <VoltMessage v-if="error" class="ml-2" severity="error">{{ error }}</VoltMessage>
    </span>
</template>
