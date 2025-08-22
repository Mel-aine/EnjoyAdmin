<template>
  <div ref="dropdownContainer" class="relative dropdown-container w-full">
    <button 
      @click="toggleDropdown"
      :class="[
        'flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 justify-between',
        buttonClass
      ]"
    >
      <span>{{ displayText }}</span>
      <ChevronDown 
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen"
      :class="[
        'absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50',
        dropdownClass
      ]"
    >
      <div class="py-2">
        <div v-if="showSelectAll" class="px-4 py-1 border-b border-gray-200">
          <label class="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              :checked="isAllSelected" 
              @change="toggleSelectAll"
              class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <span class="text-gray-700 font-medium text-sm">{{ selectAllText }}</span>
          </label>
        </div>
        <div class="max-h-60 overflow-y-auto">
          <label 
            v-for="option in options" 
            :key="option.id" 
            class="w-full flex items-center gap-3 px-4 py-1 text-left hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
          >
            <input 
              type="checkbox" 
              :checked="isSelected(option)" 
              @change="toggleOption(option)"
              class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <component v-if="option.icon" :is="option.icon" class="w-4 h-5" />
            <span class="text-gray-700 font-medium text-sm">{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
  modelValue?: string[]
  showSelectAll?: boolean
  selectAllText?: string
  placeholder?: string
  maxDisplayItems?: number
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Options',
  buttonClass: 'bg-transparent text-gray border border-primary w-40',
  dropdownClass: 'w-40',
  modelValue: () => [],
  showSelectAll: true,
  selectAllText: 'Select All',
  placeholder: 'Select options',
  maxDisplayItems: 2
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const selectedIds = ref<string[]>(props.modelValue || [])

// Computed properties
const isAllSelected = computed(() => {
  return props.options.length > 0 && selectedIds.value.length === props.options.length
})

const displayText = computed(() => {
    return props.placeholder
  /*if (selectedIds.value.length === 0) {
    return props.placeholder
  }
  
  if (selectedIds.value.length === props.options.length && props.showSelectAll) {
    return `All Selected (${selectedIds.value.length})`
  }
  
  if (selectedIds.value.length > props.maxDisplayItems) {
    return `${selectedIds.value.length} items selected`
  }
  
  const selectedLabels = props.options
    .filter(option => selectedIds.value.includes(option.id))
    .map(option => option.label)
  
  return selectedLabels.join(', ')*/
})

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const isSelected = (option: DropdownOption): boolean => {
  return selectedIds.value.includes(option.id)
}

const toggleOption = (option: DropdownOption) => {
  const index = selectedIds.value.indexOf(option.id)
  
  if (index === -1) {
    selectedIds.value.push(option.id)
  } else {
    selectedIds.value.splice(index, 1)
  }
  
  emitChange()
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = props.options.map(option => option.id)
  }
  
  emitChange()
}

const emitChange = () => {
  emit('update:modelValue', selectedIds.value)
  emit('change', selectedIds.value)
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
watch(()=>props.modelValue, (newVal) => {
  //console.log(newVal)
 // selectedIds.value = newVal
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-container {
  position: relative;
}

.form-checkbox {
  appearance: none;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  display: inline-block;
  height: 1rem;
  width: 1rem;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
}

.form-checkbox:checked {
  background-color: currentColor;
  border-color: currentColor;
}

.form-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.375rem;
  height: 0.375rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -60%) rotate(45deg);
}

.max-h-60 {
  max-height: 15rem;
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>