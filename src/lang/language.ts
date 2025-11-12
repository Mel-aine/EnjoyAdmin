import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    language: null as string | null,
  }),

  getters: {
    locale: (state) => state.language,
  },

  actions: {
    set(lang: string | null) {
      this.language = lang;
    },

    init() {
      // Pinia persisted state will hydrate automatically; nothing to do here
    },
  },
  persist: true,
});


