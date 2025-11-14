<template>
  <ExchangeRateModal :is-open='isOpen' @close="closeModal" />
  <AdminLayout>
    <div class="p-6">
      <ReusableTable :title="$t('Currency Management')" :columns="columns" :data="currencies" :selectable="false" :actions=[]
        :search-placeholder="$t('Search currencies...')" :empty-state-title="$t('No currencies found')" :searchable="false"
        :empty-state-message="$t('Start by adding your first currency.')" :loading="loading">
        <template v-slot:header-actions>
          <BasicButton variant="primary" @click="openModal"  :label="$t('Exchange Rate')"
             />
        </template>
        <template #isDefault="{ item }">
          <span v-if="item.isDefault"
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {{ $t('Default') }}
          </span>
        </template>
      </ReusableTable>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import {
  getCurrencies} from '@/services/configrationApi'
import ExchangeRateModal from './ExchangeRateModal.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import type { Column } from '../../utils/models'

const { t } = useI18n()
const toast = useToast()

const currencies = ref<any[]>([])
const loading = ref(false)
const isOpen = ref(false);
const columns = computed<Column[]>(() => [
  { key: 'currencyCode', label: t('Currency Code'), type: 'text' },
  { key: 'name', label: t('Currency Name'), type: 'text' },
  { key: 'sign', label: t('Symbol'), type: 'text' },
  { key: 'exchangeRate', label: t('Exchange Rate'), type: 'text' },
  { key: 'isDefault', label: t('Default'), type: 'custom' },
  { key: 'country', label: t('Country'), type: 'text' },
  { key: 'prefixSuffix', label: t('prefixSuffix'), type: 'text', translatable: true },
  { key: 'digitsAfterDecimal', label: t('Decimal Places'), type: 'text' },
])



// Fetch currencies from API
const fetchCurrencies = async () => {
  try {
    loading.value = true
    const response = await getCurrencies()
    currencies.value = response?.data?.data?.data || []
    console.log('currecy', response)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    toast.error(t('Failed to load currencies'))
  } finally {
    loading.value = false
  }
}


// Load currencies on component mount
onMounted(() => {
  fetchCurrencies()
})
const openModal = () => {
  isOpen.value = true;
}

const closeModal = () => {
  isOpen.value = false;
}
</script>


<style scoped>
/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects */
.hover\:border-gray-300:hover {
  border-color: #d1d5db;
}
</style>
