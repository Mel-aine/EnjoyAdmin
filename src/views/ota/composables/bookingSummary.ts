import { ref } from 'vue'

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
}

const bookingData = ref<BookingData | null>(null)

export function useBookingSummaryStore() {
  const setBookingData = (data: BookingData) => {
    bookingData.value = data

    try {
      localStorage.setItem('booking_data', JSON.stringify(data))
    } catch (e) {
      console.warn('Could not save booking data to localStorage', e)
    }
  }

  const getBookingData = (): BookingData | null => {
    // Si on a déjà les données en mémoire
    if (bookingData.value) {
      return bookingData.value
    }

    // Sinon, essayer de récupérer depuis localStorage
    try {
      const stored = localStorage.getItem('booking_data')
      if (stored) {
        bookingData.value = JSON.parse(stored)
        return bookingData.value
      }
    } catch (e) {
      console.warn('Could not load booking data from localStorage', e)
    }

    return null
  }

  const clearBookingData = () => {
    bookingData.value = null
    try {
      localStorage.removeItem('booking_data')
    } catch (e) {
      console.warn('Could not clear booking data from localStorage', e)
    }
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
