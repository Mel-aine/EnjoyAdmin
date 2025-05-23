<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusCircle } from 'lucide-vue-next'
import { Car } from 'lucide-vue-next'
import TableOne from '@/components/tables/TableOne.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import flatPickr from 'vue-flatpickr-component'
import { createVehicle, getVehicle, updateVehicle, deleteVehicle } from '@/services/api'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'

interface Vehicle {
  id: number
  registrationNumber: string
  model: string
  brand: string
  year: number
  capacity: number
  vehicleType: string
  status: 'available' | 'in-use' | 'maintenance'
  lastMaintenanceDate: string
  nextMaintenanceDate: string
}

const vehicles = ref<Vehicle[]>([])
const isLoading = ref(false)
const toast = useToast()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const isEditMode = ref(false)
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const currentVehicle = ref<Vehicle | null>(null)
const isStatusDropdownOpen = ref(false)
const { t } = useI18n()
const vehicleId = ref(null)

// Nouvelle entrée de véhicule
const newVehicle = ref<Omit<Vehicle, 'id'>>({
  registrationNumber: '',
  model: '',
  brand: '',
  year: new Date().getFullYear(),
  capacity: 0,
  status: 'available',
  lastMaintenanceDate: '',
  nextMaintenanceDate: '',
  vehicleType: '',
})

const toggleStatusDropdown = () => {
  isStatusDropdownOpen.value = !isStatusDropdownOpen.value
}

const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}

const setStatusFilter = (status: any) => {
  statusFilter.value = status
  isStatusDropdownOpen.value = false
  console.log('status', status)
}

const titles = computed(() => [
  {
    name: 'registrationNumber',
    label: t('immatriculation'),
    type: 'text',
    event: 'view',
    filterable: true,
  },
  {
    name: 'model',
    type: 'text',
    label: t('model'),
    filterable: false,
  },
  {
    name: 'brand',
    type: 'text',
    label: t('marque'),
    filterable: false,
  },
  {
    name: 'vehicleType',
    type: 'text',
    label: t('Type de vehicule'),
    filterable: false,
  },
  // {
  //     name: 'year',
  //     type: "text",
  //     label: t('annee'),
  //     filterable: false,
  // },
  {
    name: 'capacity',
    type: 'text',
    label: t('capacity'),
    filterable: false,
  },
  {
    name: 'status',
    label: t('Statut'),
    type: 'badge',
    filterable: true,
  },
  {
    name: 'lastMaintenanceDate',
    type: 'text',
    label: t('derniere maintenance'),
    filterable: false,
  },
  {
    name: 'nextMaintenanceDate',
    type: 'text',
    label: t('prochaine maintenance'),
    filterable: false,
  },
  {
    type: 'action',
    label: t('Actions'),
    colored: true,
    actions: [
      {
        name: 'edit',
        icone: `
                    <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z"/>
                      <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
                      <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
                    </svg>
                            `,
        event: 'edit',
      },
      {
        name: 'delete',
        icone: `
                  <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  `,
        event: 'delete',
      },
    ],
  },
])

const formattedVehicles = computed(() => {
  return vehicles.value.map((vehicle: any) => ({
    ...vehicle,
    status: getVehicleStatusBadge(vehicle.status),
  }))
})

const filteredVehicles = computed(() => {
  return formattedVehicles.value.filter((vehicle: any) => {
    const search = searchQuery.value.toLowerCase()

    const matchesSearch =
      vehicle.registrationNumber?.toLowerCase().includes(search) ||
      vehicle.model?.toLowerCase().includes(search) ||
      vehicle.brand?.toLowerCase().includes(search)

    const statusLabel = vehicle.status?.label?.toLowerCase() || ''
    const filter = statusFilter.value.toLowerCase()
    const matchesStatus = filter === 'all' || statusLabel === filter

    return matchesSearch && matchesStatus
  })
})

const fetchVehicle = async () => {
  isLoading.value = true
  const serviceId = serviceStore.serviceId
  const userId = authStore.UserId

  try {
    if (isEditMode.value) {
      const payload = {
        vehicle_type: newVehicle.value.vehicleType,
        brand: newVehicle.value.brand,
        model: newVehicle.value.model,
        year: newVehicle.value.year,
        registration_number: newVehicle.value.registrationNumber,
        capacity: newVehicle.value.capacity,
        last_maintenance_date: newVehicle.value.lastMaintenanceDate,
        next_maintenance_date: newVehicle.value.nextMaintenanceDate,
        status: newVehicle.value.status,
        last_modified_by: userId,
      }

      await updateVehicle(vehicleId.value, payload)
      toast.success(t('toast.SucessUpdate'))
    } else {
      const payload = {
        service_id: serviceId,
        vehicle_type: newVehicle.value.vehicleType,
        brand: newVehicle.value.brand,
        model: newVehicle.value.model,
        year: newVehicle.value.year,
        registration_number: newVehicle.value.registrationNumber,
        capacity: newVehicle.value.capacity,
        last_maintenance_date: newVehicle.value.lastMaintenanceDate,
        next_maintenance_date: newVehicle.value.nextMaintenanceDate,
        status: newVehicle.value.status,
        created_by: userId,
      }

      await createVehicle(payload)
      toast.success(t('toast.success'))
    }

    closeAddModal()
    isEditMode.value = false
    await getVehicles()
  } catch (error) {
    console.error('Error while saving', error)
    toast.error(t('toast.error'))
  } finally {
    isLoading.value = false
  }
}

const getVehicles = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getVehicle(Number(serviceId))
    vehicles.value = response.data
    console.log('vehicle', vehicles.value)
  } catch (error) {
    console.log('error getVehicle', error)
  }
}

onMounted(async () => {
  setTimeout(async () => {
    await getVehicles()
    loading.value = false
  }, 500)
})

const getVehicleStatusBadge = (status: string) => {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    available: {
      label: 'Available',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    in_use: {
      label: 'In_use',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    },
    maintenance: {
      label: 'Maintenance',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
  }

  return (
    map[status] || {
      label: status,
      bg: 'bg-gray-100',
      text: 'text-gray-800',
    }
  )
}
const filterOptions = computed(() => [
  {
    name: t('All'),
    api: '',
  },
  {
    name: t('today'),
    api: 'today',
  },
  {
    name: t('thisweek'),
    api: 'thisweek',
  },
  {
    name: t('lastweek'),
    api: 'lastweek',
  },
  {
    name: t('thismonth'),
    api: 'thismonth',
  },
])
// Fonctions pour la gestion des véhicules
const openAddModal = () => {
  isAddModalOpen.value = true
  isEditMode.value = false
}

const closeAddModal = () => {
  isAddModalOpen.value = false
  isEditMode.value = true
  newVehicle.value = {
    registrationNumber: '',
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    capacity: 0,
    status: 'available',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    vehicleType: '',
  }
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  currentVehicle.value = null
}

const deletesVehicle = async () => {
  isLoading.value = true
  if (!currentVehicle.value) return

  try {
    const vehicleId = currentVehicle.value.id
    console.log('Deleting vehicle ID:', vehicleId)

    await deleteVehicle(vehicleId)

    vehicles.value = vehicles.value.filter((v: any) => v.id !== vehicleId)

    toast.success(t('toast.DeletedSuccess'))
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    toast.error(t('toast.errorDelete'))
  } finally {
    isLoading.value = false
    closeDeleteModal()
    currentVehicle.value = null
  }
}

const handleRemove = (vehicle: any) => {
  currentVehicle.value = vehicle
  isDeleteModalOpen.value = true
}

const handleEdit = (vehicle: any) => {
  isEditMode.value = true
  isAddModalOpen.value = true

  newVehicle.value = JSON.parse(JSON.stringify(vehicle))
  vehicleId.value = vehicle.id
}

const status = computed(() => [
  { label: 'available', value: 'available' },
  { label: 'in-use', value: 'in_use' },
  { label: 'maintenance', value: 'maintenance' },
  // {label:'out_of_order',value:'out_of_order'},
])

const vehicleType = computed(() => [
  { label: '-- Sélectionnez un type de véhicule --', value: '' },
  { label: 'Bus', value: 'Bus' },
  { label: 'Autocars', value: 'Coach' },
  { label: 'Coaster', value: 'Coaster' },
  { label: 'Camionnettes', value: 'Vans' },
  { label: 'Voiture', value: 'Car' },
  { label: 'Minibus', value: 'Minibus' },
])
</script>

<template>
  <AdminLayout>
    <div class="p-6 h-screen">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-gray-900 flex items-center">
          <Car class="h-6 w-6 mr-2 text-orange-600" />
          {{ t('Tous les Véhicules') }}
        </h1>
        <button
          @click="openAddModal"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <PlusCircle class="mr-2" />
          {{ t('Ajouter un véhicule') }}
        </button>
      </div>

      <!-- Filtres et recherche -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher par immatriculation, modèle..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div class="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="sm:w-64">
          <!-- <div class="relative">
          <select
            v-model="statusFilter"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="in-use">En service</option>
            <option value="maintenance">En maintenance</option>
          </select>
          <div class="absolute left-3 top-2.5 text-gray-400">
             <Filter  />
          </div>
        </div> -->
          <div class="relative">
            <button
              class="border border-purple-500 bg-white rounded-lg text-purple-500 px-4 py-2 flex items-center gap-2"
              @click="toggleStatusDropdown"
            >
              <span>
                {{
                  $t(
                    statusFilter === 'all'
                      ? 'Tous les statuts'
                      : statusFilter === 'available'
                        ? 'Disponible'
                        : statusFilter === 'in_use'
                          ? 'En service'
                          : 'Maintenance',
                  )
                }}
              </span>
              <svg
                class="h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </button>

            <div
              v-if="isStatusDropdownOpen"
              class="z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-56 absolute right-0"
            >
              <ul class="py-2 text-sm text-gray-700">
                <li>
                  <button
                    @click="setStatusFilter('all')"
                    class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600"
                  >
                    {{ $t('Tous les statuts') }}
                  </button>
                </li>
                <li>
                  <button
                    @click="setStatusFilter('available')"
                    class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600"
                  >
                    {{ $t('Disponible') }}
                  </button>
                </li>
                <li>
                  <button
                    @click="setStatusFilter('in_use')"
                    class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600"
                  >
                    {{ $t('En service') }}
                  </button>
                </li>
                <li>
                  <button
                    @click="setStatusFilter('maintenance')"
                    class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600"
                  >
                    {{ $t('maintenance') }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white shadow-sm rounded-lg">
        <div v-if="loading" class="p-6 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-orange-500 border-gray-200"
          ></div>
          <p class="mt-2 text-gray-500">{{ t('Chargement des vehicule...') }}</p>
        </div>

        <div v-else-if="filteredVehicles.length === 0" class="p-6 text-center">
          <p class="text-gray-500">{{ t('Aucun vehicule trouvé.') }}</p>
        </div>
        <div v-else>
          <TableOne
            :items="titles"
            :datas="filteredVehicles"
            :options="filterOptions"
            :filterable="true"
            :pagination="true"
            @edit="handleEdit"
            @delete="handleRemove"
          />
        </div>
      </div>

      <!-- Modal d'ajout de véhicule -->

      <Modal v-if="isAddModalOpen" @close="isAddModalOpen = false">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
          >
            <!-- close btn -->
            <button
              @click="isAddModalOpen = false"
              class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
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
            <h2 class="text-xl font-bold mb-4">{{ isEditMode ? $t('Edit') : $t('Add') }}</h2>
            <form @submit.prevent="fetchVehicle" class="flex flex-col">
              <div class="custom-scrollbar h-[500px] overflow-y-auto p-2">
                <div class="space-y-8">
                  <!-- Section principale -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Input
                        v-model="newVehicle.registrationNumber"
                        :lb="'Immatriculation'"
                        :id="'imm'"
                        :forLabel="'imm'"
                      />
                    </div>
                    <div>
                      <Input
                        v-model="newVehicle.model"
                        :lb="'Modèle'"
                        :id="'mode'"
                        :forLabel="'mode'"
                      />
                    </div>
                    <div>
                      <Input
                        v-model="newVehicle.brand"
                        :lb="'Marque'"
                        :id="'marque'"
                        :forLabel="'marque'"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Input
                        v-model.number="newVehicle.capacity"
                        :inputType="'number'"
                        :lb="'Capacity'"
                        :id="'cap'"
                        :forLabel="'cap'"
                      />
                    </div>
                    <div>
                      <Input
                        v-model.number="newVehicle.year"
                        :inputType="'number'"
                        :lb="'Annee'"
                        :id="'year'"
                        :forLabel="'year'"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {{ $t('Dernière maintenance') }}
                      </label>
                      <div class="relative">
                        <flat-pickr
                          v-model="newVehicle.lastMaintenanceDate"
                          :config="flatpickrConfig"
                          class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                          :placeholder="$t('Selectdate')"
                        />
                        <span
                          class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
                        >
                          <svg
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                              fill=""
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {{ $t('Prochaine maintenance') }}
                      </label>
                      <div class="relative">
                        <flat-pickr
                          v-model="newVehicle.nextMaintenanceDate"
                          :config="flatpickrConfig"
                          class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                          :placeholder="$t('Selectdate')"
                        />
                        <span
                          class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
                        >
                          <svg
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                              fill=""
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Select :lb="'status'" :options="status" v-model="newVehicle.status" />
                    </div>
                    <div>
                      <Select
                        v-model="newVehicle.vehicleType"
                        :lb="'Type de vehicule'"
                        :options="vehicleType"
                      />
                    </div>

                    <!-- <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dernière maintenance</label>
              <input v-model="newVehicle.lastMaintenanceDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prochaine maintenance</label>
              <input v-model="newVehicle.nextMaintenanceDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div> -->
                  </div>
                  <div class="flex justify-end space-x-3 mt-20">
                    <button
                      type="button"
                      @click="closeAddModal"
                      class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="isLoading"
                      class="relative flex w-full justify-center items-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 sm:w-auto"
                    >
                      <span v-if="!isLoading"> {{ isEditMode ? $t('Edit') : $t('Save') }}</span>
                      <span v-else class="flex items-center gap-2">
                        <Spinner class="w-4 h-4" />
                        {{ $t('Processing') }}...
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- Modal de confirmation de suppression -->

      <div
        v-if="isDeleteModalOpen && currentVehicle"
        class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999"
      >
        <div
          class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[10px]"
          aria-hidden="true"
          @click="$emit('close')"
        ></div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
          <h2 class="text-xl font-bold mb-4">Confirmer la suppression</h2>
          <p class="mb-6">
            Êtes-vous sûr de vouloir supprimer le véhicule {{ currentVehicle.brand }}
            {{ currentVehicle.model }} ({{ currentVehicle.registrationNumber }}) ?
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              @click="deletesVehicle"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <span v-if="!isLoading"> Supprimer</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
