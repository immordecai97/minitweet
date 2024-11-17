<script setup>
import { defineProps, computed } from 'vue';
import useModal from '@/composables/useModal';

const { modal, closeModal } = useModal();

const props = defineProps({
    fn: {
        type: Function,
        required: false,
        default: null
    }
});

const handleClick = computed(() => props.fn || closeModal);
</script>

<template>
    <Teleport to="#modal" v-if="modal">
        <div @click.self="handleClick"
            class="fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex justify-center items-center z-index-1000">
            <slot></slot>
        </div>
    </Teleport>
</template>