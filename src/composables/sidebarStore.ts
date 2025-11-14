import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isExpanded: true as boolean,
  }),
  actions: {
    setExpanded(val: boolean) {
      this.isExpanded = val
    },
    toggleExpanded() {
      this.isExpanded = !this.isExpanded
    },
  },
  persist: true,
})