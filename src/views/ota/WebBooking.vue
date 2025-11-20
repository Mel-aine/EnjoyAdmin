
<template>
  <FullScreenLayout>
    <OtaHeader  :currency="selectedCurrency" :brand="brand" @currency-change="setCurrency" />
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
                :hotel-id="hotelId"
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
import { useRouter,useRoute } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import RatePlanCard from './components/RatePlanCard.vue'
import BookingSummary from './components/BookingSummary.vue'
import OtaHeader from './components/OtaHeader.vue'
import { getAvailability, type RoomAvailability } from '@/views/ota/services/otaApi'
import { useBookingSummaryStore } from '@/views/ota/composables/bookingSummary'
import type { Tax } from '@/views/ota/composables/bookingSummary'


const hotelTaxes = ref<Tax[]>([])

const router = useRouter()
const route  = useRoute()
const { t } = useI18n()

// Configuration
const hotelId:any = route.params.id
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
    images: room.rooms?.flatMap(r => r.images || []) || [],
    roomsLeft: room.roomsLeft,
    rooms: room.rooms,
    capacity: {
      base: room.capacity?.base ?? 0,
      max: room.capacity?.max ?? 0,
      adults: room.capacity?.adults ?? 1,
      children: room.capacity?.children ?? 0,
      baseAdult: room.capacity?.baseAdult ?? 0,
      baseChild: room.capacity?.baseChild ?? 0,
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

    console.log('Rooms loaded:', response)
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
  const { room, plan, occupants } = payload || {}
  const keyRoom = room?.name ?? 'Room'
  const keyPlan = plan?.name ?? 'Plan'
  const idx = summaryItems.value.findIndex(
    (it) => it.roomName === keyRoom && it.planName === keyPlan,
  )

  // Calculer le total des occupants
  const totalAdults = occupants ? occupants.reduce((sum: number, occupant: any) => sum + (occupant.adults || 0), 0) : 1
  const totalChildren = occupants ? occupants.reduce((sum: number, occupant: any) => sum + (occupant.children || 0), 0) : 0

  if (idx !== -1) {
    const cap = room?.roomsLeft ?? Infinity
    summaryItems.value[idx].qty = Math.min((summaryItems.value[idx].qty || 0) + 1, cap)
    summaryItems.value[idx].adults = totalAdults
    summaryItems.value[idx].children = totalChildren
  } else {
    summaryItems.value.push({
      roomId: room?.id,
      roomName: keyRoom,
      planId: plan?.id,
      planName: keyPlan,
      planPrice: plan?.price ?? 0,
      adults: totalAdults,
      children: totalChildren,
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

  // Décomposer chaque item en chambres individuelles avec leurs occupants
  const decomposedItems = summaryItems.value.flatMap((item) => {
    const room = filteredRooms.value.find(r => r.name === item.roomName)
    const plan = room?.ratePlans.find(p => p.name === item.planName)

    // Récupérer les taux extras
    const extraAdultRate = plan?.breakdown?.extraAdultRate || "0.00"
    const extraChildRate = plan?.breakdown?.extraChildRate || "0.00"

    // Récupérer la capacité de base depuis le roomType
    const baseAdult = room?.capacity?.baseAdult || 1
    const baseChild = room?.capacity?.baseChild || 0

    const taxIncluded = plan?.features?.some(
      feature => feature.toLowerCase().includes('tax included')
    ) || false

    // Pour chaque chambre de cet item, créer un item individuel
    return Array.from({ length: item.qty }, (_, index) => {
      // Répartition des adultes
      const adultsPerRoom = Math.floor(item.adults / item.qty)
      const extraAdults = item.adults % item.qty
      const adults = adultsPerRoom + (index < extraAdults ? 1 : 0)

      // Répartition des enfants
      const childrenPerRoom = Math.floor(item.children / item.qty)
      const extraChildren = item.children % item.qty
      const children = childrenPerRoom + (index < extraChildren ? 1 : 0)

      // Calcul du nombre d'extra adultes et enfants
      const extraAdultsCount = Math.max(0, adults - baseAdult)
      const extraChildrenCount = Math.max(0, children - baseChild)

      // Calcul du coût des extras
      const extraAdultCost = extraAdultsCount * parseFloat(extraAdultRate)
      const extraChildCost = extraChildrenCount * parseFloat(extraChildRate)
      const totalExtrasCost = extraAdultCost + extraChildCost

      // Prix avant taxes
      const subtotal = item.planPrice + totalExtrasCost

      return {
        roomId: item.roomId,
        roomName: item.roomName,
        rateTypeId: item.planId,
        planName: item.planName,
        planPrice: item.planPrice,
        extraAdultRate: extraAdultRate,
        extraChildRate: extraChildRate,
        extraAdultsCount: extraAdultsCount,
        extraChildrenCount: extraChildrenCount,
        extraAdultCost: extraAdultCost,
        extraChildCost: extraChildCost,
        totalExtrasCost: totalExtrasCost,
        baseAdult: baseAdult,
        baseChild: baseChild,
        quantity: 1,
        adults: adults,
        children: children,
        taxIncluded: taxIncluded,
        roomNumber: index + 1,
        subtotal: subtotal, // Prix avant taxes
        totalPrice: subtotal // Sera mis à jour avec les taxes
      }
    })
  })

  const allTaxIncluded = decomposedItems.every(item => item.taxIncluded === true)


  // Fonction pour calculer les taxes pour un montant donné
  const calculateTaxes = (amount:any) => {
    let totalTaxAmount = 0
    const taxDetails:any[] = []

    hotelTaxes.value.forEach(tax => {
      let taxAmount = 0

      if (tax.type === 'flat_percentage' && tax.percent) {
        // Taxe en pourcentage
        taxAmount = amount * (parseFloat(tax.percent) / 100)
      } else if (tax.type === 'flat_amount' && tax.rate) {
        // Taxe fixe
        taxAmount = parseFloat(tax.rate)
      }

      if (taxAmount > 0) {
        totalTaxAmount += taxAmount
        taxDetails.push({
          id: tax.id,
          name: tax.name,
          rate: tax.rate,
          percent: tax.percent,
          type: tax.type,
          amount: taxAmount
        })
      }
    })

    return {
      totalTaxAmount,
      taxDetails
    }
  }

  // Appliquer les taxes à chaque chambre si non incluses
  let totalTaxAmount = 0
  const itemsWithTaxes = decomposedItems.map(item => {
    if (item.taxIncluded) {
      // Taxes déjà incluses dans le prix
      return {
        ...item,
        taxesAmount: 0,
        taxDetails: [],
        totalPrice: item.subtotal
      }
    } else {
      // Calculer les taxes
      const { totalTaxAmount: roomTaxAmount, taxDetails } = calculateTaxes(item.subtotal)
      totalTaxAmount += roomTaxAmount

      return {
        ...item,
        taxesAmount: roomTaxAmount,
        taxDetails: taxDetails,
        totalPrice: item.subtotal + roomTaxAmount
      }
    }
  })

  // Calculer les totaux globaux
  const totalAdults = itemsWithTaxes.reduce((sum, item) => sum + item.adults, 0)
  const totalChildren = itemsWithTaxes.reduce((sum, item) => sum + item.children, 0)
  const totalBasePrice = itemsWithTaxes.reduce((sum, item) => sum + item.planPrice, 0)
  const totalExtraAdultCost = itemsWithTaxes.reduce((sum, item) => sum + item.extraAdultCost, 0)
  const totalExtraChildCost = itemsWithTaxes.reduce((sum, item) => sum + item.extraChildCost, 0)
  const totalExtrasCost = itemsWithTaxes.reduce((sum, item) => sum + item.totalExtrasCost, 0)
  const totalSubtotal = itemsWithTaxes.reduce((sum, item) => sum + item.subtotal, 0)
  const grandTotal = itemsWithTaxes.reduce((sum, item) => sum + item.totalPrice, 0)

  bookingStore.setBookingData({
    hotelId: String(hotelId),
    hotelName: brand.value || hotelMeta.value?.hotelName || '',
    address: hotelMeta.value?.address || 'Unknown Address',
    email: hotelMeta.value?.email || '',
    phoneNumber: hotelMeta.value?.phoneNumber || '',
    cancellationPolicy: hotelMeta.value?.cancellation || '',
    policies: hotelMeta.value?.policies || '',
    taxes: hotelTaxes.value,
    arrivalDate: arrivalDate.value,
    departureDate: departureDate.value,
    adults: totalAdults,
    children: totalChildren,
    nights: String(nights.value),
    items: itemsWithTaxes,
    totalPrice: grandTotal,
    totalBasePrice: totalBasePrice,
    totalExtraAdultCost: totalExtraAdultCost,
    totalExtraChildCost: totalExtraChildCost,
    totalExtrasCost: totalExtrasCost,
    totalSubtotal: totalSubtotal,
    totalTaxAmount: totalTaxAmount,
    currency: selectedCurrency.value,
    taxIncluded: allTaxIncluded,
  })

  // Naviguer vers le checkout
  router.push({ name: 'OtaCheckout', query: { hotelId } })
}



function handleUpdate(payload: any) {
  const { room, plan, occupants } = payload || {}
  const keyRoom = room?.name ?? 'Room'
  const keyPlan = plan?.name ?? 'Plan'

  const itemIndex = summaryItems.value.findIndex(
    item => item.roomName === keyRoom && item.planName === keyPlan
  )

  if (itemIndex !== -1 && occupants && occupants.length > 0) {
    // Calculer le total des adults/children pour cette chambre
    const totalAdults = occupants.reduce((sum: number, occupant: any) => sum + (occupant.adults || 0), 0)
    const totalChildren = occupants.reduce((sum: number, occupant: any) => sum + (occupant.children || 0), 0)

    summaryItems.value[itemIndex].adults = totalAdults
    summaryItems.value[itemIndex].children = totalChildren
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
