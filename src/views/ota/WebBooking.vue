
<template>
  <FullScreenLayout>
    <OtaHeader  :currency="selectedCurrency" @currency-change="setCurrency" />
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
          <button
            @click="searchRooms"
            :disabled="isLoading"
            class="bg-primary text-white rounded px-4 py-2 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? $t('Loading...') : $t('Check Availability') }}
          </button>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-500">{{ $t('nights') }}: {{ nights }}</div>
          <div class="text-xs text-gray-500">
            {{ $t('guests') }}: {{ adults }} {{ $t('adults') }}, {{ children }} {{ $t('children') }}
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="mt-6 text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-2 text-gray-600">{{ $t('Loading availability...') }}</p>
      </div>

      <!-- Rooms display -->
      <div v-else class="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr]  h-[100vh] gap-6">
        <div class="space-y-4 overflow-y-auto scrollbar-none">
          <div
            v-for="room in filteredRooms"
            :key="room.id"
            class="bg-white rounded-lg shadow border p-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex flex-col">
                <h2 class="text-lg font-semibold">{{ room.name }}</h2>
                <div class="text-xs text-gray-500">{{ room.description }}</div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ $t('Capacity') }}: {{ room.capacity.adults }} {{ $t('adults') }},
                  {{ room.capacity.children }} {{ $t('children') }}
                </div>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-600">{{ $t('Rooms Left') }}:</span>
                <span
                  class="ml-1 rounded-full px-2 py-0.5 text-xs"
                  :class="
                    room.roomsLeft > 5
                      ? 'bg-green-200'
                      : room.roomsLeft > 0
                        ? 'bg-yellow-200'
                        : 'bg-red-200'
                  "
                >
                  {{ room.roomsLeft }}
                </span>
              </div>
            </div>

            <div class="mt-4 grid md:grid-cols-1 gap-4">
              <RatePlanCard
                v-for="plan in room.ratePlans"
                :key="plan.id"
                :room="room"
                :plan="plan"
                :nights="nights"
                :currency="selectedCurrency"
                :selected-count="roomCounts[`${room.name}-${plan.name}`] || 0"
                @add="handleAddRoom"
                @remove="handleRemoveRoom"
                @update="handleUpdate"
              />
            </div>
          </div>

          <div
            v-if="filteredRooms.length === 0 && !isLoading"
            class="text-center text-gray-500 py-8"
          >
            {{
              hasSearched
                ? $t('No rooms available for the selected criteria.')
                : $t('Please search for availability')
            }}
          </div>
        </div>
        <div class="sticky top-0 max-h-[80vh] overflow-y-auto scrollbar-none">
        <BookingSummary
          class="sticky top-0"
          :items="summaryItems"
          :arrivalDate="arrivalDate"
          :departureDate="departureDate"
          :nights="nights"
          @book="bookFromSummary"
          @remove="removeSummaryItem"
        />
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import RatePlanCard from './components/RatePlanCard.vue'
import BookingSummary from './components/BookingSummary.vue'
import OtaHeader from './components/OtaHeader.vue'
import { getAvailability, type RoomAvailability } from '@/views/ota/services/otaApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useBookingSummaryStore } from '@/views/ota/composables/bookingSummary'
import type { Tax } from '@/views/ota/composables/bookingSummary'


const hotelTaxes = ref<Tax[]>([])

const router = useRouter()
const { t } = useI18n()

// Configuration
const serviceStore = useServiceStore()
const hotelId = serviceStore.serviceId
const selectedCurrency = ref<string>('XAF')

// État
const brand = ref('')
const arrivalDate = ref<string>(new Date().toISOString().split('T')[0])
const departureDate = ref<string>(
  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
)
const adults = ref<number>(1)
const children = ref<number>(0)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')
const hasSearched = ref<boolean>(false)
const availabilityData = ref<RoomAvailability[]>([])
const hotelMeta = ref<any>(null)

// Calcul des nuits
const nights = computed(() => {
  const start = new Date(arrivalDate.value)
  const end = new Date(departureDate.value)
  const ms = Math.max(end.getTime() - start.getTime(), 0)
  return Math.max(Math.ceil(ms / (1000 * 60 * 60 * 24)), 1)
})

// Transformation des données API en format UI
const filteredRooms = computed(() => {
  return availabilityData.value.map((room) => ({
    id: room.id,
    name: room.name,
    shortCode: room.shortCode,
    description: room.description || t(`room.${room.shortCode}.description`, ''),
    images: room.images || [],
    roomsLeft: room.roomsLeft,
    rooms: room.rooms,
    capacity: {
      base: room.capacity?.base ?? 0,
      max: room.capacity?.max ?? 0,
      adults: room.capacity?.adults ?? 1,
      children: room.capacity?.children ?? 0,
    },
    amenities: room.amenities,
    ratePlans: room.ratePlans.map((plan) => ({
      id: plan.id.toString(),
      rateTypeId: plan.id.toString(),
      name: plan.name,
      shortCode: plan.shortCode,
      features: plan.features ?? [],
      policies: [],
      price: plan.basePrice ?? 0,
      pricePerNight: plan.pricePerNight ?? 0,
      breakdown: plan.breakdown ?? {},
      currency: plan.currency ?? '',
      minNights: plan.minNights ?? 1,
      maxNights: plan.maxNights ?? null,
    })),
  }))
})

// Recherche de disponibilité
async function searchRooms() {
  isLoading.value = true
  errorMessage.value = ''
  hasSearched.value = true

  try {
    const response = await getAvailability({
      hotelId,
      startDate: arrivalDate.value,
      endDate: departureDate.value,
      adults: adults.value,
      children: children.value,
    })

    console.log('Full API response:', response)

    // Mettre à jour le nom de l'hôtel
    if (response.meta?.hotelName) {
      brand.value = response.meta.hotelName
    }

    if (response.meta?.taxes) {
      hotelTaxes.value = response.meta.taxes
    }
    hotelMeta.value = response.meta
    availabilityData.value = response.data || []

    console.log('Rooms loaded:', brand.value)
  } catch (error) {
    console.error('Error fetching availability:', error)
    errorMessage.value =
      error instanceof Error ? error.message : t('An error occurred while fetching availability')
    availabilityData.value = []
  } finally {
    isLoading.value = false
  }
}

function setCurrency(c: string) {
  selectedCurrency.value = c
}

// Gestion du panier
const summaryItems = ref<
  Array<{
    roomId: number
    roomName: string
    planId: number
    planName: string
    planPrice: number
    adults: number
    children: number
    qty: number
  }>
>([])

function handleAddRoom(payload: any) {
  const { room, plan, adults: a = 1, children: c = 0 } = payload || {}
  const keyRoom = room?.name ?? 'Room'
  const keyPlan = plan?.name ?? 'Plan'
  const idx = summaryItems.value.findIndex(
    (it) => it.roomName === keyRoom && it.planName === keyPlan,
  )

  if (idx !== -1) {
    const cap = room?.roomsLeft ?? Infinity
    summaryItems.value[idx].qty = Math.min((summaryItems.value[idx].qty || 0) + 1, cap)
  } else {
    summaryItems.value.push({
      roomId: room?.id,
      roomName: keyRoom,
      planId: plan?.id,
      planName: keyPlan,
      planPrice: plan?.price ?? 0,
      adults: a,
      children: c,
      qty: 1,
    })
  }
}

function handleRemoveRoom(payload: any) {
  const { room, plan } = payload || {}
  const keyRoom = room?.name ?? 'Room'
  const keyPlan = plan?.name ?? 'Plan'
  const idx = summaryItems.value.findIndex(
    (it) => it.roomName === keyRoom && it.planName === keyPlan,
  )

  if (idx !== -1) {
    const next = (summaryItems.value[idx].qty || 1) - 1
    if (next <= 0) summaryItems.value.splice(idx, 1)
    else summaryItems.value[idx].qty = next
  }
}

// function removeSummaryItem(index: number) {
//   if (index >= 0 && index < summaryItems.value.length) {
//     summaryItems.value.splice(index, 1)
//   }

// }
//  removeSummaryItem
function removeSummaryItem(index: number) {
  if (index >= 0 && index < summaryItems.value.length) {
    const item = summaryItems.value[index]
    summaryItems.value.splice(index, 1)

    const room = filteredRooms.value.find(r => r.id === item.roomId)
    if (room) {

      handleRemoveRoom({ room: { ...room, name: item.roomName }, plan: { id: item.planId, name: item.planName } })
    }
  }
}


const roomCounts = computed(() => {
  const counts: Record<string, number> = {}
  summaryItems.value.forEach(item => {
    const key = `${item.roomName}-${item.planName}`
    counts[key] = item.qty
  })
  return counts
})


function bookFromSummary() {
  if (!summaryItems.value.length) {
    alert('Veuillez sélectionner au moins une chambre')
    return
  }

  const bookingStore = useBookingSummaryStore()

  const items = summaryItems.value.map((item) => {
    const room = filteredRooms.value.find(r => r.name === item.roomName)
    const plan = room?.ratePlans.find(p => p.name === item.planName)
    const taxIncluded = plan?.features?.some(
      feature => feature.toLowerCase().includes('tax included')
    ) || false

    return {
      roomId: item.roomId,
      roomName: item.roomName,
      rateTypeId: item.planId,
      planName: item.planName,
      planPrice: item.planPrice,
      quantity: item.qty,
      adults: item.adults,
      children: item.children,
      taxIncluded: taxIncluded,
    }
  })

  const allTaxIncluded = items.every(item => item.taxIncluded === true)

  // Calculer le prix total
  const totalPrice = summaryItems.value.reduce((sum, item) => {
    return sum + (item.planPrice * item.qty)
  }, 0)

  bookingStore.setBookingData({
    hotelId: String(hotelId),
    hotelName: brand.value || hotelMeta.value?.hotelName || '',
    address: hotelMeta.value?.address || 'Unknown Address',
    email: hotelMeta.value?.email || '',
    phoneNumber: hotelMeta.value?.phoneNumber || '',
    cancellationPolicy: hotelMeta.value?.cancellation || '',
    policies: hotelMeta.value?.policies || '',
    taxes: hotelTaxes.value || [],
    arrivalDate: arrivalDate.value,
    departureDate: departureDate.value,
    adults: String(adults.value),
    children: String(children.value),
    nights: String(nights.value),
    items,
    totalPrice,
    currency: selectedCurrency.value,
    taxIncluded: allTaxIncluded,
  })

  // Naviguer vers le checkout
  router.push({ path: '/ota/checkout' })
}

function handleUpdate(payload: any) {
  const { room, plan, adults: a, children: c } = payload || {}
  const keyRoom = room?.name ?? 'Room'
  const keyPlan = plan?.name ?? 'Plan'

  const itemIndex = summaryItems.value.findIndex(
    item => item.roomName === keyRoom && item.planName === keyPlan
  )

  if (itemIndex !== -1) {
    summaryItems.value[itemIndex].adults = a
    summaryItems.value[itemIndex].children = c
  }
}

onMounted(() => {
  searchRooms()
})
</script>

<style scoped>
/* Styles de base */
/* Scrollbar invisible pour tous les navigateurs modernes */
.scrollbar-none::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.scrollbar-none {
  -ms-overflow-style: none;  /* IE 10+ */
  scrollbar-width: none;     /* Firefox */
}
.scrollbar-none::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
</style>
