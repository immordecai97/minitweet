<script setup>
import { defineProps } from 'vue';
const defaultAlt = 'Foto de perfil del usuario';

defineProps({
    isOwnAccount: {
        type: Boolean,
        require: false,
        default: false
    },
    src: String,
    alt: String,
    onClick:{
        type: Function,
        require: false,
        default: null
    }
});
</script>

<template>
    <figure class="w-20 h-20 ml-2 rounded-full border-4 border-black overflow-hidden z-index-20">
        <img v-if="isOwnAccount" :src="src || '/perfilPhotoDefault.png'" :alt="alt || defaultAlt" 
            class="object-cover w-full h-full" :class="{ 'cursor-pointer': !!onClick }"
            v-on="{ click: onClick }">
        <img v-else :src="src || '/perfilPhotoDefault.png'" :alt="alt || defaultAlt"
            class="object-cover w-full h-full">
    </figure>
</template>