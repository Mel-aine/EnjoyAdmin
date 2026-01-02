<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ReservationAction from './ReservationAction.vue';
import { Building2Icon, Users } from 'lucide-vue-next';
import getOtaIconSrc from '@/utils/otaIcons'
import { computed, ref, watch } from 'vue';
import { formatCurrency, formatTimeFromTimeString } from '../utilities/UtilitiesFunction';
import router from '../../router';
import Child from '../../icons/Child.vue';
import Adult from '../../icons/Adult.vue';

import { useToast } from 'vue-toastification';
// Lazy load modal components for better code splitting

import PrintModal from '../common/PrintModal.vue';




import AssignRoomReservation from './AssignRoomReservation.vue';
import ReservationStatus from '../common/ReservationStatus.vue';



const { t } = useI18n({ useScope: 'global' })
import { getReservationById } from '@/services/reservation';





const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
})

interface Emits {
  (e: 'close'): void
  (e: 'save', data?: any): void
  (e: 'reservation-updated', updatedReservation: any): void
}

const emit = defineEmits<Emits>()

// Créer une copie réactive des données de réservation
const localReservation = ref<any>(null)

const otaName = computed(() =>
  localReservation.value?.otaName ||
  localReservation.value?.bookingSourceName ||
  localReservation.value?.bookingSource?.name || null
)
const otaIconSrc = computed(() => getOtaIconSrc(otaName.value))



const showPrintModal = ref(false)
const toast = useToast()


watch(() => props.reservation, (newReservation) => {
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



const refreshAvailableActions = async (reservationId: number) => {
  try {
    const updatedReservation = await getReservationById(reservationId)

    if (updatedReservation.availableActions) {
      updateLocalReservation({
        availableActions: updatedReservation.availableActions,
        status: updatedReservation.status,
        balanceSummary: updatedReservation.balanceSummary
      })
    }
  } catch (error) {
    console.error('Error refreshing available actions:', error)
    toast.error(t('Error refreshing reservation data'))
  }
}


// Print modal handlers
const handlePrintSuccess = (data: any) => {
  console.log('Print successful:', data)
  showPrintModal.value = false
}

const handlePrintError = (error: any) => {
  console.error('Print error:', error)
}















// Document data for printing - utiliser les données locales
const createDocumentDataForPrinting = (docType: 'billing' | 'operation') => {
  const res = localReservation.value
  const guest = res?.guest
  const rooms = res?.reservationRooms
  const balanceSummary = res?.balanceSummary

  if (docType === 'billing') {
    return {
      reservation: res,
      guest,
      rooms,
      totalAmount: balanceSummary?.totalChargesWithTaxes,
      paidAmount: balanceSummary?.totalPayments,
      remainingAmount: balanceSummary?.outstandingBalance
    }
  }

  return {
    reservation: res,
    guest,
    rooms,
    totalAmount: res?.totalAmount,
    paidAmount: res?.paidAmount,
    remainingAmount: res?.remainingAmount
  }
}

const printDocumentData = computed(() => createDocumentDataForPrinting('billing'))


const roomRateTypeSummary = computed(() => {
  if (!localReservation.value?.reservationRooms || localReservation.value.reservationRooms.length === 0) {
    return 'N/A';
  }

  const assignedRooms = localReservation.value.reservationRooms
    .filter((room: any) => room.roomId && room.room?.roomNumber)

  if (assignedRooms.length === 0) {
    return null;
  }

  const roomNumbers = assignedRooms.map((room: any) => room.room.roomNumber);

  // Si plusieurs chambres, ajouter le compte
  if (roomNumbers.length > 1) {
    return `${roomNumbers.join(', ')} (${t('roomsCount', { count: roomNumbers.length })})`;
  }

  return roomNumbers[0];
});

const handleRoomAssignmentRefresh = async () => {
  try {
    // Recharger les détails de la réservation
    const updatedReservation = await getReservationById(localReservation.value.id)

    // Mettre à jour localement
    updateLocalReservation({
      reservationRooms: updatedReservation.reservationRooms,
      availableActions: updatedReservation.availableActions,
      status: updatedReservation.status
    })

    // Émettre pour compatibilité
    emit('save', {
      action: 'roomAssigned',
      reservationId: localReservation.value.id
    })


  } catch (error) {
    console.error('Error refreshing after room assignment:', error)
    toast.error(t('Error updating room assignment'))
  }
}

// Variables réactives pour gérer l'état des actions




const handleViewDetails = ()=>{
    router.push({
      name: 'ReservationDetails',
      params: { id: localReservation.value.id }
    })
}

const handleActionSave = (event: any) => {
    if (event.action === 'addPayment') {
        refreshAvailableActions(localReservation.value.id);
    } else {
        emit('save', event);
    }
}


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('en', options)
}







// Liste des numéros de chambres assignées
const assignedRoomNumbers = computed(() => {
  return localReservation.value?.reservationRooms
    ?.filter((room: any) => room.roomId && room.room?.roomNumber)
    ?.map((room: any) => room.room.roomNumber) || []
})

const nightsSummary = computed(() => {
  if (!localReservation.value?.reservationRooms || localReservation.value.reservationRooms.length === 0) {
    return 0;
  }

  const rooms = localReservation.value.reservationRooms;

  // Si une seule chambre, retourner directement ses nuits
  if (rooms.length === 1) {
    return rooms[0].nights;
  }

  // Si plusieurs chambres avec les mêmes nuits, retourner ce nombre
  const firstNights = rooms[0].nights;
  const allSameNights = rooms.every((room: any) => room.nights === firstNights);

  if (allSameNights) {
    return firstNights;
  }

  // Si différentes nuits, retourner une fourchette
  const nightsArray = rooms.map((room: any) => room.nights);
  const minNights = Math.min(...nightsArray);
  const maxNights = Math.max(...nightsArray);

  return `${minNights}-${maxNights}`;
});


</script>

<template>
  <div class="z-10">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-visible group"
      :class="{ 'void-status': localReservation.status === 'voided' }">
      <!-- Card Header -->
      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start mb-2">
          <div @click="handleViewDetails" class="flex items-center align-middle self-center gap-2 cursor-pointer min-w-0 flex-1">
            <img v-if="otaIconSrc" :src="otaIconSrc" alt="OTA" class="w-8 h-8" />
            <Building2Icon v-else class="w-8 h-8 text-primary" />
            <Users v-if="localReservation.isGroup" />
            <div class="min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate capitalize max-w-full">
                {{ localReservation?.displayName }}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                #{{ localReservation.reservationNumber }}
              </p>
            </div>
          </div>
          <div class="flex gap-1">
            <ReservationAction
              :localReservation="localReservation"
              @reservation-updated="updateLocalReservation"
              :default="false"
              @save="handleActionSave"
            />
          </div>
        </div>

      </div>
      <div class="grid grid-cols-8 px-4">
        <div class="flex col-span-3 items-center p-2 flex-col bg-gray-100 dark:bg-black">
          <span>{{ formatDate(localReservation.date) }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ formatTimeFromTimeString(localReservation?.checkInTime) }}
          </span>
        </div>
        <div class="flex col-span-2 items-center p-2 flex-col bg-gray-300 dark:bg-black/80">
          <span>{{ nightsSummary}}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ $t('nights') }}
          </span>
        </div>
        <div class="flex items-center col-span-3 p-2 flex-col bg-gray-100 dark:bg-black">
          <span>{{ formatDate(localReservation.departDate) }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ formatTimeFromTimeString(localReservation?.checkOutTime) }}
          </span>
        </div>

      </div>
      <!-- Card Body -->
      <div class="p-4 space-y-3">
        <!-- Dates -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class=" font-semibold">{{ $t('booking_date') }}</span>
            <span class="text-xs">{{ formatDate(localReservation.date) }}</span>
          </div>
          <div class="flex gap-2">
            <div class="flex items-center">
              <Adult class="w-6 h-10" /><span class="pt-2 text-sm">{{ localReservation.adults }}</span>
            </div>
            <div class="flex items-center">
              <Child class="w-5 h-10" /><span class="pt-2 text-sm">{{ localReservation.child ?? 0 }}</span>
            </div>
          </div>

        </div>

        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="font-semibold">{{ $t('Room') }}</span>
            <span v-if="localReservation.reservationRooms && localReservation.reservationRooms.length > 0 && localReservation.reservationRooms.every((room:any) => room.roomId)" class="text-sm">
              <span v-if="localReservation.reservationRooms.length > 1" class="inline-flex items-center gap-1">
                <Users class="w-4 h-4" />
                {{ roomRateTypeSummary }}
              </span>
              <span v-else>{{ roomRateTypeSummary }}</span>
            </span>
            <div v-else-if="assignedRoomNumbers.length > 0" class="flex items-center gap-2">
              <span class="text-sm inline-flex items-center gap-1">
                <Users v-if="localReservation.isGroup" class="w-4 h-4" />
                {{ assignedRoomNumbers.join(', ') }}
              </span>
              <AssignRoomReservation
                :reservation="localReservation"
                @refresh="handleRoomAssignmentRefresh"
              />
            </div>

            <!-- Aucune chambre assignée : uniquement le bouton -->
            <AssignRoomReservation v-else
              :reservation="localReservation"
              @refresh="handleRoomAssignmentRefresh"
            />
          </div>
          <div class="flex gap-1">
            <ReservationStatus :status="localReservation.status" />
          </div>
        </div>

        <!-- Amount and Payment Status -->
        <div class=" flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
          <div class="flex justify-between text-blue-600">
            <span class=" font-medium">{{ $t('Total') }}</span>
            <span class="text-sm">{{ formatCurrency(localReservation.balanceSummary?.totalChargesWithTaxes) }}</span>
          </div>
          <div class="flex justify-between text-green-600">
            <span class=" font-medium">{{ $t('paid') }}</span>
            <span class="text-sm">{{ formatCurrency(localReservation.balanceSummary?.totalPayments) }}</span>
          </div>
          <div class="flex justify-between text-red-600">
            <span class=" font-medium">{{ $t('balance') }}</span>
            <span class="text-sm">{{ formatCurrency(localReservation.balanceSummary?.outstandingBalance) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Print Modal -->
  <template v-if="showPrintModal">
    <PrintModal :is-open="showPrintModal" :document-data="printDocumentData" @close="showPrintModal = false"
      @print-success="handlePrintSuccess" @print-error="handlePrintError" :reservation-id="localReservation.id" />
  </template>
</template>

<style></style>
