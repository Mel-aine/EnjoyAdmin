<template>
  <div class="relative">
    <label class="block text-sm font-medium text-gray-700 mb-1.5">
      {{ $t('Transportation Mode') }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <Select  v-model="selectedValue"
        @change="handleSelect" :disabled="isLoading" :is-Loading="isLoading" :placeholder="$t('Select transportation mode')" :options="transportationModes"
        />
      <!-- <select
        v-model="selectedValue"
        @change="handleSelect"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :disabled="isLoading"
      >
        <option value="">{{ isLoading ? 'Loading...' : 'Select transportation mode' }}</option>
        <option v-for="mode in transportationModes"
                :key="mode.id"
                :value="mode.id">
          {{ mode.name }}
          <span v-if="mode.description"> - {{ mode.description }}</span>
        </option>
      </select> -->

      <!-- Mode type indicator -->
      <div v-if="selectedMode" class="mt-1">
        <span v-if="selectedMode.isInternal"
              class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
          {{ $t('Internal Service') }}
        </span>
        <span v-if="selectedMode.isExternal"
              class="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
          {{ $t('External Service') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { getTransportationModes } from '@/services/configrationApi'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import Select from './Select.vue'

interface Props {
  modelValue: number | null
  isRequired?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'select', mode: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const toast = useToast()
const serviceStore = useServiceStore()
const transportationModes = ref<any[]>([])
const selectedValue = ref<any>(null)
const isLoading = ref(false)

// Computed selected mode
const selectedMode = computed(() => {
  return transportationModes.value.find(mode => mode.id === selectedValue.value || null )
})

// Fetch transportation modes
const fetchTransportationModes = async () => {
  try {
    const hotelId = serviceStore.serviceId
    isLoading.value = true
    const response = await getTransportationModes(hotelId!)
    console.log("fetchTransportationModes",response.data.data.data)
    transportationModes.value = response.data.data.data.map((m:any)=>{
      return {
        ...m,
      label: m.name + ' - ' + m.description,
      value : m.id
      }

    })
  } catch (error) {
    console.error('Error fetching transportation modes:', error)
    toast.error('Failed to fetch transportation modes')
    transportationModes.value = []
  } finally {
    isLoading.value = false
  }
}

// Handle selection
const handleSelect = () => {
  const modeId = selectedValue.value ? selectedValue.value : null
  const mode = transportationModes.value.find(m => m.id === modeId)

  emit('update:modelValue', modeId)
  if (mode) {
    emit('select', mode)
  }
}

// Watch external value changes
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue ? newValue : null
})

// Fetch modes on mount
onMounted(() => {
  fetchTransportationModes()
})
</script>
