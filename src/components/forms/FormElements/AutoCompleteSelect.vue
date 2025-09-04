<template>
  <div ref="selectWrapper" class="w-full">
    <label
      for="autocomplete_select"
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :class="isDropdownOpen ? 'text-brand-500' : 'text-gray-500'"
    >
      {{ lb }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div
      :class="['relative font-sans', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
    >
      <input
        :disabled="disabled"
        type="text"
        class="flex justify-between dark:bg-dark-900  dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
        :class="isDropdownOpen ? 'border-purple-500 text-gray-900' : 'border-gray-300'"
        :placeholder="defaultValue"
        v-model="search"
        @focus="openDropdown"
        @input="onInput"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter.prevent="onEnter"
      />
      <input type="hidden" :required="isRequired" :value="selectedOption?.value || ''" />
      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>

      <ul
        v-if="isDropdownOpen && filteredOptions.length"
        class="custom-scrollbar absolute top-full left-0 right-0 z-50 mt-1 rounded-b-lg max-h-40 overflow-y-auto text-lg sm:text-base bg-white border-2 border-t-0 border-purple-100"
        role="listbox"
        :aria-expanded="isDropdownOpen"
        aria-hidden="false"
      >
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          :class="[
            'px-5 py-2 cursor-pointer hover:bg-brand-100',
            disabled ? 'cursor-not-allowed text-gray-400' : ''
          ]"
          role="option"
          :aria-selected="selectedOption?.value === option.value"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  lb?: string
  defaultValue?: string
  isRequired?: boolean
  modelValue?: string | number
  options: Option[]
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'select', 'change'])

const isDropdownOpen = ref(false)
const selectWrapper = ref<HTMLElement | null>(null)
const search = ref('')
const selectedOption = ref<Option | null>(
  props.options.find((opt) => opt.value === props.modelValue) || null
)

const filteredOptions = computed(() => {
  if (!search.value) return props.options
  return props.options.filter(option =>
    option.label.toLowerCase().includes(search.value.toLowerCase())
  )
})

watch(
  () => props.modelValue,
  (newVal) => {
    selectedOption.value =
      props.options.find((option) => option.value === newVal) || null
    search.value = selectedOption.value?.label || ''
  },
  { immediate: true }
)

function openDropdown() {
  if (!props.disabled) isDropdownOpen.value = true
}

function onInput() {
  isDropdownOpen.value = true
}

function selectOption(option: Option) {
  if (!props.disabled) {
    selectedOption.value = option
    search.value = option.label
    isDropdownOpen.value = false
    emit('update:modelValue', option.value)
    emit('select', option)
    emit('change', option.value)
  }
}

function handleClickOutside(event: MouseEvent) {
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

// Optional: Keyboard navigation
function onArrowDown() {}
function onArrowUp() {}
function onEnter() {}

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
</style>
