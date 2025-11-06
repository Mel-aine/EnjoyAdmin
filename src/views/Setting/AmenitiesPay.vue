<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import {
    deleteAmenityCategory,
    getAmenitiesByServiceId,
    getEmployeesForService,
} from '@/services/api'
import { useI18n } from 'vue-i18n'
import TableComponent from '@/components/tables/TableComponent.vue'
import router from '@/router'
import AmenitiesUpsertModal from '@/components/modal/AmenitiesUpsertModal.vue'
import { defineAsyncComponent } from 'vue'
const ModalDelete = defineAsyncComponent(() => import('@/components/modal/ModalDelete.vue'))
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
const isLoading = ref(false)
const loadingDelete = ref(false)
const loading = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const selectedAmenitiesServiceId = ref<number | null>(null)
const show = ref(false)
const modalOpen = ref(false)
const amenitiesServices = ref<any[]>([])
const selectedAmenitiesService = ref<any>(null)
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
        const response = await getAmenitiesByServiceId(serviceId)
        console.log('response', response)
        amenitiesServices.value = response.data
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
        name: 'sourceType',
        label: t('source_type'),
        type: 'url',
        event: 'view',
        filterable: true,
    },

    {
        name: 'externalSystemId',
        label: t('externalReferenceCode'),
        type: 'text',
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
    amenitiesServices.value.map((amenitiesService: any) => {
        return {
            ...amenitiesService,
        }
    }),
)

const onEditAmenitiesService = (se: any) => handleAmenitiesServiceAction('edit', se)
const onDeleteAmenitiesService = (se: any) => handleAmenitiesServiceAction('delete', se)
const onView = (se: any) => handleAmenitiesServiceAction('view', se)

const handleAmenitiesServiceAction = (action: string, se: any) => {
    if (action === 'edit') {
        selectedAmenitiesService.value = se
        isEditMode.value = true
        modalOpen.value = true
    } else if (action === 'delete') {
        selectedAmenitiesServiceId.value = se.id
        show.value = true
    } else if (action === 'view') {
        selectedAmenitiesService.value = se;
        router.push({ name: "amenitiesView", params: { id: se.id } })
    }
}
const confirmDelete = async () => {
    if (selectedAmenitiesServiceId.value !== null) {
        loadingDelete.value = true
        try {
            await deleteAmenityCategory(selectedAmenitiesServiceId.value)
            toast.success(t('toast.userDeleted'))
            amenitiesServices.value = amenitiesServices.value.filter((r: any) => r.id !== selectedAmenitiesServiceId.value)
            console.log(`Suppression du user ID: ${selectedAmenitiesServiceId.value}`)
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
            toast.error(t('toast.userDeleteError'))
        } finally {
            loadingDelete.value = false
            show.value = false
            selectedAmenitiesServiceId.value = null
        }
    }
}

const closeModal = () => {
    modalOpen.value = false
    isEditMode.value = false
}

const OpenModal = () => {
    modalOpen.value = true
    isEditMode.value = false
}
</script>

<template>
    <AdminLayout>
        <FullScreenLayout>
            <div class="space-y-6">
                <div class="flex items-center justify-between mb-5 space-x-4">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900">{{ $t('AmenitiesPay.title') }}</h2>
                        <p class="text-gray-600 mt-1">{{ $t('AmenitiesPay.subtitle') }}</p>
                    </div>
                </div>

                <div class="space-y-4">
                    <TableComponent :items="titles" :datas="usersWithRoleLabels" :filterable="true" :pagination="true"
                        :loading="loading" :showHeader="true" :searchable="false" :title="$t('AmenitiesPay.services')"
                        :pageSize="15" :showButtonAllElement="true" @edit="onEditAmenitiesService"
                        @delete="onDeleteAmenitiesService" @view="onView" class="modern-table">

                        <template v-slot:headerActions>
                            <!-- Add AmenitiesService Button -->
                            <button @click="OpenModal"
                                class="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                {{ t('AmenitiesPay.addService') }}
                            </button>
                        </template>
                    </TableComponent>
                </div>
                <template v-if="modalOpen">
                    <AmenitiesUpsertModal @close="closeModal()" @refresh="refresh()" :modal-open="modalOpen"
                        :is-edit-mode="isEditMode" :selected-amenties-catgory="selectedAmenitiesService" />
                </template>
                <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
            </div>
        </FullScreenLayout>
    </AdminLayout>
</template>
