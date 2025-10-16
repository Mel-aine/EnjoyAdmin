// composables/useBookingStorage.ts
import { ref } from 'vue'

const STORAGE_KEY = 'quick_booking'

export interface Booking {
  reservation: {
    checkinDate: string
    checkinTime: string
    checkoutDate: string
    checkoutTime: string
    bookingType: string
    bookingSource: string
    businessSource: string
    isComplementary: boolean
    isHold: boolean
    rooms: number
  }
  roomConfigurations: Array<{
    id: string
    roomType: string
    rateType: string
    roomNumber: string
    adultCount: number
    childCount: number
    rate: number
  }>
  formData: {
    title: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    address: string
    country: string
    state: string
    zipcode: string
    dateOfBirth: string
    placeOfBirth: string
    profession: string
    idType: string
    idNumber: string
    idExpiryDate: string
    issuingCountry: string
    issuingCity: string
    profilePhoto: string | null
    idPhoto: string | null
  }
  otherInfo: {
    emailBookingVouchers: boolean
    voucherEmail: string
  }
  billing: {
    billTo: string
    paymentType: string
    paymentMode: string
  }
  holdReleaseData?: {
    date: string
    time: string
    releaseTerm: string
    remindDays: number
    dateType: string
  }
  timestamp: number
}

export function useBookingStorage() {
  const saveBooking = (data: Partial<Booking>) => {
    try {
      const draft: Booking = {
        ...data,
        timestamp: Date.now()
      } as Booking

      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
      return true
    } catch (error) {
      console.error('Error saving booking draft:', error)
      return false
    }
  }

  const loadBooking = (): Booking | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const draft = JSON.parse(stored) as BookingDraft

      // Vérifier si le brouillon n'est pas trop ancien (24 heures)
      const twentyFourHours = 24 * 60 * 60 * 1000
      if (Date.now() - draft.timestamp > twentyFourHours) {
        clearBookingDraft()
        return null
      }

      return draft
    } catch (error) {
      console.error('Error loading booking draft:', error)
      return null
    }
  }

  const clearBooking = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing booking draft:', error)
      return false
    }
  }

  const hasBookingDraft = (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null
  }

  return {
    saveBooking,
    loadBooking,
    clearBooking,
    hasBookingDraft
  }
}
