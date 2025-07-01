<template>
  <AdminLayout>
    <div class="p-4">
      <button
        @click="goBack"
        class="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow"
      >
        ← {{ $t('Back') }}
      </button>
    </div>

    <div
      class="max-w-full mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-sm p-6 animate-fade-in"
    >
      <div
        class="bg-gradient-to-br from-gray-800 to-gray-700 text-white text-center p-8 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-white/0 animate-float-pattern"
        />
        <h1 class="text-3xl font-bold z-10 relative">{{ $t('booking_details') }}</h1>
        <p class="text-sm opacity-90 z-10 relative">{{ $t('reference') }} : {{ store.selectedBooking?.id }}</p>
      </div>

      <div class="p-6">
        <span
          class="inline-block mb-6 px-6 py-2 rounded-full text-white font-semibold text-sm uppercase animate-pulse"
          :class="`bg-gradient-to-r ${bookingStatusClass}`"
        >
          ✓ {{ store.selectedBooking?.status }}
        </span>

        <div class="grid md:grid-cols-3 gap-6">
          <DetailCard :title="$t('customer_info')" icon="👥" :items="clientDetails" />
          <DetailCard :title="$t('room_reserved')" icon="🛏️" :items="hotelDetails" />
          <DetailCard :title="$t('date_stay')" icon="📅" :items="dateDetails" />
        </div>

        <div
          class="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-center rounded-xl mt-8 p-5 relative overflow-hidden"
        >
          <div
            class="absolute top-1/2 left-1/2 w-10 h-10 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ripple"
          />
          <div class="relative z-10">
            <div class="text-4xl font-bold mb-2">{{ store.selectedBooking?.totalAmount }} FCFA</div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { onMounted, ref, computed } from 'vue'
import DetailCard from '@/components/cards/DetailCard.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import { formatDateT } from '@/components/utilities/UtilitiesFunction'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const selectBooking = ref<any>({})
const { t } = useI18n()
function goBack() {
  router.back()
}

const store = useBookingStore()

onMounted(() => {
  selectBooking.value = store.selectedBooking

  console.log('Réservation sélectionnée :', store.selectedBooking)
  console.log(
    'calculateNights :',
    calculateNights(store.selectedBooking?.date, store.selectedBooking?.dateD),
  )
})

const bookingStatusClass = computed(() => {
  switch (store.selectedBooking?.status) {
    case 'pending':
      return 'from-yellow-500 to-yellow-400'
    case 'confirmed':
      return 'from-green-500 to-green-400'
    case 'cancelled':
      return 'from-red-500 to-red-400'
    default:
      return 'from-gray-400 to-gray-300'
  }
})

const hotelDetails = computed(() => {
  const booking = store.selectedBooking

  if (!booking || !booking.serviceProducts) return []

  const productDetails = booking.serviceProducts.map((p: any) => ({
    label: p.productName,
    value: `Id #${p.serviceProductId} — ${t('du')} ${formatDateT(p.startDate)} ${t('au')} ${formatDateT(p.endDate)}`,
  }))

  return [...productDetails]
})

const calculateNights = (start: string | Date, end: string | Date): number => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const diffMs = endDate.getTime() - startDate.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

const dateDetails = computed(() => [
  { label: t('booking.arrival'), value: store.selectedBooking?.date },
  { label: t('booking.departure'), value: store.selectedBooking?.dateD },
  {
    label: t('booking.duration'),
    value:
      calculateNights(
        store.selectedBooking?.arrivedDate,
        store.selectedBooking?.departDate
      ) + ' ' + t('booking.nights'),
  },
  {
    label: t('booking.createdAt'),
    value: formatDateT(store.selectedBooking?.createdAt),
  },
])

const clientDetails = computed(() => [
  { label: t('client.name'), value: store.selectedBooking?.userFullName },
  { label: t('client.email'), value: store.selectedBooking?.email },
  { label: t('client.phone'), value: store.selectedBooking?.phone },
  { label: t('client.guests'), value: store.selectedBooking?.guestCount },
])


</script>

<style scoped>
@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}
.animate-ripple {
  animation: ripple 3s infinite;
}

@keyframes float-pattern {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}
.animate-float-pattern {
  animation: float-pattern 20s linear infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.btn {
  @apply px-6 py-3 font-semibold text-white rounded-full transition-all duration-300 relative overflow-hidden;
}

.btn::before {
  content: '';
  @apply absolute top-1/2 left-1/2 w-0 h-0 bg-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500;
}

.btn:hover::before {
  @apply w-[300px] h-[300px];
}

.btn-primary {
  @apply bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg;
}

.btn-secondary {
  @apply bg-gradient-to-r from-gray-400 to-gray-600 hover:shadow-lg;
}

.btn-danger {
  @apply bg-gradient-to-r from-red-500 to-red-700 hover:shadow-lg;
}
</style>
