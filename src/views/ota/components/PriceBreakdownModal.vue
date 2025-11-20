<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        @click.self="closeModal"
      >
        <div
          class="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-xl shadow-2xl transition-transform duration-300 overflow-hidden"
          @click.stop
        >
          <div class="sticky top-0 z-10 bg-blue-600/90 text-white px-6 py-2 flex items-center justify-between shadow-md">
            <h2 class="text-xl font-bold tracking-tight  flex-1">Price Breakdown / Details (Prices are in XAF)</h2>
            <button
              @click="closeModal"
              class="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 flex-shrink-0"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto max-h-[600px] custom-scrollbar">
            <div class="overflow-x-auto">
              <table class="w-full divide-y divide-gray-300 text-sm">

                <thead class="bg-blue-100/50 whitespace-nowrap">
                  <tr class="h-12 ">
                    <th class="px-4 text-center font-bold text-gray-700">Rate Plan</th>
                    <th class="px-4 text-center font-bold text-gray-700 w-1/3">Adult</th>
                    <th class="px-4 text-center font-bold text-gray-700">Child</th>
                    <th class="px-4 text-center font-bold text-gray-700">Night</th>
                    <th class="px-4 text-center font-bold text-gray-700">Room Rate</th>
                    <th class="px-4 text-center font-bold text-gray-700">Extra Adult</th>
                    <th class="px-4 text-center font-bold text-gray-700">Extra Child</th>
                    <th class="px-4 text-center font-bold text-gray-700">Total</th>
                  </tr>
                </thead>

                <tbody class="bg-white divide-y divide-gray-200">
                  <template v-for="(item, index) in bookingData?.items || []" :key="index">
                    <!-- Room Group Header -->
                    <tr v-if="index === 0 || item.planName !== bookingData.items[index-1].planName">
                      <td colspan="8" class="px-4 py-3 text-md font-semibold text-blue-700 bg-gray-50 border-t border-gray-300">
                        {{ item.roomName }} - {{ item.planName }}
                      </td>
                    </tr>

                    <!-- Room Details -->
                    <tr class="hover:bg-gray-50/50">
                      <td class="px-4 py-3 whitespace-nowrap text-center text-gray-900 font-medium">
                        Room  {{ index + 1 }}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-center text-gray-900">{{ item.adults }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-center text-gray-900">{{ item.children }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-center text-gray-900">{{ nights }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-center text-gray-700">{{ item.planPrice }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-center text-gray-700">{{ item.extraAdultCost || 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-center text-gray-700">{{ item.extraChildCost || 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-center font-bold text-gray-900">
                        {{ calculateRoomTotal(item) }}
                      </td>
                    </tr>

                    <!-- Taxes & Fees -->
                    <tr>
                      <td colspan="6"></td>
                      <td class="px-4 py-2 text-center text-sm whitespace-nowrap font-semibold text-gray-600 border-l border-gray-200">Taxes & Fees</td>
                      <td class="px-4 py-2 text-center text-sm font-normal text-gray-700">{{ item.taxesAmount }}</td>
                    </tr>

                    <!-- Round Off -->
                    <tr>
                      <td colspan="6"></td>
                      <td class="px-4 py-2 text-center text-sm font-semibold text-gray-600 border-l border-gray-200">Round Off</td>
                      <td class="px-4 py-2 text-center text-sm font-normal text-gray-700">{{ item.roundOff || 0 }}</td>
                    </tr>
                  </template>
                </tbody>

                <tfoot class="bg-orange-100 border-t-2 border-gray-300 text-sm font-semibold">
                  <tr class="border-b border-gray-300">
                    <td colspan="6"></td>
                    <td class="px-4 py-3 text-center text-gray-600 border-l whitespace-nowrap border-gray-200">Total Room Charges</td>
                    <td class="px-4 py-3 text-center font-normal text-gray-700">{{ totalRoomCharges }}</td>
                  </tr>

                  <tr class="border-b border-gray-300">
                    <td colspan="6"></td>
                    <td class="px-4 py-3 text-center text-gray-600 border-l whitespace-nowrap border-gray-200">Total Taxes(Inc)</td>
                    <td class="px-4 py-3 text-center font-normal text-gray-700">{{ taxCalculation.total }}</td>
                  </tr>

                  <tr class="border-b border-gray-300">
                    <td colspan="6"></td>
                    <td class="px-4 py-3 text-center text-gray-600 border-l whitespace-nowrap border-gray-200">Extra Charges (Inc. Of Taxes)</td>
                    <td class="px-4 py-3 text-center font-normal text-gray-700">{{ totalExtracharge || 0 }}</td>
                  </tr>

                  <tr class="border-b border-gray-300">
                    <td colspan="6"></td>
                    <td class="px-4 py-3 text-center text-gray-600 border-l border-gray-200">Total</td>
                    <td class="px-4 py-3 text-center font-normal text-gray-700">{{ finalTotal }}</td>
                  </tr>
                </tfoot>

              </table>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  bookingData?: any
  nights?: number
  totalRoomCharges?: number
  totalExtracharge? : number
  taxCalculation?: any
  discount?: number
  finalTotal?: number
  formatCurrency: (amount: number) => string
  formatTaxLabel: (tax: any) => string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}

// Close on Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Add/remove event listener
import { watch } from 'vue'

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})

function calculateRoomTotal(item) {
  const basePrice = item.planPrice
  const extraAdultCost = item.extraAdultsCount * parseFloat(item.extraAdultRate)
  const extraChildCost = item.extraChildrenCount * parseFloat(item.extraChildRate)

  return basePrice + extraAdultCost + extraChildCost
}

</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(-20px);
}
</style>
