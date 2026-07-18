<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Generic confirm dialog. Covers both the "delete entity" shape (title +
 * message + emphasized entityName) and the "confirm action with an optional
 * note" shape (withNotes) behind one contract, so callers don't reach for
 * two near-identical dialogs.
 */
const props = withDefaults(
    defineProps<{
        visible: boolean;
        title: string;
        message?: string;
        /** Rendered emphasized inside the message, delete-dialog style. */
        entityName?: string | null;
        confirmLabel?: string;
        confirmSeverity?: string;
        confirmIcon?: string;
        /** Renders an optional free-text notes textarea. */
        withNotes?: boolean;
        loading?: boolean;
        error?: string;
    }>(),
    {
        confirmSeverity: 'danger'
    }
);

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'cancel'): void;
    (e: 'confirm', notes: string): void;
}>();

const { t } = useI18n();
const notes = ref('');

watch(
    () => props.visible,
    (open) => {
        if (open) notes.value = '';
    }
);

function close() {
    if (props.loading) return;
    emit('update:visible', false);
    emit('cancel');
}

function confirm() {
    emit('confirm', props.withNotes ? notes.value.trim() : '');
}
</script>

<template>
    <VoltDialog
        :visible="visible"
        modal
        :header="title"
        class="w-full max-w-md"
        :closable="!loading"
        @update:visible="
            (value: boolean) => {
                if (!value) close();
            }
        "
    >
        <div class="space-y-3">
            <p v-if="message || entityName" class="text-sm text-surface-700 dark:text-surface-200">
                <template v-if="message">{{ message }} </template>
                <span v-if="entityName" class="font-medium sensitive">{{ entityName }}</span>
                <span v-if="entityName">?</span>
            </p>
            <div v-if="withNotes">
                <VoltTextarea
                    v-model="notes"
                    rows="2"
                    class="w-full sensitive"
                    :placeholder="t('design.confirm.notesPlaceholder')"
                />
            </div>
            <VoltMessage v-if="error" severity="error">{{ error }}</VoltMessage>
        </div>
        <template #footer>
            <div class="flex items-center justify-end gap-2">
                <VoltButton
                    severity="ghost"
                    :label="t('design.confirm.cancel')"
                    :disabled="loading"
                    @click="close"
                />
                <VoltButton
                    :severity="confirmSeverity"
                    :icon="confirmIcon"
                    :loading="loading"
                    :disabled="loading"
                    :label="confirmLabel || t('design.confirm.confirm')"
                    @click="confirm"
                />
            </div>
        </template>
    </VoltDialog>
</template>
