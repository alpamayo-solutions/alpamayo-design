export default {
    root: ({ props }) => ({
        class: [
            //Font
            'text-xs font-medium',

            //Alignments
            'inline-flex items-center justify-center',

            //Spacing
            'px-[0.4rem] py-1',

            //Shape
            'rounded-full',

            //Colors
            {
                'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300':
                    props.severity == null,
                'text-success-700 dark:text-success-300 bg-success-100 dark:bg-success-500/20':
                    props.severity === 'success',
                'text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-500/20':
                    props.severity === 'secondary',
                'text-info-700 dark:text-info-300 bg-info-100 dark:bg-info-500/20': props.severity === 'info',
                'text-warning-700 dark:text-warning-300 bg-warning-100 dark:bg-warning-500/20':
                    props.severity === 'warn',
                'text-danger-700 dark:text-danger-300 bg-danger-100 dark:bg-danger-500/20':
                    props.severity === 'danger',
                'text-help-700 dark:text-help-300 bg-help-100 dark:bg-help-500/20': props.severity === 'help',
                'text-surface-0 dark:text-surface-900 bg-surface-900 dark:bg-surface-0':
                    props.severity === 'contrast',
                'text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-700':
                    props.severity === 'neutral'
            }
        ]
    }),
    value: {
        class: 'leading-normal'
    },
    icon: {
        class: 'mr-1 text-sm'
    }
};
