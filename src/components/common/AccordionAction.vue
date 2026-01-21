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

          <!-- Dropdown Menu -->
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            <button
              @click.stop="handleCreateNew"
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-t-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>{{ $t('Create New Guest') }}</span>
            </button>

            <button
              @click.stop="handleAssignExisting"
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-b-lg transition-colors border-t border-gray-200 dark:border-gray-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>{{ $t('Assign Existing Guest') }}</span>
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
  (e: 'create'): void
  (e: 'assign'): void
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

const handleCreateNew = () => {
  showDropdown.value = false
  emit('create')
}

const handleAssignExisting = () => {
  showDropdown.value = false
  emit('assign')
}

// Close dropdown when clicking outside
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
