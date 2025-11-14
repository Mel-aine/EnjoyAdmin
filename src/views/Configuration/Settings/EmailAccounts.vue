<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <ReusableTable :columns="columns" :data="emailAccounts" :actions="actions" :loading="isLoadingAccounts"
          searchPlaceholder="Search email accounts...">
          <template #header-actions>
            <BasicButton variant="primary" :icon="Plus" label="Add Email" @click="openAddModal" />
          </template>

          <!-- Custom status column template -->
          <template #column-isActive="{ item }">
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              item.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            ]">
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </span>
          </template>
        </ReusableTable>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ isEditing ? 'Edit Email Account' : 'Add Email Account' }}
          </h3>

          <form @submit.prevent="saveEmailAccount">
            <!-- Title -->
            <div class="mb-4">
              <Input :lb="$t('Title')" :isRequired="true" v-model="formData.title"
                placeholder="Enter the title for this email account" />
            </div>
            <!-- Email Address -->
            <div class="mb-4">
              <InputEmail :title="$t('Email Address')" :isRequired="true" v-model="formData.emailAddress" type="email"
                placeholder="Enter the email address" required />
            </div>

            <!-- Display Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name *
              </label>
              <Input v-model="formData.displayName" placeholder="Name to display when email is sent" required />
            </div>

            <!-- Signature -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Signature
              </label>
              <textarea v-model="formData.signature"
                placeholder="Create and edit signatures for outgoing messages, replies and forwards"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-dark-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-purple-500-500 focus:border-purple-500"
                rows="4"></textarea>
            </div>


            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" label="Cancel"
                :disabled="isLoading" />
              <BasicButton type="submit" variant="primary"
                :label="isEditing ? 'Update Email Account' : 'Add Email Account'"
                :loading="isLoading" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import { Plus } from 'lucide-vue-next'
import { emailAccountsApi } from '../../../services/configrationApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '../../../composables/serviceStore'
import InputEmail from '../../../components/forms/FormElements/InputEmail.vue'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const isLoading = ref(false)
const isLoadingAccounts = ref(false)

// Hotels data
const hotels = ref([])
const selectedHotelId = ref(null)

// Form data
const formData = ref({
  hotelId: null,
  title: '',
  emailAddress: '',
  displayName: '',
  signature: '',
  isActive: true
})

// Email accounts data
const emailAccounts = ref([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

// Table configuration
const columns = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'emailAddress', label: 'Email Address', type: 'text' },
  { key: 'displayName', label: 'Display Name', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'isActive', label: 'Status', type: 'custom' }
]

const actions = [
  {
    label: 'Edit',
    handler: (item) => editEmailAccount(item),
    variant: 'primary'
  },
  {
    label: 'Toggle Status',
    handler: (item) => toggleAccountStatus(item),
    variant: 'secondary'
  },
  {
    label: 'Delete',
    handler: (item) => deleteEmailAccount(item.id),
    variant: 'danger'
  }
]

// Computed properties
const hotelOptions = computed(() => {
  return hotels.value.map(hotel => ({
    value: hotel.id,
    label: hotel.name
  }))
})



const loadEmailAccounts = async () => {
  isLoadingAccounts.value = true
  try {

    const response = await emailAccountsApi.getActiveEmailAccounts(selectedHotelId.value);
    console.log('response', response)
    emailAccounts.value = response.data || []
    pagination.value.total = response.total || 0

  } catch (error) {
    console.error('Error loading email accounts:', error)
    toast.error(t('errorLoadingEmailAccounts'))
  } finally {
    isLoadingAccounts.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    hotelId: selectedHotelId.value || (hotels.value.length > 0 ? hotels.value[0].id : null),
    title: '',
    emailAddress: '',
    displayName: '',
    signature: '',
    isActive: true
  }
  showModal.value = true
}

const editEmailAccount = (item) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    hotelId: item.hotelId,
    title: item.title,
    emailAddress: item.emailAddress,
    displayName: item.displayName,
    signature: item.signature || '',
    isActive: item.isActive
  }
  showModal.value = true
}

const saveEmailAccount = async () => {
  if (!formData.value.hotelId) {
    toast.error(t('pleaseSelectHotel'))
    return
  }

  if (!formData.value.title.trim()) {
    toast.error(t('titleIsRequired'))
    return
  }

  if (!formData.value.emailAddress.trim()) {
    toast.error(t('emailAddressIsRequired'))
    return
  }

  if (!formData.value.displayName.trim()) {
    toast.error(t('displayNameIsRequired'))
    return
  }

  isLoading.value = true
  try {
    if (isEditing.value) {
      // Update existing email account
      await emailAccountsApi.updateEmailAccount(editingId.value, formData.value)
      toast.success(t('emailAccountUpdatedSuccessfully'))
    } else {
      // Create new email account
      await emailAccountsApi.createEmailAccount(formData.value)
      toast.success(t('emailAccountCreatedSuccessfully'))
    }

    await loadEmailAccounts()
    closeModal()
  } catch (error) {
    console.error('Error saving email account:', error)
    toast.error(t('errorSavingEmailAccount'))
  } finally {
    isLoading.value = false
  }
}

const toggleAccountStatus = async (item) => {
  try {
    await emailAccountsApi.toggleActiveStatus(item.id, { isActive: !item.isActive })
    toast.success(t('accountStatusUpdated'))
    await loadEmailAccounts()
  } catch (error) {
    console.error('Error toggling account status:', error)
    toast.error(t('errorUpdatingAccountStatus'))
  }
}

const deleteEmailAccount = async (id) => {
  if (confirm(t('confirmDeleteEmailAccount'))) {
    try {
      await emailAccountsApi.deleteEmailAccount(id)
      toast.success(t('emailAccountDeletedSuccessfully'))
      await loadEmailAccounts()
    } catch (error) {
      console.error('Error deleting email account:', error)
      toast.error(t('errorDeletingEmailAccount'))
    }
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    hotelId: null,
    title: '',
    emailAddress: '',
    displayName: '',
    signature: '',
    isActive: true
  }
}

const onHotelChange = () => {
  loadEmailAccounts()
}

// Lifecycle
onMounted(async () => {
  selectedHotelId.value = useServiceStore().serviceId
  await loadEmailAccounts()
})
</script>
