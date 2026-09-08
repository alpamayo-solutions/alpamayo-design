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
    if (!entry) return;
    event.preventDefault();
    entry.focus();
    entry.scrollIntoView?.({ block: 'nearest' });
}
