<script setup>
import { RouterLink } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { auth } from '@services/firebase.js';
import { logoutUser } from '@services/auth.js';
import { useRouter } from 'vue-router';
const router = useRouter();

const userLogged = ref({
        id: null,
        email: null
});

onMounted(async() => {
        // try {
        //         const user = await getUserFromDB();
        //         console.log(user);
        //         // userLogged.value = {
        //         //         id: user.uid,
        //         //         email: user.email
        //         // }
        // } catch (error) {
        //         console.error(error);
        // }



        onAuthStateChanged(auth, (user) => {
                // user.getIdToken().then((token) => console.log(token))
                if (user) {
                        userLogged.value = {
                                id: user.uid,
                                email: user.email
                        }
                } else {
                        userLogged.value = {
                                id: null,
                                email: null
                        }
                }
        });
});

function handlerLogoutUser() {
        logoutUser().then(() => {
                router.push({ name: 'Login' });
        });
}
</script>

<template>
        <nav class="borderFinito fixed bottom-0 left-0 bg-black w-full">
                <ul class="min-h-16 flex gap-8 justify-center items-center">
                        <template v-if="userLogged.id !== null">
                                <li>
                                        <RouterLink to="/"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Feed</RouterLink>
                                </li>
                                <li>
                                        <RouterLink to="/account"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Cuenta</RouterLink>
                                </li>
                                <li>
                                        <button @click="handlerLogoutUser"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Cerrar sesión</button>
                                </li>
                        </template>
                        <template v-else>
                                <li>
                                        <RouterLink to="/about"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                About</RouterLink>
                                </li>
                                <li>
                                        <RouterLink to="/login"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Iniciar sesión</RouterLink>
                                </li>
                        </template>
                </ul>
        </nav>
</template>

<style scoped>
.borderFinito {
        border-top-width: 0.2px;
        border-image: linear-gradient(to right, transparent, rgb(255, 255, 255), transparent);
        border-image-slice: 1;
}
</style>