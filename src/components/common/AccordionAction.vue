<template>
  <div class="accordion-container">
    <div
      class="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
      @click="toggleAccordion"
      :class="{ 'bg-purple-50 dark:bg-purple-900/20': isOpen, 'bg-gray-50 dark:bg-gray-800': !isOpen }"
    >
      <span class="dark:text-gray-200">{{ title }}</span>
      <div class="flex items-center gap-2">
        <!-- Dropdown Button -->
        <div class="relative" ref="dropdownRef">
          <button
            :title="$t('Actions')"
            @click.stop="toggleDropdown"
            class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <PlusCircle class="text-primary w-5 h-5" />
          </button>

          <!-- Dropdown Menu - 2 OPTIONS SEULEMENT -->
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            <!-- OPTION 1: Ajouter un nouveau guest -->
            <button
              @click.stop="handleAddNew"
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-t-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              <span>{{ $t('Add New Guest') }}</span>
            </button>

            <!-- OPTION 2: Ajouter un guest existant -->
            <button
              @click.stop="handleAddExisting"
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-b-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <span>{{ $t('Add Existing Guest') }}</span>
            </button>
          </div>
        </div>

        <ChevronDownIcon
          class="w-5 h-5 transition-transform duration-200 dark:text-gray-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </div>
    <div v-if="isOpen" class="accordion-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@/icons'
import { PlusCircle } from 'lucide-vue-next'

interface Props {
  title: string
  defaultOpen?: boolean
}

const emit = defineEmits<{
  (e: 'add-new'): void           // Ajoute un nouveau guest
  (e: 'add-existing'): void       // Ajoute un guest existant
}>()

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
})

const isOpen = ref(props.defaultOpen)
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleAccordion = () => {
  isOpen.value = !isOpen.value
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleAddNew = () => {
  showDropdown.value = false
  emit('add-new')
}

const handleAddExisting = () => {
  showDropdown.value = false
  emit('add-existing')
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
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
@reference "tailwindcss";
.accordion-container {
  @apply border border-gray-200 dark:border-gray-700 rounded-md;
}

.accordion-content {
  @apply p-4 border-t border-gray-200 dark:border-gray-700;
}
</style>
