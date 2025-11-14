<template>
  <ConfigurationLayout>
    <div class="p-6 dark:text-gray-200">



      <Modal v-if="isAddModalOpen" @close="closeModal()">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-lg bg-white p-4 dark:bg-gray-900 dark:text-gray-200 lg:p-11">
          <button @click="closeModal()"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill="" />
            </svg>
          </button>
          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ isEditing ? $t('role.edit') : $t('new_role') }}
            </h4>
          </div>
          <form @submit.prevent="addRoles" class="flex flex-col">
            <div class="h-[300px] p-2">
              <div class="space-y-8">
                <div>
                  <div class="space-y-6">
                    <Input :lb="$t('Name')" :id="'name'" :forLabel="'name'" v-model="newRole.name" />
                    <div>
                      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        {{ $t('Description') }}
                      </label>
                      <textarea v-model="newRole.description" :placeholder="$t('enter_description')" rows="6"
                        class="dark:bg-dark-900 h-40 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton
                type="button"
                variant="outline"
                @click="closeModal"
                :label="$t('cancel')"
                :disabled="isLoading"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :label="isLoading ? $t('processing') + '...' : isEditing ? $t('role.update') : $t('save')"
                :loading="isLoading"
              />
            </div>
          </form>
        </div>
      </template>
    </Modal>

      <div class="space-y-5 sm:space-y-6 min-h-screen">
        <ReusableTable
          :title="$t('roles')"
          :description="$t('configuration.roles.description')"
          :columns="columns"
          :data="roles"
          :actions="actions"
          :loading="loading"
          :searchPlaceholder="$t('configuration.roles.search_placeholder')"
          :emptyStateTitle="$t('configuration.roles.empty_state_title')"
          :emptyStateMessage="$t('configuration.roles.empty_state_message')"
          :selectable="false"
          @action="onAction"
        >
          <!-- Header Actions -->
          <template #header-actions>
            <BasicButton
              variant="primary"
              :icon="PlusIcon"
              :label="$t('role.add')"
              @click="openAddModal()"
            />
          </template>


        </ReusableTable>
      </div>
    </div>
  </ConfigurationLayout>
  <ConfirmationModal
    v-model:show="show"
    :title="$t('confirmDelete')"
    :message="$t('deleteRoleConfirmMessage')"
    :confirm-text="$t('delete')"
    :cancel-text="$t('cancel')"
    variant="danger"
    :loading="loadingDelete"
    @confirm="confirmDelete"
    @cancel="show = false"
  />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, computed } from 'vue'
import {deleteRoles,updateRoles,createRoles,getRoles} from '@/services/userApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import PlusIcon from '../../../icons/PlusIcon.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { Edit, Trash2 } from 'lucide-vue-next'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import { useAuthStore } from '@/composables/user'
import type { Column } from '@/utils/models'

// Types
interface Role {
  id: number
  name: string
  description: string
  roleName:string
}

// Async Components
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const Spinner = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'))


// Reactive data
const isAddModalOpen = ref(false)
const isLoading = ref(false)
const loading = ref(false)
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const serviceStore = useServiceStore()
const isEditing = ref(false)
const roles = ref<Role[]>([])
const show = ref(false)
const loadingDelete = ref(false)
const selectedId = ref<number | null>(null)
const showModal = ref(false)
const selectedRole = ref<Role | null>(null)
const selected = ref<Role | null>(null)
const authStore = useAuthStore()
const newRole = ref({
  name: '',
  description: '',
})

// Computed
const columns = computed<Column[]>(() => [
  { key: 'id', label: t('common.id'), type: 'text', sortable: true },
  { key: 'roleName', label: t('role.name'), type: 'text', sortable: true },
  { key: 'description', label: t('role.description'), type: 'text', sortable: true },
])

const actions = computed(() => [
  {
    label: t('common.edit'),
    action: 'edit',
    icon: Edit,
    variant: 'primary',
    handler: (item:any) => editRole(item),
  },
  {
    label: t('common.delete'),
    action: 'delete',
    icon: Trash2,
    variant: 'danger',
    handler: (item: any) => deleteRoleAction(item),
  },
])

// Methods


const openAddModal = () => {
  isAddModalOpen.value = true
}

const closeModal = () => {
  isAddModalOpen.value = false
  isEditing.value = false
  selected.value = null
  newRole.value = {
    name: '',
    description: ''
  }
}

const updateData = async () => {
  if (!selected.value?.id) {
    toast.error(t('roles.errors.select_error'))
    return
  }

  isLoading.value = true

  try {
    const serviceId = serviceStore.serviceId
    const payload = {
      service_id: serviceId,
      name: newRole.value.name,
      description: newRole.value.description,
    }

    await updateRoles(selected.value.id, payload)

    await fetchRoles()
    closeModal()
    toast.success(t('toast.SucessUpdate'))
  } catch (error:any) {

    if (error.response) {
    const code = error.response.data?.code
    if (code === 'ROLE_ALREADY_EXISTS') {
      toast.error(t('role.errors.already_exists'))
    } else {
      const message = error.response.data?.message || t('toast.updateError')
      toast.error(message)
    }
  } else {
    toast.error(t('toast.updateError'))
  }
    console.error('Update error:', error)

  } finally {
    isLoading.value = false
  }
}



const addRoles = async () => {
  if (!newRole.value.name.trim()) {
    toast.error(t('role.errors.name_required'))
    return
  }
  isLoading.value = true

  try {
    if (isEditing.value) {
      await updateData()
    } else {
      const hotelId = serviceStore.serviceId
      const payload = {
        name: newRole.value.name,
        description: newRole.value.description,
        hotelId: hotelId,
        createdBy: authStore.UserId,
      }

      await createRoles(payload)
      await fetchRoles()
      toast.success(t('toast.Sucess'))
      closeModal()
    }
  } catch (error: any) {
  console.error('Save error:', error)

  if (error.response) {
    const code = error.response.data?.code
    if (code === 'ROLE_ALREADY_EXISTS') {
      toast.error(t('role.errors.already_exists'))
    } else {
      const message = error.response.data?.message || t('toast.error')
      toast.error(message)
    }
  } else {
    toast.error(t('toast.error'))
  }
  } finally {
    isLoading.value = false
  }
}

const fetchRoles = async () => {
  loading.value = true

  try {
    const hotelId = serviceStore.serviceId

    if (!hotelId) {
      throw new Error('Hotel ID is not defined')
    }

    const rolesResponse = await getRoles(hotelId)
    console.log("rolesResponse",rolesResponse)

    // accès au tableau de départements
    const Roles = rolesResponse.data || []
    console.log('Roles', Roles)
    roles.value = Roles

    Roles.sort((a: any, b: any) => a.roleName.localeCompare(b.roleName))
  } catch (error) {
    console.error('Fetch roles error:', error)
  } finally {
    loading.value = false
  }
}



const editRole = (role: Role) => {
  selected.value = role
  newRole.value = {
    name: role.roleName,
    description: role.description,

  }
  isEditing.value = true
  isAddModalOpen.value = true
}

const deleteRoleAction = (role: Role) => {
  selectedId.value = role.id
  show.value = true
}



const confirmDelete = async () => {
  if (selectedId.value === null) return

  loadingDelete.value = true

  try {
    await deleteRoles(selectedId.value)
    roles.value = roles.value.filter(
      (d: Role) => d.id !== selectedId.value,
    )
    toast.success(t('toast.DeletedSuccess'))
  } catch (error) {
    console.error('Delete error:', error)
    toast.error(t('toast.deleteErrors'))
  } finally {
    loadingDelete.value = false
    show.value = false
    selectedId.value = null
  }
}

const onAction = (action: string, item: Role) => {
  if (action === 'edit') {
    editRole(item)
  } else if (action === 'delete') {
    deleteRoleAction(item)
  }
}



// // Lifecycle
onMounted(async () => {
  await fetchRoles()
})
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
