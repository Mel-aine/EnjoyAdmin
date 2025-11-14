import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    refreshToken: null as string | null,
    tokenData: null as any,
    refreshTokenData: null as any,
    user: null as Record<string, any> | null,
    roleId: null as number | null,
    UserId: null as number | null,
    reportsPermissions:[] as { id: string; name: string; description: string }[],
    reauthRequired: false as boolean,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isFullyAuthenticated: (state) => !!(state.token && state.user && state.UserId),// && state.roleId
    getUser: (state) => state.user,
    isAuthenticated: (state) => !!state.token,
  },

  actions: {

    login(user: any, token: string) {
      this.user = { ...user };
      this.token = token;
      this.roleId = user.roleId;
      this.UserId = user.UserId;
    },

    setReauthRequired(flag: boolean) {
      this.reauthRequired = flag
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      this.roleId = null;
      this.UserId = null;
      this.token = null
      this.refreshToken = null
      this.tokenData = null
      this.refreshTokenData = null
      this.reauthRequired = false
    },

    forceLogout() {
      console.log('Force logout - avant:', this.$state);

      this.$reset();
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      this.roleId = null;
      this.UserId = null;
      this.reauthRequired = false;

      console.log('Force logout - après:', this.$state);
    },

    setRoleId(roleId: number) {
      this.roleId = roleId;
    },
    setUserId(UserId: number) {
      this.UserId = UserId;
    },
    setReportsPermissions(permissions:any){
      console.log("permissions",permissions)
       this.reportsPermissions = permissions;
    },
     updateToken(token: string, tokenData: any) {
      this.token = token
      this.tokenData = tokenData
    },

    // Met à jour le refresh token et ses données
    updateRefreshToken(refreshToken: string, refreshTokenData: any) {
      this.refreshToken = refreshToken
      this.refreshTokenData = refreshTokenData
    },

    /**
     * Vérifie si l'utilisateur a une ou plusieurs permissions
     * @param names string | string[]
     */
    hasReportPermission(permissionName: string) {
      try {
        // Si l'utilisateur n'a pas de permissions définies, on refuse l'accès
        if (!this.user?.permisReports) {
          console.warn('Aucune permission définie pour l\'utilisateur');
          return false;
        }

        // Si permisReports est déjà un tableau, on l'utilise directement
        if (Array.isArray(this.user.permisReports)) {
          return this.user.permisReports.includes(permissionName);
        }

        // Sinon, on essaie de le parser comme une chaîne JSON
        if (typeof this.user.permisReports === 'string') {
          const permissions = JSON.parse(this.user.permisReports);
          return Array.isArray(permissions) && permissions.includes(permissionName);
        }

        console.warn('Format de permissions non reconnu:', this.user.permisReports);
        return false;
      } catch (error) {
        console.error('Erreur lors de la vérification des permissions:', error, 'Permission demandée:', permissionName);
        return false;
      }
    },
    hasPermission(permissionName: string) {
      if (!this.user?.permisPrivileges) return false;

      try {
        const permissions = JSON.parse(this.user.permisPrivileges);
        return permissions.includes(permissionName);
      } catch (error) {
        console.error('Erreur lors de la vérification des permissions:', error);
        return false;
      }
    },
    clearsetRoleId() {
      this.roleId = null;
    },
    clearsetUserId() {
      this.UserId = null;
    },
    clearsetUser() {
      this.user = null;
    },
     clearPermissionsReports() {
      this.reportsPermissions = []
    },
  },

  persist: true
});
