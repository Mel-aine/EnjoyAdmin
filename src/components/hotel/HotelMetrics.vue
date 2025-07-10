<template>
    <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-700">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">{{ $t('hotel_metric') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Taux d'occupation -->
        <div class="p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ $t('occupancy_rate') }}</p>
              <h3 class="text-2xl font-bold text-blue-600">{{ occupancyRate }}</h3>
              <p class="text-xs" :class="(occupancyTrend ?? 0)> 0 ? 'text-green-500' : 'text-red-500'">
                <span v-if="(occupancyTrend ?? 0)> 0">+</span>{{ occupancyTrend }}% vs {{ $t('last_week') }}
              </p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Revenu moyen par chambre -->
        <div class="p-4 bg-green-50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">RevPAR</p>
              <h3 class="text-2xl font-bold text-green-600">{{ revPAR }} XAF</h3>

              <p class="text-xs" :class="(revPARTrend ?? 0) > 0 ? 'text-green-500' : 'text-red-500'">
                <span v-if="(Number(revPARTrend )?? 0)  > 0">+</span>{{ revPARTrend }}% vs {{ $t('last_month') }}
              </p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Durée moyenne de séjour -->
        <div class="p-4 bg-purple-50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ $t('average_day') }}</p>
              <h3 class="text-2xl font-bold text-purple-600">{{ avgStayDuration }} </h3>
              <p class="text-xs" :class="(avgStayTrend ?? 0)  > 0 ? 'text-green-500' : 'text-red-500'">
                <span v-if="(avgStayTrend ?? 0)  > 0">+</span>{{ avgStayTrend }}% vs {{ $t('last_year') }}
              </p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Chambres disponibles -->
        <div class="p-4 bg-amber-50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ $t('room_available') }}</p>
              <h3 class="text-2xl font-bold text-amber-600">{{ availableRooms }}/{{ totalRooms }}</h3>
              <p class="text-xs text-gray-500">
                {{ roomsBookedToday }} {{ $t('reserved_today') }}
              </p>
            </div>
            <div class="bg-amber-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  // import { ref } from 'vue'
  import { defineProps } from 'vue'

defineProps<{
  occupancyRate?: string
  occupancyTrend?: number
  revPAR?: number
  revPARTrend?: number
  avgStayDuration?: string
  avgStayTrend?: number
  availableRooms?: number
  totalRooms?: number
  roomsBookedToday?: number
}>()

  // const occupancyRate = ref(76)
  // const occupancyTrend = ref(4.2)

  // const revPAR = ref(112)
  // const revPARTrend = ref(5.8)

  // const avgStayDuration = ref(3.2)
  // const avgStayTrend = ref(-0.5)

  // const availableRooms = ref(28)
  // const totalRooms = ref(120)
  // const roomsBookedToday = ref(15)
  </script>
