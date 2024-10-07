<script setup>
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
        <component :is="tag" class="container mx-auto">
                <slot>{{ text }}</slot>
        </component>
</template>