import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@components': fileURLToPath(new URL('./src/components', import.meta.url)),
			'@views': fileURLToPath(new URL('./src/views', import.meta.url)),
			'@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
			'@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
			'@services': fileURLToPath(new URL('./src/services', import.meta.url)),
			'@models': fileURLToPath(new URL('./src/models', import.meta.url)),
			'@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
		}
	}
})