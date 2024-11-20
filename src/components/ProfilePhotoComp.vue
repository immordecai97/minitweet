<script setup>
//------------------------------------------------------------------- VUE COMPOSITION API
import { defineProps } from 'vue';
//------------------------------------------------------------------- VARIABLES
const defaultAlt = 'Foto de perfil del usuario';
//------------------------------------------------------------------- PROPS
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
		<img v-if="isOwnAccount" 
			:src="src || '/perfilPhotoDefault.png'" 
			:alt="alt || defaultAlt"
			v-on="{ click: onClick }"
			class="object-cover w-full h-full" :class="{ 'cursor-pointer': !!onClick }">
		<img v-else 
			:src="src || '/perfilPhotoDefault.png'" 
			:alt="alt || defaultAlt"
			class="object-cover w-full h-full">
	</figure>
</template>