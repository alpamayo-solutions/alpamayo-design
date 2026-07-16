export default {
    root: ({ props }) => ({
        class: [
            'relative w-full',

            // Flex & Alignment
            { 'flex flex-col': props.scrollable && props.scrollHeight === 'flex' },

            // Size
            { 'h-full': props.scrollable && props.scrollHeight === 'flex' }
        ]
    }),

    mask: ({ _props }) => ({
        class: [
            // Position
            'absolute',
            'top-0 left-0',
            'z-20',

            // Flex & Alignment
            'flex items-center justify-center',

            // Size
            'w-full h-full',

            // Color
            'bg-surface-100/40 dark:bg-surface-900/40',

            // Transition
            'transition duration-200'
        ]
    }),
    loadingIcon: {
        class: 'w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 animate-spin'
    },
    tableContainer: ({ props }) => ({
        class: [
            {
                relative: props.scrollable

                // 'relative w-[calc(100vw-5.2rem)] md:w-[calc(100vw-5rem)] lg:w-full':
                //   props.scrollable,
                // // relative: props.scrollable,
                // 'flex flex-col grow': props.scrollable && props.scrollHeight === 'flex',
            },

            // Size
            // { 'h-full': props.scrollable && props.scrollHeight === 'flex' },
            props.scrollable && props.scrollHeight === 'flex' ? 'h-full' : props.scrollHeight,

            'min-h-[7em]' // Prevents loading spinner from overflowing
        ]
    }),
    header: ({ props }) => ({
        class: [
            // 'font-bold',

            // Shape
            props.showGridlines ? 'border-x border-t border-b-0' : 'border-x-0',

            // Spacing
            'py-4',

            // Color
            'bg-surface-0 dark:bg-surface-900',
            'border-surface-200 dark:border-surface-700',
            'text-surface-700 dark:text-white/80'
        ]
    }),
    table: {
        class: 'w-full border-spacing-0 border-separate'
    },
    thead: ({ context }) => ({
        class: [
            {
                'bg-surface-0 dark:bg-surface-900 top-0 z-40 sticky': context.scrollable
            }
        ]
    }),
    tbody: ({ instance, context }) => ({
        class: [
            {
                'sticky z-20': instance.frozenRow && context.scrollable
            },
            'bg-surface-0 dark:bg-surface-900'
        ]
    }),
    tfoot: ({ context }) => ({
        class: [
            {
                'bg-surface-0 bottom-0 z-0': context.scrollable
            }
        ]
    }),
    footer: {
        class: [
            'font-bold',

            // Shape
            'border-t-0 border-b border-x-0',

            // Spacing
            'p-4',

            // Color
            'bg-surface-0 dark:bg-surface-900',
            'border-surface-200 dark:border-surface-700',
            'text-surface-700 dark:text-white/80'
        ]
    },
    column: {
        headerCell: ({ context, props }) => ({
            class: [
                'font-semibold',
                'leading-[normal]',

                // Text Size
                'text-sm lg:text-base',

                // Position
                { 'sticky z-20 border-b': props.frozen || props.frozen === '' },

                { relative: context.resizable },

                // Alignment
                'text-left',

                // Shape
                { 'first:border-l border-y border-r': context?.showGridlines },
                'border-0 border-b border-solid',

                // Spacing
                context?.size === 'small'
                    ? 'py-1.5 px-2'
                    : context?.size === 'large'
                      ? 'py-3.75 px-5'
                      : 'py-3 px-4',

                // Color
                (props.sortable === '' || props.sortable) && context.sorted
                    ? 'bg-primary-50 text-primary-800 dark:bg-primary-900/40 dark:text-primary-100'
                    : 'bg-surface-50 text-surface-700 dark:text-white/80 dark:bg-surface-800',
                'border-surface-200 dark:border-surface-700 ',

                // States
                {
                    'hover:bg-surface-100 dark:hover:bg-surface-800/50':
                        (props.sortable === '' || props.sortable) && !context?.sorted
                },
                'focus-visible:outline-hidden focus-visible:outline-offset-0 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

                // Transition
                { 'transition duration-200': props.sortable === '' || props.sortable },

                // Misc
                { 'cursor-pointer': props.sortable === '' || props.sortable },
                {
                    'overflow-hidden whitespace-nowrap border-y bg-clip-padding': context?.resizable // Resizable
                }
            ]
        }),

        pcSortBadge: {
            root: {
                class: 'hidden'
            }
        },

        columnHeaderContent: {
            class: 'flex min-w-0 items-center gap-2 whitespace-nowrap overflow-hidden [&_.p-column-title]:min-w-0 [&_.p-column-title]:truncate'
        },
        sort: ({ context }) => ({
            class: [
                context.sorted ? 'text-primary-700' : 'text-surface-700',
                context.sorted ? 'dark:text-primary-200' : 'dark:text-white/80'
            ]
        }),

        bodyCell: ({ props, context, state, parent }) => ({
            class: [
                // Font
                'leading-[normal]',

                //Position
                { 'sticky box-border border-b': parent.instance.frozenRow },
                {
                    'sticky box-border border-b z-20': props.frozen || props.frozen === ''
                },

                // Alignment
                'text-left',

                // Text Size
                'text-sm lg:text-base',

                // Shape
                'border-0 border-b border-solid',
                { 'first:border-l border-r border-b': context?.showGridlines },
                {
                    'bg-surface-0 dark:bg-surface-900':
                        parent.instance.frozenRow || props.frozen || props.frozen === ''
                },

                // Spacing
                {
                    'py-1.5 px-2': context?.size === 'small' && !state['d_editing']
                },
                {
                    'py-3.75 px-5': context?.size === 'large' && !state['d_editing']
                },
                {
                    'py-3 px-4': context?.size !== 'large' && context?.size !== 'small' && !state['d_editing']
                },
                { 'py-[0.6rem] px-2': state['d_editing'] },

                // Color
                'border-surface-200 dark:border-surface-700',
                'group-hover:bg-surface-100/80 dark:group-hover:bg-surface-800/70',
                'group-hover:text-surface-700 dark:group-hover:text-white/90',

                {
                    'overflow-hidden whitespace-nowrap border-y bg-clip-padding':
                        parent.instance?.$parentInstance?.$parentInstance?.resizableColumns // Resizable
                },

                // Misc
                'break-words'
            ]
        }),
        footerCell: ({ context }) => ({
            class: [
                // Font
                'font-bold',

                // Alignment
                'text-left',

                // Shape
                'border-0 border-b border-solid',
                { 'border-x border-y': context?.showGridlines },

                // Spacing
                context?.size === 'small' ? 'p-2' : context?.size === 'large' ? 'p-5' : 'p-4',

                // Color
                'border-surface-200 dark:border-surface-700',
                'text-surface-700 dark:text-white/80',
                'bg-surface-0 dark:bg-surface-900'
            ]
        }),
        sortIcon: ({ context }) => ({
            class: ['ml-1 shrink-0', context.sorted ? 'text-inherit' : 'text-surface-700 dark:text-white/70']
        }),
        columnFilter: {
            class: 'ml-auto inline-flex shrink-0 items-center font-normal'
        },
        filterOverlay: {
            class: [
                'flex flex-col gap-3',

                // Position
                'absolute top-0 left-0',

                // Shape
                'border-0 dark:border',
                'rounded-lg',
                'shadow-lg ring-1 ring-surface-200/80 dark:ring-surface-700',

                // Size
                'min-w-64 max-w-[min(22rem,calc(100vw-2rem))]',

                // Color
                'bg-surface-0 dark:bg-surface-900',
                'text-surface-800 dark:text-white/80',
                'dark:border-surface-700'
            ]
        },
        filterConstraintList: {
            class: 'm-0 p-0 py-3 list-none'
        },
        filterConstraint: ({ context }) => ({
            class: [
                // Font
                'font-normal',
                'leading-none',

                // Position
                'relative',

                // Shape
                'border-0',
                'rounded-none',

                // Spacing
                'm-0',
                'py-3 px-5',

                // Color
                { 'text-surface-700 dark:text-white/80': !context?.highlighted },
                {
                    'bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-white/80':
                        !context?.highlighted
                },
                { 'bg-highlight': context?.highlighted },

                //States
                {
                    'hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]': !context?.highlighted
                },
                {
                    'hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-[rgba(255,255,255,0.03)]':
                        !context?.highlighted
                },
                'focus-visible:outline-hidden focus-visible:outline-offset-0 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

                // Transitions
                'transition-shadow',
                'duration-200',

                // Misc
                'cursor-pointer',
                'overflow-hidden',
                'whitespace-nowrap'
            ]
        }),
        filterOperator: {
            class: [
                // Shape
                'rounded-t-md',

                // Color
                'text-surface-700 dark:text-white/80',
                'bg-surface-0 dark:bg-surface-700',
                '*:data-[pc-name=pcfilteroperatordropdown]:w-full'
            ]
        },
        filter: ({ instance }) => ({
            class: [
                {
                    'flex items-center w-full gap-2': instance.display === 'row',
                    'inline-flex ml-auto shrink-0': instance.display === 'menu'
                },
                '[&_[data-pc-name=pcfiltermenubutton]]:h-8 [&_[data-pc-name=pcfiltermenubutton]]:w-8'
            ]
        }),
        filterRule: 'flex flex-col gap-2',
        filterButtonbar:
            'flex items-center justify-between gap-2 border-t border-surface-100 pt-3 dark:border-surface-700',
        filterAddButtonContainer: '*:data-[pc-name=pcfilteraddrulebutton]:w-full',
        rowToggleButton: {
            class: [
                'relative',

                // Flex & Alignment
                'inline-flex items-center justify-center',
                'text-left',

                // Spacing
                'm-0 p-0',

                // Size
                'w-8 h-8',

                // Shape
                'border-0 rounded-full',

                // Color
                'text-surface-500 dark:text-white/70',
                'bg-transparent',
                'focus-visible:outline-hidden focus-visible:outline-offset-0',
                'focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

                // Transition
                'transition duration-200',

                // Misc
                'overflow-hidden',
                'cursor-pointer select-none'
            ]
        },
        columnResizer: {
            class: [
                'block',

                // Position
                'absolute top-0 right-0',

                // Sizing
                'w-2 h-full',

                // Spacing
                'm-0 p-0',

                // Color
                'border border-transparent',

                // Misc
                'cursor-col-resize'
            ]
        },
        transition: {
            class: 'p-4 flex flex-col gap-2',
            enterFromClass: 'opacity-0 scale-y-[0.8]',
            enterActiveClass: 'transition-[transform,opacity] duration-120 ease-out',
            leaveActiveClass: 'transition-opacity duration-100 ease-linear',
            leaveToClass: 'opacity-0'
        }
    },
    bodyRow: ({ context, props }) => {
        return {
            class: [
                {
                    group: (props.selectionMode || props.rowHover || context.selectable) && !context.selected
                },

                // Color
                'dark:text-white/80',
                { 'bg-highlight': context.selected && props.highlightOnSelect },
                {
                    'bg-surface-0 text-surface-600 dark:bg-surface-900': !context.selected
                },
                { 'font-bold bg-surface-0 dark:bg-surface-900 z-20': props.frozenRow },
                {
                    'odd:bg-surface-0 odd:text-surface-600 dark:odd:bg-surface-900 even:bg-surface-50 even:text-surface-600 dark:even:bg-surface-800/50':
                        context.stripedRows
                },

                // State
                {
                    'hover:bg-surface-100/80 dark:hover:bg-surface-800/70 hover:text-surface-700 dark:hover:text-white/90':
                        (props.selectionMode || props.rowHover) && !context.selected
                },

                //allow hovering if onClick method of row is defined
                {
                    'hover:bg-surface-200': context.selectable && !context.selected
                },

                // Transition
                {
                    'transition duration-200': (props.selectionMode && !context.selected) || props.rowHover
                },

                // Misc
                { 'cursor-pointer': props.selectionMode || context.selectable || props.rowHover }
            ]
        };
    },
    emptyMessage: {
        class: 'py-10 text-center text-sm font-semibold text-surface-500 dark:text-surface-400'
    },
    emptyMessageCell: {
        class: 'py-10 text-center text-sm font-semibold text-surface-500 dark:text-surface-400'
    },
    rowExpansion: {
        class: 'bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-white/80'
    },
    rowGroupHeader: {
        class: ['sticky z-20', 'bg-surface-0 text-surface-600 dark:text-white/70', 'dark:bg-surface-900']
    },
    rowGroupFooter: {
        class: ['sticky z-20', 'bg-surface-0 text-surface-600 dark:text-white/70', 'dark:bg-surface-900']
    },
    rowToggleButton: {
        class: [
            'relative',

            // Flex & Alignment
            'inline-flex items-center justify-center',
            'text-left',

            // Spacing
            'm-0 p-0',

            // Size
            'w-8 h-8',

            // Shape
            'border-0 rounded-full',

            // Color
            'text-surface-500 dark:text-white/70',
            'bg-transparent',
            'focus-visible:outline-hidden focus-visible:outline-offset-0',
            'focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

            // Transition
            'transition duration-200',

            // Misc
            'overflow-hidden',
            'cursor-pointer select-none'
        ]
    },
    rowToggleIcon: {
        class: 'inline-block w-4 h-4'
    },
    columnResizeIndicator: {
        class: 'absolute hidden w-[2px] z-20 bg-primary'
    }
};
