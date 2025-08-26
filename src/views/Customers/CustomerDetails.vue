<template>
  <AdminLayout>
    <FullScreenLayout>
      <div v-if="isLoading" class="flex justify-center items-center h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
      <div class="container mx-auto px-4 py-8" v-else-if="customer">
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

        <!-- Bandeau d'alerte pour client blacklisté -->

        <div
          v-if="customer.blacklisted"
          class="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <Ban class="h-6 w-6 text-red-500" />
            </div>
            <div class="ml-3 flex-grow">
              <h3 class="text-lg font-semibold text-red-800">{{ $t('BlacklistedCustomer') }}</h3>

              <!-- On affiche l'historique s'il existe -->
              <div v-if="blacklistHistory.length > 0" class="mt-2 text-sm text-red-700">
                <p class="font-medium mb-2">{{ $t('historyOfReason') }} :</p>
                <ul class="list-disc list-inside space-y-1">
                  <!-- On boucle sur l'historique -->
                  <li v-for="(item, index) in blacklistHistory" :key="index">
                    <span class="font-semibold">{{ formatDate(item.date.toISOString()) }}:</span>
                    {{ item.reason }}
                  </li>
                </ul>
              </div>
              <div v-else class="mt-2 text-sm text-red-700 italic">
                {{ $t('noSpecificReasonRecord') }}
              </div>

              <!-- Bouton pour débloquer le client -->
              <div class="mt-4">
                <button
                  @click="toggleBlacklistStatus"
                  class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
                >
                  <div
                    v-if="isLoading"
                    class="w-4 h-4 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"
                  ></div>
                  {{ $t('UnblacklistGuest') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <!--  Quick Overview Dashboard -->
          <div class="bg-gray-50 p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!--  Informations du Client -->
              <div class="lg:col-span-1 flex items-start space-x-5">
                <div
                  class="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Users class="w-10 h-10 text-gray-600" />
                </div>
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <h1 class="text-2xl font-bold text-gray-900">
                      {{ customer.title }} {{ customer.firstName }} {{ customer.lastName }}
                    </h1>
                  </div>
                  <!-- Badges de Statut -->
                  <div class="flex items-center gap-2 mb-3">
                    <span
                      v-if="customer.vipStatus"
                      class="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold uppercase"
                    >
                      <Star class="w-3 h-3 mr-1.5" />
                      {{ customer.vipStatus }}
                    </span>
                    <span
                      class="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium"
                    >
                      {{ customer.guestType }}
                    </span>
                  </div>
                  <!-- Contact & Préférences -->
                  <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex items-center space-x-2">
                      <Mail class="w-4 h-4" />
                      <span>{{ customer.email || 'N/A' }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Phone class="w-4 h-4" />
                      <span>{{ customer.phonePrimary || 'N/A' }}</span>
                    </div>
                    <div
                      v-if="
                        customer.preferences && Object.values(customer.preferences).some((v) => v)
                      "
                      class="flex items-start space-x-3 pt-2"
                    >
                      <Heart class="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />

                      <div class="flex-grow">
                        <h4 class="font-semibold text-gray-800 mb-2">Préférences du client</h4>

                        <!-- Conteneur pour les étiquettes -->
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-if="customer.preferences.floor"
                            class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                          >
                            {{ $t('floor') }} : {{ customer.preferences.floor }}
                          </span>
                          <span
                            v-if="customer.preferences.view"
                            class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full"
                          >
                            {{ $t('view') }} : {{ customer.preferences.view }}
                          </span>
                          <span
                            v-if="customer.preferences.bed_type"
                            class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full"
                          >
                            {{ $t('BedType') }} : {{ customer.preferences.bed_type }}
                          </span>
                        </div>

                        <!-- Affichage des notes plus longues en dessous -->
                        <p
                          v-if="customer.preferences.notes"
                          class="mt-3 text-sm text-gray-600 border-l-2 border-gray-200 pl-3"
                        >
                          {{ customer.preferences.notes }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Statut du Séjour (Actuel & À Venir) -->
              <div class="lg:col-span-1 space-y-4">
                <!-- Bloc 1: Séjour Actif (Checked-in) -->
                <div
                  v-if="customer.activeStay"
                  class="bg-white border-l-4 border-green-500 rounded-r-lg p-4 shadow-sm"
                >
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="font-semibold text-gray-800">{{ $t('CurrentlyInHouse') }}</h3>
                    <span
                      :class="getReservationStatusInfo(customer.activeStay.status).class"
                      class="text-xs font-bold px-2 py-0.5 rounded-full"
                    >
                      {{ getReservationStatusInfo(customer.activeStay.status).text }}
                    </span>
                  </div>
                  <div class="text-sm space-y-1">
                    <p>
                      <strong>{{ $t('Room') }}:</strong>
                      {{ customer.activeStay.room?.roomNumber || 'N/A' }}
                    </p>
                    <p>
                      <strong>{{ $t('departure') }}:</strong>
                      {{ formatDate(customer.activeStay.checkOutDate) }}
                    </p>
                  </div>
                  <button
                    @click="handleCheckOut"
                    class="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    {{ $t('CheckOut') }}
                  </button>
                </div>

                <!--  Prochain Séjour (Réservé) -->
                <div
                  v-else-if="customer.upcomingStay"
                  class="bg-white border-l-4 border-blue-500 rounded-r-lg p-4 shadow-sm"
                >
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="font-semibold text-gray-800">{{ $t('UpcomingStay') }}</h3>
                    <span
                      :class="getReservationStatusInfo(customer.upcomingStay.status).class"
                      class="text-xs font-bold px-2 py-0.5 rounded-full"
                    >
                      {{ getReservationStatusInfo(customer.upcomingStay.status).text }}
                    </span>
                  </div>
                  <div class="text-sm space-y-1">
                    <p>
                      <strong>{{ $t('Room Type') }}:</strong>
                      {{ customer.upcomingStay.roomType?.roomTypeName || 'N/A' }}
                    </p>
                    <p>
                      <strong>{{ $t('Check-in') }}:</strong>
                      {{ formatDate(customer.upcomingStay.checkInDate) }}
                    </p>
                  </div>
                  <button
                    @click="handleCheckIn"
                    class="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    {{ $t('CheckIn') }}
                  </button>
                </div>

                <!-- Bloc 3: Pas de séjour actif -->
                <div
                  v-else
                  class="bg-white rounded-lg p-4 h-full flex items-center justify-center text-gray-500"
                >
                  <p>{{ $t('Noactiveorupcomingstay') }}</p>
                </div>
              </div>

              <!-- Section 3: Finances & Actions Rapides -->
              <div class="lg:col-span-1">
                <div class="bg-indigo-600 text-white rounded-lg p-4 shadow-lg text-center">
                  <h3 class="font-semibold text-sm opacity-80 mb-1">
                    {{ $t('OutstandingBalance') }}
                  </h3>
                  <div class="text-4xl font-bold mb-3">
                    {{ formatCurrency(outstandingBalance) }}
                  </div>
                  <button
                    v-if="outstandingBalance > 0"
                    @click="emitPayNow"
                    class="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-lg transition"
                  >
                    {{ $t('ProcessPayment') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Barre d'Actions Opérationnelles Directes -->
            <div class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                @click="navigateToBookingPage"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <Calendar class="w-4 h-4" />
                <span>{{ $t('NewBooking') }}</span>
              </button>
              <button
                @click="handlePickupDropoff"
                class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition flex items-center space-x-2"
              >
                <Car class="w-4 h-4" />
                <span>{{ $t('Pickup/Dropoff') }}</span>
              </button>
              <button
                @click="navigateToEditPage"
                class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition flex items-center space-x-2"
              >
                <Edit class="w-4 h-4" />
                <span>{{ $t('EditProfile') }}</span>
              </button>
              <button
                @click="handleDeleteClick"
                class="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition flex items-center space-x-2 ml-auto"
              >
                <Trash2 class="w-4 h-4" />
                <span>{{ $t('delete') }}</span>
              </button>
            </div>
          </div>

          <!-- Enhanced Navigation Tabs -->
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

          <!-- Enhanced Content -->
          <div class="p-6">
            <!-- Details Tab -->
            <div
              v-if="activeTab === 'details'"
              class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6"
            >
              <!-- Basic Information -->
              <div class="bg-gradient-to-br bg-white border border-gray-200 rounded-xl p-6">
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

              <!-- Contact Information -->
              <div class="bg-gradient-to-br bg-white border border-gray-200 rounded-xl p-6">
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <Mail class="w-5 h-5 mr-2 text-purple-600" />
                  {{ $t('customerDetails.contactInfo.title') }}
                </h3>
                <div class="space-y-3">
                  <DetailRow
                    :label="$t('customerDetails.contactInfo.email')"
                    :value="customer.email"
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
            </div>

            <!-- Reservation History Tab -->
            <div v-if="activeTab === 'reservations'" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <Bookmark class="w-5 h-5 mr-2 text-blue-600" />
                  {{ $t('CompleteReservationHistory') }}
                </h3>
                <ReservationHistoryTable
                  :reservations="customer.reservations"
                  :customer="customer"
                  @check-in="handleReservationCheckIn"
                  @check-out="handleReservationCheckOut"
                  @view-details="handleViewReservationDetails"
                  @delete="handleDeleteReservation"
                />
              </div>
            </div>

            <!-- Payments Tab -->
            <div v-if="activeTab === 'payments'" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard class="w-5 h-5 mr-2 text-blue-600" />
                  {{ $t('PaymentHistoryFolios') }}
                </h3>
                <FolioTable
                  :payments="customer.folios || []"
                  @view-details="handleViewPaymentDetails"
                  @refund="handleRefundPayment"
                  @print-receipt="handlePrintReceipt"
                />
              </div>
            </div>

            <!-- Audit Log Tab -->
            <div v-if="activeTab === 'audit'" class="bg-white rounded-xl border border-gray-200">
              <div class="p-6">
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield class="w-5 h-5 mr-2 text-blue-600" />
                  {{ $t('GuestProfileAuditTrail') }}
                </h3>
                <template v-if="customer.auditLogs && customer.auditLogs.length > 0">
                  <AuditLogsTable :audit-logs="customer.auditLogs" />
                </template>
                <template v-else>
                  <div class="flex flex-col items-center justify-center text-gray-500 py-10">
                    <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
                    <p class="text-sm">{{ $t('Noauditlogsavailable') }}</p>
                  </div>
                </template>
              </div>
            </div>


            <!-- Calendar Tab -->
            <div v-if="activeTab === 'calendar'" class="bg-white rounded-xl border border-gray-200">
              <BaseCalendar
                :title="$t('GuestBookingCalendar')"
                :initial-date="selectedDate"
                :events="calendarEvents"
                @month-changed="onMonthChanged"
                @day-click="onDayClick"
              >
                <!-- Le slot #day-content gère l'affichage à l'intérieur d'une case du calendrier -->
                <template #day-content="{ day }">
                  <!-- On vérifie s'il y a des événements pour ce jour -->
                  <div
                    v-if="day.events.length > 0"
                    class="w-full text-center p-1 rounded-md text-xs truncate"
                  >
                    <!-- Affichage pour un séjour EN COURS -->
                    <div v-if="day.events[0].type === 'current'" class="bg-blue-100 text-blue-800">
                      <div>
                        <strong>{{ day.events[0].reservation.roomNumber }}</strong>
                      </div>
                      <div class="opacity-75">{{ $t('InProgress') }}</div>
                    </div>

                    <!-- Affichage pour un séjour À VENIR -->
                    <div
                      v-else-if="day.events[0].type === 'upcoming'"
                      class="bg-yellow-100 text-yellow-800"
                    >
                      <div>
                        <strong>{{ day.events[0].reservation.roomNumber }}</strong>
                      </div>
                      <div class="opacity-75">{{ $t('reserved') }}</div>
                    </div>

                    <!-- Affichage pour un séjour PASSÉ -->
                    <div
                      v-else-if="day.events[0].type === 'past'"
                      class="bg-gray-100 text-gray-500"
                    >
                      <div class="opacity-75">{{ $t('Pass') }}</div>
                    </div>
                  </div>
                </template>

                <!-- La légende doit refléter nos nouveaux types d'événements -->
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
        </div>

        <OverLoading v-if="isLoading" />
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
import { getCustomerProfile, deleteGuest, toggleGuestBlacklist } from '@/services/guestApi'
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

const { t, locale } = useI18n()
const toast = useToast()

// Reactive references
const customer_id = router.currentRoute.value.params.id as string
const customer = ref<any>(null) // Initialiser à null pour un v-if plus clair
const activeTab = ref<string>('details')
const loading = ref(false)
const deleting = ref(false)
const customerToDelete = ref<any>(null)

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
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
    const payload =  data.reason || 'Statut mis à jour'

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

const handleCheckIn = () => {
  // Implement check-in logic
  console.log('Check-in for guest:', customer.value.id)
  toast.success(t('toast.checkinSuccess'))
}

const handleCheckOut = () => {
  // Implement check-out logic
  console.log('Check-out for guest:', customer.value.id)
  toast.success(t('toast.checkoutSuccess'))
}

const handleReservationCheckIn = (reservation: any) => {
  // Handle check-in for specific reservation
  console.log('Check-in for reservation:', reservation.id)
}

const handleReservationCheckOut = (reservation: any) => {
  // Handle check-out for specific reservation
  console.log('Check-out for reservation:', reservation.id)
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

// Lifecycle
onMounted(() => {
  getCustomerProfileDetails()
})
</script>

<style scoped>
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

.glass-effect {
  backdrop-filter: blur(10px);
  background: rgba(245, 245, 245, 1);
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.status-badge {
  animation: pulse 2s infinite;
}
</style>
