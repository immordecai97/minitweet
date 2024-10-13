<script setup>
import ContainerComp from '@components/ContainerComp.vue';
import ExpandableText from '@components/ExpandableText.vue';
import usePosts from '@composables/usePosts';
import useAuth from '@composables/useAuth';
import { onMounted, ref } from 'vue';

const { user } = useAuth();
const { posts, fetchPosts, addPost } = usePosts();
const openModal = ref(false);
const post = ref({
    userID: user.value.uid,
    title: '',
    body: ''
});
const perfilPhotoDefault = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC"

function toggleModal() {
    openModal.value = !openModal.value;
}

async function handlerSubmit() {
    await addPost({ ...post.value });
    toggleModal();
    post.value = {
        userID: post.value.uid,
        title: '',
        body: ''
    };
}

onMounted(async () => {
    await fetchPosts();
    console.log(posts.value);
});
</script>

<template>
    <ContainerComp class="flex-1 flex flex-col">
        <ContainerComp class="flex-1 flex flex-col">
            <ContainerComp tag="h1" text="Feed" class="text-3xl font-bold text-center" />
            <ContainerComp tag="ul" v-if="posts && posts.length" class="flex-1 flex flex-col gap-4 pb-12 overflow-auto">
                <ContainerComp tag="li" v-for="post in posts" :key="post.id">
                    {{ console.log(post) }}
                    <ContainerComp tag="article" class="bg-transparent w-full border-b border-gray-800 pb-4 max-w-96">
                        <header class="flex gap-2 items-start">
                            <figure class="w-10 h-10">
                                <img alt="user photo" class="aspect-w-1 rounded-full"
                                    :src="post?.user?.photoURL || perfilPhotoDefault">
                            </figure>
                            <h3 class="font-bold flex-1">{{
                                post?.user?.name }} <span class="text-gray-600">@{{
                                    post?.user?.username }}</span></h3>
                        </header>
                        <section class="pl-12 -mt-5">
                            <h2 v-if="post?.title" class="font-bold break-words whitespace-normal">{{ post.title }}</h2>
                            <ExpandableText :text="post.body" />
                        </section>
                    </ContainerComp>
                </ContainerComp>
            </ContainerComp>
        </ContainerComp>
    </ContainerComp>
    <ContainerComp class="fixed bottom-[70px]">
        <ContainerComp class="max-w-96 flex justify-end pr-3 xs:pr-0">
            <button @click="toggleModal" class="bg-white text-black px-4 py-2 rounded-lg">Publicar</button>
        </ContainerComp>
    </ContainerComp>

    <Teleport to="#modal" v-if="openModal">
        <div @click.self="toggleModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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