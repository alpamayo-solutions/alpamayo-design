// A tiny anchored-overlay primitive for inline card controls (due-date, tag).
// Renders its panel teleported to <body> at a fixed position computed from the
// trigger's bounding rect — so the panel sits exactly under the trigger button
// yet escapes the board column's `overflow` clipping (a plain absolute panel
// would get cut off). Handles click-outside, Escape, viewport clamping, and
// flip-up when there isn't room below.
import { reactive, ref, nextTick, onMounted, onBeforeUnmount } from 'vue';

export function useAlpAnchoredDropdown() {
    const open = ref(false);
    const triggerRef = ref<HTMLElement | null>(null);
    const panelRef = ref<HTMLElement | null>(null);
    const pos = reactive({ top: 0, left: 0 });

    function computePos() {
        const el = triggerRef.value;
        if (!el) return;
        const r = el.getBoundingClientRect();
        pos.top = r.bottom + 4; // 4px gap under trigger
        pos.left = r.left;
    }

    function reposition() {
        const trigger = triggerRef.value;
        const panel = panelRef.value;
        if (!trigger || !panel) return;
        const tr = trigger.getBoundingClientRect();
        const pr = panel.getBoundingClientRect();

        // Horizontal: keep the panel inside the viewport (8px margin).
        let left = tr.left;
        const overflowRight = left + pr.width - window.innerWidth + 8;
        if (overflowRight > 0) left -= overflowRight;
        if (left < 8) left = 8;
        pos.left = left;

        // Vertical: flip above the trigger if it would overflow the bottom.
        if (tr.bottom + 4 + pr.height > window.innerHeight - 8 && tr.top - pr.height - 4 > 0) {
            pos.top = tr.top - pr.height - 4;
        } else {
            pos.top = tr.bottom + 4;
        }
    }

    function openPanel() {
        computePos();
        open.value = true;
        nextTick(reposition);
    }

    function close() {
        open.value = false;
    }

    function toggle() {
        if (open.value) close();
        else openPanel();
    }

    function onDocPointer(e: PointerEvent) {
        if (!open.value) return;
        const target = e.target as Node;
        if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return;
        close();
    }
    function onKey(e: KeyboardEvent) {
        if (e.key === 'Escape') close();
    }
    function onScrollResize() {
        if (open.value) reposition();
    }

    onMounted(() => {
        document.addEventListener('pointerdown', onDocPointer, true);
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', onScrollResize);
        // capture=true so we also catch scrolls inside the board column.
        window.addEventListener('scroll', onScrollResize, true);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('pointerdown', onDocPointer, true);
        document.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onScrollResize);
        window.removeEventListener('scroll', onScrollResize, true);
    });

    return { open, triggerRef, panelRef, pos, toggle, close };
}
