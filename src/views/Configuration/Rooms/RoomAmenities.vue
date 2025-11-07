<template>
  <ConfigurationLayout>
    <div class="p-6">


      <!-- Amenities Table using ReusableTable -->
      <ReusableTable :title="t('amenitiesList')" :columns="columns" :data="amenities" :actions="actions"
        :search-placeholder="t('searchAmenities')" :selectable="false" :empty-state-title="t('noAmenitiesFound')"
        :empty-state-message="t('getStartedByAdding')" @selection-change="onSelectionChange" @page-change="handlePageChange" :meta="paginationMeta"
        @action="onAction" :loading="loading">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addAmenity')" :icon="Plus">
          </BasicButton>
          <button v-if="selectedAmenities.length > 0" @click="deleteSelected"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
            <Trash2 class="w-4 h-4" />
            <span>{{ t('deleteSelected') }} ({{ selectedAmenities.length }})</span>
          </button>
        </template>

        <!-- Custom column for created/modified info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.createdByUser.firstName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.createdAt )}}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.updatedByUser.firstName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 dark:border-gray-700 border rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
                :label="isLoading ? t('saving') + '...' : showAddModal ? t('addAmenities') : t('update')"
                :loading="isLoading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Edit, Trash2, X } from 'lucide-vue-next'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { getAmenities, postAmenity, updateAmenity, deleteAmenity as deleteAmenityAPI } from '../../../services/configrationApi'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { useI18n } from 'vue-i18n'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

const serviceStore = useServiceStore()
const { t } = useI18n()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedAmenities = ref([])
const editingAmenity = ref(null)
const isLoading = ref(false)
const loading =ref(false);
const toast = useToast();
const paginationMeta = ref({})
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
const editAmenity = (amenity) => {
  editingAmenity.value = amenity
  console.log('data',amenity)
  formData.value = {
    name: amenity.amenityName,
    type: amenity.amenityType,
    sortKey: amenity.sortKey,
    status: amenity.status
  }
  showEditModal.value = true
}

const handleDeleteAmenity = async (id) => {
  if (confirm(t('confirmDeleteAmenity'))) {
    try {
      const response = await deleteAmenityAPI(id);
      if (response.status === 200 || response.status === 204) {
        loadData(1);
        toast.success(t('amenityDeletedSuccess'));
      } else {
        toast.error(t('failedToDeleteAmenity'));
      }
    } catch (error) {
      console.error('Error deleting amenity:', error);
      toast.error(t('errorDeletingAmenity'));
    }
  }
}
const actions = ref([
  {
    label: t('edit'),
    icon: 'edit',
    variant: 'primary',
    handler: (item)=>editAmenity(item)
  },
  {
    label: t('delete'),
    icon: 'delete',
    variant: 'danger',
    handler: (item)=>handleDeleteAmenity(item.id)
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
    handleDeleteAmenity(item.id)
  }
}



const deleteSelected = async () => {
  const count = selectedAmenities.value.length;
  if (confirm(t('confirmDeleteSelected', { count }))) {
    try {
      const deletePromises = selectedAmenities.value.map(id => deleteAmenityAPI(id));
      await Promise.all(deletePromises);
      loadData(1);
      selectedAmenities.value = [];
      toast.success(t('amenitiesDeletedSuccess', { count }));
    } catch (error) {
      console.error('Error deleting amenities:', error);
      toast.error(t('errorDeletingSelectedAmenities'));
    }
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
        loadData(1);
      } else {
        toast.error(t('somethingWentWrong'))
      }
      amenities.value.push(newAmenity)
    } else {
      // Update existing amenity
      const index = amenities.value.findIndex(amenity => amenity.id === editingAmenity.value.id)
      if (index !== -1) {
        const amenity = {
          name: formData.value.name,
          type: formData.value.type,
          sortKey: formData.value.sortKey,
          status: formData.value.status
        }
        const resp = await updateAmenity(editingAmenity.value.id, amenity);
        console.log(resp);
        if (resp.status === 200 || resp.status === 201) {
          loadData(1);
          toast.success(t('amenityUpdatedSuccess'))
        } else {
          toast.error(t('somethingWentWrong'))
        }
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
const loadData = async (pageNumber=1) => {
  loading.value = true;
  try {
    const response = await getAmenities({page:pageNumber,limit:10});
    console.log(response);
    if (response.status === 200) {
      amenities.value = response.data.data.data.map((item)=>{
        return {
          ...item,
        }
      });
      paginationMeta.value = response.data.data.meta
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

const handlePageChange = (newPage) =>{
  loadData(newPage)
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
loadData(1);
</script>
