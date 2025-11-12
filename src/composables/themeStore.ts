import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light' as Theme,
    initialized: false,
  }),
  getters: {
    isDark: (state) => state.theme === 'dark',
  },
  actions: {
    toggle() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
    setTheme(theme: Theme) {
      this.theme = theme
    },
    markInitialized() {
      this.initialized = true
    }
  },
  persist: true,
})