<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('statusColor') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('statusColorDescription') }}
        </p>
      </div>

      <!-- Status Color Configuration -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ t('roomStatusColors') }}</h3>

        <div class="space-y-4">
          <div v-for="status in roomStatuses" :key="status.key"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex items-center space-x-4">
              <!-- Color Preview -->
              <div
                class="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer transition-transform hover:scale-110"
                :style="{ backgroundColor: status.color }" @click="openColorPicker(status)"
                :title="t('clickToChangeColorFor', { status: t(`${status.name}`) })"></div>

              <!-- Status Info -->
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ t(`${status.name}`) }}</h4>
                <p class="text-xs text-gray-500">{{ t(`${status.name}`) }}</p>
              </div>
            </div>

            <!-- Color Code Display -->
            <div class="flex items-center space-x-3">
              <span class="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{{ status.color }}</span>
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
             :disabled=" isLoading"
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
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ t('selectColorFor', { status: t(`roomStatus.${selectedStatus?.name}`) }) }}
          </h3>

          <!-- Color Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Color Code
            </label>
            <div class="flex items-center space-x-3">
              <input 
                v-model="tempColor" 
                type="color" 
                class="w-12 h-10 border border-gray-300 rounded cursor-pointer focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
              >
              <input 
                v-model="tempColor" 
                type="text"
                class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-hidden focus:border-purple-500 focus:ring-3 focus:ring-purple-500/10"
                placeholder="#000000"
              >
            </div>
          </div>

          <!-- Predefined Colors -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Quick Colors
            </label>
            <div class="grid grid-cols-8 gap-2">
              <div v-for="color in predefinedColors" :key="color"
                class="w-8 h-8 rounded cursor-pointer border-2 transition-transform hover:scale-110 focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                :class="tempColor === color ? 'border-gray-800' : 'border-gray-300'" 
                :style="{ backgroundColor: color }"
                @click="tempColor = color"
                tabindex="0"
                @keydown.enter="tempColor = color"
                @keydown.space="tempColor = color"
              ></div>
            </div>
          </div>

          <!-- Preview -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/10">
              <div class="w-6 h-6 rounded-full" :style="{ backgroundColor: tempColor }"></div>
              <span class="text-sm text-gray-900">{{ selectedStatus?.name }}</span>
              <span class="text-xs text-gray-500 font-mono">{{ tempColor }}</span>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
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
import { onMounted, ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { Palette, Save } from 'lucide-vue-next'
import { useServiceStore } from '../../../composables/serviceStore'
import { updateStatusColors } from '../../../services/hotelApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const showColorPicker = ref(false)
const selectedStatus = ref(null)
const tempColor = ref('#000000')
const originalRoomStatuses = ref([])
const isLoading = ref(false)

// Room statuses with default colors
const roomStatuses = ref([
  {
    key: 'confirmed_reservation',
    name: 'Confirmed Reservation / Day Use Reservation',
    description: 'Rooms with confirmed bookings or day use reservations',
    color: '#10B981' // Green
  },
  {
    key: 'arrival_stay_over',
    name: 'Arrival / Stay Over',
    description: 'Guests arriving today or continuing their stay',
    color: '#3B82F6' // Blue
  },
  {
    key: 'due_out',
    name: 'Due Out',
    description: 'Guests scheduled to check out today',
    color: '#F59E0B' // Amber
  },
  {
    key: 'checked_out',
    name: 'Checked Out',
    description: 'Rooms where guests have completed checkout',
    color: '#6B7280' // Gray
  },
  {
    key: 'maintenance_block',
    name: 'Maintenance Block',
    description: 'Rooms blocked for maintenance or repairs',
    color: '#EF4444' // Red
  },
  {
    key: 'day_use',
    name: 'Day Use',
    description: 'Rooms reserved for day use only',
    color: '#8B5CF6' // Purple
  },
  {
    key: 'out_of_order',
    name: 'Out of Order',
    description: 'Rooms temporarily unavailable due to issues',
    color: '#DC2626' // Dark Red
  }
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
const isChange = ref(false);

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
    const index = roomStatuses.value.findIndex(status => status.key === selectedStatus.value.key)
    if (index !== -1) {
      roomStatuses.value[index] = {
        ...roomStatuses.value[index],
        color: tempColor.value
      }
    }
  }
  isChange.value = true;
  closeColorPicker()
}

const resetToDefaults = () => {
    roomStatuses.value = [
      {
        key: 'confirmed_reservation',
        name: 'Confirmed Reservation / Day Use Reservation',
        description: 'Rooms with confirmed bookings or day use reservations',
        color: '#10B981'
      },
      {
        key: 'arrival_stay_over',
        name: 'Arrival / Stay Over',
        description: 'Guests arriving today or continuing their stay',
        color: '#3B82F6'
      },
      {
        key: 'due_out',
        name: 'Due Out',
        description: 'Guests scheduled to check out today',
        color: '#F59E0B'
      },
      {
        key: 'checked_out',
        name: 'Checked Out',
        description: 'Rooms where guests have completed checkout',
        color: '#6B7280'
      },
      {
        key: 'maintenance_block',
        name: 'Maintenance Block',
        description: 'Rooms blocked for maintenance or repairs',
        color: '#EF4444'
      },
      {
        key: 'day_use',
        name: 'Day Use',
        description: 'Rooms reserved for day use only',
        color: '#8B5CF6'
      },
      {
        key: 'out_of_order',
        name: 'Out of Order',
        description: 'Rooms temporarily unavailable due to issues',
        color: '#DC2626'
      }
    ]
}

const saveStatusColors = async () => {
  if (!isChange.value) {
    toast.warning(t('noChangesToSave'))
    return
  }
  
  isLoading.value = true
  try {
    const resp = await updateStatusColors(serviceStore.serviceId, {statusColors:roomStatuses.value})
    console.log('reservation color',resp)
    if (resp.status === 200) {
      // Update original colors to reflect saved state
      originalRoomStatuses.value = JSON.parse(JSON.stringify(roomStatuses.value))
      toast.success(t('statusColorsUpdatedSuccess'))
      isChange.value =false
    }
  } catch (error) {
    console.error('Error saving status colors:', error)
    toast.error(t('errorSavingStatusColors'))
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  if (serviceStore.currentService && serviceStore.currentService.statusColors) {
    roomStatuses.value = serviceStore.currentService.statusColors
    // Store original colors for change detection
    originalRoomStatuses.value = JSON.parse(JSON.stringify(serviceStore.currentService.statusColors))
  }
})
</script>