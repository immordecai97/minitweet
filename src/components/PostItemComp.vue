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
        if(props.post.userUID) userFromPost.value = await getUserById(props.post.userUID);
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
        <ContainerComp tag="article" class="bg-transparent w-full border-b border-gray-800 pb-4 max-w-96">
            <header class="flex gap-2 items-start">
                <figure class="w-10 h-10" v-if="post.userUID">
                    <router-link :to="{ name: 'Account', params: { id: post.userUID } }">
                    <img alt="user photo"
                        class="w-10 h-10 object-cover rounded-full border-2 border-black cursor-pointer hover:border-blue-700"
                        :src="userFromPost?.photoURL || perfilPhotoDefault">
                    </router-link>
                </figure>

                <h2 class="font-bold flex-1" v-if="post.userUID">
                    <router-link :to="{ name: 'Account', params: { id: post.userUID } }"
                        class=" transition hover:text-blue-700">
                        {{ userFromPost?.name }}
                    </router-link>
                    <span class="text-gray-600 ">
                        @<router-link :to="{ name: 'Account', params: { id: post.userUID } }"
                            class="transition hover:text-blue-700">
                            {{ userFromPost?.username }}
                        </router-link>
                    </span>
                </h2>
            </header>
            <RouterLink :to="{ name: 'Post', params: { id: post?.id } }">
                <section class="pl-12 -mt-5">
                    <h3 v-if="post?.title" class="font-bold break-words whitespace-normal">{{ post.title }}</h3>
                    <ExpandableText :text="post.body" />
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