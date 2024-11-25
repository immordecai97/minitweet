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
// ----------------------------------------------------- SERVICE WORKER
if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                                console.log('Service Worker registered', registration);
                        })
                        .catch((error) => {
                                console.log('Service Worker registration failed', error);
                        })
        });
}
