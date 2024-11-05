<script setup>

// faltaaaaa
</script>



<template>
    <div @click.self="toggleModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex justify-center items-center z-50">
                        <ContainerComp class="max-w-96 px-2">
                                <!-- Foto preview -->
                                <ContainerComp tag="figure" class="aspect-w-1 aspect-h-1">
                                        <img :src="tempPreview || (viewedUser?.photoURL || defaultPerfilPhoto)"
                                                :alt="viewedUser?.name || 'User photo'"
                                                class="w-full h-full object-cover">
                                </ContainerComp>
                                <!-- Input -->
                                <ContainerComp tag="form" class="mt-2 flex flex-col gap-2">
                                        <label for="photo-upload" class="block text-sm font-medium text-gray-300 text-center">Subir nueva foto</label>
                                        <input id="photo-upload" type="file" accept="image/*"
                                                class="w-full file:w-full file:transition-all file:cursor-pointer file:mr-4 file:py-2 file:rounded-lg file:border file:border-white file:text-sm file:font-semibold file:bg-violet-50 file:text-black hover:file:bg-black hover:file:text-white"
                                                @change="handlePhotoUpload">
                                        <ContainerComp class="flex flex-col gap-2">
                                                <button type="button" @click="savePhoto"
                                                        :disabled="!Boolean(tempPreview) || tempPreview === viewedUser?.photoURL || tempPreview === defaultPerfilPhoto"
                                                        class="w-full py-2 rounded-lg text-sm  font-semibold border disabled:border-gray-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                        :class="{
                                                                'bg-violet-50 text-black hover:text-white hover:bg-black': !!tempPreview && tempPreview !== viewedUser?.photoURL && tempPreview !== defaultPerfilPhoto,
                                                        }">
                                                        Guardar
                                                </button>
                                                <button type="button" @click="cancelPhotoUpload" class="w-full py-2 rounded-lg border border-white text-sm font-semibold bg-violet-50 text-black hover:bg-black hover:text-white">Cancelar</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                </div>
</template>