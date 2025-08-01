import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as Record<string, any> | null,
    roleId: null as number | null,
    UserId: null as number | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isFullyAuthenticated: (state) => !!(state.token && state.user && state.UserId && state.roleId),
    getUser: (state) => state.user
  },

  actions: {
    initFromStorage() {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user') || 'null');
      this.roleId = JSON.parse(localStorage.getItem('roleId') || 'null');
      this.UserId = JSON.parse(localStorage.getItem('UserId') || 'null');
    },

    login(user: any, token: string) {
      this.user = { ...user };
      this.token = token;
      this.roleId = user.roleId;
      this.UserId = user.UserId;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('roleId', JSON.stringify(user.roleId));
      localStorage.setItem('UserId', JSON.stringify(user.UserId));
    },

    logout() {
      this.token = null;
      this.user = null;
      this.roleId = null;
      this.UserId = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('roleId');
      localStorage.removeItem('UserId');

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('roleId');
      sessionStorage.removeItem('UserId');
    },

    forceLogout() {
      console.log('Force logout - avant:', this.$state);

      this.$reset();

      const allPossibleKeys = [
        'token', 'user', 'roleId', 'UserId',
        'vueuse-token', 'vueuse-user', 'vueuse-roleId', 'vueuse-UserId',
        'auth_token', 'auth_user', 'auth_roleId', 'auth_UserId'
      ];

      allPossibleKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

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
});
