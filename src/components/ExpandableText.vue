<script setup>
import { ref } from 'vue';

defineProps({
    text: {
        type: String,
        required: true
    },
    maxLength: {
        type: Number,
        default: 150
    }
});

const expanded = ref(false);

function toggleExpand() {
    expanded.value = !expanded.value;
}
</script>

<template>
    <div>
        <p :class="{ 'line-clamp-4': !expanded }" class="break-words whitespace-normal">
            {{ text }}
        </p>
        <button v-if="text.length > maxLength" type="button" @click="toggleExpand" class="text-blue-500 hover:underline">
            {{ expanded ? 'Ver menos' : 'Ver más' }}
        </button>
    </div>
</template>

<style scoped>
.line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>