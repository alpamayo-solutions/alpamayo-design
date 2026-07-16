import PrimeVue from 'primevue/config';
// @ts-ignore -- JS preset without types
import Alpamayo from '../presets/alpamayo';
import AnimateOnScroll from 'primevue/animateonscroll';
import BadgeDirective from 'primevue/badgedirective';
import ConfirmationService from 'primevue/confirmationservice';
import StyleClass from 'primevue/styleclass';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

export default defineNuxtPlugin((nuxtApp) => {
    const app = nuxtApp.vueApp;
    app.use(PrimeVue, { unstyled: true, pt: Alpamayo });
    app.directive('badge', BadgeDirective);
    app.directive('tooltip', Tooltip);
    app.directive('styleclass', StyleClass);
    app.directive('animateonscroll', AnimateOnScroll);
    app.use(ToastService);
    app.use(ConfirmationService);
});
