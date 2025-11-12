<template>
  <ChannelManagerLayout>
    <div class="h-full">
      <div class="flex justify-end" v-if="!currentService.channexPropertyId">
        <BasicButton
          :label="isLoading ? t('configuration.channelManager.common.migrating') : t('configuration.channelManager.migrateHotelData')"
          :loading="isLoading" variant="secondary" @click="handleMigrate" />
      </div>
    </div>
    <!-- Filters and Column Manager -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3 p-3">
      <div class=" gap-4">
        <div class="grid grid-cols-7 gap-3 mb-4">
          <!-- Guest Name -->
          <FormInput lb="Guest Name" v-model="filters.guestName" placeholder="Enter name" />

          <!-- Reservation Number -->
          <FormInput lb="Res No" v-model="filters.reservationNumber" placeholder="Enter number" />

          <div class="col-span-2 flex">
            <div>
              <!-- Date Type -->
              <FormSelect lb="Date" v-model="filters.dateType" :options="dateTypeOptions" placeholder="--Select--" />
            </div>

            <div class="w-full"> <!-- Date range using custom double date picker -->
              <InputDoubleDatePicker title="Selected Period" v-model="filters.dateRange" />
            </div>
          </div>

          <!-- Room Type (AutoComplete) -->
          <AutoCompleteSelect v-model="filters.roomType" :options="roomTypeOptions" :defaultValue="'Select Room Type'"
            :lb="'Room Type'" :is-required="false" :use-dropdown="true" :isLoading="isLoadingRoomTypes"
            @update:modelValue="onRoomTypeChange" />

          <!-- Rate Type (AutoComplete, depends on Room Type) -->
          <AutoCompleteSelect v-model="filters.rateType" :options="rateTypeOptions" :defaultValue="'Select Rate Type'"
            :lb="'Rate Type'" :is-required="false" :use-dropdown="true" :disabled="!selectedRoomTypeId"
            :isLoading="isLoadingRateTypes" />

          <!-- Source -->
          <FormSelect lb="Source" v-model="filters.source" :options="sourceOptions" placeholder="--Select--" />
        </div>
        <div class="grid grid-cols-4 gap-3">
          <div class="flex">
            <!-- Reservation Type -->
            <div>
              <FormSelect lb="Type" v-model="filters.reservationType" :options="reservationTypeOptions"
                placeholder="--Select--" />
            </div>

            <div class="w-full">
              <!-- Stay Date range using double date picker -->
              <InputDoubleDatePicker title="Stay Date" v-model="filters.stayRange" />
            </div>
          </div>

          <!-- Show Bookings -->
          <div class="flex items-center gap-3 align-middle self-end content-end">
            <span class="text-xs text-gray-600 dark:text-gray-300">Show Bookings:</span>
            <Toggle title="Web" v-model="filters.show.web" />
            <Toggle title="Channel" v-model="filters.show.channel" />
            <Toggle title="PMS" v-model="filters.show.pms" />
          </div>

          <!-- Buttons + Dropdown Column Manager -->
          <div class="ml-auto relative flex gap-2 col-span-2 justify-end self-end content-center">
            <BasicButton variant="secondary" :label="'Reset'" @click="resetFilters" />
            <BasicButton variant="primary" :label="'Manage Columns'" @click="toggleColumnManager" />
            <BasicButton variant="primary" :label="'Search'" @click="onSearch" />

            <!-- Dropdown Column Manager -->
            <div v-if="showColumnPanel" class="absolute right-0 mt-2 w-96 z-50 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <div class="flex justify-between items-center px-3 py-2">
                <span class="text-sm font-medium">Select Columns (max {{ maxColumns }})</span>
                <span class="text-xs text-gray-600 dark:text-gray-300">Selected: {{ selectedColumnsModel.length }}/{{ maxColumns }}</span>
              </div>
              <div class="px-3 pb-3">
                <MultipleSelect :lb="'Columns'" v-model="selectedColumnsModel" :options="columnOptions" :max-visible-tags="6" :default-display-mode="'limited'" />
                <div class="flex justify-end gap-2 mt-2">
                  <BasicButton variant="secondary" :label="'Close'" @click="showColumnPanel = false" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div>
      <ReusableTable :showHeader="false" :columns="tableColumns" :data="paginatedReservations" :searchable="false"
        :empty-state-title="$t('No reservations')" :loading="loading"
        :empty-state-description="$t('Get started by creating a new reservation.')" :title="$t('Reservations')">
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

        <!-- Custom column for status -->
        <template #column-status="{ item }">
          <div class="flex-col gap-1 inline-flex">
            <ReservationStatus :status="item.status" />
          </div>
        </template>
        <template #column-source="{ item }">
          <img v-if="getOtaIcon(item)" :src="getOtaIcon(item)" alt="OTA" class="w-8 h-8" />
          <Building2Icon v-else class="w-8 h-8 text-primary" />
        </template>


      </ReusableTable>
    </div>
  </ChannelManagerLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted,watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { Building2Icon } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { migrateCompleteHotel, getBookings } from '@/services/channelManagerApi'
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
const allReservation = ref([])
const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allReservation.value.slice(start, end)
})
const currentPage = ref(1)
const pageSize = ref(20)
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const isLoading = ref(false);
const loading = ref(false);
const currentService = useServiceStore().getCurrentService;
const handleMigrate = async () => {
  try {
    isLoading.value = true
    const res = await migrateCompleteHotel()
    const message = res?.data?.message || t('configuration.channelManager.common.success')
    toast.success(message)
  } catch (error: any) {
    const message = error?.response?.data?.message || t('configuration.channelManager.migrationError')
    toast.error(message)
    console.error('migrateCompleteHotel error:', error)
  } finally {
    isLoading.value = false
  }
}
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

        return {
          ...res,
          date: res.arrivedDate,
          dateD: res.departDate,
          email: user?.email || '',
          phone: user?.phoneNumber || '',
          userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
        }
      })

      allReservation.value = mappedReservations
    }
  } catch (error) {
    console.error('Error filtering reservations:', error)
    toast.error(t('Error loading reservations'))
  } finally {
    loading.value = false
  }
}
// Column manager
const maxColumns = 10
const showColumnPanel = ref(false)
const availableColumns: Column[] = [
  { key: 'reservationNumber', label: 'Res No', type: 'custom' },
  { key: 'bookingDate', label: 'Booking Date', type: 'date' },
  { key: 'guest', label: 'Guest Name', type: 'custom' },
  { key: 'dates', label: 'Dates', type: 'custom' },
  { key: 'room.name', label: 'Room', type: 'text' },
  { key: 'rateType.name', label: 'Rate Type', type: 'text' },
  { key: 'pax', label: 'Pax', type: 'text' },
  { key: 'totalAmount', label: 'Total', type: 'custom' },
  { key: 'balanceSummary.adr', label: 'ADR', type: 'text' },
  { key: 'deposit', label: 'Deposit', type: 'text' },
  { key: 'source', label: 'Source', type: 'custom' },
  { key: 'balanceSummary.totalTaxes', label: 'Total Tax', type: 'text' },
  { key: 'balanceSummary.totalCharges', label: 'Total Charges', type: 'text' },
  { key: 'commission', label: 'Commission', type: 'text' },
  { key: 'voucher', label: 'Voucher', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' },
  { key: 'dueAmount', label: 'Due Amt.', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Mobile No', type: 'text' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'country', label: 'Country', type: 'text' },
  { key: 'zipCode', label: 'Zip Code', type: 'text' },
  { key: 'state', label: 'State', type: 'text' },
  { key: 'folioNumber', label: 'Folio No', type: 'text' },
  { key: 'preference', label: 'Preference', type: 'text' },
  { key: 'userFullName', label: 'User', type: 'text' },
  { key: 'travelAgent', label: 'Travel Agent', type: 'text' },
  { key: 'reservationType', label: 'Reservation Type', type: 'text' },
  { key: 'paymentStatus', label: 'Payment', type: 'badge' },
  { key: 'nights', label: 'No Of Nights', type: 'text' },
  { key: 'bookingTime', label: 'Booking Time', type: 'text' }
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
    reservationNumber: { key: 'reservationNumber', label: 'Res No', type: 'custom' },
    guest: { key: 'guest', label: 'Guest Name', type: 'custom' },
    dates: { key: 'dates', label: 'Dates', type: 'custom' },
    totalAmount: { key: 'totalAmount', label: 'Total', type: 'custom' },
    status: { key: 'status', label: 'Status', type: 'custom' }
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
  stayRange: { start: getTodayDate(), end: getTodayDate() },
  incompleteOnly: false,
  show: { web: true, channel: true, pms: true }
})

const dateTypeOptions = [
  { label: 'Created', value: 'created' },
  { label: 'Arrival', value: 'arrival' },
  { label: 'Departure', value: 'departure' },
  { label: 'Cancelled', value: 'cancelled' }
]

// Dynamic options for Room Type / Rate Type
const roomTypeOptions = ref<any[]>([])
const rateTypeOptions = ref<any[]>([])
const isLoadingRoomTypes = ref(false)
const isLoadingRateTypes = ref(false)
const selectedRoomTypeId = ref<number | null>(null)
const roomTypesData = ref<any[]>([])
const sourceOptions = ref([
  { value: 'web', label: 'Web' },
  { value: 'channel', label: 'Channel' },
  { value: 'pms', label: 'PMS' }
])
const reservationTypeOptions = ref([
  { value: 'confirm_booking', label: 'Confirm Booking' },
  { value: 'hold_confirm_booking', label: 'Hold Confirm Booking' },
  { value: 'hold_unconfirm_booking', label: 'Hold Unconfirm Booking' },
  { value: 'online_failed_booking', label: 'Online Failed Booking' },
  { value: 'released', label: 'Released' },
  { value: 'unconfirmed_booking_inquiry', label: 'Unconfirmed Booking Inquiry' }
])

// const mapFiltersToApi = () => {
//   const api: any = {}

//   // Texte de recherche (guest name ou reservation number)
//   const searchText = filters.value.guestName || filters.value.reservationNumber
//   if (searchText) {
//     api.searchText = searchText
//   }

//   // Room type
//   if (filters.value.roomType) {
//     api.roomType = filters.value.roomType
//   }

//   // Status (reservation type)
//   if (filters.value.reservationType) {
//     api.status = filters.value.reservationType
//   }

//   // Source
//   if (filters.value.source) {
//     api.source = filters.value.source
//   }

//   const start = filters.value.dateRange?.start
//   const end = filters.value.dateRange?.end
//   const stayStart = filters.value.stayRange?.start
//   const stayEnd = filters.value.stayRange?.end

//   // Prefer explicit stay range if provided
//   if (stayStart && stayEnd) {
//     api.checkInDate = stayStart
//     api.checkOutDate = stayEnd
//   } else if (start && end) {
//     if (filters.value.dateType === 'arrival') {
//       api.checkInDate = start
//       api.checkOutDate = end
//     } else if (filters.value.dateType === 'departure') {
//       api.checkInDate = start
//       api.checkOutDate = end
//     }
//   }

//   return api
// }

const mapFiltersToApi = () => {
  const api: any = {}

  // Combiner Guest name ET Reservation number dans searchText
  const searchTerms = []
  if (filters.value.guestName) {
    searchTerms.push(filters.value.guestName)
  }
  if (filters.value.reservationNumber) {
    searchTerms.push(filters.value.reservationNumber)
  }
  if (searchTerms.length > 0) {
    api.searchText = searchTerms.join(' ') // ou juste le premier : searchTerms[0]
  }

  // Room type - envoyer l'ID au lieu du nom
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
    api.status = filters.value.reservationType
  }

  // Source
  if (filters.value.source) {
    api.source = filters.value.source
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
    api.stayCheckOutDate = stayEnd
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
    stayRange: { start: getTodayDate(), end: getTodayDate() },
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
