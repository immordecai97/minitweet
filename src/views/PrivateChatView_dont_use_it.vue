<script setup>
import { nextTick, onMounted, ref } from 'vue';
import useLoading from '@/composables/useLoading';
import ContainerComp from '@/components/ContainerComp.vue';
import ProfilePhotoComp from '@/components/ProfilePhotoComp.vue';

const { loading, startLoading, endLoading } = useLoading();
const newMessage = ref('');
const messagesContainer = ref(null);

onMounted(async () => {
    try {
        startLoading();
        messagesContainer.value = document.querySelector('#messagesContainer')
        await nextTick();
        if (messagesContainer.value) {
            console.log(messagesContainer.value.scrollTop); // 0
            console.log(messagesContainer.value.scrollHeight); // 0
            // messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    } catch (error) {
        console.log(error);
    } finally {
        endLoading();
    }
});
</script>

<template>
    <div class="grid grid-rows-[auto_1fr] h-[calc(100vh-104px)]">
        <!-- header -->
        <ContainerComp class="max-w-96 p-4 bg-black flex items-center gap-4 shadow">
            <ProfilePhotoComp width="w-12" height="h-12" />
            <h1 class="text-xl">Fulanito <span class="text-xs text-gray-400">(Private Chat)</span></h1>
        </ContainerComp>










        <!-- chat -->
        <template v-if="!loading">
            <ContainerComp tag="ul" class="p-4 flex flex-col items-start gap-2 overflow-y-scroll"
                id="messagesContainer">
                <li v-for="index in Array.from({ length: 30 }, (_, i) => i)" :key="index"
                    class="bg-opacity-30 text-white p-3 rounded-lg max-w-xs" :class="{
                        'bg-blue-500 self-end': index % 2 !== 0,
                        'bg-gray-500': index % 2 === 0,
                    }">
                    <p>Mensaje {{ index }}</p>
                </li>
            </ContainerComp>
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