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

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n';


import messages from '@/lang/index';

const i18n = createI18n({
    legacy: false,
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages,
})

const options: PluginOptions = {
  timeout: 5000,
  position: POSITION.BOTTOM_RIGHT,
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Toast, options)


app.mount('#app')
