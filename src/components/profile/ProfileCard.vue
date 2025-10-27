<template>
  <div>
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-col items-center w-full gap-6 xl:flex-row">

            <div class="relative flex-shrink-0">
            <img
              v-if="picture"
              :src="picture"
              alt="Photo utilisateur"
              class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-500 shadow-lg dark:border-gray-400"
            />
            <div
              v-else
              class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-100 to-white backdrop-blur-sm flex items-center justify-center text-gray-800 text-xl sm:text-2xl font-bold border-2 border-gray-500 dark:from-gray-700 dark:to-gray-900 dark:text-white/90 dark:border-gray-400"
            >
              {{ userInitials }}
            </div>
          </div>

          <div class="order-3 xl:order-2">
            <h4
              class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left"
            >
              {{ fullName }}
            </h4>
            <slot name="Setting"></slot>
            <div
              class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ Email }}</p>
             <!--  <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Arizona, United States</p> -->
            </div>
          </div>
          
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { defineProps,computed } from 'vue'

const props=defineProps({
 picture :String,
fullName : String,
Email : String
})

const userInitials = computed(() => {
  const names = props.fullName?.trim().split(' ');
  return names?.map((n : any)=> n[0]).slice(0, 2).join('');
});
console.log("userInitials",userInitials.value)
</script>
