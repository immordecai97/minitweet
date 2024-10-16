<script setup>
import ContainerComp from '@components/ContainerComp.vue';
</script>

<template>
  <ContainerComp class="flex flex-col gap-6 max-w-xl">
    <ContainerComp tag="section" class="flex flex-col gap-4">
      <ContainerComp tag="h1" text="Sobre Minitweet" class="font-bold text-center text-3xl" />
      <ContainerComp class="flex flex-col gap-4 sm:flex-row">
        <ContainerComp tag="p"
          text="Minitweet es una red social de microblogging que te permite compartir tus pensamientos, ideas y opiniones en solo 280 caracteres."
          class="text-pretty text-center" />
        <ContainerComp tag="p"
          text="Creada por un entusiasta de la tecnología, Minitweet es la plataforma perfecta para aquellos que buscan una experiencia de redes sociales más simple y directa."
          class="text-pretty text-center" />
      </ContainerComp>
      <ContainerComp tag="section" class="flex flex-col gap-4">
        <ContainerComp tag="h2" text="Por si nos quieres probar en línea" class="font-bold text-center text-xl text-pretty" />
        <a target="_blank" href="https://minitweet.netlify.app/" class="text-center text-blue-700 hover:underline">Visita la app en línea</a>
      </ContainerComp>

    </ContainerComp>
    <ContainerComp tag="section" class="flex flex-col gap-4">
      <ContainerComp tag="h2" text="¿Por qué Minitweet?" class="font-bold text-center text-xl" />
      <ul class="grid grid-cols-12 gap-2 w-full max-w-96 mx-auto justify-items-center">
        <li class="col-span-12 w-full">
          <details class="bg-stone-900 p-2 rounded-md">
            <summary class="font-bold">Simplicidad:</summary>
            <p class="text-pretty max-w-64 text-center mx-auto">
              Disfruta de una experiencia limpia y directa, perfecta para los que valoran la comunicación rápida.
            </p>
          </details>
        </li>
        <li class="col-span-12 w-full">
          <details class="bg-stone-900 p-2 rounded-md">
            <summary class="font-bold">Comunidad:</summary>
            <p class="text-pretty max-w-64 text-center mx-auto">
              Conéctate con personas afines y comparte tus pasiones.
            </p>
          </details>
        </li>
        <li class="col-span-12 w-full">
          <details class="bg-stone-900 p-2 rounded-md">
            <summary class="font-bold">Diversión:</summary>
            <p class="text-pretty max-w-64 text-center mx-auto">
              Desde memes hasta pensamientos profundos, aquí hay espacio para todo.
            </p>
          </details>
        </li>
      </ul>
    </ContainerComp>
    <ContainerComp tag="section" class="flex flex-col gap-4">
      <ContainerComp tag="h2" text="¿Listo para unirte a la conversación?" class="font-bold text-center text-xl" />
      <p class="text-pretty text-center">
        Inicia sesión o regístrate ahora y sé parte de la revolución del
        microcontenido.
      </p>
      <ContainerComp class="flex flex-col gap-4 items-center">
        <router-link to="/login"
          class="transition bg-slate-50 text-black font-bold py-2 px-4 rounded-lg w-full max-w-96 text-center border border-transparent hover:bg-black hover:text-white hover:border-white">Iniciar
          sesión</router-link>
        <router-link to="/signup"
          class="transition bg-slate-50 text-black font-bold py-2 px-4 rounded-lg w-full max-w-96 text-center border border-transparent hover:bg-black hover:text-white hover:border-white">Registrarse</router-link>
      </ContainerComp>
    </ContainerComp>
  </ContainerComp>
</template>

<style scoped>
summary::marker {
  color: rgb(92, 228, 98);
}
</style>
