<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import {
    deleteAmenityProduct,
    getAmenitiesProductByServiceId,
} from '@/services/api'
import { useI18n } from 'vue-i18n'
import TableComponent from '@/components/tables/TableComponent.vue'
import router from '@/router'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import AmenityProductUpsertModal from '@/components/modal/AmenityProductUpsertModal.vue'
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
const titles = computed(() => [
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
        name: 'status',
        label: t('status'),
        type: 'text',
        filterable: true,
    },
    {
        name: 'price',
        label: t('price'),
        type: 'currency',
        filterable: true,
    },
    {
        name: 'pricingModel',
        label: t('pricing_model'),
        type: 'text',
        filterable: true,
        isTranslatable: true,
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
        label: t('createdAt'),
        type: 'date',
        filterable: false,
    },

    {
        name: 'actions',
        label: t('Actions'),
        type: 'action',
        actions: [
            {
                name: 'View',
                event: 'view',
                icone: ` <svg class="h-6 w-6 text-primary"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>`,
            },
            {
                name: 'Edit',
                event: 'edit',
                icone: ` <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>`,
            },
            {
                name: 'Delete',
                event: 'delete',
                icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
            },
        ],
    },
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
            <TableComponent :items="titles" :datas="usersWithRoleLabels" :filterable="true" :pagination="true"
                :loading="loading" :showHeader="true" :searchable="false" :title="$t('amenityProduct.products')"
                :pageSize="15" :showButtonAllElement="true" @edit="onEditAmenityProduct"
                @delete="onDeleteAmenityProduct" @view="onView" class="modern-table">

                <template v-slot:headerActions>
                    <!-- Add AmenityProduct Button -->
                    <button @click="OpenModal"
                        class="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        {{ t('amenityProduct.addProduct') }}
                    </button>
                </template>
            </TableComponent>
        </div>
        <template v-if="modalOpen && hotelServiceId">
            <AmenityProductUpsertModal @close="closeModal()" @refresh="refresh()" :modal-open="modalOpen"
                :is-edit-mode="isEditMode" :selected-amenty-product="selectedAmenityProduct"
                :categories-id="parseInt(`${hotelServiceId!}`)" />
        </template>
        <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
    </div>
</template>
