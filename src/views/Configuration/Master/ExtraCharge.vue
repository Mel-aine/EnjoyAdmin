<template>
  <ConfigurationLayout>
    <div class="p-6">

      <ReusableTable :title="$t('Extra Charges Management')" :columns="columns" :data="extraCharges" :actions="actions"
        :search-placeholder="$t('Search extra charges...')" empty-title="No extra charges found" :loading="loading"
        :selectable="false"
        :empty-description="$t('Start by adding your first extra charge.')" @action="onAction">
        <template #header-actions>
          <BasicButton variant="primary" @click="openAddModal" :icon="Plus" :label="t('configuration.extra_charge.add_extra_charge')" />
        </template>
        <template #column-taxes="{ item }">
          <div class="flex flex-wrap gap-1">
            <span v-for="tax in item.taxRates" :key="tax"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ tax.taxName }}
            </span>
            <span v-if="!item.taxRates || item.taxRates.length === 0"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              No Tax
            </span>
          </div>
        </template>
        <template #column-fixedPrice="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.fixedPrice ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ item.fixedPrice ? $t('yes') : $t('no') }}
          </span>
        </template>
        <template #column-status="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ item.status }}
          </span>
        </template>
      </ReusableTable>
       <TablePagination
              v-if="paginationMeta"
              :meta="paginationMeta"
              @page-change="handlePageChange"
            />
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/40">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ isEditing ? t('configuration.extra_charge.edit_extra_charge') : t('configuration.extra_charge.add_extra_charge') }}
          </h3>

          <form @submit.prevent="saveExtraCharge">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('configuration.extra_charge.short_code') }}</label>
                <Input
                  v-model="formData.shortCode"
                  :placeholder="t('configuration.extra_charge.short_code_placeholder')"
                  class="w-full"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('configuration.extra_charge.name') }}</label>
                <Input
                  v-model="formData.name"
                  :placeholder="t('configuration.extra_charge.name_placeholder')"
                  class="w-full"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('configuration.extra_charge.rate') }}</label>
                <Input v-model="formData.rate" type="number" step="0.01"
                  required @input="calculateRateInclusiveTax"
                  :placeholder="t('configuration.extra_charge.rate_placeholder')" class="w-full" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('configuration.extra_charge.tax') }}
                </label>
                <div class="space-y-2 p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
                  <label class="flex items-center">
                    <input v-model="formData.taxes" value="0" type="checkbox" @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">No Tax (0%)</span>
                  </label>
                  <label class="flex items-center" v-for="tax in taxes" :key="tax.taxRateId">
                    <input v-model="formData.taxes" :value="tax.taxRateId" type="checkbox"
                      @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ tax.taxName }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('configuration.extra_charge.rate_inclusive_tax') }}
              </label>
              <input v-model="formData.rateInclusiveTax" type="number" step="0.01" readonly
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                :placeholder="t('configuration.extra_charge.rate_inclusive_tax_placeholder')" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="formData.fixedPrice" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('configuration.extra_charge.fixed_price') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="formData.isMealPlanComponent" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Meal Plan Component') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('configuration.extra_charge.front_desk_sort_key') }}</label>
                <Input v-model="formData.frontDeskSortKey" type="number" :placeholder="t('configuration.extra_charge.front_desk_sort_key_placeholder')" class="w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="formData.publishOnWeb" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('configuration.extra_charge.publish_on_web') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <Select/>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('configuration.extra_charge.voucher_no') }}
                </label>
                <select v-model="formData.voucherNo"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="auto_general">{{ t('configuration.extra_charge.auto_general') }}</option>
                  <option value="auto_private">{{ t('configuration.extra_charge.auto_private') }}</option>
                  <option value="manual">{{ t('configuration.extra_charge.manual') }}</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('configuration.extra_charge.description') }}
              </label>
              <textarea v-model="formData.description" rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                :placeholder="t('configuration.extra_charge.description_placeholder')"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('configuration.extra_charge.charge_applies_on') }}
                </label>
                <select v-model="formData.chargeAppliesOn"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200">
                  <option value="per_quantity">{{ t('configuration.extra_charge.per_quantity') }}</option>
                  <option value="per_night">{{ t('configuration.extra_charge.per_night') }}</option>
                  <option value="per_stay">{{ t('configuration.extra_charge.per_stay') }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('configuration.extra_charge.apply_above_charge_on') }}
                </label>
                <select v-model="formData.applyChargeOn"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200">
                  <option value="only_on_check_in">{{ t('configuration.extra_charge.only_on_check_in') }}</option>
                  <option value="daily">{{ t('configuration.extra_charge.daily') }}</option>
                  <option value="on_checkout">{{ t('configuration.extra_charge.on_checkout') }}</option>
                </select>
              </div>
            </div>
            <div>
              <div class="mb-2">
                <label class="flex items-center">
                  <input v-model="formData.applyChargeAlways" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('configuration.extra_charge.apply_charge_always')
                    }}</span>
                </label>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-6" v-if="!formData.applyChargeAlways">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('configuration.extra_charge.valid_from') }}</label>
                <InputDatePicker v-model="formData.validFrom" class="w-full" />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('configuration.extra_charge.valid_to') }}</label>
                <InputDatePicker v-model="formData.validTo" class="w-full" />
              </div>
            </div>


            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton
                type="button"
                variant="outline"
                @click="closeModal"
                :label="$t('cancel')"
                :disabled="isSaving"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :label="isEditing ? $t('configuration.extra_charge.update_extra_charge') : $t('configuration.extra_charge.save_extra_charge')"
                :loading="isSaving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
     <ConfirmationModal
      v-model:show="showConfirmModal"
      :is-open="showConfirmModal"
      :loading="isDeletingLoading"
      :title="t('configuration.extra_charge.confirm_delete_title')"
      :message="t('configuration.extra_charge.confirm_delete', { name: itemToDelete?.name || '' })"
      action="DANGER"
      :confirm-text="$t('Confirm')"
      :cancel-text="$t('Cancel')"
      @close="closeConfirmModal"
      @confirm="confirmDelete"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive,onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import type { Action, Column } from '../../../utils/models'
import InputDatePicker from '../../../components/forms/FormElements/InputDatePicker.vue'
import Plus from '../../../icons/Plus.vue'
import { getExtraCharges, getTaxes, postExtraCharge, updateExtraChargeById,deleteExtraChargeById } from '../../../services/configrationApi'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { Edit, Save, Trash2 } from 'lucide-vue-next'
import TablePagination from '@/components/tables/TablePagination.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import Select from '@/components/forms/FormElements/Select.vue'

const { t } = useI18n()

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const toast = useToast()
const serviceStore = useServiceStore();
const isSaving = ref(false);
const paginationMeta = ref(null)
const taxes = ref<any>([])
const showConfirmModal = ref(false)
const itemToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const columns: Column[] = [
  { key: 'shortCode', label: t('configuration.extra_charge.short_code'), type: 'text' },
  { key: 'name', label: t('configuration.extra_charge.name'), type: 'text' },
  { key: 'rate', label: t('configuration.extra_charge.rate'), type: 'text' },
  { key: 'taxes', label: t('configuration.extra_charge.tax'), type: 'custom' },
  { key: 'rateInclusiveTax', label: t('configuration.extra_charge.rate_inclusive_tax'), type: 'text' },
  { key: 'fixedPrice', label: t('configuration.extra_charge.fixed_price'), type: 'custom' },
]

const actions: Action[] = [
  { label: t('edit'), variant: 'primary', handler: (item: any) => editExtraCharge(item),icon:Edit },
  { label: t('delete'), variant: 'danger', handler: (item: any) => deleteExtraCharge(item),icon:Trash2 }
]

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

const extraCharges = ref<any[]>([
])

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

  console.log('Rate:', rate);
  console.log('Selected Taxes:', formData.taxes);
  console.log('Total Tax Amount:', totalTax);
  console.log('Rate Inclusive Tax:', formData.rateInclusiveTax);
};


const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
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
  showModal.value = true
}

const editExtraCharge = (charge: any) => {
  console.log("charge",charge)
  isEditing.value = true
  editingId.value = charge.id
  Object.assign(formData, charge)

   formData.taxes = (charge.taxRates || []).map((tax: any) => String(tax.taxRateId));
  calculateRateInclusiveTax() // Recalculate rate with taxes
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
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

const saveExtraCharge = async () => {
  try {
    isSaving.value = true;

    const taxRateIds = formData.taxes.filter(id => id !== '0');

    if (isEditing.value && editingId.value) {
      const editExtraCharge = { ...formData,  taxRateIds: taxRateIds  }
      const res = await updateExtraChargeById(editingId.value!, editExtraCharge);
      if (res.status === 200 || res.status === 201) {
        toast.success(t('configuration.extra_charge.update_extra_charge') + t('successfully'));
        closeModal()
        await loadata()
      } else {
        toast.error(t('something_went_wrong'))
      }
    } else {
      const newExtraCgarge = { ...formData, hotelId: serviceStore.serviceId, taxRateIds: taxRateIds  }
      const res = await postExtraCharge(newExtraCgarge)
      if (res.status === 200 || res.status === 201) {
        toast.success(t('configuration.extra_charge.save_extra_charge') + t('successfully'));
        closeModal()
        await loadata()
      } else {
        toast.error(t('something_went_wrong'))
      }
    }
  } catch (e) {
    console.log('error',e);
    toast.error(t('something_went_wrong'));
  } finally {
    isSaving.value = false;
  }
}

const deleteExtraCharge = (item: any) => {
  itemToDelete.value = item
  showConfirmModal.value = true
}

// Fonction pour confirmer la suppression
const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    isDeletingLoading.value = true
    const response = await deleteExtraChargeById(itemToDelete.value.id)

    if (response.status === 200 || response.status === 204) {
      toast.success(t('configuration.extra_charge.delete_success') || t('Extra charge deleted successfully'))
       closeConfirmModal()
      await loadata(1)
    } else {
      toast.error(t('configuration.extra_charge.delete_error') || t('Error deleting extra charge'))
    }
  } catch (error) {
    console.error('Error deleting extra charge:', error)
    toast.error(t('something_went_wrong'))
  } finally {
    isDeletingLoading.value = false
  }
}

// Fonction pour fermer la modal de confirmation
const closeConfirmModal = () => {
  showConfirmModal.value = false
  itemToDelete.value = null
  isDeletingLoading.value = false
}


const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editExtraCharge(item)
  } else if (action === 'delete') {
    deleteExtraCharge(item.id)
  }
}



// Fetch identity types from API
const loadata = async (page = 1) => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId
     const allParams = {
      hotel_id: serviceId,
      page: page,
      limit: 10,
    };
    const response = await getExtraCharges(allParams)
    console.log('response',response)
    extraCharges.value = response.data.data.data || []
    paginationMeta.value = response.data.data.meta;
  } catch (error) {
    console.error('Error fetching identity types:', error)
    toast.error(t('configuration.identity_type.fetch_error'))
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) => {
  loadata(newPage);
};

const fetchTaxes = async () => {
  try {
    const response = await getTaxes()
    taxes.value = response.data.data.data || []
    console.log("taxes",taxes.value)
  } catch (error) {
    console.error('Error fetching taxes:', error)
  }
}

fetchTaxes()
onMounted(async () => {
  await loadata(1)
})


</script>
