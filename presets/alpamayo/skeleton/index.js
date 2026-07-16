export default {
    root: ({ props }) => ({
        class: [
            'overflow-hidden',

            // Shimmer sweep reads as "loading" faster than a flat pulse fade —
            // static fallback only when animation is explicitly disabled.
            props.animation !== 'none' ? 'skeleton-shimmer' : 'bg-surface-200 dark:bg-surface-700',

            // Round
            {
                'rounded-full': props.shape === 'circle',
                'rounded-md': props.shape !== 'circle'
            }
        ]
    })
};
