// composables/useBookingStorage.ts
import { ref } from 'vue'
import { useBookingDraftStore } from '@/composables/bookingDraftStore'

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
    meansOfTransport:string
    goingTo:string
    arrivingTo:string

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
  const draftStore = useBookingDraftStore()
  const saveBooking = (data: Partial<Booking>) => {
    try {
      const draft: Booking = {
        ...data,
        timestamp: Date.now()
      } as Booking

      draftStore.setDraft(draft)
      return true
    } catch (error) {
      console.error('Error saving booking draft:', error)
      return false
    }
  }

  const loadBooking = (): Booking | null => {
    try {
      const data = draftStore.data as Booking | null
      if (!data) return null
      return data
    } catch (error) {
      console.error('Error loading booking draft:', error)
      return null
    }
  }

  const clearBooking = () => {
    try {
      draftStore.clearDraft()
      return true
    } catch (error) {
      console.error('Error clearing booking draft:', error)
      return false
    }
  }

  const hasBookingDraft = (): boolean => {
    return draftStore.hasDraft
  }

  return {
    saveBooking,
    loadBooking,
    clearBooking,
    hasBookingDraft
  }
}
