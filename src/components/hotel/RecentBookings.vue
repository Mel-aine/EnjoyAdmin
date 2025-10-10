<template>
  <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold dark:text-white">{{ $t('recent_booking') }}</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 dark:bg-gray-600">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('customer') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('Room') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('ArrivedDate') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('DepartDate') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('Status') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('amount') }}</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-600">
          <tr v-for="(booking, index) in paginatedBookings" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-sm">
                    {{ getInitials(booking.guest) }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ booking.guest }}</div>
                  <div class="text-sm text-gray-500">{{ booking.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ booking.room }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ booking.checkin }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ booking.checkout }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(booking.status)">
                {{$t(`${booking.status}`) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(booking.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-500">
        {{ $t('showing') }} {{ start }} {{ $t('to') }} {{ end }} {{ $t('of') }} {{ total }} {{ $t('Bookings') }}
      </div>
      <div class="flex space-x-2">
        <button
          class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          {{ $t('previous') }}
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          :class="{ 'bg-blue-50 text-blue-600 border-blue-300': page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button
          class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          {{ $t('next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {formatCurrency} from '../utilities/UtilitiesFunction'

const props = defineProps<{
  recentBookings: any[]
}>()

const currentPage = ref(1)
const itemsPerPage = 8

const total = computed(() => props.recentBookings.length)
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage))
const start = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const end = computed(() => Math.min(currentPage.value * itemsPerPage, total.value))

// Booking affichés pour la page courante
const paginatedBookings = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return props.recentBookings.slice(startIndex, startIndex + itemsPerPage)
})

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const getStatusClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'reserved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
      case 'checked_in':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
