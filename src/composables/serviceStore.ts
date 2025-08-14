import { defineStore } from 'pinia'
// import { useStorage } from '@vueuse/core'

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceId: null as number | null,
    serviceCategory: null as string | null,
    userService: [] as any[],
    currentService: '' as string,
    permissions: [] as { id: string; name: string; description: string }[],
    reservationType : [] as any[],
    businessSources : [] as any[],
    bookingSources : [] as any[]
  }),

  getters: {
    getService: (state): any[] => (Array.isArray(state.userService) ? state.userService : []),

    getCurrentService: (state): any | null => {
      try {
        return state.currentService ? JSON.parse(state.currentService) : null
      } catch {
        return null
      }
    },
  },

  actions: {
    setServiceId(serviceId: number) {
      this.serviceId = serviceId

      const found = this.getService.find((s) => s.id === serviceId)
      if (found) this.setCurrentService(found)
    },

    setService(services: any[]) {
      this.userService = services
    },

    setCurrentService(service: any) {
      this.currentService = JSON.stringify(service)
    },

    setBookingSources(sources: any[]) {
      this.bookingSources = sources.map((s) => ({
        value: s.id,
        label: s.name
      }))
    },

    setBusinessSources(sources: any[]) {
      this.businessSources = sources.map((s) => ({
        value: s.id,
        label: s.name
      }))
    },

    setReservationType(types: any[]) {
      this.reservationType = types.map((t) => ({
        value: t.id,
        label: t.name
      }))
    },

    setPermissions(permissionBlocks: any[]) {
      console.log('Permission blocks reçus:', permissionBlocks)

      const allPermissions = permissionBlocks.flatMap((p) => {
        console.log('Bloc de permission:', p)
        console.log('Permissions dans le bloc:', p.permissions)
        return p.permissions ?? []
      })

      console.log('Permissions aplaties:', allPermissions)
      this.permissions = allPermissions
      console.log('Permissions dans le store:', this.permissions)
    },

    /**
     * Vérifie si l'utilisateur a une ou plusieurs permissions
     * @param names string | string[]
     */
    hasPermission(names: string | string[]) {
      const perms = Array.isArray(names) ? names : [names]
      return this.permissions.some((p) => perms.includes(p.name))
    },

    /**
     * Filtre un tableau de menus basé sur les permissions
     * @param menuItems Array<{ label: string; route: string; permission?: string }>
     */
    menuFilter(menuItems: any[]) {
      return menuItems.filter((item) => {
        if (!item.permission) return true
        return this.hasPermission(item.permission)
      })
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
    },

    clearPermissions() {
      this.permissions = []
    },
    clearUserService(){
      this.userService = []
    }
  },

  persist: true,
})
