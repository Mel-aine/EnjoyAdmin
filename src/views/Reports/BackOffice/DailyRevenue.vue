<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Daily Revenue
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and analyze daily revenue data for your hotel
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- As On Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              As On Date
            </label>
            <InputDatepicker 
              v-model="filters.asOnDate" 
              placeholder="Select date"
              class="w-full"
            />
          </div>

          <!-- Daily Revenue By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Daily Revenue By
            </label>
            <SelectComponent 
              v-model="filters.dailyRevenueBy"
              :options="revenueByOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-6">
          <ButtonComponent 
            @click="resetForm"
            variant="outline"
            class="min-w-24"
          >
            Reset
          </ButtonComponent>
          
          <ButtonComponent 
            @click="generateReport"
            variant="primary"
            class="min-w-24"
          >
            Report
          </ButtonComponent>
        </div>

        <!-- Help Guide -->
        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Help Guide</h3>
          <p class="text-blue-800 dark:text-blue-200 text-sm mb-3">
            This report will give you revenue of specific posting date for selected revenue account.
          </p>
          
          <div class="text-sm text-blue-800 dark:text-blue-200">
            <h4 class="font-semibold mb-2">How can you compare the report data with other reports?</h4>
            <div class="space-y-2">
              <p><strong>1)</strong> Daily Revenue pulled out for some specific date. Its Room Charges column total can be matched with Manager or Weekly Manager Report for same date.</p>
              <p><strong>2)</strong> Daily Revenue pulled out for some specific date. Its Room Charges, Discount and Round Off summation can be matched with Monthly Revenue Report.</p>
              <p><strong>3)</strong> Daily Revenue report when pulled out by Cancellation Revenue can be matched with Cancelled Reservation report.</p>
              <p><strong>4)</strong> Daily Revenue report when pulled out by No show Revenue can be matched with No show Reservation report.</p>
              <p><strong>5)</strong> Daily Revenue pulled out for Room Charges summation can be matched with Revenue By Rate Type report.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import type { Column } from '../../../utils/models'

interface FilterOptions {
  value: string;
  label: string;
}

interface RevenueData {
  revenueAccount: string;
  description: string;
  roomCharges: number;
  foodBeverage: number;
  telephone: number;
  laundry: number;
  miscellaneous: number;
  extraBed: number;
  discount: number;
  roundOff: number;
  total: number;
  percentage: number;
}

interface Filters {
  asOnDate: string;
  dailyRevenueBy: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  asOnDate: '20/09/2021',
  dailyRevenueBy: '',
})

// Options for selects
const revenueByOptions = ref<FilterOptions[]>([
  { value: '', label: 'All' },
  { value: 'room_revenue', label: 'Room Revenue' },
  { value: 'no_show_revenue', label: 'No Show Revenue' },
  { value: 'cancellation_revenue', label: 'Cancellation Revenue' },
  { value: 'dayuser_revenue', label: 'Dayuser Revenue' },
  { value: 'late_check_out_revenue', label: 'Late Check Out Revenue' },
])

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating daily revenue report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    asOnDate: '',
    dailyRevenueBy: '',
  }
  showResults.value = false
}

</script>

<style scoped>
/* Custom styles for revenue report */
.highlight-row {
  background-color: #f3f4f6;
}

.dark .highlight-row {
  background-color: #374151;
}

@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}
</style>