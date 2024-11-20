<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useModal from '@/composables/useModal';
//------------------------------------------------------------------- VUE COMPOSITION API
import { defineProps, computed } from 'vue';
//------------------------------------------------------------------- USE COMPOSABLES
const { modal, closeModal } = useModal();
//------------------------------------------------------------------- PROPS
const props = defineProps({
	fn: {
		type: Function,
		required: false,
		default: null
	}
});
//------------------------------------------------------------------- COMPUTED
const handleClick = computed(() => props.fn || closeModal);
</script>

<template>
	<Teleport v-if="modal" to="#modal" >
		<div 	@click.self="handleClick"
			class="fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex justify-center items-center z-index-1000">
			<slot></slot>
		</div>
	</Teleport>
</template>