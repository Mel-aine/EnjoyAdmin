<script setup lang="ts">
import { ArrowLeft, Building2Icon, Users ,Pencil  } from 'lucide-vue-next'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import EditTimeModal from '@/components/reservations/foglio/EditTimeModal.vue';
import { useGuestCreditBalance } from '@/composables/useCreditLedger'
import { useServiceStore } from '@/composables/serviceStore'
import { applyCredit } from '@/services/creditLedger'
import ConfirmModal from '@/components/Housekeeping/ConfirmationModal.vue';
import ButtonDropdown from '@/components/common/ButtonDropdown.vue'
import { CreditCard, FileCheck, Printer, MessageCircle, Mail } from 'lucide-vue-next'
import { printConfirmBookingPdf, printHotelPdf, sendInvoiceByEmail, sendVoucherByEmail, sendInvoiceByWhatsapp, sendVoucherByWhatsapp } from '@/services/foglioApi'
import { printGuestReservationCard, printGuestReservationPolice } from '@/services/reservation'
import PdfExporterNode from '@/components/common/PdfExporterNode.vue'
import FolioSelectModal from '@/components/reservations/foglio/FolioSelectModal.vue'

const serviceStore = useServiceStore()
const { creditBalance: fetchedCreditBalance, isLoading: isLoadingCredit, fetchBalance } = useGuestCreditBalance()


const props = defineProps<{
  id: string
}>()

import { useI18n } from 'vue-i18n'
const FoglioOperation = defineAsyncComponent(
  () => import('../../../components/reservations/foglio/FoglioOperation.vue'),
)
const RoomCharge = defineAsyncComponent(
  () => import('../../../components/reservations/roomcharge/RoomCharge.vue'),
)
const BookingDetails = defineAsyncComponent(
  () => import('../../../components/reservations/bookingdetails/BookingDetails.vue'),
)
import router from '../../../router'
import { useRoute } from 'vue-router'
import { getReservationDetailsById } from '../../../services/api'
import AdminLayout from '../../../components/layout/AdminLayout.vue'
import Adult from '../../../icons/Adult.vue'
import Child from '../../../icons/Child.vue'
import { formatTimeFromTimeString } from '../../../components/utilities/UtilitiesFunction'
const GuestDetails = defineAsyncComponent(
  () => import('../../../components/reservations/GuestDetails.vue'),
)
import ReservationDetailsSkeleton from '../../../components/skeletons/ReservationDetailsSkeleton.vue'
import ReservationAction from '../../../components/reservations/ReservationAction.vue'

import PrintModal from '../../../components/common/PrintModal.vue'
const BookingConfirmationTemplate = defineAsyncComponent(
  () => import('../../../components/common/templates/BookingConfirmationTemplate.vue'),
)
const AuditTrail = defineAsyncComponent(() => import('../../../components/audit/AuditTrail.vue'))
const ReservationStatus = defineAsyncComponent(
  () => import('../../../components/common/ReservationStatus.vue'),
)
const AssignRoomReservation = defineAsyncComponent(
  () => import('../../../components/reservations/AssignRoomReservation.vue'),
)
// Import du composant :
const WhatsappHistory = defineAsyncComponent(
  () => import('../../../components/reservations/whatsapp/WhatsappHistory.vue')
)
import { useToast } from 'vue-toastification'
import { confirmBooking } from '@/services/reservation'
import OverLoading from '../../../components/spinner/OverLoading.vue'
import getOtaIconSrc from '@/utils/otaIcons'
import InputCurrency from '@/components/forms/FormElements/InputCurrency.vue';



// États des modals
const showPrintModal = ref(false)
const isPending = ref(false)
const showEditArrivalTimeModal = ref(false)
const showEditDepartureTimeModal = ref(false)
const { t ,locale } = useI18n()
const toast = useToast()


// ====== NOUVELLE APPROCHE : État local réactif ======
const localReservation = ref<any>({})
const isLoading = ref(false)
const isSending = ref(false)
const isRefreshing = ref(false)
const laodingPrint = ref(false)
const pdfUrl = ref<any>(null)
const documentTitle = ref<string>('')
const showPdfExporter = ref(false)
const showFolioSelectModal = ref(false)
const reservationFolios = ref<any[]>([])
const pendingEmailType = ref<'invoice' | 'voucher' | null>(null)
const pendingWhatsappType = ref<'invoice' | 'voucher' | null>(null)
const whatsappEnabled = computed(() => serviceStore.whatsappEnabled && localReservation.value?.whatsappNotificationEnable)
const emailEnabled = computed(() => localReservation.value?.guest?.email)

const tabs = computed(() => [
  { id: 'folio_operations', label: t('Folio Operations') },
  { id: 'booking_details', label: t('Booking Details') },
  { id: 'guest_details', label: t('Guest Details') },
  { id: 'room_charges', label: t('Room Charges') },
  { id: 'audit_trial', label: t('Audit Trail') },
 ...(whatsappEnabled.value ? [
   { id: 'whatsapp_history', label: t('WhatsApp History') },
 ] : [])
])

const printOptions = computed(() => [
  { id: 'guestCard',      label: t('Print Guest Registration'), icon: Printer },
  { id: 'guest',          label: t('Print Police'),     icon: Printer },
  { id: 'printResVourcher', label: t('printResVourcher'),   icon: FileCheck },
  { id: 'invoice',        label: t('printInvoice'),  icon: CreditCard },
    ...(whatsappEnabled.value ? [
    { id: 'wa_invoice', label: t('sendInvoice'), icon: MessageCircle, group: 'whatsapp' },
    { id: 'wa_voucher', label: t('sendVoucher'), icon: MessageCircle, group: 'whatsapp' },
  ] : []),
  ...(emailEnabled.value ? [
    { id: 'email_invoice',  label: t('sendInvoice'),   icon: Mail,   group: 'email' },
    { id: 'email_voucher',  label: t('sendVoucher'),   icon: Mail,   group: 'email' },
  ] : []),
])
const VALID_TAB_IDS = new Set<string>([
  'folio_operations',
  'booking_details',
  'guest_details',
  'room_charges',
  'audit_trial',
  'whatsapp_history',
])

const route = useRoute()

const coerceTab = (value: unknown): string => {
  const str = typeof value === 'string' ? value : ''
  return VALID_TAB_IDS.has(str) ? str : 'folio_operations'
}

const activeTab = ref<string>(coerceTab(route.query.tab))

const onTabClick = (tabId: string) => {
  if (!VALID_TAB_IDS.has(tabId)) return
  activeTab.value = tabId
  router.replace({ query: { ...route.query, tab: tabId } })
}

watch(
  () => route.query.tab,
  (newTab) => {
    const resolved = coerceTab(newTab)
    if (resolved !== activeTab.value) {
      activeTab.value = resolved
    }
  },
)

const hasCreditBalance = computed(() => {
  const reservationBalance = localReservation.value?.balanceSummary?.outstandingBalance ?? 0
  return fetchedCreditBalance.value > 0 && reservationBalance > 0
})
const creditBalanceFormatted = computed(() =>
  `${Math.round(fetchedCreditBalance.value).toLocaleString('fr-FR')} FCFA`
)

// Modal crédit
const showCreditModal = ref(false)
const isApplyingCredit = ref(false)
const creditAmountToApply = ref(0)

const openCreditModal = () => {
  creditAmountToApply.value = fetchedCreditBalance.value
  showCreditModal.value = true
}

const handleApplyCredit = async () => {
  if (!creditAmountToApply.value || creditAmountToApply.value <= 0) {
    toast.error(t('Invalid amount'))
    return
  }

  // Récupérer le folio ouvert de la réservation
  const openFolio = localReservation.value?.folios?.find(
    (f: any) => f.status === 'open'
  ) || localReservation.value?.folios?.[0]

  if (!openFolio?.id) {
    toast.error(t('No folio found for this reservation'))
    return
  }

  try {
    isApplyingCredit.value = true
    await applyCredit({
      hotelId: serviceStore.serviceId,
      guestId: localReservation.value.guestId,
      reservationId: localReservation.value.id,
      folioId: openFolio.id,          
      amount: creditAmountToApply.value, 
    })
    toast.success(t('Credit applied successfully'))
    showCreditModal.value = false
    await getBookingDetailsById(false)
    await fetchBalance(localReservation.value.guestId, serviceStore.serviceId!)
     foglioRef.value?.refreshFolio?.()
  } catch (error: any) {
    toast.error(error?.response?.data?.message || t('Failed to apply credit'))
  } finally {
    isApplyingCredit.value = false
  }
}

// Charger le crédit quand la réservation est chargée
watch(
  () => localReservation.value?.guestId,
  (guestId) => {
    if (guestId && serviceStore.serviceId) {
      fetchBalance(guestId, serviceStore.serviceId)
    }
  },
  { immediate: true }
)



// ====== FONCTION CLÉ : Mise à jour locale ======
const updateLocalReservation = (updates: any) => {
  console.log('Updating reservation with:', updates)
  localReservation.value = {
    ...localReservation.value,
    ...updates,
  }
  console.log('Updated reservation:', localReservation.value)
}

const handleChildReservationUpdated = async (updated: any) => {
  isRefreshing.value = true
  try {
    localReservation.value = { ...updated }
    await refreshAvailableActions()
    foglioRef.value?.refreshFolio?.()
  } finally {
    isRefreshing.value = false
  }
}

const handleChildSave = async (_payload: any) => {
  isRefreshing.value = true
  try {
    await refreshAvailableActions()
    foglioRef.value?.refreshFolio?.()
  } finally {
    isRefreshing.value = false
  }
}

// ====== FONCTION : Rafraîchir uniquement les actions disponibles ======
const refreshAvailableActions = async () => {
  isRefreshing.value = true
  try {
    const response = await getReservationDetailsById(Number(props.id))
    if (response.status === 200) {
      updateLocalReservation({
        availableActions: response.data.availableActions,
        status: response.data.status,
        balanceSummary: response.data.balanceSummary,
      })
    }
  } catch (error) {
    console.error('Error refreshing available actions:', error)
    toast.error(t('Error refreshing reservation data'))
  } finally {
    isRefreshing.value = false
  }
}



// ====== ROOM ASSIGNMENT ======
const handleRoomAssignmentRefresh = async () => {
  await getBookingDetailsById(false)
}

const handleRoomChargeRefresh = async () => {
  await getBookingDetailsById(false)
}

// ====== BOOKING DETAILS REFRESH ======
const refreshBookingData = async () => {
  await getBookingDetailsById(false)
}

const handleGuestRefresh = async () => {
  await getBookingDetailsById(false)
}
// ====== GESTION DES OPTIONS ======

// ====== CHARGEMENT INITIAL ======
const getBookingDetailsById = async (showLoading = true) => {
  if (showLoading) isLoading.value = true
  try {
    const response = await getReservationDetailsById(Number(props.id))
    console.log('reservation', response)
    if (response.status === 200) {
      localReservation.value = response.data
      if (response.data.status === 'pending') {
        isPending.value = true
      }
    }
  } finally {
    if (showLoading) isLoading.value = false
  }
}

// ====== COMPUTED PROPERTIES ======
const roomRateTypeSummary = computed(() => {
  if (
    !localReservation.value?.reservationRooms ||
    localReservation.value.reservationRooms.length === 0
  ) {
    return 'N/A'
  }

  const reservationRooms = localReservation.value.reservationRooms
  const roomNumbers = reservationRooms.map((room: any) => {
    return `${room.room?.roomNumber} -${room?.roomType?.roomTypeName} / ${room?.roomRates?.rateType?.rateTypeName} `
  })

  return roomNumbers[0]
})

const nightsSummary = computed(() => {
  if (
    !localReservation.value?.reservationRooms ||
    localReservation.value.reservationRooms.length === 0
  ) {
    return 0
  }

  const rooms = localReservation.value.reservationRooms.filter((e:any)=>!e.isSplitedOrigin)
  console.log('reservation',rooms );
  if(localReservation.value?.numberOfNights){
 return localReservation.value?.numberOfNights
  }
  if (rooms.length === 1) {
    return rooms[0].nights
  }

  const firstNights = rooms[0].nights
  const allSameNights = rooms.every((room: any) => room.nights === firstNights)

  if (allSameNights) {
    return firstNights
  }

  const nightsArray = rooms.map((room: any) => room.nights)
  // const minNights = Math.min(...nightsArray)
  const maxNights = Math.max(...nightsArray)

  return `${maxNights}`
})

const printDocumentData = computed(() => {
  if (!localReservation.value) return null

  return {
    type: 'reservation',
    reservation: {
      id: localReservation.value.id,
      reservationNumber: localReservation.value.reservationNumber,
      status: localReservation.value.status,
      arrivalDate: localReservation.value.arrivalDate,
      departureDate: localReservation.value.departureDate,
      nights: localReservation.value.nights,
      adults: localReservation.value.adults,
      children: localReservation.value.children,
    },
    guest: {
      firstName: localReservation.value.guest?.firstName,
      lastName: localReservation.value.guest?.lastName,
      email: localReservation.value.guest?.email,
      phone: localReservation.value.guest?.phone,
    },
    rooms:
      localReservation.value.reservationRooms?.map((room: any) => ({
        roomNumber: room.room?.roomNumber,
        roomType: room.room?.roomType?.name,
        rate: room.rate,
      })) || [],
    financial: {
      totalAmount: localReservation.value.totalAmount,
      paidAmount: localReservation.value.paidAmount,
      balance: localReservation.value.balance,
    },
  }
})

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}

const otaName = computed(
  () =>
    localReservation.value?.otaName ||
    localReservation.value?.bookingSourceName ||
    localReservation.value?.bookingSource?.name ||
    null,
)
const otaIconSrc = computed(() => getOtaIconSrc(otaName.value))

const handlePrintClose = () => {
  showPrintModal.value = false
}

const handlePrintSuccess = (data: any) => {
  console.log('Print successful:', data)
  showPrintModal.value = false
}

const handlePrintError = (error: any) => {
  console.error('Print error:', error)
}

const foglioRef = ref<any>(null)

const templates = ref([
  {
    id: '1',
    name: 'Reservation',
    description: 'Reservation template',
    component: BookingConfirmationTemplate,
  },
])

// Fonction pour rafraîchir une réservation spécifique (appelée depuis les composants enfants)
const refresReservation = async () => {
  await refreshAvailableActions()
  if (localReservation.value?.guestId && serviceStore.serviceId) {
    await fetchBalance(localReservation.value.guestId, serviceStore.serviceId)
  }

}

//fonction to confirm reservation
const isConfirming = ref(false)

const ReservationConfirm = async () => {
  try {
    isConfirming.value = true

    const data = {
      status: 'confirmed',
    }

    const res = await confirmBooking(localReservation.value.id, data)
    console.log('res', res)

    if (res.status === 200 || res.data) {
      updateLocalReservation({
        status: 'confirmed',
      })

      isPending.value = false

      toast.success(t('Reservation confirmed successfully'))

      isRefreshing.value = true
      try {
        await getBookingDetailsById()
      } finally {
        isRefreshing.value = false
      }
    }
  } catch (error: any) {
    console.error('Error confirming reservation:', error)
    const errorMessage =
      error.response?.data?.message || error.message || t('Failed to confirm reservation')
    toast.error(errorMessage)
  } finally {
    isConfirming.value = false
  }
}

const handleEditArrivalTime = () => {
  showEditArrivalTimeModal.value = true
}

const handleEditDepartureTime = () => {
  showEditDepartureTimeModal.value = true
}

const handleTimeUpdated = async (data: any) => {

  // Update local reservation with new time
  if (data.timeType === 'arrival') {
    updateLocalReservation({
      checkInTime: data.time
    })
  } else {
    updateLocalReservation({
      checkOutTime: data.time
    })
  }

}

const getStoredLanguage = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem('language') || '{}')
    return parsed.language || 'en'
  } catch { return 'en' }
}

const closePrint = () => {
  showPdfExporter.value = false
  pdfUrl.value = null
}

const handlePrint = async (templateType: string, folioId?: number | null) => {
  try {
    laodingPrint.value = true
    showPdfExporter.value = true
    const language = getStoredLanguage()
    let pdfBlob: Blob

    if (templateType === 'confirmation') {
      pdfBlob = await printConfirmBookingPdf({ reservationId: localReservation.value?.id, language })
    } else if (templateType === 'receipt') {
      pdfBlob = await printHotelPdf({ reservationId: localReservation.value?.id, language, ...(folioId ? { folioId } : {}) })
    } else if (templateType === 'guestCard') {
      pdfBlob = await printGuestReservationCard({ reservationId: localReservation.value?.id, guestId: localReservation.value?.guestId })
    } else {
      pdfBlob = await printGuestReservationPolice({ reservationId: localReservation.value?.id, guestId: localReservation.value?.guestId })
    }

    if (pdfUrl.value) window.URL.revokeObjectURL(pdfUrl.value)
    pdfUrl.value = window.URL.createObjectURL(pdfBlob!)
  } catch (error) {
    showPdfExporter.value = false
  } finally {
    laodingPrint.value = false
  }
}

const handleInvoicePrint = () => {
  pendingEmailType.value = null
  pendingWhatsappType.value = null
  const folios = localReservation.value?.folios ?? localReservation.value?.reservationFolios ?? []
  if (folios.length > 1) {
    reservationFolios.value = folios
    showFolioSelectModal.value = true
  } else {
    documentTitle.value = t('printInvoice')
    handlePrint('receipt', folios[0]?.id ?? null)
  }
}

const handleWhatsappSend = async (type: 'invoice' | 'voucher') => {
  if (!localReservation.value?.whatsappNotificationEnable) {
    toast.warning(t('whatsapp_notifications_disabled'))
    pendingWhatsappType.value = null
    return
  }
  const phone = localReservation.value?.whatsappNumber ?? null
  if (!phone) { toast.warning(t('noGuestPhone')); return }
  try {
    isSending.value = true
    const language = getStoredLanguage() as 'fr' | 'en'
    if (type === 'invoice') {
      const folios = localReservation.value?.folios ?? localReservation.value?.reservationFolios ?? []
      if (folios.length > 1) {
        isSending.value = false
        pendingWhatsappType.value = 'invoice'
        reservationFolios.value = folios
        showFolioSelectModal.value = true
        return
      }
      await sendInvoiceByWhatsapp({ reservationId: localReservation.value.id, recipientPhone: phone, folioId: folios[0]?.id ?? null, language })
    } else {
      await sendVoucherByWhatsapp({ reservationId: localReservation.value.id, recipientPhone: phone, language })
    }
    toast.success(t('whatsappSentSuccess'))
  } catch { toast.error(t('whatsappSentError')) }
  finally {
    isSending.value = false
  }
}

const handleEmailSend = async (type: 'invoice' | 'voucher') => {
  const email = localReservation.value?.guest?.email ?? localReservation.value?.guest?.emailSecondary ?? null
  if (!email) { toast.warning(t('noGuestEmail')); return }
  try {
    isSending.value = true
    const language = getStoredLanguage() as 'fr' | 'en'
    if (type === 'invoice') {
      const folios = localReservation.value?.folios ?? localReservation.value?.reservationFolios ?? []
      if (folios.length > 1) {
        isSending.value = false
        pendingEmailType.value = 'invoice'
        reservationFolios.value = folios
        showFolioSelectModal.value = true
        return
      }
      await sendInvoiceByEmail({ reservationId: localReservation.value.id, recipientEmail: email, folioId: folios[0]?.id ?? null, language })
    } else {
      await sendVoucherByEmail({ reservationId: localReservation.value.id, recipientEmail: email, language })
    }
    toast.success(t('emailSentSuccess'))
  } catch { toast.error(t('emailSentError')) }
  finally {
    isSending.value = false
  }
}

const handleFolioSelected = async (folio: any) => {
  showFolioSelectModal.value = false
  if (pendingWhatsappType.value) {
    const phone = localReservation.value?.whatsappNumber ?? localReservation.value?.guest?.phonePrimary ?? null
    if (phone) {
      try {
        isSending.value = true
        await sendInvoiceByWhatsapp({ reservationId: localReservation.value.id, recipientPhone: phone, folioId: folio.id, language: getStoredLanguage() as 'fr' | 'en' })
        toast.success(t('whatsappSentSuccess'))
      } catch { toast.error(t('whatsappSentError')) }
      finally {
        isSending.value = false
      }
    }
    pendingWhatsappType.value = null; return
  }
  if (pendingEmailType.value) {
    const email = localReservation.value?.guest?.email ?? null
    if (email) {
      try {
        isSending.value = true
        await sendInvoiceByEmail({ reservationId: localReservation.value.id, recipientEmail: email, folioId: folio.id, language: getStoredLanguage() as 'fr' | 'en' })
        toast.success(t('emailSentSuccess'))
      } catch { toast.error(t('emailSentError')) }
      finally {
        isSending.value = false
      }
    }
    pendingEmailType.value = null; return
  }
  documentTitle.value = `${t('printInvoice')} - ${t('folio')} #${folio.folioNumber || folio.id}`
  handlePrint('receipt', folio.id)
}

const handlePrintOptionSelected = (option: any) => {
  if      (option.id === 'guestCard')        { documentTitle.value = t('Print Guest Registration'); handlePrint('guestCard') }
  else if (option.id === 'guest')            { documentTitle.value = t('Print Police'); handlePrint('guest') }
  else if (option.id === 'printResVourcher') { documentTitle.value = t('printResVourcher'); handlePrint('confirmation') }
  else if (option.id === 'invoice')          { handleInvoicePrint() }
  else if (option.id === 'wa_invoice')       { handleWhatsappSend('invoice') }
  else if (option.id === 'wa_voucher')       { handleWhatsappSend('voucher') }
  else if (option.id === 'email_invoice')    { handleEmailSend('invoice') }
  else if (option.id === 'email_voucher')    { handleEmailSend('voucher') }
}

onMounted(() => {
  // Ensure URL carries the current tab on initial mount
  if (!route.query.tab || !VALID_TAB_IDS.has(String(route.query.tab))) {
    router.replace({ query: { ...route.query, tab: activeTab.value } })
  }
  getBookingDetailsById()
})
</script>

<template>
  <AdminLayout>
    <OverLoading v-if="isRefreshing" />
    <ReservationDetailsSkeleton v-if="isLoading" />

    <div
      class="h-full"
      v-else-if="localReservation && localReservation.id"
      :class="{ 'void-status': localReservation.status === 'voided' }"
    >
      <!--Header-->
      <div
        class="shadow-sm px-4 py-2 mx-4 bg-white dark:bg-gray-800 dark:text-gray-100 flex justify-between"
      >
        <div class="flex gap-2 align-middle self-center items-center">
          <ArrowLeft @click="router.back()" class="cursor-pointer"></ArrowLeft>
          <img v-if="otaIconSrc" :src="otaIconSrc" alt="OTA" class="w-6 h-6" />
          <Building2Icon v-else class="text-primary"></Building2Icon>
          <Users v-if="localReservation.isGroup" />
          <span class="font-bold">{{ localReservation?.displayName }} </span>

          <div class="flex">
            <Adult class="w-5" />
            <span class="text-sm items-end align-center self-center pt-2">{{
              localReservation.adults ?? 0
            }}</span>
          </div>
          <div class="flex">
            <Child class="w-4" />
            <span class="text-sm items-end align-bottom self-center pt-2">{{
              localReservation.children ?? 0
            }}</span>
          </div>
          <div class="flex gap-8 ms-10">
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ $t('booking.arrival') }}</span>
              <span class="text-xs flex gap-2">
                <span
                  >{{ formatDate(localReservation.arrivedDate) }},
                  {{ formatTimeFromTimeString(localReservation.checkInTime) }}</span
                >
                <Pencil  class="w-3 h-3 cursor-pointer" @click="handleEditArrivalTime"  />
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('booking.departure') }}</span>
              <span class="text-xs flex gap-2">
                <span
                  >{{ formatDate(localReservation.departDate) }},
                  {{ formatTimeFromTimeString(localReservation.checkOutTime) }}</span
                >
                <Pencil  class="w-3 h-3 cursor-pointer"  @click="handleEditDepartureTime"  />
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('nights') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ nightsSummary }}</span>
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ $t('Room/Rate types') }}</span>
              <span
                class="text-xs flex gap-2 flex-col"
                v-if="
                  localReservation.reservationRooms.length > 0 &&
                  localReservation.reservationRooms.every((room: any) => room.room?.id)
                "
              >
                <span>{{ roomRateTypeSummary }}</span>
              </span>
              <AssignRoomReservation
                :reservation="localReservation"
                v-if="
                  localReservation.reservationRooms.length === 0 ||
                  localReservation.reservationRooms.some((room: any) => !room.room?.id)
                "
                @refresh="handleRoomAssignmentRefresh"
              />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('res.no') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ localReservation.reservationNumber }}</span>
              </span>
            </div>
               <!-- Crédit client -->
            <div
              v-if="hasCreditBalance"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-sm"
            >
              <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-green-700 dark:text-green-300 font-medium">
                {{  creditBalanceFormatted }}
              </span>
              <button
                @click="openCreditModal"
                type="button"
                class="ml-1 px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors"
              >
                {{ $t('Apply') }}
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="isPending"
          class="flex gap-x-2 h-full align-middle self-center items-center justify-center"
        >
          <button
            type="button"
            @click="ReservationConfirm"
            :disabled="isConfirming"
            class="bg-green-500 rounded-lg px-4 py-2 text-sm flex gap-2 items-center text-white shadow-theme-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:ring-offset-gray-900"
          >
            <svg
              v-if="isConfirming"
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{
              isConfirming ? $t('processing') || 'Processing...' : $t('ConfirmBooking')
            }}</span>
          </button>
        </div>
     
        <div
          v-else
          class="flex gap-x-2 h-full align-middle self-center items-center justify-center"
        >
          <ReservationStatus :status="localReservation.status" />
        </div>
      </div>

      <!--main-->
      <div
        class="shadow-sm px-2 pt-1 mx-4 bg-white dark:bg-gray-800 dark:text-gray-100 mt-5 flex justify-between"
      >
        <div class="flex justify-between w-full">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8 px-6">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="onTabClick(tab.id)"
                :class="[
                  'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-200 dark:hover:border-gray-600',
                ]"
              >
                <div class="flex items-center space-x-2">
                  <span>{{ tab.label }}</span>
                </div>
              </button>
            </nav>
          </div>
          <div class="align-middle self-center items-center flex gap-2">
            <ReservationAction
              :reservation="localReservation"
              :local-reservation="localReservation"
              @reservation-updated="handleChildReservationUpdated"
              @save="handleChildSave"
            />
            <!-- Print/Send -->
            <ButtonDropdown
              :options="printOptions"
              :button-text="t('printSend')"
              :loading="isSending"
              :button-class="'bg-white text-sm border border-primary text-primary'"
              @option-selected="handlePrintOptionSelected"
            />
          </div>
         
        </div>
      </div>

      <!--tab content-->
      <div v-if="activeTab === 'room_charges'">
        <RoomCharge
          :reservation-id="localReservation.id"
          :reservation="localReservation"
          @refresh="handleRoomChargeRefresh"
        ></RoomCharge>
      </div>
      <div v-if="activeTab === 'folio_operations' && localReservation && localReservation.id">
        <FoglioOperation
          ref="foglioRef"
          :reservation-id="localReservation.id"
          :reservation="localReservation"
          @refresh="refresReservation"
        >
        </FoglioOperation>
      </div>
      <div v-if="activeTab === 'booking_details'">
        <BookingDetails
          :booking="localReservation"
          :guest="localReservation.guest"
          @refresh-booking-data="refreshBookingData"
        ></BookingDetails>
      </div>
      <div v-if="activeTab === 'guest_details'">
        <GuestDetails
          :reservation="localReservation"
          :guest="localReservation.guest"
          :reservationId="localReservation.id"
          @refresh="handleGuestRefresh"
        />
      </div>
      <div v-if="activeTab === 'audit_trial'">
        <AuditTrail :entity-ids="[localReservation.id]" />
      </div>
      <div v-if="activeTab === 'whatsapp_history'">
        <WhatsappHistory :reservation-id="localReservation.id" />
      </div>
    </div>

    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center">
        <p class="text-gray-500 dark:text-gray-400 text-lg">{{ $t('No reservation found') }}</p>
      </div>
    </div>
  </AdminLayout>

  <!-- Print Modal -->
  <template v-if="showPrintModal">
    <PrintModal
      :is-open="showPrintModal"
      :document-data="printDocumentData"
      @close="handlePrintClose"
      :reservation-id="localReservation.id"
      @print-success="handlePrintSuccess"
      @print-error="handlePrintError"
      :templates="templates"
    />
  </template>

  <!-- Edit Arrival Time Modal -->
  <EditTimeModal
    v-if="showEditArrivalTimeModal"
    :is-open="showEditArrivalTimeModal"
    :reservation-id="localReservation.id"
    :reservation="localReservation"
    time-type="arrival"
    :current-time="localReservation.checkInTime"
    @close="showEditArrivalTimeModal = false"
    @time-updated="handleTimeUpdated"
  />

  <!-- Edit Departure Time Modal -->
  <EditTimeModal
    v-if="showEditDepartureTimeModal"
    :is-open="showEditDepartureTimeModal"
    :reservation-id="localReservation.id"
    :reservation="localReservation"
    time-type="departure"
    :current-time="localReservation.checkOutTime"
    @close="showEditDepartureTimeModal = false"
    @time-updated="handleTimeUpdated"
  />
  <ConfirmModal
  :show="showCreditModal"
  :title="$t('Apply Credit to Reservation')"
  :message="`${$t('credit_available')} : ${creditBalanceFormatted}`"
  :confirm-text="isApplyingCredit ? $t('Processing...') : $t('Confirm')"
  :cancel-text="$t('Cancel')"
  :loading="isApplyingCredit"
  variant="warning"
  @confirm="handleApplyCredit"
  @cancel="showCreditModal = false"
  @update:show="showCreditModal = $event"
>
  <template #content>
    <div class="px-6 pb-4 space-y-3">

      <div>
      
        <InputCurrency
          :lb="$t('Amount to apply')"
          v-model.number="creditAmountToApply"
          type="number"
          :max="fetchedCreditBalance"
        />
        <p v-if="creditAmountToApply > fetchedCreditBalance" class="mt-1 text-xs text-red-500">
          {{ $t('exceeds_credit_available') }}
        </p>
      </div>
    </div>
  </template>
</ConfirmModal>

<!-- PDF Exporter -->
<div v-if="showPdfExporter || laodingPrint">
  <PdfExporterNode
    @close="closePrint"
    :is-modal-open="showPdfExporter"
    :is-generating="laodingPrint"
    :pdf-url="pdfUrl"
    :title="documentTitle"
  />
</div>

<!-- Folio Select Modal -->
<FolioSelectModal
  v-if="showFolioSelectModal"
  :is-open="showFolioSelectModal"
  :folios="reservationFolios"
  :guest-name="localReservation?.displayName"
  @close="showFolioSelectModal = false"
  @folio-selected="handleFolioSelected"
/>
</template>

<style scoped>
/* View-scoped dark-mode adjustments */
:deep(.dark .btn.btn-primary) {
  color: #f3f4f6 !important; /* keep primary label readable in dark */
}
</style>
