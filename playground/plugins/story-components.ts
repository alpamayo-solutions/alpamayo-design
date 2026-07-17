import Column from 'primevue/column';

// The layer's own primevue plugin (plugins/primevue.ts) registers directives and services but not
// PrimeVue components — those are imported per-file wherever used. Story slot strings are compiled
// at runtime (see playground/pages/story/[id].vue), so any PrimeVue component referenced inside a
// slot string (e.g. `<Column field="name" header="Device" />` for table stories) needs to resolve
// through the app context. Volt/Alp components are resolved directly by the story page via its own
// component registry, so only PrimeVue components used in slot content need registering here.
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('Column', Column);
});
