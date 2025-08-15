<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ t('configuration.extra_charge.title') }}</h1>

      <p class="text-gray-600 mb-6">
        {{ t('configuration.extra_charge.define_extra_charge_details') }}
      </p>


      <ReusableTable title="Extra Charges Management" :columns="columns" :data="extraCharges" :actions="actions"
        search-placeholder="Search extra charges..." empty-title="No extra charges found" :loading="loading"
        :selectable="true"
        empty-description="Start by adding your first extra charge." @action="onAction">
        <template #header-actions>
          <BasicButton variant="primary" @click="openAddModal" :icon="Plus" :label="t('configuration.extra_charge.add_extra_charge')" />
        </template>
        <template #column-taxes="{ item }">
          <div class="flex flex-wrap gap-1">
            <span v-for="tax in item.taxRates" :key="tax"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ tax }}%
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
            {{ item.fixedPrice ? 'Yes' : 'No' }}
          </span>
        </template>
        <template #column-status="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ item.status }}
          </span>
        </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ isEditing ? t('configuration.extra_charge.edit_extra_charge') : t('configuration.extra_charge.add_extra_charge') }}
          </h3>

          <form @submit.prevent="saveExtraCharge">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('configuration.extra_charge.short_code') }}</label>
                <Input
                  v-model="formData.shortCode"
                  :placeholder="t('configuration.extra_charge.short_code_placeholder')"
                  class="w-full"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('configuration.extra_charge.name') }}</label>
                <Input
                  v-model="formData.name"
                  :placeholder="t('configuration.extra_charge.name_placeholder')"
                  class="w-full"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('configuration.extra_charge.rate') }}</label>
                <Input v-model="formData.rate" type="number" step="0.01"
                  required @input="calculateRateInclusiveTax"
                  :placeholder="t('configuration.extra_charge.rate_placeholder')" class="w-full" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('configuration.extra_charge.tax') }}
                </label>
                <div class="space-y-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                  <label class="flex items-center">
                    <input v-model="formData.taxes" value="0" type="checkbox" @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700">No Tax (0%)</span>
                  </label>
                  <label class="flex items-center" v-for="(tax, index) in taxes" :key="index">
                    <input v-model="formData.taxes" :value="tax.value" type="checkbox"
                      @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700">{{ tax.name }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('configuration.extra_charge.rate_inclusive_tax') }}
              </label>
              <input v-model="formData.rateInclusiveTax" type="number" step="0.01" readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="t('configuration.extra_charge.rate_inclusive_tax_placeholder')" />
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
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('configuration.extra_charge.front_desk_sort_key') }}</label>
                <Input v-model="formData.frontDeskSortKey" type="number" :placeholder="t('configuration.extra_charge.front_desk_sort_key_placeholder')" class="w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="formData.publishOnWeb" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700">{{ t('configuration.extra_charge.publish_on_web') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('configuration.extra_charge.voucher_no') }}
                </label>
                <select v-model="formData.voucherNo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="auto_general">{{ t('configuration.extra_charge.auto_general') }}</option>
                  <option value="auto_private">{{ t('configuration.extra_charge.auto_private') }}</option>
                  <option value="manual">{{ t('configuration.extra_charge.manual') }}</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('configuration.extra_charge.description') }}
              </label>
              <textarea v-model="formData.description" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                :placeholder="t('configuration.extra_charge.description_placeholder')"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('configuration.extra_charge.charge_applies_on') }}
                </label>
                <select v-model="formData.chargeAppliesOn"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="per_quantity">{{ t('configuration.extra_charge.per_quantity') }}</option>
                  <option value="per_night">{{ t('configuration.extra_charge.per_night') }}</option>
                  <option value="per_stay">{{ t('configuration.extra_charge.per_stay') }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('configuration.extra_charge.apply_above_charge_on') }}
                </label>
                <select v-model="formData.applyChargeOn"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
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
                  <span class="ml-2 text-sm text-gray-700">{{ t('configuration.extra_charge.apply_charge_always')
                    }}</span>
                </label>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-6" v-if="!formData.applyChargeAlways">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('configuration.extra_charge.valid_from') }}</label>
                <InputDatePicker v-model="formData.validFrom" class="w-full" />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('configuration.extra_charge.valid_to') }}</label>
                <InputDatePicker v-model="formData.validTo" class="w-full" />
              </div>
            </div>


            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                :disabled="isSaving" />
              <BasicButton type="submit" variant="primary" :icon="Save"
                :label="isEditing ? $t('configuration.extra_charge.update_extra_charge') : $t('configuration.extra_charge.save_extra_charge')"
                :loading="isSaving" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import type { Action, Column } from '../../../utils/models'
import InputDatePicker from '../../../components/forms/FormElements/InputDatePicker.vue'
import Plus from '../../../icons/Plus.vue'
import { getExtraCharges, getTaxes, postExtraCharge, updateExtraChargeById } from '../../../services/configrationApi'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { Save } from 'lucide-vue-next'

const { t } = useI18n()

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const toast = useToast()
const serviceStore = useServiceStore();
const isSaving = ref(false);
const taxes = ref<any>([])
const columns: Column[] = [
  { key: 'shortCode', label: t('configuration.extra_charge.short_code'), type: 'text' },
  { key: 'name', label: t('configuration.extra_charge.name'), type: 'text' },
  { key: 'rate', label: t('configuration.extra_charge.rate'), type: 'text' },
  { key: 'taxes', label: t('configuration.extra_charge.tax'), type: 'custom' },
  { key: 'rateInclusiveTax', label: t('configuration.extra_charge.rate_inclusive_tax'), type: 'text' },
  { key: 'fixedPrice', label: t('configuration.extra_charge.fixed_price'), type: 'custom' },
]

const actions: Action[] = [
  { label: t('edit'), variant: 'primary', handler: (item: any) => editExtraCharge(item) },
  { label: t('delete'), variant: 'danger', handler: (item: any) => deleteExtraCharge(item) }
]

const formData = reactive({
  shortCode: '',
  name: '',
  rate: 0,
  taxes: [] as string[],
  rateInclusiveTax: 0,
  fixedPrice: false,
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
  const rate = parseFloat(formData.rate.toString()) || 0
  const totalTax = formData.taxes.reduce((sum, tax) => sum + parseFloat(tax), 0)
  formData.rateInclusiveTax = rate + (rate * totalTax / 100)
}

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
  isEditing.value = true
  editingId.value = charge.id
  Object.assign(formData, charge)
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
    
    if (isEditing.value && editingId.value) {
      const editExtraCharge = { ...formData,  taxRateIds: formData.taxes.map((i:any)=>i.id)  }
      const res = await updateExtraChargeById(editingId.value!, editExtraCharge);
      if (res.status === 200 || res.status === 201) {
        toast.success(t('configuration.extra_charge.update_extra_charge') + ' successfully');
        closeModal()
        await loadata()
      } else {
        toast.error(t('something_went_wrong'))
      }
    } else {
      const newExtraCgarge = { ...formData, hotelId: serviceStore.serviceId,taxRateIds: formData.taxes.map((i:any)=>i.id)  }
      const res = await postExtraCharge(newExtraCgarge)
      if (res.status === 200 || res.status === 201) {
        toast.success(t('configuration.extra_charge.save_extra_charge') + ' successfully');
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

const deleteExtraCharge = (id: number) => {
  if (confirm(t('configuration.extra_charge.confirm_delete'))) {
    const index = extraCharges.value.findIndex(c => c.id === id)
    if (index !== -1) {
      extraCharges.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editExtraCharge(item)
  } else if (action === 'delete') {
    deleteExtraCharge(item.id)
  }
}



// Fetch identity types from API
const loadata = async () => {
  try {
    loading.value = true
    const response = await getExtraCharges()
    console.log('response',response)
    extraCharges.value = response.data.data.data || []
  } catch (error) {
    console.error('Error fetching identity types:', error)
    toast.error(t('configuration.identity_type.fetch_error'))
  } finally {
    loading.value = false
  }
}

const fetchTaxes = async () => {
  try {
    const response = await getTaxes()
    taxes.value = response.data.data.data || []
  } catch (error) {
    console.error('Error fetching taxes:', error)
    toast.error(t('configuration.tax.fetch_error'))
  }
}

fetchTaxes()
loadata() 
</script>
