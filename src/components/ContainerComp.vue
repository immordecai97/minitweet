<script setup>
//------------------------------------------------------------------- PROPS
defineProps({
	tag: {
		type: String,
		default: 'div'
	},
	text: {
		type: String,
		default: ''
	}
})
</script>

<template>
	<component :is="tag" class="mx-auto w-full">
		<slot>{{ text }}</slot>
	</component>
</template>