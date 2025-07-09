<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield class="w-6 h-6 text-purple-600" />
                {{ $t('manage_permission') }}
              </h1>
              <p class="text-gray-600 mt-1">
                {{ $t('configure_role') }}
              </p>
            </div>

          </div>

          <!-- Search -->
        <div class="flex items-center justify-between mb-4">
          <div class="relative w-1/2">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <input
              type="text"
              v-model="searchTerm"
              :placeholder="$t('search_role')"
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div class="flex justify-end gap-3">
              <button
                @click="toggleEditMode"
                :class="
                  editMode
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                "
                class="px-4 py-2 rounded-lg border transition-colors"
              >
                {{ editMode ? $t('Cancel') : $t('edit') }}
              </button>
              <button
                v-if="editMode"
                @click="savePermissions"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
              <span v-if="!isLoading"> {{ $t('Save') }}</span>
                <span v-else class="flex items-center gap-2">
                  <Spinner class="w-4 h-4" />
                  {{ $t('Processing') }}...
                </span>
              </button>
          </div>
        </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
          <!-- Roles List -->
          <div class="lg:col-span-1 lg:sticky lg:top-20 self-start h-fit">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex justify-between py-2">
                <h2 class="font-semibold text-gray-900 mb-4">{{ $t('roles') }} ({{ filteredRoles.length }})</h2>
                <button @click="showModal" class="rounded-full bg-orange-50 p-2">
                  <Plus class="text-orange-500" />
                </button>
              </div>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                <button
                  v-for="role in filteredRoles"
                  :key="role.id"
                  @click="selectedRole = role"
                  :class="
                    selectedRole?.id === role.id
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  "
                  class="w-full text-left p-3 rounded-lg border transition-colors"
                >
                  <div class="font-medium">{{ capitalizeEachWord(role.name) }}</div>
                  <div class="text-sm text-gray-500 mt-1">
                    {{ role.permissions?.service?.length || 0 }} {{ $t('permission') }}{{role.permissions?.service?.length>0 ? 's':''  }}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Permissions Details -->
          <div class="lg:col-span-3">
            <div
              v-if="editMode && selectedRole"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h4 class="font-medium text-gray-900 mb-4">{{ $t('edit_permission') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <label
                  v-for="permission in allPermissions"
                  :key="permission"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="hasPermission(selectedRole, permission)"
                    @change="togglePermission(selectedRole, permission, $event)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div class="flex items-center gap-2">
                    <component
                      :is="iconComponent(permissionLabels[permission]?.icon)"
                      class="w-4 h-4"
                    />
                    <span class="text-gray-700">{{
                      permissionLabels[permission]?.label || permission
                    }}</span>
                  </div>
                </label>
              </div>
            </div>
            <div v-else>
              <div
                v-if="selectedRole"
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900">
                      {{ capitalizeEachWord(selectedRole.name) }}
                    </h2>
                    <p class="text-gray-600">
                      {{ selectedRole.permissions?.service?.length || 0 }} {{$t('permission')}}{{ selectedRole.permissions?.service?.length>0 ? 's' : '' }} {{$t('assigned')}}
                    </p>
                    <p class="text-sm text-gray-500 mt-1">{{ selectedRole.description }}</p>
                  </div>
                </div>

                <div v-if="Object.keys(getPermissionsByCategory(selectedRole)).length">

                  <div
                    v-for="(permissions, category) in getPermissionsByCategory(selectedRole)"
                    :key="category"
                    class="border border-gray-200 rounded-lg p-4 mb-6"
                  >
                    <h3
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-3"
                      :class="getCategoryColor(category)"
                    >
                      {{ $t(`categories.${category}`) || category }}
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        v-for="permission in permissions"
                        :key="permission"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div class="flex items-center gap-3">
                          <component
                            :is="iconComponent(permissionLabels[permission]?.icon)"
                            class="w-4 h-4"
                          />
                          <span class="text-gray-700">{{
                            permissionLabels[permission]?.label || permission
                          }}</span>
                        </div>
                        <div
                          class="w-5 h-5 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center"
                        >
                          <div class="w-2 h-2 bg-green-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-12">
                  <Shield class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p class="text-gray-500">{{ $t('no_permission') }}</p>
                </div>
              </div>

              <div
                v-else
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
              >
                <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('select_role') }}</h3>
                <p class="text-gray-600">
                  {{ $t('choose_role') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="modalOpen" @close="closeModal()">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <button
            @click="closeModal()"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill=""
              />
            </svg>
          </button>
          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ $t('new_role') }}
            </h4>
          </div>
          <form @submit.prevent="createRole" class="flex flex-col">
            <div class="h-[300px] p-2">
              <div class="space-y-8">
                <div>
                  <div class="space-y-6">
                    <Input
                      :lb="$t('Name')"
                      :id="'name'"
                      :forLabel="'name'"
                      v-model="newRole.name"
                    />
                    <div>
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {{ $t('Description') }}
                      </label>
                      <textarea
                        v-model="newRole.description"
                        :placeholder="$t('enter_description')"
                        rows="6"
                        class="dark:bg-dark-900 h-40 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <button
                @click="closeModal()"
                type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                :disabled="isLoading"
              >
                {{ $t('Cancel') }}
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="relative flex w-full justify-center items-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 sm:w-auto"
              >
                <span v-if="!isLoading"> {{ $t('Save') }}</span>
                <span v-else class="flex items-center gap-2">
                  <Spinner class="w-4 h-4" />
                  {{ $t('Processing') }}...
                </span>
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script lang="ts" setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { ref, computed, onMounted } from 'vue'
import { getPermission, getRoles ,updateRolePermissions,createNewRole} from '@/services/api'
import * as icons from 'lucide-vue-next'
import { useServiceStore } from '@/composables/serviceStore'
import { Shield}from 'lucide-vue-next'
import { Search }from 'lucide-vue-next'
import { Users }from 'lucide-vue-next'
import { Plus }from 'lucide-vue-next'
import type { Component } from 'vue'
import { useAuthStore } from '@/composables/user'
import Spinner from '@/components/spinner/Spinner.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Role {
  id: number
  name: string
  description: string
  permissions: {
    service: Permission[]
  }
  permissionsCount: number
}

interface Permission {
  id: string
  name: string
  label: string
  category: string
  icon: string
  createdAt: string
  updatedAt: string
}

const searchTerm = ref('')
const selectedRole = ref<Role | null>(null)
const editMode = ref(false)
const modalOpen = ref(false)
const isLoading = ref(false)
const serviceStore = useServiceStore()
const authStore = useAuthStore()

const newRole = ref({
  name: '',
  description: '',
})

const roles = ref<Role[]>([])
const permissionLabels = ref<Record<string, Permission>>({})

const closeModal = () => {
  modalOpen.value = false
  newRole.value = { name: '', description: '' }
}

const showModal = () => {
  modalOpen.value = true
}

const filteredRoles = computed(() =>
  roles.value.filter((role: Role) =>
    role.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  ),
)

const allPermissions = computed(() => {
  const allPerms = new Set<string>()
  // Récupérer toutes les permissions depuis permissionLabels
  Object.keys(permissionLabels.value).forEach((permission) => {
    allPerms.add(permission)
  })
  return Array.from(allPerms).sort()
})

function toggleEditMode() {
  editMode.value = !editMode.value
}

function hasPermission(role: Role, permission: string): boolean {
  if (!role.permissions?.service) return false
  return role.permissions.service.some((p) => p.name === permission)
}

function togglePermission(role: Role, permission: string, event: Event) {
  const target = event.target as HTMLInputElement

  if (!role.permissions) {
    role.permissions = { service: [] }
  }

  if (!role.permissions.service) {
    role.permissions.service = []
  }

  const existingIndex = role.permissions.service.findIndex((p) => p.name === permission)

  if (target.checked) {
    // Ajouter la permission si elle n'existe pas déjà
    if (existingIndex === -1) {
      const permissionData = permissionLabels.value[permission]
      if (permissionData) {
        role.permissions.service.push(permissionData)
      }
    }
  } else {
    // Supprimer la permission si elle existe
    if (existingIndex !== -1) {
      role.permissions.service.splice(existingIndex, 1)
    }
  }

  // Recalculer le nombre de permissions
  role.permissionsCount = role.permissions.service.length
}

function getPermissionsByCategory(role: Role): Record<string, string[]> {
  const categories: Record<string, string[]> = {}

  if (!role.permissions?.service) return categories

  role.permissions.service.forEach((permission) => {
    const category = permission.category || 'Autres'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(permission.name)
  })

  return categories
}

function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    Réservations: 'bg-blue-100 text-blue-800 border-blue-200',
    Chambres: 'bg-green-100 text-green-800 border-green-200',
    Utilisateurs: 'bg-purple-100 text-purple-800 border-purple-200',
    Inventaire: 'bg-orange-100 text-orange-800 border-orange-200',
    Rapports: 'bg-gray-100 text-gray-800 border-gray-200',
    Finance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Maintenance: 'bg-red-100 text-red-800 border-red-200',
    Services: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Restauration: 'bg-pink-100 text-pink-800 border-pink-200',
    Marketing: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Administration: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  }
  return colorMap[category] || 'bg-gray-100 text-gray-800 border-gray-200'
}

const fetchPermissions = async () => {
  try {
    const response = await getPermission()
    const permissionsArray: Permission[] = response.data.data
    permissionLabels.value = Object.fromEntries(
      permissionsArray.map((p) => [
        p.name,
        {
          ...p,
          get label() {
            return t(`permissions.${p.name}`)
          }
        }
      ])
    )

    // permissionLabels.value = Object.fromEntries(permissionsArray.map((p) => [p.name, p]))
  } catch (error) {
    console.error('Erreur lors du chargement des permissions', error)
  }
}

const fetchRoles = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getRoles(serviceId)
    roles.value = response.data.roles
  } catch (error) {
    console.error('Erreur lors du chargement des rôles', error)
  }
}

const savePermissions = async () => {
  if (!selectedRole.value) return

  try {
    isLoading.value = true

    const roleId = selectedRole.value.id
    const serviceId = serviceStore.serviceId
    const userId = authStore.UserId

    const permissionIds = selectedRole.value.permissions.service.map((permission: any) => ({
      permission_id: permission.id,
    }))

    const data = {
      role_id: roleId,
      service_id: serviceId,
      permissions: permissionIds,
      user_id: userId,
    }

    await updateRolePermissions(data)

    editMode.value = false
    console.log('Permissions à sauvegarder:', permissionIds)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des permissions', error)
  } finally {
    isLoading.value = false
  }
}


const createRole = async () => {
  try {
    isLoading.value = true
    const payload = {
      role_name : newRole.value.name,
      description : newRole.value.description,
      service_id : serviceStore.serviceId,
      category_id : 14,
      created_by : authStore.UserId
    }
    await createNewRole(payload);
    closeModal()
    await fetchRoles()
  } catch (error) {
    console.error('Erreur lors de la création du rôle', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchRoles()
  await fetchPermissions()
})

function capitalizeEachWord(str: string): string {
  return str.replace(/\b\w/g, (char: string) => char.toUpperCase())
}

const iconComponent = (name?: string): Component => {
  const pascalName = toPascalCase(name || '')
  const icon = icons[pascalName as keyof typeof icons]

  if (typeof icon === 'function' || (icon && typeof icon === 'object')) {
    return icon as Component
  }

  return icons.CircleHelp as Component
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
</script>

<style scoped>
/* Optional: add custom scrollbars or layout tweaks */
</style>
