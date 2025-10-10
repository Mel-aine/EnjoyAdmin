<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('extraCharges') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('extraChargesDescription') }}
        </p>
      </div>

      <!-- Extra Charges Table using ReusableTable -->
      <ReusableTable 
        :title="t('extraChargesList')" 
        :columns="columns" 
        :data="extraCharges" 
        :actions="actions"
        :search-placeholder="t('searchExtraCharges')" 
        :selectable="true"
        :empty-state-title="t('noExtraChargesFound')"
        :empty-state-message="t('addExtraChargeMessage')"
        @action="onAction"
        @selection-change="onSelectionChange"
        :loading="loading"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            :label="t('addExtraCharge')"
            :icon="Plus"
          />

          <BasicButton 
            v-if="selectedExtraCharges.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')"
            :icon="Trash2"
          />
        </template>

        <!-- Custom column for taxes -->
        <template #column-taxes="{ item }">
          <div class="flex flex-wrap gap-1">
            <span v-for="tax in item.taxRates" :key="tax"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ tax.taxName }}
            </span>
            <span v-if="!item.taxRates || item.taxRates.length === 0"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              {{ t('noTax') }}
            </span>
          </div>
        </template>

        <!-- Custom column for fixed price -->
        <template #column-fixedPrice="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.fixedPrice ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ item.fixedPrice ? t('yes') : t('no') }}
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

      <!-- Pagination -->
      <TablePagination
        v-if="paginationMeta"
        :meta="paginationMeta"
        @page-change="handlePageChange"
      />

      <!-- Add/Edit Modal -->
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('editExtraCharge') : t('addExtraCharge') }}
          </h3>

          <form @submit.prevent="saveExtraCharge">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('shortCode') }}</label>
                <Input
                  v-model="formData.shortCode"
                  :placeholder="t('enterShortCode')"
                  class="w-full"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('name') }}</label>
                <Input
                  v-model="formData.name"
                  :placeholder="t('enterName')"
                  class="w-full"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('rate') }}</label>
                <Input v-model="formData.rate" type="number" step="0.01"
                  required @input="calculateRateInclusiveTax"
                  :placeholder="t('enterRate')" class="w-full" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('tax') }}
                </label>
                <div class="space-y-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                  <label class="flex items-center">
                    <input v-model="formData.taxes" value="0" type="checkbox" @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700">{{ t('noTax') }} (0%)</span>
                  </label>
                  <label class="flex items-center" v-for="tax in taxes" :key="tax.taxRateId">
                    <input v-model="formData.taxes" :value="tax.taxRateId" type="checkbox"
                      @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700">{{ tax.taxName }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('rateInclusiveTax') }}
              </label>
              <input v-model="formData.rateInclusiveTax" type="number" step="0.01" readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="t('rateInclusiveTaxPlaceholder')" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="formData.fixedPrice" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700">{{ t('configuration.extra_charge.fixed_price') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="formData.isMealPlanComponent" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700">Meal Plan Component</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('frontDeskSortKey') }}</label>
                <Input v-model="formData.frontDeskSortKey" type="number" :placeholder="t('enterFrontDeskSortKey')" class="w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="formData.publishOnWeb" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700">{{ t('publishOnWeb') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('voucherNumber') }}
                </label>
                <select v-model="formData.voucherNo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="auto_general">{{ t('autoGeneral') }}</option>
                  <option value="auto_private">{{ t('autoPrivate') }}</option>
                  <option value="manual">{{ t('manual') }}</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('description') }}
              </label>
              <textarea v-model="formData.description" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                :placeholder="t('enterDescription')"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-2">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('chargeAppliesOn') }}
                </label>
                <select v-model="formData.chargeAppliesOn"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="per_quantity">{{ t('perQuantity') }}</option>
                  <option value="per_night">{{ t('perNight') }}</option>
                  <option value="per_stay">{{ t('perStay') }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('applyChargeOn') }}
                </label>
                <select v-model="formData.applyChargeOn"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="only_on_check_in">{{ t('onlyOnCheckIn') }}</option>
                  <option value="daily">{{ t('daily') }}</option>
                  <option value="on_checkout">{{ t('onCheckout') }}</option>
                </select>
              </div>
            </div>

            <div>
              <div class="mb-2">
                <label class="flex items-center">
                  <input v-model="formData.applyChargeAlways" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700">{{ t('applyChargeAlways') }}</span>
                </label>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6" v-if="!formData.applyChargeAlways">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('validFrom') }}</label>
                <InputDatePicker v-model="formData.validFrom" class="w-full" />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('validTo') }}</label>
                <InputDatePicker v-model="formData.validTo" class="w-full" />
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton
                type="button"
                variant="outline"
                @click="closeModal"
                :label="t('cancel')"
                :disabled="isSaving"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :label="isSaving ? t('saving') + '...' : (showEditModal ? t('update') : t('save'))"
                :loading="isSaving"
                :disabled="isSaving"
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
      :title="t('Delete Extra Charge')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleExtraCharge"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('Delete Selected Extra Charge')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteExtraCharges"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import InputDatePicker from '../../../components/forms/FormElements/InputDatePicker.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import TablePagination from '@/components/tables/TablePagination.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import { getExtraCharges, getTaxes, postExtraCharge, updateExtraChargeById, deleteExtraChargeById } from '../../../services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedExtraCharges = ref<any[]>([])
const editingExtraCharge = ref<any>(null)
const loading = ref(false)
const isSaving = ref(false)
const paginationMeta = ref(null)
const taxes = ref<any>([])

// Delete modals states
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const extraChargeToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = reactive({
  shortCode: '',
  name: '',
  rate: 0,
  taxes: [] as string[],
  rateInclusiveTax: 0,
  fixedPrice: false,
  isMealPlanComponent: false,
  frontDeskSortKey: 1,
  publishOnWeb: false,
  voucherNo: 'auto_general',
  description: '',
  webResSortKey: 0,
  validFrom: '',
  validTo: '',
  chargeAppliesOn: 'per_quantity',
  applyChargeOn: 'only_on_check_in',
  applyChargeAlways: false
})

// Computed properties
const selectedCount = computed(() => selectedExtraCharges.value.length)

// Table columns - CORRIGÉ : retirer sortable et searchable
const columns: Column[] = [
  { key: 'shortCode', label: t('shortCode'), type: 'text' },
  { key: 'name', label: t('name'), type: 'text' },
  { key: 'rate', label: t('rate'), type: 'text' },
  { key: 'taxes', label: t('tax'), type: 'custom' },
  { key: 'rateInclusiveTax', label: t('rateInclusiveTax'), type: 'text' },
  { key: 'fixedPrice', label: t('fixedPrice'), type: 'custom' },
  { key: 'createdInfo', label: t('createdBy'), type: 'custom' },
  { key: 'modifiedInfo', label: t('modifiedBy'), type: 'custom' },
  { key: 'status', label: t('status'), type: 'custom' }
]

const actions: Action[] = [
  { 
    label: t('edit'), 
    variant: 'primary', 
    handler: (item: any) => onAction('edit', item),
    icon: Edit
  },
  { 
    label: t('delete'), 
    variant: 'danger', 
    handler: (item: any) => onAction('delete', item),
    icon: Trash2
  }
]

const extraCharges = ref<any[]>([])

// Methods
const onSelectionChange = (selected: any[]) => {
  selectedExtraCharges.value = selected
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editExtraCharge(item)
  } else if (action === 'delete') {
    handleDeleteExtraCharge(item)
  }
}

const calculateRateInclusiveTax = () => {
  const rate = parseFloat(formData.rate.toString()) || 0;
  let totalTax = 0;

  // Si "No Tax" est sélectionné
  if (formData.taxes.includes('0')) {
    totalTax = 0;
  } else {
    totalTax = formData.taxes.reduce((sum, taxId) => {
      const selectedTax = taxes.value.find((t: any) => t.taxRateId == taxId);
      if (!selectedTax) return sum;

      let taxAmount = 0;

      if (selectedTax.postingType === 'flat_percentage') {
        taxAmount = rate * (parseFloat(selectedTax.percentage) || 0) / 100;
      } else if (selectedTax.postingType === 'flat_amount') {
        taxAmount = parseFloat(selectedTax.amount) || 0;
      }

      return sum + taxAmount;
    }, 0);
  }

  formData.rateInclusiveTax = rate + totalTax;
};

const editExtraCharge = (charge: any) => {
  console.log("charge", charge)
  editingExtraCharge.value = charge
  Object.assign(formData, charge)
  formData.taxes = (charge.taxRates || []).map((tax: any) => String(tax.taxRateId));
  calculateRateInclusiveTax() // Recalculate rate with taxes
  showEditModal.value = true
}

// Single extra charge deletion
const handleDeleteExtraCharge = (charge: any) => {
  extraChargeToDelete.value = charge
  showDeleteModal.value = true
}

const confirmDeleteSingleExtraCharge = async () => {
  if (!extraChargeToDelete.value) return

  isDeletingLoading.value = true
  try {
    const response = await deleteExtraChargeById(extraChargeToDelete.value.id)

    if (response.status === 200 || response.status === 204) {
      toast.success(t('extraChargeDeletedSuccessfully'))
      await loadData()
    } else {
      toast.error(t('errorDeletingExtraCharge'))
    }
  } catch (error) {
    console.error('Error deleting extra charge:', error)
    toast.error(t('errorDeletingExtraCharge'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  extraChargeToDelete.value = null
}

// Multiple extra charges deletion
const confirmBulkDeleteExtraCharges = async () => {
  if (selectedExtraCharges.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedExtraCharges.value.map(charge => 
      deleteExtraChargeById(charge.id)
    )
    
    await Promise.all(deletePromises)
    
    // Update local list
    const selectedIds = selectedExtraCharges.value.map(ec => ec.id)
    extraCharges.value = extraCharges.value.filter(ec => !selectedIds.includes(ec.id))
    
    const count = selectedExtraCharges.value.length
    selectedExtraCharges.value = []
    toast.success(t('extraChargesDeletedSuccess', { count }))
  } catch (error) {
    console.error('Error deleting extra charges:', error)
    toast.error(t('errorDeletingSelectedExtraCharges'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Message methods
const getSingleDeleteMessage = () => {
  if (!extraChargeToDelete.value) return ''
  const chargeName = extraChargeToDelete.value.name
  return `Are you sure you want to delete extra charge "${chargeName}"?`
}

const getBulkDeleteMessage = () => {
  const count = selectedExtraCharges.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const chargeName = selectedExtraCharges.value[0].name
    return `Are you sure you want to delete the selected extra charge "${chargeName}"?`
  } else {
    return `Are you sure you want to delete ${count} selected extra charges? `
  }
}

const saveExtraCharge = async () => {
  try {
    isSaving.value = true;

    const taxRateIds = formData.taxes.filter(id => id !== '0');

    if (showEditModal.value && editingExtraCharge.value) {
      const editExtraChargeData = { ...formData, taxRateIds: taxRateIds }
      const res = await updateExtraChargeById(editingExtraCharge.value.id, editExtraChargeData);
      if (res.status === 200 || res.status === 201) {
        toast.success(t('extraChargeUpdatedSuccessfully'))
        closeModal()
        await loadData()
      } else {
        toast.error(t('errorSavingExtraCharge'))
      }
    } else {
      const newExtraCharge = { ...formData, hotelId: serviceStore.serviceId, taxRateIds: taxRateIds }
      const res = await postExtraCharge(newExtraCharge)
      if (res.status === 200 || res.status === 201) {
        toast.success(t('extraChargeCreatedSuccessfully'))
        closeModal()
        await loadData()
      } else {
        toast.error(t('errorSavingExtraCharge'))
      }
    }
  } catch (e) {
    console.log('error', e);
    toast.error(t('errorSavingExtraCharge'));
  } finally {
    isSaving.value = false;
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingExtraCharge.value = null
  Object.assign(formData, {
    shortCode: '',
    name: '',
    rate: 0,
    taxes: [],
    rateInclusiveTax: 0,
    fixedPrice: false,
    isMealPlanComponent: false,
    frontDeskSortKey: 1,
    publishOnWeb: false,
    voucherNo: 'auto_general',
    description: '',
    webResSortKey: 0,
    validFrom: '',
    validTo: '',
    chargeAppliesOn: 'per_quantity',
    applyChargeOn: 'only_on_check_in',
    applyChargeAlways: false
  })
}

// Fetch data from API
const loadData = async (page = 1) => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId
    const allParams = {
      hotel_id: serviceId,
      page: page,
      limit: 10,
    };
    const response = await getExtraCharges(allParams)
    console.log('response', response)
    extraCharges.value = response.data.data.data || []
    paginationMeta.value = response.data.data.meta;
  } catch (error) {
    console.error('Error fetching extra charges:', error)
    toast.error(t('errorLoadingExtraCharges'))
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) => {
  loadData(newPage);
};

const fetchTaxes = async () => {
  try {
    const response = await getTaxes()
    taxes.value = response.data.data.data || []
    console.log("taxes", taxes.value)
  } catch (error) {
    console.error('Error fetching taxes:', error)
    toast.error(t('errorLoadingTaxes'))
  }
}

// Format date helper
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

onMounted(async () => {
  await fetchTaxes()
  await loadData(1)
})
</script>