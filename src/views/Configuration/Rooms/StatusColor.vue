<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Status Color</h1>
        <p class="text-gray-600 mt-1">
          Set the color to different status of the room for easy viewing and understanding of the room status at a glance in the "Stay View" screen of the Front Desk login. You can set the color code for 7 room status defined. Simply click on the color block opposite to each status to select the color from the color palette. Save the changes to confirm. You can change the status color any time in future by coming to the same screen.
        </p>
      </div>

      <!-- Status Color Configuration -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Room Status Colors</h3>
        
        <div class="space-y-4">
          <div v-for="status in roomStatuses" :key="status.key" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex items-center space-x-4">
              <!-- Color Preview -->
              <div 
                class="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer transition-transform hover:scale-110"
                :style="{ backgroundColor: status.color }"
                @click="openColorPicker(status)"
                :title="`Click to change color for ${status.name}`"
              ></div>
              
              <!-- Status Info -->
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ status.name }}</h4>
                <p class="text-xs text-gray-500">{{ status.description }}</p>
              </div>
            </div>
            
            <!-- Color Code Display -->
            <div class="flex items-center space-x-3">
              <span class="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{{ status.color }}</span>
              <BasicButton 
                @click="openColorPicker(status)"
                label="Change Color"
                :icon="Palette"
              />
            </div>
          </div>
        </div>
        
        <!-- Save Button -->
        <div class="mt-8 flex justify-end space-x-3">
          <BasicButton 
            @click="resetToDefaults"
            label="Reset to Defaults"
          >
          </BasicButton>
          <BasicButton 
            @click="saveStatusColors"
            label="Save Changes"
            :icon="Save"
          >
          </BasicButton>
        </div>
      </div>

      <!-- Color Picker Modal -->
      <div v-if="showColorPicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            Select Color for {{ selectedStatus?.name }}
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
                class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              >
              <input 
                v-model="tempColor"
                type="text" 
                class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div 
                v-for="color in predefinedColors" 
                :key="color"
                class="w-8 h-8 rounded cursor-pointer border-2 transition-transform hover:scale-110"
                :class="tempColor === color ? 'border-gray-800' : 'border-gray-300'"
                :style="{ backgroundColor: color }"
                @click="tempColor = color"
              ></div>
            </div>
          </div>
          
          <!-- Preview -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div 
                class="w-6 h-6 rounded-full"
                :style="{ backgroundColor: tempColor }"
              ></div>
              <span class="text-sm text-gray-900">{{ selectedStatus?.name }}</span>
              <span class="text-xs text-gray-500 font-mono">{{ tempColor }}</span>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeColorPicker"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              @click="applyColor"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Color
            </button>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { Palette, Save } from 'lucide-vue-next'

// Reactive data
const showColorPicker = ref(false)
const selectedStatus = ref(null)
const tempColor = ref('#000000')

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
    selectedStatus.value.color = tempColor.value
  }
  closeColorPicker()
}

const resetToDefaults = () => {
  if (confirm('Are you sure you want to reset all colors to their default values?')) {
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
}

const saveStatusColors = () => {
  // Here you would typically save to your backend/API
  console.log('Saving status colors:', roomStatuses.value)
  
  // Show success message
  alert('Status colors have been saved successfully!')
}
</script>
