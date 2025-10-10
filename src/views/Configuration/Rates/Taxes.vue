<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('configuration.taxes.title') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('configuration.taxes.description') }}
        </p>
      </div>

      <ReusableTable 
        :title="t('configuration.taxes.taxes_list')" 
        :columns="columns" 
        :data="taxes" 
        :actions="actions"
        :search-placeholder="t('configuration.taxes.search_placeholder')" 
        :selectable="true"
        :empty-state-title="t('configuration.taxes.empty_state_title')"
        :empty-state-message="t('configuration.taxes.empty_state_message')" 
        :loading="loading" 
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="openAddModal" 
            :label="t('configuration.taxes.add_tax')" 
            :icon="Plus" 
            variant="primary"
          />

          <BasicButton 
            v-if="selectedTaxes.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')"
            :icon="Trash2"
          />
        </template>

        <template #column-taxDetails="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900">{{ t('configuration.taxes.'+item.postingType) }}</div>
            <div class="text-xs text-gray-500" v-if="item.postingType === 'flat_amount'">{{ item.amount }}</div>
            <div class="text-xs text-gray-500" v-else-if="item.postingType === 'flat_percentage'">{{ item.percentage }}%
            </div>
            <div class="text-xs text-gray-500" v-else>Slab Based</div>
          </div>
        </template>

        <template #column-applicationRules="{ item }">
          <div>
            <div class="text-xs text-gray-600">{{ t('configuration.taxes.'+item.applyTax) }}</div>
            <div class="text-xs text-gray-500" v-if="item.applyTaxOnRackRate">On Rack Rate</div>
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
        
        <template #column-status="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ $t('configuration.identity_type.status_' + item.status.toLowerCase()) }}
          </span>
        </template>
      </ReusableTable>

      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? t('configuration.taxes.add_tax') : t('configuration.taxes.edit_tax') }}
          </h3>

          <form @submit.prevent="saveTax" class="space-y-4">
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('configuration.taxes.exempt_after') }}
                </label>
                <div class="flex items-center space-x-2">
                  <Input v-model="formData.exemptAfter" type="Number"
                    :placeholder="t('configuration.taxes.exempt_after_placeholder')" class="flex-1" />
                  <span class="text-sm text-gray-600">{{ t('configuration.taxes.days') }}</span>
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
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <label for="beforeDiscount" class="text-sm text-gray-700">
                      {{ t('configuration.taxes.before_discount') }}
                    </label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input type="radio" id="afterDiscount" v-model="formData.applyTax" value="after_discount"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <label for="afterDiscount" class="text-sm text-gray-700">
                      {{ t('configuration.taxes.after_discount') }}
                    </label>
                  </div>
                </div>
                <div class="text-sm text-gray-600 mt-1">{{ t('configuration.taxes.apply_tax') }} *</div>
              </div>

              <div v-if="formData.postingType === 'flat_amount'">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('configuration.taxes.amount') }}
                </label>
                <Input v-model="formData.amount" inputType="number" step="0.01" :placeholder="t('configuration.taxes.amount_placeholder')" class="w-full" />
              </div>
              <div v-else-if="formData.postingType === 'flat_percentage'">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('configuration.taxes.percentage') }}
                </label>
                <Input v-model="formData.percentage" type="number" step="0.01" :placeholder="t('configuration.taxes.percentage_placeholder')" class="w-full" />
              </div>
              <div v-else-if="formData.postingType === 'slab'">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('configuration.taxes.slab_information') }}
                </label>
                <textarea v-model="formData.slabInfo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3" :placeholder="t('configuration.taxes.slab_placeholder')"></textarea>
              </div>
              <div v-else>
                <div class="h-16"></div> </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('configuration.taxes.tax_apply_after') }}
                </label>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="flex items-center space-x-2" v-for="(tax, ind) in taxes">
                      <input type="checkbox" id="vat"  v-model="formData.taxApplyAfter" :value="tax.taxRateId"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <label for="vat" class="text-gray-700">{{ tax.taxName }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 pt-6">
                <input type="checkbox" id="applyTaxOnRackRate" v-model="formData.applyTaxOnRackRate"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label for="applyTaxOnRackRate" class="text-sm text-gray-700">
                  {{ t('configuration.taxes.apply_tax_on_rack_rate') }}
                </label>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('status') }}
                </label>
                <Select v-model="formData.status" :options="statusOptions" :placeholder="t('select_status')" class="w-full" />
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

    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('Delete Tax')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleTax"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('Delete Selected Taxes')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteTaxes"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Trash2, Edit } from 'lucide-vue-next'
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
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

// 1. Définition de l'interface Tax pour un typage correct (SOLUTION)
interface Tax {
  taxRateId: string | number; // Utiliser le type réel de l'ID
  shortName: string;
  taxName: string;
  appliesFrom: string;
  exemptAfter: string | number;
  postingType: string;
  amount: string | number;
  percentage: string | number;
  slabInfo: string;
  applyTax: string;
  applyTaxOnRackRate: boolean;
  status: 'active' | 'inactive';
  taxApplyAfter: (string | number)[];
  createdAt?: string;
  updatedAt?: string;
  createdByUser?: { fullName: string };
  updatedByUser?: { fullName: string };
  // Ajouter d'autres propriétés si nécessaire
}

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
// const editingTax = ref(null) // Non utilisé
// 2. Typer selectedTaxes (SOLUTION)
const selectedTaxes = ref<Tax[]>([])
const loading = ref(false)

// Delete modals states
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
// 3. Typer taxToDelete (SOLUTION)
const taxToDelete = ref<Tax | null>(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = ref<Partial<Tax>>({ // Utiliser Partial<Tax> car certains champs sont vides au début
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
  status: 'active', // 'Active' a été changé en 'active' pour correspondre à statusOptions
  taxApplyAfter: []
})

// Table columns (pas de changement nécessaire)
const columns = computed<Column[]>(() => [
// ... (omitted for brevity, no changes needed)
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
const taxes = ref<Tax[]>([]) // Typer taxes

// Options for dropdowns (pas de changement nécessaire)
const postingTypeOptions = computed(() => [
// ... (omitted for brevity, no changes needed)
  { value: 'flat_amount', label: t('configuration.taxes.flat_amount') },
  { value: 'flat_percentage', label: t('configuration.taxes.flat_percentage') },
  { value: 'slab', label: t('configuration.taxes.slab') }
])

const applyTaxOptions = ref([
// ... (omitted for brevity, no changes needed)
  { value: 'before_discount', label: t('configuration.taxes.before_discount') },
  { value: 'after_discount', label: t('configuration.taxes.after_discount') }
])

const statusOptions = computed(() => [
// ... (omitted for brevity, no changes needed)
  { value: 'active', label: t('configuration.taxes.status_active') },
  { value: 'inactive', label: t('configuration.taxes.status_inactive') }
])

// Additional reactive variables
const isEditing = ref(false)
const editingTaxId = ref<string | number | null>(null)

// Computed
const selectedCount = computed(() => selectedTaxes.value.length)

// Methods
const loadTaxes = async () => {
  try {
    loading.value = true
    const response = await getTaxes()
    taxes.value = response.data.data.data || []
    console.log('taxes', taxes.value)
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

const editTax = (tax: Tax) => { // Typer 'tax'
  isEditing.value = true
  editingTaxId.value = tax.taxRateId
  formData.value = { ...tax } as Partial<Tax> // Assurer que le type est compatible
  showEditModal.value = true
}

// Single tax deletion
const handleDeleteTax = (tax: Tax) => { // Typer 'tax'
  taxToDelete.value = tax
  showDeleteModal.value = true
}

const confirmDeleteSingleTax = async () => {
  // 4. Ajout d'une vérification de nullité (SOLUTION pour lignes 427 et 430)
  if (!taxToDelete.value) return

  isDeletingLoading.value = true
  try {
    // taxToDelete.value est maintenant garanti d'être de type Tax
    const response = await deleteTaxById(Number(taxToDelete.value.taxRateId)) // Convert to number
    if (response.status === 200 || response.status === 204) {
      // Update local list
      // Utilisation de l'opérateur non-null assertion (!) ici ou une variable locale
      const index = taxes.value.findIndex(t => t.taxRateId === taxToDelete.value!.taxRateId) // Ligne 430 corrigée
      if (index > -1) {
        taxes.value.splice(index, 1)
      }
      toast.success(t('configuration.taxes.delete_success'))
    } else {
      throw new Error('Failed to delete tax')
    }
  } catch (error) {
    console.error('Error deleting tax:', error)
    toast.error(t('something_went_wrong'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  taxToDelete.value = null
}

// Multiple taxes deletion
const confirmBulkDeleteTaxes = async () => {
  if (selectedTaxes.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    // 5. Typer le paramètre 'tax' dans .map() (SOLUTION pour ligne 458)
    const deletePromises = selectedTaxes.value.map((tax: Tax) => 
      deleteTaxById(Number(tax.taxRateId))
    )
    
    const results = await Promise.allSettled(deletePromises)
    
    // Check for failures
    const failedDeletes = results.filter(result => result.status === 'rejected')
    if (failedDeletes.length > 0) {
      console.error('Some deletions failed:', failedDeletes)
      throw new Error(`${failedDeletes.length} deletions failed`)
    }
    
    // Update local list for successful deletions
    // 6. Typer le paramètre 't' dans .map() (SOLUTION pour ligne 472)
    const selectedIds = selectedTaxes.value.map((t: Tax) => t.taxRateId) // Ligne 472 corrigée
    taxes.value = taxes.value.filter(t => !selectedIds.includes(t.taxRateId))
    
    const count = selectedTaxes.value.length
    selectedTaxes.value = []
    toast.success(t('selectedTaxesDeleted', { count }))
  } catch (error) {
    console.error('Error deleting selected taxes:', error)
    toast.error(t('errorDeletingSelectedTaxes'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Messages for modals
const getSingleDeleteMessage = () => {
  // 7. Vérification de nullité explicite (SOLUTION pour ligne 494)
  if (!taxToDelete.value) return ''
  const taxName = taxToDelete.value.taxName || 'Tax' // Ligne 494 corrigée
  return `Are you sure you want to delete "${taxName}"?`
}

const getBulkDeleteMessage = () => {
  const count = selectedTaxes.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const tax = selectedTaxes.value[0]
    const taxName = tax.taxName || 'Tax'
    return `Are you sure you want to delete the selected tax "${taxName}"?`
  } else {
    return `Are you sure you want to delete ${count} selected taxes?`
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
    handler: handleDeleteTax,
    icon: Trash2,
    variant: 'danger'
  }
])

const onAction = (action: string, item: Tax) => { // Typer 'item'
  if (action === 'edit') {
    editTax(item)
  } else if (action === 'delete') {
    handleDeleteTax(item)
  }
}

const onSelectionChange = (selected: Tax[]) => { // Typer 'selected'
  selectedTaxes.value = selected
}

const saveTax = async () => {
  try {
    loading.value = true
    const taxData = {
      ...formData.value,
      amount: Number(formData.value.amount),
      percentage: Number(formData.value.percentage),
      exemptAfter: Number(formData.value.exemptAfter),
      hotelId: serviceStore.serviceId
    } as Tax // S'assurer que les données finales sont de type Tax

    if (isEditing.value) {
      // L'opérateur non-null assertion (!) est utilisé car editingTaxId est défini lors de l'édition
      await updateTaxById(Number(editingTaxId.value!), taxData) 
      toast.success(t('configuration.taxes.update_success'))
    } else {
      await postTax(taxData)
      toast.success(t('configuration.taxes.create_success'))
    }

    closeModal()
    await loadTaxes()
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
    taxApplyAfter: []
  }
  isEditing.value = false
  editingTaxId.value = null
}

// Initialize data on mount
onMounted(() => {
  loadTaxes()
})
</script>