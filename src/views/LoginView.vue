<script setup>
import ContainerComp from '@components/ContainerComp.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import useAuth from '@composables/useAuth';
import { RouterLink, useRouter } from 'vue-router';
import TitleComp from '@/components/TitleComp.vue';

const router = useRouter();
const user = ref({
        email: '',
        password: ''
});
const { login, initAuth, cleanupAuth } = useAuth();

onMounted(async () => {
        await initAuth();
        if (user.value) {
                router.push({ name: 'Feed' });
        }
})

onUnmounted(() => {
        cleanupAuth();
})

async function handlerSubmit() {
        try {
                const { email, password } = user.value;
                await login({ email, password });
                router.push({ name: 'Feed' });
        } catch (error) {
                console.log(error);
        }
}
</script>

<template>
        <div class="grid place-items-center grid-rows-[1fr] h-[calc(100vh-65px)]">
                <ContainerComp class="flex flex-col gap-6">
                        <TitleComp text="Login" />
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
        </div>
</template>