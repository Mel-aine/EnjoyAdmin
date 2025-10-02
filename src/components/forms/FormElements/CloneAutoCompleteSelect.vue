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
        :class="['relative font-sans', (disabled || isLoading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
      >
        <div v-if="isLoading" class="absolute right-10 top-1/2 -translate-y-1/2">
          <span class="loading loading-spinner loading-sm"></span>
        </div>
        <input
          ref="mainInput"
          :disabled="disabled"
          type="text"
          class="cursor-pointer flex justify-between dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
          :class="isDropdownOpen ? 'border-purple-500 text-gray-900' : 'border-gray-300'"
          :placeholder="defaultValue"
          v-model="search"
          @focus="openDropdown"
          @blur="onBlur"
          @input="handleInput"
          @keydown.down.prevent="onArrowDown"
          @keydown.up.prevent="onArrowUp"
          @keydown.enter.prevent="onEnter"
        />
        <input type="hidden" :required="isRequired" :value="selectedOption?.value || ''" />
  
        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
  
        <div v-if="isDropdownOpen" class="relative">
          <div
            v-if="!isLoading"
            class="absolute z-50 w-full mt-1 overflow-hidden bg-white border-2 border-t-0 border-purple-100 rounded-b-lg shadow-lg"
          >
            <ul
              class="custom-scrollbar max-h-60 overflow-y-auto text-lg sm:text-base"
              role="listbox"
              :aria-expanded="isDropdownOpen"
              aria-hidden="false"
            >
              <!-- Options existantes -->
              <template v-if="displayOptions.length > 0">
                <li
                  v-for="(option, index) in displayOptions"
                  :key="option.value"
                  @mousedown.prevent="selectOption(option)"
                  :class="[
                    'px-5 py-2 cursor-pointer flex items-center justify-between',
                    {
                      'bg-purple-100 text-purple-900': selectedOption?.value === option.value,
                      'bg-blue-50': highlightedIndex === index && selectedOption?.value !== option.value,
                      'hover:bg-gray-100': selectedOption?.value !== option.value && highlightedIndex !== index,
                      'cursor-not-allowed text-gray-400': disabled
                    }
                  ]"
                  role="option"
                  :aria-selected="selectedOption?.value === option.value"
                >
                  <span>{{ option.label }}</span>
                  <svg
                    v-if="selectedOption?.value === option.value"
                    class="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </li>
                <li class="border-t border-gray-200 my-1"></li>
              </template>
  
              <!-- Champ de saisie personnalisé -->
              <li v-if="props.allowCustom" class="px-3 py-2" @mousedown.stop>
                <div class="flex items-center gap-2">
                  <input
                    ref="customInput"
                    type="text"
                    v-model="customReason"
                    @keydown.enter.prevent="addCustomReason"
                    @keydown.esc="cancelCustomReason"
                    @click.stop
                    @mousedown.stop
                    class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :placeholder="$t('Enter Custom Reason')"
                  />
                  <button
                    @click.prevent="addCustomReason"
                    @mousedown.stop
                    class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!customReason.trim()"
                  >
                    {{ $t('add') }}
                  </button>
                </div>
              </li>
            </ul>
  
            <!-- Message quand aucun résultat n'est trouvé -->
            <div
              v-if="displayOptions.length === 0 && search && !isLoading"
              class="px-5 py-3 text-sm text-gray-500"
            >
              {{ $t('noResultsFound') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
  
  interface Option {
    label: string
    value: string | number
  }
  
  const props = withDefaults(defineProps<{
    lb?: string
    defaultValue?: string
    isRequired?: boolean
    modelValue?: string | number
    options: Option[]
    disabled?: boolean
    isLoading?: boolean
    allowCustom?: boolean
  }>(), {
    allowCustom: true
  })
  
  const emit = defineEmits(['update:modelValue', 'select', 'change', 'add-custom'])
  
  const selectWrapper = ref<HTMLElement | null>(null)
  const mainInput = ref<HTMLInputElement | null>(null)
  const customInput = ref<HTMLInputElement | null>(null)
  const isDropdownOpen = ref(false)
  const search = ref('')
  const selectedOption = ref<Option | null>(null)
  const highlightedIndex = ref(-1)
  const hasUserTyped = ref(false)
  const customReason = ref('')
  
  const displayOptions = computed(() => {
    if (!hasUserTyped.value && selectedOption.value) {
      return props.options
    }
    if (!search.value.trim()) return props.options
    return props.options.filter(option =>
      option.label.toLowerCase().includes(search.value.toLowerCase())
    )
  })
    
  watch(
    () => props.modelValue,
    (newVal) => {
      const newSelectedOption = props.options.find((option) => option.value === newVal);
      if (newSelectedOption) {
        selectedOption.value = newSelectedOption;
        search.value = newSelectedOption.label;
      } else {
        selectedOption.value = null;
        search.value = '';
      }
      hasUserTyped.value = false;
    },
    { immediate: true }
  )
    
  function openDropdown() {
    if (!props.disabled && !props.isLoading) {
      isDropdownOpen.value = true
      hasUserTyped.value = false
      highlightedIndex.value = -1
  
      if (selectedOption.value) {
        const index = displayOptions.value.findIndex(opt => opt.value === selectedOption.value?.value)
        if (index !== -1) {
        }
      }
    }
  }
    
  function addCustomReason() {
    const trimmedReason = customReason.value.trim()
    if (!trimmedReason) return
    
    emit('add-custom', trimmedReason)
    customReason.value = ''
    isDropdownOpen.value = false
  }
  
  function cancelCustomReason() {
    customReason.value = ''
    isDropdownOpen.value = false
    highlightedIndex.value = -1
  }
    
  function handleInput() {
    hasUserTyped.value = true
    isDropdownOpen.value = true
    highlightedIndex.value = -1
  }
    
  function onBlur(event: FocusEvent) {
    // Vérifier si le focus se déplace vers un élément dans le dropdown
    const relatedTarget = event.relatedTarget as HTMLElement
    if (selectWrapper.value?.contains(relatedTarget)) {
      return
    }
  
    setTimeout(() => {
      // Double vérification : ne fermer que si le focus n'est pas dans le wrapper
      if (!selectWrapper.value?.contains(document.activeElement)) {
        isDropdownOpen.value = false
        
        if (!selectedOption.value) {
          search.value = ''
        } else {
          search.value = selectedOption.value.label
        }
      }
    }, 100)
  }
    
  function selectOption(option: Option) {
    if (!props.disabled && !props.isLoading) {
      selectedOption.value = option
      search.value = option.label
      hasUserTyped.value = false
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
  
      if (!selectedOption.value) {
        search.value = ''
      } else {
        search.value = selectedOption.value.label
      }
    }
  }
    
  function onArrowDown() {
    if (!isDropdownOpen.value) {
      openDropdown()
      return
    }
  
    if (highlightedIndex.value < displayOptions.value.length - 1) {
      highlightedIndex.value++
    }
  }
    
  function onArrowUp() {
    if (!isDropdownOpen.value) return
  
    if (highlightedIndex.value > 0) {
      highlightedIndex.value--
    }
  }
    
  function onEnter() {
    if (!isDropdownOpen.value) {
      openDropdown()
      return
    }
  
    if (highlightedIndex.value >= 0 && highlightedIndex.value < displayOptions.value.length) {
      selectOption(displayOptions.value[highlightedIndex.value])
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
  </style>