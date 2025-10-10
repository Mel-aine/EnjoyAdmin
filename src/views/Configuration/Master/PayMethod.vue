<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('paymentMethods') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('paymentMethodsDescription') }}
        </p>
      </div>

      <!-- Payment Methods Table using ReusableTable -->
      <ReusableTable 
        :title="t('paymentMethodsList')" 
        :columns="columns" 
        :data="payMethods" 
        :actions="actions"
        :loading="loading"
        @action="onAction" 
        @selection-change="onSelectionChange"
        :search-placeholder="t('searchPaymentMethods')" 
        :selectable="true"
        :empty-state-title="t('noPaymentMethodsFound')"
        :empty-state-message="t('addPaymentMethodMessage')"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            :label="t('addPaymentMethod')"
            :icon="Plus"
          />

          <BasicButton 
            v-if="selectedPaymentMethods.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')"
            :icon="Trash2"
          />
        </template>

        <!-- Custom column for card processing -->
        <template #column-cardProcessing="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.cardProcessing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ item.cardProcessing ? t('yes') : t('no') }}
          </span>
        </template>

        <!-- Custom column for status -->
        <template #column-status="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ item.status }}
          </span>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName || 'System' }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName || 'System' }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('editPaymentMethod') : t('addPaymentMethod') }}
          </h3>

          <form @submit.prevent="savePayMethod">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('shortCode') }}<span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.shortCode" 
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('enterShortCode')"
                >
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('paymentMethodName') }}<span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('enterPaymentMethodName')"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('paymentType') }}<span class="text-red-500">*</span>
                </label>
                <select v-model="formData.type" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">{{ t('selectPaymentType') }}</option>
                  <option value="CASH">{{ t('cash') }}</option>
                  <option value="BANK">{{ t('bank') }}</option>
                </select>
              </div>

              <div class="mb-4 flex items-center">
                <label class="flex items-center">
                  <input v-model="formData.cardProcessing" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="ml-2 text-sm text-gray-700">{{ t('cardProcessing') }}</span>
                </label>
              </div>
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input v-model="formData.surchargeSetting" type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="ml-2 text-sm text-gray-700">{{ t('surchargeSetting') }}</span>
              </label>
            </div>

            <div v-if="formData.surchargeSetting" class="border border-gray-200 rounded-md p-4 mb-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">{{ t('surchargeConfiguration') }}</h4>

              <div class="grid grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('surchargeType') }}
                  </label>
                  <select v-model="formData.surchargeType"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="amount">{{ t('amount') }}</option>
                    <option value="percent">{{ t('percentage') }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('surchargeValue') }}
                  </label>
                  <input 
                    v-model="formData.surchargeValue" 
                    type="number" 
                    step="0.01"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :placeholder="t('enterSurchargeValue')"
                  >
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('extraCharge') }}
                </label>
                <select v-model="formData.extraCharge"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">{{ t('selectExtraCharge') }}</option>
                  <option value="service_charge">{{ t('serviceCharge') }}</option>
                  <option value="processing_fee">{{ t('processingFee') }}</option>
                  <option value="convenience_fee">{{ t('convenienceFee') }}</option>
                </select>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('receiptNumberSetting') }}
              </label>
              <select v-model="formData.receiptNoSetting"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="auto_general">{{ t('autoGeneral') }}</option>
                <option value="auto_private">{{ t('autoPrivate') }}</option>
                <option value="manual">{{ t('manual') }}</option>
              </select>
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
                :label="saving ? t('saving') + '...' : (showEditModal ? t('update') : t('save'))"
                :loading="saving"
                :disabled="saving"
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
      :title="t('Delete Pay Method')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSinglePaymentMethod"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('Delete Selected Pay Method')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeletePaymentMethods"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import { 
  getPaymentMethods, 
  postPaymentMethod, 
  updatePaymentMethodById, 
  deletePaymentMethodById 
} from '@/services/configrationApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedPaymentMethods = ref<any[]>([])
const editingPaymentMethod = ref<any>(null)
const loading = ref(false)
const saving = ref(false)

// Delete modals states
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const paymentMethodToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Payment methods data
const payMethods = ref<any[]>([])

// Form data
const formData = ref({
  id: null as number | null,
  shortCode: '',
  name: '',
  type: '',
  cardProcessing: false,
  surchargeSetting: false,
  surchargeType: 'amount',
  surchargeValue: '',
  extraCharge: '',
  receiptNoSetting: 'auto_general'
})

// Computed properties
const selectedCount = computed(() => selectedPaymentMethods.value.length)

// Table columns
const columns = computed<Column[]>(() => [
  { 
    key: 'shortCode', 
    label: t('shortCode'), 
    type: 'text',
    sortable: true,
    searchable: true
  },
  { 
    key: 'name', 
    label: t('paymentMethodName'), 
    type: 'text',
    sortable: true,
    searchable: true
  },
  { 
    key: 'type', 
    label: t('paymentType'), 
    type: 'text',
    sortable: true
  },
  { 
    key: 'cardProcessing', 
    label: t('cardProcessing'), 
    type: 'custom' 
  },
  { 
    key: 'createdInfo', 
    label: t('createdBy'), 
    type: 'custom' 
  },
  { 
    key: 'modifiedInfo', 
    label: t('modifiedBy'), 
    type: 'custom' 
  },
  { 
    key: 'status', 
    label: t('status'), 
    type: 'custom' 
  }
])

// Table actions
const actions = computed<Action[]>(() => [
  {
    label: t('edit'),
    icon: Edit,
    variant: 'primary',
    handler: (item: any) => onAction('edit', item)
  },
  {
    label: t('delete'),
    icon: Trash2,
    variant: 'danger',
    handler: (item: any) => onAction('delete', item)
  }
])

// Methods
const onSelectionChange = (selection: any[]) => {
  selectedPaymentMethods.value = selection
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editPaymentMethod(item)
  } else if (action === 'delete') {
    handleDeletePaymentMethod(item)
  }
}

const editPaymentMethod = (paymentMethod: any) => {
  editingPaymentMethod.value = paymentMethod
  formData.value = {
    id: paymentMethod.id,
    shortCode: paymentMethod.shortCode || '',
    name: paymentMethod.name || '',
    type: paymentMethod.type || '',
    cardProcessing: paymentMethod.cardProcessing || false,
    surchargeSetting: paymentMethod.surchargeSetting || false,
    surchargeType: paymentMethod.surchargeType || 'amount',
    surchargeValue: paymentMethod.surchargeValue || '',
    extraCharge: paymentMethod.extraCharge || '',
    receiptNoSetting: paymentMethod.receiptNoSetting || 'auto_general'
  }
  showEditModal.value = true
}

const handleDeletePaymentMethod = (paymentMethod: any) => {
  paymentMethodToDelete.value = paymentMethod
  showDeleteModal.value = true
}

const confirmDeleteSinglePaymentMethod = async () => {
  if (!paymentMethodToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deletePaymentMethodById(paymentMethodToDelete.value.id)
    if (response.status === 200 || response.status === 204) {
      const index = payMethods.value.findIndex(pm => pm.id === paymentMethodToDelete.value.id)
      if (index !== -1) {
        payMethods.value.splice(index, 1)
      }
      toast.success(t('paymentMethodDeletedSuccessfully'))
    } else {
      throw new Error('Failed to delete payment method')
    }
  } catch (error) {
    console.error('Error deleting payment method:', error)
    toast.error(t('errorDeletingPaymentMethod'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const confirmBulkDeletePaymentMethods = async () => {
  if (selectedPaymentMethods.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedPaymentMethods.value.map(pm => 
      deletePaymentMethodById(pm.id)
    )
    await Promise.all(deletePromises)
    
    const selectedIds = selectedPaymentMethods.value.map(pm => pm.id)
    payMethods.value = payMethods.value.filter(pm => !selectedIds.includes(pm.id))
    
    const count = selectedPaymentMethods.value.length
    selectedPaymentMethods.value = []
    toast.success(t('paymentMethodsDeletedSuccess', { count }))
  } catch (error) {
    console.error('Error deleting payment methods:', error)
    toast.error(t('errorDeletingSelectedPaymentMethods'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  paymentMethodToDelete.value = null
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

const getSingleDeleteMessage = () => {
  if (!paymentMethodToDelete.value) return ''
  const paymentMethodName = paymentMethodToDelete.value.name
  return `Are you sure you want to delete payment method "${paymentMethodName}"?`
}

const getBulkDeleteMessage = () => {
  const count = selectedPaymentMethods.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const paymentMethodName = selectedPaymentMethods.value[0].name
    return `Are you sure you want to delete the selected payment method "${paymentMethodName}"?`
  } else {
    return `Are you sure you want to delete ${count} selected payment methods?`
  }
}

const savePayMethod = async () => {
  try {
    saving.value = true
    
    const paymentMethodData = {
      shortCode: formData.value.shortCode.trim(),
      name: formData.value.name.trim(),
      type: formData.value.type,
      cardProcessing: formData.value.cardProcessing,
      surchargeSetting: formData.value.surchargeSetting,
      surchargeType: formData.value.surchargeType,
      surchargeValue: formData.value.surchargeValue,
      extraCharge: formData.value.extraCharge,
      receiptNoSetting: formData.value.receiptNoSetting,
      hotelId: serviceStore.serviceId
    }

    if (showEditModal.value && editingPaymentMethod.value) {
      const resp = await updatePaymentMethodById(editingPaymentMethod.value.id, paymentMethodData)
      if (resp.status === 200 || resp.status === 201) {
        const index = payMethods.value.findIndex(pm => pm.id === editingPaymentMethod.value.id)
        if (index !== -1) {
          payMethods.value[index] = {
            ...payMethods.value[index],
            ...paymentMethodData,
            id: editingPaymentMethod.value.id
          }
        }
        toast.success(t('paymentMethodUpdatedSuccess'))
        closeModal()
      } else {
        throw new Error(resp.data?.message || t('somethingWentWrong'))
      }
    } else {
      const resp = await postPaymentMethod(paymentMethodData)
      if (resp.status === 200 || resp.status === 201) {
        toast.success(t('paymentMethodAddedSuccess'))
        await loadData()
        closeModal()
      } else {
        throw new Error(resp.data?.message || t('somethingWentWrong'))
      }
    }
  } catch (error: any) {
    console.error('Error saving payment method:', error)
    const errorMessage = error.response?.data?.message || error.message || t('somethingWentWrong')
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingPaymentMethod.value = null
  formData.value = {
    id: null,
    shortCode: '',
    name: '',
    type: '',
    cardProcessing: false,
    surchargeSetting: false,
    surchargeType: 'amount',
    surchargeValue: '',
    extraCharge: '',
    receiptNoSetting: 'auto_general'
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const resp = await getPaymentMethods()
    if (resp.status === 200) {
      payMethods.value = resp.data.data.data || []
    } else {
      toast.error(t('errorLoadingPaymentMethods'))
    }
  } catch (error) {
    console.error('Error loading payment methods:', error)
    toast.error(t('errorLoadingPaymentMethods'))
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>