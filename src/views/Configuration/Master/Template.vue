<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        :title="$t('configuration.template.title')"
        :columns="columns"
        :data="templates"
        :actions="actions"
        :search-placeholder="$t('configuration.template.search_placeholder')"
        :loading="loading"
        :selectable="false"
        :empty-state-title="$t('configuration.template.empty_state_title')"
        :empty-state-message="$t('configuration.template.empty_state_message')"
        @action="onAction"
        :meta="paginationMeta"
        @page-change="handlePageChange"
      >
        <template #header-actions>
          <BasicButton
            variant="primary"
            :icon="PlusIcon"
            :label="$t('configuration.template.add_template')"
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

         <template #column-createdBy="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.creator?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedBy="{ item }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">{{ item.modifier?.fullName }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>
      <!-- Add/Edit Modal (Right Drawer) -->
      <SidePanelModal
        :isOpen="showModal"
        :title="isEditing ? $t('configuration.template.edit_template') : $t('configuration.template.add_new_template')"
        @close="closeModal"
        :maxWidthClass="'sm:max-w-4xl'"
      >
        <form @submit.prevent="saveTemplate" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <Input
              :lb="$t('configuration.template.fields.template_name')"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="$t('configuration.template.fields.template_name_placeholder')"
            />

            <Select
              :lb="$t('configuration.template.fields.template_category')"
              :isRequired="true"
              v-model="formData.category"
              :options="categoryOptions"
              :defaultValue="$t('configuration.template.fields.select_category')"
            />
               <Select
              :lb="$t('configuration.template.fields.email_account')"
              :isRequired="true"
              v-model="formData.emailAccount"
              :options="emailAccountOptions"
              :defaultValue="$t('configuration.template.fields.select_email_account')"
            />
          </div>



          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          </div>

          <!-- CC/BCC selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CC</label>
              <div class="border rounded p-2 max-h-36 overflow-auto space-y-1">
                <label v-for="acc in emailAccounts" :key="acc.id" class="flex items-center gap-2 text-sm">
                  <input type="checkbox" :value="acc.emailAddress" v-model="formData.cc" />
                   <span class="text-gray-500">{{ acc.emailAddress }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BCC</label>
              <div class="border rounded p-2 max-h-36 overflow-auto space-y-1">
                <label v-for="acc in emailAccounts" :key="'bcc-' + acc.id" class="flex items-center gap-2 text-sm">
                  <input type="checkbox" :value="acc.emailAddress" v-model="formData.bcc" />
                 <span class="text-gray-500">{{ acc.emailAddress }}</span>
                </label>
              </div>
            </div>
          </div>

          <Input
            :lb="$t('configuration.template.fields.subject')"
            :inputType="'text'"
            :isRequired="true"
            v-model="formData.subject"
            :placeholder="$t('configuration.template.fields.subject_placeholder')"
          />

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('configuration.template.fields.message_body') }} <span class="text-red-500">*</span>
            </label>
            <!-- Token insert helpers -->
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="text-xs text-gray-600 dark:text-gray-300 mr-2">{{ $t('configuration.template.fields.insert_field') }}</span>
              <div class="w-40">
                <Select
                  :lb="'Group'"
                  v-model="selectedTokenGroup"
                  :options="tokenGroupOptions"
                  :defaultValue="'Select group'"
                />
              </div>
              <div class="w-48">
                <Select
                  :lb="'Token'"
                  v-model="selectedToken"
                  :options="tokenOptions"
                  :defaultValue="'Select token'"
                />
              </div>
              <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click="insertToken">
                {{ $t('configuration.template.actions.add_token') }}
              </button>
            </div>
            <RichTextEditor
              v-model="formData.messageBody"
              :placeholder="$t('configuration.template.fields.message_body_placeholder')"
            />
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
              :label="isEditing ? $t('configuration.template.update_template') : $t('configuration.template.add_template')"
              :loading="saving"
            />
          </div>
        </form>
      </SidePanelModal>
    </div>

     <ConfirmationModal
      v-model:show="showConfirmModal"
      :is-open="showConfirmModal"
      :loading="isDeletingLoading"
      :title="t('confirmDelete')"
      :message="t('configuration.template.delete_confirm')"
      action="DANGER"
      :confirm-text="$t('Confirm')"
      :cancel-text="$t('Cancel')"
      @close="showConfirmModal=false;deleteItem=null"
      @confirm="confirmDelete"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import RichTextEditor from '@/components/forms/FormElements/RichTextEditor.vue'
import SidePanelModal from '@/components/modal/SidePanelModal.vue'
import type { Action, Column } from '../../../utils/models'
import PlusIcon from '../../../icons/Plus.vue'
// Icons
import { getTemplateCategories, emailAccountsApi, emailTemplatesApi } from '@/services/configrationApi'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { useI18n } from 'vue-i18n'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'
import { Edit, Edit2, Trash2 } from 'lucide-vue-next'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

// Reactive data
const showModal = ref(false)
const showConfirmModal = ref(false)
const isDeletingLoading = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const deleteItem = ref<any>(null)
const paginationMeta = ref<any>(null)
const currentPage = ref(1)
const loading = ref(false)
const saving = ref(false)
const toast = useToast()
const { t } = useI18n()

const formData = reactive({
  name: '',
  category: '',
  emailAccount: '',
  subject: '',
  messageBody: '',
  cc: [] as string[],
  bcc: [] as string[]
})

// Templates data
const templates = ref([])

// Fetch email templates
const fetchEmailTemplates = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      hotelId :  useServiceStore().serviceId,
      page: page,
      limit: 10,
      includeDeleted: false
    }
    const response = await emailTemplatesApi.getEmailTemplates(params)
    console.log('response',response)
    templates.value = response.data || []
    paginationMeta.value = response.meta || []
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching email templates:', error)
    toast.error(t('Failed to load email templates'))
  } finally {
    loading.value = false
  }
}

// Dynamic Options
const categoryOptions = ref<Array<{ label: string; value: string }>>([])
const emailAccountOptions = ref<Array<{ label: string; value: string }>>([])
const emailAccounts = ref<any[]>([])
const selectedTokenGroup = ref<'hotel' | 'guest' | 'general' | 'company' | ''>('')
const selectedToken = ref('')

// Fetch template categories
const fetchTemplateCategories = async () => {
  try {
    const response = await getTemplateCategories()
    const categories = response.data.data.data || []
    categoryOptions.value = categories.map((category: any) => ({
      label: category.category,
      value: category.id
    }))
  } catch (error) {
    console.error('Error fetching template categories:', error)
  }
}

// Fetch email accounts
const fetchEmailAccounts = async () => {
  try {
    const response = await emailAccountsApi.getActiveEmailAccounts(useServiceStore().serviceId!)
    console.log('response',response)
    const accounts = response.data?.data || []
    emailAccounts.value = accounts
    emailAccountOptions.value = accounts.map((account: any) => ({
      label: account.displayName,
      value: account.id
    }))
  } catch (error) {
    console.error('Error fetching email accounts:', error)
  }
}

// Token sets for insertion
const tokenSets: Record<'hotel'|'guest'|'general', string[]> = {
  hotel: [
    '{hotelname}', '{hoteladdress1}', '{hoteladdress2}', '{hotelcity}', '{postalcode}',
    '{hotelstate}', '{hotelcountry}', '{owneremail}', '{hotelphone}'
  ],
  guest: [
    '{guestname}', '{guestemail}', '{guestphone}', '{arrivaldate}', '{departuredate}', '{room}', '{rateplan}'
  ],
  general: [
    '{today}', '{reservationnumber}', '{amount}', '{currency}', '{companyname}'
  ],
}

const tokenGroupOptions = computed(() => ([
  { label: 'Hotel', value: 'hotel' },
  { label: 'Guest', value: 'guest' },
  { label: 'General', value: 'general' },
]))

const availableTokens = computed(() => tokenSets[selectedTokenGroup.value as keyof typeof tokenSets] || [])
const tokenOptions = computed(() => availableTokens.value.map(t => ({ label: t, value: t })))

const insertToken = () => {
  const token = selectedToken.value || availableTokens.value[0]
  if (!token) return
  formData.messageBody = (formData.messageBody || '') + ` ${token} `
}

// Load data on component mount
onMounted(() => {
  fetchTemplateCategories()
  fetchEmailAccounts()
  fetchEmailTemplates(1)
})

// Table configuration
const columns: Column[] = [
  { key: 'name', label: t('configuration.template.columns.template_name'), type: 'text' },
  { key: 'templateCategory.category', label: t('configuration.template.columns.category'), type: 'text' },
  { key: 'subject', label: t('configuration.template.columns.subject'), type: 'text' },
  { key: 'createdBy', label: t('configuration.template.columns.created_by'), type: 'custom' },
  { key: 'modifiedBy', label: t('configuration.template.columns.modified_by'), type: 'custom' },

  // { key: 'status', label: t('configuration.template.columns.status'), type: 'custom' }
]

const actions:Action[] = [
  {
    label: t('edit'),
    handler: (item: any) => editTemplate(item),
    variant: 'primary',
    icon:Edit
  },
  {
    label: t('delete'),
    handler: (item: any) => deleteTemplate(item),
    variant: 'danger',
    icon:Trash2,
    condition: (item: any) => item?.isDeleted !== true
  },
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  showModal.value = true
  editingId.value = null
  formData.name = ''
  formData.category = ''
  formData.emailAccount = ''
  formData.subject = ''
  formData.messageBody = ''
  formData.cc = []
  formData.bcc = []

}

const editTemplate = (template: any) => {
  isEditing.value = true
  editingId.value = template.id
  formData.name = template.name
  formData.category = template.templateCategoryId
  formData.emailAccount = template.emailAccountId
  formData.subject = template.subject
  formData.messageBody = template.messageBody || ''
  formData.cc = template.cc || []
  formData.bcc = template.bcc || []
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.category = ''
  formData.emailAccount = ''
  formData.subject = ''
  formData.messageBody = ''
  formData.cc = []
  formData.bcc = []
}

const saveTemplate = async () => {
  try {
    saving.value = true

    const templateData:any = {
      hotelId: useServiceStore().serviceId!,
      name: formData.name,
      templateCategoryId: formData.category,
      subject: formData.subject,
      messageBody: formData.messageBody,
      emailAccountId: formData.emailAccount,
      cc: formData.cc,
      bcc: formData.bcc,
      isActive: true
    }
    console.log('templateData',templateData)

    if (isEditing.value && editingId.value) {
      // Update existing template
      await emailTemplatesApi.updateEmailTemplate(editingId.value, templateData)
      toast.success(t('configuration.template.update_success'))
    } else {
      // Create new template
      await emailTemplatesApi.createEmailTemplate(templateData)
      toast.success(t('configuration.template.create_success'))
    }
     closeModal()
    // Refresh the templates list
    await fetchEmailTemplates(currentPage.value)

  } catch (error) {
    console.error('Error saving template:', error)
    toast.error(t('configuration.template.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteTemplate =  (item:any) => {
deleteItem.value = item
showConfirmModal.value = true
}
const confirmDelete = async()=> {

    try {
      isDeletingLoading.value = true
      await emailTemplatesApi.deleteEmailTemplate(deleteItem.value.id)
      deleteItem.value = null
      showConfirmModal.value = false
      toast.success(t('configuration.template.delete_success'))
      // Refresh the templates list
      await fetchEmailTemplates(currentPage.value)
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error(t('configuration.template.delete_error'))
    }finally{
      isDeletingLoading.value = false
    }

}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}

const handlePageChange = (pageNumber:number) =>{
  fetchEmailTemplates(pageNumber)
}
</script>
