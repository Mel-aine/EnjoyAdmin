<template>
  <div ref="selectWrapper" class="w-full">
    <label for="autocomplete_select" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 truncate"
      :class="isDropdownOpen ? 'text-brand-500' : 'text-gray-500'">
      {{ lb }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div :class="['relative font-sans', (disabled || isLoading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
      <DotSpinner v-if="isLoading"></DotSpinner>
      <input :disabled="disabled" type="text"
        class=" cursor-pointer flex justify-between dark:bg-dark-900 h-11 rounded-lg w-full  border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
        :class="isDropdownOpen ? 'border-purple-500 text-gray-900' : 'border-black/50'" :placeholder="defaultValue"
        v-model="search" @click="openDropdown" @focus="openDropdown" @blur="onBlur" @input="onInput"
        @keydown.down.prevent="onArrowDown" @keydown.up.prevent="onArrowUp" @keydown.enter.prevent="onEnter"
        @keydown.escape="closeDropdown" />
      <input type="hidden" :required="isRequired" :value="selectedOption?.value || ''" />

      <span v-if="!search"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs cursor-pointer">▼</span>
      <Search v-else class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
      <ul v-if="isDropdownOpen && displayOptions.length && !isLoading"
        class="custom-scrollbar absolute top-full left-0 right-0 z-[9999] mt-1 rounded-b-lg max-h-40 overflow-y-auto text-lg sm:text-base bg-white border-2 border-t-0 border-purple-100 dark:bg-gray-800 dark:border-gray-700"
        role="listbox" :aria-expanded="isDropdownOpen" aria-hidden="false">
        <li v-for="(option, index) in displayOptions" :key="option.value ?? 'null'" @mousedown.prevent="selectOption(option)"
          :class="[
            'px-5 py-2 cursor-pointer flex items-center justify-between dark:text-gray-200',
            {
              'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100': selectedOption?.value === option.value,
              'bg-blue-50 dark:bg-blue-900': highlightedIndex === index && selectedOption?.value !== option.value,
              'hover:bg-gray-100 dark:hover:bg-gray-700': selectedOption?.value !== option.value && highlightedIndex !== index,
              'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500': disabled,
              'hover:bg-purple-100 dark:hover:bg-purple-900': !disabled && !option.disabled,
              'text-red-600': option.status === 'occupied',
            }
          ]" role="option" :aria-selected="selectedOption?.value === option.value">
          <span>{{ option.label }}</span>
          <span v-if="option.count !== undefined"
            class="bg-red-200 text-red-800 px-1 py-0.5 rounded-md text-xs font-medium min-w-[24px] text-center">{{
              option.count }}</span>
          <!-- <svg
            v-if="selectedOption?.value === option.value"
            class="w-4 h-4 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg> -->
        </li>
      </ul>

      <!-- Message quand aucun résultat n'est trouvé -->
      <div v-if="isDropdownOpen && displayOptions.length === 0 && search && !isLoading"
        class="absolute top-full left-0 right-0 z-[9999] mt-1 rounded-b-lg bg-white border-2 border-t-0 border-purple-100 px-5 py-3 text-gray-500 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
        {{ $t('no_fund') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import DotSpinner from '@/components/spinner/DotSpinner.vue';
import { Search } from 'lucide-vue-next';

interface Option {
  label: string
  value: string | number | null
  count?: number
  status?: string
  disabled?: boolean
}

const props = defineProps<{
  lb?: string
  defaultValue?: string
  isRequired?: boolean
  modelValue?: string | number | null
  options: Option[]
  disabled?: boolean
  isLoading?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'select', 'change'])

const isDropdownOpen = ref(false)
const selectWrapper = ref<HTMLElement | null>(null)
const search = ref('')
const selectedOption = ref<Option | null>(null)
const highlightedIndex = ref(-1)
const hasUserTyped = ref(false)

// Options à afficher : toutes les options au focus, filtrées lors de la saisie
const displayOptions = computed(() => {
  // Si l'utilisateur n'a pas encore tapé (juste focus), afficher toutes les options
  if (!hasUserTyped.value) {
    return props.options
  }

  // Sinon, filtrer selon la recherche
  if (!search.value.trim()) return props.options
  return props.options.filter(option =>
    option.label.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Initialiser la valeur sélectionnée
watch(
  [() => props.modelValue, () => props.options],
  ([newVal]) => {
    const newSelectedOption = props.options.find(
      (option) => String(option.value) === String(newVal),
    )
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

    // Si on a une option sélectionnée, on met son index en surbrillance
    if (selectedOption.value) {
      const index = displayOptions.value.findIndex(opt => opt.value === selectedOption.value?.value)
      if (index !== -1) {
        highlightedIndex.value = index
      }
    }
  }
}

function closeDropdown() {
  isDropdownOpen.value = false
  highlightedIndex.value = -1
  hasUserTyped.value = false
}

function onInput() {
  hasUserTyped.value = true
  isDropdownOpen.value = true
  highlightedIndex.value = -1
}

function onBlur() {
  // Réduire le délai pour une meilleure responsivité
  setTimeout(() => {
    closeDropdown()

    // Réinitialiser le champ si aucune option valide n'est sélectionnée
    if (!selectedOption.value) {
      search.value = ''
    } else {
      // Remettre le libellé de l'option sélectionnée
      search.value = selectedOption.value.label
    }
  }, 100)
}

function selectOption(option: Option) {
  if (props.disabled || props.isLoading) {
    return
  } else {
    selectedOption.value = option
    search.value = option.label
    hasUserTyped.value = false
    closeDropdown()

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
    closeDropdown()

    // Réinitialiser le champ si aucune option valide n'est sélectionnée
    if (!selectedOption.value) {
      search.value = ''
    } else {
      search.value = selectedOption.value.label
    }
  }
}

// Navigation au clavier
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
