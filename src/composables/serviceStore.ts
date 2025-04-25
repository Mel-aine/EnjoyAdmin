
import { defineStore } from 'pinia';

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceId: localStorage.getItem('service_id')
      ? Number(localStorage.getItem('service_id'))
      : null as number | null,
  }),

  actions: {
    setServiceId(serviceId:any) {
      this.serviceId = serviceId;
      console.log('serviceId',serviceId)
      localStorage.setItem('service_id', serviceId.toString());
    },

    clearServiceId() {
      this.serviceId = null;
      localStorage.removeItem('service_id');
    }
  }
});
