import { defineStore } from 'pinia'



export const useBookingStore = defineStore('booking', {
  state: () => ({
    selectedRoom: null,
    selectedBooking: null as any | null,
  }),
   getters: {
    getBooking: (state) => state.selectedBooking,
    getRoom: (state) => state.selectedRoom
  },
  actions: {
    setRoom(room:any) {
      this.selectedRoom = room
    },
    setBooking(reservation:any) {
      this.selectedBooking = reservation
    }
  },
    persist: true
})
