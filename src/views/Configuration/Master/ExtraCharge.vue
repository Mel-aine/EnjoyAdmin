<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Extra Charge</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          Add all the extra charges for the services you offer in your hotel from this screen.
        </p>

        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <BasicButton variant="primary" @click="openAddModal" icon="Plus" label="Add Charge" />
          </div>
        </div>

        <ReusableTable title="Extra Charges Management" :columns="columns" :data="extraCharges" :actions="actions"
          search-placeholder="Search extra charges..." empty-title="No extra charges found"
          empty-description="Start by adding your first extra charge." @action="onAction">
          <template #columns-taxes="{ item }">
            <div class="flex flex-wrap gap-1">
              <span v-for="tax in item.taxes" :key="tax"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ tax }}%
              </span>
              <span v-if="!item.taxes || item.taxes.length === 0"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                No Tax
              </span>
            </div>
          </template>
          <template #columns-fixedPrice="{ item }">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="item.fixedPrice ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
              {{ item.fixedPrice ? 'Yes' : 'No' }}
            </span>
          </template>
          <template #columns-status="{ item }">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ item.status }}
            </span>
          </template>
        </ReusableTable>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? t('configuration.extra_charge.edit_extra_charge') :
              t('configuration.extra_charge.add_extra_charge') }}
          </h3>

          <form @submit.prevent="saveExtraCharge">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <Input v-model="formData.shortCode" :lb="t('configuration.extra_charge.short_code')" type="text"
                  :is-required="true" :placeholder="t('configuration.extra_charge.short_code_placeholder')" />
              </div>

              <div class="mb-4">
                <Input v-model="formData.name" :lb="t('configuration.extra_charge.name')" type="text" required
                  :placeholder="t('configuration.extra_charge.name_placeholder')" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <Input v-model="formData.rate" :lb="t('configuration.extra_charge.rate')" type="number" step="0.01"
                  required @input="calculateRateInclusiveTax"
                  :placeholder="t('configuration.extra_charge.rate_placeholder')" />
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
                  <label class="flex items-center">
                    <input v-model="formData.taxes" value="5" type="checkbox" @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700">5% GST</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="formData.taxes" value="12" type="checkbox" @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700">12% GST</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="formData.taxes" value="18" type="checkbox" @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700">18% GST</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="formData.taxes" value="28" type="checkbox" @change="calculateRateInclusiveTax"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-700">28% GST</span>
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
                placeholder="Auto calculated" />
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
                <Input v-model="formData.frontDeskSortKey" :lb="t('configuration.extra_charge.front_desk_sort_key')"
                  type="number" :placeholder="t('configuration.extra_charge.front_desk_sort_key_placeholder')" />
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
            <div class="grid grid-cols-2 gap-4 mb-6">

              <div>
                <InputDatePicker v-model="formData.validFrom" :title="t('configuration.extra_charge.valid_from')" />
              </div>
              <div>
                <InputDatePicker v-model="formData.validTo" :title="t('configuration.extra_charge.valid_to')" />
              </div>
            </div>


            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" label="Cancel" />
              <BasicButton type="submit" variant="primary"
                :label="isEditing ? t('configuration.extra_charge.update_extra_charge') : t('configuration.extra_charge.save_extra_charge')" />
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

const { t } = useI18n()

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const columns: Column[] = [
  { key: 'shortCode', label: 'Short Code', type: 'text' },
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'rate', label: 'Rate', type: 'text' },
  { key: 'taxes', label: 'Taxes %', type: 'custom' },
  { key: 'rateInclusiveTax', label: 'Rate Inc. Tax', type: 'text' },
  { key: 'fixedPrice', label: 'Fixed Price', type: 'custom' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions: Action[] = [
  { label: 'Edit', variant: 'primary', handler: (item: any) => editExtraCharge(item) },
  { label: 'Delete', variant: 'danger', handler: (item: any) => deleteExtraCharge(item) }
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
  {
    id: 1,
    shortCode: 'WIFI',
    name: 'WiFi Service',
    rate: 10.00,
    taxes: ['18'],
    rateInclusiveTax: 11.80,
    fixedPrice: true,
    frontDeskSortKey: 1,
    publishOnWeb: true,
    voucherNo: 'auto_general',
    createdBy: 'admin',
    createdDate: '2013-05-13',
    modifiedBy: 'admin',
    modifiedDate: '2013-08-03',
    status: 'Active'
  },
  {
    id: 2,
    shortCode: 'LAUNDRY',
    name: 'Laundry Service',
    rate: 25.00,
    taxes: ['12', '5'],
    rateInclusiveTax: 29.25,
    fixedPrice: false,
    frontDeskSortKey: 2,
    publishOnWeb: true,
    voucherNo: 'auto_private',
    createdBy: 'admin',
    createdDate: '2013-08-03',
    modifiedBy: 'admin',
    modifiedDate: '2013-08-03',
    status: 'Active'
  },
  {
    id: 3,
    shortCode: 'PARKING',
    name: 'Parking Fee',
    rate: 15.00,
    tax: 5,
    rateInclusiveTax: 15.75,
    fixedPrice: true,
    frontDeskSortKey: 3,
    publishOnWeb: false,
    voucherNo: 'manual',
    createdBy: 'admin',
    createdDate: '2013-08-03',
    modifiedBy: 'admin',
    modifiedDate: '2013-08-03',
    status: 'Active'
  },
  {
    id: 4,
    shortCode: 'MINIBAR',
    name: 'Mini Bar',
    rate: 50.00,
    tax: 28,
    rateInclusiveTax: 64.00,
    fixedPrice: false,
    frontDeskSortKey: 4,
    publishOnWeb: true,
    voucherNo: 'auto_general',
    createdBy: 'admin',
    createdDate: '2013-08-03',
    modifiedBy: 'admin',
    modifiedDate: '2013-08-03',
    status: 'Active'
  }
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

const saveExtraCharge = () => {
  if (isEditing.value) {
    const index = extraCharges.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      extraCharges.value[index] = {
        ...formData,
        id: editingId.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    const newId = Math.max(...extraCharges.value.map(c => c.id)) + 1
    extraCharges.value.push({
      ...formData,
      id: newId,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    })
  }
  closeModal()
}

const deleteExtraCharge = (id: number) => {
  if (confirm('Are you sure you want to delete this extra charge?')) {
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
</script>
