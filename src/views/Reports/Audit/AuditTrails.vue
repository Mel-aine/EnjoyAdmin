<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.audit.auditTrails') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.audit.auditTrailsDescription') }}
        </p>  
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <InputDatepicker v-model="filters.from" :placeholder="$t('common.selectDate')" class="w-full" />
          </div>

          <!-- To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <InputDatepicker v-model="filters.to" :placeholder="$t('common.selectDate')" class="w-full" />
          </div>

          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.user') }}
            </label>
            <SelectComponent v-model="filters.user" :options="userOptions" :placeholder="$t('common.select')" class="w-full" />
          </div>

          <!-- Operation -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.audit.operation') }}
            </label>
            <SelectComponent v-model="filters.operation" :options="operationOptions" :placeholder="$t('reports.audit.roomrateChange')"
              class="w-full" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-6">
          <!--     <ButtonComponent 
            @click="exportData"
            variant="secondary"
            class="min-w-24 bg-gray-600 text-white"
          >
            Export
          </ButtonComponent>
          -->
          <ButtonComponent @click="generateReport" variant="" class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24">
           <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ $t('common.report') }}</span>
          </ButtonComponent>

          <ButtonComponent @click="resetForm" variant="outline"  class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t('common.reset') }}
          </ButtonComponent>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }}
            </h2>
            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mt-2">
              {{ $t('reports.audit.auditTrails') }}
            </h3>

          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <div><strong>{{ $t('common.dateFrom') }}:</strong> {{ filters.from }} <strong>{{ $t('common.to') }}:</strong> {{ filters.to }}</div>
            <div></div>
            <div><strong>{{ $t('reports.audit.operation') }}:</strong> {{ getOperationLabel(filters.operation) }}</div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  {{ $t('reports.audit.resNo') }}</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  {{ $t('common.folioNumber') }}</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  {{ $t('common.guest') }}</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  {{ $t('common.user') }}</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  {{ $t('common.date') }}</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  {{ $t('common.time') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr class="bg-gray-100 dark:bg-gray-700">
                <td colspan="6" class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white border">
                  {{ $t('reports.audit.operation') }} : {{ getOperationLabel(filters.operation) }}
                </td>
              </tr>
              <tr v-for="item in auditTrailsData" :key="item.resNo" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.resNo }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.folioNo }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.guest }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.user }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.date }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.time }}</td>
              </tr>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <td colspan="6" class="px-4 py-3 text-sm text-gray-900 dark:text-white border">
                  <div class="space-y-1">
                    <div v-for="item in auditTrailsData" :key="'particulars-' + item.resNo">
                      <strong>{{ $t('reports.audit.particular') }} :</strong> {{ item.particulars }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { getEmployeesForService } from '../../../services/userApi'
import { getAuditReport } from '../../../services/reportsApi'

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface AuditTrailData {
  id: number;
  resNo: string;
  folioNo: string;
  guest: string;
  user: string;
  date: string;
  time: string;
  particulars: string;
}

const serviceStore: any = useServiceStore()

interface Filters {
  from: string;
  to: string;
  user: string;
  operation: string;
}

const showResults = ref<boolean>(false)
const today = new Date().toISOString().split('T')[0]
const hotelName = computed(() => {
  return useServiceStore().getCurrentService?.hotelName
})

const filters = ref<Filters>({
  from: today,
  to: today,
  user: '',
  operation: 'roomrate_change'
})

// Options for selects
const userOptions = computed<FilterOptions[]>(() => [
  { value: '', label: t('common.all') },
  ...userOptionsRaw.value
])

const userOptionsRaw = ref<FilterOptions[]>([])

const operationOptions = computed<FilterOptions[]>(() => [
  { value: '', label: t('common.all') },
  { value: 'roomrate_change', label: t('reports.audit.roomrateChange') },
  { value: 'UPDATE', label: t('common.update') },
  { value: 'CREATE', label: t('common.create') },
  { value: 'DELETE', label: t('common.delete') },
  { value: 'LOGIN', label: t('common.login') },
  { value: 'LOGOUT', label: t('common.logout') },
  { value: 'CHECK_IN', label: t('common.checkIn') },
  { value: 'CHECK_OUT', label: t('common.checkOut') }
])

const getOperationLabel = (operation: string): string => {
  if (!operation) return t('common.all')
  const option = operationOptions.value.find(opt => opt.value === operation)
  return option ? option.label : operation
}

const auditTrailsData = ref<AuditTrailData[]>([])
const isLoading = ref(false)

// Helper functions to format data
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}

const formatTime = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false
  })
}

// Helper function to extract folio number from description or meta
const extractFolioNumber = (description: string, meta: any): string => {
  if (!description) return '-'
  
  // Try to extract folio number from description
  const folioMatch = description.match(/folio[:\s#]*(\d+)/i)
  if (folioMatch) return folioMatch[1]
  
  // Check in meta if available
  if (meta && meta.folioNumber) return meta.folioNumber
  
  return '-'
}

// Helper function to extract guest name from description
const extractGuestName = (description: string): string => {
  if (!description) return '-'
  
  // Try to extract name from quotes "NAME"
  const nameMatch = description.match(/"([^"]+)"/g)
  if (nameMatch && nameMatch.length > 0) {
    // Get the first quoted text which is usually the guest name
    return nameMatch[0].replace(/"/g, '')
  }
  
  // Try to extract from "for guest" pattern
  const forGuestMatch = description.match(/for guest\s+(.+?)(?:\s+has|\s*$)/i)
  if (forGuestMatch) return forGuestMatch[1]
  
  return '-'
}

// Helper function to build particulars from action and changes
const buildParticulars = (item: any): string => {
  const parts: string[] = []
  
  // Add description if available
  if (item.description) {
    parts.push(item.description)
  }
  
  // Add changes if available
  if (item.changes && typeof item.changes === 'object' && Object.keys(item.changes).length > 0) {
    const changesList: string[] = []
    for (const [field, change] of Object.entries(item.changes)) {
      const changeObj = change as any
      if (changeObj.old !== undefined && changeObj.new !== undefined) {
        const oldVal = changeObj.old === null || changeObj.old === '' ? 'empty' : changeObj.old
        const newVal = changeObj.new === null || changeObj.new === '' ? 'empty' : changeObj.new
        changesList.push(`${field}: "${oldVal}" → "${newVal}"`)
      }
    }
    if (changesList.length > 0) {
      parts.push('Changes: ' + changesList.join(', '))
    }
  }
  
  // Add IP and User Agent if available
  const metadata: string[] = []
  if (item.ipAddress) {
    metadata.push(`IP: ${item.ipAddress}`)
  }
  if (item.userAgent) {
    // Shorten user agent for readability
    const shortAgent = item.userAgent.length > 50 
      ? item.userAgent.substring(0, 50) + '...' 
      : item.userAgent
    metadata.push(`User Agent: ${shortAgent}`)
  }
  
  if (metadata.length > 0) {
    parts.push(metadata.join(' | '))
  }
  
  return parts.join(' | ')
}

// Methods
const generateReport = async() => {
  isLoading.value = true
  console.log('Generating audit report with filters:', filters.value)
  
  try {
    const data = {
      startDate: filters.value.from,
      endDate: filters.value.to,
      userId: filters.value.user || undefined,
      action: filters.value.operation || undefined,
      hotelId: serviceStore.serviceId
    }
    
    const response = await getAuditReport(data)
    console.log('Response:', response)
    
    // Map the API response to the table format
    if (response?.data && Array.isArray(response.data)) {
      auditTrailsData.value = response.data.map((item: any) => {
        // Extract reservation number from entityId if entityType is Reservation
        const resNo = item.entityType === 'Reservation' || item.entityType === 'Booking'
          ? item.entityId 
          : '-'
        
        // Extract folio number if available in description or meta
        const folioNo = extractFolioNumber(item.description, item.meta)
        
        // Extract guest name from description
        const guest = extractGuestName(item.description)
        
        // Get user name
        const user = item.username || 
                    (item.user ? `${item.user.firstName} ${item.user.lastName}` : '-')
        
        // Format date and time
        const date = formatDate(item.createdAt)
        const time = formatTime(item.createdAt)
        
        // Build particulars from action and changes
        const particulars = buildParticulars(item)
        
        return {
          id: item.id,
          resNo,
          folioNo,
          guest,
          user,
          date,
          time,
          particulars
        }
      })
      
      showResults.value = true
    } else {
      auditTrailsData.value = []
      showResults.value = true
    }
  } catch (error) {
    console.error('Error generating report:', error)
    auditTrailsData.value = []
    showResults.value = true
  } finally {
    isLoading.value = false
  }
}

const fetchUser = async () => {
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) throw new Error('hotelId is not defined')
    const response = await getEmployeesForService(hotelId)
    console.log('response', response)

    const assignmentsWithNames = response.data.data.map((user: any) => {
      return {
        value: String(user.id),
        label: `${user.firstName} ${user.lastName}`
      }
    })
    userOptionsRaw.value = assignmentsWithNames
  } catch (error) {
    console.error('fetch failed:', error)
  }
}

fetchUser()

const resetForm = (): void => {
  filters.value = {
    from: today,
    to: today,
    user: '',
    operation: 'roomrate_change'
  }
  auditTrailsData.value = []
  showResults.value = false
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

.border {
  border: 1px solid #d1d5db;
}

.dark .border {
  border-color: #4b5563;
}

@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}
</style>