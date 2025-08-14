<template>
  <div class="bg-white rounded-lg shadow-md p-6 mx-4 mt-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ $t('Booking Details') }}
      </h2>
      <button 
        @click="editMode = !editMode"
        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PencilIcon class="w-4 h-4 mr-2" />
        {{ editMode ? $t('Cancel') : $t('Edit') }}
      </button>
    </div>

    <!-- Booking Information Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Reservation Details -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('Reservation Information') }}
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Reservation Number') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ bookingData.reservationNumber }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Booking Date') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(bookingData.bookingDate) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Status') }}:</span>
            <span :class="getStatusClass(bookingData.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ $t(bookingData.status) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Booking Source') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(bookingData.bookingSource) }}</span>
          </div>
        </div>
      </div>

      <!-- Stay Details -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('Stay Information') }}
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Check-in Date') }}:</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(bookingData.checkinDate) }}</span>
              <PencilIcon v-if="editMode" class="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Check-out Date') }}:</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(bookingData.checkoutDate) }}</span>
              <PencilIcon v-if="editMode" class="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Number of Nights') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ bookingData.nights }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Total Guests') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ bookingData.adults }} {{ $t('Adults') }}, {{ bookingData.children }} {{ $t('Children') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Room Details -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('Room Information') }}
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Room Number') }}:</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ bookingData.roomNumber || 'Not Assigned' }}</span>
              <PencilIcon v-if="editMode" class="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Room Type') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(bookingData.roomType) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Rate Plan') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(bookingData.ratePlan) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Room Rate') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(bookingData.roomRate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {{ $t('Financial Summary') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(bookingData.totalAmount) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Total Amount') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ formatCurrency(bookingData.paidAmount) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Paid Amount') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(bookingData.balanceAmount) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Balance Amount') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ formatCurrency(bookingData.depositAmount) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Deposit Amount') }}</div>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Special Requests -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('Special Requests') }}
        </h3>
        <div v-if="bookingData.specialRequests" class="text-sm text-gray-700 dark:text-gray-300">
          {{ bookingData.specialRequests }}
        </div>
        <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
          {{ $t('No special requests') }}
        </div>
      </div>

      <!-- Booking Notes -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('Booking Notes') }}
        </h3>
        <div v-if="bookingData.notes" class="text-sm text-gray-700 dark:text-gray-300">
          {{ bookingData.notes }}
        </div>
        <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
          {{ $t('No booking notes') }}
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="editMode" class="mt-6 flex justify-end space-x-3">
      <button 
        @click="editMode = false"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ $t('Cancel') }}
      </button>
      <button 
        @click="saveChanges"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ $t('Save Changes') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PencilIcon } from 'lucide-vue-next'

interface BookingData {
  reservationNumber: string
  bookingDate: string
  status: string
  bookingSource: string
  checkinDate: string
  checkoutDate: string
  nights: number
  adults: number
  children: number
  roomNumber?: string
  roomType: string
  ratePlan: string
  roomRate: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  depositAmount: number
  specialRequests?: string
  notes?: string
}

interface Props {
  booking?: BookingData
}

const props = withDefaults(defineProps<Props>(), {
  booking: () => ({
    reservationNumber: 'RES-2024-001',
    bookingDate: '2024-01-15',
    status: 'confirmed',
    bookingSource: 'online',
    checkinDate: '2024-02-01',
    checkoutDate: '2024-02-05',
    nights: 4,
    adults: 2,
    children: 1,
    roomNumber: '101',
    roomType: 'deluxe',
    ratePlan: 'standard',
    roomRate: 150.00,
    totalAmount: 600.00,
    paidAmount: 200.00,
    balanceAmount: 400.00,
    depositAmount: 200.00,
    specialRequests: 'Late check-in requested',
    notes: 'VIP guest - provide welcome amenities'
  })
})

const { t, locale } = useI18n()
const editMode = ref(false)

const bookingData = computed(() => props.booking)

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    checked_in: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    checked_out: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}

const saveChanges = () => {
  // Implement save logic here
  console.log('Saving booking changes...')
  editMode.value = false
}
</script>

<style scoped>
/* Add any custom styles here */
</style>