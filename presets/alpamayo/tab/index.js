export default {
    root: ({ props, context }) => ({
        class: [
            'relative shrink-0',

            // Shape
            'border-b',
            'rounded-t-md',

            // Adjusted Spacing
            'py-2 px-3', // Reduced padding, smaller top and bottom
            '-mb-px',

            // Colors and Conditions
            'outline-transparent',
            {
                'border-surface-200 dark:border-surface-700': !context.active,
                'bg-transparent': !context.active,
                'text-surface-600 dark:text-surface-300': !context.active,

                'border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400':
                    context.active,

                'opacity-60 cursor-default user-select-none select-none pointer-events-none': props?.disabled
            },

            // Hover Effect for inactive tabs
            {
                'hover:bg-surface-300/10 hover:text-secondary-700 dark:hover:text-secondary-400':
                    !context.active && !props?.disabled
            },

            // States
            'focus:outline-hidden focus:outline-offset-0 focus-visible:ring-1 ring-inset focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300',

            // Transitions
            'transition-all duration-200',

            // Misc
            'cursor-pointer select-none whitespace-nowrap',
            'user-select-none'
        ]
    })
};
