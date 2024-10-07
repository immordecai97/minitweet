<script setup>
import { ref } from 'vue';
import { loginUser } from '@services/auth.js';
import { RouterLink, useRouter } from 'vue-router'
import ContainerComp from '@/components/ContainerComp.vue';
const router = useRouter();
const user = ref({
        email: '',
        password: ''
});

function handlerSubmit() {
        loginUser({ ...user.value }).then(() => {
                router.push({ name: 'Feed' });
                user.value = { email: '', password: '' };
        });
}
</script>

<template>
        <ContainerComp class="flex-1 flex flex-col justify-center items-center">
                <ContainerComp class="flex flex-col gap-6 max-w-96">
                        <ContainerComp tag="h1" text="Login" class="text-3xl font-bold text-center" />
                        <ContainerComp tag="form" @submit.prevent="handlerSubmit" class="flex-1" action="#">
                                <ContainerComp class="flex flex-col gap-4 items-center">
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
                                                        class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">Login</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>

                        <ContainerComp tag="p" class="text-xs text-center">
                                Si aún no tienes cuenta <RouterLink to="/signup" class="text-blue-700 hover:underline">
                                        registrate aquí</RouterLink>
                        </ContainerComp>
                </ContainerComp>
        </ContainerComp>
</template>
