<script setup>
import { computed } from 'vue';

//------------------------------------------------------------------- PROPS
const props = defineProps({
	tag: {
		type: String,
		default: 'h1'
	},
	text: {
		type: String,
		default: 'Agrega el título aquí usando text="Título"'
	},
	stickyTop: {
		type: Boolean,
		default: false
	},
	icon: {
		type: Boolean,
		default: true
	}
});

//------------------------------------------------------------------- COMPUTED
const computedClasses = computed(() => {
	const classes = {
		'text-3xl font-bold': props.tag === 'h1',
		'text-2xl': props.tag === 'h2',
		'text-xl': props.tag === 'h3',
		'text-lg': props.tag === 'h4',
		'text-md': props.tag === 'h5',
		'text-base': props.tag === 'h6',
	};
	// Retornamos solo las clases que tengan valor true
	return Object.keys(classes).filter(key => classes[key]).join(' ');
});
</script>

<template>
	<div class="w-full py-1 bg-black" :class="{ 'sticky top-0 z-index-900': props.stickyTop === true }">
		<div class="container mx-auto max-w-96 grid grid-cols-10 items-center">
			<div v-if="icon" class="col-span-2 place-items-center">
				<figure class="w-16 p-1 pl-2">
					<img src="/minitweet.svg" alt="Minitweet">
				</figure>
			</div>
			<div class="col-span-1"></div>
			<div class="col-span-7" :class="{ 'text-center': !icon }">
				<component :is="tag" :class="computedClasses">
					<span>{{ text }}</span>
				</component>
			</div>
		</div>
	</div>
</template>

<style scoped>
.z-index-900 {
	z-index: 900;
}
</style>