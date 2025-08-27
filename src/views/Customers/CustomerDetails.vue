<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="h-full" v-if="customer">
        <!-- Modern Header Section -->
        <div class="shadow-sm px-4 py-3 mx-4 bg-white flex justify-between items-center">
          <div class="flex gap-3 items-center">
            <button
              @click="goBack"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <Users class="w-6 h-6 text-primary" />
            <div class="flex flex-col">
              <span class="font-bold text-lg">{{ customer.title }} {{ customer.firstName }} {{ customer.lastName }}</span>
              <div class="flex items-center gap-2 mt-1">
                <span
                  v-if="customer.vipStatus"
                  class="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold uppercase"
                >
                  <Star class="w-3 h-3 mr-1" />
                  {{ customer.vipStatus }}
                </span>
                <span
                  class="inline-flex items-center px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full text-xs font-medium"
                >
                  {{ customer.guestType }}
                </span>
                <span
                  v-if="customer.blacklisted"
                  class="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-semibold"
                >
                  <Ban class="w-3 h-3 mr-1" />
                  {{ $t('Blacklisted') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Guest Stats -->

            <div class="flex flex-col text-center">
              <span class="text-sm font-bold mb-1">{{ $t('Outstanding') }}</span>
              <div class="relative">
                <span
                  :class="[
                    'text-lg font-bold px-3 py-1 rounded-lg',
                    outstandingBalance > 0
                      ? 'text-red-700 bg-red-100 border border-red-300 shadow-md'
                      : 'text-green-700 bg-green-100 border border-green-300'
                  ]"
                >
                  {{ formatCurrency(outstandingBalance) }}
                </span>
                <div
                  v-if="outstandingBalance > 0"
                  class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
                ></div>
              </div>
              </div>



          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              v-if="!customer.blacklisted"
              @click="navigateToBookingPage"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Calendar class="w-4 h-4" />
              {{ $t('NewBooking') }}
            </button>
            <button
              @click="navigateToEditPage"
              class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition flex items-center gap-2"
            >
              <Edit class="w-4 h-4" />
              {{ $t('EditProfile') }}
            </button>
          </div>
        </div>

        <!-- Blacklist Alert Banner -->
        <div
          v-if="customer.blacklisted"
          class="mx-4 mt-4 p-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg"
        >
          <div class="flex items-start">
            <Ban class="h-5 w-5 text-red-500 mt-0.5" />
            <div class="ml-3">
              <h3 class="text-sm font-semibold text-red-800">{{ $t('BlacklistedCustomer') }}</h3>
              <div v-if="blacklistHistory.length > 0" class="mt-1 text-xs text-red-700">
                <p class="font-medium">{{ $t('historyOfReason') }}:</p>
                <ul class="list-disc list-inside mt-1 space-y-0.5">
                  <li v-for="(item, index) in blacklistHistory" :key="index">
                    <span class="font-semibold">{{ formatDate(item.date.toISOString()) }}:</span>
                    {{ item.reason }}
                  </li>
                </ul>
              </div>
              <button
                @click="toggleBlacklistStatus"
                class="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition"
              >
                {{ $t('UnblacklistGuest') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="shadow-sm px-2 pt-1 mx-4 bg-white mt-5">
          <div class="flex justify-between w-full">
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
            <div class="flex items-center px-4">
              <button
                @click="handleDeleteClick"
                class="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 transition flex items-center gap-2"
              >
                <Trash2 class="w-4 h-4" />
                <span>{{ $t('delete') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="mx-4 bg-white">
          <!-- Details Tab -->
          <div
            v-if="activeTab === 'details'"
            class="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <!-- Basic Information Card -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <InfoIcon class="w-5 h-5 mr-2 text-blue-600" />
                {{ $t('Basic_Information') }}
              </h3>
              <div class="space-y-3">
                <DetailRow
                  :label="$t('customerDetails.basicInfo.firstName')"
                  :value="customer.firstName || 'N/A'"
                />
                <DetailRow
                  :label="$t('customerDetails.basicInfo.lastName')"
                  :value="customer.lastName || 'N/A'"
                />
                <DetailRow
                  :label="$t('customerDetails.basicInfo.gender')"
                  :value="customer.gender || 'N/A'"
                />
                <DetailRow
                  :label="$t('customerDetails.basicInfo.dateOfBirth')"
                  :value="customer.dateOfBirth || 'N/A'"
                />
                <DetailRow
                  :label="$t('customerDetails.basicInfo.nationality')"
                  :value="customer.country || 'N/A'"
                  type="badge"
                />
                <DetailRow
                    v-if="customer.passportNumber"
                    :label="$t('customerDetails.basicInfo.passportNumber')"
                    :value="customer.passportNumber"
                  />

                  <DetailRow
                    v-else-if="customer.idNumber"
                    :label="$t('customerDetails.basicInfo.nationalID')"
                    :value="customer.idNumber"
                  />

                  <DetailRow
                    v-else-if="customer.visaNumber"
                    :label="$t('customerDetails.basicInfo.visaNumber')"
                    :value="customer.visaNumber"
                  />

                  <DetailRow
                    v-else
                    :label="$t('customerDetails.basicInfo.Identification')"
                    :value="$t('Notprovided')"
                    type="badge"
                  />
              </div>
            </div>

            <!-- Contact Information Card -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <Mail class="w-5 h-5 mr-2 text-purple-600" />
                {{ $t('customerDetails.contactInfo.title') }}
              </h3>
              <div class="space-y-3">
                <DetailRow
                  :label="$t('customerDetails.contactInfo.email')"
                  :value="customer.email || 'N/A'"
                />
                <DetailRow
                  :label="$t('customerDetails.contactInfo.phone')"
                  :value="customer.phonePrimary || 'N/A'"
                />
                <DetailRow
                  :label="$t('customerDetails.contactInfo.address')"
                  :value="customer.addressLine || 'N/A'"
                />
              </div>
            </div>

            <!-- Current Stay Status -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <BedDouble class="w-5 h-5 mr-2 text-green-600" />
                {{ $t('Stays Status') }}
              </h3>

              <!-- Timeline container -->
              <div class="relative border-l border-gray-300 pl-6 space-y-4 max-h-[250px] overflow-y-auto sidebar-scroll pr-2">
                <!-- Active Stays -->
                <div v-for="stay in customer.activeStays" :key="stay.id" class="relative">
                  <span class="absolute -left-3 flex items-center justify-center w-6 h-6 bg-green-500 rounded-full ring-4 ring-white">
                    🏨
                  </span>

                  <!-- Card -->
                  <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition border-l-4 border-green-500">
                    <div class="flex justify-between items-center mb-2">
                      <h4 class="font-semibold text-gray-800">{{ $t('CurrentlyInHouse') }}</h4>
                      <span
                        :class="getReservationStatusInfo(stay.status).class"
                        class="text-xs font-bold px-2 py-0.5 rounded-full"
                      >
                        {{ getReservationStatusInfo(stay.status).text }}
                      </span>
                    </div>
                    <div class="text-sm space-y-1">
                      <p><strong>{{ $t('Room') }}:</strong> {{ stay.room?.roomNumber || 'N/A' }}</p>
                      <p><strong>{{ $t('departure') }}:</strong> {{ formatDate(stay.checkOutDate) }}</p>
                    </div>
                    <button
                      v-if="!customer.blacklisted"
                      @click="handleCheckOut(stay)"
                      class="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isCheckingOut === stay.id"
                    >
                      <Spinner v-if="isCheckingOut === stay.id" class="w-4 h-4" />
                      <!-- <span>{{ isCheckingOut ? $t('CheckOut...') : $t('CheckOut') }}</span> -->
                    </button>
                  </div>
                </div>

                <!-- Upcoming Stay -->
                <div v-if="customer.upcomingStay" class="relative">
                  <span class="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full ring-4 ring-white">
                    📅
                  </span>

                  <!-- Card -->
                  <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition border-l-4 border-blue-500">
                    <div class="flex justify-between items-center mb-2">
                      <h4 class="font-semibold text-gray-800">{{ $t('UpcomingStay') }}</h4>
                      <span
                        :class="getReservationStatusInfo(customer.upcomingStay.status).class"
                        class="text-xs font-bold px-2 py-0.5 rounded-full"
                      >
                        {{ getReservationStatusInfo(customer.upcomingStay.status).text }}
                      </span>
                    </div>
                    <div class="text-sm space-y-1">
                      <p><strong>{{ $t('Room Type') }}:</strong> {{ customer.upcomingStay.roomType?.roomTypeName || 'N/A' }}</p>
                      <p><strong>{{ $t('Check-in') }}:</strong> {{ formatDate(customer.upcomingStay.checkInDate) }}</p>
                    </div>
                    <button
                      v-if="!customer.blacklisted && canCheckInToday(customer.upcomingStay)"
                      @click="handleCheckIn(customer.upcomingStay)"
                      class="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isCheckingIn === customer.upcomingStay.id"
                    >
                      <Spinner v-if="isCheckingIn === customer.upcomingStay.id" class="w-4 h-4" />
                      <!-- <span>{{ isCheckingIn ? $t('CheckingIn....') : $t('CheckIn') }}</span> -->
                    </button>
                    <div
                      v-else-if="!customer.blacklisted"
                      class="mt-3 text-center text-sm text-gray-500 p-2 bg-gray-100 rounded-md"
                    >
                      {{ $t('check_in_available') }}
                      {{ formatDate(customer.upcomingStay.checkInDate) }}
                    </div>
                  </div>
                </div>

                <!-- No active or upcoming stay -->
                <div
                  v-if="(!customer.activeStays || customer.activeStays.length === 0) && !customer.upcomingStay"
                  class="text-gray-500 text-center p-4"
                >
                  <BedDouble class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p class="text-sm">{{ $t('Noactiveorupcomingstay') }}</p>
                </div>
              </div>
            </div>


            <!-- Guest Preferences -->
            <div
              v-if="customer.preferences && Array.isArray(customer.preferences) && customer.preferences.length > 0"
              class="bg-white border border-gray-200 rounded-xl p-6 lg:col-span-2 xl:col-span-3"
            >
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <Heart class="w-5 h-5 mr-2 text-pink-600" />
                {{ $t('GuestPreferences') }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="preference in customer.preferences"
                  :key="preference.value"
                  class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full"
                >
                  {{ preference.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Other tabs content remains the same -->
          <div v-if="activeTab === 'reservations'" class="p-6">
            <ReservationHistoryTable
              :reservations="customer.reservations"
              :customer="customer"
              @check-in="handleReservationCheckIn"
              @check-out="handleReservationCheckOut"
              @view-details="handleViewReservationDetails"
              @delete="handleDeleteReservation"
            />
          </div>

          <div v-if="activeTab === 'payments'" class="p-6">
            <FolioTable
              :payments="customer.folios || []"
              @view-details="handleViewPaymentDetails"
              @refund="handleRefundPayment"
              @print-receipt="handlePrintReceipt"
            />
          </div>

          <div v-if="activeTab === 'audit'" class="p-6">
            <template v-if="auditLogs.length > 0">
               <AuditLogsTable
                :logs="auditLogs"
                :expanded-changes="[]"
                @toggle-changes="handleToggleChanges"

              />
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center text-gray-500 py-10">
                <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
                <p class="text-sm">{{ $t('Noauditlogsavailable') }}</p>
              </div>
            </template>
          </div>

          <div v-if="activeTab === 'calendar'" class="p-6">
            <BaseCalendar
              :title="$t('GuestBookingCalendar')"
              :initial-date="selectedDate"
              :events="calendarEvents"
              @month-changed="onMonthChanged"
              @day-click="onDayClick"
            >
              <template #day-content="{ day }">
                <div v-if="day.events.length > 0" class="w-full text-center p-1 rounded-md text-xs truncate">
                  <div v-if="day.events[0].type === 'current'" class="bg-blue-100 text-blue-800">
                    <div><strong>{{ day.events[0].reservation.roomNumber }}</strong></div>
                    <div class="opacity-75">{{ $t('inprogress') }}</div>
                  </div>
                  <div v-else-if="day.events[0].type === 'upcoming'" class="bg-yellow-100 text-yellow-800">
                    <div><strong>{{ day.events[0].reservation.roomNumber }}</strong></div>
                    <div class="opacity-75">{{ $t('reserved') }}</div>
                  </div>
                  <div v-else-if="day.events[0].type === 'past'" class="bg-gray-100 text-gray-500">
                    <div class="opacity-75">{{ $t('Pass') }}</div>
                  </div>
                </div>
              </template>
              <template #legend>
                <div class="flex items-center justify-center space-x-6 mt-4 p-2 border-t">
                  <LegendItem color="blue" :label="$t('CurrentStay')" />
                  <LegendItem color="yellow" :label="$t('UpcomingStay')" />
                  <LegendItem color="gray" :label="$t('PastStay')" />
                </div>
              </template>
            </BaseCalendar>
          </div>
        </div>

        <OverLoading v-if="isLoading" />
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <!-- Modals -->
      <template v-if="selectBooking">
        <PaymentModal
          :reservation="selectBooking"
          :is-open="openPayment"
          @close="openPayment = false"
          @payment-recorded="getPaymentDetails"
        />
      </template>

      <template v-if="show">
        <ModalConfirmation
          v-if="show"
          :is-loading="deleting"
          :title="$t('guestDatabase.delete_title')"
          :message="
            $t('guestDatabase.delete_confirm_message', { name: customerToDelete?.fullName })
          "
          action="DANGER"
          @close="closeDeleteModal"
          @confirm="confirmDeleteCustomer"
        />
      </template>

      <!-- Pickup/Dropoff Modal -->
      <template v-if="showPickupModal">
        <PickupDropoffModal
          :isOpen="showPickupModal"
          :guest="customer"
          @close="showPickupModal = false"
          @saved="handlePickupSaved"
        />
      </template>
      <BlackListGuestModal
        v-if="showBlacklistModal"
        :isOpen="showBlacklistModal"
        :isLoading="blacklisting"
        :guestData="customerToBlacklist"
        @close="closeBlacklistModal"
        @confirm="confirmBlacklistCustomer"
      />
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { Star, Heart, Phone, Car, Edit, Trash2, Calendar, Shield } from 'lucide-vue-next'
import { Mail, CreditCard, Bookmark, Users } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import InfoIcon from '@/icons/InfoIcon.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import { isLoading } from '@/composables/spinner'
import DetailRow from '../Room/DetailRow.vue'
import { getCustomerProfile, deleteGuest, toggleGuestBlacklist ,getGuestsActivityLogs} from '@/services/guestApi'
import router from '@/router'
import { Ban } from 'lucide-vue-next'
import PaymentModal from '../Bookings/PaymentModal.vue'
import FolioTable from '@/components/tables/FolioTable.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import BaseCalendar from '@/components/calendars/BaseCalendar.vue'
import LegendItem from '@/components/calendars/LegendItem.vue'
import BlackListGuestModal from '@/components/customers/BlackListGuestModal.vue'
import ReservationHistoryTable from '../../components/tables/ReservationHistoryTable.vue'
import AuditLogsTable from '@/components/tables/AuditLogsTable.vue'
// import PickupDropoffModal from '@/components/modal/PickupDropoffModal.vue'
import { useToast } from 'vue-toastification'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { CalendarEvent } from '@/components/calendars/BaseCalendar.vue'
import { checkInReservation,checkOutReservation } from '@/services/reservation'
import { useAuthStore } from '@/composables/user'
import { BedDouble, CalendarClock, CalendarX ,FileSearch} from 'lucide-vue-next';
import Spinner from '@/components/spinner/Spinner.vue'
import {  ArrowLeft } from 'lucide-vue-next'
import { useServiceStore } from '@/composables/serviceStore'


interface AuditLog {
  id: string | number
  action: string
  description: string
  changes?: Record<string, { old: any; new: any }> | null
  timestamp: string
  userId: string | number
  userName?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  sessionId?: string | null
  entityId?: string | number | null
  entityType?: string | null
  meta?: Record<string, any> | null
}


const { t, locale } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
// Reactive references
const customer_id = router.currentRoute.value.params.id as string
const customer = ref<any>(null) // Initialiser à null pour un v-if plus clair
const activeTab = ref<string>('details')
const loading = ref(false)
const deleting = ref(false)
const customerToDelete = ref<any>(null)
const authStore = useAuthStore()
const auditLogs = ref<AuditLog[]>([])

// Modal states

const show = ref(false)
const openPayment = ref(false)
const showNewBookingModal = ref(false)
const showPickupModal = ref(false)
const selectBooking = ref(null)
const selectedDate = ref(new Date())
const showBlacklistModal = ref(false)
const blacklisting = ref(false)
const customerToBlacklist = ref<any>(null)
const isCheckingIn = ref<number | null>(null)
const isCheckingOut = ref<number | null>(null);

// Enhanced tabs with audit log
const tabs = computed(() => [
  { id: 'details', label: t('tab.details'), icon: InfoIcon },
  { id: 'reservations', label: t('tab.reservationHistory'), icon: Bookmark },
  { id: 'payments', label: t('tab.payments'), icon: CreditCard },
  { id: 'audit', label: t('tab.auditLog'), icon: Shield },
  { id: 'calendar', label: t('tab.calendar'), icon: CalendarIcon },
])

// Computed properties

const calendarEvents = computed<CalendarEvent[]>(() => {
  if (!customer.value?.reservations || customer.value.reservations.length === 0) {
    return []
  }

  const events = []

  // On boucle sur TOUTES les réservations du client
  for (const reservation of customer.value.reservations) {
    // On s'assure que les dates sont valides
    if (!reservation.arrivedDate || !reservation.departDate) {
      continue
    }

    const startDate = new Date(reservation.arrivedDate)
    const endDate = new Date(reservation.departDate)

    // Normaliser les dates pour éviter les problèmes de fuseaux horaires
    const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

    let eventType = 'past' // Par défaut, un séjour passé

    if (reservation.status === 'checked_in') {
      eventType = 'current' // Séjour en cours
    } else if (['confirmed', 'reserved', 'pending'].includes(reservation.status)) {
      eventType = 'upcoming' // Séjour à venir
    } else if (['completed', 'checked_out'].includes(reservation.status)) {
      eventType = 'past' // Séjour passé/terminé
    } else {
      continue // On ignore les réservations annulées, voided, etc.
    }

    // On crée un événement pour chaque jour de la réservation
    let currentDate = new Date(startDate)
    while (normalize(currentDate) <= normalize(endDate)) {
      events.push({
        date: new Date(currentDate),
        type: eventType,
        // On attache la réservation entière pour pouvoir afficher ses détails
        reservation: {
          ...reservation,
          // On essaie de trouver le numéro de chambre dans reservationRooms
          roomNumber: reservation.reservationRooms?.[0]?.room?.roomNumber || 'N/A',
        },
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
  }

  return events
})

// Utility functions
const formatDate = (dateStr:any, currentLocale = locale.value) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount: string | number): string => {
  const numAmount = parseFloat(String(amount)) || 0
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(numAmount)
}

const goBack = (): void => {
  router.back()
}

const outstandingBalance = computed(() => {
  if (!customer.value?.folios) return 0
  return customer.value.folios
    .filter((folio: any) => folio.status === 'open')
    .reduce((total: number, folio: any) => total + parseFloat(folio.balance || 0), 0)
})

/**
 * Retourne un objet avec un texte et une couleur de classe CSS
 * basé sur le statut de la réservation pour un affichage cohérent.
 */
const getReservationStatusInfo = (status: string) => {
  const statusMap: { [key: string]: { text: string; class: string } } = {
    checked_in: { text: t('reservationStatus.checked_in'), class: 'bg-green-100 text-green-800' },
    reserved: { text: t('reservationStatus.reserved'), class: 'bg-blue-100 text-blue-800' },
    confirmed: { text: t('reservationStatus.confirmed'), class: 'bg-indigo-100 text-indigo-800' },
    cancelled: { text: t('reservationStatus.cancelled'), class: 'bg-red-100 text-red-800' },
    no_show: { text: t('reservationStatus.no_show'), class: 'bg-yellow-100 text-yellow-800' },
  }
  return statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800' }
}

// --- Fonctions API ---
const getCustomerProfileDetails = async () => {
  isLoading.value = true
  try {
    const response = await getCustomerProfile(parseInt(customer_id))
    if (response.status === 200) {
      customer.value = response.data.data.guest
      console.log('Fetched customer details:', customer.value)
    }
  } catch (error) {
    console.error('Error fetching customer details:', error)
    toast.error(t('toast.fetchError'))
  } finally {
    isLoading.value = false
  }
}

const toggleBlacklistStatus = () => {
  if (!customer.value) return

  // On prépare les données pour la modale
  customerToBlacklist.value = customer.value
  // On ouvre la modale
  showBlacklistModal.value = true
}

// Cette fonction sera appelée par l'événement "confirm" de la modale
const confirmBlacklistCustomer = async (data: { reason?: string; blacklisted: boolean }) => {
  if (!customerToBlacklist.value) return

  blacklisting.value = true
  try {
    const payload = data.reason || 'Statut mis à jour'

    await toggleGuestBlacklist(customerToBlacklist.value.id, payload)

    const successMessage = data.blacklisted
      ? t('toast.guestBlacklistedSuccess', { name: customerToBlacklist.value.fullName })
      : t('toast.guestUnblacklistedSuccess', { name: customerToBlacklist.value.fullName })

    toast.success(successMessage)

    // On recharge les données de la page pour voir les changements
    await getCustomerProfileDetails()
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut blacklisté:', error)
    toast.error('Échec de la mise à jour du statut.')
  } finally {
    blacklisting.value = false
    closeBlacklistModal() // On ferme la modale après l'opération
  }
}

const confirmDeleteCustomer = async () => {
  if (!customerToDelete.value) {
    toast.error('Aucun client sélectionné pour la suppression.')
    return
  }

  try {
    deleting.value = true
    await deleteGuest(customerToDelete.value.id)
    toast.success(t('toast.DeletedSuccess'))
    router.push({ name: 'Customers' })
  } catch (error: any) {
    console.error('Erreur lors de la suppression du client:', error)
    if (error.response && error.response.status === 409) {
      toast.error(t('errors.deleteGuestConflict'))
    } else {
      toast.error(t('toast.deleteError'))
    }
  } finally {
    deleting.value = false
    closeDeleteModal()
  }
}

// Computed pour l'historique de blacklist

const blacklistHistory = computed(() => {
  if (!customer.value?.blacklisted || !customer.value.notes) {
    return []
  }

  const notesArray = customer.value.notes.split('\n').filter((note) => note.trim() !== '')

  const history = notesArray
    .filter((note) => note.includes('[') && note.includes('] Blacklisted:'))
    .map((note) => {
      try {
        const timestampMatch = note.match(/\[(.*?)\]/)
        const reasonMatch = note.split('Blacklisted:')[1]

        if (timestampMatch && reasonMatch) {
          return {
            date: new Date(timestampMatch[1]),
            reason: reasonMatch.trim(),
          }
        }
        return null
      } catch (e) {
        return null
      }
    })
    .filter((item) => item !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return history
})

// Event handlers

const handlePickupDropoff = () => {
  showPickupModal.value = true
}



const handleCheckIn = async (stay: any) => {
  if (!stay || !stay.reservationId) {
    toast.error(t('toast.invalidData'));
    return;
  }

  isCheckingIn.value = stay.id;

  try {
    const fullReservation = customer.value.reservations.find(
      (r: any) => r.id === stay.reservationId
    );

    if (!fullReservation || !fullReservation.reservationRooms || fullReservation.reservationRooms.length === 0) {
      toast.error(t('toast.noRoomsFound'));
      isCheckingIn.value = null;
      return;
    }

    const reservationRoomIds = fullReservation.reservationRooms.map((room: any) => room.id);

    const checkInData = {
      reservationRooms: reservationRoomIds,
      // notes: `Check-in effectué depuis la page de détails du client.`,
    };

    console.log("Envoi du payload de check-in:", checkInData);

    await checkInReservation(fullReservation.id, checkInData);

    toast.success(t('toast.checkInSuccess'));
    await getCustomerProfileDetails();

  } catch (error) {
    console.error('Erreur lors du check-in:', error);
    toast.error(t('toast.checkInError'));
  } finally {
    isCheckingIn.value = null;
  }
};



// check-out handler

const handleCheckOut = async (stay: any) => {
  if (!stay || !stay.reservationId) {
    toast.error(t('toast.InvalidReservationForCheckout'));
    return;
  }
  isCheckingOut.value = stay.id;

  try {

    const fullReservation = customer.value.reservations.find(
      (r: any) => r.id === stay.reservationId
    );
    if (!fullReservation) {
      toast.error(t('toast.noReservationFound'));
      isCheckingOut.value = null;
      return;
    }

    const reservationRoomIds = fullReservation.reservationRooms
      .filter((room: any) => room.status === 'checked_in')
      .map((room: any) => room.id);

    if (reservationRoomIds.length === 0) {
       toast.info(t('toast.noRoomsCurrently'));
       isCheckingOut.value = null;
       return;
    }

    const checkOutData = {
      reservationRooms: reservationRoomIds,
      // notes: `Check-out effectué depuis la page de détails du client.`,

    };

    console.log("Envoi du payload de check-out:", checkOutData);

    const response = await checkOutReservation(fullReservation.id, checkOutData);

    if (response) {
      toast.success(t('toast.checkOutSuccess'));
      await getCustomerProfileDetails();
    }

  } catch (error: any) {
    console.error('Erreur détaillée lors du check-out:', error.response);

    // Extrait le message d'erreur du backend s'il existe
    const mainMessage = error.response?.data?.message || t('toast.checkOutError');
    const errorDetails = error.response?.data?.errors?.join(', ') || '';

    toast.error(`${mainMessage} ${errorDetails ? `(${errorDetails})` : ''}`);

  } finally {
    isCheckingOut.value = null;
  }
};

const handleReservationCheckIn = (reservation: any) => {

  console.log('Check-in for reservation:', reservation.id)

  const stayObject = {
    id: reservation.id,
    reservationId: reservation.id
  };

  handleCheckIn(stayObject);
}

const handleReservationCheckOut = (reservation: any) => {

  console.log('Lancement du check-out pour la réservation depuis le tableau:', reservation.id);
  const stayObject = {
    id: reservation.id,
    reservationId: reservation.id
  };

  handleCheckOut(stayObject);
}


const handleViewReservationDetails = (reservation: any) => {
  // Navigate to reservation details
  router.push({ name: 'ReservationDetails', params: { id: reservation.id } })
}

const handleDeleteReservation = (reservation: any) => {
  console.log('Supprimer la réservation:', reservation.id)
}

const handlePickupSaved = () => {
  showPickupModal.value = false
  toast.success(t('toast.pickupSaved'))
  getCustomerProfileDetails()
}

const emitPayNow = () => {
  openPayment.value = true
}

const getPaymentDetails = () => {
  openPayment.value = false
  getCustomerProfileDetails()
}

const closeDeleteModal = () => {
  show.value = false
  customerToDelete.value = null
}

const navigateToEditPage = () => {
  if (customer.value?.id) {
    router.push({
      name: 'CustomerEdit',
      params: { id: customer.value.id },
    })
  } else {
    console.error('Impossible de naviguer : ID du client manquant.')
    toast.error('Une erreur est survenue, impossible de modifier le client.')
  }
}

const navigateToBookingPage = () => {
  if (customer.value?.id) {
    router.push({
      name: 'New Booking',
      params: { id: customer.value.id },
    })
  } else {
    console.error('Impossible de naviguer : ID du client manquant.')
    toast.error('Une erreur est survenue, impossible de booker le client.')
  }
}

const closeBlacklistModal = () => {
  showBlacklistModal.value = false
  customerToBlacklist.value = null
}

// Calendar event handlers
const onMonthChanged = (date: Date) => {
  console.log('Month changed:', date)
}

const onDayClick = (day: any) => {
  console.log('Day clicked:', day)
  selectedDate.value = day.date
}

const handleDeleteClick = () => {
  customerToDelete.value = customer.value
  show.value = true
}

const handleViewPaymentDetails = (payment: any) => {
  console.log('Voir les détails du paiement:', payment.id)
}

const handleRefundPayment = (payment: any) => {
  console.log('Rembourser le paiement:', payment.id)
}

const handlePrintReceipt = (payment: any) => {
  console.log('Imprimer le reçu pour le paiement:', payment.id)
}

const canCheckInToday = (reservation: any): boolean => {
  if (!reservation || !reservation.checkInDate) {
    return false
  }

  const now = new Date()
  const checkInDate = new Date(reservation.checkInDate)

  return now.toDateString() === checkInDate.toDateString()
}

const fetchActivityLogs = async () => {
  if (loading.value) return

  loading.value = true

  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId || !customer_id) {
      console.warn("Missing hotelId or customer_id for fetching logs.");
      loading.value = false;
      return;
    }

    const params: Record<string, any> = {
      // page: currentPage.value,
      limit: 15,
    }

    const res = await getGuestsActivityLogs(hotelId, Number(customer_id), params)

    const newLogs: AuditLog[] = res.data.data.map((log: any) => ({
        id: log.id,
        action: log.action,
        description: log.description,
        changes: log.changes || null,
        timestamp: log.timestamp,
        userId: log.userId,
        userName: log.userName || null,
        ipAddress: log.ipAddress || null,
        userAgent: log.userAgent || null,
        sessionId: log.sessionId || null,
        entityId: log.entityId || null,
        entityType: log.entityType || null,
        meta: log.meta || null,
    }));
    auditLogs.value = newLogs
    console.log("newlog",newLogs)


  } catch (err: any) {
    console.error("Erreur récupération logs:", err)

  } finally {
    loading.value = false
  }
}
const expandedChanges = ref<string[]>([])

const handleToggleChanges = (logId: string) => {
  const index = expandedChanges.value.indexOf(logId)
  if (index > -1) {
    expandedChanges.value.splice(index, 1)
  } else {
    expandedChanges.value.push(logId)
  }
}

// Lifecycle
onMounted(() => {
  getCustomerProfileDetails()
  fetchActivityLogs()
})
</script>

<style scoped>
/* Keep your existing styles */
.slide-in {
  animation: slideIn 0.6s ease-out;
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

.sidebar-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sidebar-scroll::-webkit-scrollbar {
  display: none;
}
</style>
