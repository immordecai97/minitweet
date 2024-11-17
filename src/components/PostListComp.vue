<script setup>
import ContainerComp from './ContainerComp.vue';
import PostItem from './PostItemComp.vue';

defineProps({
    posts: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <ContainerComp tag="ul" v-if="posts && posts.length" class="flex-1 flex flex-col gap-4 pb-12">
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </ContainerComp>
    <ContainerComp v-else class="text-center text-gray-400 text-opacity-50 my-24">
        Aún no hay publicaciones...
    </ContainerComp>
</template>