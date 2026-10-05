/**
 * Pass-through for the focus guards PrimeVue renders around an overlay
 * (`hiddenFirstFocusableEl` / `hiddenLastFocusableEl` in Select, MultiSelect
 * and Listbox).
 *
 * PrimeVue 4 renders each guard as `<span role="presentation"
 * aria-hidden="true" tabindex="0">`: focusable, yet hidden from assistive
 * technology, which axe reports as `aria-hidden-focus`. A guard is empty and
 * moves focus on as soon as it receives it, so it has nothing to hide; dropping
 * both attributes leaves it a plain, empty, focusable element (the same shape
 * focus-lock libraries use) and keeps PrimeVue's Tab wrapping as it is.
 *
 * Upstream: primefaces/primevue#6103 (Select, closed without a fix in 4.5.5);
 * the same guards in Dialog's focus trap are primefaces/primevue#7949.
 * Remove this once PrimeVue renders the guards without aria-hidden.
 */
export default {
    role: undefined,
    'aria-hidden': undefined
};
