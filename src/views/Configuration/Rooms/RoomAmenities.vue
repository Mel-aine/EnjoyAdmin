<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('roomAmenities') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('roomAmenitiesDescription') }}
        </p>
      </div>

      <!-- Amenities Table using ReusableTable -->
      <ReusableTable :title="t('amenitiesList')" :columns="columns" :data="amenities" :actions="actions"
        :search-placeholder="t('searchAmenities')" :selectable="true" :empty-state-title="t('noAmenitiesFound')"
        :empty-state-message="t('getStartedByAdding')" @selection-change="onSelectionChange"
        @action="onAction" :loading="loading">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addAmenity')" :icon="Plus">
          </BasicButton>
          <BasicButton 
            v-if="selectedAmenities.length > 0" 
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')" 
            :icon="Trash2"
          />
        </template>

        <!-- Custom column for created/modified info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.createdAt }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? t('addNewAmenity') : t('editAmenity') }}
          </h3>

          <form @submit.prevent="saveAmenity" class="space-y-4">
            <Input
              :lb="t('amenityNameRequired')"
              :placeholder="t('enterAmenityName')"
              :is-required="true"
              v-model="formData.name"
              input-type="text"
              class="w-full"
            />

            <Select
              :lb="t('amenityTypeRequired')"
              :is-required="true"
              v-model="formData.type"
              :placeholder="t('selectOption')"
              :options="[
                { value: 'Room', label: t('room') },
                { value: 'Hotel', label: t('hotel') },
                { value: 'Both', label: t('both') }
              ]"
              class="w-full"
            />

            <Input
              :lb="t('sortKey')"
              :placeholder="t('enterSortOrder')"
              v-model.number="formData.sortKey"
              input-type="number"
              :min="0"
              class="w-full"
            />

            <Select
              :lb="t('status')"
              v-model="formData.status"
              :options="[
                { value: 'Available', label: t('available') },
              ]"
              class="w-full"
            />

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal" 
                :label="t('cancel')" 
                :disabled="isLoading"
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :label="isLoading ? t('saving') + '...' : showAddModal ? t('addAmenity') : t('update')"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Single Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('Delete Amenities')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleAmenity"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('Delete Selected Amenities')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteAmenities"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Edit, Trash2, X } from 'lucide-vue-next'
import Input from '@/components/forms/FormElements/Input.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { getAmenities, postAmenity, updateAmenity, deleteAmenity as deleteAmenityAPI } from '../../../services/configrationApi'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { useI18n } from 'vue-i18n'

const serviceStore = useServiceStore()
const { t } = useI18n()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedAmenities = ref([])
const editingAmenity = ref(null)
const isLoading = ref(false)
const loading = ref(false)
const toast = useToast()

// Delete related reactive data - MODIFIÉ
const amenityToDelete = ref(null)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false) // NOUVEAU - modal séparée pour la suppression multiple
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false) // NOUVEAU - loading séparé pour la suppression multiple

// Form data
const formData = ref({
  name: '',
  type: '',
  sortKey: 0,
  status: 'Available'
})

// Table configuration
const columns = ref([
  {
    key: 'amenityName',
    label: t('amenityName'),
    sortable: true,
    searchable: true
  },
  {
    key: 'amenityType',
    label: t('amenityType'),
    sortable: true
  },
  {
    key: 'sortKey',
    label: t('sortKey'),
    sortable: true
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    sortable: false,
    type: 'custom'
  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    sortable: false,
    type: 'custom'
  },
  {
    key: 'status',
    label: t('status'),
    sortable: true,
    component: 'badge'
  }
])

// Computed properties
const selectedCount = computed(() => selectedAmenities.value.length)

const editAmenity = (amenity) => {
  editingAmenity.value = amenity
  console.log('data', amenity)
  formData.value = {
    name: amenity.amenityName,
    type: amenity.amenityType,
    sortKey: amenity.sortKey,
    status: amenity.status
  }
  showEditModal.value = true
}

// Single item delete - MODIFIÉ
const handleDeleteAmenity = (amenity) => {
  amenityToDelete.value = amenity
  showDeleteModal.value = true
}

// Bulk delete - MODIFIÉ
const handleDeleteSelected = () => {
  if (selectedAmenities.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmDeleteSingleAmenity = async () => {
  if (!amenityToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteAmenityAPI(amenityToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      // Mettre à jour la liste localement
      const index = amenities.value.findIndex(a => a.id === amenityToDelete.value.id)
      if (index !== -1) {
        amenities.value.splice(index, 1)
      }
      toast.success(t('amenityDeletedSuccess'))
    } else {
      throw new Error('Failed to delete amenity')
    }
  } catch (error) {
    console.error('Error deleting amenity:', error)
    toast.error(t('errorDeletingAmenity'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const confirmBulkDeleteAmenities = async () => {
  if (selectedAmenities.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedAmenities.value.map(amenity => 
      deleteAmenityAPI(amenity.id)
    )
    await Promise.all(deletePromises)
    
    // Mettre à jour la liste localement
    const selectedIds = selectedAmenities.value.map(a => a.id)
    amenities.value = amenities.value.filter(a => !selectedIds.includes(a.id))
    
    const count = selectedAmenities.value.length
    selectedAmenities.value = []
    toast.success(t('amenitiesDeletedSuccess', { count }))
  } catch (error) {
    console.error('Error deleting amenities:', error)
    toast.error(t('errorDeletingSelectedAmenities'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

// Close methods - MODIFIÉ
const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  amenityToDelete.value = null
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Message methods - MODIFIÉ
const getSingleDeleteMessage = () => {
  if (!amenityToDelete.value) return ''
  const amenityName = amenityToDelete.value.amenityName
  return `Are you sure you want to delete "${amenityName}"? `
}

const getBulkDeleteMessage = () => {
  const count = selectedAmenities.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const amenityName = selectedAmenities.value[0].amenityName
    return `Are you sure you want to delete the selected amenity "${amenityName}"?`
  } else {
    return `Are you sure you want to delete ${count} selected amenities?`
  }
}

const actions = ref([
  {
    label: t('edit'),
    icon: Edit,
    variant: 'primary',
    handler: (item) => onAction('edit', item)
  },
  {
    label: t('delete'),
    icon: Trash2,
    variant: 'danger',
    handler: (item) => onAction('delete', item)
  }
])

// Reactive data
const amenities = ref([])

// Methods
const onSelectionChange = (selection) => {
  selectedAmenities.value = selection
}

const onAction = (action, item) => {
  if (action === 'edit') {
    editAmenity(item)
  } else if (action === 'delete') {
    handleDeleteAmenity(item)
  }
}

const saveAmenity = async () => {
  try {
    isLoading.value = true;
    
    if (showAddModal.value) {
      // Add new amenity
      const newAmenity = {
        amenityName: formData.value.name,
        amenityType: formData.value.type,
        sortKey: formData.value.sortKey,
        status: formData.value.status,
        hotelId: serviceStore.serviceId
      }
      const resp = await postAmenity(newAmenity);
      console.log(resp);
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('amenityAddedSuccess'));
        loadData();
      } else {
        toast.error(t('somethingWentWrong'))
      }
      amenities.value.push(newAmenity)
    } else if (editingAmenity.value) {
      // Update existing amenity
      const updatedAmenity = {
        amenityName: formData.value.name,
        amenityType: formData.value.type,
        sortKey: formData.value.sortKey,
        status: formData.value.status,
        hotelId: serviceStore.serviceId
      };
      
      const resp = await updateAmenity(editingAmenity.value.id, updatedAmenity);
      
      if (resp.status === 200 || resp.status === 201) {
        // Mettre à jour localement l'élément modifié
        const index = amenities.value.findIndex(a => a.id === editingAmenity.value.id);
        if (index !== -1) {
          amenities.value[index] = {
            ...amenities.value[index],
            ...updatedAmenity,
            amenityName: updatedAmenity.amenityName,
            amenityType: updatedAmenity.amenityType
          };
        }
        toast.success(t('amenityUpdatedSuccess'));
      } else {
        throw new Error('Failed to update amenity');
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error saving amenity:', error);
    toast.error(t('errorSavingAmenity'));
  } finally {
    isLoading.value = false;
  }
}

const loadData = async () => {
  loading.value = true;
  try {
    const response = await getAmenities();
    console.log(response);
    if (response.status === 200) {
      amenities.value = response.data.data.data.map((item)=>{
        return {
          ...item,
        }
      });
    } else {
      toast.error(t('failedToLoadAmenities'));
    }
  } catch (error) {
    console.error('Error loading amenities:', error);
    toast.error(t('errorLoadingAmenities'));
  }
  finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingAmenity.value = null
  formData.value = {
    name: '',
    type: '',
    sortKey: 0,
    status: 'Available'
  }
}

loadData();
</script>