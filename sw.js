const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

const urlsToCache = [
	'/index.html',
	'/manifest.json',
	'/minitweet.svg',
	'/favicon.svg',
	'/styles/tailwindCSS.css',
	...[48, 72, 96, 128, 144, 152, 192, 256, 384, 512].map(size => `/ico_minitweet_${size}x${size}.png`),
];

self.addEventListener('install', (e) => {
	self.skipWaiting();
	e.waitUntil(
		caches.open(CACHE_STATIC_NAME)
			.then((cache) => {
				return cache.addAll(urlsToCache);
			})
	)
	// console.log('Cacheado los recursos estaticos');
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(cacheNames.map((cacheName) => {
				if (cacheName !== CACHE_STATIC_NAME && cacheName !== CACHE_DYNAMIC_NAME) {
					// console.log('Borrando cache antiguo', cacheName);
					return caches.delete(cacheName);
				}
				// console.log('No se borra cache', cacheName);
			}));
		})
	)
});

self.addEventListener('fetch', (e) => {
	e.respondWith(
		fetch(e.request).then((networkResponse) => {
			return caches.open(CACHE_DYNAMIC_NAME)
				.then((cache) => {
					/**
					 * .put()
					 * El método put pertenece al objeto Cache y se utiliza para almacenar una respuesta en la caché.
					 * Toma dos argumentos:
					 * Request: La solicitud que se está almacenando.
					 * Response: La respuesta que se está almacenando.
					 * @param {Request} request
					 * @param {Response} response
					 */
					/**
					 * .clone()
					 * El método clone pertenece al objeto Response y se utiliza para crear una copia de la respuesta.
					 * Esto es necesario porque las respuestas son "streams" (en español streams se puede entender como flujos) y solo se pueden consumir una vez.
					 * Al clonar la respuesta, puedes usar una copia para almacenar en la caché y otra para devolver al navegador.
					 */
					cache.put(e.request, networkResponse.clone());
					return networkResponse;
				})
		}).catch((error) => {
			// console.log("Sin conexion, recuperando cache...");
			return caches.match(e.request);
		})
	);
});
