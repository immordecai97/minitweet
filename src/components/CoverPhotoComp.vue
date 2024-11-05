<script setup>
import ContainerComp from './ContainerComp.vue';

const defaultCoverPhotoURL = "https://placehold.co/1600x900";
const defaultAlt = 'Foto de portada';

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
    }
});
</script>

<template>
    <ContainerComp tag="figure" class="aspect-w-16 aspect-h-9 overflow-hidden z-index-10">
        <img v-if="isOwnAccount" :src="src || defaultCoverPhotoURL" :alt="alt || defaultAlt" class="object-contain" :class="{ 'cursor-pointer': !!onClick }" v-on="{ click: onClick }">
        <img v-else :src="src || defaultCoverPhotoURL" :alt="alt || defaultAlt" class="object-contain">
    </ContainerComp>
</template>