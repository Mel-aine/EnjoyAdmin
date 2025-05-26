<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusCircle } from 'lucide-vue-next'
import { Route as RouteIcon } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import TableOne from '@/components/tables/TableOne.vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { createRoute, getRoute, updateRoute, deleteRoute } from '@/services/api'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'

interface Route {
  name: string
  startPoint: string
  endPoint: string
  distance: number
  duration: string
  stops: string
  status: string
}

const { t } = useI18n()
const isLoading = ref(false)
const toast = useToast()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const isEditMode = ref(false)
const routes = ref<Route[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const isStatusDropdownOpen = ref(false)
const modalOpen = ref(false)
const routeId = ref(null)
const isDeleteModalOpen = ref(false)
const currentRoute = ref<any | null>(null)

const toggleStatusDropdown = () => {
  isStatusDropdownOpen.value = !isStatusDropdownOpen.value
}

const setStatusFilter = (status: any) => {
  statusFilter.value = status
  isStatusDropdownOpen.value = false
}

const formData = ref<any>({
  name: '',
  startPoint: '',
  endPoint: '',
  distance: 0,
  duration: '',
  status: '',
  stops: '',
})

//formData.value.stops = formData.value.stops?.split(',').map((s:any) => s.trim())

watch(
  () => [formData.value.startPoint, formData.value.endPoint],
  ([start, end]) => {
    formData.value.name = `${start} - ${end}`
  },
)
const titles = computed(() => [
  {
    name: 'routeName',
    label: t('name'),
    type: 'url',
    event: 'view',
    filterable: true,
  },
  {
    name: 'trajet',
    type: 'text',
    label: t('trajet'),
    filterable: false,
  },
  {
    name: 'distance',
    type: 'text',
    label: t('distance'),
    filterable: false,
  },
  {
    name: 'estimatedDuration',
    type: 'text',
    label: t('duration'),
    filterable: false,
  },
  {
    name: 'stops',
    type: 'text',
    label: t('arret'),
    filterable: false,
  },
  {
    name: 'status',
    label: t('Statut'),
    type: 'badge',
    filterable: true,
  },
  {
    name: 'Actions',
    type: 'action',
    label: t('Actions'),
    colored: true,
    actions: [
      // {
      //     name: "view",
      //     icone:
      //     `
      //      <svg class="h-6 w-6 text-slate-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>
      //     `
      //     ,
      //     event: 'view',
      // },
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

const formattedRoutes = computed(() => {
  return Array.isArray(routes.value)
    ? routes.value.map((r: any) => ({
        ...r,
        trajet: `${r.origin} → ${r.destination}`,
        status: getStatusBadge(r.status),
      }))
    : []
})

const filteredRoutes = computed(() => {
  return formattedRoutes.value.filter((r: any) => {
    const search = searchQuery.value.toLowerCase()

    const matchesSearch =
      r.routeName?.toLowerCase().includes(search) ||
      r.origin?.toLowerCase().includes(search) ||
      r.destination?.toLowerCase().includes(search)

    const statusLabel = r.status?.label?.toLowerCase() || ''
    const filter = statusFilter.value.toLowerCase()
    const matchesStatus = filter === 'all' || statusLabel === filter

    return matchesSearch && matchesStatus
  })
})

// Déterminer la couleur du badge en fonction du statut
const getStatusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: {
      label: 'Active',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    inactive: {
      label: 'Inactive',
      bg: 'bg-gray-100',
      text: 'text-gray-800',
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
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    }
  )
}

const saveItinerary = async () => {
  isLoading.value = true
  const serviceId = serviceStore.serviceId
  const userId = authStore.UserId
  try {
    if (isEditMode.value) {
      const cleanedStops = formData.value.stops
        .split(',')
        .map((s: any) => s.trim())
        .filter((s: any) => s !== '')
      const [hours, minutes] = formData.value.duration.split(':').map(Number)
      const durationInMinutes = hours * 60 + minutes
      const payload = {
        route_name: formData.value.name,
        origin: formData.value.startPoint,
        destination: formData.value.endPoint,
        distance: formData.value.distance,
        estimated_duration: durationInMinutes,
        stops: cleanedStops,
        status: formData.value.status,
        last_modified_by: userId,
      }

      await updateRoute(routeId.value, payload)
      toast.success(t('toast.SucessUpdate'))
    } else {
      const cleanedStops = formData.value.stops
        .split(',')
        .map((s: any) => s.trim())
        .filter((s: any) => s.length > 0)
      const [hours, minutes] = formData.value.duration.split(':').map(Number)
      const durationInMinutes = hours * 60 + minutes
      const payload = {
        service_id: serviceId,
        route_name: formData.value.name,
        origin: formData.value.startPoint,
        destination: formData.value.endPoint,
        distance: formData.value.distance,
        estimated_duration: durationInMinutes,
        stops: JSON.stringify(cleanedStops),
        status: formData.value.status,
        created_by: userId,
      }
      console.log('fff', payload)
      await createRoute(payload)
      toast.success(t('toast.success'))
    }

    closeAddModal()
    isEditMode.value = false
    await getRoutes()
  } catch (error) {
    console.error('Error while saving', error)
    toast.error(t('toast.error'))
  } finally {
    isLoading.value = false
  }
}

const getRoutes = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getRoute(Number(serviceId))
    routes.value = Array.isArray(response.data) ? response.data : []
    //routes.value = response.data
    console.log('route', response.data)
  } catch (error) {
    console.log('error getRoute', error)
  }
}

onMounted(async () => {
  setTimeout(async () => {
    await getRoutes()
    loading.value = false
  }, 500)
})

const openAddModal = () => {
  modalOpen.value = true
  isEditMode.value = false
}

const closeAddModal = () => {
  modalOpen.value = false
  isEditMode.value = true
  formData.value = {
    name: '',
    startPoint: '',
    endPoint: '',
    distance: 0,
    duration: '',
    status: '',
    stops: '',
  }
}

// Fonction pour afficher les détails d'un itinéraire
const viewRouteDetails = (routeId: number) => {
  // Implémentation de la navigation vers les détails
  console.log(`Afficher les détails de l'itinéraire ${routeId}`)
}

const handleEdit = (route: any) => {
  isEditMode.value = true
  modalOpen.value = true

  const totalMinutes = parseInt(route.estimatedDuration)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

  formData.value.name = route.routeName
  formData.value.startPoint = route.origin
  formData.value.endPoint = route.destination
  formData.value.distance = parseFloat(route.distance)
  formData.value.duration = formattedDuration
  formData.value.status = route.status
  formData.value.stops = route.stops.join(', ')

  routeId.value = route.id

  console.log('Itinéraire en édition :', formData.value)
}

const deletesVehicle = async () => {
  isLoading.value = true
  if (!currentRoute.value) return

  try {
    const routeId = currentRoute.value.id
    console.log('Deleting routeId ID:', routeId)

    await deleteRoute(routeId)

    routes.value = routes.value.filter((r: any) => r.id !== routeId)

    toast.success(t('toast.DeletedSuccess'))
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    toast.error(t('toast.errorDelete'))
  } finally {
    isLoading.value = false
    closeDeleteModal()
    currentRoute.value = null
  }
}

const handleRemove = (route: any) => {
  currentRoute.value = route
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  currentRoute.value = null
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

const status = computed(() => [
  { label: 'active', value: 'active' },
  { label: 'inactive', value: 'inactive' },
  // { label: 'maintenance', value: 'maintenance' },
  // {label:'out_of_order',value:'out_of_order'},
])
</script>

<template>
  <AdminLayout>
    <div class="p-6 min-h-screen">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-gray-900 flex items-center">
          <RouteIcon class="h-6 w-6 mr-2 text-orange-600" />
          {{ t('Tous les itinéraires') }}
        </h1>
        <button
          @click="openAddModal"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg> -->
          <PlusCircle class="mr-2" />
          {{ t('Ajouter un itinéraire') }}
        </button>
      </div>

      <!-- Filtres et recherche -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
        >
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              :placeholder="t('Rechercher un itinéraire...')"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                class="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          <div class="flex space-x-2">
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
                        : statusFilter === 'active'
                          ? 'Actifs'
                          : statusFilter === 'inactive'
                            ? 'Inactifs'
                            : 'En maintenance',
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
                      @click="setStatusFilter('active')"
                      class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600"
                    >
                      {{ $t('Actifs') }}
                    </button>
                  </li>
                  <li>
                    <button
                      @click="setStatusFilter('inactive')"
                      class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600"
                    >
                      {{ $t('Inactifs') }}
                    </button>
                  </li>
                  <!-- <li>
                  <button @click="setStatusFilter('maintenance')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('En maintenance') }}
                  </button>
                </li> -->
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des itinéraires -->
      <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div v-if="loading" class="p-6 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-orange-500 border-gray-200"
          ></div>
          <p class="mt-2 text-gray-500">{{ t('Chargement des itinéraires...') }}</p>
        </div>

        <div v-else-if="filteredRoutes.length === 0" class="p-6 text-center">
          <p class="text-gray-500">{{ t('Aucun itinéraire trouvé.') }}</p>
        </div>
        <div v-else>
          <TableOne
            :items="titles"
            :datas="filteredRoutes"
            :options="filterOptions"
            :filterable="true"
            :pagination="true"
            @edit="handleEdit"
            @delete="handleRemove"
          />
        </div>
      </div>
    </div>
  </AdminLayout>
  <Modal v-if="modalOpen" @close="closeAddModal">
    <template #body>
      <div
        class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <!-- close btn -->
        <button
          @click="closeAddModal"
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
        <div class="px-2 pr-14">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ isEditMode ? $t('Edit') : $t('Add Itinerary') }}
          </h4>
        </div>
        <form @submit.prevent="saveItinerary" class="flex flex-col">
          <div class="custom-scrollbar h-[400px] overflow-y-auto p-2">
            <div>
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Input
                    :lb="$t('Name')"
                    :placeholder="$t('Name')"
                    :id="'name'"
                    :forLabel="'name'"
                    v-model="formData.name"
                    :disabled="true"
                  />
                </div>

                <div>
                  <Input
                    :lb="$t('depart')"
                    :placeholder="$t('depart')"
                    :id="'last'"
                    :forLabel="'last'"
                    v-model="formData.startPoint"
                  />
                </div>
                <div>
                  <Input
                    :lb="$t('destination')"
                    :placeholder="$t('destination')"
                    :id="'last'"
                    :forLabel="'last'"
                    v-model="formData.endPoint"
                  />
                </div>

                <div>
                  <Input
                    :lb="$t('distance') + ' (km)'"
                    :placeholder="$t('distance')"
                    :id="'code'"
                    :forLabel="'code'"
                    :inputType="'number'"
                    v-model.number="formData.distance"
                  />
                </div>
                <div>
                  <Input
                    :lb="$t('duree')"
                    :inputType="'time'"
                    :placeholder="$t('duration')"
                    :id="'duree'"
                    :forLabel="'duree'"
                    v-model="formData.duration"
                  />
                </div>
                <div>
                  <Select :lb="$t('status')" v-model="formData.status" :options="status" />
                </div>
              </div>
              <div class="mt-4">
                <label
                  :for="'stops'"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  {{ $t('arret') }} ({{ $t('SeparateWithComma') }})
                </label>
                <textarea
                  id="stops"
                  v-model="formData.stops"
                  placeholder="Mbalmayo, Ebolowa, Kumba, Mutengene"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
            <button
              @click="closeAddModal"
              type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              {{ $t('Cancel') }}
            </button>
            <button
              type="submit"
              class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
            >
              <span v-if="!isLoading"> {{ isEditMode ? $t('Edit') : $t('Save') }}</span>
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

  <div
    v-if="isDeleteModalOpen && currentRoute"
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
        Êtes-vous sûr de vouloir supprimer l itinéraire {{ currentRoute.routeName }} ?
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
</template>
