import { defineComponent, h } from 'vue';

/**
 * Stand-in for the global `RouterLink` that vue-router registers from
 * `install()` — the component AlpLink looks up at runtime.
 *
 * It marks its output with `data-router-link` rather than rendering a
 * lookalike anchor, so a test can tell "AlpLink routed through the registered
 * router component" apart from "AlpLink fell back to its own plain `<a>`".
 * Both produce an `<a href>`; only the marker distinguishes them.
 */
export const RouterLink = defineComponent({
    name: 'RouterLink',
    props: {
        to: { type: [String, Object], default: undefined },
        custom: { type: Boolean, default: false }
    },
    setup(props, { slots, attrs }) {
        const href = typeof props.to === 'string' ? props.to : undefined;
        const navigate = () => {};
        return () => {
            if (props.custom) return slots.default ? slots.default({ href, navigate }) : [];
            return h(
                'a',
                { ...attrs, href, 'data-router-link': '' },
                slots.default ? slots.default({ href, navigate }) : []
            );
        };
    }
});
