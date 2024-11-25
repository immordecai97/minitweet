<script setup>
import { onMounted, ref } from 'vue';

const showBtnInstall = ref(false);
let deferredPrompt = null;

const installApp = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                } else {
                        console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
                showBtnInstall.value = false;
        });
};

onMounted(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                showBtnInstall.value = true;
        });
});

</script>

<template>
        <button v-if="showBtnInstall" @click="installApp" id="btnInstall">
                Instalar Minitweet
        </button>
</template>