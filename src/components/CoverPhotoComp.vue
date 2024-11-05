<script setup>
import ContainerComp from './ContainerComp.vue';

const defaultCoverPhotoURL = "https://placehold.co/1600x900";
const defaultAlt = 'Foto de portada';

defineProps({
    isOwnAccount:{
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
    <ContainerComp tag="figure" class="max-w-96 cursor-pointer aspect-w-16 aspect-h-9" v-if="isOwnAccount">
        <img :src="src || defaultCoverPhotoURL" :alt="alt || defaultAlt" class="object-contain" v-on="{click: onClick}">
    </ContainerComp>
    <ContainerComp tag="figure" class="max-w-96" v-else>
        <img :src="src || defaultCoverPhotoURL" :alt="alt || defaultAlt" class="w-full">
    </ContainerComp>
</template>