export default {
    root: {
        class: [
            //Flex
            'flex flex-col',

            //Shape
            'rounded-md',
            'shadow-md',

            //Color
            'bg-surface-0 dark:bg-surface-900',
            'text-surface-700 dark:text-surface-0'
        ]
    },
    body: {
        class: [
            //Flex
            'flex flex-col h-full',
            'gap-4',
            'grow',
            'p-6'
        ]
    },
    caption: {
        class: [
            //Flex
            'flex flex-col',
            'gap-2'
        ]
    },
    title: {
        class: 'text-section-inner-title font-semibold mb-0'
    },
    subtitle: {
        class: [
            'text-twoliner font-light text-sm text-surface-500 dark:text-surface-300',

            //Spacing
            'mb-0'
        ]
    },
    content: {
        class: 'p-0 h-full grow'
    },
    footer: {
        class: 'p-0'
    }
};
