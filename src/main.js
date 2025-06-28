import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

// Import translation files
import en from './locales/en.json'
import el from './locales/el.json'

// Configure i18n
const i18n = createI18n({
  legacy: false, // Enable Composition API mode
  locale: 'en', // default locale
  fallbackLocale: 'en',
  messages: {
    en,
    el
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
