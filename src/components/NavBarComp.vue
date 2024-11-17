<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth';
//------------------------------------------------------------------- VUE COMPOSITION API
import { RouterLink } from 'vue-router';
const { user } = useAuth();
</script>

<template>
        <nav class="borderFinito bg-black w-full text-xs sm:text-sm">
                <ul class="min-h-16 flex gap-8 justify-center items-center">
                        <li>
                                <RouterLink to="/"
                                        class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                        Sobre nosotros</RouterLink>
                        </li>
                        <template v-if="user">
                                <li>
                                        <RouterLink to="/feed" title="Feed"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Feed</RouterLink>
                                </li>
                                <li>
                                        <RouterLink :to="{ name: 'Account', params: { id: user.uid } }" title="Cuenta"
                                                class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
                                                Perfil</RouterLink>
                                </li>
                                <li>
                                        <RouterLink disabled title="Chat en construcción" to="/chat"
                                                class=" text-gray-600 cursor-not-allowed">
                                                Chat</RouterLink>
                                </li>
                        </template>
                        <template v-else>
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