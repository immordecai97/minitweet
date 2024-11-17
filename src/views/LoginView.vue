<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@composables/useAuth';
import useLoading from '@/composables/useLoading';
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from '@components/ContainerComp.vue';
import TitleComp from '@/components/TitleComp.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const { loading, startLoading, endLoading } = useLoading();
const router = useRouter();
const userToLog = ref({
        email: '',
        password: ''
});
const { login } = useAuth();

async function handlerSubmit() {
        try {
                startLoading();
                const { email, password } = userToLog.value;
                await login({ email, password });
                router.push({ name: 'Feed' });
        } catch (error) {
                console.log(error);
        } finally {
                endLoading();
        }
}
</script>

<template>
        <div class="grid place-items-center grid-rows-[1fr] h-[calc(100vh-65px)]">
                <template v-if="!loading">
                        <ContainerComp class="flex flex-col gap-6">
                                <TitleComp text="Login" />
                                <ContainerComp tag="form" @submit.prevent="handlerSubmit" class="flex-1" action="#">
                                        <ContainerComp class="flex flex-col gap-4 items-center">
                                                <ContainerComp>
                                                        <label for="email" class="sr-only">Email</label>
                                                        <input v-model="userToLog.email" type="email" id="email"
                                                                name="email" placeholder="Correo electrónico"
                                                                class="custom-input"
                                                                required>
                                                </ContainerComp>

                                                <ContainerComp>
                                                        <label for="password" class="sr-only">Password</label>
                                                        <input v-model="userToLog.password" type="password"
                                                                id="password" name="password" placeholder="Contraseña"
                                                                class="custom-input"
                                                                required>
                                                </ContainerComp>

                                                <ContainerComp>
                                                        <button type="submit"
                                                                class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">Iniciar sesión</button>
                                                </ContainerComp>
                                        </ContainerComp>
                                </ContainerComp>

                                <ContainerComp tag="p" class="text-xs text-center">
                                        Si aún no tienes cuenta <RouterLink to="/signup"
                                                class="text-blue-700 hover:underline">
                                                registrate aquí</RouterLink>
                                </ContainerComp>
                        </ContainerComp>
                </template>

                <template v-else>
                        <LoaderComp />
                </template>
        </div>
</template>