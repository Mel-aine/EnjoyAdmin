<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable :title="$t('configuration.payment_method.table_title')" :columns="columns" :data="payMethods"
        :actions="actions" :loading="loading" @action="onAction"
        :search-placeholder="$t('configuration.payment_method.search_placeholder')"
        :empty-title="$t('configuration.payment_method.empty_title')"
        :empty-description="$t('configuration.payment_method.empty_description')">
        <template #cardProcessing="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.cardProcessing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ item.cardProcessing ? $t('yes') : $t('no') }}
          </span>
        </template>
        <template v-slot:header-actions>
          <BasicButton variant="primary" @click="openAddModal" :icon="Plus"
            :label="$t('configuration.payment_method.add_payment_method')" :loading="loading" />
        </template>
        <template #status="{ item }">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ $t('configuration.payment_method.status_' + item.status.toLowerCase()) }}
          </span>
        </template>
          <!-- Custom column for created info -->
          <template #column-createdInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900">{{ item.creator?.fullName }}</div>
              <div class="text-xs text-gray-400">{{ formatDateT(item.createdAt) }}</div>
            </div>
          </template>

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900">{{ item.modifier?.fullName }}</div>
              <div class="text-xs text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
            </div>
          </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/40">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ isEditing ? $t('configuration.payment_method.edit_payment_method') :
              $t('configuration.payment_method.add_payment_method') }}
          </h3>

          <form @submit.prevent="savePayMethod">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <Input v-model="formData.shortCode" :lb="$t('configuration.payment_method.short_code') + ' *'"
                  inputType="text" :isRequired="true"
                  :placeholder="$t('configuration.payment_method.short_code_placeholder')" />
              </div>

              <div class="mb-4">
                <Input v-model="formData.name" :lb="$t('configuration.payment_method.payment_method') + ' *'"
                  inputType="text" :isRequired="true"
                  :placeholder="$t('configuration.payment_method.name_placeholder')" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('configuration.payment_method.type') }} *
                </label>
                <select v-model="formData.type" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200">
                  <option value="">{{ $t('configuration.payment_method.select_type') }}</option>
                  <option value="CASH">{{ $t('configuration.payment_method.type_cash') }}</option>
                  <option value="BANK">{{ $t('configuration.payment_method.type_bank') }}</option>
                </select>
              </div>

              <div class="mb-4 items-center self-center">
                <label class="flex align-baseline ">
                  <input v-model="formData.cardProcessing" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('configuration.payment_method.card_processing')
                  }}</span>
                </label>
              </div>
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input v-model="formData.surchargeSetting" type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('configuration.payment_method.surcharge_setting')
                }}</span>
              </label>
            </div>

            <div v-if="formData.surchargeSetting" class="border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4 dark:bg-gray-800/50">
              <h4 class="text-sm font-medium text-gray-900 mb-3">{{
                $t('configuration.payment_method.surcharge_configuration') }}</h4>

              <div class="grid grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ $t('configuration.payment_method.amount_percent') }}
                  </label>
                  <select v-model="formData.surchargeType"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200">
                    <option value="amount">{{ $t('configuration.payment_method.amount') }}</option>
                    <option value="percent">{{ $t('configuration.payment_method.percentage') }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <Input v-model="formData.surchargeValue" :lb="$t('configuration.payment_method.value')"
                    inputType="number" step="0.01" :placeholder="$t('configuration.payment_method.enter_value')" />
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('configuration.payment_method.extra_charge') }}
                </label>
                <select v-model="formData.extraCharge"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200">
                  <option value="">{{ $t('configuration.payment_method.select_extra_charge') }}</option>
                  <option value="service_charge">{{ $t('configuration.payment_method.service_charge') }}</option>
                  <option value="processing_fee">{{ $t('configuration.payment_method.processing_fee') }}</option>
                  <option value="convenience_fee">{{ $t('configuration.payment_method.convenience_fee') }}</option>
                </select>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('configuration.payment_method.receipt_no_setting') }}
              </label>
              <select v-model="formData.receiptNoSetting"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200">
                <option value="auto_general">{{ $t('configuration.payment_method.auto_general') }}</option>
                <option value="auto_private">{{ $t('configuration.payment_method.auto_private') }}</option>
                <option value="manual">{{ $t('configuration.payment_method.manual') }}</option>
              </select>
            </div>
          
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                :disabled="saving" />
              <BasicButton type="submit" variant="primary"
                :label="isEditing ? $t('configuration.payment_method.update_payment_method') : $t('configuration.payment_method.save_payment_method')"
                :loading="saving" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import type { Action, Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import {
  getPaymentMethods,
  postPaymentMethod,
  updatePaymentMethodById,
  deletePaymentMethodById
} from '@/services/configrationApi'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)

const columns = computed<Column[]>(() => [
  { key: 'shortCode', label: t('configuration.payment_method.short_code'), type: 'text' },
  { key: 'methodName', label: t('configuration.payment_method.payment_method'), type: 'text' },
  { key: 'type', label: t('configuration.payment_method.type'), type: 'text' },
  { key: 'cardProcessing', label: t('configuration.payment_method.card_processing'), type: 'custom' },
  { key: 'createdInfo', label: t('configuration.payment_method.created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.payment_method.modified_by'), type: 'custom' },
  { key: 'status', label: t('configuration.payment_method.status'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  { label: t('edit'), handler: (item: any) => editPayMethod(item), variant: 'primary' },
  { label: t('delete'), handler: (item: any) => deletePayMethod(item), variant: 'danger' }
])

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

const payMethods = ref<any[]>([])

// Fetch payment methods from API
const fetchPaymentMethods = async () => {
  try {
    loading.value = true
    const response = await getPaymentMethods()
    payMethods.value = response.data.data.data || []
    console.log('payment methode',payMethods.value)
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    toast.error(t('configuration.payment_method.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
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
  showModal.value = true
}

const editPayMethod = (method: any) => {
  isEditing.value = true
  formData.value = { ...method }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const savePayMethod = async () => {
  try {
    saving.value = true

    const paymentMethodData = {
      shortCode: formData.value.shortCode,
      name: formData.value.name,
      type: formData.value.type,
      cardProcessing: formData.value.cardProcessing,
      surchargeSetting: formData.value.surchargeSetting,
      surchargeType: formData.value.surchargeType,
      surchargeValue: formData.value.surchargeValue,
      extraCharge: formData.value.extraCharge,
      receiptNoSetting: formData.value.receiptNoSetting,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && formData.value.id) {
      // Update existing payment method
      await updatePaymentMethodById(formData.value.id, paymentMethodData)
      toast.success(t('configuration.payment_method.update_success'))
    } else {
      // Add new payment method
      await postPaymentMethod(paymentMethodData)
      toast.success(t('configuration.payment_method.create_success'))
    }

    await fetchPaymentMethods()
    closeModal()
  } catch (error) {
    console.error('Error saving payment method:', error)
    toast.error(t('configuration.payment_method.save_error'))
  } finally {
    saving.value = false
  }
}

const deletePayMethod = async (method: any) => {
  if (confirm(t('configuration.payment_method.delete_confirm'))) {
    try {
      loading.value = true
      await deletePaymentMethodById(method.id)
      toast.success(t('configuration.payment_method.delete_success'))
      await fetchPaymentMethods()
    } catch (error) {
      console.error('Error deleting payment method:', error)
      toast.error(t('configuration.payment_method.delete_error'))
    } finally {
      loading.value = false
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editPayMethod(item)
  } else if (action === 'delete') {
    deletePayMethod(item)
  }
}

// Load payment methods on component mount
onMounted(() => {
  fetchPaymentMethods()
})
</script>
