import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { useAlpServerTable } from '../composables/useAlpServerTable';

// Mounts a throwaway component so onMounted lifecycle hooks inside the
// composable actually fire (calling a composable bare, outside a component's
// setup(), is a no-op for lifecycle hooks). Mirrors tests/composables.spec.ts.
function withSetup<T>(composable: () => T) {
    let result!: T;
    const wrapper = mount(
        defineComponent({
            setup() {
                result = composable();
                return () => null;
            }
        })
    );
    return { result, wrapper };
}

function flushDebounce(ms = 260) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('useAlpServerTable', () => {
    it('calls fetch once on mount with page 1 and default pageSize', async () => {
        const fetchFn = vi.fn().mockResolvedValue({ items: [1, 2, 3], total: 3 });
        const { result } = withSetup(() => useAlpServerTable({ fetch: fetchFn }));
        await nextTick();
        await flushDebounce();

        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(fetchFn).toHaveBeenCalledWith({ page: 1, pageSize: 50, sort: null, filters: {} });
        expect(result.items.value).toEqual([1, 2, 3]);
        expect(result.total.value).toBe(3);
    });

    it('setPage re-fetches immediately with the new page', async () => {
        const fetchFn = vi.fn().mockResolvedValue({ items: [], total: 0 });
        const { result } = withSetup(() => useAlpServerTable({ fetch: fetchFn }));
        await flushPromises();
        fetchFn.mockClear();

        result.setPage(2);
        await nextTick();

        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(fetchFn).toHaveBeenCalledWith({ page: 2, pageSize: 50, sort: null, filters: {} });
        expect(result.page.value).toBe(2);
    });

    it('setSort re-fetches immediately with the sort', async () => {
        const fetchFn = vi.fn().mockResolvedValue({ items: [], total: 0 });
        const { result } = withSetup(() => useAlpServerTable({ fetch: fetchFn }));
        await flushPromises();
        fetchFn.mockClear();

        result.setSort({ field: 'name', order: 'asc' });
        await nextTick();

        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(fetchFn).toHaveBeenCalledWith({
            page: 1,
            pageSize: 50,
            sort: { field: 'name', order: 'asc' },
            filters: {}
        });
        expect(result.sort.value).toEqual({ field: 'name', order: 'asc' });
    });

    it('setFilter resets page to 1, debounces, and re-fetches with the filter', async () => {
        const fetchFn = vi.fn().mockResolvedValue({ items: [], total: 0 });
        const { result } = withSetup(() => useAlpServerTable({ fetch: fetchFn }));
        await flushPromises();
        // move off page 1 first so we can observe the reset
        result.setPage(3);
        await flushPromises();
        fetchFn.mockClear();

        result.setFilter('q', 'x');
        expect(result.page.value).toBe(1);
        // not fetched yet — debounced
        expect(fetchFn).not.toHaveBeenCalled();

        await flushDebounce();

        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(fetchFn).toHaveBeenCalledWith({ page: 1, pageSize: 50, sort: null, filters: { q: 'x' } });
        expect(result.filters.value).toEqual({ q: 'x' });
    });

    it('a rejecting fetch sets error and keeps prior items', async () => {
        const fetchFn = vi
            .fn()
            .mockResolvedValueOnce({ items: [1, 2], total: 2 })
            .mockRejectedValueOnce(new Error('boom'));
        const { result } = withSetup(() => useAlpServerTable({ fetch: fetchFn }));
        await flushPromises();
        expect(result.items.value).toEqual([1, 2]);

        result.setPage(2);
        await flushPromises();

        expect(result.error.value).toBeInstanceOf(Error);
        expect((result.error.value as Error).message).toBe('boom');
        expect(result.items.value).toEqual([1, 2]);
    });

    it('loading toggles true during a fetch and false after', async () => {
        let resolveFetch!: (v: { items: number[]; total: number }) => void;
        const fetchFn = vi.fn().mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveFetch = resolve;
                })
        );
        const { result } = withSetup(() => useAlpServerTable({ fetch: fetchFn }));
        await nextTick();

        expect(result.loading.value).toBe(true);
        resolveFetch({ items: [], total: 0 });
        await flushPromises();
        expect(result.loading.value).toBe(false);
    });

    it('refresh() re-fetches the current params', async () => {
        const fetchFn = vi.fn().mockResolvedValue({ items: [], total: 0 });
        const { result } = withSetup(() => useAlpServerTable({ fetch: fetchFn }));
        await flushPromises();
        fetchFn.mockClear();

        await result.refresh();

        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(fetchFn).toHaveBeenCalledWith({ page: 1, pageSize: 50, sort: null, filters: {} });
    });

    it('clears a pending debounced fetch on unmount', async () => {
        const fetchFn = vi.fn().mockResolvedValue({ items: [], total: 0 });
        const { result, wrapper } = withSetup(() => useAlpServerTable({ fetch: fetchFn }));
        await flushPromises();
        fetchFn.mockClear();

        result.setFilter('q', 'x');
        wrapper.unmount();

        await flushDebounce();

        expect(fetchFn).not.toHaveBeenCalled();
    });

    it('respects custom pageSize and initialSort options', async () => {
        const fetchFn = vi.fn().mockResolvedValue({ items: [], total: 0 });
        withSetup(() =>
            useAlpServerTable({
                fetch: fetchFn,
                pageSize: 25,
                initialSort: { field: 'created_at', order: 'desc' }
            })
        );
        await nextTick();
        await flushDebounce();

        expect(fetchFn).toHaveBeenCalledWith({
            page: 1,
            pageSize: 25,
            sort: { field: 'created_at', order: 'desc' },
            filters: {}
        });
    });
});
