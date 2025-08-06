<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-8 slide-in">
          <div class="flex items-center gap-4 mb-4">
            <button
              @click="goBack"
              class="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-lg transition-all duration-200 shadow"
            >
              ← {{ $t('Back') }}
            </button>
          </div>
        </div>
        <div
          class="bg-white rounded-xl border border-gray-200 overflow-hidden"
          v-if="customer && customer.customerDetails"
        >
          <!-- Header -->
          <div class="text-white p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div
                  class="w-16 h-16 bg-blue-100 bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm"
                >
                  <Users class="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-800">
                    {{ customer.customerDetails.firstName }} {{ customer.customerDetails.lastName }}
                  </h1>
                  <p class="text-black font-medium">{{ customer.roomType }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span
                      class="inline-flex items-center px-3 py-1 bg-blue-50 text-gray-950 bg-opacity-20 rounded-full text-sm font-medium"
                    >
                      <DollarSignIcon class="w-4 h-4 mr-1" />
                      {{ formatCurrency(customer.outstandingBalances.totalRemainingAmount) }}
                    </span>
                    <span
                      v-if="customer.hotelStatus.isPresent"
                      :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                        getStatusColor(''),
                      ]"
                    >
                      {{
                        $t('currentlyStayingFull', {
                          number: customer.hotelStatus.reservationDetails.reservationNumber,
                          room: customer.hotelStatus.reservationDetails.roomNumber,
                          start: formatDate(customer.hotelStatus.reservationDetails.checkInDate),
                          end: formatDate(customer.hotelStatus.reservationDetails.checkOutDate),
                        })
                      }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-4 mt-4">
                    <button
                      @click="handleOpenEditModal"
                      class="bg-primary text-white px-4 py-1 rounded-lg shadow hover:bg-primary/80 transition"
                    >
                      {{ $t('edit') }}
                    </button>
                    <button
                      @click="show = true"
                      class="bg-red-500 text-white px-4 py-1 rounded-lg shadow hover:bg-orange-700 transition"
                    >
                      {{ $t('delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
              >
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
            <div
              v-if="activeTab === 'details'"
              class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <!-- Informations de base -->
              <div class="bg-gradient-to-br bg-white border-1 border-gray-200 rounded-xl p-6">
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <InfoIcon class="w-5 h-5 mr-2 text-blue-600" />
                  {{ $t('Basic_Information') }}
                </h3>
                <div class="space-y-1">
                  <DetailRow
                    :label="$t('customerDetails.basicInfo.firstName')"
                    :value="customer.customerDetails.firstName || 'N/A'"
                  />
                  <DetailRow
                    :label="$t('customerDetails.basicInfo.lastName')"
                    :value="customer.customerDetails.lastName || 'N/A'"
                  />
                  <DetailRow
                    :label="$t('customerDetails.basicInfo.gender')"
                    :value="customer.customerDetails.gender || 'N/A'"
                  />
                  <DetailRow
                    :label="$t('customerDetails.basicInfo.dateOfBirth')"
                    :value="customer.customerDetails.dateOfBirth || 'N/A'"
                  />
                  <DetailRow
                    :label="$t('customerDetails.basicInfo.nationality')"
                    :value="customer.customerDetails.country || 'N/A'"
                    type="badge"
                  />
                </div>
              </div>
              <!-- Équipements -->
              <div class="bg-gradient-to-brbg-white border-1 border-gray-200 rounded-xl p-6">
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <Mail class="w-5 h-5 mr-2 text-purple-600" />
                  {{ $t('customerDetails.contactInfo.title') }}
                </h3>
                <div class="space-y-1">
                  <DetailRow
                    :label="$t('customerDetails.contactInfo.email')"
                    :value="customer.customerDetails.email"
                  />
                  <DetailRow
                    :label="$t('customerDetails.contactInfo.phone')"
                    :value="customer.customerDetails.phoneNumber"
                  />
                  <DetailRow
                    :label="$t('customerDetails.contactInfo.address')"
                    :value="customer.customerDetails.address"
                  />
                </div>
              </div>
              <div class="bg-gradient-to-br bg-white border-1 border-gray-200 rounded-xl p-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">
                  {{ $t('remainingBalanceTitle') }}
                </h2>

                <div class="flex items-baseline justify-center mb-6">
                  <span class="text-5xl font-extrabold text-red-500">{{
                    formatCurrency(customer.outstandingBalances.totalRemainingAmount)
                  }}</span>
                </div>

                <p class="text-gray-600 text-sm text-center mb-4 leading-relaxed">
                  {{ customer.outstandingBalances.description }}
                </p>

                <p class="text-gray-500 text-xs text-center mb-6">
                  {{ $t('dueDatePrefix') }}
                  <span class="font-medium">{{ customer.outstandingBalances.dueDate }}</span>
                </p>

                <button
                  @click="emitPayNow"
                  class="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  {{ $t('payNowButton') }}
                </button>
              </div>
            </div>
            <div v-if="activeTab === 'payments'" class="bg-white rounded-xl border-gray-200">
              <PaymentTable :datas="customer.paymentHistory" />
            </div>
            <div v-if="activeTab === 'bookings'" class="bg-white rounded-xl border-gray-200">
              <BookingTable :datas="customer.reservations" />
            </div>

            <!-- History Tab -->
            <div v-if="activeTab === 'history'" class="bg-white rounded-xl border border-gray-200">
              <template v-if="customer.activityLogs && customer.activityLogs.length > 0">
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
                :initial-date="selectedDate"
                :events="calendarEvents"
                :day-modifiers="getDayModifiers"
                @month-changed="onMonthChanged"
                @day-click="onDayClick"
              >
                <template #day-content="{ day }">
                  <div
                    v-if="day.events.length > 0 && day.events[0].type === 'reserved'"
                    class="bg-red-50 border-red-300"
                  >
                    <div class="h-1 bg-red-500 rounded-full mb-1"></div>
                    <div class="text-blue-600 truncate">
                      {{ day.events[0].reservation?.reservationNumber }}
                    </div>
                    <div class="text-red-600 truncate">
                      {{ day.events[0].reservation?.roomNumber }}
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
      <template v-if="selectBooking">
        <PaymentModal
          :reservation="selectBooking"
          :is-open="openPayment"
          @close="openPayment = false"
          @payment-recorded="getPaymentDetails"
        />
      </template>
      <template v-if="modalOpen">
        <ModalCustomer
          :isOpen="modalOpen"
          :isEditMode="true"
          @close="closeModal"
          :customerData="customerDataForEdit"
          @submit="handleEditCustomer"
        />
      </template>
      <template v-if="show">
        <ModalDelete
          :isOpen="show"
          :title="$t('deleteCustomer')"
          :message="$t('deleteCustomerMessage')"
          :isLoading = "loading"
          @close="show = false"
          @delete="handleDeleteCustomer"
        />
      </template>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import { BuildingIcon, ClockIcon, DollarSignIcon, MapPin, UserRound } from 'lucide-vue-next'
import { Mail } from 'lucide-vue-next'
import { CreditCard } from 'lucide-vue-next'
import { Bookmark } from 'lucide-vue-next'
import { Users } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import InfoIcon from '@/icons/InfoIcon.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import { isLoading } from '@/composables/spinner'
import DetailRow from '../Room/DetailRow.vue'
import { getCustomerProfile, updateCustomer ,deleteUser } from '@/services/api'
import router from '@/router'
import ActivitiesLogs from '../Setting/ActivitiesLogs.vue'
import PaymentModal from '../Bookings/PaymentModal.vue'
import BookingTable from '@/components/tables/booking-tables/BookingTable.vue'
import PaymentTable from '@/components/tables/PaymentTable.vue'
const selectBooking = ref(null)
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import BaseCalendar from '@/components/calendars/BaseCalendar.vue'
import LegendItem from '@/components/calendars/LegendItem.vue'
import ModalCustomer from './ModalCustomer.vue'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import { useToast } from 'vue-toastification'

const { t, locale } = useI18n()
const openPayment = ref(false)
const selectedDate = ref(new Date())
const loading = ref(false)
const toast = useToast()
const getPaymentDetails = () => {
  openPayment.value = false
  getCustomerProfileDetails()
}
const customer_id = router.currentRoute.value.params.id as string
const modalOpen = ref(false)
const show = ref(false)
const customer = ref<any>({})
const activeTab = ref<string>('details')
const tabs = computed(() => [
  { id: 'details', label: t('tab.details'), icon: InfoIcon },
  { id: 'calendar', label: t('tab.calendar'), icon: CalendarIcon },
  { id: 'bookings', label: t('tab.bookings'), icon: Bookmark },
  { id: 'payments', label: t('tab.payments'), icon: CreditCard },
  { id: 'history', label: t('tab.history'), icon: ClockIcon },
])

const emitPayNow = () => {
  openPayment.value = true
}
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatCurrency = (amount: string): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(parseFloat(amount))
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
  isLoading.value = true
  const response = await getCustomerProfile(parseInt(customer_id))
  console.log('this is the customer_id', response)
  if (response.status === 200) {
    customer.value = response.data
    if (customer.value.outstandingBalances.hasOutstanding) {
      selectBooking.value = customer.value.reservations.find(
        (res: any) => res.id === customer.value.outstandingBalances.details[0].reservationId,
      )
    }
    customer.value.reservations = customer.value.reservations.map((res: any) => {
      return { ...res, user: customer.value.customerDetails }
    })
  }
  isLoading.value = false
}

const calendarEvents = computed<any[]>(() => {
  const status = customer.value?.hotelStatus
  const reservation = status?.reservationDetails

  if (!status?.isPresent || !reservation) return []

  const checkIn = new Date(reservation.checkInDate)
  const checkOut = new Date(reservation.checkOutDate)

  const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const events = []
  let current = new Date(checkIn)

  while (normalizeDate(current) <= normalizeDate(checkOut)) {
    events.push({
      date: new Date(current),
      type: 'reserved',
      reservation: reservation,
    })
    current.setDate(current.getDate() + 1)
  }

  return events
})

const onMonthChanged = (date: Date) => {
  console.log('Mois changé:', date)
  // loadEventsForMonth(date)
}

const onDayClick = (day: any) => {
  console.log('Jour cliqué:', day)
  selectedDate.value = day.date

  // Logique métier du parent
  if (day.events.length > 0) {
    // Afficher les détails des événements
    showEventDetails(day.events)
  } else {
    // Permettre d'ajouter un nouvel événement
    openNewEventDialog(day.date)
  }
}

const getDayModifiers = (day: any) => {
  if (day.events?.some((e: any) => e.type === 'reserved')) {
    return 'bg-red-100 border-red-300'
  }

  return ''
}

const closeModal = () => {
  modalOpen.value = false
}

// Méthodes utilitaires
const showEventDetails = (events: any[]) => {
  // Logique pour afficher les détails
}

const openNewEventDialog = (date: Date) => {
  // Logique pour ouvrir le dialog de nouvel événement
}

const loadEventsForMonth = (date: Date) => {
  // Charger les événements du mois depuis l'API
}
const handleOpenEditModal = () => {
  modalOpen.value = true
}

const customerDataForEdit = computed(() => {
  if (!customer.value?.customerDetails) return {}

  return {
    gender: customer.value.customerDetails.gender || '',
    first_name: customer.value.customerDetails.firstName || '',
    last_name: customer.value.customerDetails.lastName || '',
    date_of_birth: customer.value.customerDetails.dateOfBirth || '',
    country: customer.value.customerDetails.country || '',
    national_id_number: customer.value.customerDetails.nationalIdNumber || '',
    email: customer.value.customerDetails.email || '',
    phone_number: customer.value.customerDetails.phoneNumber || '',
    address: customer.value.customerDetails.address || '',
    special_preferences: customer.value.customerDetails.specialPreferences || '',
  }
})

// Fonction pour gérer l'édition d'un client
const handleEditCustomer = async (payload: any) => {
  try {
    loading.value = true

    const { data } = payload
    console.log('Édition de client:', data)
    await updateCustomer(Number(customer_id), data)
    toast.success(t('toast.SucessUpdate'))
    // Rafraîchir les détails du client
    await getCustomerProfileDetails()


  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error)
    toast.error(t('toast.updateError'))
  } finally {
    loading.value = false
  }
}

const handleDeleteCustomer = async () => {
  try {
    loading.value = true
    await deleteUser(Number(customer_id))
    toast.success(t('toast.DeletedSuccess'))
    router.push({ name: 'Customers' })
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error)
    toast.error(t('toast.deleteError'))
  } finally {
    loading.value = false
    show.value = false
  }
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
