<template>
  <ConfigurationLayout>
    <div class="p-6">

      <!-- Taxes Table using ReusableTable -->
      <ReusableTable :title="t('configuration.taxes.taxes_list')" :columns="columns" :data="taxes" :actions="actions"
        :search-placeholder="t('configuration.taxes.search_placeholder')" :selectable="false"
        :empty-state-title="t('configuration.taxes.empty_state_title')" :meta="paginationMeta" @page-change="handlePageChange"
        :empty-state-message="t('configuration.taxes.empty_state_message')" :loading="loading" @action="onAction"
        @selection-change="onSelectionChange">
        <template #header-actions>
          <BasicButton @click="openAddModal" :label="t('configuration.taxes.add_tax')" :icon="Plus" variant="primary">
          </BasicButton>

        </template>

        <!-- Custom column for tax details -->
        <template #column-taxDetails="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ t('configuration.taxes.'+item.postingType) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400" v-if="item.postingType === 'flat_amount'">{{ item.amount }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400" v-else-if="item.postingType === 'flat_percentage'">{{ item.percentage }}%
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400" v-else>Slab Based</div>
          </div>
        </template>

        <!-- Custom column for application rules -->
        <template #column-applicationRules="{ item }">
          <div>
            <div class="text-xs text-gray-600 dark:text-gray-300">{{ t('configuration.taxes.'+item.applyTax) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400" v-if="item.applyTaxOnRackRate">On Rack Rate</div>
          </div>
        </template>

          <!-- Custom column for created info -->
          <template #column-createdInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.createdByUser?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-500">{{ formatDateT(item.createdAt) }}</div>
            </div>
          </template>

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.updatedByUser?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-500">{{ formatDateT(item.updatedAt) }}</div>
            </div>
          </template>
          <template  #column-status="{ item }">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
              {{ $t('configuration.identity_type.status_' + item.status.toLowerCase()) }}
            </span>
          </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {{ showAddModal ? t('configuration.taxes.add_tax') : t('configuration.taxes.edit_tax') }}
          </h3>

          <form @submit.prevent="saveTax" class="space-y-4">
            <!-- First Row: Short Name, Tax Name, Applies From -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input v-model="formData.shortName" :lb="t('configuration.taxes.short_name')" :is-required="true" placeholder="" class="w-full" />
              </div>
              <div>
                <Input v-model="formData.taxName" placeholder="" class="w-full" :lb="t('configuration.taxes.tax_name')" :is-required="true" />
              </div>
              <div>
                <InputDatePicker :title="t('configuration.taxes.applies_from')" v-model="formData.appliesFrom"
                  :placeholder="t('configuration.taxes.applies_from_placeholder')" class="w-full" />
              </div>


              <!-- Second Row: Exempt After, Posting Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('configuration.taxes.exempt_after') }}
                </label>
                <div class="flex items-center space-x-2">
                  <Input v-model="formData.exemptAfter" type="Number"
                    :placeholder="t('configuration.taxes.exempt_after_placeholder')" class="flex-1" />
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ t('configuration.taxes.days') }}</span>
                </div>
              </div>
              <div>
                <Select v-model="formData.postingType" :options="postingTypeOptions"
                :lb="t('configuration.taxes.posting_type')"
                :is-required="true"
                  :placeholder="t('configuration.taxes.posting_type_placeholder')" class="w-full" />
              </div>
              <div class="flex flex-col">
                <div class="flex items-center space-x-4 pt-6">
                  <div class="flex items-center space-x-2">
                    <input type="radio" id="beforeDiscount" v-model="formData.applyTax" value="before_discount"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700" />
                    <label for="beforeDiscount" class="text-sm text-gray-700 dark:text-gray-300">
                      {{ t('configuration.taxes.before_discount') }}
                    </label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input type="radio" id="afterDiscount" v-model="formData.applyTax" value="after_discount"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700" />
                    <label for="afterDiscount" class="text-sm text-gray-700 dark:text-gray-300">
                      {{ t('configuration.taxes.after_discount') }}
                    </label>
                  </div>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ t('configuration.taxes.apply_tax') }} *</div>
              </div>

              <!-- Third Row: Dynamic fields based on posting type and Apply Tax on Rack Rate -->
              <!-- Dynamic field based on posting type -->
              <div v-if="formData.postingType === 'flat_amount'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('configuration.taxes.amount') }}
                </label>
                <Input v-model="formData.amount" inputType="number" step="0.01" :placeholder="t('configuration.taxes.amount_placeholder')" class="w-full" />
              </div>
              <div v-else-if="formData.postingType === 'flat_percentage'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('configuration.taxes.percentage') }}
                </label>
                <Input v-model="formData.percentage" type="number" step="0.01" :placeholder="t('configuration.taxes.percentage_placeholder')" class="w-full" />
              </div>
              <div v-else-if="formData.postingType === 'slab'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('configuration.taxes.slab_information') }}
                </label>
                <textarea v-model="formData.slabInfo"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3" :placeholder="t('configuration.taxes.slab_placeholder')"></textarea>
              </div>
              <div v-else>
                <div class="h-16"></div> <!-- Spacer when no posting type selected -->
              </div>
              <!-- Tax Apply After Section -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('configuration.taxes.tax_apply_after') }}
                </label>
                <div class="bg-blue-50 border border-blue-200 dark:bg-gray-900 dark:border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="flex items-center space-x-2" v-for="(tax, ind) in taxes">
                      <input type="checkbox" id="vat"  v-model="formData.taxApplyAfter" :value="tax.taxRateId"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded" />
                      <label for="vat" class="text-gray-700 dark:text-gray-300">{{ tax.taxName }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 pt-6">
                <input type="checkbox" id="applyTaxOnRackRate" v-model="formData.applyTaxOnRackRate"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded" />
                <label for="applyTaxOnRackRate" class="text-sm text-gray-700 dark:text-gray-300">
                  {{ t('configuration.taxes.apply_tax_on_rack_rate') }}
                </label>
              </div>


            </div>

            <!-- Status -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('status') }}
                </label>
                <Select v-model="formData.status" :options="statusOptions" :placeholder="t('select_status')" class="w-full" />
              </div>
              <!-- Tax Type (optional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('configuration.taxes.tax_type') }}
                </label>
                <Select
                  v-model="formData.type"
                  :options="taxTypeOptions"
                  :placeholder="t('configuration.taxes.select_tax_type')"
                  class="w-full"
                />
                <p v-if="typeError" class="mt-1 text-xs text-red-600">{{ typeError }}</p>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton
                type="button"
                variant="outline"
                @click="closeModal"
                :label="t('cancel')"
                :disabled="loading"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :label="loading ? t('saving') + '...' : showAddModal ? t('configuration.taxes.save_tax') : t('configuration.taxes.update_tax')"
                :loading="loading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ModalConfirmation v-if="showDeleteModal" v-model="showConfirmModal" :title="confirmTitle" :message="confirmMessage"
      :loading="confirmLoading" :confirm-text="t('delete')" :cancel-text="t('cancel')" @confirm="handleConfirm"
      @close="handleConfirmClose" :action="'DANGER'" />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Trash2, Edit, Eye } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { getTaxes, postTax, updateTaxById, deleteTaxById } from '@/services/configrationApi'
import type { Action, Column } from '../../../utils/models'
import { formatDateDisplay } from '../../../utils/dateUtils'
import { formatDate } from 'date-fns'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingTax = ref(null)
const showDeleteModal = ref(false);
const selectedTaxes = ref<any>([])
const loading = ref(false)
const showConfirmModal = ref(false)
const confirmAction = ref(null)
const confirmMessage = ref('')
const confirmTitle = ref('')
const confirmLoading = ref(false)
const paginationMeta = ref<any>(null)

// Form data
const formData = ref({
  shortName: '',
  taxName: '',
  appliesFrom: '',
  exemptAfter: '',
  postingType: '',
  amount: '',
  percentage: '',
  slabInfo: '',
  applyTax: '',
  applyTaxOnRackRate: false,
  status: 'Active',
  taxApplyAfter: [],
  type: ''
})

// Table columns
const columns = computed<Column[]>(() => [
  {
    key: 'shortName',
    label: t('configuration.taxes.short_name'),
    sortable: true
  },
  {
    key: 'taxName',
    label: t('configuration.taxes.tax_name'),
    sortable: true
  },
  {
    key: 'appliesFrom',
    label: t('configuration.taxes.applies_from'),
    sortable: true
  },
  {
    key: 'exemptAfter',
    label: t('configuration.taxes.exempt_after'),
    sortable: true
  },
  {
    key: 'taxDetails',
    label: t('configuration.taxes.tax_details'),
    type: 'custom'
  },
  {
    key: 'applicationRules',
    label: t('configuration.taxes.application_rules'),
    type: 'custom'
  },
  {
    key: 'status',
    label: t('status'),
    type: 'custom'
  },
  {
    key: 'createdInfo',
    label: t('created_info'),
    type: 'custom'
  },
  {
    key: 'modifiedInfo',
    label: t('modified_info'),
    type: 'custom'
  }
])

// Sample data
const taxes = ref<any[]>([
])

// Options for dropdowns
const postingTypeOptions = computed(() => [
  { value: 'flat_amount', label: t('configuration.taxes.flat_amount') },
  { value: 'flat_percentage', label: t('configuration.taxes.flat_percentage') },
  { value: 'slab', label: t('configuration.taxes.slab') }
])

const applyTaxOptions = ref([
  { value: 'before_discount', label: t('configuration.taxes.before_discount') },
  { value: 'after_discount', label: t('configuration.taxes.after_discount') }
])

const statusOptions = computed(() => [
  { value: 'active', label: t('configuration.taxes.status_active') },
  { value: 'inactive', label: t('configuration.taxes.status_inactive') }
])

// Tax type options (optional selection)
const taxTypeOptions = computed(() => [
  { value: 'vat', label: t('configuration.taxes.vat') },
  { value: 'service_fee', label: t('configuration.taxes.service_fee') },
  { value: 'city_tax', label: t('configuration.taxes.city_tax') }
])

// Optional enum validation for tax type
const allowedTaxTypes = ['vat', 'service_fee', 'city_tax'] as const
const typeError = ref('')
const validateTaxType = () => {
  typeError.value = ''
  const v = formData.value.type
  if (!v) return true
  const isValid = allowedTaxTypes.includes(v as any)
  if (!isValid) {
    typeError.value = t('configuration.taxes.invalid_tax_type') || 'Invalid tax type'
  }
  return isValid
}

// Additional reactive variables
const isEditing = ref(false)
const editingTaxId = ref(null)

// Methods
const loadTaxes = async (pageNumber=1) => {
  try {
    loading.value = true
    const response = await getTaxes({page:pageNumber,limit:10})
    taxes.value = response.data.data.data || []
    paginationMeta.value = response.data.data.meta
    console.log('taxes',taxes.value)
  } catch (error) {
    console.error('Error loading taxes:', error)
    toast.error(t('something_went_wrong'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

const editTax = (tax: any) => {
  isEditing.value = true
  editingTaxId.value = tax.taxRateId
  formData.value = { ...tax }
  showEditModal.value = true
}

const confirmDeleteTax = (tax: any) => {
  confirmTitle.value = t('configuration.taxes.confirm_delete_title')
  confirmMessage.value = t('configuration.taxes.confirm_delete_message', { name: tax.taxName })
  showDeleteModal.value = true
    selectedTaxes.value = [tax]

}

const deleteTax = async (tax: any) => {
  try {
    confirmLoading.value = true
    await deleteTaxById(tax.id)
    toast.success(t('configuration.taxes.delete_success'))
    showConfirmModal.value = false
    await loadTaxes()
  } catch (error) {
    console.error('Error deleting tax:', error)
    toast.error(t('something_went_wrong'))
  } finally {
    confirmLoading.value = false
  }
}

const deleteSelected = async () => {
  try {
    confirmLoading.value = true
    await Promise.all(selectedTaxes.value.map((tax: any) => deleteTaxById(tax.taxRateId)))
    toast.success(t('configuration.taxes.delete_selected_success'))
    showConfirmModal.value = false
    await loadTaxes(1)
    selectedTaxes.value = []
    await loadTaxes()
  } catch (error) {
    console.error('Error deleting selected taxes:', error)
    toast.error(t('something_went_wrong'))
  } finally {
    confirmLoading.value = false
  }
}

// Actions configuration
const actions = computed(() => [
  {
    label: t('edit'),
    handler: editTax,
    icon: Edit
  },
  {
    label: t('delete'),
    handler: confirmDeleteTax,
    icon: Trash2,
    variant: 'danger'
  }
])

const onAction = (action:any, item:any) => {
  if (action === 'edit') {
    editTax(item)
  } else if (action === 'delete') {
    confirmDeleteTax(item)
  }
}

const onSelectionChange = (selected:any) => {
  selectedTaxes.value = selected
}

const saveTax = async () => {
  try {
    loading.value = true
    // Optional tax type validation (mimics vine.enum([...]).optional())
    const isTypeValid = validateTaxType()
    if (!isTypeValid) {
      loading.value = false
      return
    }
    const taxData = {
      ...formData.value,
      amount: Number(formData.value.amount),
      percentage: Number(formData.value.percentage),
      exemptAfter:Number(formData.value.exemptAfter),
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value) {
      await updateTaxById(editingTaxId.value!, taxData)
      toast.success(t('configuration.taxes.update_success'))
    } else {
      await postTax(taxData)
      toast.success(t('configuration.taxes.create_success'))
    }

    closeModal()
    await loadTaxes(1)
  } catch (error) {
    console.error('Error saving tax:', error)
    toast.error(t('something_went_wrong'))
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    shortName: '',
    taxName: '',
    appliesFrom: '',
    exemptAfter: '',
    postingType: '',
    amount: '',
    percentage: '',
    slabInfo: '',
    applyTax: '',
    applyTaxOnRackRate: false,
    status: 'active',
    taxApplyAfter: [],
    type: ''
  }
  isEditing.value = false
  editingTaxId.value = null
  typeError.value = ''
}

const  handleConfirm = async () => {
      handleConfirmClose()
    await deleteSelected()
}

const handleConfirmClose = () => {
  showDeleteModal.value = false
  confirmAction.value = null
}
const handlePageChange = (page:number) =>{
  loadTaxes(page)
}
// Initialize data on mount
onMounted(() => {
  loadTaxes(1)
})
</script>
