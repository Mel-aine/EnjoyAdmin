<template>
  <ConfigurationLayout>
    <div class="p-6">


      <!-- Sort Room Types Table using ReusableTable -->
      <ReusableTable
        :title="t('roomTypeSorting')"
        :columns="columns"
        :data="roomTypes"
        :search-placeholder="t('searchRoomTypes')"
        :selectable="false"
        :empty-state-title="t('noRoomTypesFound')"
        :empty-state-message="t('createRoomTypesFirst')"
        @action="onAction"
        :loading="loading"
        @page-change="handlePageChange"
        :meta="paginationMeta"
      >
        <template #header-actions>
          <BasicButton
            @click="saveOrder"
            :label="saving ? t('saving') : t('saveOrder')"
            :icon="Save"
            :disabled="!canSave"
            :loading="saving"
          >
          </BasicButton>
        </template>

        <!-- Custom column for sort order input -->
        <template #column-sortOrder="{ item }">
          <Input
            v-model.number="item.sortOrder"
            input-type="number"
            :min="1"
            class="w-16 text-center"
            :custom-class="'px-2 py-1 text-center'"
            @input="updateSortOrder(item)"
            @blur="saveOrderChange(item)"
            @keyup.enter="$event.target.blur()"
            :title="t('clickToEditSortOrder')"
          />
        </template>

        <template #column-roomType="{ item }">
          <div class="flex items-center space-x-3">
            <div
              class="w-4 h-4 rounded-full border-2 border-gray-300"
              :style="{ backgroundColor: item.color }"
            ></div>
            <span class="font-medium">{{ item.roomTypeName }}</span>
          </div>
        </template>

        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.fullName }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.fullName }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Edit Sort Order Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ t('editSortOrder') }}
          </h3>

          <form @submit.prevent="saveSortOrder" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('roomType') }}
              </label>
              <Input
                :model-value="editingRoomType?.roomType"
                input-type="text"
                disabled
                class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('sortOrder') }} *
              </label>
              <Input
                v-model.number="formData.sortOrder"
                input-type="number"
                :min="1"
                :is-required="true"
                :placeholder="t('enterSortOrder')"
              />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton
                type="button"
                variant="outline"
                @click="closeModal"
                :label="t('cancel')"
                :disabled="saving"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :label="saving ? t('saving') + '...' : t('updateOrder')"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Save, Edit } from 'lucide-vue-next'
import Input from '@/components/forms/FormElements/Input.vue'
import { getRoomTypes, updateRoomTypeSortOrder } from '../../../services/configrationApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

const toast = useToast()
const { t } = useI18n()

// Reactive data
const showEditModal = ref(false)
const editingRoomType = ref(null)
const loading = ref(false)
const saving = ref(false)
const originalSortOrders = ref({})
const hasChanges = ref(false)
const paginationMeta = ref({})

// Form data
const formData = ref({
  sortOrder: 1
})

// Table configuration
const columns = ref([
  {
    key: 'sortOrder',
    label: t('sortOrder'),
    sortable: true,
    width: '100px',
    type:'custom'
  },
  {
    key: 'shortCode',
    label: t('shortCode'),
    sortable: true,
    searchable: true
  },
  {
    key: 'roomTypeName',
    label: t('roomType'),
    sortable: true,
    searchable: true
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    sortable: false,
    type:'custom'
  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    sortable: false,
    type:'custom'
  }
])


// Sample data with sort orders
const roomTypes = ref([])

// Computed property to check if save button should be enabled
const canSave = computed(() => hasChanges.value && !saving.value)

// Methods
const updateSortOrder = (item) => {
  checkForChanges()
}

const saveOrderChange = (item) => {
  // Optional: Auto-save individual changes
  checkForChanges()
}

const checkForChanges = () => {
  hasChanges.value = roomTypes.value.some(item =>
    originalSortOrders.value[item.id] !== item.sortOrder
  )
}

const saveOrder = async () => {
  if (!hasChanges.value) {
    toast.info(t('noChangesToSave'))
    return
  }

  saving.value = true
  try {
    // Sort the array by sort order and reassign
    roomTypes.value.sort((a, b) => a.sortOrder - b.sortOrder)

    // Here you would typically make an API call to save the order
    // await updateRoomTypesOrder(roomTypes.value)
    const sortedRoomTypeChange = roomTypes.value.map(item => ({
      id: item.id,
      sortOrder: item.sortOrder
    }))
    console.log(sortedRoomTypeChange)
    // Simulate API call
    await updateRoomTypeSortOrder(sortedRoomTypeChange)

    // Update original sort orders after successful save
    roomTypes.value.forEach(item => {
      originalSortOrders.value[item.id] = item.sortOrder
    })

    hasChanges.value = false
    toast.success(t('roomTypeOrderSavedSuccess'))
  } catch (error) {
    console.error('Error saving room type order:', error)
    toast.error(t('errorSavingRoomTypeOrder'))
  } finally {
    saving.value = false
  }
}

const onAction = (action, item) => {
  if (action === 'edit') {
    editRoomType(item)
  }
}

const editRoomType = (roomType) => {
  editingRoomType.value = roomType
  formData.value.sortOrder = roomType.sortOrder
  showEditModal.value = true
}

const saveSortOrder = async () => {
  if (editingRoomType.value) {
    editingRoomType.value.sortOrder = formData.value.sortOrder
    originalSortOrders.value[editingRoomType.value.id] = formData.value.sortOrder
    checkForChanges()
    closeModal()
    toast.success(t('sortOrderUpdatedSuccess'))
  }
}

const closeModal = () => {
  showEditModal.value = false
  editingRoomType.value = null
  formData.value.sortOrder = 1
}

const loadData = async (pageNumber=1) => {
  loading.value = true
  try {
    const resp = await getRoomTypes({page:pageNumber,limit:10})
    console.log('this is the data', resp)
    roomTypes.value = resp.data.data.data
    paginationMeta.value = resp.data.data.meta

    // Store original sort orders for change tracking
    roomTypes.value.forEach(item => {
      originalSortOrders.value[item.id] = item.sortOrder
    })

    hasChanges.value = false
  } catch (error) {
    console.error('Error loading room types:', error)
    toast.error(t('errorLoadingRoomTypes'))
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage)=>{
  loadData(newPage)
}

onMounted(() => {
  loadData(1)
})
</script>
