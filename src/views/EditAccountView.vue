<script setup>
import { ref, onMounted } from 'vue';
import { getUserFromDB } from '@services/auth';
import { updateUser } from '@services/myAccount';
import { useRouter } from 'vue-router';
import ContainerComp from '@/components/ContainerComp.vue';

const router = useRouter();

const userLogged = ref({
        uid: "",
        displayName: "",
        username: "",
        email: "",
        photoURL: "",
        bio: ""
});

onMounted(async () => {
        try {
                const user = await getUserFromDB();
                // console.log('user', user);
                if (!user) {
                        userLogged.value = null;
                        return;
                }
                // userLogged.value = user;
                userLogged.value = {
                        uid: user.uid,
                        displayName: user.displayName,
                        username: user.username,
                        email: user.email,
                        photoURL: user.photoURL,
                        bio: user.bio,
                };
        } catch (error) {
                console.error('Error getting user account:', error);
        }
});
// const userReallyLogged = computed(() => userLogged.value);

async function handlerSubmit() {
        const isUpdated = await updateUser({ ...userLogged.value });
        // const isUpdated = await updateUser(userLogged.value);
        console.log('isUpdated:: --> ', isUpdated);

        router.push({ name: 'Account' });
}

</script>

<template>
        <ContainerComp class="flex-1 flex flex-col justify-center items-center">
                <ContainerComp class="flex flex-col gap-6 max-w-96">
                        <ContainerComp>
                                <ContainerComp tag="h1" text="Editar cuenta" class="text-3xl font-bold text-center" />
                                <ContainerComp :text="`#${userLogged.uid}`" class="text-xs text-center font-bold text-gray-300 text-opacity-40 mt-2" />
                        </ContainerComp>
                        <ContainerComp tag="form" @submit.prevent="handlerSubmit" class="flex-1" action="#">
                                <ContainerComp class="flex flex-col gap-4 items-center">
                                        <ContainerComp>
                                                <label for="name" class="hidden">Nombre</label>
                                                <input v-model="userLogged.displayName" type="text" id="name"
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
                                                <input v-model="userLogged.email" type="email" id="email" name="email" disabled
                                                        placeholder="Email"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input opacity-30 cursor-not-allowed"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="password" class="hidden">Password</label>
                                                <input v-model="userLogged.password" type="password" id="password"
                                                        disabled name="password" placeholder="Contraseña"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input opacity-30 cursor-not-allowed"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <!-- Recordar: Debería ser un input tipo file -->
                                                <label for="photo" class="hidden">photo</label>
                                                <input v-model="userLogged.photoURL" type="text" id="photo" disabled
                                                        name="photo" placeholder="Foto de perfil"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input opacity-30 cursor-not-allowed"
                                                        required>
                                        </ContainerComp>

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
                                                        class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">Guardar cambios</button>
                                                <button type="button" @click="router.push({ name: 'Account' })"
                                                        class="transition w-full py-2 bg-black text-white rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">Cancelar</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                </ContainerComp>
        </ContainerComp>

        <!-- <hr>
        <div class="max-w-2xl mx-auto p-4" v-if="userReallyLogged">
                <div>
                        <h2 class="text-2xl font-bold">Edit Account</h2>
                        <p class="text-xs font-bold text-gray-700 text-opacity-40">
                                #<span>{{ userLogged.uid }}</span>
                        </p>
                </div>
                <form class="space-y-4" @submit.prevent="handlerSubmit">
                        <div>
                                <label for="displayName" class="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" id="displayName" v-model="userLogged.displayName"
                                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                                <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                                <input type="text" id="username" v-model="userLogged.username"
                                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" v-model="userLogged.email" disabled
                                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                                <label for="photoURL" class="block text-sm font-medium text-gray-700">Photo URL</label>
                                <input type="text" id="photoURL" v-model="userLogged.photoURL" disabled
                                        placeholder="Proximamente"
                                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                                <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
                                <textarea id="bio" v-model="userLogged.bio" rows="3"
                                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"></textarea>
                        </div>
                        <div class="flex justify-end">
                                <button type="submit"
                                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Save Changes
                                </button>
                        </div>
                </form>
        </div> -->
</template>