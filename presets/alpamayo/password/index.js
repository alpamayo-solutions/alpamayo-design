export default {
    root: ({ props }) => ({
        class: [
            'relative',
            { '[&>input]:pr-10': props.toggleMask },
            { 'flex [&>input]:w-full': props.fluid, 'inline-flex': !props.fluid }
        ]
    }),
    // PrimeVue 4 renders the field itself as a nested InputText addressed
    // through this section. Without it the input carries no class at all: a
    // small native box with a thin black border next to styled fields.
    pcInputText: {
        root: ({ props }) => ({
            class: [
                'leading-none m-0 w-full box-border py-2 px-3 h-[2.125rem] rounded-md',
                'text-surface-800 dark:text-white/80',
                'placeholder:text-placeholder',
                'border',
                {
                    'bg-surface-0 dark:bg-surface-950': !props.disabled,
                    'bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default':
                        props.disabled
                },
                {
                    'border-surface-300 dark:border-surface-700': !props.invalid,
                    'border-danger dark:border-red-400': props.invalid
                },
                {
                    'hover:border-surface-400 dark:hover:border-surface-600':
                        !props.disabled && !props.invalid,
                    'focus:outline-hidden focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10':
                        !props.disabled
                },
                'appearance-none transition-colors duration-200'
            ]
        })
    },
    overlay: {
        class: [
            // Spacing
            'p-3',

            // Shape
            'border',
            'shadow-md rounded-md',

            // Colors
            'bg-surface-0 dark:bg-surface-900',
            'text-surface-700 dark:text-white/80',
            'border-surface-200 dark:border-surface-700'
        ]
    },
    meter: {
        class: [
            // Position and Overflow
            'overflow-hidden',
            'relative',

            // Shape and Size
            'border-0',
            'h-[10px]',
            'rounded-md',

            // Spacing
            'mb-3',

            // Colors
            'bg-surface-100 dark:bg-surface-700'
        ]
    },
    meterLabel: ({ instance }) => ({
        class: [
            // Size
            'h-full',

            // Colors
            {
                'bg-danger dark:bg-danger-400/50': instance?.meter?.strength == 'weak',
                'bg-orange-500 dark:bg-orange-400/50': instance?.meter?.strength == 'medium',
                'bg-success dark:bg-green-400/50': instance?.meter?.strength == 'strong'
            },

            // Transitions
            'transition-all duration-1000 ease-in-out'
        ]
    }),
    maskIcon: {
        class: ['absolute top-1/2 right-3 -mt-2 z-10', 'text-surface-600 dark:text-white/70']
    },
    unmaskIcon: {
        class: ['absolute top-1/2 right-3 -mt-2 z-10', 'text-surface-600 dark:text-white/70']
    },
    transition: {
        enterFromClass: 'opacity-0 scale-y-[0.8]',
        enterActiveClass: 'transition-[transform,opacity] duration-120 ease-out',
        leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        leaveToClass: 'opacity-0'
    }
};
