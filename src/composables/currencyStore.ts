import { defineStore } from 'pinia';
import { getCurrencies } from '@/services/configrationApi';

export interface Currency {
  id: number;
  name: string;
  code: string;
  sign: string;
  isDefault?: boolean;
}

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currencies: JSON.parse(localStorage.getItem('currencies') || '[]') as Currency[],
    selectedCurrency: localStorage.getItem('selectedCurrency') || 'XAF',
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
    async fetchCurrencies() {
      if (this.currencies.length > 0) {
        return this.currencies;
      }

      this.loading = true;
      try {
        const response = await getCurrencies();
        this.currencies = response.data.data;
        localStorage.setItem('currencies', JSON.stringify(this.currencies));
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
      localStorage.setItem('selectedCurrency', currencyCode);
    },

    init() {
      const storedCurrencies = localStorage.getItem('currencies');
      const storedSelectedCurrency = localStorage.getItem('selectedCurrency');
      
      if (storedCurrencies) {
        this.currencies = JSON.parse(storedCurrencies);
      }
      
      if (storedSelectedCurrency) {
        this.selectedCurrency = storedSelectedCurrency;
      }
    },

    clearCache() {
      this.currencies = [];
      localStorage.removeItem('currencies');
      localStorage.removeItem('selectedCurrency');
    }
  },
});