<template>
  <FullScreenLayout>
    <OtaHeader :brand="brand" :currency="selectedCurrency" @currency-change="setCurrency" />
    <div class="max-w-6xl mx-auto px-4 pt-14 py-6">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div class="flex flex-wrap gap-3 items-end">
          <div class="flex flex-col">
            <label class="text-sm font-medium">{{ $t('arrival') }}</label>
            <InputDatePicker v-model="arrivalDate" class="bg-white rounded-lg w-44" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium">{{ $t('departure') }}</label>
            <InputDatePicker v-model="departureDate" class="bg-white rounded-lg w-44" />
          </div>
          <!-- Adults/Children selectors removed per requirement -->
          <button @click="searchRooms" class="bg-primary text-white rounded px-4 py-2 h-10">
            Check Availability
          </button>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-500">{{ $t('nights') }}: {{ nights }}</div>
          <div class="text-xs text-gray-500">{{ $t('guests') }}: {{ adults }} {{ $t('adults') }}, {{ children }} {{ $t('children') }}</div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div class="space-y-4">
          <div v-for="room in filteredRooms" :key="room.id" class="bg-white rounded-lg shadow border p-4">
            <div class="flex items-start justify-between">
              <div class="flex flex-col">
                <h2 class="text-lg font-semibold">{{ room.name }}</h2>
                <div class="text-xs text-gray-500">{{ room.description }}</div>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-600">{{ $t('Rooms Left') }}:</span>
                <span class="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{{ room.roomsLeft }}</span>
              </div>
            </div>

            <div class="mt-4 grid md:grid-cols-1 gap-4">
              <RatePlanCard v-for="plan in room.ratePlans" :key="plan.id" :room="room" :plan="plan" :nights="nights" :currency="selectedCurrency" @add="handleAddRoom" @remove="handleRemoveRoom" />
            </div>
          </div>

          <div v-if="filteredRooms.length === 0" class="text-center text-gray-500 py-8">
            {{ $t('No rooms found for the selected criteria.') }}
          </div>
        </div>

        <BookingSummary :items="summaryItems" :arrivalDate="arrivalDate" :departureDate="departureDate" :nights="nights" @book="bookFromSummary" @remove="removeSummaryItem" />
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import RatePlanCard from './components/RatePlanCard.vue'
import BookingSummary from './components/BookingSummary.vue'
import OtaHeader from './components/OtaHeader.vue'

const router = useRouter()
const { t } = useI18n()

const brand = 'TAMI SARL (SUITA HOTEL)'
const selectedCurrency = ref<string>('XAF')
function setCurrency(c: string) {
  selectedCurrency.value = c
}

const arrivalDate = ref<string>(new Date().toISOString().split('T')[0])
const departureDate = ref<string>(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
const adults = ref<number>(1)
const children = ref<number>(0)

const nights = computed(() => {
  const start = new Date(arrivalDate.value)
  const end = new Date(departureDate.value)
  const ms = Math.max(end.getTime() - start.getTime(), 0)
  return Math.max(Math.ceil(ms / (1000 * 60 * 60 * 24)), 1)
})

// Mock rooms data to mimic OTA preview UI
const rooms = ref([
  {
    id: 1,
    name: 'Lifestyle Suite',
    description: t('Spacious suite with modern amenities'),
    roomsLeft: 1,
    capacity: { adults: 2, children: 1 },
    ratePlans: [
      { id: 'ls-room-only', name: 'Room Only', features: [t('Room Rates Inclusive of Tax')], policies: [], price: 110000 },
      { id: 'ls-bb', name: 'B&B', features: [t('Breakfast included'), t('Free Cancellation'), t('Pay at the hotel')], policies: [], price: 133500 },
      { id: 'ls-weekly', name: 'Lifestyle Weekly', features: [t('Pay at the hotel'), t('Free Cancellation')], policies: [], price: 887220, minNights: 7 },
    ]
  },
  {
    id: 2,
    name: 'Home Suite Home',
    description: t('Comfortable suite great for families'),
    roomsLeft: 30,
    capacity: { adults: 4, children: 1 },
    ratePlans: [
      { id: 'hsh-bb', name: 'B&B', features: [t('Breakfast included'), t('Free Cancellation'), t('Pay at the hotel')], policies: [], price: 208500 },
      { id: 'hsh-room-only', name: 'Room Only', features: [t('Room Rates Inclusive of Tax')], policies: [], price: 216000 },
    ]
  }
])

const filteredRooms = computed(() => {
  // For now, we return all. Hook filters here if needed.
  return rooms.value
})

function searchRooms() {
  // Placeholder: integrate with an API later
  // Use arrivalDate, departureDate, adults, children to fetch availability
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
}

function enquire(room: any, plan: any) {
  // Placeholder: could open an enquiry modal or route to a contact page
  alert(`${t('Enquiry for')} ${room.name} - ${plan.name}`)
}

function book(room: any, plan: any) {
  // Navigate to OTA checkout with preselected query params
  router.push({
    path: '/ota/checkout',
    query: {
      roomName: room.name,
      plan: plan.name,
      price: plan.price,
      arrival: arrivalDate.value,
      departure: departureDate.value,
      adults: adults.value.toString(),
      children: children.value.toString(),
      nights: nights.value.toString(),
    }
  })
}

const summaryItems = ref<Array<{ roomName: string; planName: string; planPrice: number; adults: number; children: number; qty: number }>>([])

function handleAddRoom(payload: any) {
  const { room, plan, adults = 1, children = 0 } = payload || {}
  const keyRoom = room?.name ?? 'Room'
  const keyPlan = plan?.name ?? 'Plan'
  const idx = summaryItems.value.findIndex(it => it.roomName === keyRoom && it.planName === keyPlan)
  if (idx !== -1) {
    const cap = room?.roomsLeft ?? Infinity
    summaryItems.value[idx].qty = Math.min((summaryItems.value[idx].qty || 0) + 1, cap)
  } else {
    summaryItems.value.push({
      roomName: keyRoom,
      planName: keyPlan,
      planPrice: plan?.price ?? 0,
      adults,
      children,
      qty: 1,
    })
  }
}

function handleRemoveRoom(payload: any) {
  const { room, plan } = payload || {}
  const keyRoom = room?.name ?? 'Room'
  const keyPlan = plan?.name ?? 'Plan'
  const idx = summaryItems.value.findIndex(it => it.roomName === keyRoom && it.planName === keyPlan)
  if (idx !== -1) {
    const next = (summaryItems.value[idx].qty || 1) - 1
    if (next <= 0) summaryItems.value.splice(idx, 1)
    else summaryItems.value[idx].qty = next
  }
}

function removeSummaryItem(index: number) {
  if (index >= 0 && index < summaryItems.value.length) {
    summaryItems.value.splice(index, 1)
  }
}

function bookFromSummary() {
  if (!summaryItems.value.length) return
  const first = summaryItems.value[0]
  const total = (first.planPrice || 0) * nights.value * (first.qty || 1)
  router.push({
    path: '/ota/checkout',
    query: {
      arrivalDate: arrivalDate.value,
      departureDate: departureDate.value,
      nights: String(nights.value),
      room: first.roomName,
      plan: first.planName,
      total: String(total),
    },
  })
}
</script>

<style scoped>
/* Basic visual parity with the referenced booking page */
</style>