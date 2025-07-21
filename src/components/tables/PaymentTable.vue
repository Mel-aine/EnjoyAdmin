<template>
    <div class="">
        <TableComponent :items="titles" :datas="Payments"  :pagination="true" :loading="loading"
            :showHeader="true" :title="$t('Payments')" :pageSize="15" @confirm="onConfirmPay" @print="onPrintPay"
            class="modern-table" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, type PropType } from 'vue'
import { confirmPayment } from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification'
import Modal from '@/components/profile/Modal.vue';
import ButtonComponent from "@/components/buttons/ButtonComponent.vue";
import { useAuthStore } from '@/composables/user'
import TableComponent from '@/components/tables/TableComponent.vue';
import { formatDateT } from '@/components/utilities/UtilitiesFunction'
import Spinner from '@/components/spinner/Spinner.vue';

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
const props = defineProps({
    datas: {
        type: Array as PropType<any[]>,
        required: true,
    },
});

const fetchPayment = async () => {


    try {

        const paymentsData = Array.isArray(props.datas)
            ? props.datas
            : props.datas || [];

        Payments.value = paymentsData.map((pay: any) => {
            const [bg, text] = getStatusColor(pay.status).split(' ');

            return {
                ...pay,
                Date: formatDateT(pay.paymentDate),
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
    fetchPayment()
})

const titles = computed(() => [
    {
        name: 'id',
        label: t('PaymentID'),
        type: 'text',
        filterable: false,
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
    const payment = Payments.value.find((p: any) => p.id === pay.id);
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



</script>

<style scoped></style>
