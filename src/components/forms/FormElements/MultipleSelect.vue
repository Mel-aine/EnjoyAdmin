<template>
  <div class="relative" ref="multiSelectRef">
    <div
      @click="toggleDropdown"
      class="dark:bg-dark-900 min-h-[44px] flex items-center w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
      :class="{ 'text-gray-800 dark:text-white/90': isOpen }"
    >
      <span v-if="selectedItems.length === 0" class="text-gray-400"> {{ $t('select_item') }} </span>

      <!-- Affichage compact avec compteur -->
      <div v-else-if="displayMode === 'compact'" class="flex items-center justify-between flex-auto">
        <span class="text-sm text-gray-800 dark:text-white/90">
          {{ selectedItems.length }} {{ selectedItems.length > 1 ? 'éléments sélectionnés' : 'élément sélectionné' }}
        </span>
        <button
          @click.stop="clearAll"
          class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          v-if="selectedItems.length > 0"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <!-- Affichage avec tags limités -->
      <div v-else-if="displayMode === 'limited'" class="flex flex-wrap items-center flex-auto gap-2">
        <div
          v-for="(item) in visibleSelectedItems"
          :key="`${item.label}|${item.value}`"
          class="group flex items-center justify-center h-[30px] rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
        >
          <span class="truncate max-w-[120px]">{{ item.label }}</span>
          <button
            @click.stop="removeItem(item)"
            class="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400 flex-shrink-0"
            aria-label="Remove item"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <!-- Compteur des éléments masqués -->
        <div
          v-if="hiddenItemsCount > 0"
          class="flex items-center justify-center h-[30px] rounded-full border-[0.7px] border-gray-300 bg-gray-50 px-2.5 text-sm text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          :title="hiddenItemsTooltip"
        >
          +{{ hiddenItemsCount }}
        </div>
      </div>

      <!-- Affichage avec scroll horizontal -->
      <div v-else class="flex items-center flex-auto min-w-0">
        <div class="flex gap-2 overflow-x-auto scrollbar-hidden py-1 flex-nowrap min-w-0" style="scrollbar-width: none; -ms-overflow-style: none;">
          <div
            v-for="item in selectedItems"
            :key="item.value"
            class="group flex items-center justify-center h-[30px] rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800 flex-shrink-0"
          >
            <span class="truncate max-w-[150px]">{{ item.label }}</span>
            <button
              @click.stop="removeItem(item)"
              class="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400"
              aria-label="Remove item"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <svg
        class="ml-auto flex-shrink-0"
        :class="{ 'transform rotate-180': isOpen }"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700"
      >
        <!-- Barre de recherche -->
        <div class="p-3 border-b border-gray-200 dark:border-gray-700">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher..."
            class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <!-- Actions rapides -->
        <div class="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 text-sm">
          <span class="text-gray-600 dark:text-gray-300">
            {{ selectedItems.length }}/{{ filteredOptions.length }} sélectionnés
          </span>
          <div class="flex gap-2">
            <button
              @click="selectAll"
              class="text-purple-600 hover:text-purple-700 dark:text-purple-400"
              v-if="selectedItems.length < filteredOptions.length"
            >
              Tout sélectionner
            </button>
            <button
              @click="clearAll"
              class="text-red-600 hover:text-red-700 dark:text-red-400"
              v-if="selectedItems.length > 0"
            >
              Tout désélectionner
            </button>
          </div>
        </div>

        <ul
          class="overflow-y-auto divide-y divide-gray-200 custom-scrollbar max-h-40 dark:divide-gray-700"
          role="listbox"
          aria-multiselectable="true"
        >
          <li
            v-for="item in filteredOptions"
            :key="`${item.label}|${item.value}`"
            @click="toggleItem(item)"
            class="relative flex items-center w-full px-3 py-2 border-transparent cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
            :class="{ 'bg-purple-50 dark:bg-purple-900/20': isSelected(item) }"
            role="option"
            :aria-selected="isSelected(item)"
          >
            <span class="grow truncate pr-2">{{ item.label }}</span>
            <svg
              v-if="isSelected(item)"
              class="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </li>
          <li v-if="filteredOptions.length === 0" class="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
            Aucun élément trouvé
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  maxVisibleTags: {
    type: Number,
    default: 3,
  },
  defaultDisplayMode: {
    type: String,
    default: 'limited', // 'compact', 'limited', 'scroll'
    validator: (value) => ['compact', 'limited', 'scroll'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedItems = ref(props.modelValue)
const multiSelectRef = ref(null)
const searchQuery = ref('')
const displayMode = ref(props.defaultDisplayMode)

// Mode d'affichage automatique basé sur le nombre d'éléments sélectionnés
watch(selectedItems, (newItems) => {
  if (newItems.length > 10 && displayMode.value !== 'compact') {
    displayMode.value = 'compact'
  } else if (newItems.length <= 3 && displayMode.value === 'compact') {
    displayMode.value = 'limited'
  }
}, { immediate: true })

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const visibleSelectedItems = computed(() => {
  return selectedItems.value.slice(0, props.maxVisibleTags)
})

const hiddenItemsCount = computed(() => {
  return Math.max(0, selectedItems.value.length - props.maxVisibleTags)
})

const hiddenItemsTooltip = computed(() => {
  const hiddenItems = selectedItems.value.slice(props.maxVisibleTags)
  return hiddenItems.map(item => item.label).join(', ')
})

const displayModeTooltip = computed(() => {
  const modes = {
    compact: 'Affichage compact',
    limited: 'Affichage avec tags limités',
    scroll: 'Affichage avec défilement'
  }
  return modes[displayMode.value]
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const toggleItem = (item) => {
  // Utiliser label + value comme identifiant unique
  const uniqueId = `${item.label}|${item.value}`
  const selectedId = `${item.label}|${item.value}`
  const index = selectedItems.value.findIndex((selected) => `${selected.label}|${selected.value}` === selectedId)
  if (index === -1) {
    selectedItems.value.push(item)
  } else {
    selectedItems.value.splice(index, 1)
  }
  emit('update:modelValue', selectedItems.value)
}

const removeItem = (item) => {
  const selectedId = `${item.label}|${item.value}`
  const index = selectedItems.value.findIndex((selected) => `${selected.label}|${selected.value}` === selectedId)
  if (index !== -1) {
    selectedItems.value.splice(index, 1)
    emit('update:modelValue', selectedItems.value)
  }
}

const isSelected = (item) => {
  return selectedItems.value.some((selected) => `${selected.label}|${selected.value}` === `${item.label}|${item.value}`)
}

const selectAll = () => {
  selectedItems.value = [...filteredOptions.value]
  emit('update:modelValue', selectedItems.value)
}

const clearAll = () => {
  selectedItems.value = []
  emit('update:modelValue', selectedItems.value)
}

const cycleDisplayMode = () => {
  const modes = ['compact', 'limited', 'scroll']
  const currentIndex = modes.indexOf(displayMode.value)
  displayMode.value = modes[(currentIndex + 1) % modes.length]
}

const handleClickOutside = (event) => {
  if (multiSelectRef.value && !multiSelectRef.value.contains(event.target)) {
    isOpen.value = false
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
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #8b5cf6;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #7c3aed;
}
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
