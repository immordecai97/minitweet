<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth';
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from './ContainerComp.vue';
import ExpandableText from './ExpandableText.vue';
//------------------------------------------------------------------- HELPERS
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
//------------------------------------------------------------------- VUE COMPOSITION API
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';
//------------------------------------------------------------------- USE COMPOSABLES
const { getUserById } = useAuth();

//------------------------------------------------------------------- DATA
const perfilPhotoDefault = '/perfilPhotoDefault.png';
const userFromPost = ref(null);
//------------------------------------------------------------------- METHODS
function convertTimestampToDate(timestamp) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}

//------------------------------------------------------------------- LIFECYCLE
onMounted(async () => {
    try {
        if (props.post.userUID) userFromPost.value = await getUserById(props.post.userUID);
    } catch (error) {
        console.error(error);

    }
});
//------------------------------------------------------------------- PROPS
const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <ContainerComp tag="li">
        <ContainerComp tag="article" class="bg-transparent w-full rounded-t-lg bg-zinc-950 border-b border-gray-800 pb-4 max-w-96">
            <header class="flex gap-2 items-start">
                <figure class="w-10 h-10" v-if="post.userUID">
                    <router-link :to="{ name: 'Account', params: { id: post.userUID } }">
                        <img :alt="userFromPost?.name"
                            class="w-10 h-10 object-cover rounded-full border-2 border-black cursor-pointer hover:border-blue-700"
                            :src="userFromPost?.photoURL || perfilPhotoDefault">
                    </router-link>
                </figure>

                <h2 class="font-bold flex-1 flex gap-1 items-center" v-if="post.userUID">
                    <router-link :to="{ name: 'Account', params: { id: post.userUID } }"
                        class=" transition hover:text-blue-700">
                        {{ userFromPost?.name }}
                    </router-link>
                    <router-link :to="{ name: 'Account', params: { id: post.userUID } }"
                        class="text-sm text-gray-600 transition hover:text-blue-700">@{{ userFromPost?.username }}
                    </router-link>
                </h2>
            </header>
            <RouterLink :to="{ name: 'Post', params: { id: post?.id } }">
                <section class="pl-12 -mt-5">
                    <h3 v-if="post?.title" class="font-bold break-words whitespace-normal">{{ post.title }}</h3>
                    <ExpandableText :text="post.body" />
                    <div>
                        <figure class="w-40 h-40 rounded-lg overflow-hidden" v-if="post?.file">
                            <img alt="Imagen de la publicación"
                                class="object-cover"
                                :src="post?.file">
                        </figure>
                    </div>
                    <ContainerComp class="flex justify-end">
                        <p v-if="post?.createdAt" class="text-xs text-gray-500 -mb-3">
                            {{ formatDistanceToNow(convertTimestampToDate(post.createdAt), {
                                addSuffix: true,
                                locale: es
                            }) }}
                        </p>
                    </ContainerComp>
                </section>
            </RouterLink>
        </ContainerComp>
    </ContainerComp>
</template>