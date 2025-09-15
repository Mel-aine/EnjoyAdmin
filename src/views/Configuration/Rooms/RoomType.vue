<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ t('roomType') }}</h1>
        <p class="text-gray-600">
          {{ t('roomTypeDescription') }}
        </p>
      </div>

      <!-- Room Types Table using ReusableTable -->
      <ReusableTable :title="t('roomTypeList')" :columns="columns" :data="roomTypes" :actions="actions"
        :search-placeholder="t('searchRoomTypes')" :empty-state-title="t('noRoomTypesFound')"
        :empty-state-message="t('getStartedByAddingRoomType')" @action="onAction"
        :loading="loading">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="t('addRoomType')" :icon="Plus">
          </BasicButton>

        </template>

        <!-- Custom column for capacity info -->
        <template #column-capacityInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.baseAdult }}/{{ item.baseChild }}</div>
            <div class="text-xs text-gray-400">Base A/C</div>
          </div>
        </template>

        <template #column-maxCapacityInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.maxAdult }}/{{ item.maxChild }}</div>
            <div class="text-xs text-gray-400">Max A/C</div>
          </div>
        </template>

        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.createdAt }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Delete Confirmation Modal -->
      <ModalConfirmation v-if="showDeleteConfirmation" action="DANGER" :title="t('confirmDeleteTitle')"
        :message="t('confirmDeleteRoomType', { name: roomTypeToDelete?.roomTypeName || roomTypeToDelete?.shortCode })"
        :isLoading="isDeletingLoading" @close="showDeleteConfirmation = false; roomTypeToDelete = null"
        @confirm="confirmDeleteRoomType" />

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? t('addRoomType') : t('editRoomType') }}
          </h3>

          <form @submit.prevent="saveRoomType" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('shortCodeRequired') }}
                </label>
                <input v-model="formData.shortCode" type="text" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('shortCodePlaceholder')">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('roomTypeNameRequired') }}
                </label>
                <input v-model="formData.roomTypeName" type="text" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('roomTypeNamePlaceholder')">
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('baseAdultRequired') }}
                </label>
                <input v-model.number="formData.baseAdult" type="number" min="1" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('baseChild') }}
                </label>
                <input v-model.number="formData.baseChild" type="number" min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('maxAdultRequired') }}
                </label>
                <input v-model.number="formData.maxAdult" type="number" min="1" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('maxChild') }}
                </label>
                <input v-model.number="formData.maxChild" type="number" min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="flex items-center space-x-2">
                  <input v-model="formData.publishToWebsite" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                  <span class="text-sm font-medium text-gray-700">{{ t('publishToWebsite') }}</span>
                </label>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('defaultWebInventory') }}
                </label>
                <input v-model.number="formData.defaultWebInventory" type="number" min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('numberOfRooms')">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('color') }}
              </label>
              <input v-model="formData.color" type="color"
                class="w-20 h-10 border border-gray-300 rounded-md cursor-pointer">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('selectRoomAmenities') }}
              </label>
              <div class="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label v-for="amenity in availableAmenities" :key="amenity.id" class="flex items-center space-x-2">
                    <input v-model="formData.roomAmenities" :value="amenity.id" type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">{{ amenity.amenityName }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                {{ t('cancel') }}
              </button>
              <button type="submit" :disabled="isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <span>{{ showAddModal ? t('save') : t('update') }}</span>
              </button>
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
import { getAmenities, getRoomTypes, postRoomType, updateRoomTypeById, deleteRoomType as deleteRoomTypeApi } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

const { t } = useI18n()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRoomType = ref(null)
const loading = ref(false)
const isLoading = ref(false)
const showDeleteConfirmation = ref(false)
const roomTypeToDelete = ref(null)
const isDeletingLoading = ref(false)

// Form data
const formData = ref({
  shortCode: '',
  roomTypeName: '',
  baseAdult: 2,
  baseChild: 0,
  maxAdult: 2,
  maxChild: 0,
  publishToWebsite: true,
  roomAmenities: [],
  color: '#3B82F6',
  defaultWebInventory: 0
})
const serviceStore = useServiceStore()
const toast = useToast();

// Available amenities (from Room Amenities)
const availableAmenities = ref([
])

// Table configuration
const columns = ref([
  {
    key: 'shortCode',
    label: t('shortCode'),
    sortable: true,
    searchable: true
  },
  {
    key: 'roomTypeName',
    label: t('roomTypeName'),
    sortable: true,
    searchable: true
  },
  {
    key: 'capacityInfo',
    label: t('baseCapacity'),
    sortable: false,

    type: "custom"
  },
  {
    key: 'maxCapacityInfo',
    label: t('maxCapacity'),
    sortable: false,
    type: "custom"
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    sortable: false,
    type: "custom"


  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    sortable: false,
    type: "custom"
  },
  {
    key: 'status',
    label: t('status'),
    sortable: true,
    component: 'badge'
  }
])

const actions = ref([
  {
    label: t('edit'),
    icon: 'edit',
    variant: 'primary',
    handler: (item) => onAction('edit', item)
  },
  {
    label: t('delete'),
    icon: 'delete',
    variant: 'danger',
    handler: (item) => onAction('delete', item)
  }
])

// Sample data
const roomTypes = ref([])

// Methods


const onAction = (action, item) => {
  if (action === 'edit') {
    editRoomType(item)
  } else if (action === 'delete') {
    deleteRoomType(item)
  }
}

const editRoomType = (roomType) => {
  editingRoomType.value = roomType
  formData.value = {
    shortCode: roomType.shortCode,
    roomTypeName: roomType.roomTypeName,
    baseAdult: roomType.baseAdult,
    baseChild: roomType.baseChild,
    maxAdult: roomType.maxAdult,
    maxChild: roomType.maxChild,
    publishToWebsite: roomType.publishToWebsite,
    roomAmenities: roomType.roomAmenities && roomType.roomAmenities.length > 0 ? [...roomType.roomAmenities] : [],
    color: roomType.color,
    defaultWebInventory: roomType.defaultWebInventory
  }
  showEditModal.value = true
}

const deleteRoomType = (roomType) => {
  roomTypeToDelete.value = roomType
  showDeleteConfirmation.value = true
}

const confirmDeleteRoomType = async () => {
  if (!roomTypeToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteRoomTypeApi(roomTypeToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      roomTypes.value = roomTypes.value.filter(rt => rt.id !== roomTypeToDelete.value.id)
      toast.success(t('roomTypeDeletedSuccessfully'))
    } else {
      toast.error(t('errorDeletingRoomType'))
    }
  } catch (error) {
    console.error('Error deleting room type:', error)
    toast.error(t('errorDeletingRoomType'))
  } finally {
    isDeletingLoading.value = false
    showDeleteConfirmation.value = false
    roomTypeToDelete.value = null
  }
}



const saveRoomType = async () => {
  try {
    isLoading.value = true
    if (showAddModal.value) {
      // Add new room type
      const newRoomType = {
        hotelId: serviceStore.serviceId,
        shortCode: formData.value.shortCode,
        roomTypeName: formData.value.roomTypeName,
        baseAdult: formData.value.baseAdult,
        baseChild: formData.value.baseChild,
        maxAdult: formData.value.maxAdult,
        maxChild: formData.value.maxChild,
        publishToWebsite: formData.value.publishToWebsite,
        roomAmenities: [...formData.value.roomAmenities],
        color: formData.value.color,
        defaultWebInventory: formData.value.defaultWebInventory,
        //status: 'Available'
      }
      const resp = await postRoomType(newRoomType);
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('roomTypeAddedSuccess'))
        loadData();
        closeModal()
      } else {
        toast.error(t('somethingWentWrong'))
        console.error('Error adding room type:', resp);
        return;
      }

    } else {
      // Update existing room type
      const index = roomTypes.value.findIndex(roomType => roomType.id === editingRoomType.value.id)
      if (index !== -1) {
        const updatedRoomType = {
          shortCode: formData.value.shortCode,
          roomTypeName: formData.value.roomTypeName,
          baseAdult: formData.value.baseAdult,
          baseChild: formData.value.baseChild,
          maxAdult: formData.value.maxAdult,
          maxChild: formData.value.maxChild,
          publishToWebsite: formData.value.publishToWebsite,
          roomAmenities: [...formData.value.roomAmenities],
          color: formData.value.color,
        }
        const resp = await updateRoomTypeById(editingRoomType.value.id, updatedRoomType);
        if (resp.status === 200 || resp.status === 201) {
          toast.success(t('roomTypeUpdatedSuccess'))
          loadData();
          closeModal();
        } else {
          toast.error(t('somethingWentWrong'))
          console.error('Error updating room type:', resp);
          return;
        }
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error saving room type:', error)
    toast.error(t('somethingWentWrong'))
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoomType.value = null
  formData.value = {
    shortCode: '',
    roomTypeName: '',
    baseAdult: 2,
    baseChild: 0,
    maxAdult: 2,
    maxChild: 0,
    publishToWebsite: true,
    roomAmenities: [],
    color: '#3B82F6',
    defaultWebInventory: 0
  }
}

const loadData = async () => {
  loading.value = true;
  try {
    const resp = await getRoomTypes();
    console.log('this is the data', resp)
    roomTypes.value = resp.data.data.data;
  } catch (error) {
    console.error('Error loading room types:', error);
    toast.error(t('errorLoadingRoomTypes'));
  } finally {
    loading.value = false;
  }
}

const loadAmenities = async () => {
  const resp = await getAmenities();
  availableAmenities.value = resp.data.data.data;
}

loadData();
loadAmenities();
</script>