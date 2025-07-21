<template>
  <AdminLayout>
    <FullScreenLayout>
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8 slide-in">
        <div class="flex items-center gap-4 mb-4">
          <button @click="goBack"
            class="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-lg transition-all duration-200 shadow">
            ← {{ $t('Back') }}
          </button>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden"
        v-if="customer && customer.customerDetails">
        <!-- Header -->
        <div class="text-white p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="w-16 h-16 bg-blue-100 bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Users class="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">
                  {{ customer.customerDetails.firstName }} {{ customer.customerDetails.lastName }}
                </h1>
                <p class="text-black font-medium">{{ customer.roomType }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span
                    class="inline-flex items-center px-3 py-1 bg-blue-50 text-gray-950 bg-opacity-20 rounded-full text-sm font-medium">
                    <DollarSignIcon class="w-4 h-4 mr-1" />
                    {{ formatCurrency(customer.outstandingBalances.totalRemainingAmount) }}
                  </span>
                  <span v-if="customer.hotelStatus.isPresent" :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    getStatusColor(''),
                  ]">
                    {{ $t('currentlyStayingFull', {
                      number: customer.hotelStatus.reservationDetails.reservationNumber,
                      room: customer.hotelStatus.reservationDetails.roomNumber,
                      start: formatDate(customer.hotelStatus.reservationDetails.checkInDate),
                      end: formatDate(customer.hotelStatus.reservationDetails.checkOutDate),
                    })
                    }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]">
              <div class="flex items-center space-x-2">
                <component :is="tab.icon" class="w-5 h-5" />
                <span>{{ tab.label }}</span>
              </div>
            </button>
          </nav>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Details Tab -->
          <div v-if="activeTab === 'details'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- Informations de base -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <InfoIcon class="w-5 h-5 mr-2 text-blue-600" />
                {{ $t('Basic_Information') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('customerDetails.basicInfo.firstName')"
                  :value="customer.customerDetails.firstName || 'N/A'" />
                <DetailRow :label="$t('customerDetails.basicInfo.lastName')"
                  :value="customer.customerDetails.lastName || 'N/A'" />
                <DetailRow :label="$t('customerDetails.basicInfo.gender')" :value="'N/A'" />
                <DetailRow :label="$t('customerDetails.basicInfo.dateOfBirth')"
                  :value="customer.customerDetails.roomType || 'N/A'" />
                <DetailRow :label="$t('customerDetails.basicInfo.nationality')"
                  :value="customer.customerDetails.nationality || 'N/A'" type="badge" />
              </div>
            </div>
            <!-- Équipements -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <Mail class="w-5 h-5 mr-2 text-purple-600" />
                {{ $t('customerDetails.contactInfo.title') }}
              </h3>
              <div class="space-y-1">
                <DetailRow :label="$t('customerDetails.contactInfo.email')" :value="customer.customerDetails.email" />
                <DetailRow :label="$t('customerDetails.contactInfo.phone')"
                  :value="customer.customerDetails.phoneNumber" />
                <DetailRow :label="$t('customerDetails.contactInfo.address')"
                  :value="customer.customerDetails.address" />

              </div>
            </div>
            <div class="bg-gradient-to-br from-yellow-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">{{ $t('remainingBalanceTitle') }}</h2>

              <div class="flex items-baseline justify-center mb-6">
                <span class="text-5xl font-extrabold text-red-500">{{
                  formatCurrency(customer.outstandingBalances.totalRemainingAmount) }}</span>
              </div>

              <p class="text-gray-600 text-sm text-center mb-4 leading-relaxed">
                {{ customer.outstandingBalances.description }}
              </p>

              <p class="text-gray-500 text-xs text-center mb-6">
                {{ $t('dueDatePrefix') }} <span class="font-medium">{{ customer.outstandingBalances.dueDate }}</span>
              </p>

              <button @click="emitPayNow"
                class="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 px-4 rounded-lg
               transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                {{ $t('payNowButton') }}
              </button>
            </div>
          </div>
          <div v-if="activeTab === 'payments'" class="bg-white rounded-xl  border-gray-200">
            <PaymentTable :datas="customer.paymentHistory" />
          </div>
          <div v-if="activeTab === 'bookings'" class="bg-white rounded-xl border-gray-200">
            <BookingTable :datas="customer.reservations"/>
          </div>

          <!-- History Tab -->
          <div v-if="activeTab === 'history'" class="bg-white rounded-xl border border-gray-200">
            <template v-if="customer.
              activityLogs && customer.activityLogs.length > 0">
              <ActivitiesLogs :activity-logs="customer.activityLogs" />
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center text-gray-500 py-10">
                <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
                <p class="text-sm">{{ $t('no_recente_activity') }}</p>
              </div>
            </template>
          </div>

          <!-- Calendar Tab -->
          <div v-if="activeTab === 'calendar'" class="bg-white rounded-xl border border-gray-200">
            <!-- <CustomCalendar :calendar-title="$t('Calendar')" /> -->
            <BaseCalendar
              :title="$t('Calendar')"
              :currentMonth="currentMonth"
              :days="calendarDays"
              @previous-month="previousMonth"
              @next-month="nextMonth"
            >
              <template #day-content="{ day }">
              <div v-if="day.isReserved" class=" bg-red-50 border-red-300">
                <div class="h-1 bg-red-500 rounded-full mb-1"></div>
                <div class="text-blue-600 truncate">
                  {{ day.reservation?.reservationNumber }}
                </div>
                <div class="text-red-600 truncate">
                  {{ day.reservation?.roomNumber }}
                </div>
              </div>
            </template>



              <template #legend>
                <div class="flex items-center justify-center space-x-6">
                  <LegendItem color="blue" :label="$t('now')" />
                  <LegendItem color="red" label="roomStatus.booked" />
                </div>
              </template>
            </BaseCalendar>
          </div>
        </div>


      </div>
      <OverLoading v-if="isLoading" />
    </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useBookingStore } from '@/composables/booking';
import { ref, onMounted, computed } from 'vue'
import { BuildingIcon, ClockIcon, DollarSignIcon, MapPin, UserRound } from 'lucide-vue-next';
import { Mail } from 'lucide-vue-next';
import { Phone } from 'lucide-vue-next';
import { Calendar } from 'lucide-vue-next';
import { CreditCard } from 'lucide-vue-next';
import { Info } from 'lucide-vue-next';
import { Bookmark } from 'lucide-vue-next';
import { Users } from 'lucide-vue-next';
import CustomCalendar from '@/components/calendars/CustomCalendar.vue';
import { useI18n } from 'vue-i18n'
import InfoIcon from '@/icons/InfoIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import { isLoading } from '@/composables/spinner';
import DetailRow from '../Room/DetailRow.vue';
import { getCustomerProfile } from '@/services/api';
import router from '@/router';
import ActivitiesLogs from '../Setting/ActivitiesLogs.vue';
import { format } from 'date-fns';
import PaymentModal from '../Bookings/PaymentModal.vue';
import BookingTable from '@/components/tables/booking-tables/BookingTable.vue';
import PaymentTable from '@/components/tables/PaymentTable.vue';
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
import BaseCalendar from '@/components/calendars/BaseCalendar.vue';
import LegendItem from '@/components/calendars/LegendItem.vue';

const { t ,locale } = useI18n()

const customer_id = router.currentRoute.value.params.id as string;

const store = useBookingStore()
const customer = ref<any>({})
const dateArrived = ref('')
const dateDepart = ref('')
const activeTab = ref<string>('details')
const currentDate = ref<Date>(new Date())
const tabs = computed(() => [
  { id: 'details', label: t('tab.details'), icon: InfoIcon },
  { id: 'calendar', label: t('tab.calendar'), icon: CalendarIcon },
  { id: 'bookings', label: t('tab.bookings'), icon: Bookmark },
  { id: 'payments', label: t('tab.payments'), icon: CreditCard },
  { id: 'history', label: t('tab.history'), icon: ClockIcon },
])
onMounted(() => {
  customer.value = store.selectedCustomer
  console.log('value', customer.value)
  dateArrived.value = customer.value.lastReservation.arrivedDate
  dateDepart.value = customer.value.lastReservation.departDate

  console.log('customer.value :', customer.value.lastReservation.departDate)
})

const emitPayNow = () => {

}
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: string): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(parseFloat(amount))
}

const calculateStayDuration = (): number => {
  const arrival = new Date(dateArrived.value)
  const departure = new Date(dateDepart.value)
  const diff = Math.abs(departure.getTime() - arrival.getTime())
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const goBack = (): void => {
  window.history.back()
}
// Méthodes utilitaires
const getStatusColor = (status: any) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800'
    case 'booked':
      return 'bg-blue-100 text-blue-800'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800'
    case 'occupied':
      return 'bg-red-100 text-red-800'
    case 'dirty':
      return 'bg-red-50 text-orange-700'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
onMounted(() => {
  getCustomerProfileDetails()
})
const getCustomerProfileDetails = async () => {
  isLoading.value = true;
  const response = await getCustomerProfile(parseInt(customer_id))
  console.log('this is the customer_id', response)
  if (response.status === 200) {
    customer.value = response.data;
  }
  isLoading.value = false;
}


interface CalendarDay {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isReserved: boolean
  reservation?: {
    checkInDate: string
    checkOutDate: string
    roomNumber: string
    reservationNumber: string
    [key: string]: any
  }
}


const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString(locale.value, {
    month: 'long',
    year: 'numeric',
  })
})

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)) // lundi = début

  const today = new Date()
  const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const status = customer.value?.hotelStatus
  const isPresent = status?.isPresent === true
  const reservation = status?.reservationDetails

  const days: CalendarDay[] = []

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    let isReserved = false
    let reservationInfo

    if (isPresent && reservation) {
      const checkIn = new Date(reservation.checkInDate)
      const checkOut = new Date(reservation.checkOutDate)

      if (
        normalizeDate(date) >= normalizeDate(checkIn) &&
        normalizeDate(date) <= normalizeDate(checkOut)
      ) {
        isReserved = true
        reservationInfo = reservation
      }
    }

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: normalizeDate(date).toDateString() === normalizeDate(today).toDateString(),
      isReserved,
      reservation: isReserved ? reservationInfo : undefined,
    })
  }

  return days
})




const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
// Generate the full status message
const formatTime = (date: string) => {
  return format(new Date(date), 'MMMM d, yyyy')
}
</script>

<style scoped>
.glass-effect {
  backdrop-filter: blur(10px);
  background: rgba(245, 245, 245, 1);
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.status-badge {
  animation: pulse 2s infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.6s ease-out;
}
</style>
