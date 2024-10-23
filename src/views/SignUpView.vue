<script setup>
import ContainerComp from '@/components/ContainerComp.vue';
import { ref } from 'vue';
import useAuth from '@composables/useAuth';
import { RouterLink, useRouter } from 'vue-router';
import TitleComp from '@/components/TitleComp.vue';

const router = useRouter();
const userData = ref({
        name: '',
        username: '',
        email: '',
        password: ''
})
const { register } = useAuth();

async function handlerSubmit() {
        try {
                await register({ ...userData.value });
                router.push({ name: 'Feed' });
        } catch (error) {
                console.error(error);
        }
}
</script>

<template>
        <div class="grid place-items-center grid-rows-[1fr] h-[calc(100vh-65px)]">
                <ContainerComp class="flex flex-col gap-6 max-w-96">
                        <TitleComp text="Registrarse" />
                        <ContainerComp tag="form" @submit.prevent="handlerSubmit" class="flex-1" action="#">
                                <ContainerComp class="flex flex-col gap-4 items-center">
                                        <ContainerComp>
                                                <label for="name" class="hidden">Nombre</label>
                                                <input v-model="userData.name" type="text" id="name" name="name"
                                                        placeholder="name"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="username" class="hidden">Username</label>
                                                <input v-model="userData.username" type="text" id="username"
                                                        name="username" placeholder="Username"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="email" class="hidden">Email</label>
                                                <input v-model="userData.email" type="email" id="email" name="email"
                                                        placeholder="Email"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="password" class="hidden">Password</label>
                                                <input v-model="userData.password" type="password" id="password"
                                                        name="password" placeholder="Password"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <button type="submit"
                                                        class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">Registrarse</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>

                        <ContainerComp tag="p" class="text-xs text-center">
                                Ya tengo cuenta, <RouterLink to="/login" class="text-blue-700 hover:underline">
                                        iniciar sesión</RouterLink>
                        </ContainerComp>
                </ContainerComp>
        </div>
</template>
