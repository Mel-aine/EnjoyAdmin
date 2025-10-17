<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable :title="$t('configuration.template_category.table_title')" :columns="columns"
        :data="templateCategories" :actions="actions" :loading="loading" @action="onAction"
        :search-placeholder="$t('configuration.template_category.search_placeholder')"
        :empty-title="$t('configuration.template_category.empty_state_title')"
        :empty-description="$t('configuration.template_category.empty_state_message')">
        <template v-slot:header-actions>
          <BasicButton variant="primary" @click="openAddModal" :icon="Plus"
            :label="$t('configuration.template_category.add_template_category')" :disabled="loading"/>
        </template>
        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.fullName }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT( item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.fullName }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? $t('configuration.template_category.edit_template_category') :
              $t('configuration.template_category.add_template_category') }}
          </h3>

          <form @submit.prevent="saveTemplateCategory">
            <div class="mb-4">
              <Input v-model="formData.category" :lb="$t('configuration.template_category.category_name')"
                inputType="text" :isRequired="true"
                :placeholder="$t('configuration.template_category.category_name_placeholder')" />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                :disabled="saving" />
              <BasicButton type="submit" variant="primary" :icon="Save"
                :label="isEditing ? $t('configuration.template_category.update_template_category') : $t('configuration.template_category.save_template_category')"
                :loading="saving" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  getTemplateCategories,
  postTemplateCategory,
  updateTemplateCategoryById,
  deleteTemplateCategoryById
} from '@/services/configrationApi'
import { Save } from 'lucide-vue-next'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)

const columns = computed<Column[]>(() => [
  { key: 'category', label: t('configuration.template_category.category_name'), type: 'text' },
  { key: 'createdInfo', label: t('configuration.template_category.created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.template_category.modified_by'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  { label: t('edit'), handler: (item: any) => editTemplateCategory(item), variant: 'primary' },
  { label: t('delete'), handler: (item: any) => deleteTemplateCategory(item), variant: 'danger' }
])

const formData = ref<any>({
  category: ''
})

const templateCategories = ref<any[]>([])

// Fetch template categories from API
const fetchTemplateCategories = async () => {
  try {
    loading.value = true
    const response = await getTemplateCategories()
    templateCategories.value = response.data.data.data || []
  } catch (error) {
    console.error('Error fetching template categories:', error)
    toast.error(t('configuration.template_category.fetch_error'))
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    category: ''
  }
  showModal.value = true
}

const editTemplateCategory = (templateCategory: any) => {
  isEditing.value = true
  formData.value = { ...templateCategory }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveTemplateCategory = async () => {
  try {
    saving.value = true

    const templateCategoryData = {
      category: formData.value.category,
      hotelId: serviceStore.serviceId
    }

    if (isEditing.value && formData.value.id) {
      // Update existing template category
      await updateTemplateCategoryById(formData.value.id!, templateCategoryData)
      toast.success(t('configuration.template_category.update_success'))
    } else {
      // Add new template category
      await postTemplateCategory(templateCategoryData)
      toast.success(t('configuration.template_category.create_success'))
    }
    closeModal()
    await fetchTemplateCategories()
  } catch (error) {
    console.error('Error saving template category:', error)
    toast.error(t('configuration.template_category.save_error'))
  } finally {
    saving.value = false
  }
}

const deleteTemplateCategory = async (templateCategory: any) => {
  if (confirm(t('configuration.template_category.delete_confirm'))) {
    try {
      loading.value = true
      await deleteTemplateCategoryById(templateCategory.id)
      toast.success(t('configuration.template_category.delete_success'))
      await fetchTemplateCategories()
    } catch (error) {
      console.error('Error deleting template category:', error)
      toast.error(t('configuration.template_category.delete_error'))
    } finally {
      loading.value = false
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editTemplateCategory(item)
  } else if (action === 'delete') {
    deleteTemplateCategory(item)
  }
}

// Load template categories on component mount
onMounted(() => {
  fetchTemplateCategories()
})
</script>
