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
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(bookingData.createdAt) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Status') }}:</span>
            <span :class="getStatusClass(bookingData.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ $t(bookingData.status) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Booking Source') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(bookingData.bookingSource??"") }}</span>
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
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(bookingData.arrivedDate) }}</span>
              <PencilIcon v-if="editMode" class="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Check-out Date') }}:</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(bookingData.departDate) }}</span>
              <PencilIcon v-if="editMode" class="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Number of Nights') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ bookingData.nights?? bookingData.numberOfNights }}</span>
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
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                <span v-for="value in roomRateTypeSummary" :key="value">{{ value }}</span>
              </span>
              <PencilIcon v-if="editMode" class="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Room Type') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              <span v-for="value in roomTypeSumarry" :key="value">{{ value }} </span>
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Rate Plan') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              <span v-for="value in ratePlan" :key="value">{{ value }} </span>
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Room Rate') }}:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(roomRates??0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {{ $t('Financial Summary') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(bookingData.balanceSummary?.totalChargesWithTaxes??0) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Total Amount') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ formatCurrency(bookingData.balanceSummary?.totalPayments) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Paid Amount') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(bookingData.balanceSummary?.outstandingBalance??0) }}</div>
          <div class="text-sm text-orange-600 dark:text-gray-400">{{ $t('Balance Amount') }}</div>
        </div>
         <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ formatCurrency(bookingData.balanceSummary?.totalTaxes??0) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('taxAmount') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(bookingData.depositAmount??0) }}</div>
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
import { formatCurrency } from '../../utilities/UtilitiesFunction'

interface Props {
  booking?: any
}

const props = withDefaults(defineProps<Props>(), {
  booking: () => ({})
})

const { t, locale } = useI18n()
const editMode = ref(false)
console.log('booking', props.booking)
const bookingData = computed(() => props.booking)

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
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

const roomRateTypeSummary = computed(() => {
    if (!props.booking?.reservationRooms || props.booking.reservationRooms.length === 0) {
        return 'N/A';
    }

    const reservationRooms = props.booking.reservationRooms;

    // Get room numbers and create summary
    const roomNumbers = reservationRooms.map((room: any) => {
        return `${room.room?.roomNumber}/${room.roomType.roomTypeName}`
    })



    return roomNumbers;
});

const ratePlan = computed(() => {
    if (!props.booking?.reservationRooms || props.booking.reservationRooms.length === 0) {
        return 'N/A';
    }

    const reservationRooms = props.booking.reservationRooms;

    // Get room numbers and create summary
    const roomNumbers = reservationRooms.map((room: any) => {
        return `${room.roomRates?.rateType?.rateTypeName}`
    })
    return roomNumbers;
})


const roomTypeSumarry = computed(() => {
    if (!props.booking?.reservationRooms || props.booking.reservationRooms.length === 0) {
        return 'N/A';
    }

    const reservationRooms = props.booking.reservationRooms;

    // Get room numbers and create summary
    const roomNumbers = reservationRooms.map((room: any) => {
        return `${room.roomType?.roomTypeName}`
    })
    return roomNumbers;
})

const roomRates = computed(() => {
    if (!props.booking?.reservationRooms || props.booking.reservationRooms.length === 0) {
        return '0';
    }

    const reservationRooms = props.booking.reservationRooms;

    // Get room numbers and create summary
    const roomNumbers = reservationRooms[0].roomRate
    return roomNumbers;
})

console.log('booking',props.booking);
</script>

<style scoped>
/* Add any custom styles here */
</style>