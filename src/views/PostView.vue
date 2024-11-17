<script setup>
// TODO: Agregar los del tiempo de comentario (cuando fué comentado)
//------------------------------------------------------------------- COMPOSABLES
import usePosts from '@composables/usePosts.js';
import useLoading from '@/composables/useLoading';
import useAuth from '@/composables/useAuth';
import useComments from '@/composables/useComments';
import useModal from '@/composables/useModal';
//------------------------------------------------------------------- COMPONENTS
//------------------------------------------------------------------- VUE COMPOSITION API
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ContainerComp from '@/components/ContainerComp.vue';
import TitleComp from '@/components/TitleComp.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
import ModalComp from '@/components/ModalComp.vue';

const { comments, getCommentsByPostID, saveComment } = useComments();
const { loading, startLoading, endLoading } = useLoading();
const { getPostByID, updatePost } = usePosts();
const { user, getUserById } = useAuth();
const { modal, openModal, closeModal } = useModal();
const route = useRoute();

const ProfilePhotoDefault = '/perfilPhotoDefault.png';
const post = ref(null);
const userFromPost = ref(null);
const unsubscribe = ref(null);
const newComment = ref({
    postID: route.params.id,
    userUID: user.value.uid,
    comment: ''
});
const updatePostData = ref({
    title: '',
    body: ''
});

async function handlerSubmitComment() {
    try {
        await saveComment({ ...newComment.value });
        newComment.value.comment = '';
    } catch (error) {
        console.error(error);
    }
}

async function handlerSubmitEdit() {
    await updatePost(post.value.id, { title: 'Hola acabo de esditar', body: 'Este post nuevo' });
    post.value = await getPostByID(route.params.id);
}

function cancelEdit() {
    updatePostData.value = {
        title: post.value?.title,
        body: post.value?.body
    }
    closeModal();
}

onMounted(async () => {
    try {
        startLoading();
        post.value = await getPostByID(route.params.id);
        unsubscribe.value = await getCommentsByPostID(route.params.id, async (commentsFromDB) => {
            const commentsWithUser = await Promise.all(commentsFromDB.map(async (comment) => {
                const userFromComment = await getUserById(comment.userUID);
                return { ...comment, user: userFromComment };
            }));
            comments.value = commentsWithUser;
        });
        if (post.value.userUID === user.value.uid) {
            userFromPost.value = user.value;
            updatePostData.value = {
                title: post.value?.title,
                body: post.value?.body
            }
        } else {
            userFromPost.value = await getUserById(post.value.userUID);
        }
    } catch (error) {
        console.error(error);
    } finally {
        endLoading();
    }
});

onBeforeUnmount(() => {
    if (unsubscribe.value) {
        unsubscribe.value();
    }
});
</script>

<template>
    <div class="grid grid-rows-[1fr] h-[calc(100vh-104px)] overflow-y-auto">
        <template v-if="!loading">
            <ContainerComp v-if="post" class="flex flex-col">
                <TitleComp text="Post" :stickyTop="true" />
                <!-- Datos del Post/Publicación -->
                <div class="min-h-40 border-b border-gray-800 pb-2">
                    <!-- Usuario -->
                    <div class="flex gap-2 min-h-16">
                        <figure class="min-w-16 max-w-16 rounded-full overflow-hidden">
                            <img :src="userFromPost.photoURL" :alt="userFromPost.name">
                        </figure>
                        <div class="w-full min-h-10">
                            <div class="flex justify-between items-center w-full pr-2">
                                <h2 class="min-h-10 flex flex-col"><span class="font-bold">{{ userFromPost.name
                                        }}</span> <span class="text-gray-400 text-xs">@{{ userFromPost.username
                                        }}</span></h2>
                                <button v-if="post.userUID === user.uid" @click="openModal" type="button"
                                    class="bg-white text-black py-1 px-3 rounded-lg text-xs">Editar</button>
                            </div>
                        </div>
                    </div>
                    <!-- Contenido -->
                    <div class="min-h-[52px] ml-[4.5rem] -mt-5">
                        <h3 class="font-bold text-lg">{{ post.title }}</h3>
                        <p>{{ post.body }}</p>
                    </div>
                    <!-- Botones -->
                    <div class="w-full flex justify-center items-center mt-2">
                        <ul class="flex justify-between w-60">
                            <li>
                                <button class="rounded-full bg-gray-900 w-10 h-10">❤</button>
                            </li>
                            <li>
                                <button class="rounded-full bg-gray-900 w-10 h-10">🥩</button>
                            </li>
                            <li>
                                <button class="rounded-full bg-gray-900 w-10 h-10">🍕</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- COMENTARIOS -->
                <div v-if="comments.length" class="w-full flex">
                    <ul class="flex-1 w-full pb-1 flex flex-col">
                        <!-- COMENTARIO -->
                        <li v-for="comment in comments" :key="comment.id"
                            class="border-b border-gray-800 pb-2 mt-2 bg-gray-900 bg-opacity-35 rounded-lg pl-4 pr-2 py-2 min-h-[57px]">
                            <!-- Usuario -->
                            <div class="flex gap-2 min-h-[40px]">
                                <figure class="min-w-10 max-w-10 rounded-full overflow-hidden">
                                    <img :src="comment.user.photoURL || ProfilePhotoDefault" :alt="comment.user.name">
                                </figure>
                                <div class="flex justify-between w-full">
                                    <h2 class=""><span>{{ comment.user.name }}</span> <span
                                            class="text-gray-400 text-xs">@{{ comment.user.username }}</span></h2>
                                    <p class="text-xs text-gray-400">hace 2d</p>
                                </div>
                            </div>
                            <!-- Comentario -->
                            <p class="ml-12 -mt-4 text-xs">{{ comment.comment }}</p>
                        </li>
                    </ul>
                </div>
                <div v-else class="flex flex-col justify-center items-center">
                    <p class="mt-4 text-gray-400 text-sm">Aún no hay comentarios...</p>
                </div>
            </ContainerComp>
        </template>
        <template v-else>
            <ContainerComp class="flex flex-col">
                <div class="flex-1 flex justify-center items-center">
                    <LoaderComp />
                </div>
            </ContainerComp>
        </template>
    </div>

    <Teleport to="#barTop">
        <form @submit.prevent="handlerSubmitComment"
            class="flex rounded-lg shadow-sm shadow-black/[.04] absolute bottom-1 w-full px-2">
            <label for="comment" class="sr-only">Comentar</label>
            <input v-model="newComment.comment" type="text" id="comment" placeholder="Comentar"
                class="bg-gray-600 bg-opacity-40 flex h-9 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-black/[.04] placeholder:text-muted-foreground/70 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 -me-px flex-1 rounded-e-none focus-visible:z-10" />
            <button
                class="bg-gray-600 bg-opacity-40 inline-flex items-center rounded-e-lg border border-input px-3 text-sm text-foreground hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 disabled:text-gray-700 disabled:cursor-not-allowed">Enviar</button>
        </form>
    </Teleport>

    <ModalComp v-if="modal" :fn="cancelEdit">
        <ContainerComp tag="form" @submit.prevent="handlerSubmitEdit" class="flex-1 max-w-md" action="#">
            <ContainerComp class="flex flex-col gap-4 items-center">
                <ContainerComp>
                    <label for="title" class="sr-only">Título</label>
                    <input v-model="updatePostData.title" type="title" id="title" name="title" placeholder="Título"
                        class="custom-input" required>
                </ContainerComp>

                <ContainerComp>
                    <label for="body" class="sr-only">Tweet</label>
                    <input v-model="updatePostData.body" type="body" id="body" name="body"
                        placeholder="Escribe tu Tweet" class="custom-input" required>
                </ContainerComp>

                <ContainerComp>
                    <button type="submit" :disabled="!updatePostData.title && !updatePostData.body"
                        class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent disabled:cursor-not-allowed disabled:bg-gray-900 disabled:hover:border-transparent disabled:text-gray-600 disabled:hover:bg-none">
                        Actualizar post
                    </button>
                </ContainerComp>
                <ContainerComp>
                    <button type="button" @click="cancelEdit"
                        class="transition w-full py-2 bg-black text-white rounded-lg border border-white hover:border-transparent hover:text-black hover:bg-white">Cancelar</button>
                </ContainerComp>
            </ContainerComp>
        </ContainerComp>
    </ModalComp>
</template>