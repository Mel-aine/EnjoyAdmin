import { defineStore } from 'pinia';
import { getCurrencies } from '@/services/configrationApi';

export interface Currency {
  id: number;
  name: string;
  code: string;
  sign: string;
  isDefault?: boolean;
  currencyCode: string;
}

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currencies: [] as Currency[],
    selectedCurrency: 'XAF',
    loading: false,
  }),

  getters: {
    getCurrencies: (state) => state.currencies,
    getSelectedCurrency: (state) => state.selectedCurrency,
    getCurrencyOptions: (state) => state.currencies.map(currency => ({
      label: `${currency.name} (${currency.sign})`,
      value: currency.code
    })),
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchCurrencies(force = false) {
      if (!force && this.currencies.length > 0) {
        return this.currencies;
      }

      this.loading = true;
      try {
        const response = await getCurrencies();
        this.currencies = response.data.data.data;
        return this.currencies;
      } catch (error) {
        console.error('Error fetching currencies:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setSelectedCurrency(currencyCode: string) {
      this.selectedCurrency = currencyCode;
    },

    init() {
      // Pinia persisted state will hydrate automatically; nothing to do here
    },

    clearCache() {
      this.currencies = [];
    }
  },
  persist: true,
});
