<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 h-full overflow-hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/25 bg-opacity-50 transition-opacity h-full"></div>

        <!-- Modal Container -->
        <div class="fixed inset-y-0 top-0 h-full right-0 flex max-w-full pl-10">
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
                <div v-else-if="reservation" class="flex h-full flex-col bg-white shadow-xl dark:bg-gray-900"
                    :class="{ 'void-status': reservation.status === 'voided' }">
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
                            class="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
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
                                        <ReservationAction :reservation="reservation"
                                            :local-reservation="localReservation"
                                            @reservation-updated="handleChildReservationUpdated"
                                            @save="handleChildSave" />

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
                                            <ReservationStatus :status="localReservation.status" />
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('arrivalDate') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{
                                                formatDate(reservation.arrivedDate) }} {{ localReservation.checkInTime
                                                }}
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {{ $t('departureDate') }}
                                            </label>
                                            <p class="text-sm text-gray-900 dark:text-white">{{
                                                formatDate(localReservation.departDate) }}
                                                {{ localReservation.checkOutTime }}</p>
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
                                @room-selected="handleRoomSelected" @refresh="loadReservationData" />
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                        <div class="flex justify-end space-x-3">
                            <slot name="footer">
                                <!-- Amount and Payment Status -->
                                <div class=" w-full flex flex-col gap-2  pt-2  border-gray-100 dark:border-gray-700">
                                    <div class="flex justify-between text-blue-600">
                                        <span class=" font-medium">{{ $t('total') }}</span>
                                        <span class="text-sm">{{
                                            formatCurrency(localReservation.balanceSummary?.totalChargesWithTaxes ?? 0)
                                            }}</span>
                                    </div>
                                    <div class="flex justify-between text-green-600">
                                        <span class=" font-medium">{{ $t('paid') }}</span>
                                        <span class="text-sm">{{
                                            formatCurrency(localReservation.balanceSummary?.totalPayments ?? 0)
                                            }}</span>
                                    </div>
                                    <div class="flex justify-between text-red-600">
                                        <span class=" font-medium">{{ $t('balance') }}</span>
                                        <span class="text-sm">{{
                                            formatCurrency(localReservation.balanceSummary?.outstandingBalance ?? 0)
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

// Components and utilities for Reservation modal
import { getReservationDetailsById, printGuestReservationCard } from '../../services/reservation'
import Adult from '../../icons/Adult.vue'
import Child from '../../icons/Child.vue'
const GroupReservationRoomList = defineAsyncComponent(() => import('./GroupReservationRoomList.vue'))
import ReservationAction from './ReservationAction.vue'
import { printConfirmBookingPdf, printHotelPdf } from '../../services/foglioApi'
import PdfExporterNode from '../common/PdfExporterNode.vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../composables/serviceStore'

const { t } = useI18n()
const router = useRouter()
const isLoading = ref(false);
const reservation = ref<any>(null)
const toast = useToast()

interface Props {
    isOpen: boolean
    title?: string
    subtitle?: string
    reservationData: ReservationDetails
}

interface Emits {
    (e: 'close'): void
    (e: 'save', data?: any): void
    (e: 'reservation-updated', updatedReservation: any): void
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    title: '',
    subtitle: ''
})

const emit = defineEmits<Emits>()

// Print/export state
const laodingPrint = ref(false);
const pdfUrl = ref<any>(null);
const documentTitle = ref<string>('')
const showPdfExporter = ref(false);
const reservationId = ref(props.reservationData?.reservation_id || 0)
console.log('current service', JSON.parse(useServiceStore().currentService))

const closeModal = () => {
    emit('close')
}

const localReservation = ref<any>(null)

// Watcher pour mettre à jour les données locales quand les props changent
watch(() => reservation.value, (newReservation) => {
    if (newReservation) {
        localReservation.value = { ...newReservation }
        console.log('Local reservation updated:', localReservation.value)
    }
}, { deep: true, immediate: true })

const updateLocalReservation = (updates: any) => {
    console.log('Updating reservation with:', updates)
    console.log('Current reservation:', localReservation.value)

    localReservation.value = {
        ...localReservation.value,
        ...updates
    }

    console.log('Updated reservation:', localReservation.value)
    emit('reservation-updated', localReservation.value)
}

const handleChildReservationUpdated = (updated: any) => {
    localReservation.value = { ...updated }
    getBookingDetailsById();
    emit('reservation-updated', localReservation.value)
}

const handleChildSave = (payload: any) => {
    getBookingDetailsById();
    emit('save', payload)
}

// Legacy cancel/void/amend/noshow handlers removed; ReservationAction manages these and emits via handleChildSave
const closePrint = () => {
    showPdfExporter.value = false;
    pdfUrl.value = null
}
const handleRoomAssigned = (data: any) => {
    console.log('Room assigned:', data)
    // Mettre à jour les chambres localement
    if (data.rooms) {
        updateLocalReservation({ reservationRooms: data.rooms })
    }
    // Émettre l'événement save pour compatibilité
    emit('save', { action: 'roomAssigned', reservationId: localReservation.value.id, data })
}

// Legacy add payment handlers removed; child component emits are forwarded by handleChildSave

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
                guestId: reservation.value?.guestId
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

        })
    } catch {
        return dateString
    }
}
const handleRoomSelected = (room: any) => {
    console.log('Room selected:', room)
    // You can add logic here to handle room selection
    // For example, navigate to room details or show room-specific actions
}
// Watch for modal open state to fetch data
watch(() => props.isOpen, (newValue) => {
    if (newValue && props.reservationData?.reservation_id) {
        getBookingDetailsById();
    }
});

const loadReservationData = async () => {
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

// Fetch data on mount if modal is already open
onMounted(() => {
    if (props.isOpen && props.reservationData?.reservation_id) {
        getBookingDetailsById();
    }
});
</script>
