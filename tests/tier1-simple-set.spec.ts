import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import type { DataTableFilterMetaData } from 'primevue/datatable';
import AlpCardSkeleton from '../components/alp/AlpCardSkeleton.vue';
import AlpListSkeleton from '../components/alp/AlpListSkeleton.vue';
import AlpBoardSkeleton from '../components/alp/AlpBoardSkeleton.vue';
import AlpLocaleSwitcher from '../components/alp/AlpLocaleSwitcher.vue';
import AlpFlagIcon from '../components/alp/AlpFlagIcon.vue';
import AlpColumnSelectFilter from '../components/alp/AlpColumnSelectFilter.vue';

describe('AlpCardSkeleton', () => {
    it('renders at least two skeleton bars', () => {
        const w = mount(AlpCardSkeleton, { global: { stubs: { VoltSkeleton: true } } });
        expect(w.findAll('volt-skeleton-stub').length).toBeGreaterThanOrEqual(2);
    });

    it('omits the tag skeleton when showTag is false', () => {
        const w = mount(AlpCardSkeleton, {
            props: { showTag: false },
            global: { stubs: { VoltSkeleton: true } }
        });
        expect(w.find('[data-testid="card-skeleton-tag"]').exists()).toBe(false);
    });
});

describe('AlpListSkeleton', () => {
    it('renders the default row count when rows is omitted', () => {
        const w = mount(AlpListSkeleton, { global: { stubs: { VoltSkeleton: true } } });
        expect(w.findAll('[data-testid="list-skeleton-row"]').length).toBe(12);
    });

    it('renders the row count given by the rows prop', () => {
        const w = mount(AlpListSkeleton, {
            props: { rows: 5 },
            global: { stubs: { VoltSkeleton: true } }
        });
        expect(w.findAll('[data-testid="list-skeleton-row"]').length).toBe(5);
    });
});

describe('AlpBoardSkeleton', () => {
    it('renders one column block per entry of the columns prop and contains AlpCardSkeleton children', () => {
        const w = mount(AlpBoardSkeleton, {
            props: { columns: 3, cardsPerColumn: 2 },
            global: { stubs: { VoltSkeleton: true } }
        });
        expect(w.findAll('[data-testid="board-skeleton-column"]').length).toBe(3);
        expect(w.findAllComponents(AlpCardSkeleton).length).toBe(6);
    });

    it('uses columnNames to drive the column count when provided', () => {
        const w = mount(AlpBoardSkeleton, {
            props: { columnNames: ['Backlog', 'Doing'], cardsPerColumn: 1 },
            global: { stubs: { VoltSkeleton: true } }
        });
        expect(w.findAll('[data-testid="board-skeleton-column"]').length).toBe(2);
        expect(w.findAllComponents(AlpCardSkeleton).length).toBe(2);
    });
});

describe('AlpFlagIcon', () => {
    it('renders the German flag svg for code="de"', () => {
        const w = mount(AlpFlagIcon, { props: { code: 'de' } });
        expect(w.find('svg').exists()).toBe(true);
        expect(w.html()).toContain('#DD0000');
    });

    it('falls back to a two-letter text label for an unknown code', () => {
        const w = mount(AlpFlagIcon, { props: { code: 'xx' } });
        expect(w.find('svg').exists()).toBe(false);
        expect(w.text()).toBe('XX');
    });
});

describe('AlpLocaleSwitcher', () => {
    const locales = [
        { code: 'en', name: 'English' },
        { code: 'de', name: 'Deutsch' }
    ];

    function mountSwitcher(modelValue = 'en') {
        return mount(AlpLocaleSwitcher, {
            props: { locales, modelValue },
            // Explicit stub (not the unresolved-component fallback) so the
            // component under test doesn't depend on Vue's dev-mode warning
            // path; renderStubDefaultSlot keeps the AlpFlagIcon/label
            // children visible for assertions.
            global: { stubs: { VoltButton: true }, renderStubDefaultSlot: true }
        });
    }

    it('renders one row per passed locale', async () => {
        const w = mountSwitcher();

        // Trigger button only, before the dropdown is opened.
        expect(w.findAllComponents(AlpFlagIcon).length).toBe(1);

        await w.find('volt-button-stub').trigger('click');

        // Trigger + one row per locale (en, de).
        expect(w.findAllComponents(AlpFlagIcon).length).toBe(3);
    });

    it('marks the active row for modelValue', async () => {
        const w = mountSwitcher('de');

        await w.find('volt-button-stub').trigger('click');
        const optionButtons = w.findAll('volt-button-stub').slice(1);
        expect(optionButtons.length).toBe(2);

        expect(optionButtons[0]!.attributes('class')).not.toContain('!bg-primary-50');
        expect(optionButtons[1]!.attributes('class')).toContain('!bg-primary-50');
    });

    it('emits update:modelValue with the selected code when a row is clicked', async () => {
        const w = mountSwitcher('en');

        await w.find('volt-button-stub').trigger('click');
        const optionButtons = w.findAll('volt-button-stub').slice(1);

        await optionButtons[1]!.trigger('click');

        expect(w.emitted('update:modelValue')).toEqual([['de']]);
    });
});

describe('AlpColumnSelectFilter', () => {
    const VoltSelectStub = {
        props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'placeholder', 'showClear'],
        emits: ['update:modelValue'],
        template:
            '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)">' +
            '<option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>' +
            '</select>'
    };

    it('round-trips the model and invokes filterCallback on selection', async () => {
        const filterModel = reactive<DataTableFilterMetaData>({ value: null, matchMode: 'equals' });
        const filterCallback = vi.fn();

        const w = mount(AlpColumnSelectFilter, {
            props: {
                filterModel,
                filterCallback,
                options: [
                    { label: 'Online', value: 'online' },
                    { label: 'Offline', value: 'offline' }
                ]
            },
            global: { components: { VoltSelect: VoltSelectStub } }
        });

        await w.find('select').setValue('online');

        expect(filterModel.value).toBe('online');
        expect(filterCallback).toHaveBeenCalledTimes(1);
    });
});
