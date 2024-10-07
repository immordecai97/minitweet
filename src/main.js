// ----------------------------------------------------- TailwindCSS
import '@styles/tailwindCSS.css'
// ----------------------------------------------------- Vue
import { createApp } from 'vue'
// ----------------------------------------------------- App
import App from './App.vue'
// ----------------------------------------------------- Vue Router
import router from './router'
// ----------------------------------------------------- Vue Configuration to use Vue Router and Mount App
createApp(App).use(router).mount('#app')