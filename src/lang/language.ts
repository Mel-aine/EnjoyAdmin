import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    language: (typeof window !== 'undefined' ? localStorage.getItem('language') : null) || null as string | null,
  }),

  getters: {
    locale: (state) => state.language,
  },

  actions: {
    set(lang: string | null) {
      this.language = lang;
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang || '');
      }
      console.log('here', lang);
    },

    init() {
      // Cette action peut être appelée au démarrage de l'application
      if (typeof window !== 'undefined') {
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage) {
          this.language = storedLanguage;
        }
      }
    },
  },
});


