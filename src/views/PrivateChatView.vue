<script setup>
import ContainerComp from '@/components/ContainerComp.vue';

</script>


<template>
    <div class="grid grid-rows-[auto_1fr_auto] h-[calc(100vh-74px)]">
        <ContainerComp class="max-w-96 p-4 bg-black flex items-center gap-4 shadow">
            <!-- Imagen -->
            <div class="w-10 h-10 rounded-full bg-gray-300"></div>
            <!-- Nombre del usuario -->
            <h1 class="text-xl">Fulanito <span class="text-xs text-gray-400">(Private Chat)</span></h1>
        </ContainerComp>
        <ContainerComp class="bg-black p-4 flex flex-col gap-2 overflow-y-auto">
            <div class="flex items-start">
                <div class="bg-blue-500 bg-opacity-30 text-white p-3 rounded-lg max-w-xs">
                    <p>Hello! How are you?</p>
                </div>
            </div>
            <div class="flex items-start justify-end">
                <div class="bg-gray-500 bg-opacity-30 p-3 rounded-lg max-w-xs">
                    <p>I'm good, thanks! How about you?</p>
                </div>
            </div>
        </ContainerComp>
        <ContainerComp class="max-w-96 flex gap-1">
            <div className="space-y-2 w-full">
                <!-- Revisar este componente copiado de https://originui.com/inputs -->
                <div className="flex rounded-lg shadow-sm shadow-black/[.04]">
                    <input id="input-21"
                        className="bg-gray-600 bg-opacity-40 flex h-9 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-black/[.04] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 -me-px flex-1 rounded-e-none focus-visible:z-10"
                        placeholder="Email" type="text" />
                    <button
                        className="bg-gray-600 bg-opacity-40 inline-flex items-center rounded-e-lg border border-input px-3 text-sm text-foreground hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2">
                        Send
                    </button>
                </div>
            </div>
        </ContainerComp>
    </div>
</template>
<!-- <template>
    <div class="w-full fixed left-0 top-0 px-2">
        <ContainerComp class="p-4 bg-gray-800 text-white">
            <h1 class="text-xl">Private Chat</h1>
        </ContainerComp>
    </div>
    <ContainerComp class="mx-auto flex flex-col h-screen w-full max-w-96 mt-12 mb-32">
        <div class="flex-1 overflow-y-auto p-4 bg-gray-100  mb-">
            <div class="space-y-4">
                <div class="flex items-start">
                    <div class="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                        <p>Hello! How are you?</p>
                    </div>
                </div>
                <div class="flex items-start justify-end">
                    <div class="bg-gray-500 p-3 rounded-lg max-w-xs">
                        <p>I'm good, thanks! How about you?</p>
                    </div>
                </div>
            </div>
        </div>
    </ContainerComp>
    <div class="w-full fixed left-0 bottom-[66px] px-2">
        <ContainerComp class="bg--200 flex gap-1 p-2 w-full max-w-96">
            <div class="flex-1">
                <input type="text" class="p-2 rounded-lg w-full" placeholder="Type your message...">
            </div>
            <button class="p-2 bg-blue-500 text-white rounded-lg">Send</button>
        </ContainerComp>
    </div>
</template> -->