<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cities } from '@/assets/data/cities'

const props = defineProps({
  lb: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  isRequired: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  customClass: { type: String, default: '' },
  id: { type: String, default: '' },
  forLabel: { type: String, default: '' },
  country: { type: String, default: '' }, // ISO 2-letter code; filters cities
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', city: any): void
  (e: 'change', value: string): void
}>()

const searchQuery = ref<string>(props.modelValue || '')
const showDropdown = ref<boolean>(false)

const normalizedCountry = computed(() => (props.country || '').trim().toLowerCase())

const filteredByCountry = computed(() => {
  if (!normalizedCountry.value) return cities
  return cities.filter((c: any) => (c.country || '').toLowerCase() === normalizedCountry.value)
})

const filteredCities = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return filteredByCountry.value.slice(0, 50)
  return filteredByCountry.value
    .filter((c: any) => (c.name || '').toLowerCase().includes(q) || (c.subcountry || '').toLowerCase().includes(q))
    .slice(0, 50)
})

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  searchQuery.value = input.value
  emit('update:modelValue', input.value)
  emit('change', input.value)
}

const handleFocus = () => {
  if (props.disabled) return
  showDropdown.value = true
}

const handleBlur = () => {
  // Delay closing to allow click on dropdown item
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

const selectCity = (city: any) => {
  searchQuery.value = city.name
  emit('update:modelValue', city.name)
  emit('select', city)
  showDropdown.value = false
}

watch(
  () => props.modelValue,
  (val) => {
    if (typeof val === 'string') {
      searchQuery.value = val
    }
  }
)

watch(normalizedCountry, () => {
  // Reset query when country changes to guide user
  if (props.country) {
    searchQuery.value = ''
  }
})

onMounted(() => {
  // Ensure dropdown is closed on mount
  showDropdown.value = false
})
</script>

<template>
  <div class="relative">
    <label
      v-if="lb"
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :for="id || forLabel"
    >
      {{ lb }}
    </label>

    <input
      type="text"
      :id="id"
      :required="isRequired"
      :disabled="disabled"
      :value="searchQuery"
      :placeholder="placeholder || 'Search city'"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :class="[
        'h-11 w-full rounded-lg border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500',
        customClass,
      ]"
    />

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-black/50 z-50 max-h-60 overflow-y-auto"
    >
      <div v-if="filteredCities.length === 0" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        No city found
      </div>
      <button
        v-for="(city,index) in filteredCities"
        :key="index"
        type="button"
        @mousedown.prevent="selectCity(city)"
        class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span class="font-medium">{{ city.name }}</span>
        <span v-if="city.subcountry" class="text-xs text-gray-500 dark:text-gray-400"> — {{ city.subcountry }}</span>
      </button>
    </div>

    <!-- Click outside overlay to close -->
    <div v-if="showDropdown" @click="showDropdown = false" class="fixed inset-0 z-30"></div>
  </div>
</template>

<style scoped>
</style>