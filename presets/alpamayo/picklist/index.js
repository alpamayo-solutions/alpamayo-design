export default {
    root: ({ _props }) => ({
        class: ['flex w-full max-w-full **:data-[pc-name=pclist]:h-full flex-col lg:flex-row']
    }),
    sourceControls: {
        class: [
            // Flexbox & Alignment
            'flex flex-col justify-center gap-2',

            // Spacing
            'p-4.5'
        ]
    },
    sourceListContainer: {
        class: [
            // Flexbox
            'grow shrink basis-2/4',

            'min-w-0',
            'max-w-full',

            // Shape
            'rounded-md',

            // Color
            'bg-surface-0 dark:bg-surface-900',
            'border border-surface-200 dark:border-surface-700',
            'outline-hidden'
        ]
    },
    transferControls: ({ _props }) => ({
        class: [
            // Flexbox & Alignment
            'flex justify-center gap-2',

            'flex-row lg:flex-col',

            // Spacing
            'p-4.5'
        ]
    }),
    targetListContainer: {
        class: [
            // Flexbox
            'grow shrink basis-2/4',

            'min-w-0',
            'max-w-full',

            // Shape
            'rounded-md',

            // Color
            'bg-surface-0 dark:bg-surface-900',
            'border border-surface-200 dark:border-surface-700',
            'outline-hidden'
        ]
    },
    targetControls: {
        class: [
            // Flexbox & Alignment
            'flex flex-col justify-center gap-2',

            // Spacing
            'p-4.5'
        ]
    },
    transition: {
        enterFromClass: 'transition-none!',
        enterActiveClass: 'transition-none!',
        leaveActiveClass: 'transition-none!',
        leaveToClass: 'transition-none!'
    }
};
