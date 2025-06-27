import { defineStore } from 'pinia'
// import { useStorage } from '@vueuse/core'

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceId: null as number | null,
    serviceCategory: null as string | null,
   userService: [] as any[],
    currentService: '' as string,
  }),

  getters: {
   getService: (state): any[] => Array.isArray(state.userService) ? state.userService : [],


    getCurrentService: (state): any | null => {
      try {
        return state.currentService ? JSON.parse(state.currentService) : null
      } catch {
        return null
      }
    }
  },

  actions: {
    setServiceId(serviceId: number) {
      this.serviceId = serviceId


      const found = this.getService.find(s => s.id === serviceId)
      if (found) this.setCurrentService(found)
    },

    setService(services: any[]) {
      this.userService = services;
    },

    setCurrentService(service: any) {
      this.currentService = JSON.stringify(service)
    },

    clearServiceId() {
      this.serviceId = null
    },

    clearCurrentService() {
      this.currentService = ''
    },

    setServiceCategory(category: string) {
      this.serviceCategory = category
    },

    clearServiceCategory() {
      this.serviceCategory = null
    }
  },

  persist: true
})
