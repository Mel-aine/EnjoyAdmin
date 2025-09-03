<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Apply Discount Room Charge Demo</h1>
      
      <!-- Demo Controls -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Demo Controls</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Reservation ID</label>
            <input 
              v-model="demoReservationId" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reservation ID"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Reservation Number</label>
            <input 
              v-model="demoReservationNumber" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reservation number"
            />
          </div>
          <div class="flex items-end">
            <button 
              @click="openModal" 
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Open Apply Discount Modal
            </button>
          </div>
        </div>
      </div>

      <!-- Component Features -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Component Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <h3 class="font-medium text-gray-700">Discount Rules:</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                All Nights - Apply discount to all nights
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                First Night - Apply discount to first night only
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Last Night - Apply discount to last night only
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Select Nights - Choose specific nights
              </li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-medium text-gray-700">Application Options:</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                All Rooms - Apply to all rooms in reservation
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                Selected Transactions - Choose specific transactions (Group reservations)
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Audited Date Support - Handles audited vs non-audited dates
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Loading Skeleton - Smooth loading experience
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Event Log -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Event Log</h2>
        <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-60 overflow-y-auto">
          <div v-if="eventLog.length === 0" class="text-gray-500">
            No events yet. Open the modal and interact with it to see events.
          </div>
          <div v-for="(event, index) in eventLog" :key="index" class="mb-1">
            <span class="text-gray-500">[{{ event.timestamp }}]</span>
            <span class="text-yellow-400">{{ event.type }}:</span>
            <span class="text-green-400">{{ event.message }}</span>
            <div v-if="event.data" class="ml-4 text-blue-400">
              {{ JSON.stringify(event.data, null, 2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Instructions -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-medium text-blue-800 mb-2">Usage Instructions:</h3>
        <ol class="list-decimal list-inside space-y-1 text-sm text-blue-700">
          <li>Enter a reservation ID and number (or use defaults)</li>
          <li>Click "Open Apply Discount Modal" to launch the component</li>
          <li>Select a discount from the dropdown (uses InputDiscountSelect component)</li>
          <li>Choose a discount rule (All Nights, First Night, Last Night, or Select Nights)</li>
          <li>If "Select Nights" is chosen, select specific nights from the list</li>
          <li>Choose application scope (All Rooms or Selected Transactions for group reservations)</li>
          <li>If "Selected Transactions" is chosen, select specific transactions</li>
          <li>Add optional notes and click "Apply Discount"</li>
          <li>Check the event log to see the emitted data</li>
        </ol>
      </div>
    </div>

    <!-- Apply Discount Modal -->
    <ApplyDiscountRoomCharge 
      :is-open="isModalOpen" 
      :reservation-id="demoReservationId"
      :reservation-number="demoReservationNumber"
      @close="closeModal" 
      @discount-applied="handleDiscountApplied" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApplyDiscountRoomCharge from '../reservations/foglio/ApplyDiscountRoomCharge.vue'

interface EventLogEntry {
  timestamp: string
  type: string
  message: string
  data?: any
}

const isModalOpen = ref(false)
const demoReservationId = ref(123)
const demoReservationNumber = ref('RES-2024-001')
const eventLog = ref<EventLogEntry[]>([])

const addToEventLog = (type: string, message: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.value.unshift({
    timestamp,
    type,
    message,
    data
  })
  
  // Keep only last 20 events
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20)
  }
}

const openModal = () => {
  isModalOpen.value = true
  addToEventLog('MODAL', 'Apply Discount modal opened', {
    reservationId: demoReservationId.value,
    reservationNumber: demoReservationNumber.value
  })
}

const closeModal = () => {
  isModalOpen.value = false
  addToEventLog('MODAL', 'Apply Discount modal closed')
}

const handleDiscountApplied = (discountData: any) => {
  addToEventLog('DISCOUNT', 'Discount applied successfully', discountData)
  
  // Simulate API success response
  setTimeout(() => {
    addToEventLog('API', 'Discount application confirmed by server', {
      status: 'success',
      discountId: discountData.discountId,
      appliedAmount: discountData.discountAmount || 'calculated'
    })
  }, 1000)
}
</script>

<style scoped>
/* Custom scrollbar for event log */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #4ade80 #1f2937;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1f2937;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4ade80;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #22c55e;
}
</style>