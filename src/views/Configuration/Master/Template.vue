<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Email Template Management"
        :columns="columns"
        :data="templates"
        :actions="actions"
        search-placeholder="Search templates..."
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
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                Cancel
              </BasicButton>
              <BasicButton 
                variant="primary" 
                type="submit"
                :label="isEditing ? $t('Update') : $t('Save')"
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
import { ref, reactive } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import type { Action, Column } from '../../../utils/models'
import Plus from '../../../icons/Plus.vue'
import { ShieldCloseIcon } from 'lucide-vue-next'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

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

// Sample data
const templates = ref([
  {
    id: 1,
    name: 'Welcome Guest',
    category: 'Welcome',
    subject: 'Welcome to Our Hotel',
    autoSend: 'Check-in',
    attachment: 'None',
    emailAccount: 'noreply@hotel.com',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active',
    scheduleDate: '2024-01-15',
    messageBody:""
  },
  {
    id: 2,
    name: 'Booking Confirmation',
    category: 'Confirmation',
    subject: 'Your Booking is Confirmed',
    autoSend: 'Reservation Created',
    attachment: 'Reservation Voucher',
    emailAccount: 'reservations@hotel.com',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Cancellation Notice',
    category: 'Cancellation',
    subject: 'Booking Cancellation Confirmation',
    autoSend: 'Reservation Cancelled',
    attachment: 'Cancellation Voucher',
    emailAccount: 'reservations@hotel.com',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Special Offer',
    category: 'Marketing',
    subject: 'Exclusive Offer Just for You!',
    autoSend: 'Manual',
    attachment: 'None',
    emailAccount: 'marketing@hotel.com',
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Invoice Template',
    category: 'Business Partner',
    subject: 'Invoice for Services',
    autoSend: 'Invoice Generated',
    attachment: 'Invoice',
    emailAccount: 'billing@hotel.com',
    createdBy: 'admin',
    createdDate: '2024-01-11',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-11',
    status: 'Inactive'
  }
])

// Options
const categoryOptions = [
  { label: 'Welcome', value: 'Welcome' },
  { label: 'Confirmation', value: 'Confirmation' },
  { label: 'Cancellation', value: 'Cancellation' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Business Partner', value: 'Business Partner' },
  { label: 'Feedback', value: 'Feedback' }
]

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

const emailAccountOptions = [
  { label: 'noreply@hotel.com', value: 'noreply@hotel.com' },
  { label: 'reservations@hotel.com', value: 'reservations@hotel.com' },
  { label: 'marketing@hotel.com', value: 'marketing@hotel.com' },
  { label: 'billing@hotel.com', value: 'billing@hotel.com' },
  { label: 'support@hotel.com', value: 'support@hotel.com' }
]

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

const saveTemplate = () => {
  if (isEditing.value && editingId.value) {
    // Update existing template
    const index = templates.value.findIndex(t => t.id === editingId.value)
    if (index !== -1) {
      templates.value[index] = {
        ...templates.value[index],
        name: formData.name,
        category: formData.category,
        autoSend: formData.autoSend,
        attachment: formData.attachment,
        emailAccount: formData.emailAccount,
        scheduleDate: formData.scheduleDate,
        subject: formData.subject,
        messageBody: formData.messageBody,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new template
    const newTemplate = {
      id: Math.max(...templates.value.map(t => t.id)) + 1,
      name: formData.name,
      category: formData.category,
      autoSend: formData.autoSend,
      attachment: formData.attachment,
      emailAccount: formData.emailAccount,
      scheduleDate: formData.scheduleDate,
      subject: formData.subject,
      messageBody: formData.messageBody,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    templates.value.push(newTemplate)
  }
  closeModal()
}

const deleteTemplate = (id: number) => {
  if (confirm('Are you sure you want to delete this template?')) {
    const index = templates.value.findIndex(t => t.id === id)
    if (index !== -1) {
      templates.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
