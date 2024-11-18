<script setup>
//------------------------------------------------------------------- COMPOSABLES
import usePosts from '@/composables/usePosts';
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
import { onMounted, onBeforeUnmount, ref } from 'vue';

//------------------------------------------------------------------- USE COMPOSABLES
const { user } = useAuth();
const { postsList, getAllPosts, createNewPost } = usePosts();
const { loading, startLoading, endLoading } = useLoading();
const { openModal, closeModal } = useModal();

//------------------------------------------------------------------- DATA
const defaultImage = 'https://placehold.co/400x400'
const newPost = ref({
    userUID: user.value.uid,
    title: '',
    body: '',
    file: ''
});
const unsubscribe = ref(null);


//------------------------------------------------------------------- METHODS
async function handlerSubmit() {
    try {
        await createNewPost(newPost.value);
        newPost.value = {
            userUID: user.value.uid,
            title: '',
            body: '',
            file: ''
        };
    } catch (error) {
        console.error(error.message);

    }
    closeModal();
}

function cancelNewPost() {
    newPost.value = {
        userID: user.value.uid,
        title: '',
        body: '',
        file: ''
    };
    closeModal();
}
//------------------------------------------------------------------- INPUT FILE
const tempFileToPost = ref(null);
function handlerFileToPost(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        console.log('evento del reader', reader.result);
        tempFileToPost.value = reader.result;
        newPost.value.file = file;
    };
    reader.readAsDataURL(file);
}

//------------------------------------------------------------------- LIFECYCLE
onMounted(() => {
    startLoading();
    unsubscribe.value = getAllPosts((posts) => {
        postsList.value = posts;
        endLoading();
    });
});

onBeforeUnmount(() => {
    if (typeof unsubscribe.value === 'function') {
        unsubscribe.value();
        console.log('Unsubscribed');
    }
});
</script>

<template>
    <div class="grid grid-rows-[1fr] h-[calc(100vh-64px)] overflow-y-auto">
        <template v-if="!loading">
            <ContainerComp class="flex-1 flex flex-col">
                <TitleComp text="Feed" :stickyTop="true" />
                <!-- POST > 0-->
                <template v-if="postsList.length">
                    <PostList :posts="postsList" />
                </template>
                <!-- POST == 0-->
                <template v-else>
                    <ContainerComp class="flex-1 flex justify-center items-center">
                        <p class="text-center text-gray-500">No hay publicaciones...</p>
                    </ContainerComp>
                </template>
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

    <!-- 
                -> un formulario con un input para las imagenes
                -> un boton para crear la publicación con la imagen
                -> antes de enviar la publicación:
                        -> mostrar la imagen en un preview
                        -> si el usuario cambia de idea, puede cancelar la publicación
                -> al enviar la publicación se debe hacer los siguiente:
                        -> subir la imagen al storage (servicio de firebase)
                        -> obtener la url de la imagen
                        -> crear la publicación con la url de la imagen
                 -->

    <Modal :fn="cancelNewPost">
        <ContainerComp class="bg-black rounded-lg p-4 max-w-md">
            <ContainerComp class="max-w-72 mb-2">
                <ContainerComp tag="figure" class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                    <img :src="tempFileToPost || defaultImage" :alt="'Foto de perfil del usuario'" class="object-cover">
                    <!-- <img :src="tempCoverPhotoPreview || (userProfile?.coverPhotoURL || defaultCoverPhoto)"
                    :alt="userProfile?.name || 'Foto de perfil del usuario'" class="object-cover"> -->
                </ContainerComp>
            </ContainerComp>
            <form action="#" @submit.prevent="handlerSubmit()" class="flex flex-col gap-4">
                <!-- INPUT TÍTULO -->
                <label for="title" class="sr-only">Título</label>
                <input v-model="newPost.title" type="text" placeholder="Título" class="custom-input">
                <!-- TEXTAREA CONTENIDO -->
                <label for="body" class="sr-only">Contenido</label>
                <textarea v-model="newPost.body" placeholder="Contenido" required
                    class="custom-input resize-none"></textarea>
                <!-- INPUT FILE -->
                <label for="photo-upload" class="sr-only">Subir nueva foto</label>
                <input id="photo-upload" type="file" accept="image/*"
                    class="w-full file:w-full file:transition-all file:cursor-pointer file:mr-4 file:py-2 file:rounded-lg file:border file:border-white file:text-sm file:font-semibold file:bg-violet-50 file:text-black hover:file:bg-black hover:file:text-white"
                    @change="handlerFileToPost">
                <!-- BOTONES -->
                <ContainerComp class="flex flex-col gap-2">
                    <button type="submit"
                        class="transition w-full py-2 bg-white text-sm text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">
                        Publicar
                    </button>
                    <button type="button" @click="cancelNewPost"
                        class="transition w-full py-2 bg-transparent text-sm text-white rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">
                        Cancelar
                    </button>
                </ContainerComp>
            </form>
        </ContainerComp>
    </Modal>
</template>
