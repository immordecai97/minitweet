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
    <figure class="w-20 h-20 ml-2">
        <!-- Cuando aplicas la doble negación (!!) a una función, primero se convierte en false y luego de nuevo en true, lo que confirma que la función es un valor "truthy" o viceversa ("falsy"). -->
        <img :src="src || '/perfilPhotoDefault.png'" :alt="alt || defaultAlt" v-if="isOwnAccount"
            class="w-20 h-20 object-cover rounded-full border-4 border-black" :class="{ 'cursor-pointer': !!onClick }"
            v-on="{ click: onClick }">
        <img :src="src || '/perfilPhotoDefault.png'" :alt="alt || defaultAlt" v-else
            class="w-20 h-20 object-cover rounded-full border-4 border-black">
    </figure>
</template>