import button from '../button/index.js';

export default {
    root: ({ props }) => ({
        class: [
            // Flexbox and Position
            'inline-flex',
            'relative',

            // Shape
            'rounded-md',
            { 'shadow-lg': props.raised },

            '*:data-[pc-name=pcbutton]:rounded-tr-none',
            '*:data-[pc-name=pcbutton]:rounded-br-none',
            '*:data-[pc-name=pcdropdown]:rounded-tl-none',
            '*:data-[pc-name=pcdropdown]:rounded-bl-none',
            '*:data-[pc-name=pcmenu]:min-w-full'
        ]
    }),
    // Delegate the inner action / dropdown buttons to the shared Button preset so the
    // SplitButton matches a normal Volt Button — icon/label gap, padding, sizing, and
    // severity colours all come from the same source. Without this, the unstyled inner
    // buttons inherit no pass-through classes and the icon sits flush against the label.
    pcButton: button,
    pcDropdown: button
};
