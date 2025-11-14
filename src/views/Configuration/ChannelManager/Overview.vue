<template>
  <ChannelManagerLayout>
    <div class="h-screen">
    <!-- Filters and Column Manager -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3 p-3">
      <div class=" gap-4">
        <div class="grid grid-cols-7 gap-3 mb-4">
          <!-- Guest Name -->
          <FormInput :lb="$t('Guest Name')" v-model="filters.guestName" :placeholder="$t('Enter name')" />

          <!-- Reservation Number -->
          <FormInput :lb="$t('Res No')" v-model="filters.reservationNumber" :placeholder="$t('Enter number')" />

          <div class="col-span-2 flex">
            <div>
              <!-- Date Type -->
              <FormSelect :lb="$t('Date')" v-model="filters.dateType" :options="dateTypeOptions" :placeholder="$t('--Select--')" />
            </div>

            <div class="w-full"> <!-- Date range using custom double date picker -->
              <InputDoubleDatePicker :title="$t('Selected Period')" v-model="filters.dateRange" :allowPastDates="true"/>
            </div>
          </div>

          <!-- Room Type (AutoComplete) -->
          <AutoCompleteSelect v-model="filters.roomType" :options="roomTypeOptions" :defaultValue="$t('Select Room Type')"
            :lb="$t('Room Type')" :is-required="false" :use-dropdown="true" :isLoading="isLoadingRoomTypes"
            @update:modelValue="onRoomTypeChange" />

          <!-- Rate Type (AutoComplete, depends on Room Type) -->
          <AutoCompleteSelect v-model="filters.rateType" :options="rateTypeOptions" :defaultValue="$t('Select Rate Type')"
            :lb="$t('Rate Type')" :is-required="false" :use-dropdown="true" :disabled="!selectedRoomTypeId"
            :isLoading="isLoadingRateTypes" />

          <!-- Source -->
          <FormSelect :lb="$t('BusinessSource')" v-model="filters.source" :options="sourceOptions" :placeholder="$t('--Select--')" />
        </div>
        <div class="grid grid-cols-4 gap-3">
          <div class="flex">
            <!-- Reservation Type -->
            <div>
              <FormSelect :lb="$t('Type')" v-model="filters.reservationType" :options="reservationTypeOptions"
                :placeholder="$t('--Select--')" />
            </div>

            <div class="w-full">
              <!-- Stay Date range using double date picker -->
              <InputDoubleDatePicker :title="$t('Stay Date')" v-model="filters.stayRange" :allowPastDates="true"/>
            </div>
          </div>

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
            <div v-if="showColumnPanel" class="absolute right-0 mt-2 w-96 z-50 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
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

    <div>
      <ReusableTable :showHeader="true" :columns="tableColumns" :data="paginatedReservations" :searchable="false"
        :empty-state-title="$t('No reservations')" :loading="loading"
        :empty-state-message="$t('Get started by creating a new reservation.')" :title="$t('Reservations')">
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
          <div class="flex-col gap-1 inline-flex">
            <ReservationStatus :status="item.status" />
          </div>
        </template>
        <template #column-source="{ item }">
          <img v-if="getOtaIcon(item)" :src="getOtaIcon(item)??''" alt="OTA" class="w-8 h-8" />
          <Building2Icon v-else class="w-8 h-8 text-primary" />
        </template>


      </ReusableTable>
    </div>
    </div>
  </ChannelManagerLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted,watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { Building2Icon } from 'lucide-vue-next'
import { useServiceStore } from '../../../composables/serviceStore'
import { filterReservation } from '../../../services/hotelApi'
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
import ReservationStatus from '@/components/common/ReservationStatus.vue'
const allReservation = ref([])
const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allReservation.value.slice(start, end)
})
const currentPage = ref(1)
const pageSize = ref(20)
const { t, locale } = useI18n({ useScope: 'global' })
const loading = ref(false);
 
const serviceStore = useServiceStore()
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}
const totalPages = computed(() => {
  return Math.ceil(allReservation.value.length / pageSize.value)
})

const bookingTypeLo = ref<any>([...serviceStore.reservationType])
// Methods
const applyFilter = async (filterItem: any) => {
  loading.value = true
  console.log('filter:', filterItem)

  try {
    const res = await filterReservation(serviceStore.serviceId!, filterItem)

    if (res.status === 200 || res.status === 201) {
      console.log(res.data)

      const mappedReservations = res.data?.reservations.map((res: any) => {
        const user = res.guest
        const firstRoom = res.reservationRooms?.[0]
         let preferencesText = ''
        if (user?.preferences && Array.isArray(user.preferences)) {
          preferencesText = user.preferences
            .map((pref: any) => pref.label || pref.value || pref)
            .filter(Boolean)
            .join(', ')
        }


        return {
          ...res,
          date: res.arrivedDate,
          dateD: res.departDate,
          email: user?.email || '',
          phone: user?.phonePrimary || '',
          city: user?.city || '',
          country: user?.country || '',
          state : user?.stateProvince || '',
          zipCode : user?.postalCode || '',
          preference: preferencesText || 'N/A',
          userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
          room: {
            name: firstRoom?.room?.roomNumber || 'N/A'
          },
          pax: res.guestCount  || res.adults ||  0,
          deposit: res.paidAmount || '0.00',
          folioNumber : res.folios?.[0].folioNumber,
          rateType: {
            name: firstRoom?.rateType?.rateTypeName || 'N/A'
          },

        }
      })

      allReservation.value = mappedReservations
    }
  } catch (error) {
    console.error('Error filtering reservations:', error)
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
  { key: 'room.name', label: t('Room'), type: 'text' },
  { key: 'rateType.name', label: t('Rate Type'), type: 'text' },
  { key: 'pax', label: t('Pax'), type: 'text' },
  { key: 'totalAmount', label: t('Total'), type: 'custom' },
  { key: 'balanceSummary.adr', label: t('ADR'), type: 'text' },
  { key: 'deposit', label: t('Deposit'), type: 'custom' },
  { key: 'source', label: t('Source'), type: 'custom' },
  { key: 'balanceSummary.totalTaxes', label: t('Total Tax'), type: 'text' },
  { key: 'balanceSummary.totalCharges', label: t('Total Charges'), type: 'text' },
  { key: 'commission', label: t('Commission'), type: 'text' },
  { key: 'voucher', label: t('Voucher'), type: 'text' },
  { key: 'status', label: t('Status'), type: 'custom' },
  { key: 'dueAmount', label: t('Due Amt.'), type: 'text' },
  { key: 'email', label: t('Email'), type: 'email' },
  { key: 'phone', label: t('Mobile No'), type: 'text' },
  { key: 'city', label: t('City'), type: 'text' },
  { key: 'country', label: t('Country'), type: 'text' },
  { key: 'zipCode', label: t('Zip Code'), type: 'text' },
  { key: 'state', label: t('State'), type: 'text' },
  { key: 'folioNumber', label: t('Folio No'), type: 'text' },
  { key: 'preference', label: t('Preference'), type: 'text' },
  { key: 'userFullName', label: t('User'), type: 'text' },
  { key: 'travelAgent', label: t('Travel Agent'), type: 'text' },
  { key: 'reservationType.name', label: t('ReservationType'), type: 'text' },
  { key: 'paymentStatus', label: t('Payment'), type: 'badge' },
  { key: 'numberOfNights', label: t('No Of Nights'), type: 'text' },
  { key: 'bookingTime', label: t('Booking Time'), type: 'text' }
]

// Column selection via MultipleSelect
const selectedColumnKeys = ref<string[]>([
  'reservationNumber', // Res #
  'bookingDate',       // Booking Date
  'guest',             // Guest Name
  'dates',             // Dates
  'room.name',         // Room
  'pax',               // Pax
  'totalAmount',       // Total
  'balanceSummary.adr',// ADR
  'deposit',           // Deposit
  'source'             // Source
])
const columnOptions = computed(() => availableColumns.map(c => ({ label: c.label, value: c.key })))
const selectedColumnsModel = ref<Array<{ label: string; value: string }>>([])
const toggleColumnManager = () => { showColumnPanel.value = !showColumnPanel.value }

// Initialize the MultipleSelect model from keys
onMounted(() => {
  selectedColumnsModel.value = selectedColumnKeys.value.map(k => {
    const col = availableColumns.find(c => c.key === k)
    return { label: col?.label || k, value: k }
  })
})

// Keep keys in sync with MultipleSelect and enforce max limit

watch(selectedColumnsModel, (newVal, oldVal) => {
  if (newVal.length > maxColumns) {
    // revert if exceeds limit
    selectedColumnsModel.value = oldVal
    return
  }
  selectedColumnKeys.value = newVal.map(i => i.value)
}, { deep: true })

// Table configuration based on selected columns
const tableColumns = computed<Column[]>(() => {
  const map: Record<string, Column> = {}
  availableColumns.forEach(c => map[c.key] = c)
  // Always ensure custom slots exist for these keys
  const ensureCustom: Record<string, Column> = {
    reservationNumber: { key: 'reservationNumber', label: t('Res No'), type: 'custom' },
    guest: { key: 'guest', label: t('Guest Name'), type: 'custom' },
    dates: { key: 'dates', label: t('Dates'), type: 'custom' },
    totalAmount: { key: 'totalAmount', label: t('Total'), type: 'custom' },
    status: { key: 'status', label: t('Status'), type: 'custom' }
  }
  return selectedColumnKeys.value.map(k => ensureCustom[k] || map[k]).filter(Boolean)
})

// Filter state
const getTodayDate = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper to map a reservation row to an OTA icon src
const getOtaIcon = (item: any): string | null => {
  const name = item?.otaName || item?.bookingSourceName || item?.bookingSource?.name || item?.source || null
  return getOtaIconSrc(name)
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
  { label: t('Cancelled'), value: 'cancelled' }
]

// Dynamic options for Room Type / Rate Type
const roomTypeOptions = ref<any[]>([])
const rateTypeOptions = ref<any[]>([])
const isLoadingRoomTypes = ref(false)
const isLoadingRateTypes = ref(false)
const selectedRoomTypeId = ref<number | null>(null)
const roomTypesData = ref<any[]>([])
const sourceOptions = computed(() => businessSourcesLo.value || [])

const reservationTypeOptions = computed(() => bookingTypeLo.value || [])
 const businessSourcesLo = ref<any>([...serviceStore.businessSources])


const mapFiltersToApi = () => {
  const api: any = {}

  // Combiner Guest name ET Reservation number dans searchText
  const searchTerms:any[] = []
  if (filters.value.guestName) {
    searchTerms.push(filters.value.guestName)
  }
  if (filters.value.reservationNumber) {
    searchTerms.push(filters.value.reservationNumber)
  }
  if (searchTerms.length > 0) {
    api.searchText = searchTerms.join(' ')
  }

  // Room type
  if (filters.value.roomType) {
    const match = roomTypeOptions.value.find((opt: any) => opt.value === filters.value.roomType)
    if (match?.id) {
      api.roomType = match.id
    }
  }

  // Rate type
  if (filters.value.rateType) {
    api.rateType = filters.value.rateType
  }

  // Status (reservation type)
  if (filters.value.reservationType) {
    api.reservationType = filters.value.reservationType
  }

  // Source
  if (filters.value.source) {
    api.source = filters.value.source
  }

  const showToggles :any = []
  if (filters.value.show.web) showToggles.push('web')
  if (filters.value.show.channel) showToggles.push('channel')
  if (filters.value.show.pms) showToggles.push('pms')

  if (showToggles.length > 0 && showToggles.length < 3) {
    api.showBookings = showToggles.join(',')
  }

  // Date range based on dateType
  const start = filters.value.dateRange?.start
  const end = filters.value.dateRange?.end

  if (start && end) {
    api.dateType = filters.value.dateType
    api.dateStart = start
    api.dateEnd = end
  }

  // Stay range
  const stayStart = filters.value.stayRange?.start
  const stayEnd = filters.value.stayRange?.end

  if (stayStart && stayEnd) {
    api.stayCheckInDate = stayStart
    api.stayCheckOutDate  = stayEnd
  }



  // Debug pour voir ce qui est envoyé
  console.log('API Filters:', api)

  return api
}



const onSearch = () => {
  const apiFilters = mapFiltersToApi()
   console.log('Filters envoyés:', apiFilters)
  applyFilter(apiFilters)
}

const resetFilters = () => {
  filters.value = {
    guestName: '', reservationNumber: '', dateType: 'arrival',
    dateRange: { start: getTodayDate(), end: getTodayDate() },
    roomType: '', rateType: '', source: '', reservationType: '',
    stayRange: { start: '', end: '' },
    incompleteOnly: false, show: { web: true, channel: true, pms: true }
  }
}

const filter = ref<any>()

const refresh = () => {
  if (filter.value) applyFilter(filter.value)
}
onMounted(() => {
  // Load room types for AutoComplete
  const loadRoomTypes = async () => {
    try {
      isLoadingRoomTypes.value = true
      const start = filters.value.stayRange?.start || getTodayDate()
      const end = filters.value.stayRange?.end || getTodayDate()
      const resp = await getFrontofficeBookingDataId(start, end)
      const data = Array.isArray(resp.data?.data) ? resp.data.data : []
      roomTypesData.value = data
      roomTypeOptions.value = data.map((rt: any) => ({
        label: rt.roomTypeName,
        value: rt.id, // keep value as name so existing API mapping works
        id: rt.id,
      }))
    } catch (e) {
      console.error('Error fetching room types:', e)
    } finally {
      isLoadingRoomTypes.value = false
    }
  }

  loadRoomTypes()

  filter.value = {
    checkInDate: getTodayDate(),
    checkOutDate: getTodayDate(),
    roomType: null,
    searchText: '',
    status: '',
  }
  refresh()
})

// When Room Type changes, prepare Rate Types from loaded frontoffice data
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
</script>

<style scoped></style>
