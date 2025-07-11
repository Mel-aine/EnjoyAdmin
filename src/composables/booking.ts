import { defineStore } from 'pinia'



export const useBookingStore = defineStore('booking', {
  state: () => ({
    selectedRoom: null,
    selectedBooking: null as any | null,
    selectedCustomer: null as any | null,
    isFromRoomCard: false,
  }),
   getters: {
    getBooking: (state) => state.selectedBooking,
    getCustomer: (state) => state.selectedCustomer,
    getRoom: (state) => state.selectedRoom
  },
  actions: {
    setRoom(room:any) {
      this.selectedRoom = room
      this.isFromRoomCard = true
    },
    setBooking(reservation:any) {
      this.selectedBooking = reservation
    },
    setCustomer(customer:any) {
      this.selectedCustomer = customer
    },
    clearRoom() {
    this.selectedRoom = null
    this.isFromRoomCard = false
  },
  },
    persist: true
})
