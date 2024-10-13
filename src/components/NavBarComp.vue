<script setup>

import useAuth from '@/composables/useAuth';
import { onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';

// const router = useRouter();
const { user, initAuth, cleanupAuth } = useAuth();

// function handlerLogoutUser() {
//         logout();
//         router.push({ name: 'About' });
// }

onMounted(() => {
        if (!user.value) {
                initAuth();
        }
});

onUnmounted(() => {
        cleanupAuth();
});

</script>

<template>
        <nav class="borderFinito fixed bottom-0 left-0 bg-black w-full">
                <ul class="min-h-16 flex gap-8 justify-center items-center">
                        <template v-if="user">
                                <li>
                                        <RouterLink to="/feed"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Feed</RouterLink>
                                </li>
                                <li>
                                        <RouterLink to="/account"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Cuenta</RouterLink>
                                </li>
                                <!-- <li>
                                        <button @click="handlerLogoutUser"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Cerrar sesión</button>
                                </li> -->
                        </template>
                        <template v-else>
                                <li>
                                        <RouterLink to="/"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                About</RouterLink>
                                </li>
                                <li>
                                        <RouterLink to="/login"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Iniciar sesión.</RouterLink>
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