<script setup>
import ContainerComp from '@/components/ContainerComp.vue';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import useAuth from '@composables/useAuth';
import TitleComp from '@/components/TitleComp.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
import useLoading from '@/composables/useLoading';

const router = useRouter();
const { registerUser } = useAuth();
const { loading, startLoading, endLoading } = useLoading();

const userData = ref({
        name: '',
        username: '',
        email: '',
        password: ''
})

async function handlerSubmit() {
        try {
                startLoading();
                await registerUser({ ...userData.value });
                router.push({ name: 'Feed' });
        } catch (error) {
                console.error(error);
        } finally {
                endLoading();
        }
}
</script>

<template>
        <div class="grid place-items-center grid-rows-[1fr] h-[calc(100vh-65px)]">
                <template v-if="!loading">
                        <ContainerComp class="flex flex-col gap-6 max-w-96">
                        <TitleComp text="Registrarse" />
                        <ContainerComp tag="form" @submit.prevent="handlerSubmit" class="flex-1" action="#">
                                <ContainerComp class="flex flex-col gap-4 items-center">
                                        <ContainerComp>
                                                <label for="name" class="sr-only">Nombre</label>
                                                <input v-model="userData.name" type="text" id="name" name="name"
                                                        placeholder="Nombre"
                                                        class="custom-input "
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="username" class="sr-only">Username</label>
                                                <input v-model="userData.username" type="text" id="username"
                                                        name="username" placeholder="Nombre de usuario"
                                                        class="custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="email" class="sr-only">Email</label>
                                                <input v-model="userData.email" type="email" id="email" name="email"
                                                        placeholder="Correo electrónico"
                                                        class="custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="password" class="sr-only">Password</label>
                                                <input v-model="userData.password" type="password" id="password"
                                                        name="password" placeholder="Contraseña"
                                                        class="custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <button type="submit"
                                                        class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">Registrarse</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>

                        <ContainerComp tag="p" class="text-xs text-center">Ya tengo cuenta, <RouterLink to="/login" class="text-blue-700 hover:underline">iniciar sesión</RouterLink>
                        </ContainerComp>
                </ContainerComp>
                </template>
                <template v-else>
                        <LoaderComp />
                </template>
        </div>
</template>
