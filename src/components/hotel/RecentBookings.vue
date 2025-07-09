<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">{{ $t('recent_booking') }}</h2>
        <!-- <div>
          <button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {{ $t('new_reservation') }}
          </button>
        </div> -->
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('customer') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('Room') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('ArrivedDate') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('DepartDate') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('Status') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('amount') }}</th>
              <!-- <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('Actions') }}</th> -->
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(booking, index) in recentBookings" :key="index" class="hover:bg-gray-50">
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
                  {{ booking.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ booking.amount }} FCFA</td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3">{{ $t('details') }}</button>
                <button class="text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-6">
        <div class="text-sm text-gray-500">
          {{ $t('showing') }} 1 {{ $t('to') }} 5 {{ $t('of') }} 42 {{ $t('Bookings') }}
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">{{ $t('previous') }}</button>
          <button class="px-3 py-1 text-sm border border-gray-300 rounded-md bg-blue-50 text-blue-600 border-blue-300">1</button>
          <button class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">2</button>
          <button class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">3</button>
          <button class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">{{ $t('next') }}</button>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">

import { formatDateT } from '../utilities/UtilitiesFunction'

  interface Booking {
    guest: string
    email: string
    room: string
    checkin: string
    checkout: string
    status: string
    amount: number
  }

  const props = defineProps<{
  recentBookings: any[]
}>()


  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
  }

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  </script>
