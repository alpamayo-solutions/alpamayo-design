export default {
    root: ({ context }) => ({
        class: [
            // Font
            'font-bold',
            'text-xs leading-5',

            // Alignment
            'flex items-center justify-center',
            'text-center',

            // Position
            'absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 origin-top-right',

            // Size
            'm-0',
            {
                'p-0': context.nogutter || context.dot,
                'px-2': !context.nogutter && !context.dot,
                'min-w-2 w-2 h-2': context.dot,
                'min-w-6 h-6': !context.dot
            },

            // Shape
            {
                'rounded-full': context.nogutter || context.dot,
                'rounded-[10px]': !context.nogutter && !context.dot
            },

            // Color
            {
                'text-primary-contrast bg-primary':
                    !context.info &&
                    !context.success &&
                    !context.warning &&
                    !context.danger &&
                    !context.help &&
                    !context.secondary,
                'text-white dark:text-surface-900 bg-surface-600 dark:bg-surface-400': context.secondary,
                'text-on-severity-fill bg-success-fill': context.success,
                'text-on-severity-fill bg-info-fill': context.info,
                'text-on-severity-fill bg-warning-fill': context.warning,
                'text-on-severity-fill bg-help-fill': context.help,
                'text-on-severity-fill bg-danger-fill': context.danger
            }
        ]
    })
};
