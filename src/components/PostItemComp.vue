<script setup>
import ExpandableText from '@components/ExpandableText.vue';
import ContainerComp from './ContainerComp.vue';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import perfilPhotoDefault from '/perfilPhotoDefault.png';

function convertTimestampToDate(timestamp) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}

defineProps({
    posts: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <ContainerComp tag="li" v-for="post in posts" :key="post.id">
        <ContainerComp tag="article" class="bg-transparent w-full border-b border-gray-800 pb-4 max-w-96">
            <header class="flex gap-2 items-start">

                <figure class="w-10 h-10">
                    <router-link :to="{ name: 'Account', params: { id: post.user.uid } }">
                        <img alt="user photo"
                            class="w-10 h-10 object-cover rounded-full border-2 border-black cursor-pointer hover:border-blue-700"
                            :src="post?.user?.photoURL || perfilPhotoDefault">
                    </router-link>
                </figure>

                <h2 class="font-bold flex-1">
                    <router-link :to="{ name: 'Account', params: { id: post.user.uid } }"
                        class=" transition hover:text-blue-700">
                        {{ post?.user?.name }}
                    </router-link>
                    <span class="text-gray-600 ">
                        @<router-link :to="{ name: 'Account', params: { id: post.user.uid } }"
                            class="transition hover:text-blue-700">
                            {{ post?.user?.username }}
                        </router-link>
                    </span>
                </h2>
            </header>
            <section class="pl-12 -mt-5">
                <h3 v-if="post?.title" class="font-bold break-words whitespace-normal">{{ post.title }}</h3>
                <ExpandableText :text="post.body" />
                <ContainerComp class="flex justify-end">
                    <!-- TODO: modificar propiedad "create_at" a "created_at" para que así esté correcto  -->
                    <p v-if="post?.create_at" class="text-xs text-gray-500 -mb-3">
                        {{ formatDistanceToNow(convertTimestampToDate(post.create_at), {
                            addSuffix: true,
                            locale: es
                        }) }}
                    </p>
                </ContainerComp>
            </section>
        </ContainerComp>
    </ContainerComp>
</template>