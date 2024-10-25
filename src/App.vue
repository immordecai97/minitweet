<script setup>
import { onMounted } from 'vue';
import NavBar from '@components/NavBarComp.vue'
import { RouterView, useRouter } from 'vue-router'
import ContainerComp from '@components/ContainerComp.vue';

const router = useRouter();

function updateTitle(to) {
  const defaultNameApp = 'Minitweet';
  const title = to.name || ''
  document.title = `${defaultNameApp} | ${title}`
}

onMounted(() => {
  try {
    router.afterEach((to) => { updateTitle(to) })
  } catch (error) {
    console.error(error)
  }
})

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
  <div class="grid grid-rows-[1fr_auto_auto] h-screen text-slate-200 px-2">
    <ContainerComp tag="main" class="max-w-96">
      <RouterView />
    </ContainerComp>
    <ContainerComp id="btnPost" class="relative max-w-96 bg-red-500">
    </ContainerComp>
    <ContainerComp>
      <NavBar />
    </ContainerComp>
  </div>
</template>