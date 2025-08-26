<template>
  <div>
    <!-- On s'assure qu'il y a des réservations avant d'afficher la table -->
    <ReusableTable
      v-if="paginatedReservations.length > 0"
      :columns="tableColumns"
      :data="paginatedReservations"
      :actions="tableActions"
      :searchable="false"
      :show-header="false"
      empty-state-title=""
      @action="onTableAction"
    >
      <!-- Custom column for reservation number -->
      <template #column-reservationNumber="{ item }">
        <div class="font-medium text-gray-900">#{{ item.reservationNumber }}</div>
        <div class="text-sm text-gray-500">{{ item.reservationRooms?.[0]?.roomType?.roomTypeName || 'Type non spécifié' }}</div>
      </template>

      <!-- Custom column for dates -->
      <template #column-dates="{ item }">
        <div class="text-sm">
          <div>
            <span class="text-gray-500">Arrivée:</span> {{ formatDate(item.arrivedDate) }}
          </div>
          <div>
            <span class="text-gray-500">Départ:</span> {{ formatDate(item.departDate) }}
          </div>
        </div>
      </template>

      <!-- Custom column for amount -->
      <template #column-totalAmount="{ item }">
        <div class="font-medium text-gray-900">
          {{ formatCurrency(item.finalAmount) }}
        </div>
      </template>

      <!-- Custom column for status -->
      <template #column-status="{ item }">
        <div class="flex flex-col items-start gap-1">
          <span :class="getStatusClass(item.status)" class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize">
            {{ item.status.replace('_', ' ') }}
          </span>
          <span :class="getPaymentStatusClass(item.paymentStatus)" class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize">
            {{ item.paymentStatus }}
          </span>
        </div>
      </template>
    </ReusableTable>

    <!-- Empty State, affiché s'il n'y a aucune réservation -->
    <div v-else class="text-center py-12 border-t mt-4">
      <CalendarX class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('No Reservations Found') }}</h3>
      <p class="text-gray-500">{{ $t('This guest has no reservation history.') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ReusableTable from '@/components/tables/ReusableTable.vue';
import { CalendarX } from 'lucide-vue-next';
import { Eye, CircleCheck , Trash2 ,LogOut} from 'lucide-vue-next'

const { t } = useI18n();
const router = useRouter();

// --- PROPS ---
const props = defineProps<{
  reservations: any[];
  customer: any;
}>();

// --- EMITS ---
const emit = defineEmits(['check-in', 'check-out', 'view-details', 'delete']);

// --- CONFIGURATION DE LA TABLE ---
const tableColumns = computed(() => [
  { key: 'reservationNumber', label: t('Reservation'), type: 'custom' as const },
  { key: 'dates', label: t('Dates'), type: 'custom' as const },
  { key: 'totalAmount', label: t('Amount'), type: 'custom' as const },
  { key: 'status', label: t('Status'), type: 'custom' as const },
]);

const tableActions = computed(() => [
  { label: t('View'), variant: 'primary' as const, action: 'view-details' ,icon: Eye },
  { label: t('Check In'), variant: 'secondary' as const, action: 'check-in', condition: (item: any) => item.status === 'confirmed' ,icon:CircleCheck  },
  { label: t('Check Out'), variant: 'secondary' as const, action: 'check-out', condition: (item: any) => item.status === 'checked_in' ,icon:LogOut },
  { label: t('Delete'), variant: 'danger' as const, action: 'delete'  ,icon: Trash2},
]);

// --- LOGIQUE ---
// Pour l'exemple, on affiche les 10 dernières réservations. Vous pouvez ajouter une pagination complète si besoin.
const paginatedReservations = computed(() => props.reservations?.slice(0, 10) || []);

const onTableAction = (action: string, item: any) => {
  // On émet l'événement vers le composant parent (CustomerDetails.vue)
  emit(action as any, item);
};

// --- FONCTIONS UTILITAIRES ---
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatCurrency = (amount: string | number): string => {
  const num = parseFloat(String(amount) || '0');
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(num);
};

const getStatusClass = (status: string): string => {
  const map = {
    checked_in: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    voided: 'bg-red-100 text-red-800',
    no_show: 'bg-orange-100 text-orange-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  return map[status as keyof typeof map] || 'bg-gray-100 text-gray-800';
};

const getPaymentStatusClass = (status: string): string => {
  const map = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    unpaid: 'bg-red-100 text-red-800',
    partial: 'bg-blue-100 text-blue-800',
  };
  return map[status as keyof typeof map] || 'bg-gray-100 text-gray-800';
};
</script>
