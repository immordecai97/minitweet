// ----------------------------------------------------- TAILWIND CSS
import '@styles/tailwindCSS.css'
// ----------------------------------------------------- VUE
import { createApp } from 'vue'
// ----------------------------------------------------- APP COMPONENT
import App from './App.vue'
// ----------------------------------------------------- VUE ROUTER
import router from './router'
// ----------------------------------------------------- VUE CONFIG & MOUNT
createApp(App).use(router).mount('#app')