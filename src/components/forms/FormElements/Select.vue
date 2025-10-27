<template>
  <div ref="selectWrapper" class="w-full">
    <label for="floating_select" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :class="isDropdownOpen ? 'text-brand-500 dark:text-brand-400' : 'text-gray-500 dark:text-gray-300'">
      {{ lb }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div :class="['relative font-sans', (disabled || isLoading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
      @click="handleDropdownToggle">
      <div
        class="flex items-center justify-between dark:bg-dark-900 h-11 w-full truncate rounded-lg  border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
        :class="[isDropdownOpen ? 'border-purple-500 text-gray-900 dark:border-purple-400 dark:text-white' : 'border-black/50 dark:border-black/40', props.customClass]">
        <span>{{ selectedOption?.label || defaultValue || props.placeholder }}</span>
        <DotSpinner v-if="isLoading"></DotSpinner>
        <span v-else :class="isDropdownOpen ? 'text-purple-500 dark:text-purple-400 text-xs' : 'text-gray-500 dark:text-gray-300 text-xs'">▼</span>
      </div>

      <input type="hidden" :required="isRequired" :value="selectedOption?.value || ''" />

      <ul v-if="isDropdownOpen && !isLoading"
        class="custom-scrollbar absolute top-full left-0 right-0 z-999 mt-1 rounded-b-lg max-h-40 overflow-y-auto text-lg sm:text-base bg-white dark:bg-gray-900 border-2 dark:border-gray-700 border-t-0 border-purple-100"
        role="listbox" :aria-expanded="isDropdownOpen" aria-hidden="false">
        <li v-for="option in options" :key="option.value" @click="selectOption(option)" :class="[
          'px-5 py-2 cursor-pointer hover:bg-brand-100 dark:hover:bg-gray-700 dark:text-white ',
          disabled ? 'cursor-not-allowed text-gray-400 dark:text-gray-500' : ''
        ]" role="option" :aria-selected="selectedOption?.value === option.value">
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import DotSpinner from '@/components/spinner/DotSpinner.vue';
import { ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  lb?: string
  defaultValue?: string
  isRequired?: boolean
  modelValue?: string | number | null
  placeholder?: string
  options: Option[]
  disabled?: boolean,
  isLoading?: boolean
  customClass?: string
}>()

const emit = defineEmits(['update:modelValue', 'select', 'change'])

const isDropdownOpen = ref(false)
const selectWrapper = ref<HTMLElement | null>(null)

const selectedOption = ref<Option | null>(
  props.options.find((opt) => opt.value === props.modelValue) || null
)

watch(
  () => props.modelValue,
  (newVal) => {
    selectedOption.value =
      props.options.find((option) => option.value === newVal) || null
  }
)

watch(() => props.options, (newOptions) => {
  selectedOption.value =
    newOptions.find((option) => option.value === props.modelValue) || null
})

const handleDropdownToggle = () => {
  if (!props.disabled && !props.isLoading) {
    isDropdownOpen.value = !isDropdownOpen.value
  }
}

const selectOption = (option: Option) => {
  if (!props.disabled && !props.isLoading) {
    selectedOption.value = option
    isDropdownOpen.value = false
    emit('update:modelValue', option.value)
    emit('select', option)
    emit('change', option.value)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    selectWrapper.value &&
    !selectWrapper.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>
.cursor-not-allowed {
  cursor: not-allowed;
}

.opacity-50 {
  opacity: 0.5;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #b654c7e2 #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #25ebe5;
}

/* Dark mode scrollbar */
.dark .custom-scrollbar {
  scrollbar-color: #6b7280 #111827;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #111827;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #6b7280;
  border-radius: 20px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
