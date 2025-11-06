<template>
  <div ref="selectWrapper" class="w-full ">
    <label
      class="mb-1.5 block text-sm font-medium"
      :class="isDropdownOpen ? 'text-purple-500 dark:text-purple-400' : 'text-gray-700 dark:text-gray-400'"
    >
      {{ label }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div
      :class="['relative font-sans', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
      @click="handleDropdownToggle"
    >
      <div
        class="flex items-center justify-between h-11 w-full truncate rounded-lg border bg-transparent dark:bg-gray-900 px-4 py-2.5 text-sm "
        :class="[
          isDropdownOpen
            ? 'border-purple-500 text-gray-900 dark:border-purple-400 dark:text-white'
            : 'border-black/50 dark:border-gray-700 text-gray-700 dark:text-gray-300'
        ]"
      >
        <span>{{ displayLabel }}</span>
        <span
          :class="[
            'text-xs transition-transform',
            isDropdownOpen ? 'rotate-180 text-purple-500 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
          ]"
        >
          ▼
        </span>
      </div>

      <input type="hidden" :required="isRequired" :value="JSON.stringify(selectedFilters)" />

      <div
        v-if="isDropdownOpen"
        class="absolute top-full left-0 right-0 z-40 mt-1 rounded-lg bg-white dark:bg-gray-900 border-2 border-purple-100 dark:border-purple-900 shadow-lg "
      >
        <!-- Filtres  (groupes) -->
        <div class="border-b border-gray-200 dark:border-gray-700">

          <div
            v-for="(filters, groupName) in filterGroups"
            :key="groupName"
            @click.stop="handleGroupClick(groupName)"
            class="px-4 py-2.5 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-between"
          >
            <span>{{ groupName }}</span>
            <!-- <svg
              v-if="isGroupSelected(groupName)"
              class="w-4 h-4 text-purple-500 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg> -->
          </div>
        </div>

        <!-- Filtres individuels -->
        <div class="max-h-[200px] overflow-y-auto custom-scrollbar">

          <div
            v-for="filter in allIndividualFilters"
            :key="filter"
            @click.stop="handleIndividualFilterToggle(filter)"
            class="px-4 py-2.5 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-between "
            :class="{'bg-purple-50 dark:bg-gray-800': selectedFilters.includes(filter)}"
          >
            <span>{{ filter }}</span>
            <svg
              v-if="selectedFilters.includes(filter)"
              class="w-4 h-4 text-purple-500 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface FilterGroups {
  [key: string]: string[]
}

interface Props {
  label?: string
  isRequired?: boolean
  modelValue?: string[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  modelValue: () => ['Rate And Availability'],
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'change': [value: string[]]
}>()

const isDropdownOpen = ref(false)
const selectWrapper = ref<HTMLElement | null>(null)
const selectedFilters = ref<string[]>([...props.modelValue])

// Définition des groupes de filtres
const filterGroups: FilterGroups = {
  'All Restrictions': [
    'Availability Offset',
    'Availability Per Rate',
    'Closed To Arrival',
    'Closed To Departure',
    'Max Availability',
    'Max Stay',
    'Min Stay Arrival',
    'Min Stay Through',
    'Rate',
    'Stop Sell'
  ],
  'Only Availability': [
    'Availability'
  ],
  'Rate And Availability': [
    'Rate',
  ]
}

const allIndividualFilters = [
  'Availability Offset',
  'Availability Per Rate',
  'Closed To Arrival',
  'Closed To Departure',
  'Max Availability',
  'Max Stay',
  'Min Stay Arrival',
  'Min Stay Through',
  'Rate',
  'Stop Sell'
]

// Label à afficher dans le select
const displayLabel = computed(() => {
  if (selectedFilters.value.length === 0) return 'Sélectionner des filtres'

  // Vérifier si c'est un groupe prédéfini
  for (const [groupName, filters] of Object.entries(filterGroups)) {
    const sorted1 = [...filters].sort().join(',')
    const sorted2 = [...selectedFilters.value].sort().join(',')
    if (sorted1 === sorted2) {
      return groupName
    }
  }

  if (selectedFilters.value.length === 1) return selectedFilters.value[0]
  return `${selectedFilters.value.length} restrictions`
})

// Vérifier si un groupe est sélectionné
const isGroupSelected = (groupName: string | number): boolean => {
  const filters = filterGroups[groupName]
  const sorted1 = [...filters].sort().join(',')
  const sorted2 = [...selectedFilters.value].sort().join(',')
  return sorted1 === sorted2
}

// Toggle du dropdown
const handleDropdownToggle = () => {
  if (!props.disabled) {
    isDropdownOpen.value = !isDropdownOpen.value
  }
}

// Sélection d'un groupe
const handleGroupClick = (groupName: string | number) => {
  const filters = filterGroups[groupName]
  selectedFilters.value = [...filters]
  emit('update:modelValue', selectedFilters.value)
  emit('change', selectedFilters.value)

}

// Toggle d'un filtre individuel
const handleIndividualFilterToggle = (filter: string) => {
  if (selectedFilters.value.includes(filter)) {
    selectedFilters.value = selectedFilters.value.filter(f => f !== filter)
  } else {
    selectedFilters.value = [...selectedFilters.value, filter]
  }
  emit('update:modelValue', selectedFilters.value)
  emit('change', selectedFilters.value)
}

// Gestion du clic en dehors
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
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #a855f7 #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #a855f7;
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9333ea;
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
