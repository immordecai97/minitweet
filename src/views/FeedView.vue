<script setup>
import { onMounted, ref } from 'vue';
import { getPosts, createPost } from '@services/posts';
import ContainerComp from '@/components/ContainerComp.vue';
import ExpandableText from '@/components/ExpandableText.vue';

// ---------------------------------------------------------------------------- Variables reactivas
// --> Aquí se crea una variable reactiva para guardar la lista de posts
const postList = ref([]);

// --> Aquí se crea una variable reactiva para guardar los datos del post
const post = ref({
        userData: {
                displayName: '',
                photoURL: null
        },
        title: '',
        body: ''
});
const perfilPhotoDefault = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC"

// --> Aquí se crea una variable reactiva para controlar el estado del modal
const openModal = ref(false);

// ---------------------------------------------------------------------------- Funciones
/**
 * Función para abrir y cerrar el modal
 */
function toggleModal() {
        openModal.value = !openModal.value;
}


/**
 * Función para crear un nuevo post
 */
function handlerSubmit() {
        createPost(post.value)
        post.value = {
                userData: {
                        displayName: '',
                        photoURL: null
                },
                title: '',
                body: ''
        };
        toggleModal()
}

// ---------------------------------------------------------------------------- Funciones de ciclo de vida
/**
 * Traemos los datos de la API y los guardamos a la variable postList
 */
onMounted(async () => {
        getPosts((posts) => postList.value = posts);
})

// ---------------------------------------------------------------------------- Watch
// // Watch para observar cambios en el objeto post
// watch(post, (newPost) => {
//         console.log('Post updated:', newPost.title);
// }, { deep: true });
</script>

<template>
        <ContainerComp class="flex-1 flex flex-col">
                <ContainerComp class="flex-1 flex flex-col gap-4">
                        <ContainerComp tag="h1" text="Feed" class="text-3xl font-bold text-center" />
                        <ContainerComp tag="ul" class="pb-12 flex-1 flex flex-col gap-4 overflow-auto">
                                <ContainerComp tag="li" v-for="post in postList" :key="post.id">
                                        <ContainerComp tag="article"
                                                class="bg-transparent w-full border-b border-gray-800 pb-4 max-w-96">
                                                <header class="flex gap-2 items-start">
                                                        <figure class="w-10 h-10">
                                                                <img alt="user photo" class="aspect-w-1 rounded-full"
                                                                        :src="post.userData?.photoURL || perfilPhotoDefault">
                                                        </figure>
                                                        <h3 class="font-bold flex-1">{{
                                                                post.userData?.displayName }} <span
                                                                        class="text-gray-600">@{{
                                                                                post.userData?.username }}</span></h3>
                                                </header>
                                                <section class="pl-12 -mt-5">
                                                        <h2 v-if="post?.title" class="font-bold break-words whitespace-normal">{{ post.title }}</h2>
                                                        <ExpandableText :text="post.body" />
                                                </section>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                </ContainerComp>
                <ContainerComp class="w-full max-w-72 bg-red-700 fixed right-0 bottom-[70px] xs:right-8 sm:right-16 md:right-36 lg:right-64 xl:right-96">
                        <button @click="toggleModal"
                                class="bg-white text-black px-4 py-2 rounded-lg absolute bottom-0 right-4">
                                Publicar
                        </button>
                </ContainerComp>
        </ContainerComp>

        <Teleport to="#modal" v-if="openModal">
                <div @click.self="toggleModal"
                        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <ContainerComp class="bg-black rounded-lg p-4 max-w-md">
                                <form action="#" @submit.prevent="handlerSubmit()" class="flex flex-col gap-4">
                                        <input v-model="post.title" type="text" placeholder="Título"
                                                class="text-white w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input">
                                        <textarea v-model="post.body" placeholder="Contenido"
                                                class="text-white w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input resize-none"></textarea>
                                        <ContainerComp class="flex flex-col gap-2">
                                                <button type="submit"
                                                        class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">
                                                        Publicar
                                                </button>
                                                <button @click="toggleModal"
                                                        class="transition w-full py-2 bg-transparent text-white rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">
                                                        Cancelar
                                                </button>
                                        </ContainerComp>
                                </form>

                        </ContainerComp>
                </div>
        </Teleport>
</template>
