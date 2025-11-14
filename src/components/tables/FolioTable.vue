<template>
  <div>
    <ReusableTable
      v-if="payments && payments.length > 0"
      :columns="tableColumns"
      :data="payments"
      :meta="meta"
      @page-change="(page) => emit('page-change', page)"
      :searchable="false"
      :expandable="true"
      :show-header="false"
      :loading="loading"
      @action="onTableAction"
    >
      <!-- Date du paiement -->
      <template #column-date="{ item }">
        <div class="font-medium text-gray-900">{{ formatDate(item.createdAt) }}</div>
      </template>

      <!-- Référence et Méthode -->
      <template #column-reference="{ item }">
        <div class="font-medium text-gray-900">{{ item.folioNumber || 'N/A' }}</div>
        <div class="text-sm text-gray-500">{{ item.paymentMethod || 'Non spécifié' }}</div>
      </template>

      <!-- Montant -->
      <template #column-amount="{ item }">
        <div class="font-semibold text-gray-900">{{ formatCurrency(item.totalPayments) }}</div>
      </template>

      <!-- Statut -->
      <template #column-status="{ item }">
        <span :class="getStatusClass(item.status)" class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize">
          {{ item.status.replace('_', ' ') }}
        </span>
      </template>
      <template #column-totalCharges="{ item }">
        <div class="font-semibold text-gray-900">{{ formatCurrency(item.totalCharges) }}</div>
      </template>
      <template #expanded-content="{ item }">
        <div class="p-4" :class="item.status === 'voided' ? 'line-through opacity-60' : ''">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard class="w-4 h-4" />
            {{ $t('Transactions') }}
          </h4>

          <ReusableTable
            :columns="transactionColumns"
            :data="item.transactions || []"
            :searchable="false"
            :show-header="true"
            :selectable="false"
            :row-class="() => item.status === 'voided' ? 'line-through opacity-60' : ''"
          >
            <template #column-date="{ item: transaction }">
              <div class="text-sm text-gray-900">{{ formatDate(transaction.transactionDate) }}</div>
            </template>

            <template #column-description="{ item: transaction }">
              <div class="text-sm font-medium text-gray-900">{{ transaction.description }}</div>
              <div class="text-xs text-gray-500">{{ transaction.transactionCode }}</div>
            </template>

            <template #column-amount="{ item: transaction }">
              <div class="text-sm font-semibold" :class="getAmountClass(transaction.transactionType)">
                {{ formatCurrency(transaction.amount) }}
              </div>
            </template>

            <template #column-type="{ item: transaction }">
              <span :class="getTransactionTypeClass(transaction.transactionType)"
                    class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize">
                {{ transaction.transactionType }}
              </span>
            </template>
          </ReusableTable>
        </div>
      </template>
    </ReusableTable>

    <!-- État vide si aucune donnée de paiement n'est trouvée -->
    <div v-else class="text-center py-12 border-t mt-4">
      <CreditCard class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('No Payments Found') }}</h3>
      <p class="text-gray-500">{{ $t('This guest has no payment history.') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import ReusableTable from '@/components/tables/ReusableTable.vue';
import { CreditCard } from 'lucide-vue-next';

const { t } = useI18n();

// --- PROPS ---
const props = defineProps<{
  payments: any[];
  loading?:boolean
  meta?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    previousPageUrl?: string | null;
    nextPageUrl?: string | null;
  }
}>();

// --- EMITS ---
const emit = defineEmits(['view-details', 'refund', 'print-receipt','page-change']);

// --- CONFIGURATION DE LA TABLE ---
const tableColumns = computed(() => [
  { key: 'date', label: t('Date'), type: 'custom' as const },
  { key: 'reference', label: t('Référence / Méthode'), type: 'custom' as const },
  { key: 'amount', label: t('totalPayments'), type: 'custom' as const },
  { key: 'status', label: t('Status'), type: 'custom' as const },
  { key: 'balance', label: t('balance'), type: 'custom' as const },
  { key: 'totalCharges', label: t('unsettledFolios.columns.totalCharges'), type: 'custom' as const },

]);

const transactionColumns = computed(() => [
  { key: 'date', label: t('Date'), type: 'custom' as const },
  { key: 'description', label: t('Description'), type: 'custom' as const },
  { key: 'type', label: t('Type'), type: 'custom' as const },
  { key: 'amount', label: t('Amount'), type: 'custom' as const },
]);


const onTableAction = (action: string, item: any) => {
  emit(action as any, item);
};

// --- FONCTIONS UTILITAIRES ---
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatCurrency = (amount: string | number): string => {
  const num = parseFloat(String(amount) || '0');
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(num);
};

const getStatusClass = (status: string): string => {
  const map = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    voided: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  return map[status as keyof typeof map] || 'bg-gray-100 text-gray-800';
};
const getAmountClass = (type: string): string => {
  return type === 'payment' ? 'text-green-600' : 'text-gray-900';
};

const getTransactionTypeClass = (type: string): string => {
  const map = {
    charge: 'bg-blue-100 text-blue-800',
    payment: 'bg-green-100 text-green-800',
    void: 'bg-red-100 text-red-800',
    adjustment: 'bg-yellow-100 text-yellow-800',
  };
  return map[type as keyof typeof map] || 'bg-gray-100 text-gray-800';
};
</script>
