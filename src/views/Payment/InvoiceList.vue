<template>
  <div class="">
    <AdminLayout>
      <FullScreenLayout>
          <PageBreadcrumb :pageTitle="currentPageTitle" />
          <div class="py-5">
          <PaiementFilter @filter="applyFilters" />
          </div>
            <TableComponent
              :items="titles"
              :datas="filteredPayments"
              :searchable="false"
              :filterable="true"
              :pagination="true"
              :loading="loading"
              :showHeader="true"
              :title="$t('Payments')"
              :pageSize="15"
              :showButtonAllElement="true"
              @confirm="onConfirmPay"
              @print="onPrintPay"
              class="modern-table"
            />
       </FullScreenLayout>
        <Modal v-if="showConfirmModal" @close="showConfirmModal = false">
          <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- Close button -->
          <button
            @click="showConfirmModal = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04 16.54a.9.9 0 0 0 1.41 1.42L12 13.41l4.54 4.55a.9.9 0 1 0 1.41-1.42L13.41 12l4.55-4.54a.9.9 0 0 0-1.42-1.41L12 10.59 7.46 6.05a.9.9 0 0 0-1.41 1.42L10.59 12l-4.55 4.54Z"
                fill=""
              />
            </svg>
          </button>

          <div class="mb-6 text-center">
            <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ $t('ConfirmPayment') }}
            </h4>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ $t('ConfirmPaymentMessage') }}
            </p>
          </div>

          <!-- Payment details -->
          <div class="mb-4 space-y-2 text-gray-700 dark:text-gray-200">
            <p><strong>{{ $t('PaymentID') }}:</strong> {{ selectedPayment?.id }}</p>
            <p><strong>{{ $t('Amount') }}:</strong> {{ selectedPayment?.amountPaid }} FCFA</p>
            <p><strong>{{ $t('Date') }}:</strong> {{ new Date(selectedPayment?.paymentDate).toLocaleString('fr-FR') }}</p>
          </div>

          <!-- Buttons -->
          <div class="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
            <!-- Cancel -->
            <button
              type="button"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] sm:w-auto"
              @click="showConfirmModal = false"
            >
              {{ $t('Cancel') }}
            </button>

            <!-- Confirm -->
            <ButtonComponent
              type="button"
              :disabled="isLoading"
              @click="ConfirmPayment"
            >
              <span v-if="!isLoading">{{ $t('ConfirmPay') }}</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>
            </ButtonComponent>
          </div>
        </div>
      </template>
        </Modal>

  </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, defineAsyncComponent } from 'vue'
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { defineAsyncComponent as defineAsyncComponentBreadcrumb } from 'vue'
const PageBreadcrumb = defineAsyncComponentBreadcrumb(() => import("@/components/common/PageBreadcrumb.vue"));
import { getPayment, confirmPayment } from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification'
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'));
import ButtonComponent from "@/components/buttons/ButtonComponent.vue";
import { useAuthStore } from '@/composables/user'
import TableComponent from '@/components/tables/TableComponent.vue';
import { formatDateT } from '@/components/utilities/UtilitiesFunction'
import Spinner from '@/components/spinner/Spinner.vue';
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
import PaiementFilter from '@/components/filters/PaiementFilter.vue';
import type { PaymentFilterItem } from '@/utils/models';

const router = useRouter()
const { t, locale } = useI18n({ useScope: "global" });
const toast = useToast()
const serviceStore = useServiceStore();
const currentPageTitle = computed(() => t("InvoiceList"));
const selectedPayment = ref<any>(null)
const Payments = ref<any[]>([])
const showConfirmModal = ref(false)
const loading = ref(false)
const isLoading = ref(false)
const authStore = useAuthStore()

const filters = ref<PaymentFilterItem>({
  paymentId: 0,
  status: "",
  serviceId: serviceStore.serviceId!,
  searchText: ""
})

// Computed property pour les paiements filtrés
const filteredPayments = computed(() => {
  let filtered = [...Payments.value];

  // Filtre par ID de paiement
  if (filters.value.paymentId && filters.value.paymentId > 0) {
    filtered = filtered.filter(payment => payment.id === filters.value.paymentId);
  }

  // Filtre par statut
  if (filters.value.status && filters.value.status !== "") {
    filtered = filtered.filter(payment => payment.status === filters.value.status);
  }



  // Filtre par texte de recherche (recherche dans ID, montant, etc.)
  if (filters.value.searchText && filters.value.searchText.trim() !== "") {
    const searchText = filters.value.searchText.toLowerCase().trim();
    filtered = filtered.filter(payment =>
      payment.id.toString().toLowerCase().includes(searchText) ||
      payment.amountPaid.toString().toLowerCase().includes(searchText) ||
      payment.userFullName.toLowerCase().includes(searchText) ||
      t(payment.status).toLowerCase().includes(searchText)
    );
  }

  return filtered;
});

const fetchPayment = async () => {
  const serviceId = serviceStore.serviceId;

  if (!serviceId) {
    console.warn("serviceId is missing");
    return;
  }

  loading.value = true;

  try {
    const response = await getPayment(serviceId);
    console.log("Raw response data:", response.data);

    const paymentsData = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
      console.log("Payments data:", paymentsData);

    Payments.value = paymentsData.map((pay: any) => {
      const [bg, text] = getStatusColor(pay.status).split(' ');

      return {
        ...pay,
        Date: formatDateT(pay.paymentDate),
        userFullName: `${pay.client.firstName} ${pay.client.lastName}`,
        statusColor: {
          label: t(pay.status),
          bg,
          text
        }
      };
    });

    console.log("Processed Payments.value:", Payments.value);
  } catch (error) {
    console.error('fetch failed:', error);
  } finally {
    loading.value = false;
  }
};

watch(locale, fetchPayment)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'unpaid':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

onMounted(async () => {
  setTimeout(async () => {
    await fetchPayment()
  }, 500)
})

const titles = computed(() => [
  {
    name: 'id',
    label: t('PaymentID'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'userFullName',
    label: t('Customer'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'Date',
    label: t('Date'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'amountPaid',
    label: t('Amount'),
    type: 'currency',
    filterable: true,
  },
  {
    name: 'statusColor',
    label: t('Status'),
    type: 'badge',
    filterable: false,
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: (row: any) => {
      if (row.status === 'pending') {
        return [
          { name: 'Confirm', event: 'confirm', icone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check text-green-500"><path d="M20 6 9 17l-5-5"/></svg>`, },
        ]
      } else if (row.status === 'paid') {
        return [
          { name: 'Print', event: 'print', icone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-printer-check-icon lucide-printer-check"><path d="M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5"/><path d="m16 19 2 2 4-4"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/></svg>` },
        ]
      }
      return []
    },
  },
])

const onConfirmPay = (pay: any) => handlePayAction('confirm', pay);
const onPrintPay = (pay: any) => handlePayAction('print', pay);

const handlePayAction = (action: string, pay: any) => {
  const payment = filteredPayments.value.find((p: any) => p.id === pay.id) ||
                   Payments.value.find((p: any) => p.id === pay.id);

  if (!payment) {
    console.warn('Payment not found:', pay.id);
    return;
  }

  selectedPayment.value = payment;

  if (action === 'confirm') {
    showConfirmModal.value = true;
    console.log("View payment (pending):", selectedPayment.value);
  } else if (action === 'print') {
    router.push({ name: 'ViewInvoice', params: { id: payment.id } });
    console.log("View payment (paid):", selectedPayment.value);
  }
};

const ConfirmPayment = async () => {
  isLoading.value = true
  if (!selectedPayment.value) return;

  const payload = {
    createdBy: authStore.UserId,
  };

  try {
    await confirmPayment(selectedPayment.value.id, payload);
    await fetchPayment();
    router.push({ name: 'ViewInvoice', params: { id: selectedPayment.value.id } })
    toast.success(t('toast.paymentSucess'));
  } catch (error) {
    toast.error(t('toast.paymentError'));
    console.error(error);
  } finally {
    isLoading.value = false
    showConfirmModal.value = false;
  }
};

const applyFilters = (filter: PaymentFilterItem) => {
  console.log('Filtres appliqués:', filter);
  filters.value = { ...filter };
};

// Reset des filtres si nécessaire
const resetFilters = () => {
  filters.value = {
    paymentId: 0,
    status: "",
    serviceId: serviceStore.serviceId!,
    searchText: ""
  };
};
</script>

<style scoped>
</style>
