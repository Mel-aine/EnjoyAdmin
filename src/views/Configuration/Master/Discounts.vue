<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        :title="$t('configuration.discount.title')"
        :columns="columns"
        :data="discounts"
        :actions="actions"
        :search-placeholder="$t('configuration.discount.search_placeholder')"
        :selectable="false"
        :empty-state-title="$t('configuration.discount.empty_state_title')"
        :empty-state-message="$t('configuration.discount.empty_state_message')"
        :loading="loading"
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            :icon="Plus"
            :label="$t('configuration.discount.add_discount')"
            @click="openAddModal"
            :disabled="loading"
          />
        </template>
 <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.createdAt }}</div>
          </div>
        </template>
        <template #column-status="{ item }">
          <span 
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.status === 'Active' ? $t('configuration.discount.status_active') : $t('configuration.discount.status_inactive') }}
          </span>
        </template>

        <template #column-openDiscount="{ item }">
          <span 
            :class="item.openDiscount ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.openDiscount ? 'Yes' : 'No' }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? $t('configuration.discount.edit_discount') : $t('configuration.discount.add_new_discount') }}
          </h3>
          
          <form @submit.prevent="saveDiscount" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                :lb="$t('configuration.discount.short_code')"
                :inputType="'text'"
                :isRequired="true"
                v-model="formData.shortCode"
                :placeholder="$t('configuration.discount.short_code_placeholder')"
              />
              
              <Input 
                :lb="$t('configuration.discount.discount_name')"
                :inputType="'text'"
                :isRequired="true"
                v-model="formData.name"
                :placeholder="$t('configuration.discount.discount_name_placeholder')"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                :lb="$t('configuration.discount.type')"
                :isRequired="true"
                v-model="formData.type"
                :options="typeOptions"
                :defaultValue="$t('configuration.discount.select_type')"
              />
              
              <Input 
                :lb="$t('configuration.discount.value')"
                :inputType="'number'"
                :isRequired="true"
                v-model="formData.value"
                :placeholder="$t('configuration.discount.value_placeholder')"
                :min="0"
                :max="formData.type === 'percentage' ? 100 : undefined"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                :lb="$t('configuration.discount.apply_on')"
                :isRequired="true"
                v-model="formData.applyOn"
                :options="applyOnOptions"
                :defaultValue="$t('configuration.discount.select_application')"
              />
              
              <Select 
                :lb="$t('configuration.discount.status')"
                :isRequired="true"
                v-model="formData.status"
                :options="statusOptions"
                :defaultValue="$t('configuration.discount.select_status')"
              />
            </div>
            
            <div class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="openDiscount" 
                v-model="formData.openDiscount"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="openDiscount" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('configuration.discount.open_discount_label') }}
              </label>
            </div>
            
            
           <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal" 
                :label="$t('cancel')" 
                :disabled="saving"
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :label="isEditing ? $t('configuration.discount.update_discount') : $t('configuration.discount.save_discount')"
                :loading="saving"
              />
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
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import type { Action, Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import {
  getDiscounts,
  postDiscount,
  updateDiscountById,
  deleteDiscountById
} from '@/services/configrationApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)

const formData = ref({
  id: null as number | null,
  shortCode: '',
  name: '',
  type: '',
  value: '',
  applyOn: '',
  status: 'Active',
  openDiscount: false
})

const discounts = ref<any[]>([])



// Options with translations
const typeOptions = computed(() => [
  { label: t('configuration.discount.type_percentage'), value: 'percentage' },
  { label: t('configuration.discount.type_flat'), value: 'flat' }
])

const applyOnOptions = computed(() => [
  { label: t('configuration.discount.apply_room_charge'), value: 'room_charge' },
  { label: t('configuration.discount.apply_extra_charge'), value: 'extra_charge' }
])

const statusOptions = computed(() => [
  { label: t('configuration.discount.status_active'), value: 'active' },
  { label: t('configuration.discount.status_inactive'), value: 'inactive' }
])

// Table configuration with translations
const columns = computed<Column[]>(() => [
  { key: 'shortCode', label: t('configuration.discount.short_code'), type: 'text' },
  { key: 'name', label: t('configuration.discount.discount_name'), type: 'text' },
  { key: 'type', label: t('configuration.discount.type'), type: 'text',translatable: true },
  { key: 'value', label: t('configuration.discount.value'), type: 'text' },
  { key: 'applyOn', label: t('configuration.discount.apply_on'), type: 'text' },
  { key: 'openDiscount', label: t('configuration.discount.open_discount'), type: 'custom' },
  { key: 'createdInfo', label: t('configuration.discount.created_by'), type: 'custom' },
  { key: 'status', label: t('configuration.discount.status'), type: 'badge', translatable: true }
])

const actions = computed<Action[]>(() => [
  { label: t('edit'), handler: (item: any) => editDiscount(item), variant: 'primary' },
  { label: t('delete'), handler: (item: any) => deleteDiscount(item), variant: 'danger' }
])

// Fetch discounts from API
const fetchDiscounts = async () => {
  try {
    loading.value = true
    const response = await getDiscounts()
    discounts.value = response.data.data.data || []
  } catch (error) {
    console.error('Error fetching discounts:', error)
    toast.error(t('configuration.discount.fetch_error'))
  } finally {
    loading.value = false
  }
}

// Functions
const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id: null,
    shortCode: '',
    name: '',
    type: '',
    value: '',
    applyOn: '',
    status: 'active',
    openDiscount: false
  }
  showModal.value = true
}

const editDiscount = (discount: any) => {
  isEditing.value = true
  formData.value = { ...discount }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveDiscount = async () => {
  try {
    saving.value = true

    const discountData = {
      shortCode: formData.value.shortCode,
      name: formData.value.name,
      type: formData.value.type,
      value: parseFloat(formData.value.value),
      applyOn: formData.value.applyOn,
      status: formData.value.status,
      openDiscount: formData.value.openDiscount,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && formData.value.id) {
      // Update existing discount
      await updateDiscountById(formData.value.id, discountData)
      toast.success(t('configuration.discount.update_success'))
    } else {
      // Add new discount
      await postDiscount(discountData)
      toast.success(t('configuration.discount.create_success'))
    }
    closeModal()

    await fetchDiscounts()
  } catch (error) {
    console.error('Error saving discount:', error)
    toast.error(t('configuration.discount.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteDiscount = async (discount: any) => {
  if (confirm(t('configuration.discount.delete_confirm'))) {
    try {
      loading.value = true
      await deleteDiscountById(discount.id)
      toast.success(t('configuration.discount.delete_success'))
      await fetchDiscounts()
    } catch (error) {
      console.error('Error deleting discount:', error)
      toast.error(t('configuration.discount.delete_error'))
    } finally {
      loading.value = false
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editDiscount(item)
  } else if (action === 'delete') {
    deleteDiscount(item)
  }
}

// Load discounts on component mount
onMounted(() => {
  fetchDiscounts()
})
</script>
