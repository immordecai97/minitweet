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
    onClick: {
        type: Function,
        require: false,
        default: null
    },
    width: {
        type: String,
        default: 'w-20'
    },
    height: {
        type: String,
        default: 'h-20'
    }
});
</script>

<template>
    <figure :class="[width, height, 'ml-2 rounded-full border-4 border-black overflow-hidden z-index-20']">
        <img v-if="isOwnAccount" :src="src || '/perfilPhotoDefault.png'" :alt="alt || defaultAlt" 
            class="object-cover w-full h-full" :class="{ 'cursor-pointer': !!onClick }"
            v-on="{ click: onClick }">
        <img v-else :src="src || '/perfilPhotoDefault.png'" :alt="alt || defaultAlt"
            class="object-cover w-full h-full">
    </figure>
</template>