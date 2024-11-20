<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from './composables/useAuth';
//------------------------------------------------------------------- COMPONENTS
import NavBar from '@components/NavBarComp.vue'
import ContainerComp from '@components/ContainerComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted } from 'vue';
//------------------------------------------------------------------- VUE ROUTER
import { RouterView, useRouter } from 'vue-router'
//------------------------------------------------------------------- USE COMPOSABLES
const router = useRouter();
const { checkAuth } = useAuth();
//------------------------------------------------------------------- METHODS
/**
 * Actualiza el título de la página
 * @param {Object} to - Ruta actual
 */
function updateTitle(to) {
	const defaultNameApp = 'Minitweet';
	const title = to.name ? `| ${to.name}` : '';
	document.title = `${defaultNameApp} ${title}`
}
//------------------------------------------------------------------- LIFECYCLE
onMounted(async () => {
	try {
		router.afterEach((to) => { updateTitle(to) })
		await checkAuth();
	} catch (error) {
		console.error(error)
	}
})
</script>

<template>
	<div class="mx-auto max-w-96 grid grid-rows-[1fr] h-[calc(100dvh-65px)] text-slate-200 px-2 text-sm">
		<main class="flex-1 w-full">
			<RouterView />
		</main>
	</div>
	<div class="fixed bottom-0 left-0 right-0 w-full">
		<ContainerComp id="barTop" class="relative mx-auto w-full max-w-96"></ContainerComp>
		<NavBar />
	</div>
</template>