<script setup>
import ContainerComp from '../ContainerComp.vue';
import PostSkeleton from './PostSkeleton.vue';
</script>

<template>
    <!-- <div class="h-8 bg-slate-700 rounded my-4"></div> -->
    <ContainerComp class="flex-1 flex flex-col animate-pulse">
        <ContainerComp class="flex-1 flex flex-col gap-4">
            <!-- Título -->
            <div class="h-8 bg-slate-700 rounded mt-4"></div>
            <ContainerComp class="flex flex-col ">
                <!-- Cover foto -->
                <div class="h-0 pb-[56.25%] bg-slate-700 rounded my-4"></div>
                <div class="flex justify-between items-end -mt-10 xs:-mt-12">
                    <!-- Foto de perfil -->
                    <div class="rounded-full bg-slate-700 h-20 w-20 ml-4 border-4 border-black"></div>
                    <!-- Btns -->
                    <div class="flex gap-2">
                        <div class="rounded-full bg-slate-700 h-10 w-20"></div>
                        <div class="rounded-full bg-slate-700 h-10 w-20"></div>
                    </div>
                </div>
            </ContainerComp>
            <ContainerComp class="max-w-96 flex flex-col gap-2 justify-center items-center">
                <ContainerComp>
                    <ContainerComp class="flex flex-col gap-2">
                        <div class="h-2 bg-slate-700 rounded w-20"></div>
                        <ContainerComp class="flex gap-2">
                            <div class="h-4 bg-slate-700 rounded w-32"></div>
                            <div class="h-4 bg-slate-700 rounded w-16"></div>
                        </ContainerComp>
                        <div class="h-4 bg-slate-700 rounded w-40"></div>
                        <ContainerComp class="grid grid-cols-2">
                            <div class="col-span-1 h-4 bg-slate-700 rounded w-16"></div>
                            <div class="col-span-1 h-4 bg-slate-700 rounded w-16"></div>
                        </ContainerComp>
                        <div class="h-4 bg-slate-700 rounded w-full"></div>
                        <div class="h-4 bg-slate-700 rounded w-40"></div>
                        <div class=" border-b border-gray-200"></div>
                    </ContainerComp>
                </ContainerComp>
                <ContainerComp class="flex flex-col gap-2 mt-2">
                    <PostSkeleton />
                    <PostSkeleton />
                </ContainerComp>
            </ContainerComp>
        </ContainerComp>
    </ContainerComp>
</template>


<!-- <div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
    <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-slate-700 h-10 w-10"></div>
        <div class="flex-1 space-y-6 py-1">
            <div class="h-2 bg-slate-700 rounded"></div>
            <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div class="h-2 bg-slate-700 rounded"></div>
            </div>
        </div>
    </div>
</div> -->