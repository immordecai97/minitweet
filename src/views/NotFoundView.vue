<script setup>
import ContainerComp from '@/components/ContainerComp.vue';
</script>


<template>
    <ContainerComp class="flex-1 flex flex-col items-center justify-center">
        <ContainerComp tag="p" text="📟" class="text-center text-9xl mb-16" />
        <ContainerComp tag="h1" text="404" class="text-3xl font-bold text-center" />
        <ContainerComp tag="p" text="La página que buscas no existe." class="text-center" />
    </ContainerComp>
</template>