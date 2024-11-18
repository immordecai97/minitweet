<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth';
import useLoading from '@/composables/useLoading';
import useModal from '@/composables/useModal';
import usePosts from '@/composables/usePosts';

//------------------------------------------------------------------- COMPONENTS
import ContainerComp from '@/components/ContainerComp.vue';
import AccountSkeleton from '@/components/skeletons/AccountSkeleton.vue';
import TitleComp from '@/components/TitleComp.vue';
import CoverPhotoComp from '@/components/CoverPhotoComp.vue';
import ProfilePhotoComp from '@/components/ProfilePhotoComp.vue';
import Modal from '@components/ModalComp.vue';

//------------------------------------------------------------------- VUE COMPOSITION API
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import PostListComp from '@/components/PostListComp.vue';

//------------------------------------------------------------------- USE COMPOSABLES
const { loading, startLoading, endLoading } = useLoading();
const { openModal, closeModal } = useModal();
const { user, getUserById, logout, updateProfilePhoto, updateCoverPhoto } = useAuth();
const route = useRoute();
const router = useRouter();
const { getAllPostsByUserUID } = usePosts();

//------------------------------------------------------------------- DATA
const userProfile = ref(null);
const isOwnAccount = ref(false);
const modalContent = ref(null);
const tempProfilePhotoPreview = ref(null);
const tempCoverPhotoPreview = ref(null);
let selectedFile = ref(null);
const defaultPerfilPhoto = '/perfilPhotoDefault.png';
const defaultCoverPhoto = 'https://placehold.co/1600x900';
const postFromUser = ref([]);

//------------------------------------------------------------------- METHODS
function handlerLogoutUser() {
        if (isOwnAccount.value) logout().then(() => router.push('/login'));
}

// ------------------- PROFILE PHOTO
async function saveProfilePhoto() {
        if (isOwnAccount.value && selectedFile.value && tempProfilePhotoPreview.value !== userProfile.value?.photoURL && tempProfilePhotoPreview.value !== defaultPerfilPhoto) {
                const userConfirmed = confirm("¿Estás seguro de que deseas cambiar la imagen?");
                if (userConfirmed) {
                        await updateProfilePhoto(selectedFile.value);
                        userProfile.value.photoURL = user.value.photoURL;
                        closeModal();
                }
        }
}

function cancelProfilePhotoUpload() {
        tempProfilePhotoPreview.value = userProfile.value?.photoURL || defaultPerfilPhoto;
        selectedFile.value = null;
        closeModal();
}

function handleProfilePhotoUpload(e) {
        if (isOwnAccount.value) {
                tempProfilePhotoPreview.value = userProfile.value?.photoURL || defaultPerfilPhoto;
                const file = e.target.files[0];
                selectedFile.value = file;
                const reader = new FileReader();
                reader.onload = async () => {
                        tempProfilePhotoPreview.value = reader.result;
                }
                reader.readAsDataURL(file);
        }
}

// ------------------- COVER PHOTO
async function saveCoverPhoto() {
        if (isOwnAccount.value && selectedFile.value && tempCoverPhotoPreview.value !== userProfile.value?.coverPhotoURL && tempCoverPhotoPreview.value !== defaultCoverPhoto) {
                const userConfirmed = confirm("¿Estás seguro de que deseas cambiar la imagen de portada?");
                if (userConfirmed) {
                        await updateCoverPhoto(selectedFile.value);
                        userProfile.value.coverPhotoURL = user.value.coverPhotoURL;
                        closeModal();
                }
        }
}

function cancelCoverPhotoUpload() {
        tempCoverPhotoPreview.value = userProfile.value?.coverPhotoURL || defaultCoverPhoto;
        selectedFile.value = null;
        closeModal();
}

function handleCoverPhotoUpload(e) {
        if (isOwnAccount.value) {
                tempCoverPhotoPreview.value = userProfile.value?.coverPhotoURL || defaultCoverPhoto;
                const file = e.target.files[0];
                selectedFile.value = file;
                const reader = new FileReader();
                reader.onload = async () => {
                        tempCoverPhotoPreview.value = reader.result;
                }
                reader.readAsDataURL(file);
        }
}




function handlerContentModal(content = null) {
        modalContent.value = content;
        if (modalContent.value) { openModal(); }
}

async function checkUserProfile(uid) {
        try {
                startLoading();
                if (user.value?.uid === uid) {
                        userProfile.value = user.value;
                        isOwnAccount.value = true;
                } else {
                        isOwnAccount.value = false;
                        userProfile.value = await getUserById(uid);
                }
                postFromUser.value = await getAllPostsByUserUID(uid); // no borrar el await -> funciona solo typescript no lo reconoce

        } catch (error) {
                console.log(error);
        } finally {
                endLoading();
        }
}

//------------------------------------------------------------------- LIFECYCLE HOOKS
onMounted(async () => {
        checkUserProfile(route.params.id);
})

onBeforeUnmount(() => closeModal());

//------------------------------------------------------------------- WATCHERS
watch([() => route.params.id, () => user.value?.photoURL, () => user.value?.coverPhotoURL], async (newId) => {
        checkUserProfile(newId[0]);
})

</script>

<template>
        <div class="grid grid-rows-[1fr] h-[calc(100vh-64px)] overflow-y-auto">
                <template v-if="!loading">
                        <ContainerComp class="flex-1 flex flex-col">
                                <ContainerComp class="flex-1 flex flex-col gap-4">
                                        <TitleComp text="Cuenta" :stickyTop="true" />
                                        <ContainerComp class="flex flex-col">
                                                <CoverPhotoComp :src="userProfile?.coverPhotoURL"
                                                        :alt="userProfile?.name" :isOwnAccount="isOwnAccount"
                                                        :onClick="() => handlerContentModal('coverPhoto')" />
                                                <ContainerComp
                                                        class="max-w-96 flex justify-between items-end -mt-10 xs:-mt-8">
                                                        <ProfilePhotoComp :src="userProfile?.photoURL"
                                                                :alt="userProfile?.name" :isOwnAccount="isOwnAccount"
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
                                                                                :to="{ name: 'PrivateChat', params: { id: userProfile?.uid } }"
                                                                                class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">Chatear</router-link>
                                                                </template>
                                                        </div>
                                                </ContainerComp>
                                        </ContainerComp>
                                        <ContainerComp class="max-w-96 flex flex-col gap-2 justify-center items-center">
                                                <ContainerComp>
                                                        <ContainerComp class="flex flex-col items-center">
                                                                <ContainerComp tag="p" :text="`#${userProfile?.uid}`"
                                                                        class="text-gray-500 text-opacity-80 text-xs" />
                                                                <ContainerComp class="flex">
                                                                        <ContainerComp tag="h2"
                                                                                class="font-bold text-base">
                                                                                {{ userProfile?.name }} <span
                                                                                        class="font-normal text-gray-600 text-sm">@{{
                                                                                                userProfile?.username }}</span>
                                                                        </ContainerComp>
                                                                </ContainerComp>
                                                        </ContainerComp>
                                                        <ContainerComp tag="p" :text="`Mail: ${userProfile?.email}`"
                                                                class="text-gray-600" />
                                                        <ContainerComp class="flex">
                                                                <ContainerComp tag="p"
                                                                        :text="`Seguidores: ${userProfile?.followers?.length}`"
                                                                        class="text-gray-200" />
                                                                <ContainerComp tag="p"
                                                                        :text="`Siguiendo: ${userProfile?.following?.length}`"
                                                                        class="text-gray-200" />
                                                        </ContainerComp>
                                                </ContainerComp>
                                                <ContainerComp tag="p" :text="userProfile?.bio"
                                                        class="break-words whitespace-normal" />
                                                <ContainerComp tag="h3" text="Publicaciones"
                                                        class="sticky top-12 bg-black z-10 break-words whitespace-normal w-full border-b border-gray-200 py-1 max-w-96 mb-4" />
                                                <PostListComp :posts="postFromUser" />
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
                                        <img :src="tempCoverPhotoPreview || (userProfile?.coverPhotoURL || defaultCoverPhoto)"
                                                :alt="userProfile?.name || 'Foto de perfil del usuario'"
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
                                                        :disabled="!Boolean(tempCoverPhotoPreview) || tempCoverPhotoPreview === userProfile?.coverPhotoURL || tempCoverPhotoPreview === defaultCoverPhoto"
                                                        class="w-full py-2 rounded-lg text-sm  font-semibold border disabled:border-gray-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                        :class="{
                                                                'bg-violet-50 text-black hover:text-white hover:bg-black': !!tempCoverPhotoPreview && tempCoverPhotoPreview !== userProfile?.coverPhotoURL && tempCoverPhotoPreview !== defaultCoverPhoto,
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
                                        <img :src="tempProfilePhotoPreview || (userProfile?.photoURL || defaultPerfilPhoto)"
                                                :alt="userProfile?.name || 'Foto de perfil del usuario'"
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
                                                        :disabled="!Boolean(tempProfilePhotoPreview) || tempProfilePhotoPreview === userProfile?.photoURL || tempProfilePhotoPreview === defaultPerfilPhoto"
                                                        class="w-full py-2 rounded-lg text-sm  font-semibold border disabled:border-gray-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                        :class="{
                                                                'bg-violet-50 text-black hover:text-white hover:bg-black': !!tempProfilePhotoPreview && tempProfilePhotoPreview !== userProfile?.photoURL && tempProfilePhotoPreview !== defaultPerfilPhoto,
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