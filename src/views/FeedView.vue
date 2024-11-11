<script setup>
//------------------------------------------------------------------- COMPOSABLES
import usePosts from '@composables/usePosts';
import useLoading from '@/composables/useLoading';
import useAuth from '@composables/useAuth';
import useModal from '@/composables/useModal'
//------------------------------------------------------------------- COMPONENTS
import TitleComp from '@/components/TitleComp.vue';
import PostList from '@/components/PostListComp.vue';
import FeedSkeleton from '@/components/skeletons/FeedSkeleton.vue';
import ContainerComp from '@components/ContainerComp.vue';
import Modal from '@components/ModalComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted, ref, onBeforeUnmount } from 'vue';

const { openModal, closeModal } = useModal();
const { loading, startLoading, endLoading } = useLoading();
const { user } = useAuth();
const { posts, fetchPosts, addPost } = usePosts();
const post = ref({
    userID: user.value.uid,
    title: '',
    body: ''
});

async function handlerSubmit() {
    await addPost({ ...post.value });
    post.value = {
        userID: post.value.uid,
        title: '',
        body: ''
    };
    closeModal();
}

function cancelNewPost(){
    post.value = {
        userID: post.value.uid,
        title: '',
        body: ''
    };
    closeModal();
}

onMounted(async () => {
    try {
        startLoading();
        await fetchPosts();
    } catch (error) {
        console.error(error);
    } finally {
         endLoading();
    }
});

onBeforeUnmount(() => closeModal());
</script>

<template>
    <div class="grid grid-rows-[1fr] h-[calc(100vh-64px)] overflow-y-auto">
        <template v-if="!loading">
            <ContainerComp class="flex-1 flex flex-col" v-if="posts.length">
                <TitleComp text="Feed" :stickyTop="true" />
                <PostList :posts="posts" />
            </ContainerComp>
        </template>
        <template v-else>
            <FeedSkeleton />
        </template>

    </div>

    <Teleport to="#barTop" v-if="!loading">
        <button @click="openModal"
            class="absolute bottom-1 right-0 bg-white text-black px-4 py-2 rounded-lg transition border border-transparent hover:bg-black hover:border-white hover:text-white">
            Publicar
        </button>
    </Teleport>

    <Modal :fn="cancelNewPost">
        <ContainerComp class="bg-black rounded-lg p-4 max-w-md">
            <form action="#" @submit.prevent="handlerSubmit()" class="flex flex-col gap-4">
                <label for="title" class="sr-only">Título</label>
                <input v-model="post.title" type="text" placeholder="Título"
                    class="custom-input">
                <label for="body" class="sr-only">Contenido</label>
                <textarea v-model="post.body" placeholder="Contenido" required
                    class="custom-input resize-none"></textarea>
                <ContainerComp class="flex flex-col gap-2">
                    <button type="submit"
                        class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">
                        Publicar
                    </button>
                    <button type="button" @click="cancelNewPost"
                        class="transition w-full py-2 bg-transparent text-white rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">
                        Cancelar
                    </button>
                </ContainerComp>
            </form>
        </ContainerComp>
    </Modal>
</template>