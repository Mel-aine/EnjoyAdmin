import { defineStore } from 'pinia'



export const useBookingStore = defineStore('booking', {
  state: () => ({
    selectedRoom: null,
    selectedBooking: null as any | null,
    isFromRoomCard: false,
  }),
   getters: {
    getBooking: (state) => state.selectedBooking,
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
    clearRoom() {
    this.selectedRoom = null
    this.isFromRoomCard = false
  },
  },
    persist: true
})
