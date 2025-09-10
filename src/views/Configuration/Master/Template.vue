<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Email Template Management"
        :columns="columns"
        :data="templates"
        :actions="actions"
        search-placeholder="Search templates..."
        :loading="loading"
        :selectable="false"
        empty-state-title="No templates found"
        empty-state-message="Get started by adding a new email template."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            :icon="Plus"
            label="Add Template"
            @click="openAddModal"
          />
        </template>

        <template #column-status="{ item }">
          <span 
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.status }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Template' : 'Add New Template' }}
          </h3>
          
          <form @submit.prevent="saveTemplate" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                :lb="'Template Name'"
                :inputType="'text'"
                :isRequired="true"
                v-model="formData.name"
                :placeholder="'Enter template name'"
              />
              
              <Select 
                :lb="'Template Category'"
                :isRequired="true"
                v-model="formData.category"
                :options="categoryOptions"
                :defaultValue="'Select category'"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                :lb="'Auto Send'"
                v-model="formData.autoSend"
                :options="autoSendOptions"
                :defaultValue="'Select auto send action'"
              />
              
              <Select 
                :lb="'Attachment'"
                v-model="formData.attachment"
                :options="attachmentOptions"
                :defaultValue="'Select attachment'"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                :lb="'Email Account'"
                :isRequired="true"
                v-model="formData.emailAccount"
                :options="emailAccountOptions"
                :defaultValue="'Select email account'"
              />
              
              <Input 
                :lb="'Schedule Date'"
                :inputType="'date'"
                v-model="formData.scheduleDate"
              />
            </div>
            
            <Input 
              :lb="'Subject'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.subject"
              :placeholder="'Enter email subject'"
            />
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message Body <span class="text-red-500">*</span>
              </label>
              <textarea 
                v-model="formData.messageBody"
                rows="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter the email template message body..."
                required
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                variant="secondary" 
                @click="closeModal"
                :label="$t('cancel')"
                :icon="ShieldCloseIcon"
              >
              </BasicButton>
              <BasicButton 
                variant="primary" 
                type="submit"
                :label="saving ? $t('Saving...') : (isEditing ? $t('Update') : $t('Save'))"
                :disabled="saving"
              >
              </BasicButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import type { Action, Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import { ShieldCloseIcon } from 'lucide-vue-next'
import { getTemplateCategories, emailAccountsApi, emailTemplatesApi } from '@/services/configrationApi'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const saving = ref(false)
const toast = useToast()

const formData = reactive({
  name: '',
  category: '',
  autoSend: '',
  attachment: '',
  emailAccount: '',
  scheduleDate: '',
  subject: '',
  messageBody: ''
})

// Templates data
const templates = ref([])

// Fetch email templates
const fetchEmailTemplates = async () => {
  try {
    loading.value = true
    const response = await emailTemplatesApi.getEmailTemplates({hotelId:useServiceStore().serviceId!})
    templates.value = response.data || []
  } catch (error) {
    console.error('Error fetching email templates:', error)
    toast.error('Failed to load email templates')
  } finally {
    loading.value = false
  }
}

// Dynamic Options
const categoryOptions = ref<Array<{ label: string; value: string }>>([])
const emailAccountOptions = ref<Array<{ label: string; value: string }>>([])

// Fetch template categories
const fetchTemplateCategories = async () => {
  try {
    const response = await getTemplateCategories()
    const categories = response.data.data.data || []
    categoryOptions.value = categories.map((category: any) => ({
      label: category.category,
      value: category.category
    }))
  } catch (error) {
    console.error('Error fetching template categories:', error)
    toast.error('Failed to load template categories')
  }
}

// Fetch email accounts
const fetchEmailAccounts = async () => {
  try {
    const response = await emailAccountsApi.getActiveEmailAccounts(useServiceStore().serviceId!)
    const accounts = response.data || []
    console.log(accounts)
    emailAccountOptions.value = accounts.map((account: any) => ({
      label: account.displayName,
      value: account.id
    }))
  } catch (error) {
    console.error('Error fetching email accounts:', error)
    toast.error('Failed to load email accounts')
  }
}

const autoSendOptions = [
  { label: 'Manual', value: 'Manual' },
  { label: 'Check-in', value: 'Check-in' },
  { label: 'Check-out', value: 'Check-out' },
  { label: 'Reservation Created', value: 'Reservation Created' },
  { label: 'Reservation Modified', value: 'Reservation Modified' },
  { label: 'Reservation Cancelled', value: 'Reservation Cancelled' },
  { label: 'Invoice Generated', value: 'Invoice Generated' },
  { label: 'Payment Received', value: 'Payment Received' }
]

const attachmentOptions = [
  { label: 'None', value: 'None' },
  { label: 'Reservation Voucher', value: 'Reservation Voucher' },
  { label: 'Cancellation Voucher', value: 'Cancellation Voucher' },
  { label: 'Invoice', value: 'Invoice' },
  { label: 'Report', value: 'Report' }
]

// Load data on component mount
onMounted(() => {
  fetchTemplateCategories()
  fetchEmailAccounts()
  fetchEmailTemplates()
})

// Table configuration
const columns: Column[] = [
  { key: 'name', label: 'Template Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'subject', label: 'Subject', type: 'text' },
  { key: 'autoSend', label: 'Auto Send', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions:Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editTemplate(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteTemplate(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.category = ''
  formData.autoSend = ''
  formData.attachment = ''
  formData.emailAccount = ''
  formData.scheduleDate = ''
  formData.subject = ''
  formData.messageBody = ''
  showModal.value = true
}

const editTemplate = (template: any) => {
  isEditing.value = true
  editingId.value = template.id
  formData.name = template.name
  formData.category = template.category
  formData.autoSend = template.autoSend
  formData.attachment = template.attachment
  formData.emailAccount = template.emailAccount
  formData.scheduleDate = template.scheduleDate || ''
  formData.subject = template.subject
  formData.messageBody = template.messageBody || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.category = ''
  formData.autoSend = ''
  formData.attachment = ''
  formData.emailAccount = ''
  formData.scheduleDate = ''
  formData.subject = ''
  formData.messageBody = ''
}

const saveTemplate = async () => {
  try {
    saving.value = true
    
    const templateData = {
      hotelId: useServiceStore().serviceId!,
      name: formData.name,
      category: formData.category,
      subject: formData.subject,
      messageBody: formData.messageBody,
      autoSend: formData.autoSend,
      attachment: formData.attachment,
      emailAccount: formData.emailAccount,
      scheduleDate: formData.scheduleDate,
      isActive: true
    }

    if (isEditing.value && editingId.value) {
      // Update existing template
      await emailTemplatesApi.updateEmailTemplate(editingId.value, templateData)
      toast.success('Template updated successfully')
    } else {
      // Create new template
      await emailTemplatesApi.createEmailTemplate(templateData)
      toast.success('Template created successfully')
    }
    
    // Refresh the templates list
    await fetchEmailTemplates()
    closeModal()
  } catch (error) {
    console.error('Error saving template:', error)
    toast.error('Failed to save template')
  } finally {
    saving.value = false
  }
}

const deleteTemplate = async (id: number) => {
  if (confirm('Are you sure you want to delete this template?')) {
    try {
      await emailTemplatesApi.deleteEmailTemplate(id)
      toast.success('Template deleted successfully')
      // Refresh the templates list
      await fetchEmailTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
