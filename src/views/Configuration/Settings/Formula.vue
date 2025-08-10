<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Formula</h1>
          <p class="text-gray-600 mt-1">
            This screen allows you to view the formula and modify it based on your requirements.
          </p>
        </div>
        <BasicButton variant="primary" icon="Save" label="Save Changes" @click="saveFormula" />
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 space-y-8">
          <!-- Total Room Revenue -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Total Room Revenue</h3>
            <p class="text-sm text-gray-600 mb-4">
              Select which revenue components to include in the Total Room Revenue calculation:
            </p>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.nightSoldRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-3 text-sm text-gray-700">Night Sold Revenue</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.dayUseRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-3 text-sm text-gray-700">Day Use Revenue</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.lateCheckoutRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-3 text-sm text-gray-700">Late Checkout Revenue</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.cancellationRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-3 text-sm text-gray-700">Cancellation Revenue</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.noShowRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-3 text-sm text-gray-700">No Show Revenue</span>
              </label>
            </div>
            
            <div class="mt-4 p-3 bg-gray-50 rounded-md">
              <p class="text-sm font-medium text-gray-700">Current Formula:</p>
              <p class="text-sm text-gray-600 mt-1">{{ totalRoomRevenueFormula }}</p>
            </div>
          </div>
          
          <!-- Total Room Sold -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Total Room Sold</h3>
            <div class="p-3 bg-gray-50 rounded-md">
              <p class="text-sm font-medium text-gray-700">Formula:</p>
              <p class="text-sm text-gray-600 mt-1">Total Rooms Sold = Total Occupied Rooms</p>
            </div>
          </div>
          
          <!-- Total Rooms -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Total Rooms</h3>
            <div class="flex items-center mb-4">
              <label class="flex items-center">
                <input
                  v-model="formula.totalRooms.includeOutOfOrder"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-3 text-sm text-gray-700">Include Out of Order rooms in total rooms</span>
              </label>
            </div>
            <div class="p-3 bg-gray-50 rounded-md">
              <p class="text-sm font-medium text-gray-700">Current Formula:</p>
              <p class="text-sm text-gray-600 mt-1">{{ totalRoomsFormula }}</p>
            </div>
          </div>
          
          <!-- Average Daily Rate (ADR) -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Average Daily Rate (ADR)</h3>
            <div class="p-3 bg-gray-50 rounded-md">
              <p class="text-sm font-medium text-gray-700">Formula:</p>
              <p class="text-sm text-gray-600 mt-1">ADR = Total Room Revenue / Total Rooms Sold</p>
            </div>
          </div>
          
          <!-- Occupancy % -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Occupancy %</h3>
            <div class="p-3 bg-gray-50 rounded-md">
              <p class="text-sm font-medium text-gray-700">Formula:</p>
              <p class="text-sm text-gray-600 mt-1">Occupancy % = (Total Room Sold × 100) / Total Rooms</p>
            </div>
          </div>
          
          <!-- Revenue Per Available Room (RevPAR) -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Per Available Room (RevPAR)</h3>
            <div class="p-3 bg-gray-50 rounded-md">
              <p class="text-sm font-medium text-gray-700">Formula:</p>
              <p class="text-sm text-gray-600 mt-1">RevPAR = Total Room Revenue / Total Rooms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'

const formula = ref({
  totalRoomRevenue: {
    nightSoldRevenue: true,
    dayUseRevenue: true,
    lateCheckoutRevenue: false,
    cancellationRevenue: false,
    noShowRevenue: false
  },
  totalRooms: {
    includeOutOfOrder: false
  }
})

const totalRoomRevenueFormula = computed(() => {
  const components = []
  if (formula.value.totalRoomRevenue.nightSoldRevenue) components.push('Night Sold Revenue')
  if (formula.value.totalRoomRevenue.dayUseRevenue) components.push('Day Use Revenue')
  if (formula.value.totalRoomRevenue.lateCheckoutRevenue) components.push('Late Checkout Revenue')
  if (formula.value.totalRoomRevenue.cancellationRevenue) components.push('Cancellation Revenue')
  if (formula.value.totalRoomRevenue.noShowRevenue) components.push('No Show Revenue')
  
  if (components.length === 0) return 'No revenue components selected'
  if (components.length === 1) return `Total Room Revenue = ${components[0]}`
  
  return `Total Room Revenue = ${components.join(' + ')}`
})

const totalRoomsFormula = computed(() => {
  if (formula.value.totalRooms.includeOutOfOrder) {
    return 'Total Rooms = Available Rooms + Out of Order Rooms'
  }
  return 'Total Rooms = Available Rooms'
})

const saveFormula = () => {
  // TODO: Implement save functionality
  console.log('Save formula configuration:', formula.value)
  alert('Formula configuration saved successfully!')
}
</script>
