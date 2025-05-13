
<script setup lang="ts">
  import { ref, defineEmits, watch,defineProps } from 'vue'
  import { onClickOutside } from '@vueuse/core'

  const props = defineProps({
  items: {
    type: Array as () => any[],
    required: true
  },
  modelValue: {
    type: Object as () => any | null,
    default: null
  },
  resetTrigger: Boolean,
  label: String,
  placeholder: String,
  customClasses: String,
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

// State variables
const query = ref('')
const filteredData = ref<any[]>([])
const dropdownOpen = ref(false)
const target = ref(null)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    filterData()
  }
}

const filterData = () => {
  if (query.value.trim()) {
    filteredData.value = props.items.filter(item =>
      item.name.toLowerCase().includes(query.value.toLowerCase())
    )
  } else {
    filteredData.value = props.items
  }
}

const selectItem = (item: any) => {
  query.value = item.name
  emit('update:modelValue', item)
  dropdownOpen.value = false
}

onClickOutside(target, () => {
  dropdownOpen.value = false
})

// Re-sync if modelValue changes externally (including reset)
watch(() => props.modelValue, (newVal) => {
  query.value = newVal?.name || ''
  filteredData.value = props.items ?? []
})

// Handle external reset trigger if used
watch(() => props.resetTrigger, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    emit('update:modelValue', null)
    query.value = ''
    filteredData.value = props.items ?? []
  }
})
</script>

<template>
  <div :class="customClasses" ref="target">
    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" v-if="label">
      {{ label }}
      <span v-if="required" class="text-meta-1">*</span>
    </label>

    <div class="flex">
      <div class="relative w-full">
        <!-- Input Field -->
        <input
          type="text"
          v-model="query"
          @input="filterData"
          @click="toggleDropdown"
          :placeholder="placeholder"
          :required="required"
          class=" dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
        />

        <!-- Dropdown List -->
        <ul v-show="dropdownOpen" class="custom-scrollbar overflow-y-auto max-h-50 absolute z-10 bg-white divide-y divide-slate-100 rounded-lg shadow w-full drop-shadow-lg">
          <li
            v-for="(item, index) in filteredData"
            :key="index"
            class="p-2 cursor-pointer hover:bg-slate-100"
            @click="selectItem(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <slot name="action"></slot>
    </div>
  </div>
</template>

<style scoped>
.relative {
  position: relative;
}
.cursor-not-allowed {
  cursor: not-allowed;
}

.text {
  background-color: #f3f4f6;
  /* Fond grisé */
}

.opacity-50 {
  opacity: 0.5;
}

.custom-scrollbar {
  scrollbar-width: thin;
  /* Pour Firefox */
  scrollbar-color: #9c34ac90 #e5e7eb;
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
