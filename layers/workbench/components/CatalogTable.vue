<script setup lang="ts">
import { computed } from 'vue';

export interface WorkbenchCatalogColumn {
    key: string;
    label: string;
    kind?: 'text' | 'select';
    options?: { label: string; value: string }[];
    /** Editable while the row is new, locked once it is committed. */
    lockedAfterCreate?: boolean;
}

export interface WorkbenchCatalogRow {
    id: string;
    values: Record<string, string>;
    /** True for a row added in this session and not yet saved. */
    isNew?: boolean;
    /** Present when the row cannot be deleted; shown to the user as the reason. */
    deleteBlockedReason?: string;
}

const props = withDefaults(
    defineProps<{
        columns: WorkbenchCatalogColumn[];
        rows: WorkbenchCatalogRow[];
        readonly?: boolean;
        addLabel?: string;
    }>(),
    { readonly: false, addLabel: 'Add row' }
);

const emit = defineEmits<{ 'update:rows': [WorkbenchCatalogRow[]] }>();

/**
 * `repeat(auto-fit, minmax(0, 1fr))` has no definite track minimum, so
 * auto-fit collapses to a single repetition instead of one column per
 * catalog column. The component derives its own track count from
 * `columns.length` rather than depending on a custom property no consumer
 * ever sets.
 */
const trackCount = computed(() => Math.max(props.columns.length, 1));

function isLocked(column: WorkbenchCatalogColumn, row: WorkbenchCatalogRow): boolean {
    if (props.readonly) return true;
    return Boolean(column.lockedAfterCreate) && !row.isNew;
}

function cellId(row: WorkbenchCatalogRow, column: WorkbenchCatalogColumn): string {
    return `catalog-cell-${row.id}-${column.key}`;
}

function setCell(rowId: string, columnKey: string, value: string): void {
    emit(
        'update:rows',
        props.rows.map((row) =>
            row.id === rowId ? { ...row, values: { ...row.values, [columnKey]: value } } : row
        )
    );
}

function removeRow(rowId: string): void {
    emit(
        'update:rows',
        props.rows.filter((row) => row.id !== rowId)
    );
}

function nextRowId(): string {
    let ordinal = 1;
    while (props.rows.some((row) => row.id === `catalog-row-new-${ordinal}`)) {
        ordinal += 1;
    }
    return `catalog-row-new-${ordinal}`;
}

function addRow(): void {
    emit('update:rows', [
        ...props.rows,
        {
            id: nextRowId(),
            isNew: true,
            values: Object.fromEntries(props.columns.map((column) => [column.key, '']))
        }
    ]);
}
</script>

<template>
    <div
        class="alp-workbench-catalog-table"
        :style="{ '--alp-workbench-catalog-columns': trackCount }"
    >
        <div class="alp-workbench-catalog-header" role="presentation">
            <span v-for="column in columns" :key="column.key">{{ column.label }}</span>
            <span v-if="!readonly" />
        </div>

        <div v-for="row in rows" :key="row.id" :data-catalog-row="row.id" class="alp-workbench-catalog-row">
            <div
                v-for="column in columns"
                :key="column.key"
                :data-catalog-cell="column.key"
                class="alp-workbench-catalog-cell"
            >
                <label :for="cellId(row, column)" class="alp-workbench-catalog-cell-label">
                    {{ column.label }}
                </label>
                <VoltSelect
                    v-if="column.kind === 'select'"
                    :id="cellId(row, column)"
                    :model-value="row.values[column.key]"
                    :options="column.options ?? []"
                    option-label="label"
                    option-value="value"
                    :disabled="isLocked(column, row)"
                    @update:model-value="setCell(row.id, column.key, String($event))"
                />
                <VoltInputText
                    v-else
                    :id="cellId(row, column)"
                    :model-value="row.values[column.key]"
                    :disabled="isLocked(column, row)"
                    @update:model-value="setCell(row.id, column.key, String($event))"
                />
            </div>

            <div v-if="!readonly" class="alp-workbench-catalog-actions">
                <AlpWorkbenchIconButton
                    data-catalog-delete
                    icon="pi pi-trash"
                    :label="
                        row.deleteBlockedReason ? `Delete blocked: ${row.deleteBlockedReason}` : 'Delete row'
                    "
                    :disabled="Boolean(row.deleteBlockedReason)"
                    @click="removeRow(row.id)"
                />
                <small v-if="row.deleteBlockedReason" class="alp-workbench-catalog-blocked">
                    {{ row.deleteBlockedReason }}
                </small>
            </div>
        </div>

        <VoltButton v-if="!readonly" data-catalog-add text :label="addLabel" @click="addRow" />
    </div>
</template>
