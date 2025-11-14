import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import Toast from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import  {  POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { SpeedInsights } from '@vercel/speed-insights/vue'; // Import the Vue-specific component

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n';
import { useLanguageStore } from '@/lang/language';


import messages from '@/lang/index';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
})

const options: PluginOptions = {
  timeout: 5000,
  position: POSITION.BOTTOM_RIGHT,
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.component('SpeedInsights', SpeedInsights);
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Toast, options)

// Sync i18n locale from Pinia language store after Pinia is ready
const languageStore = useLanguageStore()
if (languageStore.language) {
  const supportedLocales = ['en', 'fr'] as const
  type SupportedLocale = (typeof supportedLocales)[number]
  const storeLocale = languageStore.language as string
  const resolvedLocale: SupportedLocale = supportedLocales.includes(storeLocale as SupportedLocale)
    ? (storeLocale as SupportedLocale)
    : 'en'
  i18n.global.locale.value = resolvedLocale
}


app.mount('#app')
