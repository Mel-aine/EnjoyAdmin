<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import {
    deleteAmenityProduct,
    getAmenitiesProductByServiceId,
} from '@/services/api'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import AmenityProductUpsertModal from '@/components/modal/AmenityProductUpsertModal.vue'
// import ReusableTable from '@/components/tables/ReusableTable.vue'
const loadingDelete = ref(false)
const loading = ref(false)
const serviceStore = useServiceStore()
const hotelServiceId = router.currentRoute.value.params.id;
const toast = useToast()
const selectedAmenityProductId = ref<number | null>(null)
const show = ref(false)
const modalOpen = ref(false)
const amenityProducts = ref<any[]>([])
const selectedAmenityProduct = ref<any>(null)
const isEditMode = ref(false)
const { t } = useI18n()

const refresh = () => {
    modalOpen.value = false;
    isEditMode.value = false;
    fetchAmenities();
}
const fetchAmenities = async () => {
    loading.value = true
    try {
        const serviceId = serviceStore.serviceId
        if (!serviceId) throw new Error('Service ID is not defined')
        const response = await getAmenitiesProductByServiceId(serviceId, parseInt(`${hotelServiceId}`)!)
        console.log('response', response)
        amenityProducts.value = response.data
    } catch (error) {
        console.error('fetch failed:', error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    fetchAmenities()
})
const titles = ref([
    {
        key: 'id',
        label: t('ID'),
        type: 'text',

    },
    {
        key: 'name',
        label: t('Name'),
        type: 'text',

    },
    {
        key: 'status',
        label: t('status'),
        type: 'text',

    },
    {
        key: 'price',
        label: t('price'),
        type: 'currency',

    },
    {
        key: 'pricingModel',
        label: t('pricing_model'),
        type: 'text',

    },
    {
        key: 'timeUnit',
        label: t('time_unit'),
        type: 'text',

    },

    {
        key: 'createdAt',
        label: t('createdAt'),
        type: 'date',

    }
])


const usersWithRoleLabels = computed(() =>
    amenityProducts.value.map((amenityProduct: any) => {
        return {
            ...amenityProduct,
        }
    }),
)

const onEditAmenityProduct = (se: any) => handleAmenityProductAction('edit', se)
const onDeleteAmenityProduct = (se: any) => handleAmenityProductAction('delete', se)
const onView = (se: any) => handleAmenityProductAction('view', se)

const handleAmenityProductAction = (action: string, se: any) => {
    if (action === 'edit') {
        selectedAmenityProduct.value = se
        isEditMode.value = true
        modalOpen.value = true
    } else if (action === 'delete') {
        selectedAmenityProductId.value = se.id
        show.value = true
    } else if (action === 'view') {
        selectedAmenityProduct.value = se;
        router.push({ name: "amenitiesView", params: { id: se.id } })
    }
}
const confirmDelete = async () => {
    if (selectedAmenityProductId.value !== null) {
        loadingDelete.value = true
        try {
            await deleteAmenityProduct(selectedAmenityProductId.value)
            toast.success(t('toast.userDeleted'))
            amenityProducts.value = amenityProducts.value.filter((r: any) => r.id !== selectedAmenityProductId.value)
            console.log(`Suppression du user ID: ${selectedAmenityProductId.value}`)
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
            toast.error(t('toast.userDeleteError'))
        } finally {
            loadingDelete.value = false
            show.value = false
            selectedAmenityProductId.value = null
        }
    }
}

const closeModal = () => {
    modalOpen.value = false
    isEditMode.value = false
    selectedAmenityProduct.value = null
}

const OpenModal = () => {
    modalOpen.value = true
    isEditMode.value = false
}
</script>

<template>
    <div class="space-y-6 mt-5 mb-5">

        <div class="space-y-4">
            <!-- <ReusableTable :title="t('roomTypeList')" :columns="titles" :data="usersWithRoleLabels"
              :search-placeholder="t('searchRoomTypes')"
              :loading="loading">
              <template #header-actions>
                <BasicButton :label="t('amenityProduct.addProduct')" >
                </BasicButton>

              </template>
            </ReusableTable> -->
        </div>
        <template v-if="modalOpen && hotelServiceId">
            <AmenityProductUpsertModal @close="closeModal()" @refresh="refresh()" :modal-open="modalOpen"
                :is-edit-mode="isEditMode" :selected-amenty-product="selectedAmenityProduct"
                :categories-id="parseInt(`${hotelServiceId!}`)" />
        </template>
        <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
    </div>
</template>
