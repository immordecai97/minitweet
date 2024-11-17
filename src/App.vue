<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from './composables/useAuth';
//------------------------------------------------------------------- COMPONENTS
import NavBar from '@components/NavBarComp.vue'
import ContainerComp from '@components/ContainerComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router'
// import { setViewportHeight } from './utils/viewportHeight';

const { checkAuth } = useAuth();
const router = useRouter();

function updateTitle(to) {
  const defaultNameApp = 'Minitweet';
  const title = to.name ? `| ${to.name}` : '';
  document.title = `${defaultNameApp} ${title}`
}

onMounted(async () => {
  try {
    // setViewportHeight()
    // window.addEventListener('resize', setViewportHeight)
    router.afterEach((to) => { updateTitle(to) })
    await checkAuth();
  } catch (error) {
    console.error(error)
  }
})

// onBeforeUnmount(() => {
//   window.removeEventListener('resize', setViewportHeight)
// })

/**
 * TODO: Agregar loaders o skeletons                                                ----Listo----
 * TODO: Agregar mensajes de error (snackbars)
 * TODO: Agregar validaciones de formulario
 * TODO: Agregar imagen de perfil y de portada                                      ----Medio Listo----
 * TODO: Poder visitar el perfil de un usuario                                      ----Listo----
 * TODO: Poder comentar un tweet
 * TODO: Poder ver los tweets de un usuario y los propios al visitar el perfil      ----Listo----
 * TODO: Poder seguir a un usuario (opcional)
 * TODO: Poder dar like a un tweet (opcional)
 * TODO: Poder retweetear un tweet (opcional)
 * TODO: Poder ver los seguidores y seguidos de un usuario (opcional)
 */
</script>

<template>
  <div class="grid grid-rows-[1fr] h-[calc(100vh-65px)] text-slate-200 px-2">
    <ContainerComp tag="main" class="max-w-96">
      <RouterView />
    </ContainerComp>

    <!-- <ContainerComp class="fixed bottom-0 left-0 right-0 app-wrapper w-full "> -->
    <ContainerComp class="fixed bottom-0 left-0 right-0 w-full ">
      <ContainerComp id="barTop" class="relative mx-auto w-full max-w-96"></ContainerComp>
      <NavBar />
    </ContainerComp>
  </div>
</template>

<!-- <style>
.fullHeight {
  height: calc(var(--vh, 1vh) * 100);
}
</style> -->