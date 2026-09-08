/** Composite widgets must never consume a nested control's editing keys. */
export function isEditingKey(event: KeyboardEvent): boolean {
    return (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.target instanceof Element &&
            Boolean(
                event.target.closest(
                    'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="slider"], [role="spinbutton"], [role="textbox"]'
                )
            ))
    );
}

/** Arrow navigation for bounded, explicitly opted-in lists of native controls. */
export function navigateList(event: KeyboardEvent, selector: string): void {
    if (isEditingKey(event) || event.shiftKey) return;
    const root = event.currentTarget as HTMLElement;
    const entries = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
        (entry) => !entry.matches(':disabled, [aria-disabled="true"]') && !entry.closest('[hidden], [inert]')
    );
    const index = entries.findIndex(
        (entry) => entry === event.target || entry.contains(event.target as Node)
    );
    let next: number;
    switch (event.key) {
        case 'ArrowDown':
            next = Math.min(entries.length - 1, index + 1);
            break;
        case 'ArrowUp':
            next = Math.max(0, index - 1);
            break;
        case 'Home':
            next = 0;
            break;
        case 'End':
            next = entries.length - 1;
            break;
        default:
            return;
    }
    if (index < 0 && event.target !== root) return;
    const entry = entries[next];
    if (!entry || entry === entries[index]) return;
    event.preventDefault();
    entry.focus();
    entry.scrollIntoView?.({ block: 'nearest' });
}

/** One ordered focus path through the visible sidebar, including section boundaries.
 * Nested trees and virtual lists handle their own interior and leave boundary keys
 * unconsumed so this parent can move to a heading or the next section.
 */
export function navigateSidebar(event: KeyboardEvent): void {
    if (isEditingKey(event) || event.shiftKey || !(event.target instanceof HTMLElement)) return;
    const root = event.currentTarget as HTMLElement;
    const header = '.alp-workbench-sidebar-section-header';
    const primary = 'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])';
    const entries = Array.from(
        root.querySelectorAll<HTMLElement>(`${header}, [role="treeitem"], ${primary}`)
    ).filter((entry) => {
        if (entry.matches(':disabled, [aria-disabled="true"]') || entry.closest('[hidden], [inert]'))
            return false;
        for (
            let parent: HTMLElement | null = entry;
            parent && parent !== root;
            parent = parent.parentElement
        ) {
            if (
                getComputedStyle(parent).display === 'none' ||
                getComputedStyle(parent).visibility === 'hidden'
            )
                return false;
        }
        if (entry.matches(header)) return true;
        const tree = entry.closest('[role="treeitem"]');
        if (tree) return tree === entry;
        if (entry.closest('.alp-workbench-sidebar-section-heading')) return false;
        const row = entry.closest('[data-virtual-index]');
        if (row) return row.querySelector(primary) === entry;
        return !entry.parentElement?.closest('button, a[href]');
    });
    const target = event.target;
    const index = entries.findIndex((entry) => entry === target || entry.contains(target));
    if (index < 0) return;
    const section = target.closest('.alp-workbench-sidebar-section');
    let next: HTMLElement | undefined;
    switch (event.key) {
        case 'ArrowDown':
            next = entries[index + 1];
            break;
        case 'ArrowUp':
            next = entries[index - 1];
            break;
        case 'Home':
            next = entries[0];
            break;
        case 'End':
            next = entries.at(-1);
            break;
        case 'ArrowRight':
            if (
                target.matches(header) &&
                target.getAttribute('aria-expanded') === 'true' &&
                section?.contains(entries[index + 1] ?? null)
            )
                next = entries[index + 1];
            break;
        case 'ArrowLeft':
            if (!target.matches(header)) next = section?.querySelector<HTMLElement>(header) ?? undefined;
            break;
        default:
            return;
    }
    if (!next || next === target) return;
    event.preventDefault();
    next.focus();
    next.scrollIntoView?.({ block: 'nearest' });
}
