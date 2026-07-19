import { onMounted, onUnmounted, ref, type Ref } from 'vue';

export interface SortState {
    field: string;
    order: 'asc' | 'desc';
}

export interface ServerTableFetchParams {
    page: number;
    pageSize: number;
    sort: SortState | null;
    filters: Record<string, unknown>;
}

const FILTER_DEBOUNCE_MS = 250;

/**
 * Framework-agnostic server-table state machine.
 *
 * Owns page/pageSize/sort/filters state and drives a caller-supplied `fetch`
 * function on mount and on every state change — immediately for page/sort
 * changes, debounced (~250ms) for filter changes. Holds no knowledge of any
 * particular API client; the caller's `fetch` is the only I/O boundary.
 */
export function useAlpServerTable<T>(opts: {
    fetch: (params: ServerTableFetchParams) => Promise<{ items: T[]; total: number }>;
    pageSize?: number;
    initialSort?: SortState | null;
}) {
    const items = ref([]) as Ref<T[]>;
    const total = ref(0);
    const page = ref(1);
    const pageSize = ref(opts.pageSize ?? 50);
    const sort = ref<SortState | null>(opts.initialSort ?? null) as Ref<SortState | null>;
    const filters = ref<Record<string, unknown>>({});
    const loading = ref(false);
    const error = ref<unknown>(null);

    let debounceHandle: ReturnType<typeof setTimeout> | null = null;
    // Monotonically-increasing token so a slow, superseded fetch can't clobber
    // state written by a fetch that started later and resolved first.
    let requestToken = 0;

    async function doFetch(): Promise<void> {
        const token = ++requestToken;
        loading.value = true;
        try {
            const result = await opts.fetch({
                page: page.value,
                pageSize: pageSize.value,
                sort: sort.value,
                filters: filters.value
            });
            if (token !== requestToken) return;
            items.value = result.items;
            total.value = result.total;
            error.value = null;
        } catch (err) {
            if (token !== requestToken) return;
            // Intentionally leave `items`/`total` untouched — a failed
            // refresh should not blank out a table that already has data.
            error.value = err;
        } finally {
            if (token === requestToken) loading.value = false;
        }
    }

    function fetchDebounced(): void {
        if (debounceHandle !== null) clearTimeout(debounceHandle);
        debounceHandle = setTimeout(() => {
            debounceHandle = null;
            void doFetch();
        }, FILTER_DEBOUNCE_MS);
    }

    function setPage(p: number): void {
        page.value = p;
        void doFetch();
    }

    function setPageSize(n: number): void {
        pageSize.value = n;
        void doFetch();
    }

    function setSort(s: SortState | null): void {
        sort.value = s;
        void doFetch();
    }

    function setFilter(key: string, value: unknown): void {
        filters.value = { ...filters.value, [key]: value };
        page.value = 1;
        fetchDebounced();
    }

    async function refresh(): Promise<void> {
        await doFetch();
    }

    onMounted(() => {
        void doFetch();
    });

    onUnmounted(() => {
        if (debounceHandle) clearTimeout(debounceHandle);
    });

    return {
        items,
        total,
        page,
        pageSize,
        sort,
        filters,
        loading,
        error,
        setPage,
        setPageSize,
        setSort,
        setFilter,
        refresh
    };
}
