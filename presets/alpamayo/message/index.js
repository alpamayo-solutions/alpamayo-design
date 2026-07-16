export default {
    root: ({ props }) => ({
        class: [
            // Spacing and Shape
            'rounded-md',
            'outline-solid',

            // Colors
            {
                'bg-info-100/70 dark:bg-info-500/20': props.severity == 'info',
                'bg-success-100/70 dark:bg-success-500/20': props.severity == 'success',
                'bg-surface-100/70 dark:bg-surface-500/20': props.severity == 'secondary',
                'bg-warning-100/70 dark:bg-warning-500/20': props.severity == 'warn',
                'bg-danger-100/70 dark:bg-danger-500/20': props.severity == 'error',
                'bg-surface-950 dark:bg-surface-0': props.severity == 'contrast'
            },
            {
                'outline-info-200 dark:outline-info-500/20': props.severity == 'info',
                'outline-success-200 dark:outline-success-500/20': props.severity == 'success',
                'outline-surface-200 dark:outline-surface-500/20': props.severity == 'secondary',
                'outline-warning-200 dark:outline-warning-500/20': props.severity == 'warn',
                'outline-danger-200 dark:outline-danger-500/20': props.severity == 'error',
                'outline-surface-950 dark:outline-surface-0': props.severity == 'contrast'
            },
            {
                'text-info-700 dark:text-info-300': props.severity == 'info',
                'text-success-700 dark:text-success-300': props.severity == 'success',
                'text-surface-700 dark:text-surface-300': props.severity == 'secondary',
                'text-warning-700 dark:text-warning-300': props.severity == 'warn',
                'text-danger-700 dark:text-danger-300': props.severity == 'error',
                'text-surface-0 dark:text-surface-950': props.severity == 'contrast'
            }
        ]
    }),
    content: {
        class: [
            // Flexbox
            'flex items-center h-full',

            // Spacing
            'py-2 px-3 gap-2'
        ]
    },
    icon: {
        class: [
            // Sizing and Spacing
            'shrink-0 w-4.5 h-4.5'
        ]
    },
    text: {
        class: [
            // Font and Text
            'text-base leading-[normal]',
            'font-medium'
        ]
    },
    closeButton: ({ props }) => ({
        class: [
            // Flexbox
            'flex items-center justify-center',

            // Size
            'w-7 h-7',

            // Spacing and Misc
            'ml-auto relative',

            // Shape
            'rounded-full',

            // Colors
            'bg-transparent',

            // Transitions
            'transition duration-200 ease-in-out',

            // States
            'hover:bg-surface-0/30 dark:hover:bg-[rgba(255,255,255,0.03)]',
            'focus:outline-hidden focus:outline-offset-0 focus:ring-1',
            {
                'focus:ring-info dark:focus:ring-blue-400': props.severity == 'info',
                'focus:ring-success dark:focus:ring-green-400': props.severity == 'success',
                'focus:ring-surface-500 dark:focus:ring-surface-400': props.severity == 'secondary',
                'focus:ring-warning-500 dark:focus:ring-warning-400': props.severity == 'warn',
                'focus:ring-danger dark:focus:ring-red-4000': props.severity == 'error',
                'focus:ring-surface-0 dark:focus:ring-surface-950': props.severity == 'contrast'
            },

            // Misc
            'overflow-hidden'
        ]
    }),
    transition: {
        enterFromClass: 'opacity-0',
        enterActiveClass: 'transition-opacity duration-300',
        leaveFromClass: 'max-h-40',
        leaveActiveClass: 'overflow-hidden transition-all duration-300 ease-in',
        leaveToClass: 'max-h-0 opacity-0 m-0!'
    }
};
