import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    language: null as string | null,
    domain: 'hotel' as 'hotel' | 'apartment',
  }),

  getters: {
    locale: (state) => state.language,
  },

  actions: {
    set(lang: string | null) {
      this.language = lang;
    },
    setDomain(domain: 'hotel' | 'apartment') {
      this.domain = domain
    },

    init() {
      // Pinia persisted state will hydrate automatically; nothing to do here
    },
  },
  persist: true,
});
