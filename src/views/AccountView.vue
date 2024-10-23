<script setup>
import TitleComp from '@/components/TitleComp.vue';
import ContainerComp from '@/components/ContainerComp.vue';
import ExpandableText from '@/components/ExpandableText.vue';
import useAuth from '@/composables/useAuth';
import usePosts from '@/composables/usePosts';
import useLoading from '@/composables/useLoading';

import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import AccountSkeleton from '@/components/skeletons/AccountSkeleton.vue';

const { loading, toggleLoading } = useLoading();

const perfilPhotoDefault = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC"
const router = useRouter();
const route = useRoute();
const { user, logout, initAuth, cleanupAuth, fetchUserById } = useAuth();
const { posts, fetchPostsByUserId } = usePosts();
const viewedUser = ref(null);
const isOwnAccount = ref(true);

function handlerLogoutUser() {
        logout().then(() => { router.push({ name: 'Login' }); });
}

function convertTimestampToDate(timestamp) {
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}

onMounted(async () => {
        try {
                await initAuth();
                const userId = route.params.id;
                if (userId && userId !== user.value.uid) {
                        isOwnAccount.value = false;
                        viewedUser.value = await fetchUserById(userId);
                        await fetchPostsByUserId(userId);
                } else {
                        isOwnAccount.value = true;
                        viewedUser.value = user.value;
                        await fetchPostsByUserId(user.value.uid);
                }
        } catch (error) {
                console.error(error);
        } finally {
                toggleLoading();
        }
});

onUnmounted(() => {
        cleanupAuth();
});
</script>

<template>
        <div class="grid grid-rows-[1fr] h-[calc(100vh-64px)] overflow-y-auto">
                <template v-if="!loading">
                        <ContainerComp class="flex-1 flex flex-col">
                                <ContainerComp class="flex-1 flex flex-col gap-4">
                                        <TitleComp text="Cuenta" :stickyTop="true" />
                                        <ContainerComp class="flex flex-col ">
                                                <ContainerComp tag="figure" class="max-w-96">
                                                        <img :src="viewedUser?.coverPhotoURL || 'https://placehold.co/1600x900'"
                                                                alt="User cover photo" class="w-full">
                                                </ContainerComp>
                                                <ContainerComp
                                                        class="max-w-96 flex justify-between items-end -mt-10 xs:-mt-8">
                                                        <figure class="w-20 h-20 ml-2 ">
                                                                <img :src="viewedUser?.photoURL || perfilPhotoDefault"
                                                                        alt="User cover photo"
                                                                        class="aspect-w-1 rounded-full border-4 border-black">
                                                        </figure>
                                                        <div class="flex gap-2" v-if="isOwnAccount">
                                                                <router-link to="/account/edit"
                                                                        class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">Editar
                                                                        perfil</router-link>
                                                                <button @click="handlerLogoutUser"
                                                                        class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">Cerrar
                                                                        sesión</button>
                                                        </div>
                                                        <div class="flex gap-2" v-else>
                                                                <router-link
                                                                        :to="{ name: 'PrivateChat', params: { id: viewedUser?.uid } }"
                                                                        class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">Chatear</router-link>
                                                        </div>
                                                </ContainerComp>
                                        </ContainerComp>
                                        <ContainerComp class="max-w-96 flex flex-col gap-2 justify-center items-center">
                                                <ContainerComp>
                                                        <ContainerComp class="flex flex-col items-center">
                                                                <ContainerComp tag="p" :text="`#${viewedUser?.uid}`"
                                                                        class="text-gray-500 text-opacity-80 text-xs" />
                                                                <ContainerComp class="flex">
                                                                        <ContainerComp tag="h2"
                                                                                class="font-bold text-base">
                                                                                {{ viewedUser?.name }} <span
                                                                                        class="font-normal text-gray-600 text-sm">@{{
                                                                                                viewedUser?.username }}</span>
                                                                        </ContainerComp>
                                                                </ContainerComp>
                                                        </ContainerComp>
                                                        <ContainerComp tag="p" :text="`Mail: ${viewedUser?.email}`"
                                                                class="text-gray-600" />
                                                        <ContainerComp class="flex">
                                                                <ContainerComp tag="p"
                                                                        :text="`Seguidores: ${viewedUser?.followers?.length}`"
                                                                        class="text-gray-200" />
                                                                <ContainerComp tag="p"
                                                                        :text="`Siguiendo: ${viewedUser?.following?.length}`"
                                                                        class="text-gray-200" />
                                                        </ContainerComp>
                                                </ContainerComp>
                                                <ContainerComp tag="p" :text="viewedUser?.bio"
                                                        class="break-words whitespace-normal" />
                                                <ContainerComp tag="h3" text="Publicaciones"
                                                        class="sticky top-12 bg-black z-10 break-words whitespace-normal w-full border-b border-gray-200 py-1 max-w-96 mb-4" />
                                                <ContainerComp tag="ul" v-if="posts && posts.length"
                                                        class="flex-1 flex flex-col gap-4 overflow-auto">
                                                        <ContainerComp tag="li" v-for="post in posts" :key="post.id">
                                                                <ContainerComp tag="article"
                                                                        class="bg-transparent w-full border-b border-gray-800 pb-4 max-w-96">
                                                                        <header class="flex gap-2 items-start">
                                                                                <figure class="w-10 h-10">
                                                                                        <img alt="user photo"
                                                                                                class="aspect-w-1 rounded-full"
                                                                                                :src="post?.user?.photoURL || perfilPhotoDefault">
                                                                                </figure>
                                                                                <h3 class="font-bold flex-1">{{
                                                                                        post?.user?.name }} <span
                                                                                                class="text-gray-600">@{{
                                                                                                        post?.user?.username
                                                                                                }}</span>
                                                                                </h3>
                                                                        </header>
                                                                        <section class="pl-12 -mt-5">
                                                                                <h2 v-if="post?.title"
                                                                                        class="font-bold break-words whitespace-normal">
                                                                                        {{ post.title }}</h2>
                                                                                <ExpandableText :text="post.body" />
                                                                                <ContainerComp class="flex justify-end">
                                                                                        <p
                                                                                                class="text-xs text-gray-500 -mb-3">
                                                                                                {{
                                                                                                        formatDistanceToNow(convertTimestampToDate(post.create_at),
                                                                                                                {
                                                                                                                        addSuffix: true,
                                                                                                                        locale: es
                                                                                                                }) }}
                                                                                        </p>
                                                                                </ContainerComp>
                                                                        </section>
                                                                </ContainerComp>
                                                        </ContainerComp>
                                                </ContainerComp>
                                                <ContainerComp tag="p" text="Por ahora no tienes minitweets..." v-else
                                                        class="break-words whitespace-normal text-gray-400 text-center text-opacity-50 my-24" />
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                </template>
                <template v-else>
                        <AccountSkeleton />
                </template>
        </div>
</template>
