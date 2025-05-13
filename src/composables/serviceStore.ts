import { defineStore } from 'pinia'

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceId: null as number | null,
    serviceCategory: null as string | null,
  }),

  actions: {
    setServiceId(serviceId: number) {
      this.serviceId = serviceId;
      console.log('serviceId', serviceId);
    },

    clearServiceId() {
      this.serviceId = null;
    },

    setServiceCategory(category: string) {
      this.serviceCategory = category;
      console.log('serviceCategory', category);
    },

    clearServiceCategory() {
      this.serviceCategory = null;
    }
  },

  persist: true
});

