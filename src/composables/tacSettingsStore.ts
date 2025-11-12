import { defineStore } from 'pinia'

export interface TacSettingsState {
  settingsByServiceId: Record<string, any>
}

export const useTacSettingsStore = defineStore('tacSettings', {
  state: (): TacSettingsState => ({
    settingsByServiceId: {},
  }),
  getters: {
    getByServiceId: (state) => (serviceId: number | string) => state.settingsByServiceId[String(serviceId)] || null,
  },
  actions: {
    setForService(serviceId: number | string, settings: any) {
      this.settingsByServiceId[String(serviceId)] = settings
    },
    clearForService(serviceId: number | string) {
      delete this.settingsByServiceId[String(serviceId)]
    },
    clearAll() {
      this.settingsByServiceId = {}
    }
  },
  persist: true,
})