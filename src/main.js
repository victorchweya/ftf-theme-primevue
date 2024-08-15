import "./assets/styles/main.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/rubik";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import MyPreset from "@/themes/ftf";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
	theme: {
		preset: MyPreset,
		options: {
			darkModeSelector: "light-theme",
		},
	},
});
app.use(ToastService);

app.mount("#app");
