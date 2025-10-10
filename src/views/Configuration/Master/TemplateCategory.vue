<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('configuration.template_category.title') }}</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          {{ $t('configuration.template_category.description') }}
        </p>
        <ReusableTable 
          :title="$t('configuration.template_category.table_title')" 
          :columns="columns" 
          :data="templateCategories"
          :actions="actions" 
          :loading="loading" 
          @action="onAction"
          @selection-change="onSelectionChange"
          :search-placeholder="$t('configuration.template_category.search_placeholder')"
          :empty-title="$t('configuration.template_category.empty_state_title')"
          :empty-description="$t('configuration.template_category.empty_state_message')"
          :selectable="true"
        >
          <template v-slot:header-actions>
            <BasicButton 
              variant="primary" 
              @click="openAddModal" 
              :icon="Plus"
              :label="$t('configuration.template_category.add_template_category')" 
              :disabled="loading" 
            />
            <!-- Bulk Delete Button (Visible when items are selected) -->
            <BasicButton 
              v-if="selectedCategories.length > 0" 
              @click="handleDeleteSelected" 
              :label="$t('deleteSelected')" 
              :icon="Trash2"
              variant="danger"
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

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName }}</div>
              <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
            </div>
          </template>
        </ReusableTable>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto"
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? $t('configuration.template_category.edit_template_category') :
              $t('configuration.template_category.add_template_category') }}
          </h3>

          <form @submit.prevent="saveTemplateCategory">
            <div class="mb-4">
              <Input 
                v-model="formData.category" 
                :lb="$t('configuration.template_category.category_name')" 
                inputType="text"
                :isRequired="true" 
                :placeholder="$t('configuration.template_category.category_name_placeholder')" 
              />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
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
                :icon="Save"
                :label="isEditing ? $t('configuration.template_category.update_template_category') : $t('configuration.template_category.save_template_category')"
                :loading="saving" 
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Single Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="$t('Delete Template Category')" 
      :message="getSingleDeleteMessage()"
      :loading="isDeletingLoading" 
      :confirm-text="$t('delete')" 
      :cancel-text="$t('cancel')" 
      @confirm="confirmDeleteSingleCategory"
      @close="closeSingleDeleteModal"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="$t('Delete Selected Template Categories')" 
      :message="getBulkDeleteMessage()"
      :loading="isBulkDeletingLoading" 
      :confirm-text="$t('deleteSelected')" 
      :cancel-text="$t('cancel')" 
      @confirm="confirmBulkDeleteCategories"
      @close="closeBulkDeleteModal"
      action="DANGER"
    />
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
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { Action, Column } from '../../../utils/models'
import { Plus, Save, Trash2, Edit } from 'lucide-vue-next'
import {
  getTemplateCategories,
  postTemplateCategory,
  updateTemplateCategoryById,
  deleteTemplateCategoryById
} from '@/services/configrationApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)

// Selection & Delete State
const selectedCategories = ref<any[]>([])
const categoryToDelete = ref<any | null>(null)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

const columns = computed<Column[]>(() => [
  { key: 'category', label: t('configuration.template_category.category_name'), type: 'text' },
  { key: 'createdInfo', label: t('configuration.template_category.created_by'), type: 'custom' },
  { key: 'modifiedInfo', label: t('configuration.template_category.modified_by'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  { 
    label: t('edit'), 
    icon: Edit,
    handler: (item: any) => onAction('edit', item), 
    variant: 'primary' 
  },
  { 
    label: t('delete'), 
    icon: Trash2,
    handler: (item: any) => onAction('delete', item), 
    variant: 'danger' 
  }
])

const formData = ref<any>({
  category: ''
})

const templateCategories = ref<any[]>([])

// --- Message methods (CORRIGÉ avec les bonnes propriétés) ---
const getSingleDeleteMessage = () => {
  if (!categoryToDelete.value) return ''
  const categoryName = categoryToDelete.value.category // ✅ Utilise "category" comme propriété
  return t('configuration.template_category.delete_confirm', { name: categoryName })
}

const getBulkDeleteMessage = () => {
  const count = selectedCategories.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const categoryName = selectedCategories.value[0].category // ✅ Utilise "category" comme propriété
    return t('configuration.template_category.delete_confirm', { name: categoryName })
  } else {
    return t('configuration.template_category.bulk_delete_confirm', { count: count })
  }
}

// --- Handlers for Table and Modals ---
const onSelectionChange = (selected: any[]) => {
  selectedCategories.value = selected
}

// Single Delete Handlers
const handleDeleteCategory = (category: any) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const confirmDeleteSingleCategory = async () => {
  if (!categoryToDelete.value || !categoryToDelete.value.id) return

  isDeletingLoading.value = true
  try {
    await deleteTemplateCategoryById(categoryToDelete.value.id)
    await fetchTemplateCategories()
    toast.success(t('configuration.template_category.delete_success'))
  } catch (error) {
    console.error('Error deleting template category:', error)
    toast.error(t('configuration.template_category.delete_error'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  categoryToDelete.value = null
}

// Bulk Delete Handlers
const handleDeleteSelected = () => {
  if (selectedCategories.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDeleteCategories = async () => {
  if (selectedCategories.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedCategories.value.map(category =>
      deleteTemplateCategoryById(category.id)
    )
    await Promise.all(deletePromises)

    await fetchTemplateCategories()
    selectedCategories.value = []
    toast.success(t('configuration.template_category.bulk_delete_success', { count: deletePromises.length }))
  } catch (error) {
    console.error('Error deleting template category(s):', error)
    toast.error(t('configuration.template_category.delete_error'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

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

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editTemplateCategory(item)
  } else if (action === 'delete') {
    handleDeleteCategory(item) // 
  }
}

// Load template categories on component mount
onMounted(() => {
  fetchTemplateCategories()
})
</script>