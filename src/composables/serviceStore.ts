import { defineStore } from 'pinia'
// import { useStorage } from '@vueuse/core'

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceId: null as number | null,
    serviceCategory: null as string | null,
    userService: [] as any[],
    currentService: '' as string,
    permissions: [] as { id: string; name: string; description: string }[],
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
    // hasPermission(names: string | string[]) {
    //   const perms = Array.isArray(names) ? names : [names]
    //   return this.permissions.some((p) => perms.includes(p.name))
    // },
    hasPermission(names: string | string[]) {
      // Si names est déjà un array, l'utiliser directement
      // Sinon, le convertir en array
      const perms = Array.isArray(names) ? names : [names]

      // Vérifier si l'utilisateur a AU MOINS UNE des permissions demandées
      return this.permissions.some((userPerm) => perms.includes(userPerm.name))
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
  },

  persist: true,
})
