import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    selectedRoom: null
  }),
  actions: {
    setRoom(room) {
      this.selectedRoom = room
    }
  }
})
