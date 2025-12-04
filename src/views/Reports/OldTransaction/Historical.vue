<template>
  <ReportsLayout>
    <FullScreenLayout>

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.oldTransaction.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('reports.oldTransaction.description') }}
        </p>
      </div>

    <!-- Filters and Column Manager -->
    <div class="bg-white dark:bg-gray-800 border rounded-lg shadow-md border-gray-200 dark:border-gray-700 mb-3 p-6">
      <div class="gap-4">
        <div class="grid grid-cols-6 gap-3 mb-4">
          <!-- Guest Name -->
          <FormInput :lb="$t('Guest Name')" v-model="filters.guestName" :placeholder="$t('Enter name')" />

          <!-- Reservation Number -->
          <FormInput :lb="$t('Res No')" v-model="filters.reservationNumber" :placeholder="$t('Enter number')" />

          <div class="col-span-2 flex">
            <div class="w-60">
              <!-- Date Type -->
              <FormSelect :lb="$t('Date')" v-model="filters.dateType" :options="dateTypeOptions" :placeholder="$t('--Select--')" />
            </div>

            <div class="w-full">
              <!-- Date range using custom double date picker -->
              <InputDoubleDatePicker :title="$t('Selected Period')" v-model="filters.dateRange" :allowPastDates="true"/>
            </div>
          </div>

          <!-- Room Type (AutoComplete) -->
          <AutoCompleteSelect v-model="filters.roomType" :options="roomTypeOptions" :defaultValue="$t('Select Room Type')"
            :lb="$t('Room Type')" :is-required="false" :use-dropdown="true"
            @update:modelValue="onRoomTypeChange" />

          <!-- Rate Type (AutoComplete, depends on Room Type) -->
          <AutoCompleteSelect v-model="filters.rateType" :options="rateTypeOptions" :defaultValue="$t('Select Rate Type')"
            :lb="$t('Rate Type')" :is-required="false" :use-dropdown="true" :disabled="!selectedRoomTypeId"
            :isLoading="isLoadingRateTypes" />

        </div>
        <div class="grid grid-cols-3 gap-3">
          <!-- Show Bookings -->
          <div class="flex items-center gap-3 align-middle self-end content-end">
            <span class="text-xs text-gray-600 dark:text-gray-300">{{ $t('Show Bookings') }}:</span>
            <Toggle :title="$t('Web')" v-model="filters.show.web" />
            <Toggle :title="$t('Channel')" v-model="filters.show.channel" />
            <Toggle :title="$t('PMS')" v-model="filters.show.pms" />
          </div>

          <!-- Buttons + Dropdown Column Manager -->
          <div class="ml-auto relative flex gap-2 col-span-2 justify-end self-end content-center">
            <BasicButton variant="secondary" :label="$t('Reset')" @click="resetFilters" />
            <BasicButton variant="primary" :label="$t('Manage Columns')" @click="toggleColumnManager" />
            <BasicButton variant="primary" :label="$t('Search')" @click="onSearch" />

            <!-- Dropdown Column Manager -->
            <div v-if="showColumnPanel" class="absolute right-0 mt-12 w-96 z-50 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <div class="flex justify-between items-center px-3 py-2">
                <span class="text-sm font-medium">{{ $t('Select Columns') }} (max {{ maxColumns }})</span>
                <span class="text-xs text-gray-600 dark:text-gray-300">{{ $t('Selected') }}: {{ selectedColumnsModel.length }}/{{ maxColumns }}</span>
              </div>
              <div class="px-3 pb-3">
                <MultipleSelect :lb="$t('Columns')" v-model="selectedColumnsModel" :options="columnOptions" :max-visible-tags="6" :default-display-mode="'limited'" />
                <div class="flex justify-end gap-2 mt-2">
                  <BasicButton variant="secondary" :label="$t('Close')" @click="showColumnPanel = false" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="">
      <ReusableTable :showHeader="true" :columns="tableColumns" :data="Historical" :searchable="false"
       :loading="loading" :title="$t('reports.oldTransaction.history')" @page-change="handlePageChange" :meta="paginationMeta">
        <!-- Custom column for reservation number -->
        <template #column-reservationNumber="{ item }">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            #{{ item.reservationNumber }}
          </div>
        </template>

        <!-- Custom column for guest info -->
        <template #column-guest="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ item.guest.displayName }}
            </div>
            <div v-if="item.email" class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.email }}
            </div>
          </div>
        </template>

        <!-- Custom column for dates -->
        <template #column-dates="{ item }">
          <div class="text-sm">
            <div class="text-gray-900 dark:text-white">{{ formatDate(item.date) }}</div>
            <div class="text-gray-500 dark:text-gray-400">{{ formatDate(item.dateD) }}</div>
          </div>
        </template>

        <!-- Custom column for amount -->
        <template #column-totalAmount="{ item }">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(item.balanceSummary?.totalChargesWithTaxes) }}
          </div>
        </template>

        <template #column-deposit="{ item }">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(item.deposit) }}
          </div>
        </template>

        <!-- Custom column for status -->
        <template #column-status="{ item }">
          <div class="flex-col gap-1 inline-flex rounded-full px-2" :class="[
            item.status == 'Active' ?  'text-green-600 bg-green-50'  : 'text-red-600 bg-red-50'
          ]">
            {{ item.status }}
          </div>
        </template>
        <template #column-source="{ item }">
          <img v-if="getOtaIcon(item)" :src="getOtaIcon(item)??''" alt="OTA" class="w-8 h-8" />
          <Building2Icon v-else class="w-8 h-8 text-primary" />
        </template>
        <!--extra charge-->
          <template #column-extraCharge="{ item }">
          <div class="text-sm">
            <div v-if="hasExtraCharges(item)" class="space-y-1">
              <div v-for="(value, key) in getExtraCharges(item)" :key="key"
                   class="flex justify-between items-center gap-2 text-xs">
                <span class="text-gray-600 dark:text-gray-400 truncate">{{ key }}:</span>
                <span class="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {{ formatCurrency(value) }}
                </span>
              </div>
            </div>
            <div v-else class="text-gray-400 dark:text-gray-500 text-xs italic">
              {{ t('No extra charges') }}
            </div>
          </div>
        </template>

      </ReusableTable>
    </div>

    </FullScreenLayout>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ReportsLayout from '../../../components/layout/ReportsLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { Building2Icon } from 'lucide-vue-next'
import { useServiceStore } from '../../../composables/serviceStore'
import { getHotelHistory } from '@/services/reportsApi'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import { formatCurrency } from '../../../utils/numericUtils'
import type { Column } from '@/utils/models'
import FormInput from '@/components/forms/FormElements/Input.vue'
import FormSelect from '@/components/forms/FormElements/Select.vue'
import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue'
import Toggle from '@/components/forms/FormElements/Toggle.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import MultipleSelect from '@/components/forms/FormElements/MultipleSelect.vue'
import { getFrontofficeBookingDataId } from '@/services/configrationApi'
import getOtaIconSrc from '@/utils/otaIcons'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const Historical = ref([])
const { t, locale } = useI18n({ useScope: 'global' })
const loading = ref(false)
const serviceStore = useServiceStore()
const paginationMeta = ref<any>({})
const lastFilters = ref<any>({})

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}

// Helper pour obtenir la date du jour au format YYYY-MM-DD
const getTodayDate = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Methods
const applyFilter = async (filterItem: any, pageNumber:number) => {
  loading.value = true
  lastFilters.value = filterItem
  try {

    const params = {
      ...filterItem,
      page: pageNumber,
      limit: 20
    }
    const response = await getHotelHistory(params)
    console.log(' API Response:', response)
    Historical.value = Array.isArray(response?.data) ? response.data : []
    paginationMeta.value = response.meta || {}
  } catch (error: any) {
    console.error(' Error filtering reservations:', error)
    console.error('Error details:', error.response?.data)
  } finally {
    loading.value = false
  }
}

// Column manager
const maxColumns = 10
const showColumnPanel = ref(false)
const availableColumns: Column[] = [
  { key: 'reservationNumber', label: t('Res No'), type: 'custom' },
  { key: 'bookingDate', label: t('Booking Date'), type: 'date' },
  { key: 'guest', label: t('Guest Name'), type: 'custom' },
  { key: 'dates', label: t('Dates'), type: 'custom' },
  { key: 'room', label: t('Room'), type: 'text' },
  { key: 'rateType', label: t('Rate Type'), type: 'text' },
  { key: 'source', label: t('Source'), type: 'custom' },
  { key: 'pax', label: t('Pax'), type: 'text' },
  { key: 'totalAmount', label: t('Total'), type: 'custom' },
  { key: 'balanceSummary.adr', label: t('ADR'), type: 'text' },
  { key: 'deposit', label: t('Deposit'), type: 'custom' },
  { key: 'balanceSummary.totalTaxes', label: t('Total Tax'), type: 'text' },
  { key: 'balanceSummary.totalCharges', label: t('Total Charges'), type: 'text' },
  { key: 'commission', label: t('Commission'), type: 'text' },
  { key: 'voucher', label: t('Voucher'), type: 'text' },
  { key: 'status', label: t('Status'), type: 'custom' },
  { key: 'dueAmount', label: t('Due Amt.'), type: 'text' },
  { key: 'email', label: t('Email'), type: 'email' },
  { key: 'mobileNo', label: t('Mobile No'), type: 'text' },
  { key: 'city', label: t('City'), type: 'text' },
  { key: 'country', label: t('Country'), type: 'text' },
  { key: 'zipCode', label: t('Zip Code'), type: 'text' },
  { key: 'state', label: t('State'), type: 'text' },
  { key: 'folioNo', label: t('Folio No'), type: 'text' },
  { key: 'preference', label: t('Preference'), type: 'text' },
  { key: 'userFullName', label: t('User'), type: 'text' },
  { key: 'travelAgent', label: t('Travel Agent'), type: 'text' },
  { key: 'reservationType', label: t('ReservationType'), type: 'text' },
  { key: 'paymentType', label: t('paymentType'), type: 'text' },
  { key: 'numberOfNights', label: t('No Of Nights'), type: 'text' },
  { key: 'bookingTime', label: t('Booking Time'), type: 'text' },
  { key: 'arrivalDate', label: t('Arrival Date'), type: 'date' },
  { key: 'departureDate', label: t('Departure Date'), type: 'date' },
  { key: 'remark', label: t('Remarks'), type: 'text' },
  { key: 'marketCode', label: t('Market Code'), type: 'text' },
  { key: 'cancellationDate', label: t('Cancellation Date'), type: 'date' },
  { key: 'lastModifiedDate', label: t('Last Modified'), type: 'date' },
  { key: 'lastModifiedBy', label: t('Modified By'), type: 'text' },
  { key: 'numberOfRoomsBooked', label: t('No of Rooms Booked'), type: 'text' },
  { key: 'extraCharge', label: t('Extra Charges'), type: 'custom' },
  { key: 'salesPerson', label: t('Sales Person'), type: 'text' },
]

const selectedColumnKeys = ref<string[]>([
  'reservationNumber',
  'bookingDate',
  'guest',
  'dates',
  'room',
  'pax',
  'totalAmount',
  'balanceSummary.adr',
  'deposit',
  'source'
])

const columnOptions = computed(() => availableColumns.map(c => ({ label: c.label, value: c.key })))
const selectedColumnsModel = ref<Array<{ label: string; value: string }>>([])
const toggleColumnManager = () => { showColumnPanel.value = !showColumnPanel.value }

onMounted(() => {
  selectedColumnsModel.value = selectedColumnKeys.value.map(k => {
    const col = availableColumns.find(c => c.key === k)
    return { label: col?.label || k, value: k }
  })
})

watch(selectedColumnsModel, (newVal, oldVal) => {
  if (newVal.length > maxColumns) {
    selectedColumnsModel.value = oldVal
    return
  }
  selectedColumnKeys.value = newVal.map(i => i.value)
}, { deep: true })

const tableColumns = computed<Column[]>(() => {
  const map: Record<string, Column> = {}
  availableColumns.forEach(c => map[c.key] = c)
  const ensureCustom: Record<string, Column> = {
    reservationNumber: { key: 'reservationNumber', label: t('Res No'), type: 'custom' },
    guest: { key: 'guest', label: t('Guest Name'), type: 'custom' },
    dates: { key: 'dates', label: t('Dates'), type: 'custom' },
    totalAmount: { key: 'totalAmount', label: t('Total'), type: 'custom' },
    status: { key: 'status', label: t('Status'), type: 'custom' },
    source: { key: 'source', label: t('Source'), type: 'custom' }
  }
  return selectedColumnKeys.value.map(k => ensureCustom[k] || map[k]).filter(Boolean)
})

const getOtaIcon = (item: any): string | null => {
  const name = item?.otaName || item?.bookingSourceName || item?.bookingSource?.name || item?.source || null
  return getOtaIconSrc(name)
}

const hasExtraCharges = (item: any): boolean => {
  const charges = item?.extraCharges || item?.extractCharge
  if (!charges) return false

  // Si c'est une string JSON, la parser
  const chargesObj = typeof charges === 'string' ? JSON.parse(charges) : charges

  // Vérifier si au moins une valeur est > 0
  return Object.values(chargesObj).some((value: any) => parseFloat(value) > 0)
}

const getExtraCharges = (item: any): Record<string, number> => {
  const charges = item?.extraCharges || item?.extractCharge
  if (!charges) return {}

  const chargesObj = typeof charges === 'string' ? JSON.parse(charges) : charges

  const filtered: Record<string, number> = {}
  Object.entries(chargesObj).forEach(([key, value]: [string, any]) => {
    const numValue = parseFloat(value)
    if (numValue > 0) {
      filtered[key] = numValue
    }
  })

  return filtered
}


const filters = ref({
  guestName: '',
  reservationNumber: '',
  dateType: 'arrival',
  dateRange: { start: getTodayDate(), end: getTodayDate() },
  roomType: '',
  rateType: '',
  source: '',
  reservationType: '',
  stayRange: { start: '', end: '' },
  incompleteOnly: false,
  show: { web: true, channel: true, pms: true }
})

const dateTypeOptions = [
  { label: t('Created'), value: 'created' },
  { label: t('Arrival'), value: 'arrival' },
  { label: t('Departure'), value: 'departure' },
  { label: t('Cancelled'), value: 'cancelled' },
  { label: t('Booking'), value: 'booking' }
]

// Dynamic options for Room Type / Rate Type
const roomTypeOptions = ref<any[]>([])
const rateTypeOptions = ref<any[]>([])
const isLoadingRoomTypes = ref(false)
const isLoadingRateTypes = ref(false)
const selectedRoomTypeId = ref<number | null>(null)
const roomTypesData = ref<any[]>([])

const mapFiltersToApi = () => {
  const params: any = {
    hotelId: serviceStore.serviceId
  }

  // Combiner Guest name ET Reservation number dans searchText
  const searchTerms: string[] = []
  if (filters.value.guestName?.trim()) {
    searchTerms.push(filters.value.guestName.trim())
  }
  if (filters.value.reservationNumber?.trim()) {
    searchTerms.push(filters.value.reservationNumber.trim())
  }
  if (searchTerms.length > 0) {
    params.searchText = searchTerms.join(' ')
  }

  // Room type
  if (filters.value.roomType) {
    params.roomType = filters.value.roomType
  }

  // Rate type
  if (filters.value.rateType) {
    params.rateType = filters.value.rateType
  }

  // Reservation type
  if (filters.value.reservationType) {
    params.reservationType = filters.value.reservationType
  }

  // Source
  if (filters.value.source) {
    params.source = filters.value.source
  }

  // Show bookings toggles
  const showToggles: string[] = []
  if (filters.value.show.web) showToggles.push('web')
  if (filters.value.show.channel) showToggles.push('channel')
  if (filters.value.show.pms) showToggles.push('pms')

  if (showToggles.length > 0 && showToggles.length < 3) {
    params.showBookings = showToggles.join(',')
  }

  // Date range based on dateType (created/arrival/departure/cancelled/booking)
  const start = filters.value.dateRange?.start
  const end = filters.value.dateRange?.end

  if (start && end && filters.value.dateType) {
    params.dateType = filters.value.dateType
    params.dateStart = start
    params.dateEnd = end
  }

  // Stay range (période de séjour - overlap)
  const stayStart = filters.value.stayRange?.start
  const stayEnd = filters.value.stayRange?.end

  if (stayStart && stayEnd) {
    params.stayCheckInDate = stayStart
    params.stayCheckOutDate = stayEnd
  }

  console.log(' API Params:', params)
  return params
}

const onSearch = () => {
  const apiFilters = mapFiltersToApi()
  applyFilter(apiFilters, 1)
}

const resetFilters = () => {
  filters.value = {
    guestName: '',
    reservationNumber: '',
    dateType: 'created',
    dateRange: { start: getTodayDate(), end: getTodayDate() },
    roomType: '',
    rateType: '',
    source: '',
    reservationType: '',
    stayRange: { start: '', end: '' },
    incompleteOnly: false,
    show: { web: true, channel: true, pms: true }
  }
  onSearch()
}

onMounted(async () => {

  try {
    isLoadingRoomTypes.value = true
    const start = getTodayDate()
    const end = getTodayDate()
    const resp = await getFrontofficeBookingDataId(start, end)
    const data = Array.isArray(resp.data?.data) ? resp.data.data : []
    roomTypesData.value = data
    roomTypeOptions.value = data.map((rt: any) => ({
      label: rt.roomTypeName,
      value: rt.roomTypeName,
      id: rt.id,
    }))
  } catch (e) {
    console.error('Error fetching room types:', e)
  } finally {
    isLoadingRoomTypes.value = false
  }

  onSearch()
})


const onRoomTypeChange = async (roomTypeName: string) => {
  const match = roomTypeOptions.value.find((opt: any) => opt.value === roomTypeName)
  selectedRoomTypeId.value = match?.id ?? null
  rateTypeOptions.value = []
  filters.value.rateType = ''

  if (!selectedRoomTypeId.value) return

  try {
    isLoadingRateTypes.value = true
    const rtRecord = roomTypesData.value.find((rt: any) => rt.id === selectedRoomTypeId.value)
    const rates = rtRecord?.roomRates || []
    rateTypeOptions.value = rates.map((rm: any) => ({
      label: rm?.rateType?.rateTypeName ?? rm.rateTypeName,
      value: rm?.rateType?.rateTypeName ?? rm.rateTypeName,
    }))
  } catch (e) {
    console.error('Error preparing rate types from room data:', e)
  } finally {
    isLoadingRateTypes.value = false
  }
}

const handlePageChange = (page: number) => {
  applyFilter(lastFilters.value, page)
}

</script>

<style scoped></style>
