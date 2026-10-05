/**
 * Accessible name for the filter input PrimeVue renders in a Select or
 * MultiSelect overlay, which PrimeVue leaves unnamed (axe: `label`).
 *
 * In order: the component's `filterPlaceholder` (what the field visibly asks
 * for; PrimeVue passes it to the input as `placeholder`), the PrimeVue
 * locale's `aria.search` (set it in the app's PrimeVue locale to translate the
 * default), else "Search". A single component can still override it with
 * `:pt="{ pcFilter: { root: { 'aria-label': … } } }"`.
 */
export default function filterInputName({ instance }) {
    const label =
        instance?.$attrs?.placeholder || instance?.$primevue?.config?.locale?.aria?.search || 'Search';
    return { 'aria-label': label };
}
