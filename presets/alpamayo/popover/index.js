export default {
    root: {
        class: [
            // Position
            'absolute left-0 top-0',
            'z-40 transform origin-center',
            '-mt-8',
            'data-[pc-position="right"]:ml-12!',
            '[&[data-pc-position="left"]>[data-pc-section="content"]]:mr-12',
            'data-[p-popover-flipped="true"]:mt-[2.4rem]!',

            // Color
            'bg-transparent',
            'text-surface-700 dark:text-surface-0/80',

            // Arrow
            `
      data-[pc-position="left"]:before:right-[2.4rem]
      data-[pc-position="right"]:before:-left-[0.7rem]

      data-[pc-position="left"]:before:rotate-180!

      before:absolute
      before:translate-y-[-50%]
      before:w-0
      before:top-[1.1rem]
      before:h-0
      before:border-transparent
      before:border-solid
      before:border-y-10
      before:border-r-10
      before:border-l-0
      before:border-r-surface-200
      dark:before:border-r-surface-800
      `,

            `
      data-[pc-position="left"]:after:right-[2.55rem]
      data-[pc-position="right"]:after:-left-[0.55rem]
      
      data-[pc-position="left"]:after:rotate-180!

      after:absolute
      after:translate-y-[-50%]
      after:w-0
      after:top-[1.1rem]
      after:h-0
      after:border-transparent
      after:border-solid
      after:border-y-8
      after:border-r-8
      after:border-l-0
      after:border-r-surface-0
      dark:after:border-r-surface-900
      `,

            // Flipped: Arrow
            `
      [&[data-p-popover-flipped="true"][data-pc-position="left"]]:before:right-[2.4rem]
      [&[data-p-popover-flipped="true"][data-pc-position="right"]]:before:-left-[0.7rem]

      [&[data-p-popover-flipped="true"][data-pc-position="left"]]:before:rotate-180!

      data-[p-popover-flipped="true"]:before:absolute
      data-[p-popover-flipped="true"]:before:w-0
      data-[p-popover-flipped="true"]:before:mt-auto
      data-[p-popover-flipped="true"]:before:mb-5
      data-[p-popover-flipped="true"]:before:-bottom-[1.2rem]
      data-[p-popover-flipped="true"]:before:translate-y-[-50%]
      data-[p-popover-flipped="true"]:before:h-0
      data-[p-popover-flipped="true"]:before:border-transparent
      data-[p-popover-flipped="true"]:before:border-solid
      data-[p-popover-flipped="true"]:before:border-y-10
      data-[p-popover-flipped="true"]:before:border-r-10
      data-[p-popover-flipped="true"]:before:border-l-0
      data-[p-popover-flipped="true"]:before:border-r-surface-200
      dark:data-[p-popover-flipped="true"]:before:border-r-surface-800
      `,

            `
      [&[data-p-popover-flipped="true"][data-pc-position="left"]]:after:right-[2.55rem]
      [&[data-p-popover-flipped="true"][data-pc-position="right"]]:after:-left-[0.55rem]

      [&[data-p-popover-flipped="true"][data-pc-position="left"]]:after:rotate-180!

      data-[p-popover-flipped="true"]:after:absolute
      data-[p-popover-flipped="true"]:after:w-0
      data-[p-popover-flipped="true"]:after:-bottom-[1.2rem]
      data-[p-popover-flipped="true"]:after:mt-auto
      data-[p-popover-flipped="true"]:after:mb-6
      data-[p-popover-flipped="true"]:after:translate-y-[-50%]
      data-[p-popover-flipped="true"]:after:h-0
      data-[p-popover-flipped="true"]:after:border-transparent
      data-[p-popover-flipped="true"]:after:border-solid
      data-[p-popover-flipped="true"]:after:border-y-8
      data-[p-popover-flipped="true"]:after:border-r-8
      data-[p-popover-flipped="true"]:after:border-l-0
      data-[p-popover-flipped="true"]:after:border-r-surface-0
      dark:data-[p-popover-flipped="true"]:after:border-r-surface-900
      `
        ]
    },
    content: {
        class: [
            // Shape
            'rounded-lg shadow-lg',
            'bg-surface-0 dark:bg-surface-900',

            '-ml-0.5 -mt-1 p-5 items-center flex',
            'border border-surface-200 dark:border-surface-700'
        ]
    },
    transition: {
        enterFromClass: 'opacity-0 scale-y-[0.8]',
        enterActiveClass: 'transition-[transform,opacity] duration-120 ease-out',
        leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        leaveToClass: 'opacity-0'
    }
};
