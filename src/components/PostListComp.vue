<script setup>
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from './ContainerComp.vue';
import PostItem from './PostItemComp.vue';
//------------------------------------------------------------------- PROPS
defineProps({
	posts: {
		type: Array,
		required: true
	}
})
</script>

<template>
	<ul v-if="posts && posts.length" class="w-full flex flex-col gap-2 max-w-96 pb-[4.5rem]">
			<li v-for="post in posts" :key="post.id">
				<PostItem :post="post" />
			</li>
	</ul>
	<ContainerComp v-else class="text-center text-gray-400 text-opacity-50 my-24">
		<span>Aún no hay publicaciones...</span>
	</ContainerComp>
</template>