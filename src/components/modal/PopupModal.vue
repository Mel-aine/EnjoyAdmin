
<script lang="ts" setup>
    import { computed, ref } from "vue";
    const emits = defineEmits(['close']);
    const props = defineProps({
        message: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: "",
        },
        isOpen: {
            type: Boolean,
            default: false,
        }
    });

    const close = () => {
        console.log('emit close')
        emits('close');
    }
</script>

<template>
    <!-- <div class="fixed w-full h-full top-0 left-0 flex items-center justify-center z-99999 overflow-auto" v-if="isOpen" aria-labelledby="modal-title" role="dialog" aria-modal="true">

        <div class="absolute w-full h-full inset-0 bg-black bg-opacity-75 transition-opacity" @click="close" aria-hidden="true"></div> -->
        <div class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
            <div
              class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[10px]"
              aria-hidden="true"
              @click="close"
        ></div>

        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg class="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 class="text-base font-semibold text-slate-900" id="modal-title">{{ title }}</h3>
                        <div class="mt-2">
                            <p class="text-sm text-slate-500">{{  props.message }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Footer -->
            <div class="footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>

</template>
