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
            <div class="text-4xl font-bold mb-2">{{ formatCurrency(store.selectedBooking?.totalAmount) }} </div>
          </div>
        </div>
        <div class="flex justify-end gap-4 mt-6">
          <button v-if="store.selectedBooking?.status === 'pending'" class="btn btn-primary" @click="payNow">
            {{ $t('PayNow') }}
          </button>
          <button class="btn btn-secondary" @click="updateReservation">
            {{ $t('update') }}
          </button>
          <button class="btn btn-danger" @click="isModalOpen = true">
            {{ $t('Cancel') }}
          </button>
        </div>
      </div>
    </div>
    <Modal :isOpen="isModalOpen" @close="isModalOpen = false" :title="$t('confirm_cancellation')" :message="$t('are_you_sure_cancel')">
      <template #footer>
        <div class="flex justify-end gap-4 p-4 bg-gray-100 dark:bg-gray-800">
          <button class="btn btn-secondary" @click="isModalOpen = false">{{ $t('No') }}</button>
          <button class="btn btn-danger" @click="cancelReservation">{{ $t('Yes') }}</button>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/modal/PopupModal.vue'
import { onMounted, ref, computed } from 'vue'
import DetailCard from '@/components/cards/DetailCard.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import { formatDateT,formatCurrency } from '@/components/utilities/UtilitiesFunction'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const selectBooking = ref<BookingDetail | null>(null)
const { t } = useI18n()
const isModalOpen = ref(false)

interface BookingDetail {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  arrivedDate: string;
  departDate: string;
  createdAt: string;
  userFullName: string;
  email: string;
  phone: string;
  guestCount: number;
  serviceProducts: ServiceProduct[];
}

interface ServiceProduct {
  productName: string;
  serviceProductId: number;
  startDate: string;
  endDate: string;
}

function goBack() {
  router.back()
}

const store = useBookingStore()

onMounted(() => {
  selectBooking.value = store.selectedBooking
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

  const productDetails = booking.serviceProducts.map((p: ServiceProduct) => ({
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

import { putReservation } from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

const payNow = () => {
  router.push({ name: 'CreatePayment', params: { id: store.selectedBooking?.id } })
}

const updateReservation = () => {
  router.push({ name: 'AddBooking', params: { id: store.selectedBooking?.id } })
}

const cancelReservation = async () => {
  try {
    if (store.selectedBooking) {
      const response = await putReservation(store.selectedBooking.id, { status: 'cancelled' })
      if (response.status === 200) {
        toast.success('Reservation cancelled successfully')
        store.selectedBooking.status = 'cancelled'
      } else {
        toast.error('Failed to cancel reservation')
      }
    }
  } catch {
    toast.error('An error occurred while cancelling the reservation')
  } finally {
    isModalOpen.value = false
  }
}
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
</style>
