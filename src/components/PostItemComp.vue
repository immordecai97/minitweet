<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth';
import useModal from '@/composables/useModal';
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
const { openModal } = useModal();
//------------------------------------------------------------------- VARIABLES
const perfilPhotoDefault = '/perfilPhotoDefault.png';
const userFromPost = ref(null);
//------------------------------------------------------------------- METHODS
/**
 * Convierte un timestamp de Firestore a un objeto Date
 * @param {Object} timestamp Timestamp de Firestore
 * @returns {Date} Objeto Date
 */
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
	},
	editPost: {
		type: Boolean,
		default: false
	}
})
</script>

<template>
	<!-- <ContainerComp tag="li"> -->
	<article class="bg-zinc-950 rounded-t-lg border-b border-gray-800 pb-4 pt-2 ">
		<!-- DATOS DEL USUARIO -->
		<header class="flex gap-2 items-start pl-2">
			<figure v-if="post.userUID" class="w-10 h-10">
				<router-link :to="{ name: 'Account', params: { id: post.userUID } }">
					<img :alt="userFromPost?.name"
						:src="userFromPost?.photoURL || perfilPhotoDefault"
						class="w-10 h-10 object-cover rounded-full border-2 border-black cursor-pointer hover:border-blue-700">
				</router-link>
			</figure>

			<h2 v-if="post.userUID" class="flex-1 flex gap-1 items-center">
				<router-link :to="{ name: 'Account', params: { id: post.userUID } }"
					class="font-bold transition hover:text-blue-700">
					{{ userFromPost?.name }}
				</router-link>
				<router-link :to="{ name: 'Account', params: { id: post.userUID } }"
					class="text-sm text-gray-400 transition hover:text-blue-700">
					@{{ userFromPost?.username }}
				</router-link>
			</h2>
		</header>
		<!-- CONTENIDO DE LA PUBLICACIÓN -->
		<section class="bg-opacity-50 w-full pl-14 pr-2 -mt-5">
			<RouterLink v-if="post?.title" :to="{ name: 'Post', params: { id: post?.id } }">
				<h3 class="font-bold break-words whitespace-normal">{{ post.title }}</h3>
			</RouterLink>
			<ExpandableText :text="post.body" :linkToPost="post?.id" />
			<RouterLink v-if="post?.file" :to="{ name: 'Post', params: { id: post?.id } }">
				<div class="w-full mt-2">
					<figure class="max-w-40 rounded-lg overflow-hidden">
						<img alt="Imagen de la publicación" :src="post?.file">
					</figure>
				</div>
			</RouterLink>
		</section>
		<div v-if="editPost" class="my-2 flex justify-center items-center px-6">
			<button @click="openModal"
				type="button" 
				class="transition w-60 xs:w-full py-1 bg-white text-sm text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent">
				Editar
			</button>
		</div>
		<ContainerComp class="flex justify-end pr-4">
			<p v-if="post?.createdAt" class="text-xs text-gray-500 -mb-3">
				{{ formatDistanceToNow(convertTimestampToDate(post.createdAt), { addSuffix: true, locale: es }) }}
			</p>
		</ContainerComp>
	</article>
</template>

<style scoped>
.max-with{
	max-width: calc(100dvw - 80px);
}
</style>