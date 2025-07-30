<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import {
    deleteAmenityProduct,
    getAmenityBookingByReservationIdAndServiceId,
} from '@/services/api'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import AmenityProductUpsertModal from '@/components/modal/AmenityProductUpsertModal.vue'
import AccordionTable from '@/components/tables/booking-tables/AccordionTable.vue'
import type { TableColumn } from '@/utils/models'
const loadingDelete = ref(false)
const loading = ref(false)
const serviceStore = useServiceStore()
const reservation_id = router.currentRoute.value.params.id;
const toast = useToast()
const selectedAmenityProductId = ref<number | null>(null)
const show = ref(false)
const modalOpen = ref(false)
const amenitiesBooking = ref<any[]>([])
const selectedAmenityProduct = ref<any>(null)
const isEditMode = ref(false)
const { t } = useI18n()

const refresh = () => {
    modalOpen.value = false;
    isEditMode.value = false;
    fetchAmenitiesBooking();
}
const fetchAmenitiesBooking = async () => {
    loading.value = true
    try {
        const serviceId = serviceStore.serviceId
        if (!serviceId) throw new Error('Service ID is not defined')
        const response = await getAmenityBookingByReservationIdAndServiceId(parseInt(`${reservation_id}`)!, serviceId)
        console.log('response', response)
        amenitiesBooking.value = response.data
    } catch (error) {
        console.error('fetch failed:', error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    fetchAmenitiesBooking()
})
const titles = computed(() => [
    {
        name: 'amenityOrderNumber',
        label: t('order_number'),
        type: 'text',
        filterable: false,
    },

    {
        name: 'totalAmount',
        label: t('total_amount'),
        type: 'currency',
        filterable: true,
    },
    {
        name: 'status',
        label: t('order_status'),
        type: 'text',
        filterable: true,
    },

    {
        name: 'createdAt',
        label: t('order_date'),
        type: 'date',
        filterable: false,
    },

] as TableColumn[])


const usersWithRoleLabels = computed(() =>
    amenitiesBooking.value.map((amenityProduct: any) => {
        return {
            ...amenityProduct,
            items: amenityProduct.items.map((item: any) => ({
                ...item,
                name: item.amenityProduct.name || 'N/A',
                timeUnit: item.amenityProduct.timeUnit,
            })),
        }
    }),
)


const closeModal = () => {
    modalOpen.value = false
    isEditMode.value = false
}


const bookingItemsColumn = computed(() => [
    {
        name: 'id',
        label: t('ID'),
        type: 'text',
        filterable: false,
    },
    {
        name: 'name',
        label: t('Name'),
        type: 'text',
        filterable: true,
    },
    {
        name: 'quantity',
        label: t('quantity'),
        type: 'text',
        filterable: true,
    },


    {
        name: 'pricePerUnit',
        label: t('price_per_unit'),
        type: 'currency',
        filterable: true,
    },
    {
        name: 'subtotal',
        label: t('subtotal'),
        type: 'currency',
        filterable: true,
    },
    {
        name: 'timeUnit',
        label: t('time_unit'),
        type: 'text',
        filterable: true,
        isTranslatable: true,
    },

    {
        name: 'createdAt',
        label: t('order_date'),
        type: 'date',
        filterable: false,
    },
] as TableColumn[])
</script>

<template>
    <div class="space-y-6 mt-5 mb-5">

        <div class="space-y-4">
            <AccordionTable :items="titles" :datas="usersWithRoleLabels" :filterable="true" :pagination="true"
                :loading="loading" :showHeader="true" :searchable="false"
                :title="$t('amenities_booking.amenitie_booking')" :pageSize="15" :showButtonAllElement="true"
                class="modern-table">
                <template #subTable="{ rowData }">
                    <div class="p-4">
                        <AccordionTable :items="bookingItemsColumn" :datas="rowData.items" :filterable="true"
                            :pagination="true" :loading="loading" :showHeader="false" :searchable="false"
                            :title="$t('amenities_booking.amenitie_booking_items')" :pageSize="15"
                            :showButtonAllElement="true" class="modern-table">
                        </AccordionTable>
                    </div>
                </template>
            </AccordionTable>

        </div>
        <template v-if="modalOpen && reservation_id">
            <AmenityProductUpsertModal @close="closeModal()" @refresh="refresh()" :modal-open="modalOpen"
                :is-edit-mode="isEditMode" :selected-amenty-product="selectedAmenityProduct"
                :categories-id="parseInt(`${reservation_id!}`)" />
        </template>
        <ModalDelete v-if="show" @close="show = false" :isLoading="loadingDelete" />
    </div>
</template>
