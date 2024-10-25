<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ContainerComp from '@/components/ContainerComp.vue';
import useAuth from '@composables/useAuth';
import { useRouter } from 'vue-router';

const router = useRouter();

const { user, initAuth, cleanupAuth, updateUser } = useAuth();
const userLogged = ref({
        uid: user.value.uid,
        name: user.value.name,
        email: user.value.email,
        username: user.value.username,
        bio: user.value.bio,
        photoURL: user.value.photoURL,
        coverPhotoURL: user.value.coverPhotoURL,
});

async function handlerSubmit() {
        try{
                await updateUser(userLogged.value);
                router.push({ name: 'Account' });
        } catch (error) {
                console.error(error);
        }
}

onMounted(async () => {
        await initAuth();
});

onUnmounted(() => {
        cleanupAuth();
});
</script>

<template>
        <ContainerComp class="flex-1 flex flex-col justify-center items-center">
                <ContainerComp class="flex flex-col gap-6 max-w-96">
                        <ContainerComp>
                                <ContainerComp tag="h1" text="Editar cuenta" class="text-3xl font-bold text-center" />
                                <ContainerComp :text="`#${userLogged.uid}`"
                                        class="text-xs text-center font-bold text-gray-300 text-opacity-40 mt-2" />
                        </ContainerComp>
                        <ContainerComp tag="form" @submit.prevent="handlerSubmit" class="flex-1" action="#">
                                <ContainerComp class="flex flex-col gap-4 items-center">
                                        <ContainerComp>
                                                <label for="name" class="hidden">Nombre</label>
                                                <input v-model="userLogged.name" type="text" id="name"
                                                        name="name" placeholder="Nombre"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="username" class="hidden">Username</label>
                                                <input v-model="userLogged.username" type="text" id="username"
                                                        name="username" placeholder="Username"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="email" class="hidden">Email</label>
                                                <!-- <input v-model="userLogged.email" type="email" id="email" name="email" -->
                                                <input type="email" id="email" name="email"
                                                        disabled :placeholder="`${userLogged.email} Email (proximamente)`"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input opacity-30 cursor-not-allowed"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="password" class="hidden">Password</label>
                                                <input v-model="userLogged.password" type="password" id="password"
                                                        disabled name="password" placeholder="Contraseña (proximamente)"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input opacity-30 cursor-not-allowed"
                                                        required>
                                        </ContainerComp>

                                        <!-- TODO: Agregar aquí tambien las funcion de cambio de foto de perfil -->
                                        <!-- <ContainerComp>
                                                <label for="photo" class="hidden">photo</label>
                                                <input v-model="userLogged.photoURL" type="text" id="photo" disabled
                                                        name="photo" placeholder="Foto de perfil (proximamente)"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input opacity-30 cursor-not-allowed"
                                                        required>
                                        </ContainerComp> -->

                                        <ContainerComp>
                                                <label for="bio" class="hidden">Biografía</label>
                                                <textarea v-model="userLogged.bio" type="text" id="bio" name="bio"
                                                        placeholder="Biografía"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input resize-none"
                                                        required>
                                                </textarea>
                                        </ContainerComp>

                                        <ContainerComp class="flex flex-col gap-2">
                                                <button type="submit"
                                                        class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">Guardar
                                                        cambios</button>
                                                <button type="button" @click="router.push({ name: 'Account' })"
                                                        class="transition w-full py-2 bg-black text-white rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">Cancelar</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                </ContainerComp>
        </ContainerComp>
</template>