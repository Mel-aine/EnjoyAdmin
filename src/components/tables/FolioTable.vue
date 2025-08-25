<template>
  <div>
    <ReusableTable
      v-if="payments && payments.length > 0"
      :columns="tableColumns"
      :data="payments"
      :actions="tableActions"
      :searchable="false"
      :show-header="false"
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
import { Eye, Undo2, Printer } from 'lucide-vue-next';

const { t } = useI18n();

// --- PROPS ---
const props = defineProps<{
  payments: any[];
}>();

// --- EMITS ---
const emit = defineEmits(['view-details', 'refund', 'print-receipt']);

// --- CONFIGURATION DE LA TABLE ---
const tableColumns = computed(() => [
  { key: 'date', label: t('Date'), type: 'custom' as const },
  { key: 'reference', label: t('Référence / Méthode'), type: 'custom' as const },
  { key: 'amount', label: t('Amount'), type: 'custom' as const },
  { key: 'status', label: t('Status'), type: 'custom' as const },
]);

const tableActions = computed(() => [
  { label: t('View'), variant: 'primary' as const, action: 'view-details',icon:Eye },
  { label: t('Rembourser'), variant: 'secondary' as const, action: 'refund', condition: (item: any) => item.status === 'open' || item.status === 'paid',icon:Undo2 },
  { label: t('Imprimer le reçu'), variant: 'light' as const, action: 'print-receipt',icon:Printer },
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
</script>
