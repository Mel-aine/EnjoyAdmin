<template>
  <RightSideModal :is-open="isOpen" :title="$t('Reservation Details')" @close="closeModal"  size="2xl">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ $t('Reservation') }} #{{ reservationData?.reservationNumber }}
        </h3>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="getStatusBadgeClass(reservationData?.status)"
        >
          {{ $t(`${reservationData?.status}`) }}
        </span>
      </div>
    </template>

    <div v-if="reservationData" class="px-4 space-y-6 text-gray-900 dark:text-gray-100 ">

      <!-- Guest Information Section -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ $t('guest_info') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <DetailField :label="$t('Guest Name')" :value="reservationData?.guest?.displayName" />
          <DetailField :label="$t('Email')" :value="reservationData?.email" type="email" />
          <DetailField :label="$t('Mobile No')" :value="reservationData?.mobileNo" />
          <DetailField :label="$t('City')" :value="reservationData?.city" />
          <DetailField :label="$t('State')" :value="reservationData?.state" />
          <DetailField :label="$t('Country')" :value="reservationData?.country" />
          <DetailField :label="$t('Zip Code')" :value="reservationData?.zipCode" />
        </div>
      </div>

      <!-- Booking Information Section -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ $t('Booking Information') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <DetailField :label="$t('Booking Date')" :value="formatDate(reservationData?.bookingDate)" />
          <DetailField :label="$t('Booking Time')" :value="reservationData?.bookingTime" />
          <DetailField :label="$t('Arrival Date')" :value="formatDate(reservationData?.arrivalDate || reservationData?.date)" />
          <DetailField :label="$t('Departure Date')" :value="formatDate(reservationData?.departureDate || reservationData?.dateD)" />
          <DetailField :label="$t('No Of Nights')" :value="reservationData?.numberOfNights" />
          <DetailField :label="$t('No of Rooms Booked')" :value="reservationData?.numberOfRoomsBooked" />
          <DetailField :label="$t('Pax')" :value="reservationData?.pax" />
        </div>
      </div>

      <!-- Room & Rate Information Section -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ $t('Room & Rate Information') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <DetailField :label="$t('Room')" :value="reservationData?.room" />
          <DetailField :label="$t('Rate Type')" :value="reservationData?.rateType" />
          <DetailField :label="$t('Preference')" :value="reservationData?.preference" />
        </div>
      </div>

      <!-- Financial Information Section -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ $t('Financial Information') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <DetailField :label="$t('Total Amount')" :value="formatCurrency(reservationData?.balanceSummary?.totalChargesWithTaxes)" />
          <DetailField :label="$t('ADR')" :value="formatCurrency(reservationData?.balanceSummary?.adr)" />
          <DetailField :label="$t('Total Charges')" :value="formatCurrency(reservationData?.balanceSummary?.totalCharges)" />
          <DetailField :label="$t('Total Tax')" :value="formatCurrency(reservationData?.balanceSummary?.totalTaxes)" />
          <DetailField :label="$t('Deposit')" :value="formatCurrency(reservationData?.deposit)" />
          <DetailField :label="$t('Due Amount')" :value="formatCurrency(reservationData?.dueAmount)" />
          <DetailField :label="$t('Commission')" :value="formatCurrency(reservationData?.commission)" />
          <DetailField :label="$t('Voucher')" :value="reservationData?.voucher" />
          <DetailField :label="$t('Payment Type')" :value="reservationData?.paymentType" />
        </div>
      </div>

      <!-- Extra Charges Section -->
      <div v-if="hasExtraCharges" class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {{ $t('Extra Charges') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(value, key) in getExtraCharges" :key="key" class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ key }}:</span>
            <span class="text-sm font-medium">{{ formatCurrency(value) }}</span>
          </div>
        </div>
      </div>

      <!-- Booking Source & Type Section -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $t('Booking Source & Type') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Source') }}:</span>
            <img v-if="otaIcon" :src="otaIcon" alt="OTA" class="w-8 h-8" />
            <svg v-else class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span class="text-sm font-medium">{{ reservationData?.source }}</span>
          </div>
          <DetailField :label="$t('Reservation Type')" :value="reservationData?.reservationType" />
          <DetailField :label="$t('Market Code')" :value="reservationData?.marketCode" />
          <DetailField :label="$t('Travel Agent')" :value="reservationData?.travelAgent" />
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ $t('Additional Information') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <DetailField :label="$t('Folio No')" :value="reservationData?.folioNo" />
          <DetailField :label="$t('User')" :value="reservationData?.userFullName" />
          <DetailField :label="$t('Sales Person')" :value="reservationData?.salesPerson" />
          <DetailField :label="$t('Last Modified')" :value="formatDate(reservationData?.lastModifiedDate)" />
          <DetailField :label="$t('Modified By')" :value="reservationData?.lastModifiedBy" />
          <DetailField v-if="reservationData?.cancellationDate" :label="$t('Cancellation Date')" :value="formatDate(reservationData?.cancellationDate)" />
        </div>
      </div>

      <!-- Remarks Section -->
      <div v-if="reservationData?.remark" class="pb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          {{ $t('Remarks') }}
        </h4>
        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ reservationData?.remark }}</p>
        </div>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Close')" />
        <BasicButton v-if="onEdit" variant="primary" @click="handleEdit" :label="$t('Edit Reservation')" />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import DetailField from '../bookingdetails/DetailField.vue'
import getOtaIconSrc from '@/utils/otaIcons'



interface Props {
  isOpen: boolean
  reservationData: any
  onEdit?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t, locale } = useI18n()

const closeModal = () => {
  emit('close')
}

const handleEdit = () => {
  if (props.onEdit) {
    props.onEdit()
  }
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '-'
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'XAF',
  }).format(amount)
}

const getStatusBadgeClass = (status: string) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'

  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'active':
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled':
    case 'voided':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const otaIcon = computed(() => {
  const data = props.reservationData
  if (!data) return null

  const name = data?.otaName || data?.bookingSourceName || data?.bookingSource?.name || data?.source || null
  return getOtaIconSrc(name)
})



const hasExtraCharges = computed(() => {
  const charges = props.reservationData?.extraCharges || props.reservationData?.extractCharge
  if (!charges) return false

  const chargesObj = typeof charges === 'string' ? JSON.parse(charges) : charges
  return Object.values(chargesObj).some((value: any) => parseFloat(value) > 0)
})

const getExtraCharges = computed(() => {
  const charges = props.reservationData?.extraCharges || props.reservationData?.extractCharge
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
})
</script>

<style scoped>
</style>
