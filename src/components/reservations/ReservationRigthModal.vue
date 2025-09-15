<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 h-screen overflow-hidden" @click="closeModal">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/25 bg-opacity-50 transition-opacity"></div>

        <!-- Modal Container -->
        <div class="fixed inset-y-0 top-0 h-screen right-0 flex max-w-full pl-10">
            <div class="relative  max-w-7xl transform transition-transform duration-300 ease-in-out" @click.stop>
                <!-- Modal Content -->
                <!-- Loading Skeleton -->
                <div v-if="isLoading" class="flex h-full flex-col bg-white shadow-xl dark:bg-gray-900">
                    <!-- Header Skeleton -->
                    <div
                        class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                            <div>
                                <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                            </div>
                        </div>
                        <button @click="closeModal"
                            class="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Content Skeleton -->
                    <div class="flex-1 overflow-y-auto">
                        <div class="px-6 py-6">
                            <div class="space-y-6">
                                <!-- Buttons Skeleton -->
                                <div class="flex gap-2">
                                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                                </div>

                                <!-- Guest Info Skeleton -->
                                <div class="space-y-4">
                                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                                    <div class="space-y-2">
                                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse">
                                        </div>
                                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                                    </div>
                                </div>

                                <!-- Reservation Details Skeleton -->
                                <div class="space-y-4">
                                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                                    <div class="space-y-2">
                                        <div class="flex justify-between">
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse">
                                            </div>
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse">
                                            </div>
                                        </div>
                                        <div class="flex justify-between">
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse">
                                            </div>
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse">
                                            </div>
                                        </div>
                                        <div class="flex justify-between">
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse">
                                            </div>
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Financial Info Skeleton -->
                                <div class="border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <div class="space-y-2">
                                        <div class="flex justify-between">
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse">
                                            </div>
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse">
                                            </div>
                                        </div>
                                        <div class="flex justify-between">
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse">
                                            </div>
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-18 animate-pulse">
                                            </div>
                                        </div>
                                        <div class="flex justify-between">
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse">
                                            </div>
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actual Content -->
                <div v-else-if="reservation" class="flex h-full flex-col bg-white shadow-xl dark:bg-gray-900">
                    <!-- Header -->
                    <div
                        class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <HouseIcon class="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <div>
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {{ reservation.guest?.displayName }}
                                    </h2>
                                    <div class="text-sm flex gap-2 text-gray-500 dark:text-gray-400">
                                        <div v-if="reservation.guest?.country"
                                            class="flex align-middle self-center content-center items-center gap-1">
                                            <MapPin class="w-4 h-4" /><span>{{
                                                $t(`countries_lists.${reservation.guest?.country.toLowerCase()}`)
                                                }}</span>
                                        </div>
                                        <div v-if="reservation.guest?.phonePrimary
                                        " class="flex align-middle self-center content-center items-center gap-1">
                                            <PhoneCall class="w-3 h-3" /><span>{{ $t(reservation.guest?.phonePrimary)
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button @click="closeModal"
                            class="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 overflow-y-auto flex">
                        <div class="px-6 py-6 col-span-2">
                            <slot>
                                <!-- Default content -->
                                <div class="space-y-6 ">
                                    <!-- Buttons -->
                                    <div class="flex gap-2">
                                        <button class="rounded-lg bg-primary text-sm text-white px-4"
                                            @click="gotoResevationDetails">
                                            {{ $t('editreservation') }}</button>
                                             <div v-if="isPerformingAction" class="flex items-center px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                                                <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {{ getActionLoadingText(currentAction) }}
                                              </div>

                                              <!-- Dropdown normal -->
                                              <ButtonDropdown
                                                v-else
                                               :button-class="'bg-white text-sm border border-primary text-primary'"
                                                :options="dropdownOptions" :button-text="t('Options')"
                                                @option-selected="handleOptionSelected"
                                              />

                                        <!-- <ButtonDropdown
                                            :button-class="'bg-white text-sm border border-primary text-primary'"
                                            :options="dropdownOptions" :button-text="t('Options')"
                                            @option-selected="handleOptionSelected" /> -->
                                        <ButtonDropdown :options="printOptions" :button-text="t('printSend')"
                                            :button-class="'bg-white text-sm border border-primary text-primary'"
                                            @option-selected="handlePrintOptionSelected" />
                                    </div>

                                    <!-- Reservation Info -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('reservationNumber') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{
                                                reservation.reservationNumber }}</p>
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('status') }}
                                            </label>
                                            <ReservationStatus :status="reservation.status" />
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('arrivalDate') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{
                                                formatDate(reservation.arrivedDate) }}</p>
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('departureDate') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{
                                                formatDate(reservation.departDate) }}</p>
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('booking_date') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{
                                                formatDate(reservation.createdAt) }}</p>
                                        </div>
                                        <div
                                            v-if="reservation.reservationRooms && reservation.reservationRooms.length === 1">
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('roomType') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white flex flex-col">
                                                <span v-for="(rm, ind) in roomTypeSumarry" :key="ind">{{ rm
                                                    }}</span>
                                            </p>
                                        </div>

                                        <div
                                            v-if="reservation.reservationRooms && reservation.reservationRooms.length === 1">
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ t('roomNumber') }}
                                            </label>

                                            <!-- Show simple list for single room -->
                                            <p v-if="reservation.reservationRooms && reservation.reservationRooms.every((room: any) => room.room?.id)"
                                                class="text-sm text-gray-900 dark:text-white flex flex-col">
                                                <span v-for="(res, ind) in roomRateTypeSummary" :key="ind">{{ res
                                                    }}</span>
                                            </p>
                                            <AssignRoomReservation
                                                v-if="reservation.reservationRooms.length === 0 || reservation.reservationRooms.some((room: any) => !room.room?.id)"
                                                :reservation="reservation" @assigned="handleRoomAssigned" />
                                        </div>

                                        <div
                                            v-if="reservation.reservationRooms && reservation.reservationRooms.length === 1">
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('ratePlan') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white flex flex-col">
                                                <span v-for="(res, ind) in ratePlan" :key="ind">{{ res
                                                    }}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('adult/child') }}
                                            </label>
                                            <div class="flex gap-2 text-sm text-gray-900 dark:text-white">
                                                <div class="flex items-center">
                                                    <Adult class="w-6 h-10" /><span class="pt-2 text-sm">{{
                                                        reservation.adults }}</span>
                                                </div>
                                                <div class="flex items-center">
                                                    <Child class="w-5 h-10" /><span class="pt-2 text-sm">{{
                                                        reservation.child ?? 0 }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('avgDailyRate') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{
                                                formatCurrency(avgDailyRate) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </slot>
                        </div>
                        <!-- Show room list for multiple rooms -->
                        <div v-if="reservation.reservationRooms && reservation.reservationRooms.length > 1"
                            class="py-6 pe-6">
                            <GroupReservationRoomList :rooms="reservation.reservationRooms" :reservation="reservation"
                                @room-selected="handleRoomSelected" />
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                        <div class="flex justify-end space-x-3">
                            <slot name="footer">
                                <!-- Amount and Payment Status -->
                                <div
                                    class=" w-full flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <div class="flex justify-between">
                                        <span class=" font-medium">{{ $t('total') }}</span>
                                        <span class="text-sm">{{
                                            formatCurrency(reservation.balanceSummary?.totalChargesWithTaxes ?? 0)
                                        }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class=" font-medium">{{ $t('paid') }}</span>
                                        <span class="text-sm">{{
                                            formatCurrency(reservation.balanceSummary?.totalPayments ?? 0)
                                        }}</span>
                                    </div>
                                    <div class="flex justify-between text-primary">
                                        <span class=" font-medium">{{ $t('balance') }}</span>
                                        <span class="text-sm">{{
                                            formatCurrency(reservation.balanceSummary?.outstandingBalance ?? 0)
                                        }}</span>
                                    </div>
                                </div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Cancel Reservation Modal -->
    <template v-if="reservation">
        <CancelReservation :is-open="showCancelModal" :reservation-data="reservation" @close="showCancelModal = false"
            :reservation-id="reservation.id" :reservation-number="reservation.reservationNumber"
            @cancel-confirmed="handleCancelConfirmed" />
        <VoidReservation :is-open="showVoidModal" :reservation-data="reservation" @close="showVoidModal = false"
            :reservation-id="reservation.id" :reservation-number="reservation.reservationNumber"
            @void-confirmed="handleVoidConfirmed" />
        <AmendStay :is-open="showAmendModal" :reservation-data="reservation" @close="showAmendModal = false"
            :reservation-id="reservation.id" :reservation-number="reservation.reservationNumber"
            @amend-confirmed="handleAmendConfirmed" :reservation="reservation" />
        <!-- NoShow Reservation Modal -->
        <NoShowReservation :is-open="showNoShowModal" :reservation-id="reservation.id" @close="showNoShowModal = false"
            @noshow-confirmed="handleNoShowConfirmed" />

        <!-- Add Payment Modal -->
        <template v-if="isAddPaymentModalOpen">
            <AddPaymentModal :reservation-id="reservation.id" :is-open="isAddPaymentModalOpen"
                @close="closeAddPaymentModal" @save="handleSavePayment" />
        </template>
        <!--check out template-->
        <template v-if="isCkeckOutModalOpen">
            <CheckOutReservation :reservation-id="reservation.id" :is-open="isCkeckOutModalOpen"
                @close="closeCheckOutReservationModal" />
        </template>
        <!--check in template-->
        <template v-if="isCkeckInModalOpen">
            <CheckInReservation :reservation-id="reservation.id" :is-open="isCkeckInModalOpen"
                @close="closeCheckInReservationModal" />
        </template>

        <!--unassign template-->
        <template v-if="isUnAssignModalOpen">
            <UnAssignRoomReservation :reservation-id="reservation.id" :is-open="isUnAssignModalOpen"
                @close="closeUnAssignReservationModal" @success="handleUnAssignConfirmed" />
        </template>
    </template>


    <!-- Print Modal -->
    <div v-if="showPdfExporter || laodingPrint">
        <!-- Confirmation Template -->
        <PdfExporterNode v-if="pdfUrl || laodingPrint" @close="closePrint" :is-modal-open="showPdfExporter"
            :is-generating="laodingPrint" :pdf-url="pdfUrl" :title="documentTitle" />
    </div>

</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, defineAsyncComponent } from 'vue'
import type { ReservationDetails } from '@/utils/models'
import ButtonDropdown from '../common/ButtonDropdown.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ArrowUpDown, Calendar, CheckCircle, CreditCard, Eye, FileCheck, HouseIcon, List, MapPin, MapPlusIcon, PhoneCall, Printer, SendHorizonal, StopCircle, Trash2, UserMinus, X } from 'lucide-vue-next'
import { formatCurrency } from '../utilities/UtilitiesFunction'
import ReservationStatus from '../common/ReservationStatus.vue'
import { useReservation } from '../../composables/useReservation'
// Lazy load all modal components to improve code splitting
const CancelReservation = defineAsyncComponent(() => import('./foglio/CancelReseravtion.vue'))
import { getReservationDetailsById, printGuestReservationCard } from '../../services/reservation'
import Adult from '../../icons/Adult.vue'
import Child from '../../icons/Child.vue'
const VoidReservation = defineAsyncComponent(() => import('./foglio/VoidReservation.vue'))
const AmendStay = defineAsyncComponent(() => import('./foglio/AmendStay.vue'))
const AddPaymentModal = defineAsyncComponent(() => import('./foglio/AddPaymentModal.vue'))
// Lazy load BookingInvoice to avoid bundling conflicts
const NoShowReservation = defineAsyncComponent(() => import('./foglio/NoShowReservation.vue'))
const GroupReservationRoomList = defineAsyncComponent(() => import('./GroupReservationRoomList.vue'))
const CheckOutReservation = defineAsyncComponent(() => import('./CheckOutReservation.vue'))
const CheckInReservation = defineAsyncComponent(() => import('./CheckInReservation.vue'))
const UnAssignRoomReservation = defineAsyncComponent(() => import('./UnAssignRoomReservation.vue'))
import AssignRoomReservation from './AssignRoomReservation.vue'
import { printConfirmBookingPdf, printHotelPdf } from '../../services/foglioApi'
import PdfExporterNode from '../common/PdfExporterNode.vue'
import { useToast } from 'vue-toastification'

const { t } = useI18n()
const router = useRouter()
const isLoading = ref(false);
const reservation = ref<any>(null)
const toast = useToast()

// Initialize the reservation composable
const {
     isCheckingIn,
    isCheckingOut,
    isAmendingStay,
    isMovingRoom,
    isExchangingRoom,
    isStoppingRoomMove,
    isUpdatingInclusionList,
    isMarkingNoShow,
    isVoidingReservation,
    performCheckIn,
    performCheckOut,
    showNoShowModal,
} = useReservation();
interface Props {
    isOpen: boolean
    title?: string
    subtitle?: string
    reservationData: ReservationDetails
}

interface Emits {
    (e: 'close'): void
    (e: 'save', data?: any): void
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    title: '',
    subtitle: ''
})

const emit = defineEmits<Emits>()

// Cancel modal state
const showCancelModal = ref(false)
const showPrintModal = ref(false)
const showVoidModal = ref(false)
const showAmendModal = ref(false)
const isAddPaymentModalOpen = ref(false)
const isCkeckOutModalOpen = ref(false)
const isCkeckInModalOpen = ref(false)
const isUnAssignModalOpen = ref(false)
const laodingPrint = ref(false);
const pdfUrl = ref<any>(null);
const documentTitle = ref<String>('')
const showPdfExporter = ref(false);
const reservationId = ref(props.reservationData?.reservation_id || 0)


const closeModal = () => {
    emit('close')
}
const handleCancelConfirmed = () => {
    showCancelModal.value = false
    getBookingDetailsById();
    // Emit save event to notify parent components
    emit('save', { action: 'cancel', reservationId: reservation.value?.id })
}
const closePrint = () => {
    showPdfExporter.value = false;
    pdfUrl.value = null
}
const handleVoidConfirmed = () => {
    showVoidModal.value = false
    getBookingDetailsById();
    // Emit save event to notify parent components
    emit('save', { action: 'void', reservationId: reservation.value?.id })
}
const handleAmendConfirmed = () => {
    showAmendModal.value = false
    getBookingDetailsById();
    // Emit save event to notify parent components
    emit('save', { action: 'amend', reservationId: reservation.value?.id })
}
const handleNoShowConfirmed = () => {
    showNoShowModal.value = false
    getBookingDetailsById();
    // Emit save event to notify parent components
    emit('save', { action: 'noshow', reservationId: reservation.value?.id })
}
const handleUnAssignConfirmed = () => {
    isUnAssignModalOpen.value = false
    getBookingDetailsById();
    // Emit save event to notify parent components
    emit('save', { action: 'unassign', reservationId: reservation.value?.id })
}
const openAddPaymentModal = () => {
    isAddPaymentModalOpen.value = true
}

const openCheckOutReservationModal = () => {
    isCkeckOutModalOpen.value = true

}

const closeCheckOutReservationModal = () => {
    isCkeckOutModalOpen.value = false
}

const openCheckInReservationModal = () => {
    isCkeckInModalOpen.value = true
}

const closeCheckInReservationModal = () => {
    isCkeckInModalOpen.value = false
}

const openUnAssignReservationModal = () => {
    isUnAssignModalOpen.value = true
}

const closeUnAssignReservationModal = () => {
    isUnAssignModalOpen.value = false
}

const handleRoomAssigned = (data: any) => {
    getBookingDetailsById();
    emit('save', { action: 'RoomAssigned', reservationId: reservation.value?.id, data })
}

const closeAddPaymentModal = () => {
    isAddPaymentModalOpen.value = false
}
const handleSavePayment = (data: any) => {
    console.log('Add payment data:', data)
    // Emit save event to notify parent components
    emit('save', { action: 'addPayment', reservationId: reservation.value?.id, data })
}

// Print options
const printOptions = computed(() => [
    { id: 'guestCard', label: t('printGuestCard'), icon: Printer },
    { id: 'printResVourcher', label: t('printResVourcher'), icon: FileCheck },
    { id: 'invoice', label: t('printInvoice'), icon: CreditCard },
   // { id: 'sendInvoice', label: t('sendInvoice'), icon: SendHorizonal },
])


const handlePrint = async (templateType: string) => {
    try {
        laodingPrint.value = true

        // Show PDF exporter
        showPdfExporter.value = true

        // Generate PDF based on template type
        let pdfBlob: Blob

        if (templateType === 'confirmation') {
            pdfBlob = await printConfirmBookingPdf({
                reservationId: reservation.value?.id
            })
            console.log('PDF Blob for confirmation:', pdfBlob)
            // Libérer l'ancienne URL si elle existe
            if (pdfUrl.value) {
                window.URL.revokeObjectURL(pdfUrl.value)
            }
            pdfUrl.value = window.URL.createObjectURL(pdfBlob)
        }
        else if (templateType === 'receipt') {
            pdfBlob = await printHotelPdf({
                reservationId: reservation.value?.id
            })
            if (pdfUrl.value) {
                window.URL.revokeObjectURL(pdfUrl.value)
            }
            pdfUrl.value = window.URL.createObjectURL(pdfBlob)
        } else if (templateType === 'guestCard') {
            pdfBlob = await printGuestReservationCard({
                reservationId: reservation.value?.id,
                guestId:reservation.value?.guestId
            })
            console.log('PDF Blob for confirmation:', pdfBlob)
            // Libérer l'ancienne URL si elle existe
            if (pdfUrl.value) {
                window.URL.revokeObjectURL(pdfUrl.value)
            }
            pdfUrl.value = window.URL.createObjectURL(pdfBlob)
        }
    } catch (error) {

        showPdfExporter.value = false
    } finally {
        laodingPrint.value = false
    }
}

// Print handlers
const handlePrintOptionSelected = (option: any) => {
    console.log('Print option selected:', option)

    if (option.id === 'guestCard') {
        documentTitle.value = t('printGuestCard')
        handlePrint('guestCard')
    }
    else if (option.id === 'printResVourcher') {
        documentTitle.value = t('printResVourcher')
        handlePrint('confirmation')
    }
    else if (option.id === 'invoice') {
        documentTitle.value = t('printInvoice')
        handlePrint('receipt')
    }
}
const roomRateTypeSummary = computed(() => {
    if (!reservation.value?.reservationRooms || reservation.value.reservationRooms.length === 0) {
        return 'N/A';
    }

    const reservationRooms = reservation.value.reservationRooms;

    // Get room numbers and create summary
    const roomNumbers = reservationRooms.map((room: any) => {
        return `${room.room?.roomNumber}/${room.roomType.roomTypeName}`
    })



    return roomNumbers;
});

const ratePlan = computed(() => {
    if (!reservation.value?.reservationRooms || reservation.value.reservationRooms.length === 0) {
        return 'N/A';
    }

    const reservationRooms = reservation.value.reservationRooms;

    // Get room numbers and create summary
    const roomNumbers = reservationRooms.map((room: any) => {
        return `${room.roomRates?.rateType?.rateTypeName}`
    })
    return roomNumbers;
})


const roomTypeSumarry = computed(() => {
    if (!reservation.value?.reservationRooms || reservation.value.reservationRooms.length === 0) {
        return 'N/A';
    }

    const reservationRooms = reservation.value.reservationRooms;

    // Get room numbers and create summary
    const roomNumbers = reservationRooms.map((room: any) => {
        return `${room.roomType?.roomTypeName}`
    })
    return roomNumbers;
})

const avgDailyRate = computed(() => {
    if (!reservation.value?.reservationRooms || reservation.value.reservationRooms.length === 0) {
        return 0;
    }
    const reservationRooms = reservation.value.reservationRooms;
    let total = 0;
    reservationRooms.forEach((room: any) => {
        total += parseFloat(room.roomRate ?? 0);
    })
    return total;

})


const gotoResevationDetails = () => {
    router.push({
        name: 'ReservationDetails',
        params: { id: reservation.value.id }
    });
}
const getBookingDetailsById = async () => {
    isLoading.value = true;
    const id = props.reservationData.reservation_id;
    const response = await getReservationDetailsById(Number(id));
    console.log(response)
    reservation.value = response
    reservation.value.reservationRooms = response.reservationRooms.map((e: any) => {
        return { ...e, guest: reservation.value.guest }
    })

    isLoading.value = false;
    console.log('Reservation data fetched:', reservation.value)
};
const formatDate = (dateString?: string) => {
    if (!dateString) return t('notAvailable')
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return dateString
    }
}


// Icon mapping for different actions
const actionIconMap = {
    'check_in': CheckCircle,
    'check_out': CheckCircle,
    'add_payment': CreditCard,
    'amend_stay': Calendar,
    'room_move': ArrowUpDown,
    'exchange_room': ArrowUpDown,
    'stop_room_move': StopCircle,
    'inclusion_list': List,
    'cancel_reservation': X,
    'no_show': Eye,
    'void_reservation': Trash2,
    'unassign_room': UserMinus,
};

// Color mapping for different actions
const actionColorMap = {
    'check_in': 'text-blue-600',
    'check_out': 'text-green-600',
    'add_payment': 'text-green-600',
    'amend_stay': 'text-purple-600',
    'room_move': 'text-orange-600',
    'exchange_room': 'text-indigo-600',
    'stop_room_move': 'text-red-600',
    'inclusion_list': 'text-gray-600',
    'cancel_reservation': 'text-red-600',
    'no_show': 'text-yellow-600',
    'void_reservation': 'text-red-700',
    'unassign_room': 'text-gray-600',
};

const dropdownOptions = computed(() => {
    if (!reservation.value.availableActions) {
        return [];
    }

    return reservation.value.availableActions
        .filter((action: any) => action.available)
        .map((action: any) => ({
            id: action.action,
            label: action.label,
            description: action.description,
            route: action.route,
            icon: actionIconMap[action.action as keyof typeof actionIconMap] || List,
            color: actionColorMap[action.action as keyof typeof actionColorMap] || 'text-gray-600'
        }));
});

const handleRoomSelected = (room: any) => {
    console.log('Room selected:', room)
    // You can add logic here to handle room selection
    // For example, navigate to room details or show room-specific actions
}


const currentAction = ref<string | null>(null)
const isPerformingAction = computed(() => currentAction.value !== null)

// Fonction générique pour exécuter une action avec feedback
const executeAction = async (actionId: string, actionFn: () => Promise<void>, loadingMessage?: string, successMessage?: string) => {
  if (isPerformingAction.value) {
    return // Empêcher les actions multiples
  }

  try {
    currentAction.value = actionId

    // Toast d'information si fourni
    if (loadingMessage) {
      toast.info(loadingMessage, {
        timeout: 2000,
        hideProgressBar: false
      })
    }

    // Exécuter l'action
    await actionFn()

    // Message de succès si fourni
    if (successMessage) {
      toast.success(successMessage)
    }

  } catch (error: any) {
    console.error(`${actionId} error:`, error)
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        t(`Failed to ${actionId.replace('_', ' ')}`)
    toast.error(errorMessage)
  } finally {
    currentAction.value = null
  }
}

// Fonction pour le check-in automatique
const performAutoCheckIn = async (availableRoom: any) => {
  const checkInDateTime = new Date().toISOString()
  const checkInPayload = {
    reservationRooms: [availableRoom.id],
    actualCheckInTime: checkInDateTime,
    notes: '',
    keyCardsIssued: 2,
    depositAmount: 0
  }

  await performCheckIn(reservation.value.id, checkInPayload)

  emit('save', {
    action: 'checkIn',
    reservationId: reservation.value.id,
    data: checkInPayload
  })
}

// Fonction pour le check-out
const performAutoCheckOut = async (availableRoom: any) => {
  const checkOutDateTime = new Date().toISOString()
  const checkOutPayload = {
    reservationRooms: [availableRoom.id],
    actualCheckOutTime: checkOutDateTime,
    notes: '',
  }

  await performCheckOut(reservation.value.id, checkOutPayload)

  emit('save', {
    action: 'checkOut',
    reservationId: reservation.value.id,
    data: checkOutPayload
  })
}



const handleOptionSelected = async (option: any) => {


    // Handle specific actions using the composable
    switch (option.id) {
        case 'add_payment':
            openAddPaymentModal()
            break;
        case 'amend_stay':
            showAmendModal.value = true;
            break;
        case 'cancel_reservation':
            showCancelModal.value = true;
            break;
        case 'void_reservation':
            showVoidModal.value = true;
            break;
        case 'unassign_room':
            openUnAssignReservationModal()
            break;
        case 'inclusion_list':
            break;
       case 'check_in':
      const availableRoomsForCheckin =   reservation.value.reservationRooms?.filter((room: any) =>
        !room.actualCheckInTime &&
        room.status !== 'checked_in' &&
        room.status !== 'occupied' &&
        !room.checkedIn
      ) || []

      if (availableRoomsForCheckin.length === 0) {
        toast.info(t('All rooms have already been checked in'))
        return
      } else if (availableRoomsForCheckin.length === 1) {
        // Check-in automatique avec feedback
        const roomNumber = availableRoomsForCheckin[0].room?.roomNumber || availableRoomsForCheckin[0].id
        console.log("roomNumber",roomNumber)
        await executeAction(
          'check_in',
          () => performAutoCheckIn(availableRoomsForCheckin[0]),
          t('Checking in room {roomNumber}...', { roomNumber }),
          t('Room {roomNumber} checked in successfully', { roomNumber })
        )
      } else {
        openCheckInReservationModal()
      }
      break

    case 'check_out':
      const availableRoomsForCheckout =   reservation.value.reservationRooms
      console.log('Available rooms for check-out:', availableRoomsForCheckout.length)

      if (availableRoomsForCheckout.length === 0) {
        toast.info(t('No rooms available for check-out'))
        return
      } else if (availableRoomsForCheckout.length === 1) {
        // Check-out automatique avec feedback pour une seule chambre
        const roomNumber = availableRoomsForCheckout[0].room?.roomNumber || availableRoomsForCheckout[0].id
        console.log("roomNumber checkout", roomNumber)

        await executeAction(
          'check_out',
          () => performAutoCheckOut(availableRoomsForCheckout[0]),
          t('Checking out room {roomNumber}...', { roomNumber }),
          t('Room {roomNumber} checked out successfully', { roomNumber })
        )
      } else {
        // Plusieurs chambres : ouvrir le modal de groupe
        openCheckOutReservationModal()
      }
            break;
        case 'room_move':
            break;
        case 'exchange_room':
            break;
        case 'stop_room_move':
            break;
        case 'no_show':
            showNoShowModal.value = true
            break;
        default:
            console.log(`Action ${option.id} not handled`);
    }
};
// Watch for modal open state to fetch data
watch(() => props.isOpen, (newValue) => {
    if (newValue && props.reservationData?.reservation_id) {
        getBookingDetailsById();
    }
});

const getActionLoadingText = (action: string | null) => {
  const loadingTexts: Record<string, string> = {
    'check_in': t('Checking in...'),
    'check_out': t('Checking out...'),
    'cancel_reservation': t('Cancelling...'),
    'void_reservation': t('Voiding...'),
    'add_payment': t('Processing payment...'),
    // Ajoutez d'autres actions selon vos besoins
  }

  return loadingTexts[action || ''] || t('Processing...')
}

// Fetch data on mount if modal is already open
onMounted(() => {
    if (props.isOpen && props.reservationData?.reservation_id) {
        getBookingDetailsById();
    }
});
</script>
