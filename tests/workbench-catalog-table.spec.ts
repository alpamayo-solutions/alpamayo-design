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
                VoltSelect: true,
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
    it('renders one editable row per catalog entry', () => {
        const w = mountTable();

        expect(w.findAll('[data-catalog-row]')).toHaveLength(2);
        expect(w.get('[data-catalog-row="a"] [data-catalog-cell="displayName"] input').element).toHaveProperty(
            'value',
            'CMMS'
        );
    });

    it('emits the full row set when a cell changes', async () => {
        const w = mountTable();

        await w.get('[data-catalog-row="b"] [data-catalog-cell="displayName"] input').setValue('Enterprise RP');

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
        expect(w.get('[data-catalog-row="b"] [data-catalog-cell="key"] input').attributes('disabled')).toBeDefined();
        expect(w.find('[data-catalog-delete]').exists()).toBe(false);
    });
});
