<script setup>

defineProps({
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
    }
})
</script>

<template>
    <component :is="tag" class="bg-black py-1 container mx-auto font-bold text-center text-4xl" :class="{
        'text-3xl': tag === 'h2',
        'text-2xl': tag === 'h3',
        'text-xl': tag === 'h4',
        'text-lg': tag === 'h5',
        'text-base': tag === 'h6',
        'sticky top-0 z-10': stickyTop === true
    }">
        {{ text }}
    </component>
</template>