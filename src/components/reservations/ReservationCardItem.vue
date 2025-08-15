<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtomDropdownAction from '../common/ButtomDropdownAction.vue';
import { ArrowUpDown, Calendar, CheckCircle, CreditCard, Eye, HouseIcon, List, StopCircle, Trash2, UserMinus, X } from 'lucide-vue-next';
import { computed } from 'vue';
import { formatCurrency, formatTime } from '../utilities/UtilitiesFunction';
import router from '../../router';
import Child from '../../icons/Child.vue';
import Adult from '../../icons/Adult.vue';
const { t, locale } = useI18n({ useScope: 'global' })
const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
})
const dropdownOptions = computed(() => [
  { id: 'view', label: t('view'), icon: Eye, color: 'text-blue-600' },
  { id: 'check-in', label: t('Check-in'), icon: CheckCircle, color: 'text-blue-600' },
  { id: 'add-payment', label: t('Add Payment'), icon: CreditCard, color: 'text-green-600' },
  { id: 'amend-stay', label: t('Amend Stay'), icon: Calendar, color: 'text-purple-600' },
  { id: 'room-move', label: t('Room Move'), icon: ArrowUpDown, color: 'text-orange-600' },
  { id: 'exchange-room', label: t('Exchange Room'), icon: ArrowUpDown, color: 'text-indigo-600' },
  { id: 'stop-room-move', label: t('Stop Room Move'), icon: StopCircle, color: 'text-red-600' },
  { id: 'inclusion-list', label: t('Inclusion List'), icon: List, color: 'text-gray-600' },
  { id: 'cancel-reservation', label: t('Cancel Reservation'), icon: X, color: 'text-red-600' },
  { id: 'no-show', label: t('No Show'), icon: Eye, color: 'text-yellow-600' },
  { id: 'void-reservation', label: t('Void Reservation'), icon: Trash2, color: 'text-red-700' },
  { id: 'unassign-room', label: t('Unassign Room'), icon: UserMinus, color: 'text-gray-600' },
]);

const handleOptionSelected = (option: any) => {
  console.log('Selected option:', option);
  if (option.id === 'view') {
    router.push({
      name: 'ReservationDetails',
      params: { id: props.reservation.id }
    })

  }

};
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}
</script>

<template>
  <div class="z-10">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-visible group">
      <!-- Card Header -->
      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center align-middle self-center gap-2">
            <HouseIcon class="w-8 h-8 text-primary" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate capitalize">
                {{ reservation.userFullName }}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                #{{ reservation.reservationNumber }}
              </p>
            </div>
          </div>
          <div class="flex gap-1">
            <ButtomDropdownAction :id="reservation.id" :options="dropdownOptions"
              @option-selected="handleOptionSelected" />

          </div>
        </div>

      </div>
      <div class="grid grid-cols-8 px-4">
        <div class="flex col-span-3 items-center p-2 flex-col bg-gray-100">
          <span>{{ formatDate(reservation.date) }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ formatTime(reservation.date) }}
          </span>
        </div>
        <div class="flex col-span-2 items-center p-2 flex-col bg-gray-300">
          <span>{{ reservation.nights }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ $t('nights') }}
          </span>
        </div>
        <div class="flex items-center col-span-3 p-2 flex-col bg-gray-100">
          <span>{{ formatDate(reservation.departDate) }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ formatTime(reservation.departDate) }}
          </span>
        </div>

      </div>
      <!-- Card Body -->
      <div class="p-4 space-y-3">
        <!-- Dates -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class=" font-semibold">{{ $t('booking_date') }}</span>
            <span class="text-xs">{{ formatDate(reservation.date) }}</span>
          </div>
          <div class="flex gap-2">
            <div class="flex items-center">
              <Adult class="w-6 h-10" /><span class="pt-2 text-sm">{{ reservation.adults }}</span>
            </div>
            <div class="flex items-center">
              <Child class="w-5 h-10" /><span class="pt-2 text-sm">{{ reservation.child??0 }}</span>
            </div>
          </div>

        </div>

        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class=" font-semibold">Room/Rate type</span>
            <span class="text-xs">{{ reservation.roomType ?? 'N/A' }}/{{ reservation.roomType ?? 'N/A' }}</span>
          </div>
          <div class="flex gap-1">
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              reservation.statusColor.bg,
              reservation.statusColor.text
            ]">
              {{ reservation.statusColor.label }}
            </span>
          </div>
        </div>

        <!-- Amount and Payment Status -->
        <div class=" flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
          <div class="flex justify-between">
            <span class=" font-medium">Total</span>
            <span class="text-sm">{{ formatCurrency(reservation.totalAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class=" font-medium">{{ $t('paid') }}</span>
            <span class="text-sm">{{ formatCurrency(reservation.paidAmount) }}</span>
          </div>
          <div class="flex justify-between text-primary">
            <span class=" font-medium">{{ $t('balance') }}</span>
            <span class="text-sm">{{ formatCurrency(reservation.remainingAmount) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>