import { describe, expect, it } from 'vitest';
import dataTablePreset from './index.js';

const preset = dataTablePreset as any;

describe('DataTable preset', () => {
    it('marks hoverable body rows as groups', () => {
        const row = preset.bodyRow({
            context: { selectable: false, selected: false, stripedRows: false },
            props: { rowHover: true, selectionMode: undefined, highlightOnSelect: false, frozenRow: false }
        } as any);

        expect(row.class).toContainEqual({ group: true });
    });

    it('applies row hover color to individual body cells', () => {
        const cell = preset.column.bodyCell({
            props: { frozen: true },
            context: { size: undefined, showGridlines: false },
            state: {},
            parent: {
                instance: {
                    frozenRow: false,
                    $parentInstance: { $parentInstance: { resizableColumns: false } }
                }
            }
        } as any);

        expect(cell.class).toContain('group-hover:bg-surface-100/80 dark:group-hover:bg-surface-800/70');
        expect(cell.class).toContain('group-hover:text-surface-700 dark:group-hover:text-white/90');
    });
});
