<template>
  <div ref="dropdownContainer" class="relative dropdown-container" @mouseenter="onHoverOpen">
    <button 
      @click="handleButtonClick"
      :class="[
        'flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200',
        buttonClass
      ]"
    >
      <span>{{ buttonText }}</span>
      <ChevronDown 
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen"
      :class="[
        'absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700',
        dropdownClass
      ]"
    >
    
     <div class="py-2">
                <button v-for="option in options" :key="option.id" @click="handleOptionClick(option)"
                    class="w-full flex items-center gap-3 px-4 py-1 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <component v-if="option.icon" :is="option.icon" class="w-4 h-5"  />
                    <span class="text-gray-700 dark:text-gray-300 font-medium text-sm">{{ option.label }}</span>
                </button>
            </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface DropdownOption {
  id: string
  label: string
  icon?: any
  color?: string
}

interface Props {
  options: DropdownOption[]
  buttonText?: string
  buttonClass?: string
  dropdownClass?: string
  openOnHover?: boolean
}

interface Emits {
  (e: 'option-selected', option: DropdownOption): void
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Options',
  buttonClass: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600',
  dropdownClass: 'w-64',
  openOnHover: true
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)

const onHoverOpen = () => {
  if (props.openOnHover) {
    isOpen.value = true
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleButtonClick = () => {
  if (!props.openOnHover) {
    toggleDropdown()
  }
}

const handleOptionClick = (option: DropdownOption) => {
  emit('option-selected', option)
  isOpen.value = false
}

// Template ref for the dropdown container
const dropdownContainer = ref<HTMLElement | null>(null)

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (dropdownContainer.value && !dropdownContainer.value.contains(target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>