<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('housekeepingStatus') }}</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">
          Define all the housekeeping status for the rooms from here. You can assign colors to each status for easy identification.
        </p>
      </div>

      <!-- Housekeeping Status Configuration -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">{{ t('housekeepingStatusColors') }}</h3>

        <div class="space-y-4">
          <div v-for="status in housekeepingStatuses" :key="status.key"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-center space-x-4">
              <!-- Color Preview -->
              <div
                class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer transition-transform hover:scale-110"
                :style="{ backgroundColor: status.color }" @click="openColorPicker(status)"
                :title="t('clickToChangeColorFor', { status: status.name })"></div>

              <!-- Status Info -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ status.name }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ status.description }}</p>
              </div>
            </div>

            <!-- Color Code Display -->
            <div class="flex items-center space-x-3">
              <span class="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ status.color }}</span>
              <BasicButton @click="openColorPicker(status)" :label="t('changeColor')" :icon="Palette" />
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="mt-8 flex justify-end space-x-3">
          <BasicButton @click="resetToDefaults" :label="t('resetToDefaults')">
          </BasicButton>
          <BasicButton 
             @click="saveStatusColors" 
             :disabled="!hasChanges || isLoading"
             :label="isLoading ? t('saving') : t('saveChanges')" 
             :icon="Save"
             class="disabled:bg-gray-400 disabled:cursor-not-allowed"
           >
             <template v-if="isLoading" #icon>
               <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
             </template>
           </BasicButton>
        </div>
      </div>

      <!-- Color Picker Modal -->
      <div v-if="showColorPicker" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('selectColorFor', { status: selectedStatus?.name }) }}
          </h3>

          <!-- Color Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Code
            </label>
            <div class="flex items-center space-x-3">
              <input v-model="tempColor" type="color" class="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
              <input v-model="tempColor" type="text"
                class="flex-1 border border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#000000">
            </div>
          </div>

          <!-- Predefined Colors -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Colors
            </label>
            <div class="grid grid-cols-8 gap-2">
              <div v-for="color in predefinedColors" :key="color"
                class="w-8 h-8 rounded cursor-pointer border-2 transition-transform hover:scale-110 dark:border-gray-600"
                :class="tempColor === color ? 'border-gray-800' : 'border-gray-300'" :style="{ backgroundColor: color }"
                @click="tempColor = color"></div>
            </div>
          </div>

          <!-- Preview -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </label>
            <div class="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
               <span class="text-sm text-gray-900 dark:text-white">{{ selectedStatus?.name }}</span>
               <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ tempColor }}</span>
             </div>
           </div>

           <div class="flex justify-end space-x-3 mt-6">
            <BasicButton 
              type="button" 
              variant="outline" 
              @click="closeColorPicker" 
              :label="t('cancel')"
            />
            <BasicButton 
              type="button" 
              variant="primary" 
              @click="applyColor"
              :label="t('applyColor')"
            />
          </div>
         </div>
       </div>
     </div>
   </ConfigurationLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { Palette, Save } from 'lucide-vue-next'
import { useServiceStore } from '../../../composables/serviceStore'
import { updateHotelHousekeepingStatusColors } from '../../../services/hotelApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const showColorPicker = ref(false)
const selectedStatus = ref(null)
const tempColor = ref('#000000')
const originalHousekeepingStatuses = ref([])
const isLoading = ref(false)

// Housekeeping statuses with default colors
const housekeepingStatuses = ref([
  {
    key: 'clean',
    name: 'Clean',
    description: 'Room is clean and ready for occupancy',
    color: '#10B981' // Green
  },
  {
    key: 'dirty',
    name: 'Dirty',
    description: 'Room needs cleaning after guest checkout',
    color: '#EF4444' // Red
  },
  {
    key: 'out_of_order',
    name: 'Out of Order',
    description: 'Room is temporarily unavailable due to issues',
    color: '#F59E0B' // Amber
  },
  {
    key: 'maintenance',
    name: 'Maintenance',
    description: 'Room is under maintenance or repair',
    color: '#8B5CF6' // Purple
  },
 /** {
    key: 'inspected',
    name: 'Inspected',
    description: 'Room has been cleaned and inspected',
    color: '#3B82F6' // Blue
  },
  {
    key: 'vacant_dirty',
    name: 'Vacant Dirty',
    description: 'Room is vacant but needs cleaning',
    color: '#DC2626' // Dark Red
  },
  {
    key: 'vacant_clean',
    name: 'Vacant Clean',
    description: 'Room is vacant and clean, ready for next guest',
    color: '#059669' // Dark Green
  } */
])

// Predefined color palette
const predefinedColors = ref([
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#6B7280', '#DC2626',
  '#D97706', '#059669', '#2563EB', '#7C3AED',
  '#DB2777', '#374151', '#991B1B', '#92400E',
  '#047857', '#1D4ED8', '#6D28D9', '#BE185D'
])
const serviceStore = useServiceStore()

// Computed property to check if colors have changed
const hasChanges = ref(false)

// Methods
const openColorPicker = (status) => {
  selectedStatus.value = status
  tempColor.value = status.color
  showColorPicker.value = true
}

const closeColorPicker = () => {
  showColorPicker.value = false
  selectedStatus.value = null
  tempColor.value = '#000000'
}

const applyColor = () => {
  if (selectedStatus.value) {
    // Find the index of the status in the array and update it to ensure reactivity
    const index = housekeepingStatuses.value.findIndex(status => status.key === selectedStatus.value.key)
    if (index !== -1) {
      housekeepingStatuses.value[index] = {
        ...housekeepingStatuses.value[index],
        color: tempColor.value
      }
    }
  }
  hasChanges.value = true
  closeColorPicker()
}

const resetToDefaults = () => {
  if (confirm('Are you sure you want to reset all colors to their default values?')) {
    housekeepingStatuses.value = [
      {
        key: 'clean',
        name: 'Clean',
        description: 'Room is clean and ready for occupancy',
        color: '#10B981'
      },
      {
        key: 'dirty',
        name: 'Dirty',
        description: 'Room needs cleaning after guest checkout',
        color: '#EF4444'
      },
      {
        key: 'out_of_order',
        name: 'Out of Order',
        description: 'Room is temporarily unavailable due to issues',
        color: '#F59E0B'
      },
      {
        key: 'maintenance',
        name: 'Maintenance',
        description: 'Room is under maintenance or repair',
        color: '#8B5CF6'
      },
      {
        key: 'inspected',
        name: 'Inspected',
        description: 'Room has been cleaned and inspected',
        color: '#3B82F6'
      },
      {
        key: 'vacant_dirty',
        name: 'Vacant Dirty',
        description: 'Room is vacant but needs cleaning',
        color: '#DC2626'
      },
      {
        key: 'vacant_clean',
        name: 'Vacant Clean',
        description: 'Room is vacant and clean, ready for next guest',
        color: '#059669'
      }
    ]
    hasChanges.value = true
  }
}

const saveStatusColors = async () => {
  if (!hasChanges.value) {
    toast.warning(t('noChangesToSave'))
    return
  }
  
  isLoading.value = true
  try {
    const resp = await updateHotelHousekeepingStatusColors(serviceStore.serviceId, { statusColors: housekeepingStatuses.value })
    console.log('housekeeping status colors', resp)
    if (resp.status === 200) {
      // Update original colors to reflect saved state
      originalHousekeepingStatuses.value = JSON.parse(JSON.stringify(housekeepingStatuses.value))
      toast.success(t('housekeepingStatusColorsUpdatedSuccess'))
      hasChanges.value = false
    }
  } catch (error) {
    console.error('Error saving housekeeping status colors:', error)
    toast.error(t('errorSavingHousekeepingStatusColors'))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (serviceStore.currentService && serviceStore.currentService.housekeepingStatusColors) {
    housekeepingStatuses.value = serviceStore.currentService.housekeepingStatusColors
    // Store original colors for change detection
    originalHousekeepingStatuses.value = JSON.parse(JSON.stringify(serviceStore.currentService.housekeepingStatusColors))
  }
})
</script>
