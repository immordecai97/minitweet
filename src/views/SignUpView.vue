<script setup>
import { ref } from 'vue';
import { createUser } from '@services/auth.js';
import ContainerComp from '@/components/ContainerComp.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref({
        displayName: '',
        username: '',
        email: '',
        password: ''
});

async function handlerSubmit() {
        try {
                await createUser({ ...user.value })
                user.value = {
                        displayName: '',
                        username: '',
                        email: '',
                        password: ''
                }
                router.push({ name: 'Feed' });
        } catch (error) {
                console.error(error);
        }
}
</script>

<template>

        <ContainerComp class="flex-1 flex flex-col justify-center items-center">
                <ContainerComp class="flex flex-col gap-6 max-w-96">
                        <ContainerComp tag="h1" text="Registrarse" class="text-3xl font-bold text-center" />
                        <ContainerComp tag="form" @submit.prevent="handlerSubmit" class="flex-1" action="#">
                                <ContainerComp class="flex flex-col gap-4 items-center">
                                        <ContainerComp>
                                                <label for="name" class="hidden">Nombre</label>
                                                <input v-model="user.displayName" type="text" id="name" name="name"
                                                        placeholder="name"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="username" class="hidden">Username</label>
                                                <input v-model="user.username" type="text" id="username" name="username"
                                                        placeholder="Username"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="email" class="hidden">Email</label>
                                                <input v-model="user.email" type="email" id="email" name="email"
                                                        placeholder="Email"
                                                        class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input"
                                                        required>
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="password" class="hidden">Password</label>
                                                <input v-model="user.password" type="password" id="password"
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
        </ContainerComp>
</template>