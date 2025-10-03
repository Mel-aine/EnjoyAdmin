
<script setup lang="ts">

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
              class="fixed inset-0 h-full w-full bg-gray-400/50 "
              aria-hidden="true"
              @click="close"
        ></div>


        <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <button
            @click="close"
            class="transition-color absolute right-5 top-5 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600  dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"  fill="" />
            </svg>
          </button>
                <div class="sm:flex sm:items-start">
                    <div
                        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg class="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 class="text-base font-semibold text-slate-900" id="modal-title">{{ title }}</h3>
                        <div class="mt-2">
                            <p class="text-sm text-slate-500">{{ props.message }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Footer -->
            <div class="footer flex justify-center iitem-center py-2">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>

</template>
