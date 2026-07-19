<script setup lang="ts">
// Presentational quick-create card shell: title input + inline assignee/type/
// label/project pickers, mirroring intelligence's TaskQuickCreateCard layout.
// Emit-only — owns no persistence and no label creation (that's app-domain;
// the wrapper owns label creation and only ever hands this shell a resolved
// `labelOptions` list to select from).
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MemberOption } from './AlpMemberPicker.vue';

const props = defineProps<{
    assigneeOptions?: MemberOption[];
    labelOptions?: Array<{ id: string; label: string; color?: string }>;
    typeOptions?: Array<{ key: string; label: string }>;
    // Selectable create targets (one per project). When >1 the card shows a
    // project picker instead of the plain projectName text.
    projectOptions?: Array<{ slug: string; label: string }>;
    projectName?: string;
    creating?: boolean;
}>();

const emit = defineEmits<{
    create: [
        payload: {
            title: string;
            assigneeId: string | null;
            labelIds: string[];
            typeKey?: string;
            projectSlug?: string;
        }
    ];
    cancel: [];
}>();

const { t } = useI18n();

const title = ref('');
const assigneeId = ref<string | null>(null);
const labelIds = ref<string[]>([]);
const typeKey = ref<string | undefined>(undefined);
const projectSlug = ref<string | undefined>(undefined);

const hasProjectChoice = computed(() => (props.projectOptions?.length ?? 0) > 1);

// Selected labels resolved to name/color from labelOptions, for the chip row.
const selectedLabelChips = computed(() =>
    labelIds.value.map((id) => {
        const label = props.labelOptions?.find((l) => l.id === id);
        return { id, label: label?.label ?? id, color: label?.color ?? '' };
    })
);

function removeLabel(id: string) {
    labelIds.value = labelIds.value.filter((labelId) => labelId !== id);
}

function submit() {
    if (!title.value.trim() || props.creating) return;
    emit('create', {
        title: title.value.trim(),
        assigneeId: assigneeId.value,
        labelIds: [...labelIds.value],
        typeKey: typeKey.value || undefined,
        projectSlug: projectSlug.value || undefined
    });
}
</script>

<template>
    <div
        class="rounded-lg w-full p-3 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
    >
        <!-- Multi-project caller: pick which project the item goes to. -->
        <div v-if="hasProjectChoice" class="mb-1.5 flex items-center gap-1">
            <i class="pi pi-folder flex-shrink-0 text-[11px] text-surface-400" />
            <VoltSelect
                :modelValue="projectSlug"
                :options="projectOptions"
                optionLabel="label"
                optionValue="slug"
                :placeholder="t('design.quickCreate.selectProject')"
                :aria-label="t('design.quickCreate.selectProject')"
                class="!h-7 w-full text-xs"
                @update:modelValue="projectSlug = $event"
            />
        </div>
        <div
            v-else-if="projectName"
            class="mb-1.5 flex items-center gap-1 text-[11px] text-surface-400 dark:text-surface-500"
        >
            <i class="pi pi-folder text-[10px]" />
            <span class="sensitive truncate">{{ projectName }}</span>
        </div>
        <VoltInputText
            v-model="title"
            class="w-full !h-8 text-sm"
            :placeholder="t('design.quickCreate.titlePlaceholder')"
            :disabled="creating"
            autofocus
            @keydown.enter="submit"
            @keydown.escape="emit('cancel')"
        />
        <div class="mt-2 flex flex-wrap items-center gap-1.5">
            <AlpMemberPicker
                :options="assigneeOptions ?? []"
                :modelValue="assigneeId"
                @update:modelValue="assigneeId = $event"
            />
            <VoltSelect
                v-if="typeOptions?.length"
                :modelValue="typeKey"
                :options="typeOptions"
                optionLabel="label"
                optionValue="key"
                :placeholder="t('design.quickCreate.selectType')"
                :aria-label="t('design.quickCreate.selectType')"
                class="!h-7 text-xs"
                @update:modelValue="typeKey = $event"
            />
            <VoltMultiSelect
                :modelValue="labelIds"
                :options="labelOptions ?? []"
                optionLabel="label"
                optionValue="id"
                :placeholder="t('design.quickCreate.addLabels')"
                :aria-label="t('design.quickCreate.addLabels')"
                class="!h-7 text-xs"
                @update:modelValue="labelIds = $event"
            >
                <template #value>
                    <span class="text-surface-400">{{ t('design.quickCreate.addLabels') }}</span>
                </template>
                <template #option="{ option }">
                    <span class="truncate">{{ option.label }}</span>
                </template>
            </VoltMultiSelect>
            <!-- Extensibility point for app-specific inline controls (e.g. priority,
                 due-date pickers). The consumer owns any injected controls' state and
                 merges it into its own create payload — this shell stays payload-agnostic. -->
            <slot name="controls-extra" />
        </div>
        <div v-if="selectedLabelChips.length" class="mt-2 flex flex-wrap items-center gap-1">
            <span
                v-for="chip in selectedLabelChips"
                :key="chip.id"
                class="inline-flex max-w-full items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border"
                :style="
                    chip.color
                        ? {
                              backgroundColor: chip.color + '18',
                              color: chip.color,
                              borderColor: chip.color + '40'
                          }
                        : {}
                "
                :class="!chip.color && 'bg-primary-50 text-primary-700 border-primary-200'"
            >
                <span class="truncate">{{ chip.label }}</span>
                <VoltButton
                    type="button"
                    severity="ghost"
                    text
                    size="small"
                    icon="pi pi-times"
                    class="!-mr-0.5 !h-3.5 !w-3.5 !p-0 !text-current opacity-60 hover:!text-danger-500 hover:opacity-100 [&_.pi]:!text-[10px]"
                    :aria-label="t('design.quickCreate.removeLabel')"
                    @click="removeLabel(chip.id)"
                />
            </span>
        </div>
        <div class="mt-2 flex items-center justify-end gap-2">
            <VoltButton
                type="button"
                severity="ghost"
                text
                size="small"
                :label="t('design.quickCreate.cancel')"
                :disabled="creating"
                @click="emit('cancel')"
            />
            <VoltButton
                type="button"
                severity="success"
                size="small"
                icon="pi pi-save"
                :label="t('design.quickCreate.create')"
                :loading="creating"
                :disabled="!title.trim() || creating"
                @click="submit"
            />
        </div>
    </div>
</template>
