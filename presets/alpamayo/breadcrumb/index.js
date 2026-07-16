export default {
    root: {
        class: [
            // Shape
            'rounded-lg',

            // Spacing
            'p-4',

            // Color
            'bg-surface-0 dark:bg-surface-900',

            // Misc
            'overflow-x-auto',

            // Shadows
            'shadow-xs'
        ]
    },
    list: {
        class: [
            // Flex & Alignment
            'flex items-center flex-nowrap',

            // Spacing
            'm-0 p-0 list-none leading-none'
        ]
    },
    homeItem: {
        class: [
            // Flex & Alignment
            'text-danger!'
        ]
    },
    itemLink: {
        class: [
            // Flex & Alignment
            'flex items-center',

            // Shape
            'rounded-md',

            // Color
            'text-surface-700 dark:text-white/70',

            // States
            'focus-visible:outline-hidden focus-visible:outline-offset-0',
            'focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

            // Transitions
            'transition-shadow duration-200',

            // Misc
            'text-decoration-none'
        ]
    },
    itemIcon: {
        class: 'text-surface-600 dark:text-white/70'
    },
    separator: {
        class: [
            // Flex & Alignment
            'flex items-center',

            // Spacing
            'md:mx-2',

            // Color
            'text-surface-600 dark:text-white/70'
        ]
    }
};
