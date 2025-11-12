import { defineStore } from 'pinia'

export interface BookingDraft {
  data: any | null
  timestamp: number | null
}

export const useBookingDraftStore = defineStore('bookingDraft', {
  state: (): BookingDraft => ({
    data: null,
    timestamp: null,
  }),
  getters: {
    hasDraft: (state) => state.data !== null,
  },
  actions: {
    setDraft(data: any) {
      this.data = data
      this.timestamp = Date.now()
    },
    clearDraft() {
      this.data = null
      this.timestamp = null
    },
  },
  persist: true,
})