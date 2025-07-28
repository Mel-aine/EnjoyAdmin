
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Ref } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useStorage('token', null),
    // user: useStorage('user', null),
    user: useStorage<any | null>('user', null),
    roleId: useStorage('roleId', null) as Ref<number | null>,
    UserId: useStorage('UserId', null) as Ref<number | null>,

  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isFullyAuthenticated: (state) => !!(state.token && state.user && state.UserId && state.roleId),
    getUser: (state) => state.user
  },
  actions: {
    login(user: any, token: any) {
      this.user = JSON.stringify(user)
      this.token = token
      this.roleId = user.roleId;
      this.UserId = user.UserId;
      console.log('login', this.user)
    },
    logout() {
       // Méthode agressive pour nettoyer useStorage
       this.token = null;
       this.user = null;
       this.roleId = null;
       this.UserId = null;
       
       // Force la réactivité de useStorage
       this.$patch(state => {
        state.token = null;
        state.user = null;
        state.roleId = null;
        state.UserId = null;
      });
      
       
       console.log('Après logout:', {
         token: this.token,
         user: this.user,
         UserId: this.UserId,
         roleId: this.roleId
       });
     },
     
     // Méthode de nettoyage nucléaire
     forceLogout() {
       console.log('Force logout - avant:', this.$state);
       
       // Reset complet du store
       this.$reset();
       
       // Nettoyage manuel de tous les storages possibles
       const allPossibleKeys = [
         'token', 'user', 'roleId', 'UserId',
         'vueuse-token', 'vueuse-user', 'vueuse-roleId', 'vueuse-UserId',
         'auth_token', 'auth_user', 'auth_roleId', 'auth_UserId'
       ];
       
       allPossibleKeys.forEach(key => {
         localStorage.removeItem(key);
         sessionStorage.removeItem(key);
       });
       
       // Force la réinitialisation des refs useStorage
       this.token = null;
       this.user = null;
       this.roleId = null;
       this.UserId = null;
       
         console.log('Force logout - après:', this.$state);
       
     },

    setRoleId(roleId: number) {
      this.roleId = roleId;
    },
    setUserId(UserId: number) {
      this.UserId = UserId;
    },
    clearsetRoleId() {
      this.roleId = null;
    },
    clearsetUserId() {
      this.UserId = null;
    },
    clearsetUser() {
      this.user = null;
    }
  },
  persist: true
})
