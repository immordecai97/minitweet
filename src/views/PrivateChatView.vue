<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth.js';
import useLoading from '@/composables/useLoading';
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from '@/components/ContainerComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ProfilePhotoComp from '@/components/ProfilePhotoComp.vue';
import { getPrivateMessages, savePrivateMessage } from '@/services/privateChat.service';

const route = useRoute();
const { user, fetchUserById } = useAuth();
const { loading, startLoading, endLoading } = useLoading();
const userToChat = ref(null);
const messages = ref([]);
// const sendingMessage = ref(false);
const newMessage = ref('');

async function sendMessage() {
    try {
        await savePrivateMessage(user.value.uid, userToChat.value.uid, newMessage.value);
        newMessage.value = '';
    } catch (error) {
        console.log(error.message);
    }

    // console.log('enviando mensajito')
    // try {
    //     sendingMessage.value = true;
    //     // Send message
    // } catch (error) {
    //     console.log(error);
    // } finally {
    //     sendingMessage.value = false;
    // }
}

onMounted(async () => {
    try {
        startLoading();
        const { id } = route.params;
        userToChat.value = await fetchUserById(id);
        console.log(userToChat.value);
        await getPrivateMessages(user.value.uid, userToChat.value.uid, (newMessages) => {
            messages.value = newMessages;
        })
    } catch (error) {
        console.log(error);
    } finally {
        endLoading();
    }
});
</script>

<template>
    <div class="grid grid-rows-[auto_1fr_auto] h-[calc(100vh-66px)]">
    <!-- <div class="grid grid-rows-[auto_1fr_auto] h-[calc(100vh-74px)]"> -->
        <!-- header -->
        <ContainerComp class="max-w-96 p-4 bg-black flex items-center gap-4 shadow">
            <!-- Imagen -->
            <!-- <div class="w-10 h-10 rounded-full bg-gray-300"></div> -->
            <ProfilePhotoComp :src="userToChat?.photoURL" :alt="userToChat?.name" width="w-12" height="h-12" />
            <!-- Nombre del usuario -->
            <h1 class="text-xl">{{ userToChat?.name }} <span class="text-xs text-gray-400">(Private Chat)</span></h1>
        </ContainerComp>
        <!-- chat -->
        <template v-if="!loading">
            <ContainerComp v-if="messages.length" tag="ul" class="p-4 flex flex-col items-start gap-2 overflow-y-auto">
                <li v-for="message in messages" :key="message.id"
                    class="bg-opacity-30 text-white p-3 rounded-lg max-w-xs" :class="{
                        'bg-blue-500 self-end': message.userID === user.uid,
                        'bg-gray-500': message.userID !== user.uid
                    }">
                    {{ console.log(message) }}
                    <p>
                        {{ message.message }}
                    </p>
                </li>
            </ContainerComp>
            <ContainerComp v-else class="p-4 flex flex-col items-center justify-center">
                <p class="text-gray-400 text-xs">No hay mensajes...</p>
            </ContainerComp>

            <!-- <ContainerComp class="bg-black p-4 flex flex-col gap-2 overflow-y-auto">
                
                <div class="flex items-start justify-end">
                    <div class="bg-gray-500 bg-opacity-30 p-3 rounded-lg max-w-xs">
                        <p>I'm good, thanks! How about you?</p>
                    </div>
                </div>
            </ContainerComp> -->
        </template>
        <template v-else>
            <div class="flex flex-col justify-center">
                <p class="text-center">Loading</p>
            </div>
        </template>
        <!-- input -->
        <ContainerComp class="max-w-96 flex gap-1">
            <div className="space-y-2 w-full">
                <form @submit.prevent="sendMessage" className="flex rounded-lg shadow-sm shadow-black/[.04]">
                    <label for="message" class="sr-only">Mensaje</label>
                    <input id="message" v-model="newMessage"
                        class="bg-gray-600 bg-opacity-40 flex h-9 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-black/[.04] placeholder:text-muted-foreground/70 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 -me-px flex-1 rounded-e-none focus-visible:z-10"
                        placeholder="Mensaje" type="text" />
                    <button
                        class="bg-gray-600 bg-opacity-40 inline-flex items-center rounded-e-lg border border-input px-3 text-sm text-foreground hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1">
                        Enviar
                    </button>
                </form>
            </div>
        </ContainerComp>
    </div>
</template>