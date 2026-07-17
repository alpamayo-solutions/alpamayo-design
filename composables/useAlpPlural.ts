/**
 * Tiny pluralization helper.
 *
 * Returns the singular form when count is exactly 1, otherwise the plural
 * form (either the explicit `pluralForm` argument or `${singular}s`).
 *
 * This is deliberately minimal — it's a stop-gap until i18n-driven
 * pluralization (via `vue-i18n`) is wired up at every call site. Keep the
 * surface area small: a single function that's easy to grep for and replace.
 *
 * Example:
 *   plural(1, 'gap')           // 'gap'
 *   plural(2, 'gap')           // 'gaps'
 *   plural(0, 'gap')           // 'gaps'
 *   plural(2, 'foot', 'feet')  // 'feet'
 */
function plural(count: number, singular: string, pluralForm?: string): string {
    return count === 1 ? singular : (pluralForm ?? `${singular}s`);
}

export function useAlpPlural() {
    return { plural };
}
