<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth';
import useModal from '@/composables/useModal';
import usePosts from '@composables/usePosts.js';
import useLoading from '@/composables/useLoading';
import useComments from '@/composables/useComments';
//------------------------------------------------------------------- COMPONENTS
import TitleComp from '@/components/TitleComp.vue';
import ModalComp from '@/components/ModalComp.vue';
import ContainerComp from '@/components/ContainerComp.vue';
import ExpandableText from '@/components/ExpandableText.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { es } from 'date-fns/locale';
import { useRoute } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import PostItemComp from '@/components/PostItemComp.vue';
//------------------------------------------------------------------- USE COMPOSABLES
const route = useRoute();
const { user, getUserById } = useAuth();
const { getPostByID, updatePost } = usePosts();
const { modal, closeModal } = useModal(); // TODO: ESTA MODAL ES PARA EDITAR EL POST
const { loading, startLoading, endLoading } = useLoading();
const { comments, getCommentsByPostID, saveComment } = useComments();
//------------------------------------------------------------------- VARIABLES
const post = ref(null);
const unsubscribeToPost = ref(null);
const unsubscribeTocomment = ref(null);
const ProfilePhotoDefault = '/perfilPhotoDefault.png';
const newComment = ref({
	postID: route.params.id,
	userUID: user.value.uid,
	comment: ''
});
const updatePostData = ref({
	title: '',
	body: ''
});
//------------------------------------------------------------------- METHODS
/**
 * Guarda un comentario en la base de datos
 */
async function handlerSubmitComment() {
	try {
		await saveComment({ ...newComment.value });
		newComment.value.comment = '';
	} catch (error) {
		console.error(error);
	}
}

/**
 * Función para convertir un timestamp a una fecha
 * @param {Object} timestamp
 */
function convertTimestampToDate(timestamp) {
	return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}

/**
 * Actualiza un post en la base de datos
 */
async function handlerSubmitEdit() {
	unsubscribeTocomment.value = await updatePost(post.value.id, { ...updatePostData.value }, (postUpdated) => {
		post.value = postUpdated;
	});
	closeModal();
}

/**
 * Cancela la edición de un post
 */
function cancelEdit() {
	updatePostData.value = {
		title: post.value?.title,
		body: post.value?.body
	}
	closeModal();
}
//------------------------------------------------------------------- LIFECYCLE
onMounted(async () => {
	try {
		startLoading();
		await Promise.all([
			(async () => {
				unsubscribeToPost.value = await getPostByID(route.params.id, async (postFromDB) => {
					post.value = postFromDB;
					if (post.value.userUID === user.value.uid) {
						updatePostData.value = {
							title: post.value?.title,
							body: post.value?.body
						};
					}
				});
			})(),
			(async () => {
				unsubscribeTocomment.value = await getCommentsByPostID(route.params.id, async (commentsFromDB) => {
					const commentsWithUser = await Promise.all(commentsFromDB.map(async (comment) => {
						const userFromComment = await getUserById(comment.userUID);
						return { ...comment, user: userFromComment };
					}));
					comments.value = commentsWithUser;
				});
			})()
		]);
	} catch (error) {
		console.error(error);
	} finally {
		endLoading();
	}
});

onBeforeUnmount(() => {
	if (unsubscribeTocomment.value) {
		unsubscribeTocomment.value();
	}
	if (unsubscribeToPost.value) {
		unsubscribeToPost.value();
	}
});
</script>

<template>
	<div class="grid grid-rows-[1fr] h-[calc(100vh-104px)] w-full max-w-96">
		<template v-if="!loading">
			<ContainerComp v-if="post" class="flex flex-col overflow-y-scroll">
				<!-- TÍTULO -->
				<TitleComp text="Post" :stickyTop="true" />
				<!-- POST|PUBLICAIÓN -->
				<PostItemComp :post="post" class="sticky top-14" :editPost="post.userUID === user.uid" />
				<!-- COMENTARIOS -->
				<div v-if="comments.length" class="w-full max-w-96 flex">
					<ContainerComp tag="ul" class="pb-1 flex flex-col">
						<!-- COMENTARIO -->
						<li v-for="comment in comments" :key="comment.id" class="border-b border-gray-800 pb-2 mt-2 bg-gray-900 bg-opacity-35 rounded-lg pl-4 py-2 min-h-[57px] w-full">
							<!-- USUARIO -->
							<div class="flex gap-2 items-start">
								<figure class="min-w-10 max-w-10 min-h-10 rounded-full overflow-hidden">
									<RouterLink :to="{ name: 'Account', params: { id: comment.user.uid } }">
										<img :src="comment.user.photoURL || ProfilePhotoDefault"
											:alt="comment.user.name"
											class="object-cover rounded-full border-2 border-black cursor-pointer transition hover:border-blue-700">
									</RouterLink>
								</figure>
								<h2 class="flex-1 break-words whitespace-normal flex gap-1 items-center min-h-6">
									<RouterLink :to="{ name: 'Account', params: { id: comment.user.uid } }" class="transition hover:text-blue-700">
										{{ comment.user.name }}
									</RouterLink>
									<RouterLink :to="{ name: 'Account', params: { id: comment.user.uid } }" class="text-gray-400 text-xs transition hover:text-blue-700">
										@{{ comment.user.username }}
									</RouterLink>
								</h2>
							</div>
							<!-- COMENTARIO -->
							<div class="ml-12 -mt-4 flex flex-col">
									<ExpandableText :text="comment.comment" class="text-xs" />
								<p v-if="comment?.createdAt" class="mt-2 mr-2 text-xs text-gray-500 self-end">
									{{ formatDistanceToNow(convertTimestampToDate(comment.createdAt), { addSuffix: true, locale: es }) }}
								</p>
							</div>
						</li>
					</ContainerComp>
				</div>
				<div v-else class="flex flex-col justify-center items-center">
					<p class="mt-4 text-gray-400 text-sm">Aún no hay comentarios...</p>
				</div>
			</ContainerComp>
		</template>
		<template v-else>
			<ContainerComp class="flex flex-col">
				<div class="flex-1 flex justify-center items-center">
					<LoaderComp />
				</div>
			</ContainerComp>
		</template>
	</div>

	<Teleport to="#barTop">
		<form @submit.prevent="handlerSubmitComment" class="flex rounded-lg shadow-sm shadow-black/[.04] absolute bottom-1 w-full px-2">
			<label for="comment" class="sr-only">Comentar</label>
			<input v-model="newComment.comment" 
				type="text" 
				id="comment" 
				placeholder="Comentar"
				class="text-slate-200 bg-gray-600 bg-opacity-40 flex h-9 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-black/[.04] placeholder:text-muted-foreground/70 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 -me-px flex-1 rounded-e-none focus-visible:z-10" />
			<button :disabled="newComment.comment.length === 0" class="text-slate-200 bg-gray-600 bg-opacity-40 inline-flex items-center rounded-e-lg border border-input px-3 text-sm text-foreground hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 disabled:text-gray-700 disabled:cursor-not-allowed">
				Enviar
			</button>
		</form>
	</Teleport>

	<ModalComp v-if="modal" :fn="cancelEdit">
		<ContainerComp @submit.prevent="handlerSubmitEdit" tag="form" class="flex-1 bg-black rounded-lg p-4 max-w-md">
			<ContainerComp class="flex flex-col gap-4 items-center">
				<ContainerComp>
					<label for="title" class="sr-only">Título</label>
					<input v-model="updatePostData.title" 
						type="title" 
						id="title" 
						name="title"
						placeholder="Título" 
						class="custom-input">
				</ContainerComp>

				<ContainerComp>
					<label for="body" class="sr-only">Tweet</label>
					<input v-model="updatePostData.body" 
						type="body" 
						id="body" 
						name="body"
						placeholder="Escribe tu Tweet" 
						required
						class="custom-input">
				</ContainerComp>

				<ContainerComp>
					<button type="submit" 
						:disabled="!updatePostData.title && !updatePostData.body"
						class="transition w-full py-2 bg-white text-black rounded-lg border border-transparent hover:border-white hover:text-white hover:bg-transparent disabled:cursor-not-allowed disabled:bg-gray-900 disabled:hover:border-transparent disabled:text-gray-600 disabled:hover:bg-none">
						Actualizar publicación
					</button>
				</ContainerComp>
				<ContainerComp>
					<button @click="cancelEdit" type="button" class="transition w-full py-2 bg-black text-white rounded-lg border border-white hover:border-transparent hover:text-black hover:bg-white">
						Cancelar
					</button>
				</ContainerComp>
			</ContainerComp>
		</ContainerComp>
	</ModalComp>
</template>