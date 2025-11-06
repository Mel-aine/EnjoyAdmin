<template>
  <div class="profession-autocomplete w-full max-w-md mx-auto">
    <label
      for="profession-input"
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 truncate"
    >
      {{ $t(lb) }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        id="profession-input"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        :disabled="disabled"
        :placeholder="computedPlaceholder"
        autocomplete="off"
        :class="[
          'flex justify-between h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
          {
            'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800': disabled,
            'border-black/50': !disabled,
            'border-gray-200': disabled
          },
          props.customClass
        ]"
      />

      <!-- Liste -->
      <ul
        v-if="isOpen && filteredProfessions.length && !disabled"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm dark:bg-gray-800 dark:ring-gray-600"
      >
        <li
          v-for="profession in filteredProfessions"
          :key="profession.value"
          @mousedown.prevent="selectProfession(profession)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors duration-150 ease-in-out rounded-md"
        >
          <span class="block truncate">{{ profession.label }}</span>
        </li>
      </ul>

      <!-- Aucun résultat -->
      <div
        v-else-if="isOpen && !filteredProfessions.length && searchQuery && !disabled"
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 px-3 text-sm text-gray-500 dark:text-gray-400"
      >
        {{ $t('no_results') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: String },
  disabled: { type: Boolean, default: false },
  isRequired: { type: Boolean, default: false },
  lb: { type: String, default: '' },
  customClass: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})

const emits = defineEmits(['update:modelValue', 'select', 'change'])

const searchQuery = ref<string>('')
const isOpen = ref<boolean>(false)
const selectedProfession = ref<{ value: string; label: string } | null>(null)
const computedPlaceholder = computed(() => props.placeholder || t('enterProfession'))

// --- Liste de professions (objets { value, label })
const professions = computed(() => [
  { value: 'doctor', label: t('doctor') },
  { value: 'nurse', label: t('nurse') },
  { value: 'teacher', label: t('teacher') },
  { value: 'engineer', label: t('engineer') },
  { value: 'lawyer', label: t('lawyer') },
  { value: 'architect', label: t('architect') },
  { value: 'developer', label: t('developer') },
  { value: 'designer', label: t('designer') },
  { value: 'manager', label: t('manager') },
  { value: 'accountant', label: t('accountant') },
  { value: 'chef', label: t('chef') },
  { value: 'salesperson', label: t('salesperson') },
  { value: 'driver', label: t('driver') },
  { value: 'student', label: t('student') },
  { value: 'retired', label: t('retired') },
  { value: 'entrepreneur', label: t('entrepreneur') },
  { value: 'artist', label: t('artist') },
  { value: 'technician', label: t('technician') },
  { value: 'scientist', label: t('scientist') },
  { value: 'consultant', label: t('consultant') },
  { value: 'photographer', label: t('photographer') },
  { value: 'writer', label: t('writer') },
  { value: 'journalist', label: t('journalist') },
  { value: 'police_officer', label: t('police_officer') },
  { value: 'firefighter', label: t('firefighter') },
  { value: 'civil_servant', label: t('civil_servant') },
])

// --- Filtrage
const filteredProfessions = computed(() => {
  if (!searchQuery.value) return professions.value
  const q = searchQuery.value.toLowerCase()
  return professions.value.filter((p) => p.label.toLowerCase().includes(q))
})

// --- Synchronisation du v-model
watch(
  () => props.modelValue,
  (newVal) => {
    const selected = professions.value.find((p) => p.value === newVal)
    selectedProfession.value = selected || null
    searchQuery.value = selected ? selected.label : ''
  },
  { immediate: true }
)

// --- Gestion des événements
const handleInput = () => {
  if (!props.disabled) {
    isOpen.value = true
    emits('change', searchQuery.value)
  }
}

const handleFocus = () => {
  if (!props.disabled) isOpen.value = true
}

function handleBlur() {
  setTimeout(() => {
    isOpen.value = false

    const match = professions.value.find(
      (p) => p.label.toLowerCase() === searchQuery.value.toLowerCase()
    )

    if (match) {
      selectedProfession.value = match
      searchQuery.value = match.label
      emits('update:modelValue', match.value)
    } else {
      selectedProfession.value = null
      searchQuery.value = ''
      emits('update:modelValue', '')
    }
  }, 200)
}

const selectProfession = (profession: { value: string; label: string }) => {
  if (props.disabled) return
  selectedProfession.value = profession
  searchQuery.value = profession.label
  emits('update:modelValue', profession.value)
  emits('select', profession.value)
  emits('change', profession.value)
  isOpen.value = false
}
</script>
