import { ref } from 'vue'
import { useBookingDraftStore } from '@/composables/bookingDraftStore'

export interface Tax {
  id: number
  name: string
  rate: string
  percent: string
  type: 'flat_percentage' | 'flat_amount'
}

export interface BookingItem {
  roomId: number
  roomName: string
  rateTypeId: number
  planName: string
  planPrice: number
  quantity: number
  adults: number
  children: number
  taxIncluded?: boolean
  subtotal?:any
  totalExtrasCost?:any
  totalExtraAdultCost?:any
  totalExtraChildCost?:any
  totalBasePrice?:any
  taxAmount?:any
  planPriceTTC?:any
  planPriceHT?:any
  extractedRoomTaxes?:any
  subtotalHT?:any
  extractedRoomTax?:any
  flatTaxPerNight?:any
  mealPlanRateInclude?:boolean
  extraCharges?: any[]
}

export interface BookingData {
  hotelId: string
  hotelName?: string
  address?: string
  email?: string
  phoneNumber?: string
  arrivalDate: string
  departureDate: string
  adults: number
  children: number
  nights: string
  items: BookingItem[]
  totalPrice?: number
  currency?: string
  taxes: Tax[]
  taxIncluded?: boolean
  policies?: string
  cancellationPolicy?: string
  totalBasePrice?:any
  totalExtraAdultCost?:any
  totalExtraChildCost?:any
  totalExtrasCost?:any
  totalSubtotal?:any
  totalTaxAmount?:any
  totalPlanPriceHT?:any
  totalPlanPriceTTC?:any
  planPriceHT?:any

}

const bookingData = ref<any | null>(null)
const bookingDraftStore = useBookingDraftStore()

export function useBookingSummaryStore() {
  const setBookingData = (data: any) => {
    bookingData.value = data
    bookingDraftStore.setDraft(data)
  }

  const getBookingData = (): BookingData | null => {
    // Si on a déjà les données en mémoire
    if (bookingData.value) {
      return bookingData.value
    }

    // Sinon, essayer de récupérer depuis Pinia persisted store
    if (bookingDraftStore.data) {
      bookingData.value = bookingDraftStore.data as BookingData
      return bookingData.value
    }

    return null
  }

  const clearBookingData = () => {
    bookingData.value = null
    bookingDraftStore.clearDraft()
  }

  return {
    bookingData,
    setBookingData,
    getBookingData,
    clearBookingData,
    // Propriétés computed pour faciliter l'accès
    hotelId: bookingData.value?.hotelId,
    hotelName: bookingData.value?.hotelName,
    arrivalDate: bookingData.value?.arrivalDate,
    departureDate: bookingData.value?.departureDate,
    adults: bookingData.value?.adults,
    children: bookingData.value?.children,
    nights: bookingData.value?.nights,
    items: bookingData.value?.items || [],
    totalPrice: bookingData.value?.totalPrice,
    currency: bookingData.value?.currency || 'XAF'
  }
}
