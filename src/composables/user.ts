
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
    getUser: (state) => state.user
  },
  actions: {
    login(user: any, token: any) {
      console.log('-->login.any', typeof user);
      this.user = {...user}
      this.token = token
      this.roleId = user.roleId;
      this.UserId = user.UserId;
      console.log('login', this.user)
    },
    logout() {
      this.user = null
      this.token = null
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
