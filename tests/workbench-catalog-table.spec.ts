import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AlpWorkbenchCatalogTable from '../layers/workbench/components/CatalogTable.vue';
import type {
    WorkbenchCatalogColumn,
    WorkbenchCatalogRow
} from '../layers/workbench/components/CatalogTable.vue';

const columns: WorkbenchCatalogColumn[] = [
    { key: 'key', label: 'Key', lockedAfterCreate: true },
    { key: 'displayName', label: 'Display name' }
];

const rows: WorkbenchCatalogRow[] = [
    { id: 'a', values: { key: 'cmms', displayName: 'CMMS' }, deleteBlockedReason: 'Used by 12 rows' },
    { id: 'b', values: { key: 'erp', displayName: 'ERP' } }
];

const selectOptions = [
    { label: 'Manual', value: 'manual' },
    { label: 'Automatic', value: 'automatic' },
    { label: 'Scheduled', value: 'scheduled' }
];

const selectColumns: WorkbenchCatalogColumn[] = [
    { key: 'source', label: 'Source', kind: 'select', options: selectOptions }
];

const lockedSelectColumns: WorkbenchCatalogColumn[] = [
    { key: 'source', label: 'Source', kind: 'select', lockedAfterCreate: true, options: selectOptions }
];

const selectRows: WorkbenchCatalogRow[] = [
    { id: 'a', values: { source: 'manual' } },
    { id: 'b', values: { source: 'automatic' } }
];

const mountTable = (props: Record<string, unknown> = {}) =>
    mount(AlpWorkbenchCatalogTable, {
        props: { columns, rows, ...props },
        global: {
            stubs: {
                VoltInputText: {
                    props: ['modelValue', 'disabled'],
                    emits: ['update:modelValue'],
                    template:
                        '<input :disabled="disabled" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
                },
                VoltSelect: {
                    props: ['modelValue', 'options', 'disabled'],
                    emits: ['update:modelValue'],
                    template:
                        '<select :disabled="disabled" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>'
                },
                AlpWorkbenchIconButton: {
                    props: ['label', 'disabled'],
                    template: '<button :aria-label="label" :disabled="disabled" @click="$emit(\'click\')" />'
                },
                VoltButton: {
                    props: ['label'],
                    template: '<button @click="$emit(\'click\')">{{ label }}</button>'
                }
            }
        }
    });

describe('AlpWorkbenchCatalogTable', () => {
    it('derives its grid track template from the number of columns', () => {
        const w = mountTable();

        expect(w.get('.alp-workbench-catalog-header').element.style.gridTemplateColumns).toBe(
            'repeat(2, minmax(0, 1fr)) 112px'
        );
    });

    it('recomputes the track template for a different column set', () => {
        const w = mountTable({ columns: selectColumns, rows: selectRows });

        expect(w.get('.alp-workbench-catalog-header').element.style.gridTemplateColumns).toBe(
            'repeat(1, minmax(0, 1fr)) 112px'
        );
    });

    it('gives the header and every row the identical column track template, whether or not a row carries a blocked-delete reason', () => {
        const w = mountTable();

        const header = w.get('.alp-workbench-catalog-header').element.style.gridTemplateColumns;
        const blockedRow = w.get('[data-catalog-row="a"]').element.style.gridTemplateColumns;
        const unblockedRow = w.get('[data-catalog-row="b"]').element.style.gridTemplateColumns;

        expect(header).toBe('repeat(2, minmax(0, 1fr)) 112px');
        expect(blockedRow).toBe(header);
        expect(unblockedRow).toBe(header);
    });

    it('renders one editable row per catalog entry', () => {
        const w = mountTable();

        expect(w.findAll('[data-catalog-row]')).toHaveLength(2);
        expect(
            w.get('[data-catalog-row="a"] [data-catalog-cell="displayName"] input').element
        ).toHaveProperty('value', 'CMMS');
    });

    it('emits the full row set when a cell changes', async () => {
        const w = mountTable();

        await w
            .get('[data-catalog-row="b"] [data-catalog-cell="displayName"] input')
            .setValue('Enterprise RP');

        const emitted = w.emitted('update:rows')?.[0]?.[0] as WorkbenchCatalogRow[];
        expect(emitted[1]?.values.displayName).toBe('Enterprise RP');
        expect(emitted[0]?.values.displayName).toBe('CMMS');
    });

    it('locks a lockedAfterCreate column on a committed row', () => {
        const w = mountTable();

        expect(
            w.get('[data-catalog-row="a"] [data-catalog-cell="key"] input').attributes('disabled')
        ).toBeDefined();
    });

    it('leaves a lockedAfterCreate column editable on a new row', () => {
        const w = mountTable({
            rows: [{ id: 'c', isNew: true, values: { key: '', displayName: '' } }]
        });

        expect(
            w.get('[data-catalog-row="c"] [data-catalog-cell="key"] input').attributes('disabled')
        ).toBeUndefined();
    });

    it('disables a blocked delete and states the reason', () => {
        const w = mountTable();
        const blocked = w.get('[data-catalog-row="a"] [data-catalog-delete]');

        expect(blocked.attributes('disabled')).toBeDefined();
        expect(w.get('[data-catalog-row="a"]').text()).toContain('Used by 12 rows');
        expect(w.get('[data-catalog-row="b"] [data-catalog-delete]').attributes('disabled')).toBeUndefined();
    });

    it('removes a row through its delete control', async () => {
        const w = mountTable();

        await w.get('[data-catalog-row="b"] [data-catalog-delete]').trigger('click');

        const emitted = w.emitted('update:rows')?.[0]?.[0] as WorkbenchCatalogRow[];
        expect(emitted.map((row) => row.id)).toEqual(['a']);
    });

    it('appends a new row marked isNew', async () => {
        const w = mountTable();

        await w.get('[data-catalog-add]').trigger('click');

        const emitted = w.emitted('update:rows')?.[0]?.[0] as WorkbenchCatalogRow[];
        expect(emitted).toHaveLength(3);
        expect(emitted[2]?.isNew).toBe(true);
        expect(emitted[2]?.values).toEqual({ key: '', displayName: '' });
    });

    it('offers no editing affordances when readonly', () => {
        const w = mountTable({ readonly: true });

        expect(w.find('[data-catalog-add]').exists()).toBe(false);
        expect(
            w.get('[data-catalog-row="b"] [data-catalog-cell="key"] input').attributes('disabled')
        ).toBeDefined();
        expect(w.find('[data-catalog-delete]').exists()).toBe(false);
    });

    it('avoids an id collision when a new row reappears after a remount', async () => {
        const w = mountTable({
            rows: [{ id: 'catalog-row-new-1', isNew: true, values: { key: '', displayName: '' } }]
        });

        await w.get('[data-catalog-add]').trigger('click');

        const emitted = w.emitted('update:rows')?.[0]?.[0] as WorkbenchCatalogRow[];
        expect(emitted).toHaveLength(2);
        expect(emitted[1]?.id).not.toBe(emitted[0]?.id);
    });

    it('gives a select column its options', () => {
        const w = mountTable({ columns: selectColumns, rows: selectRows });

        const optionLabels = w
            .get('[data-catalog-row="a"] [data-catalog-cell="source"] select')
            .findAll('option')
            .map((option) => option.text());

        expect(optionLabels).toEqual(['Manual', 'Automatic', 'Scheduled']);
    });

    it('emits the full row set when a select changes', async () => {
        const w = mountTable({ columns: selectColumns, rows: selectRows });

        await w.get('[data-catalog-row="b"] [data-catalog-cell="source"] select').setValue('scheduled');

        const emitted = w.emitted('update:rows')?.[0]?.[0] as WorkbenchCatalogRow[];
        expect(emitted[1]?.values.source).toBe('scheduled');
        expect(emitted[0]?.values.source).toBe('manual');
    });

    it('disables a locked select on a committed row', () => {
        const w = mountTable({ columns: lockedSelectColumns, rows: selectRows });

        expect(
            w.get('[data-catalog-row="a"] [data-catalog-cell="source"] select').attributes('disabled')
        ).toBeDefined();
    });

    it('disables a select when readonly', () => {
        const w = mountTable({ columns: selectColumns, rows: selectRows, readonly: true });

        expect(
            w.get('[data-catalog-row="a"] [data-catalog-cell="source"] select').attributes('disabled')
        ).toBeDefined();
    });

    it('labels each cell control with an explicit for/id association', () => {
        const w = mountTable();

        const cellA = w.get('[data-catalog-row="a"] [data-catalog-cell="displayName"]');
        const labelFor = cellA.get('label').attributes('for');
        const inputId = cellA.get('input').attributes('id');

        expect(labelFor).toBeTruthy();
        expect(labelFor).toBe(inputId);

        const otherCellId = w.get('[data-catalog-row="a"] [data-catalog-cell="key"] input').attributes('id');
        const otherRowId = w
            .get('[data-catalog-row="b"] [data-catalog-cell="displayName"] input')
            .attributes('id');
        expect(inputId).not.toBe(otherCellId);
        expect(inputId).not.toBe(otherRowId);
    });
});
