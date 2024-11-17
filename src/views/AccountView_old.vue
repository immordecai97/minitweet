<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth';
import usePosts from '@/composables/usePosts';
import useLoading from '@/composables/useLoading';
import useModal from '@/composables/useModal'
//------------------------------------------------------------------- COMPONENTS
import TitleComp from '@/components/TitleComp.vue';
import ContainerComp from '@/components/ContainerComp.vue';
import AccountSkeleton from '@/components/skeletons/AccountSkeleton.vue';
// import PostList from '@/components/PostListComp.vue';
import CoverPhotoComp from '@/components/CoverPhotoComp.vue';
import ProfilePhotoComp from '@/components/ProfilePhotoComp.vue';
import Modal from '@components/ModalComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const { openModal, closeModal } = useModal();
const { fetchPostsByUserId } = usePosts();
const { loading, startLoading, endLoading } = useLoading();
const { user, logout, fetchUserById, updateProfilePhoto, updateCoverPhoto } = useAuth();
let tempProfilePhotoPreview = ref(null);
let tempCoverPhotoPreview = ref(null);
const defaultPerfilPhoto = '/perfilPhotoDefault.png';
const defaultCoverPhoto = 'https://placehold.co/1600x900';
let selectedFile = ref(null);
const router = useRouter();
const route = useRoute();
const viewedUser = ref(null);
const isOwnAccount = ref(true);
const modalContent = ref(null);

/**
 * Dependiendo del contenido que se pase como argumento, se asigna el valor al ref modalContent
 * y se abre el modal con el contenido correspondiente.
 * @param content {string} - coverPhoto || profilePhoto
 */
function handlerContentModal(content = null) {
        // coverPhoto || profilePhoto
        modalContent.value = content;
        if (modalContent.value) { openModal(); }
}

function handlerLogoutUser() {
        logout().then(() => { router.push({ name: 'Login' }); });
}

async function saveProfilePhoto() {
        if (isOwnAccount.value && selectedFile.value && tempProfilePhotoPreview.value !== viewedUser.value?.photoURL && tempProfilePhotoPreview.value !== defaultPerfilPhoto) {
                const userConfirmed = confirm("¿Estás seguro de que deseas cambiar la imagen?");
                if (userConfirmed) {
                        await updateProfilePhoto(selectedFile.value);
                        viewedUser.value.photoURL = user.value.photoURL;
                        console.log('Guardado');
                        closeModal();
                }
        }
}

function cancelProfilePhotoUpload() {
        tempProfilePhotoPreview.value = viewedUser.value?.photoURL || defaultPerfilPhoto;
        selectedFile.value = null;
        closeModal();
}

function handleProfilePhotoUpload(e) {
        if (isOwnAccount.value) {
                tempProfilePhotoPreview.value = viewedUser.value?.photoURL || defaultPerfilPhoto;
                const file = e.target.files[0];
                selectedFile.value = file;
                const reader = new FileReader();
                reader.onload = async () => {
                        tempProfilePhotoPreview.value = reader.result;
                }
                reader.readAsDataURL(file);
        }
}
//------------------------------------------------------------------- FUNCIONES PARA COVER FOTO (REFACTORIZAR)
async function saveCoverPhoto() {
        if (isOwnAccount.value && selectedFile.value && tempCoverPhotoPreview.value !== viewedUser.value?.coverPhotoURL && tempCoverPhotoPreview.value !== defaultCoverPhoto) {
                const userConfirmed = confirm("¿Estás seguro de que deseas cambiar la imagen de portada?");
                if (userConfirmed) {
                        await updateCoverPhoto(selectedFile.value);
                        viewedUser.value.coverPhotoURL = user.value.coverPhotoURL;
                        console.log('Guardado');
                        closeModal();
                }
        }
}

function cancelCoverPhotoUpload() {
        tempCoverPhotoPreview.value = viewedUser.value?.coverPhotoURL || defaultCoverPhoto;
        selectedFile.value = null;
        closeModal();
}

function handleCoverPhotoUpload(e) {
        if (isOwnAccount.value) {
                tempCoverPhotoPreview.value = viewedUser.value?.coverPhotoURL || defaultCoverPhoto;
                const file = e.target.files[0];
                selectedFile.value = file;
                const reader = new FileReader();
                reader.onload = async () => {
                        tempCoverPhotoPreview.value = reader.result;
                }
                reader.readAsDataURL(file);
        }
}

// ------------------------------------------------------ FUNCIONES PARA ACTUALIZAR DATOS DE PERFIL
async function updateProfileData() {
        try {
                startLoading();
                const userIdOnURL = route.params.id;
                if (userIdOnURL !== user.value?.uid) {
                        isOwnAccount.value = false;
                        viewedUser.value = await fetchUserById(userIdOnURL);
                } else {
                        isOwnAccount.value = true;
                        viewedUser.value = user.value;
                }
                await fetchPostsByUserId(userIdOnURL);
        } catch (error) {
                console.error(error);
        } finally {
                endLoading();
        }
}

// Observar los cambios en la ruta
watch([() => route.params.id, () => user.value?.photoURL, () => user.value?.coverPhotoURL], async () => {
        await updateProfileData();
});

// Llamar a la función para cargar los datos del perfil al montar el componente
onMounted(async () => {
        try {
                await updateProfileData();
        } catch (error) {
                console.error(error);
        }
});

onBeforeUnmount(() => closeModal());
</script>

<template>
        <div class="grid grid-rows-[1fr] h-[calc(100vh-64px)] overflow-y-auto">
                <template v-if="!loading">
                        <ContainerComp class="flex-1 flex flex-col">
                                <ContainerComp class="flex-1 flex flex-col gap-4">
                                        <TitleComp text="Cuenta" :stickyTop="true" />
                                        <ContainerComp class="flex flex-col">
                                                <CoverPhotoComp 
                                                        :src="viewedUser?.coverPhotoURL" 
                                                        :alt="viewedUser?.name"
                                                        :isOwnAccount="isOwnAccount"
                                                        :onClick="() => handlerContentModal('coverPhoto')" />
                                                <ContainerComp
                                                        class="max-w-96 flex justify-between items-end -mt-10 xs:-mt-8">
                                                        <ProfilePhotoComp :src="viewedUser?.photoURL"
                                                                :alt="viewedUser?.name" :isOwnAccount="isOwnAccount"
                                                                :onClick="() => handlerContentModal('profilePhoto')" />
                                                        <div class="flex gap-2">
                                                                <template v-if="isOwnAccount">
                                                                        <router-link to="/account/edit"
                                                                                class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">Editar
                                                                                perfil</router-link>
                                                                        <button @click="handlerLogoutUser"
                                                                                class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">Cerrar
                                                                                sesión</button>
                                                                </template>
                                                                <template v-else>
                                                                        <router-link
                                                                                :to="{ name: 'PrivateChat', params: { id: viewedUser?.uid } }"
                                                                                class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">Chatear</router-link>
                                                                </template>
                                                        </div>
                                                </ContainerComp>
                                        </ContainerComp>
                                        <ContainerComp class="max-w-96 flex flex-col gap-2 justify-center items-center">
                                                <ContainerComp>
                                                        <ContainerComp class="flex flex-col items-center">
                                                                <ContainerComp tag="p" :text="`#${viewedUser?.uid}`"
                                                                        class="text-gray-500 text-opacity-80 text-xs" />
                                                                <ContainerComp class="flex">
                                                                        <ContainerComp tag="h2"
                                                                                class="font-bold text-base">
                                                                                {{ viewedUser?.name }} <span
                                                                                        class="font-normal text-gray-600 text-sm">@{{
                                                                                                viewedUser?.username }}</span>
                                                                        </ContainerComp>
                                                                </ContainerComp>
                                                        </ContainerComp>
                                                        <ContainerComp tag="p" :text="`Mail: ${viewedUser?.email}`"
                                                                class="text-gray-600" />
                                                        <ContainerComp class="flex">
                                                                <ContainerComp tag="p"
                                                                        :text="`Seguidores: ${viewedUser?.followers?.length}`"
                                                                        class="text-gray-200" />
                                                                <ContainerComp tag="p"
                                                                        :text="`Siguiendo: ${viewedUser?.following?.length}`"
                                                                        class="text-gray-200" />
                                                        </ContainerComp>
                                                </ContainerComp>
                                                <ContainerComp tag="p" :text="viewedUser?.bio"
                                                        class="break-words whitespace-normal" />
                                                <ContainerComp tag="h3" text="Publicaciones" class="sticky top-12 bg-black z-10 break-words whitespace-normal w-full border-b border-gray-200 py-1 max-w-96 mb-4" />
                                                <!-- {{ console.log(posts) }} -->
                                                <!-- <PostList :posts="posts" /> -->
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                </template>
                <template v-else>
                        <AccountSkeleton />
                </template>
        </div>

        <Modal>
                <!-- COVER PHOTO -->
                <template v-if="modalContent === 'coverPhoto'">
                        <ContainerComp class="max-w-96 px-2">
                                <ContainerComp tag="figure" class="max-w-96 aspect-w-16 aspect-h-9">
                                        <img :src="tempCoverPhotoPreview || (viewedUser?.coverPhotoURL || defaultCoverPhoto)"
                                                :alt="viewedUser?.name || 'Foto de perfil del usuario'"
                                                class="object-cover">
                                </ContainerComp>
                                <ContainerComp tag="form" class="mt-2 flex flex-col gap-2">
                                        <label for="photo-upload"
                                                class="block text-sm font-medium text-gray-300 text-center">Subir nueva
                                                foto</label>
                                        <input id="photo-upload" type="file" accept="image/*"
                                                class="w-full file:w-full file:transition-all file:cursor-pointer file:mr-4 file:py-2 file:rounded-lg file:border file:border-white file:text-sm file:font-semibold file:bg-violet-50 file:text-black hover:file:bg-black hover:file:text-white"
                                                @change="handleCoverPhotoUpload">
                                        <ContainerComp class="flex flex-col gap-2">
                                                <button type="button" @click="saveCoverPhoto"
                                                        :disabled="!Boolean(tempCoverPhotoPreview) || tempCoverPhotoPreview === viewedUser?.coverPhotoURL || tempCoverPhotoPreview === defaultCoverPhoto"
                                                        class="w-full py-2 rounded-lg text-sm  font-semibold border disabled:border-gray-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                        :class="{
                                                                'bg-violet-50 text-black hover:text-white hover:bg-black': !!tempCoverPhotoPreview && tempCoverPhotoPreview !== viewedUser?.coverPhotoURL && tempCoverPhotoPreview !== defaultCoverPhoto,
                                                        }">
                                                        Guardar
                                                </button>
                                                <button type="button" @click="cancelCoverPhotoUpload"
                                                        class="w-full py-2 rounded-lg border border-white text-sm font-semibold bg-violet-50 text-black hover:bg-black hover:text-white">Cancelar</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                </template>
                <!-- PROFILE PHOTO -->
                <template v-if="modalContent === 'profilePhoto'">
                        <ContainerComp class="max-w-96 px-2">
                                <ContainerComp tag="figure" class="aspect-w-1 aspect-h-1">
                                        <img :src="tempProfilePhotoPreview || (viewedUser?.coverPhotoURL || defaultPerfilPhoto)"
                                                :alt="viewedUser?.name || 'Foto de perfil del usuario'"
                                                class="w-full h-full object-cover">
                                </ContainerComp>
                                <ContainerComp tag="form" class="mt-2 flex flex-col gap-2">
                                        <label for="photo-upload"
                                                class="block text-sm font-medium text-gray-300 text-center">Subir nueva
                                                foto</label>
                                        <input id="photo-upload" type="file" accept="image/*"
                                                class="w-full file:w-full file:transition-all file:cursor-pointer file:mr-4 file:py-2 file:rounded-lg file:border file:border-white file:text-sm file:font-semibold file:bg-violet-50 file:text-black hover:file:bg-black hover:file:text-white"
                                                @change="handleProfilePhotoUpload">
                                        <ContainerComp class="flex flex-col gap-2">
                                                <button type="button" @click="saveProfilePhoto"
                                                        :disabled="!Boolean(tempProfilePhotoPreview) || tempProfilePhotoPreview === viewedUser?.photoURL || tempProfilePhotoPreview === defaultPerfilPhoto"
                                                        class="w-full py-2 rounded-lg text-sm  font-semibold border disabled:border-gray-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                        :class="{
                                                                'bg-violet-50 text-black hover:text-white hover:bg-black': !!tempProfilePhotoPreview && tempProfilePhotoPreview !== viewedUser?.photoURL && tempProfilePhotoPreview !== defaultPerfilPhoto,
                                                        }">
                                                        Guardar
                                                </button>
                                                <button type="button" @click="cancelProfilePhotoUpload"
                                                        class="w-full py-2 rounded-lg border border-white text-sm font-semibold bg-violet-50 text-black hover:bg-black hover:text-white">Cancelar</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                </template>
        </Modal>
</template>