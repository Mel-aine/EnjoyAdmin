import { defineStore } from 'pinia'



export const useBookingStore = defineStore('booking', {
  state: () => ({
    selectedRoom: null,
    selectedBooking: null as any | null,
    selectRoom: null as any | null,
    selectedCustomer: null as any | null,
    isFromRoomCard: false,
  }),
  getters: {
    getBooking: (state) => state.selectedBooking,
    getCustomer: (state) => state.selectedCustomer,
    getRoom: (state) => state.selectedRoom,
    getRoomSelect: (state) => state.selectRoom,
  },
  actions: {
    setRoom(room: any) {
      this.selectedRoom = room
      this.isFromRoomCard = true
    },
    setRoomSelect(rooms: any) {
      this.selectRoom = rooms
    },
    setBooking(reservation: any) {
      this.selectedBooking = reservation
    },
    setCustomer(customer: any) {
      this.selectedCustomer = customer
    },
    clearRoom() {
      this.selectedRoom = null
      this.isFromRoomCard = false
    },
  }, persist: true
})
