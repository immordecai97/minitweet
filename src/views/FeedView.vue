<script setup>
import usePosts from '@composables/usePosts';
import { onMounted } from 'vue';

const { posts, fetchPosts } = usePosts();

onMounted(async () => {
        await fetchPosts();
});
</script>

<template>
        <h1>feed</h1>
        <template v-if="posts.value && posts.value.length">
                <ul>
                        <li v-for="post in posts.value" :key="post.uid">
                                {{ post.body }}
                        </li>
                </ul>
        </template>
        <div v-else>
                <p>No posts available.</p>
        </div>
</template>



<!-- <template>
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
</template> -->
