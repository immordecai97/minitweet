// Declaramos el nombre de la cache
const cacheName = 'v1';

// Declaramos un array con los recursos que queremos cachear
const urlsToCache = [
        '/',
        '/index.html',
        '/manifest.json',
        '/minitweet.svg',
        '/favicon.svg',
        '/minitweet.png',
        '/styles/tailwindCSS.css',
];

/**
 * Evento 'install'
 * Se ejecuta cuando el Service Worker se instala por primera vez en el navegador
 * Se encarga de cachear los recursos estáticos declarados en 'urlsToCache'.
 * Son los recursos que necesitamos para que la aplicación funcione offline.
 */
self.addEventListener('install', (e) => {
        // Esperamos a que se termine de cachear los recursos
        e.waitUntil(
                // Abrimos la cache con el nombre declarado
                caches.open(cacheName)
                        // Una vez abierta la cache, añadimos los recursos
                        .then((cache) => {
                                console.log('Cacheado');
                                return cache.addAll(urlsToCache);
                        })
        )
})

/**
 * Evento 'Activate'
 * Se ejecuta cuando el Service Worker se activa por primera vez en el navegador
 * Se encarga de borrar las caches antiguas que ya no necesitamos y que no coincidan con el nombre de la cache actual.
 * Es importante borrar las caches antiguas para liberar espacio en el navegador.
 */
self.addEventListener('activate', (e) => {
        // Esperamos a que se termine de borrar las caches antiguas
        e.waitUntil(
                // Obtenemos todas las caches
                caches.keys().then((cacheNames) => {
                        // Recorremos todas las caches
                        return Promise.all(
                                // Filtramos las caches que no coincidan con el nombre de la cache actual
                                cacheNames.map((cache) => {
                                        // Si la cache no coincide, la borramos
                                        if (cache !== cacheName) {
                                                return caches.delete(cache);
                                        }
                                })
                        )
                })
        )
});

/**
 * Evento 'fetch'
 * Se ejecuta cada vez que la aplicación hace una petición a un recurso.
 * Se encarga de interceptar la petición y responder con el recurso de la cache si existe.
 * Si el recurso no existe en la cache, hace la petición a la red y devuelve el recurso.
 * De esta forma, si el usuario no tiene conexión a internet, la aplicación sigue funcionando con los recursos cacheados.
 */
self.addEventListener('fetch', (e) => {
        // Respondemos con la cache o con la petición
        e.respondWith(
                // Buscamos en la cache si existe el recurso
                caches.match(e.request)
                        .then((res) => {
                                // Si existe el recurso en la cache, lo devolvemos
                                if (res) {
                                        return res;
                                }
                                // Si no existe el recurso en la cache, hacemos la petición a la red
                                return fetch(e.request);
                        })
        );
});

// Que viene despues de esto? -> Registrar el Service Worker en el archivo index.html o en el archivo de entrada de la aplicación, por ejemplo main.js
// Para registrar el Service Worker, se utiliza el método 'register' del objeto 'navigator.serviceWorker' que nos proporciona el navegador.
// codigo:
/**
 * if ('serviceWorker' in navigator) {
 * window.addEventListener('load', () => {
 *   navigator.serviceWorker.register('/service-worker.js')
 *    .then(registration => {
 *       console.log('ServiceWorker registrado con éxito:', registration);
 *     })
 *     .catch(error => {
 *       console.log('Error en el registro del ServiceWorker:', error);
 *     });
 * });
 * }
 */