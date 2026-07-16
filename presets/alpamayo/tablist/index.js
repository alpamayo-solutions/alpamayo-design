export default {
    root: 'relative inline-flex',
    content:
        'overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-contain overscroll-y-auto [&::-webkit-scrollbar]:hidden grow',
    tabList:
        'relative inline-flex border-solid border-b-2 border-surface-200 dark:border-surface-700 gap-0 pb-0', // No gap, no padding
    nextButton:
        'absolute! top-0 right-0 z-20 h-full w-10 flex items-center justify-center text-surface-700 dark:text-surface-0/80 bg-surface-0 dark:bg-surface-900 outline-transparent cursor-pointer shrink-0',
    prevButton:
        'absolute! top-0 left-0 z-20 h-full w-10 flex items-center justify-center text-surface-700 dark:text-surface-0/80 bg-surface-0 dark:bg-surface-900 outline-transparent cursor-pointer shrink-0',
    tabButton: 'py-1 px-2 flex items-center justify-center border-none first:ml-0 last:mr-0', // Reduce py for smaller vertical padding
    activeBar: 'z-10 block absolute h-[2px] bottom-0 bg-secondary' // Ensure it's right at the bottom
};
