<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <ReusableTable :columns="columns" :data="emailAccounts" :getActions="getActions" :loading="isLoadingAccounts"
          :searchPlaceholder="t('emailAccounts.searchPlaceholder')">
          <template #header-actions>
            <BasicButton variant="primary" :icon="Plus" :label="t('emailAccounts.addEmailAccount')" @click="openAddModal" />
          </template>

          <!-- Custom status column template -->
          <template #column-isActive="{ item }">
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              item.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            ]">
              {{ item.isActive ? t('Active') : t('Inactive') }}
            </span>
          </template>
          <!-- Email Verified column -->
          <template #column-isVerified="{ item }">
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              item.isVerified === true
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'

            ]">
              {{ item.isVerified === true ? t('Verified') : t('Pending') }}
            </span>
          </template>
          <!-- Custom column for created info -->
          <template #column-createdInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.createdByUser?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.createdAt) }}</div>
            </div>
          </template>

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">{{ item.lastModifiedByUser?.fullName }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
            </div>
          </template>
        </ReusableTable>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ isEditing ? t('emailAccounts.editEmailAccount') : t('emailAccounts.addEmailAccount') }}
          </h3>

          <form @submit.prevent="saveEmailAccount">
            <!-- Title -->
            <div class="mb-4">
              <Input :lb="$t('Title')" :isRequired="true" v-model="formData.title"
                :placeholder="t('emailAccounts.titlePlaceholder')" />
            </div>
            <!-- Email Address -->
            <div class="mb-4">
              <InputEmail :title="$t('Email Address')" :isRequired="true" v-model="formData.emailAddress" type="email"
                :placeholder="t('emailAccounts.emailPlaceholder')" required />
            </div>

            <!-- Display Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('emailAccounts.displayNameLabel') }} *
              </label>
              <Input v-model="formData.displayName" :placeholder="t('emailAccounts.displayNamePlaceholder')" required />
            </div>



            <!-- Signature (Rich Text) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('emailAccounts.signatureLabel') }}
              </label>
              <RichTextEditor v-model="formData.signature"
                :placeholder="t('emailAccounts.signaturePlaceholder')" />
            </div>


            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('Cancel')" :disabled="isLoading" />
              <BasicButton type="submit" variant="primary"
                :label="isEditing ? t('emailAccounts.updateEmailAccount') : t('emailAccounts.addEmailAccount')" :loading="isLoading" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
  <!-- Delete Confirmation Modal -->
  <ConfirmationModal
    v-model:show="showDeleteModal"
    :title="t('emailAccounts.deleteTitle')"
    :message="t('emailAccounts.deleteMessage')"
    :confirm-text="t('Delete')"
    :cancel-text="t('Cancel')"
    variant="danger"
    :loading="isDeleting"
    @confirm="executeDeleteEmailAccount"
    @cancel="showDeleteModal = false"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import { Plus, Loader2 } from 'lucide-vue-next'
import { emailAccountsApi } from '../../../services/configrationApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '../../../composables/serviceStore'
import InputEmail from '../../../components/forms/FormElements/InputEmail.vue'
import RichTextEditor from '../../../components/forms/FormElements/RichTextEditor.vue'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import type { Column } from '../../../utils/models'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const isLoading = ref(false)
const isLoadingAccounts = ref(false)
// Per-row loading maps
const verifyingMap = ref<Record<number, boolean>>({})
const togglingMap = ref<Record<number, boolean>>({})
// Delete confirmation state
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const deleteTargetId = ref<number | null>(null)

// Hotels data
const hotels = ref([])
const selectedHotelId = ref(0)

// Form data
const formData = ref({
  hotelId: 0,
  title: '',
  emailAddress: '',
  displayName: '',
  signature: '',
  isActive: true
})

// Email accounts data
const emailAccounts = ref<any[]>([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

// Table configuration
const columns:  Column[] = [
  { key: 'title', label: t('Title'), type: 'text' },
  { key: 'emailAddress', label: t('Email Address'), type: 'email' },
  { key: 'displayName', label: t('emailAccounts.displayNameLabel'), type: 'text' },
  { key: 'isActive', label: t('Active'), type: 'custom' },
  { key: 'isVerified', label: t('emailAccounts.emailVerified'), type: 'custom' },
  { key: 'createdInfo', label: t('Created By'), type: 'custom' },
  { key: 'modifiedInfo', label: t('Modified By'), type: 'custom' },
]

const getActions = (item:any) => {
  const isVerifying = !!verifyingMap.value[item.id]
  const isToggling = !!togglingMap.value[item.id]
  const needsVerification = item?.isVerified !== true

  const actions:any[] = [
    {
      label: t('Edit'),
      handler: (row:any) => editEmailAccount(row),
      variant: 'primary',
    },
    {
      label: isToggling ? t('emailAccounts.toggling') : (item.isActive ? t('emailAccounts.toggleInactive') : t('emailAccounts.toggleActive')),
      icon: isToggling ? Loader2 : undefined,
      handler: (row:any) => {
        if (togglingMap.value[row.id]) return
        toggleAccountStatus(row)
      },
      variant: 'secondary'
    },
    {
      label: t('Delete'),
      handler: (row:any) => confirmDeleteEmailAccount(row),
      variant: 'danger'
    }
  ]

  if (needsVerification) {
    actions.splice(1, 0, {
      label: isVerifying ? t('emailAccounts.checking') : t('emailAccounts.checkVerificationStatus'),
      icon: isVerifying ? Loader2 : undefined,
      handler: (row:any) => {
        if (verifyingMap.value[row.id]) return
        checkVerificationStatus(row)
      },
      variant: 'secondary'
    })
  }

  return actions
}




const loadEmailAccounts = async () => {
  isLoadingAccounts.value = true
  try {

    const response = await emailAccountsApi.getActiveEmailAccounts(selectedHotelId.value!);
    console.log('response', response)
    emailAccounts.value = (response.data.data || []).map((item:any) => ({
      ...item,
      isVerified: item.status === 'verify',
    }))
    pagination.value.total = response.data?.meta?.total || 0

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
    hotelId: selectedHotelId.value!,
    title: '',
    emailAddress: '',
    displayName: '',
    signature: '',
    isActive: true
  }
  showModal.value = true
}

const editEmailAccount = (item:any) => {
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
    const payload = {
      hotelId: formData.value.hotelId,
      title: formData.value.title,
      emailAddress: formData.value.emailAddress,
      displayName: formData.value.displayName,
      signature: formData.value.signature,
      isActive: formData.value.isActive
    }

    if (isEditing.value) {
      // Update existing email account (exclude statusText from API payload)
      await emailAccountsApi.updateEmailAccount(editingId.value!, payload)
      toast.success(t('emailAccountUpdatedSuccessfully'))
    } else {
      // Create new email account (exclude statusText from API payload)
      await emailAccountsApi.createEmailAccount(payload)
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

const toggleAccountStatus = async (item:any) => {
  try {
    togglingMap.value[item.id] = true
    await emailAccountsApi.toggleActiveStatus(item.id, { isActive: !item.isActive })
    toast.success(t('accountStatusUpdated'))
    await loadEmailAccounts()
  } catch (error) {
    console.error('Error toggling account status:', error)
    toast.error(t('errorUpdatingAccountStatus'))
  } finally {
    togglingMap.value[item.id] = false
  }
}

const checkVerificationStatus = async (item: any) => {
  try {
    verifyingMap.value[item.id] = true
    // Call backend route /email-accounts/validate passing the email in the body
    const response = await emailAccountsApi.validateEmailAccount(item.emailAddress)

    // Attempt to read verification flags from various possible shapes
    const data:any = response?.data ?? response
    const isVerified =  data.status === 'verify'

    // Update the local row and notify
    const idx = emailAccounts.value.findIndex((acc:any) => acc.id === item.id)
    if (idx !== -1) {
      emailAccounts.value[idx].isVerified = !!isVerified
    }

    toast.success(isVerified ? t('emailAccounts.emailIsVerified') : t('emailAccounts.emailIsNotVerified'))
  } catch (error) {
    console.error('Error validating email account:', error)
    toast.error(t('emailAccounts.failedToCheckVerificationStatus'))
  } finally {
    verifyingMap.value[item.id] = false
  }
}

const confirmDeleteEmailAccount = (item:any) => {
  deleteTargetId.value = item.id
  showDeleteModal.value = true
}

const executeDeleteEmailAccount = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await emailAccountsApi.deleteEmailAccount(deleteTargetId.value)
    toast.success(t('emailAccountDeletedSuccessfully'))
    showDeleteModal.value = false
    deleteTargetId.value = null
    await loadEmailAccounts()
  } catch (error) {
    console.error('Error deleting email account:', error)
    toast.error(t('errorDeletingEmailAccount'))
  } finally {
    isDeleting.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    hotelId: 0,
    title: '',
    emailAddress: '',
    displayName: '',
    signature: '',
    isActive: true
  }
}


// Lifecycle
onMounted(async () => {
  selectedHotelId.value = useServiceStore().serviceId!
  await loadEmailAccounts()
})

// no helpers needed after removing Email Status column
</script>
