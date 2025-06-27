<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center w-full space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-haspopup="listbox"
      :aria-expanded="showDropdown"
    >
      <div class="flex items-center justify-center">
        <img
                :src="currentService?.logo"
                alt="logo service"
                class="w-10 h-10  rounded-full "
              />
      </div>
      <div class="text-left flex-1 truncate">
        <div class="font-medium text-gray-900 truncate">{{ currentService?.name || 'Aucun service' }}</div>
        <div class="text-xs text-gray-500 capitalize truncate">{{ currentService?.type || '' }}</div>
      </div>
      <ChevronRight class="w-4 h-4 ml-auto text-gray-400 transition-transform" :class="{ 'rotate-180': showDropdown }" />
    </button>

    <ul
      v-if="showDropdown"
      class="absolute top-0 right-full mr-2 w-64 max-h-60 overflow-auto rounded-lg bg-white shadow-lg border z-50"
      role="listbox"
      tabindex="-1"
    >
      <li
        v-for="service in services"
        :key="service.id"
        @click="selectService(service)"
        :class="[
          'flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-gray-50',
          currentService?.id === service.id ? 'bg-blue-50 border border-blue-200' : ''
        ]"
        role="option"
        :aria-selected="currentService?.id === service.id"
      >
       <div class="flex items-center justify-center">
        <img
                :src="service?.logo"
                alt="logo service"
                class="w-10 h-10  rounded-full "
              />
        </div>
        <div class="flex-1 text-left truncate">
          <div class="font-normal text-gray-700 truncate ">{{ service.name }}</div>
          <div class="text-sm text-gray-500 capitalize truncate">{{ service.type }}</div>
        </div>
        <CheckIcon v-if="currentService?.id === service.id" class="w-4 h-4 text-blue-600" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed,watch,onMounted } from 'vue'
import { useServiceStore } from '@/composables/serviceStore'
import { CheckIcon } from 'lucide-vue-next'
import { ChevronRight } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'



const router = useRouter()
const serviceStore = useServiceStore()
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)


 const services = computed(() => serviceStore.getService)
const currentService = computed(() => serviceStore.getCurrentService)
onMounted(() => {
  console.log('Service actuel :', serviceStore.getCurrentService)
})


const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectService = (service:any) => {
  serviceStore.setServiceId(service.id)
  serviceStore.setServiceCategory(service?.category?.categoryName || '')
  showDropdown.value = false
router.go(0)

}


// Ferme le dropdown si clic en dehors
onClickOutside(dropdownRef, () => {
  showDropdown.value = false
})
</script>

<style scoped>
/* Si tu veux, ajoute des styles ici */
</style>
