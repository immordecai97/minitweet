<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth.js';
import useLoading from '@/composables/useLoading';
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from '@/components/ContainerComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import ProfilePhotoComp from '@/components/ProfilePhotoComp.vue';
import { getPrivateMessages, savePrivateMessage } from '@/services/privateChat.service';

// import { setViewportHeight } from '@/utils/viewportHeight';


const route = useRoute();
const { user, fetchUserById } = useAuth();
const { loading, startLoading, endLoading } = useLoading();
const userToChat = ref(null);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null); // Referencia al contenedor de mensajes
const unsubscribe = ref(null);

async function sendMessage() {
    try {
        await savePrivateMessage(user.value.uid, userToChat.value.uid, newMessage.value);
        newMessage.value = '';
        scrollToBottom();
    } catch (error) {
        console.log(error.message);
    }
}

function scrollToBottom() {
    if (messagesContainer.value) {
        // console.log('scrollTop:', messagesContainer.value.scrollTop); // -> Descripción: Representa la cantidad de píxeles que el contenido de un elemento ha sido desplazado hacia arriba. -> Uso: Se utiliza para obtener o establecer la posición de desplazamiento vertical de un elemento.
        // console.log('scrollHeight:', messagesContainer.value.scrollHeight); // -> Descripción: Representa la altura total de un elemento, incluido el contenido que no es visible debido al desbordamiento. -> Uso: Se utiliza para obtener la altura total de un elemento, incluido el contenido que no es visible debido al desbordamiento.
        // console.log('clientHeight:', messagesContainer.value.clientHeight); // -> Descripción: Representa la altura de un elemento, incluido el relleno, pero sin bordes ni barras de desplazamiento. -> Uso: Se utiliza para obtener la altura de un elemento, incluido el relleno, pero sin bordes ni barras de desplazamiento.
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight + 100;
    }
}

onMounted(async () => {
    // setViewportHeight()
    // window.addEventListener('resize', setViewportHeight)
    startLoading();
    const { id } = route.params;
    userToChat.value = await fetchUserById(id);

    unsubscribe.value = getPrivateMessages(
        user.value.uid,
        userToChat.value.uid,
        async (newMessages) => {
            messages.value = newMessages;
            endLoading();
            await nextTick(); // Espera a que el DOM se actualice
            scrollToBottom();
        }
    );
});

// Limpiar el listener cuando el componente se desmonte
onUnmounted(() => {
    if (unsubscribe.value) {
        unsubscribe.value();
    }
});
</script>

<template>
    <!-- <div class="grid grid-rows-[auto_1fr] h-[calc(100vh-104px)]"> -->
    <div class="grid grid-rows-[auto_1fr] custom-height app-wrapper">
        <!-- header -->
        <ContainerComp class="max-w-96 p-4 bg-black flex items-center gap-4 shadow">
            <ProfilePhotoComp :src="userToChat?.photoURL" :alt="userToChat?.name" width="w-12" height="h-12" />
            <h1 class="text-xl">{{ userToChat?.name }} <span class="text-xs text-gray-400">(Private Chat)</span></h1>
        </ContainerComp>
        <!-- chat -->
        <template v-if="!loading">
            <ul ref="messagesContainer" class="p-4 flex flex-col items-start gap-2 overflow-y-scroll">
                <template v-if="messages.length">
                    <li v-for="message in messages" :key="message.id"
                        class="bg-opacity-30 text-white p-3 rounded-lg max-w-xs" :class="{
                            'bg-blue-500 self-end': message.userID === user.uid,
                            'bg-gray-500': message.userID !== user.uid
                        }">
                        <p>{{ message.message }}</p>
                    </li>
                </template>
                <template v-else>
                    <li class="flex-1 w-full p-4 flex flex-col items-center justify-center">
                        <p class="text-gray-400 text-xs">No hay mensajes...</p>
                    </li>
                </template>
            </ul>
        </template>
        <template v-else>
            <div class="flex flex-col justify-center">
                <p class="text-center">Loading</p>
            </div>
        </template>
    </div>

    <!-- input -->
    <Teleport to="#barTop" v-if="!loading">
        <ContainerComp class="max-w-96 flex gap-1">
            <div className="space-y-2 w-full">
                <form @submit.prevent="sendMessage"
                    className="flex rounded-lg shadow-sm shadow-black/[.04] absolute bottom-1 w-full px-2">
                    <label for="message" class="sr-only">Mensaje</label>
                    <input id="message" v-model="newMessage"
                        class="bg-gray-600 bg-opacity-40 flex h-9 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-black/[.04] placeholder:text-muted-foreground/70 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 -me-px flex-1 rounded-e-none focus-visible:z-10"
                        placeholder="Mensaje" type="text" />
                    <button :disabled="!newMessage && !newMessage.length"
                        class="bg-gray-600 bg-opacity-40 inline-flex items-center rounded-e-lg border border-input px-3 text-sm text-foreground hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 disabled:text-gray-700 disabled:cursor-not-allowed">
                        Enviar
                    </button>
                </form>
            </div>
        </ContainerComp>
    </Teleport>
</template>

<style scoped>
.custom-height {
    height: calc((var(--vh, 1vh) * 100) - 104px);
}
</style>
