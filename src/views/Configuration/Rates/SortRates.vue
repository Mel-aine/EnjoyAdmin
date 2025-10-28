<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sort Rates</h1>
        <BasicButton variant="primary" @click="saveChanges">
          <Save class="w-4 h-4 mr-2" />
          Save Changes
        </BasicButton>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6">
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Enter the numbers against the rates you have defined in the order you want to list them. Save the changes and come to same screen if you want to edit this information anytime in future.
          </p>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rate Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sort Order
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="rate in rates" :key="rate.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ rate.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ rate.shortCode }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ rate.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input 
                      v-model.number="rate.sortOrder" 
                      type="number" 
                      min="1" 
                      class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                      @change="updateSortOrder(rate)"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      rate.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]">
                      {{ rate.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import { Save } from 'lucide-vue-next'

const rates = ref([
  { id: 1, name: 'Standard Rate', shortCode: 'STD', description: 'Standard room rate for regular bookings', sortOrder: 1, status: 'active' },
  { id: 2, name: 'Corporate Rate', shortCode: 'CORP', description: 'Special rate for corporate clients', sortOrder: 2, status: 'active' },
  { id: 3, name: 'Weekend Package', shortCode: 'WKD', description: 'Weekend special package rate', sortOrder: 3, status: 'active' },
  { id: 4, name: 'Seasonal Rate', shortCode: 'SEAS', description: 'Seasonal promotional rate', sortOrder: 4, status: 'active' },
  { id: 5, name: 'Group Rate', shortCode: 'GRP', description: 'Special rate for group bookings', sortOrder: 5, status: 'inactive' },
  { id: 6, name: 'Early Bird', shortCode: 'EARLY', description: 'Early booking discount rate', sortOrder: 6, status: 'active' }
])

const updateSortOrder = (rate) => {
  console.log('Updated sort order for:', rate.name, 'to:', rate.sortOrder)
}

const saveChanges = () => {
  // Sort rates by sortOrder
  rates.value.sort((a, b) => a.sortOrder - b.sortOrder)
  console.log('Saved rate sort order:', rates.value.map(r => ({ name: r.name, sortOrder: r.sortOrder })))
  alert('Rate sort order saved successfully!')
}
</script>
