
import { defineStore } from 'pinia'

interface BookingItem {
  roomId: number
  rateTypeId: string
  quantity: number
}

interface BookingData {
  hotelId: string
  arrivalDate: string
  departureDate: string
  adults: string
  children: string
  nights: string
  items: BookingItem[]
}

export const useBookingSummaryStore = defineStore('booking', {
  state: (): BookingData => ({
    hotelId: '',
    arrivalDate: '',
    departureDate: '',
    adults: '',
    children: '',
    nights: '',
    items: [],
  }),

  actions: {
    setBookingData(data: BookingData) {
      this.hotelId = data.hotelId
      this.arrivalDate = data.arrivalDate
      this.departureDate = data.departureDate
      this.adults = data.adults
      this.children = data.children
      this.nights = data.nights
      this.items = data.items
    },

    clearBooking() {
      this.hotelId = ''
      this.arrivalDate = ''
      this.departureDate = ''
      this.adults = ''
      this.children = ''
      this.nights = ''
      this.items = []
    },
  },

  persist: true, // ✅ garde tout après un refresh
})
