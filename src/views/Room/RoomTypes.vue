 <!-- <template>
  <div class="">
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5">
        <DropdownMenu :menu-items="menuItems">
          <template #icon>
            <button class="border border-gray-300 bg-purple-400 rounded-lg relative">
              <svg class="h-8 w-8 text-white" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </template>
        </DropdownMenu>
      </div>
      <div class="h-screen">

        <div class="space-y-5 sm:space-y-6 mt-10">
          <TableComponent :items="titles" :datas="roomTypeData" :filterable="true" :pagination="true" :loading="loading"
            :showHeader="true" :title="$t('AllRoomType')" :pageSize="15" :showButtonAllElement="true"
            @edit="onEditRoomType" @delete="onDeleteRoomType" class="modern-table" />
        </div>

      </div>
    </AdminLayout>

    <Modal v-if="modalOpen" @close="closeModal">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">

          <button @click="closeModal"
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
              {{ isEditMode ? $t('EditRoomType') : $t('AddRoomType') }}
            </h4>
          </div>
          <form class="flex flex-col">
            <div class="custom-scrollbar h-[500px] md:h-[510px] overflow-y-auto p-2">
              <div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-6">
                  <div>
                    <Input :lb="$t('RoomName')" :placeholder="$t('RoomName')" :id="'room'" :forLabel="'room'"
                      v-model="form.name" />
                  </div>
                  <div>
                    <Input :lb="$t('DefaultGuest')" :placeholder="$t('DefaultGuest')" :id="'default_guest'"
                      inputType="Number" :forLabel="'default_guest'" v-model.number="form.default_guest" />
                  </div>
                  <div>
                    <InputCurrency :lb="$t('price')" :placeholder="$t('price')" :id="'price'" :forLabel="'price'"
                      v-model.number="form.price" />
                  </div>
                  <div>
                    <InputCurrency :lb="$t('ExtraGuestPrice')" :placeholder="$t('ExtraGuestPrice')" :id="'extra_guest'"
                      :forLabel="'extra_guest'" v-model.number="form.extra_guest" />
                  </div>
                  <div>
                    <Input :lb="$t('Vat(%)')" :placeholder="$t('Vat')" :id="'vat'" inputType="Number" :disabled="true"
                      :forLabel="'vat'" v-model.number="form.vat" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{
                      $t('final_price') }}</label>
                    <div
                      class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800">
                      {{ formatted }}
                    </div>
                  </div>
                  <div>
                    <InputCurrency :lb="$t('DefaultDeposit')" :placeholder="$t('DefaultDeposit')"
                      :id="'default_deposit'" :forLabel="'default_deposit'" v-model.number="form.default_deposit" />
                  </div>

                  <div>
                    <Select :lb="$t('Status')" :options="status" v-model="form.status" />
                  </div>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('Description') }}
                  </label>
                  <textarea v-model="form.description" :placeholder="$t('Largetext')" rows="6"
                    class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"></textarea>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
              <button @click="closeModal" type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                {{ $t('Cancel') }}
              </button>
              <button :disabled="isLoading" type="button"
                class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
                @click.prevent="handleSubmit">
                <span v-if="!isLoading">
                  {{ isEditMode ? $t('EditRoomType') : $t('AddRoomType') }}</span>
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
  </div>

  <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
  <Spinner v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75" />
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { createRoomType, getTypeProductByServiceId } from '@/services/api'
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue' // adapte le chemin
import type { RoomTypeData } from '@/types/option'
import { useServiceStore } from '@/composables/serviceStore'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import { updateRoomType, deleteRoomType } from '@/services/api'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import InputCurrency from '@/components/forms/FormElements/InputCurrency.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import { defaultRoomTypes } from '@/assets/data/roomtype'

const isLoading = ref(false)
const loading = ref(true)
const loadingDelete = ref(false)
const selectedRoomTypeId = ref<number | null>(null)
const show = ref(false)
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const serviceStore = useServiceStore()
const modalOpen = ref(false)
const currentPageTitle = computed(() => t('RoomTypes'))
const menuItems = computed(() => [
  { label: t('AddRoomType'), onClick: () => OpenModal() },
  { label: t('importdefault'), onClick: () => importDefaultDefaults() }
])
const selectedRoomType = ref<any>(null)
const isEditMode = ref(false)
const status = computed(()=>[
  { value: 'active', label: t('Active') },
  { value: 'inactive', label: t('Inactive') },
])

const roomTypeData = ref<RoomTypeData[]>([])

const titles = computed(() => [
  {
    name: 'name',
    label: t('Name'),
    type: 'text',
    sortable: true,
    filterable: false,
  },
  {
    name: 'description',
    label: t('description'),
    type: 'text',
    filterable: true,
  },

  {
    name: 'price',
    label: t('price'),
    type: 'currency',
    event: 'view',
    filterable: true,
  },
  {
    name: 'extraGuestPrice',
    label: t('ExtraGuestPrice'),
    type: 'currency',
    filterable: true,
  },
  {
    name: 'defaultDeposit',
    label: t('DefaultDeposit'),
    type: 'currency',
    filterable: true,
  },
  {
    name: 'defaultGuest',
    label: t('DefaultGuest'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'statusColor',
    label: t('Status'),
    type: 'badge',
    filterable: false,
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'Edit',
        event: 'edit',
        icone: ` <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>`,
      },
      {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
        color: 'bg-red-100 text-red-600 px-2 py-1 rounded-full',
      },
    ],
  },
])

const form = ref<any>({
  name: '',
  status: '',
  description: '',
  price: 0,
  default_guest: 0,
  extra_guest: 0,
  default_deposit: 0,
  vat: 19.25,
})

const totalWithVat = computed(() => {
  const base = form.value.price || 0
  const vatRate = form.value.vat || 0
  return Number((base + (base * vatRate) / 100).toFixed(2))
})

const formatted = computed(() => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(totalWithVat.value)
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'inactive':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const SaveRoomType = async () => {
  isLoading.value = true
  try {
    const serviceId = serviceStore.serviceId

    if (!serviceId) {
      throw new Error('Service ID is not defined')
    }
    const Payload = {
      name: form.value.name,
      description: form.value.description,
      status: form.value.status,
      service_id: serviceId,
      price: Number(totalWithVat.value),
      default_guest: form.value.default_guest,
      extra_guest_price: form.value.extra_guest,
      default_deposit: form.value.default_deposit,
    }
    console.log('roomtype', Payload)

    const roomResponse = await createRoomType(Payload)
    console.log('roomtype', roomResponse)
    modalOpen.value = false
    form.value = {
      name: '',
      status: '',
      description: '',
      price: 0,
      default_guest: 0,
      extra_guest: 0,
      default_deposit: 0,
      vat: 19.25,
    }
    fetchRoomType()
    toast.success(t('toast.roomtypesuccess'))
    console.log('Payload', Payload)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde', error)
  } finally {
    isLoading.value = false
  }
}

const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId

    if (!serviceId) {
      throw new Error('Service ID is not defined')
    }
    const response = await getTypeProductByServiceId(serviceId)

    roomTypeData.value = response.data
      .map((i: any) => {
        const statusClasses = getStatusColor(i.status).split(' ')
        return {
          ...i,
          statusColor: {
            label: t(i.status),
            bg: statusClasses[0],
            text: statusClasses[1],
          },
        }
      })

    roomTypeData.value.sort((a: any, b: any) => a.name.localeCompare(b.name))
    console.log(';;;;', roomTypeData.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}

watch(locale,fetchRoomType)

onMounted(async () => {
  await fetchRoomType()
  await new Promise((resolve) => setTimeout(resolve, 500))
  loading.value = false
})

const onEditRoomType = (type: any) => handleBookingAction('edit', type)
const onDeleteRoomType = (type: any) => handleBookingAction('delete', type)

const handleBookingAction = (action: string, type: any) => {
  if (action === 'edit') {
    const roomTypeToEdit = roomTypeData.value.find((r: any) => r.id === Number(type.id))
    selectedRoomTypeId.value = type.id

    if (roomTypeToEdit) {
      const priceTTC = roomTypeToEdit.price
      const vatRate = form.value.vat || 0

      const priceHT = Math.round(priceTTC / (1 + vatRate / 100))

      form.value = {
        name: roomTypeToEdit.name,
        status: roomTypeToEdit.status,
        description: roomTypeToEdit.description,
        price: priceHT,
        default_guest: Number(roomTypeToEdit.defaultGuest),
        extra_guest: roomTypeToEdit.extraGuestPrice,
        default_deposit: roomTypeToEdit.defaultDeposit,
        vat: vatRate,
      }

      isEditMode.value = true
      modalOpen.value = true
    }
  } else if (action === 'delete') {
    selectedRoomTypeId.value = type.id
    show.value = true
  }
}

const confirmDelete = async () => {
  if (selectedRoomTypeId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteRoomType(selectedRoomTypeId.value)
      toast.success(t('toast.roomTypeDeleted'))
      roomTypeData.value = roomTypeData.value.filter((r: any) => r.id !== selectedRoomTypeId.value)
      console.log(`Suppression du room type ID: ${selectedRoomTypeId.value}`)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(t('toast.roomTypeDeleteError'))
    } finally {
      loadingDelete.value = false
      show.value = false
      selectedRoomTypeId.value = null
    }
  }
}

const updateFormData = async () => {
  isLoading.value = true

  try {
    const serviceId = serviceStore.serviceId
    const id = selectedRoomTypeId.value
    console.log('id', id)

    if (!id) {
      toast.error(t('toast.selectError'))
      return
    }

    const roomTypePayload = {
      name: form.value.name,
      description: form.value.description,
      status: form.value.status,
      service_id: serviceId,
      price: Math.round(totalWithVat.value),
      default_guest: form.value.default_guest,
      extra_guest_price: form.value.extra_guest,
      default_deposit: form.value.default_deposit,
    }

    console.log('Payload envoyé :', roomTypePayload)
    await updateRoomType(id, roomTypePayload)
    fetchRoomType()

    toast.success(t('toast.roomTypeUpdatedSuccess'))

    // Réinitialisation du formulaire
    form.value = {
      name: '',
      status: '',
      description: '',
      price: 0,
      default_guest: 0,
      extra_guest: 0,
      default_deposit: 0,
      vat: 19.25,
    }
    selectedRoomType.value = null
    isEditMode.value = false
    modalOpen.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    toast.error(t('toast.updateError'))
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (isEditMode.value) {
      await updateFormData()
    } else {
      await SaveRoomType()
    }
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  form.value = {
    name: '',
    status: '',
    description: '',
    price: 0,
    default_guest: 0,
    extra_guest: 0,
    default_deposit: 0,
    vat: 19.25,
  }
  isEditMode.value = false
  modalOpen.value = false
}

const OpenModal = () => {
  modalOpen.value = true
  isEditMode.value = false
}

const importDefaultDefaults = async () => {
  const defaultRoomTypesData = defaultRoomTypes;
  if (defaultRoomTypesData && defaultRoomTypesData.length > 0) {
    isLoading.value = true
    try {
      const serviceId = serviceStore.serviceId

      if (!serviceId) {
        throw new Error('Service ID is not defined')
      }
      for (const roomType of defaultRoomTypesData) {
        const Payload = {
          name: roomType.name,
          description: roomType.description,
          status: 'active',
          service_id: serviceId,
          price: roomType.Prix,
          default_guest: roomType.DefaultGuest,
          extra_guest_price: roomType.ExtraGuestPrice,
          default_deposit: roomType.DefaultDeposit,
        }
        console.log('roomtype', Payload)

        await createRoomType(Payload)
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation des types de chambre par défaut', error)
    } finally {
      isLoading.value = false
      fetchRoomType()
      toast.success(t('toast.defaultRoomTypesImported'))
    }
  }
}
</script>

<style scoped>
/* Add any additional styles here if needed */
</style> -->
<!-- <template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg">
       Header
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <h1 class="text-3xl font-bold">Gestion des Chambres</h1>
        <p class="text-blue-100 mt-2">Gérez vos chambres, types et équipements</p>
      </div>

       Actions principales
      <div class="p-6 border-b">
        <div class="flex flex-wrap gap-4 mb-6">
          <button
            @click="showAddRoomModal = true"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>+</span> Nouvelle Chambre
          </button>
          <button
            @click="showAddRoomTypeModal = true"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>+</span> Nouveau Type
          </button>
          <button
            @click="exportRooms"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            📊 Exporter
          </button>
          <input
            type="file"
            @change="importRooms"
            accept=".csv"
            class="hidden"
            ref="fileInput"
          >
          <button
            @click="$refs.fileInput.click()"
            class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            📥 Importer
          </button>
        </div>

         Filtres et recherche
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recherche par numéro</label>
            <input
              v-model="searchNumber"
              type="text"
              placeholder="Ex: 101"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type de chambre</label>
            <select
              v-model="filterType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les types</option>
              <option v-for="type in roomTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              v-model="filterStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option v-for="status in roomStatuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Équipements</label>
            <select
              v-model="filterEquipment"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les équipements</option>
              <option v-for="equipment in allEquipments" :key="equipment" :value="equipment">{{ equipment }}</option>
            </select>
          </div>
        </div>
      </div>

       Onglets
      <div class="border-b">
        <nav class="flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

       Contenu des onglets
      <div class="p-6">
         Onglet Chambres
        <div v-if="activeTab === 'rooms'">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="room in filteredRooms"
              :key="room.id"
              class="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div class="p-4">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="text-lg font-semibold text-gray-800">{{ room.number }}</h3>
                  <span
                    :class="getStatusClass(room.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ room.status }}
                  </span>
                </div>

                <div class="space-y-2 text-sm text-gray-600">
                  <p><strong>Type:</strong> {{ getRoomTypeName(room.typeId) }}</p>
                  <p><strong>Capacité:</strong> {{ room.capacity }} personnes</p>
                  <p><strong>Étage:</strong> {{ room.floor }}</p>
                  <p v-if="room.equipment.length"><strong>Équipements:</strong> {{ room.equipment.join(', ') }}</p>
                  <p v-if="room.notes"><strong>Notes:</strong> {{ room.notes }}</p>
                  <p v-if="room.maintenanceUntil"><strong>Maintenance jusqu'au:</strong> {{ formatDate(room.maintenanceUntil) }}</p>
                </div>

                <div class="mt-4 flex flex-wrap gap-2">
                  <button
                    @click="editRoom(room)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    @click="changeRoomStatus(room)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Statut
                  </button>
                  <button
                    @click="deleteRoom(room)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

         Onglet Types de chambres
        <div v-if="activeTab === 'types'">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="type in roomTypes"
              :key="type.id"
              class="bg-white border rounded-lg shadow-md p-6"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-800">{{ type.name }}</h3>
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {{ getRoomCountByType(type.id) }} chambres
                </span>
              </div>

              <div class="space-y-2 text-sm text-gray-600">
                <p><strong>Capacité max:</strong> {{ type.maxCapacity }} personnes</p>
                <p><strong>Équipements:</strong> {{ type.equipment.join(', ') }}</p>
                <p v-if="type.description"><strong>Description:</strong> {{ type.description }}</p>
              </div>

              <div class="mt-4 flex gap-2">
                <button
                  @click="editRoomType(type)"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  Modifier
                </button>
                <button
                  @click="deleteRoomType(type)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

         Onglet Historique
        <div v-if="activeTab === 'history'">
          <div class="bg-white rounded-lg border">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ancien statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nouveau statut</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="entry in statusHistory" :key="entry.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(entry.timestamp) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ entry.roomNumber }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ entry.action }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ entry.oldStatus }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ entry.newStatus }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

     Modal Ajout/Modification Chambre
    <div v-if="showAddRoomModal || showEditRoomModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">
          {{ showAddRoomModal ? 'Nouvelle Chambre' : 'Modifier Chambre' }}
        </h3>

        <form @submit.prevent="showAddRoomModal ? addRoom() : updateRoom()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de chambre *</label>
              <input
                v-model="roomForm.number"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                v-model="roomForm.typeId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un type</option>
                <option v-for="type in roomTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacité *</label>
              <input
                v-model.number="roomForm.capacity"
                type="number"
                min="1"
                max="10"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Étage *</label>
              <input
                v-model.number="roomForm.floor"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Équipements</label>
              <div class="flex flex-wrap gap-2">
                <label v-for="equipment in allEquipments" :key="equipment" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="equipment"
                    v-model="roomForm.equipment"
                    class="mr-2"
                  >
                  {{ equipment }}
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes internes</label>
              <textarea
                v-model="roomForm.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              {{ showAddRoomModal ? 'Ajouter' : 'Modifier' }}
            </button>
            <button
              type="button"
              @click="closeRoomModal()"
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

     Modal Ajout/Modification Type
    <div v-if="showAddRoomTypeModal || showEditRoomTypeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">
          {{ showAddRoomTypeModal ? 'Nouveau Type' : 'Modifier Type' }}
        </h3>

        <form @submit.prevent="showAddRoomTypeModal ? addRoomType() : updateRoomType()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom du type *</label>
              <input
                v-model="roomTypeForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacité maximale *</label>
              <input
                v-model.number="roomTypeForm.maxCapacity"
                type="number"
                min="1"
                max="10"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="roomTypeForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Équipements inclus</label>
              <div class="flex flex-wrap gap-2">
                <label v-for="equipment in allEquipments" :key="equipment" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="equipment"
                    v-model="roomTypeForm.equipment"
                    class="mr-2"
                  >
                  {{ equipment }}
                </label>
              </div>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              {{ showAddRoomTypeModal ? 'Ajouter' : 'Modifier' }}
            </button>
            <button
              type="button"
              @click="closeRoomTypeModal()"
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

     Modal Changement de statut
    <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Changer le statut</h3>

        <form @submit.prevent="updateRoomStatus()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Chambre</label>
              <input
                :value="selectedRoom?.number"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut actuel</label>
              <input
                :value="selectedRoom?.status"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau statut</label>
              <select
                v-model="newStatus"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un statut</option>
                <option v-for="status in roomStatuses" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>

            <div v-if="newStatus === 'En maintenance'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Maintenance jusqu'au</label>
              <input
                v-model="maintenanceUntil"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Confirmer
            </button>
            <button
              type="button"
              @click="showStatusModal = false"
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface Room {
  id: string
  number: string
  typeId: string
  capacity: number
  floor: number
  status: string
  equipment: string[]
  notes?: string
  maintenanceUntil?: string
  hasActiveReservation?: boolean
}

interface RoomType {
  id: string
  name: string
  maxCapacity: number
  description?: string
  equipment: string[]
}

interface StatusHistoryEntry {
  id: string
  roomNumber: string
  action: string
  oldStatus: string
  newStatus: string
  timestamp: Date
}

// Data reactive
const rooms = ref<Room[]>([])
const roomTypes = ref<RoomType[]>([])
const statusHistory = ref<StatusHistoryEntry[]>([])

// États des modals
const showAddRoomModal = ref(false)
const showEditRoomModal = ref(false)
const showAddRoomTypeModal = ref(false)
const showEditRoomTypeModal = ref(false)
const showStatusModal = ref(false)

// Formulaires
const roomForm = ref<Partial<Room>>({
  number: '',
  typeId: '',
  capacity: 1,
  floor: 0,
  equipment: [],
  notes: ''
})

const roomTypeForm = ref<Partial<RoomType>>({
  name: '',
  maxCapacity: 2,
  description: '',
  equipment: []
})

// Filtres et recherche
const searchNumber = ref('')
const filterType = ref('')
const filterStatus = ref('')
const filterEquipment = ref('')
const activeTab = ref('rooms')

// Changement de statut
const selectedRoom = ref<Room | null>(null)
const newStatus = ref('')
const maintenanceUntil = ref('')

// Constantes
const roomStatuses = ['Disponible', 'Occupée', 'À nettoyer', 'Propre', 'En maintenance', 'Hors service']
const allEquipments = ['WiFi', 'Climatisation', 'Minibar', 'Télévision', 'Balcon', 'Vue mer', 'Jacuzzi', 'Kitchenette']

const tabs = [
  { id: 'rooms', name: 'Chambres' },
  { id: 'types', name: 'Types' },
  { id: 'history', name: 'Historique' }
]

// Computed
const filteredRooms = computed(() => {
  let filtered = rooms.value

  if (searchNumber.value) {
    filtered = filtered.filter(room =>
      room.number.toLowerCase().includes(searchNumber.value.toLowerCase())
    )
  }

  if (filterType.value) {
    filtered = filtered.filter(room => room.typeId === filterType.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(room => room.status === filterStatus.value)
  }

  if (filterEquipment.value) {
    filtered = filtered.filter(room =>
      room.equipment.includes(filterEquipment.value)
    )
  }

  return filtered
})

// Méthodes
const initializeData = () => {
  // Types de chambres par défaut
  roomTypes.value = [
    {
      id: 'standard',
      name: 'Standard',
      maxCapacity: 2,
      description: 'Chambre standard avec équipements de base',
      equipment: ['WiFi', 'Climatisation', 'Télévision']
    },
    {
      id: 'suite',
      name: 'Suite',
      maxCapacity: 4,
      description: 'Suite luxueuse avec salon séparé',
      equipment: ['WiFi', 'Climatisation', 'Télévision', 'Minibar', 'Jacuzzi']
    },
    {
      id: 'familiale',
      name: 'Chambre Familiale',
      maxCapacity: 6,
      description: 'Chambre spacieuse pour familles',
      equipment: ['WiFi', 'Climatisation', 'Télévision', 'Kitchenette']
    }
  ]

  // Chambres par défaut
  rooms.value = [
    {
      id: '1',
      number: '101',
      typeId: 'standard',
      capacity: 2,
      floor: 1,
      status: 'Disponible',
      equipment: ['WiFi', 'Climatisation', 'Télévision'],
      hasActiveReservation: true
    },
    {
      id: '2',
      number: '102',
      typeId: 'standard',
      capacity: 2,
      floor: 1,
      status: 'Propre',
      equipment: ['WiFi', 'Climatisation', 'Télévision']
    },
    {
      id: '3',
      number: '201',
      typeId: 'suite',
      capacity: 4,
      floor: 2,
      status: 'Disponible',
      equipment: ['WiFi', 'Climatisation', 'Télévision', 'Minibar', 'Vue mer']
    },
    {
      id: '4',
      number: '202',
      typeId: 'suite',
      capacity: 4,
      floor: 2,
      status: 'En maintenance',
      equipment: ['WiFi', 'Climatisation', 'Télévision', 'Minibar'],
      maintenanceUntil: '2025-07-25'
    },
    {
      id: '5',
      number: '301',
      typeId: 'familiale',
      capacity: 6,
      floor: 3,
      status: 'Propre',
      equipment: ['WiFi', 'Climatisation', 'Télévision', 'Kitchenette']
    },
    {
      id: '6',
      number: '305',
      typeId: 'standard',
      capacity: 2,
      floor: 3,
      status: 'Disponible',
      equipment: ['WiFi', 'Climatisation', 'Télévision']
    },
    {
      id: '7',
      number: '401',
      typeId: 'suite',
      capacity: 4,
      floor: 4,
      status: 'Hors service',
      equipment: ['WiFi', 'Climatisation', 'Télévision', 'Minibar']
    }
  ]
}

const getRoomTypeName = (typeId: string) => {
  const type = roomTypes.value.find(t => t.id === typeId)
  return type ? type.name : 'Type inconnu'
}

const getRoomCountByType = (typeId: string) => {
  return rooms.value.filter(room => room.typeId === typeId).length
}

const getStatusClass = (status: string) => {
  const classes = {
    'Disponible': 'bg-green-100 text-green-800',
    'Occupée': 'bg-red-100 text-red-800',
    'À nettoyer': 'bg-yellow-100 text-yellow-800',
    'Propre': 'bg-blue-100 text-blue-800',
    'En maintenance': 'bg-purple-100 text-purple-800',
    'Hors service': 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: string | Date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR')
}

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Gestion des chambres
const addRoom = () => {
  // Validation de l'unicité du numéro
  if (rooms.value.some(room => room.number === roomForm.value.number)) {
    alert('Ce numéro de chambre existe déjà!')
    return
  }

  // Validation de la capacité selon le type
  const roomType = roomTypes.value.find(t => t.id === roomForm.value.typeId)
  if (roomType && roomForm.value.capacity! > roomType.maxCapacity) {
    alert(`La capacité ne peut pas dépasser ${roomType.maxCapacity} pour ce type de chambre`)
    return
  }

  const newRoom: Room = {
    id: generateId(),
    number: roomForm.value.number!,
    typeId: roomForm.value.typeId!,
    capacity: roomForm.value.capacity!,
    floor: roomForm.value.floor!,
    status: 'Disponible',
    equipment: [...roomForm.value.equipment!],
    notes: roomForm.value.notes
  }

  rooms.value.push(newRoom)

  // Ajouter à l'historique
  statusHistory.value.push({
    id: generateId(),
    roomNumber: newRoom.number,
    action: 'Création',
    oldStatus: '',
    newStatus: 'Disponible',
    timestamp: new Date()
  })

  closeRoomModal()
  alert('Chambre ajoutée avec succès!')
}

const editRoom = (room: Room) => {
  selectedRoom.value = room
  roomForm.value = { ...room }
  showEditRoomModal.value = true
}

const updateRoom = () => {
  if (!selectedRoom.value) return

  // Validation de l'unicité du numéro (exclure la chambre actuelle)
  if (rooms.value.some(room => room.number === roomForm.value.number && room.id !== selectedRoom.value!.id)) {
    alert('Ce numéro de chambre existe déjà!')
    return
  }

  // Validation de la capacité selon le type
  const roomType = roomTypes.value.find(t => t.id === roomForm.value.typeId)
  if (roomType && roomForm.value.capacity! > roomType.maxCapacity) {
    alert(`La capacité ne peut pas dépasser ${roomType.maxCapacity} pour ce type de chambre`)
    return
  }

  const index = rooms.value.findIndex(r => r.id === selectedRoom.value!.id)
  if (index !== -1) {
    rooms.value[index] = { ...rooms.value[index], ...roomForm.value }

    // Ajouter à l'historique
    statusHistory.value.push({
      id: generateId(),
      roomNumber: rooms.value[index].number,
      action: 'Modification',
      oldStatus: selectedRoom.value.status,
      newStatus: rooms.value[index].status,
      timestamp: new Date()
    })
  }

  closeRoomModal()
  alert('Chambre modifiée avec succès!')
}

const deleteRoom = (room: Room) => {
  // Vérifier s'il y a une réservation active
  if (room.hasActiveReservation) {
    alert('Impossible de supprimer une chambre avec une réservation active!')
    return
  }

  if (confirm(`Êtes-vous sûr de vouloir supprimer la chambre ${room.number}?`)) {
    const index = rooms.value.findIndex(r => r.id === room.id)
    if (index !== -1) {
      rooms.value.splice(index, 1)

      // Ajouter à l'historique
      statusHistory.value.push({
        id: generateId(),
        roomNumber: room.number,
        action: 'Suppression',
        oldStatus: room.status,
        newStatus: '',
        timestamp: new Date()
      })

      alert('Chambre supprimée avec succès!')
    }
  }
}

const changeRoomStatus = (room: Room) => {
  selectedRoom.value = room
  newStatus.value = ''
  maintenanceUntil.value = ''
  showStatusModal.value = true
}

const updateRoomStatus = () => {
  if (!selectedRoom.value || !newStatus.value) return

  const oldStatus = selectedRoom.value.status
  const index = rooms.value.findIndex(r => r.id === selectedRoom.value!.id)

  if (index !== -1) {
    rooms.value[index].status = newStatus.value

    // Gérer la maintenance
    if (newStatus.value === 'En maintenance' && maintenanceUntil.value) {
      rooms.value[index].maintenanceUntil = maintenanceUntil.value
    } else if (newStatus.value !== 'En maintenance') {
      delete rooms.value[index].maintenanceUntil
    }

    // Ajouter à l'historique
    statusHistory.value.push({
      id: generateId(),
      roomNumber: selectedRoom.value.number,
      action: 'Changement de statut',
      oldStatus,
      newStatus: newStatus.value,
      timestamp: new Date()
    })
  }

  showStatusModal.value = false
  alert('Statut mis à jour avec succès!')
}

// Gestion des types de chambres
const addRoomType = () => {
  // Validation de l'unicité du nom
  if (roomTypes.value.some(type => type.name === roomTypeForm.value.name)) {
    alert('Ce nom de type existe déjà!')
    return
  }

  const newType: RoomType = {
    id: generateId(),
    name: roomTypeForm.value.name!,
    maxCapacity: roomTypeForm.value.maxCapacity!,
    description: roomTypeForm.value.description,
    equipment: [...roomTypeForm.value.equipment!]
  }

  roomTypes.value.push(newType)
  closeRoomTypeModal()
  alert('Type de chambre ajouté avec succès!')
}

const editRoomType = (type: RoomType) => {
  selectedRoom.value = null
  roomTypeForm.value = { ...type }
  showEditRoomTypeModal.value = true
}

const updateRoomType = () => {
  if (!roomTypeForm.value.id) return

  // Validation de l'unicité du nom (exclure le type actuel)
  if (roomTypes.value.some(type => type.name === roomTypeForm.value.name && type.id !== roomTypeForm.value.id)) {
    alert('Ce nom de type existe déjà!')
    return
  }

  const index = roomTypes.value.findIndex(t => t.id === roomTypeForm.value.id)
  if (index !== -1) {
    roomTypes.value[index] = { ...roomTypeForm.value } as RoomType

    // Mettre à jour les équipements des chambres de ce type
    rooms.value.forEach(room => {
      if (room.typeId === roomTypeForm.value.id) {
        // Ajouter les nouveaux équipements du type s'ils ne sont pas déjà présents
        roomTypeForm.value.equipment!.forEach(equipment => {
          if (!room.equipment.includes(equipment)) {
            room.equipment.push(equipment)
          }
        })
      }
    })
  }

  closeRoomTypeModal()
  alert('Type de chambre modifié avec succès!')
}

const deleteRoomType = (type: RoomType) => {
  // Vérifier s'il y a des chambres associées
  const associatedRooms = rooms.value.filter(room => room.typeId === type.id)
  if (associatedRooms.length > 0) {
    alert(`Impossible de supprimer ce type car ${associatedRooms.length} chambre(s) l'utilise(nt)!`)
    return
  }

  if (confirm(`Êtes-vous sûr de vouloir supprimer le type "${type.name}"?`)) {
    const index = roomTypes.value.findIndex(t => t.id === type.id)
    if (index !== -1) {
      roomTypes.value.splice(index, 1)
      alert('Type supprimé avec succès!')
    }
  }
}

// Gestion des modals
const closeRoomModal = () => {
  showAddRoomModal.value = false
  showEditRoomModal.value = false
  roomForm.value = {
    number: '',
    typeId: '',
    capacity: 1,
    floor: 0,
    equipment: [],
    notes: ''
  }
  selectedRoom.value = null
}

const closeRoomTypeModal = () => {
  showAddRoomTypeModal.value = false
  showEditRoomTypeModal.value = false
  roomTypeForm.value = {
    name: '',
    maxCapacity: 2,
    description: '',
    equipment: []
  }
}

// Import/Export
const exportRooms = () => {
  const csvContent = [
    ['Numéro', 'Type', 'Capacité', 'Étage', 'Statut', 'Équipements', 'Notes'].join(','),
    ...rooms.value.map(room => [
      room.number,
      getRoomTypeName(room.typeId),
      room.capacity,
      room.floor,
      room.status,
      room.equipment.join(';'),
      room.notes || ''
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `chambres_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

const importRooms = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const csv = e.target?.result as string
      const lines = csv.split('\n')
      const headers = lines[0].split(',')

      const newRooms: Room[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',')
        if (values.length >= 6) {
          const roomNumber = values[0].trim()

          // Vérifier l'unicité
          if (rooms.value.some(room => room.number === roomNumber)) {
            console.warn(`Chambre ${roomNumber} ignorée (déjà existante)`)
            continue
          }

          const newRoom: Room = {
            id: generateId(),
            number: roomNumber,
            typeId: roomTypes.value[0]?.id || 'standard', // Type par défaut
            capacity: parseInt(values[2]) || 1,
            floor: parseInt(values[3]) || 0,
            status: values[4] || 'Disponible',
            equipment: values[5] ? values[5].split(';') : [],
            notes: values[6] || ''
          }

          newRooms.push(newRoom)
        }
      }

      rooms.value.push(...newRooms)
      alert(`${newRooms.length} chambre(s) importée(s) avec succès!`)

    } catch (error) {
      alert('Erreur lors de l\'importation du fichier CSV')
      console.error(error)
    }
  }

  reader.readAsText(file)
}

// Simulation des actions après check-out
const handleCheckOut = (reservationId: string) => {
  // Simuler la réinitialisation du statut après check-out
  const room = rooms.value.find(r => r.hasActiveReservation)
  if (room) {
    room.status = 'À nettoyer'
    room.hasActiveReservation = false

    statusHistory.value.push({
      id: generateId(),
      roomNumber: room.number,
      action: 'Check-out',
      oldStatus: 'Occupée',
      newStatus: 'À nettoyer',
      timestamp: new Date()
    })
  }
}

// Fonctions utilitaires pour les chambres communicantes
const getConnectedRooms = (roomNumber: string) => {
  // Simuler la logique des chambres communicantes
  const connectedPairs = [
    ['201', '202'],
    ['301', '302']
  ]

  for (const pair of connectedPairs) {
    if (pair.includes(roomNumber)) {
      return pair.filter(num => num !== roomNumber)
    }
  }
  return []
}

// Initialisation
onMounted(() => {
  initializeData()
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
.transition-colors {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

/* Animation pour les modals */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Scrollbar personnalisée */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive design amélioré */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3.xl\:grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .grid-cols-1.md\:grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Amélioration de l'accessibilité */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Animations subtiles */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Styles pour les équipements */
.equipment-tag {
  display: inline-block;
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  margin: 0.125rem;
}

/* Styles pour les statuts avec icônes */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.status-badge::before {
  content: '';
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  display: inline-block;
}

.status-badge.disponible::before {
  background-color: #10b981;
}

.status-badge.occupee::before {
  background-color: #ef4444;
}

.status-badge.a-nettoyer::before {
  background-color: #f59e0b;
}

.status-badge.propre::before {
  background-color: #3b82f6;
}

.status-badge.en-maintenance::before {
  background-color: #8b5cf6;
}

.status-badge.hors-service::before {
  background-color: #6b7280;
}

/* Styles pour les notifications */
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #10b981;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.notification.error {
  background-color: #ef4444;
}

.notification.warning {
  background-color: #f59e0b;
}

.notification.info {
  background-color: #3b82f6;
}

/* Styles pour les cartes de chambres */
.room-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.room-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.room-card.selected {
  border-color: #10b981;
  background-color: #f0fdf4;
}

/* Styles pour les formulaires */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.form-input.error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Styles pour les boutons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #059669;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background-color: #d97706;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

/* Styles pour les tableaux */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

/* Styles pour les badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-success {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-info {
  background-color: #e0e7ff;
  color: #3730a3;
}

.badge-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

/* Styles pour les alertes */
.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.alert-success {
  background-color: #d1fae5;
  border-color: #a7f3d0;
  color: #065f46;
}

.alert-warning {
  background-color: #fef3c7;
  border-color: #fde68a;
  color: #92400e;
}

.alert-danger {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
}

.alert-info {
  background-color: #e0e7ff;
  border-color: #c7d2fe;
  color: #3730a3;
}

/* Styles pour les onglets */
.tab-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #374151;
  border-bottom-color: #d1d5db;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

/* Styles pour les modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Styles pour les tooltips */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: #374151;
  color: white;
  text-align: center;
  border-radius: 0.375rem;
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.875rem;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* Styles pour les loading states */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Styles pour les drag and drop */
.drag-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.drag-area.drag-over {
  border-color: #3b82f6;
  background-color: #f0f9ff;
}

.drag-area:hover {
  border-color: #9ca3af;
}

/* Styles pour les accordéons */
.accordion-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.accordion-header {
  background-color: #f9fafb;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.accordion-header:hover {
  background-color: #f3f4f6;
}

.accordion-content {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

/* Styles pour les steppers */
.stepper {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.stepper-step {
  display: flex;
  align-items: center;
  flex: 1;
}

.stepper-step:not(:last-child)::after {
  content: '';
  flex: 1;
  height: 2px;
  background-color: #e5e7eb;
  margin: 0 1rem;
}

.stepper-step.completed::after {
  background-color: #10b981;
}

.stepper-step.active::after {
  background-color: #3b82f6;
}

.stepper-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 0.5rem;
}

.stepper-step.completed .stepper-number {
  background-color: #10b981;
  color: white;
}

.stepper-step.active .stepper-number {
  background-color: #3b82f6;
  color: white;
}

.stepper-label {
  font-weight: 500;
  color: #6b7280;
}

.stepper-step.completed .stepper-label,
.stepper-step.active .stepper-label {
  color: #374151;
}

/* Styles pour les cartes statistiques */
.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-card p {
  opacity: 0.9;
  font-size: 0.875rem;
}

/* Styles pour les graphiques */
.chart-container {
  position: relative;
  height: 300px;
  margin: 1rem 0;
}

/* Styles pour les calendriers */
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e5e7eb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
}

.calendar-day {
  background-color: white;
  padding: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.calendar-day:hover {
  background-color: #f3f4f6;
}

.calendar-day.selected {
  background-color: #3b82f6;
  color: white;
}

.calendar-day.disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.calendar-header {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

/* Styles pour les breadcrumbs */
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.breadcrumb-item {
  color: #6b7280;
}

</style> -->
<template>
  <div class="">
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />

      <!-- Header avec actions -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5">
        <div class="flex items-center gap-4">
          <!-- Toggle View -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              @click="viewMode = 'list'"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              {{ $t('List') }}
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              {{ $t('Grid') }}
            </button>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{{ $t('Total') }}: {{ roomTypeData.length }}</span>
            <span>{{ $t('Active') }}: {{ activeRoomTypes }}</span>
            <span>{{ $t('Inactive') }}: {{ inactiveRoomTypes }}</span>
          </div>
        </div>

        <div class="flex space-x-2">

          <button
            @click="OpenModal"
            class="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ t('AddRoomType') }}
          </button>


          <button
            @click="importDefaultDefaults"
            class="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📥
            {{ t('importdefault') }}
          </button>
        </div>

      </div>

      <div class="h-screen">
        <!-- Vue Liste -->
        <div v-if="viewMode === 'list'" class="space-y-5 sm:space-y-6 mt-10">
          <TableComponent
            :items="titles"
            :datas="roomTypeData"
            :filterable="true"
            :pagination="true"
            :loading="loading"
            :showHeader="true"
            :title="$t('AllRoomType')"
            :pageSize="15"
            :showButtonAllElement="true"
            @edit="onEditRoomType"
            @delete="onDeleteRoomType"
            class="modern-table"
          />
        </div>

        <!-- Vue Grille -->
        <div v-else class="mt-10">
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('AllRoomType') }}</h2>
            <div class="flex items-center gap-4">
              <!-- Filtre de statut -->
              <select
                v-model="statusFilter"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{{ $t('AllStatus') }}</option>
                <option value="active">{{ $t('Active') }}</option>
                <option value="inactive">{{ $t('Inactive') }}</option>
              </select>

              <!-- Recherche -->
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('search...')"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Grille des cartes -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" v-if="!loading">
            <div
              v-for="roomType in paginatedGridData"
              :key="roomType.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group"
            >
              <!-- Header de la carte -->
              <div class="p-6 pb-4">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">
                      {{ roomType.name }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          roomType.statusColor.bg,
                          roomType.statusColor.text
                        ]"
                      >
                        {{ roomType.statusColor.label }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ roomType.roomCount || 0 }} {{ $t('Rooms') }}
                      </span>
                    </div>
                  </div>

                  <!-- Menu actions -->
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="onEditRoomType(roomType)"
                      class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      :title="$t('Edit')"
                    >
                      <svg class="h-4 w-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                        <path stroke="none" d="M0 0h24v24H0z"/>
                        <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
                      </svg>
                    </button>
                    <button
                      @click="onDeleteRoomType(roomType)"
                      class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      :title="$t('Delete')"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {{ roomType.description || $t('NoDescription') }}
                </p>
              </div>

              <!-- Informations tarifaires -->
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ $t('Price') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(roomType.price) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ $t('DefaultGuest') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ roomType.defaultGuest }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ $t('ExtraGuestPrice') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(roomType.extraGuestPrice) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ $t('DefaultDeposit') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(roomType.defaultDeposit) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading state pour la grille -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="i in 8" :key="i" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="p-6 animate-pulse">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination pour la grille -->
          <div v-if="viewMode === 'grid' && !loading && filteredGridData.length > gridPageSize" class="mt-8 flex justify-center">
            <nav class="flex items-center gap-2">
              <button
                @click="gridCurrentPage = Math.max(1, gridCurrentPage - 1)"
                :disabled="gridCurrentPage === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                {{ $t('previous') }}
              </button>

              <div class="flex items-center gap-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="gridCurrentPage = page"
                  :class="[
                    'px-3 py-2 text-sm font-medium rounded-lg',
                    gridCurrentPage === page
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="gridCurrentPage = Math.min(totalGridPages, gridCurrentPage + 1)"
                :disabled="gridCurrentPage === totalGridPages"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                {{ $t('next') }}
              </button>
            </nav>
          </div>

          <!-- Message si aucune donnée -->
          <div v-if="!loading && filteredGridData.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('NoRoomTypes') }}</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('StartByCreatingRoomType') }}</p>
          </div>
        </div>
      </div>
    </AdminLayout>

    <!-- Modal reste identique -->
    <Modal v-if="modalOpen" @close="closeModal">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <button @click="closeModal"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" fill="" />
            </svg>
          </button>

          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ isEditMode ? $t('EditRoomType') : $t('AddRoomType') }}
            </h4>
          </div>

          <form class="flex flex-col">
            <div class="custom-scrollbar h-[500px] md:h-[510px] overflow-y-auto p-2">
              <div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-6">
                  <div>
                    <Input :lb="$t('RoomName')" :placeholder="$t('RoomName')" :id="'room'" :forLabel="'room'" v-model="form.name" />
                  </div>
                  <div>
                    <Input :lb="$t('DefaultGuest')" :placeholder="$t('DefaultGuest')" :id="'default_guest'" inputType="Number" :forLabel="'default_guest'" v-model.number="form.default_guest" />
                  </div>
                  <div>
                    <InputCurrency :lb="$t('price')" :placeholder="$t('price')" :id="'price'" :forLabel="'price'" v-model.number="form.price" />
                  </div>
                  <div>
                    <InputCurrency :lb="$t('ExtraGuestPrice')" :placeholder="$t('ExtraGuestPrice')" :id="'extra_guest'" :forLabel="'extra_guest'" v-model.number="form.extra_guest" />
                  </div>
                  <div>
                    <Input :lb="$t('Vat(%)')" :placeholder="$t('Vat')" :id="'vat'" inputType="Number" :disabled="true" :forLabel="'vat'" v-model.number="form.vat" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('final_price') }}</label>
                    <div class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800">
                      {{ formatted }}
                    </div>
                  </div>
                  <div>
                    <InputCurrency :lb="$t('DefaultDeposit')" :placeholder="$t('DefaultDeposit')" :id="'default_deposit'" :forLabel="'default_deposit'" v-model.number="form.default_deposit" />
                  </div>
                  <div>
                    <Select :lb="$t('Status')" :options="status" v-model="form.status" />
                  </div>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('Description') }}</label>
                  <textarea v-model="form.description" :placeholder="$t('Largetext')" rows="6" class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"></textarea>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
              <button @click="closeModal" type="button" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                {{ $t('Cancel') }}
              </button>
              <button :disabled="isLoading" type="button" class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto" @click.prevent="handleSubmit">
                <span v-if="!isLoading">{{ isEditMode ? $t('EditRoomType') : $t('AddRoomType') }}</span>
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
  </div>

  <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
  <Spinner v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75" />
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { createRoomType, getTypeProductByServiceId,getRoomCountByRoomType } from '@/services/api'
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import type { RoomTypeData } from '@/types/option'
import { useServiceStore } from '@/composables/serviceStore'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import { updateRoomType, deleteRoomType } from '@/services/api'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import InputCurrency from '@/components/forms/FormElements/InputCurrency.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import { defaultRoomTypes } from '@/assets/data/roomtype'

// États principaux
const isLoading = ref(false)
const loading = ref(true)
const loadingDelete = ref(false)
const selectedRoomTypeId = ref<number | null>(null)
const show = ref(false)
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const serviceStore = useServiceStore()
const modalOpen = ref(false)
const selectedRoomType = ref<any>(null)
const isEditMode = ref(false)

// Nouveaux états pour les vues
const viewMode = ref<'list' | 'grid'>('list')
const searchQuery = ref('')
const statusFilter = ref('')
const gridCurrentPage = ref<any>(1)
const gridPageSize = ref(12)

// Données
const roomTypeData = ref<RoomTypeData[]>([])
const currentPageTitle = computed(() => t('RoomTypes'))

const status = computed(() => [
  { value: 'active', label: t('Active') },
  { value: 'inactive', label: t('Inactive') },
])

const activeRoomTypes = computed(() => roomTypeData.value.filter(room => room.status === 'active').length)
const inactiveRoomTypes = computed(() => roomTypeData.value.filter(room => room.status === 'inactive').length)

// Filtrage pour la grille
const filteredGridData = computed(() => {
  let filtered = [...roomTypeData.value]

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(room => room.status === statusFilter.value)
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(room =>
      room.name.toLowerCase().includes(query) ||
      room.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Pagination pour la grille
const totalGridPages = computed(() => Math.ceil(filteredGridData.value.length / gridPageSize.value))

const paginatedGridData = computed(() => {
  const start = (gridCurrentPage.value - 1) * gridPageSize.value
  const end = start + gridPageSize.value
  return filteredGridData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalGridPages.value
  const current = gridCurrentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages.filter(page => page !== '...' || true)
})

// Titres pour le tableau (avec ajout du nombre de chambres)
const titles = computed(() => [
  {
    name: 'name',
    label: t('Name'),
    type: 'text',
    sortable: true,
    filterable: false,
  },
  {
    name: 'description',
    label: t('description'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'price',
    label: t('price'),
    type: 'currency',
    event: 'view',
    filterable: true,
  },
  {
    name: 'extraGuestPrice',
    label: t('ExtraGuestPrice'),
    type: 'currency',
    filterable: true,
  },
  {
    name: 'defaultDeposit',
    label: t('DefaultDeposit'),
    type: 'currency',
    filterable: true,
  },
  {
    name: 'defaultGuest',
    label: t('DefaultGuest'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'roomCount',
    label: t('RoomCount'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'statusColor',
    label: t('Status'),
    type: 'badge',
    filterable: false,
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'Edit',
        event: 'edit',
        icone: ` <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>`,
      },
      {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
        color: 'bg-red-100 text-red-600 px-2 py-1 rounded-full',
      },
    ],
  },
])

// Formulaire
const form = ref<any>({
  name: '',
  status: '',
  description: '',
  price: 0,
  default_guest: 0,
  extra_guest: 0,
  default_deposit: 0,
  vat: 19.25,
})


const totalWithVat = computed(() => {
  const base = form.value.price || 0
  const vatRate = form.value.vat || 0
  return Number((base + (base * vatRate) / 100).toFixed(2))
})

const formatted = computed(() => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(totalWithVat.value)
})


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'inactive':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// Fonctions API
const SaveRoomType = async () => {
  isLoading.value = true
  try {
    const serviceId = serviceStore.serviceId

    if (!serviceId) {
      throw new Error('Service ID is not defined')
    }
    const Payload = {
      name: form.value.name,
      description: form.value.description,
      status: form.value.status,
      service_id: serviceId,
      price: Number(totalWithVat.value),
      default_guest: form.value.default_guest,
      extra_guest_price: form.value.extra_guest,
      default_deposit: form.value.default_deposit,
    }

    const roomResponse = await createRoomType(Payload)
    modalOpen.value = false
    form.value = {
      name: '',
      status: '',
      description: '',
      price: 0,
      default_guest: 0,
      extra_guest: 0,
      default_deposit: 0,
      vat: 19.25,
    }
    console.log("roomResponse",roomResponse)
    fetchRoomType()
    toast.success(t('toast.roomtypesuccess'))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde', error)
    toast.error(t('toast.roomtypeerror'))
  } finally {
    isLoading.value = false
  }
}


const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId

    if (!serviceId) {
      throw new Error('Service ID is not defined')
    }

    const response = await getTypeProductByServiceId(serviceId)

    const typeIds = response.data.map(roomType => roomType.id)
    const roomCounts = await Promise.all(
      typeIds.map(id => getRoomCountByRoomType(serviceId,id))
    )
      console.log("roomCounts",roomCounts)
    const roomTypesWithCount = response.data.map((roomType, index) => {
      const statusClasses = getStatusColor(roomType.status).split(' ')

      return {
        ...roomType,
        roomCount: roomCounts[index].data.total_rooms || 0,
        statusColor: {
          label: t(roomType.status),
          bg: statusClasses[0],
          text: statusClasses[1],
        },
      }
    })

    roomTypeData.value = roomTypesWithCount.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}



const updateFormData = async () => {
  isLoading.value = true

  try {
    const serviceId = serviceStore.serviceId
    const id = selectedRoomTypeId.value

    if (!id) {
      toast.error(t('toast.selectError'))
      return
    }

    const roomTypePayload = {
      name: form.value.name,
      description: form.value.description,
      status: form.value.status,
      service_id: serviceId,
      price: Math.round(totalWithVat.value),
      default_guest: form.value.default_guest,
      extra_guest_price: form.value.extra_guest,
      default_deposit: form.value.default_deposit,
    }

    await updateRoomType(id, roomTypePayload)
    fetchRoomType()
    toast.success(t('toast.roomTypeUpdatedSuccess'))

    // Réinitialisation du formulaire
    form.value = {
      name: '',
      status: '',
      description: '',
      price: 0,
      default_guest: 0,
      extra_guest: 0,
      default_deposit: 0,
      vat: 19.25,
    }
    selectedRoomType.value = null
    isEditMode.value = false
    modalOpen.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    toast.error(t('toast.updateError'))
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async () => {
  if (selectedRoomTypeId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteRoomType(selectedRoomTypeId.value)
      toast.success(t('toast.roomTypeDeleted'))
      roomTypeData.value = roomTypeData.value.filter((r: any) => r.id !== selectedRoomTypeId.value)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(t('toast.roomTypeDeleteError'))
    } finally {
      loadingDelete.value = false
      show.value = false
      selectedRoomTypeId.value = null
    }
  }
}

const importDefaultDefaults = async () => {
  const defaultRoomTypesData = defaultRoomTypes
  if (defaultRoomTypesData && defaultRoomTypesData.length > 0) {
    isLoading.value = true
    try {
      const serviceId = serviceStore.serviceId

      if (!serviceId) {
        throw new Error('Service ID is not defined')
      }

      for (const roomType of defaultRoomTypesData) {
        const Payload = {
          name: roomType.name,
          description: roomType.description,
          status: 'active',
          service_id: serviceId,
          price: roomType.Prix,
          default_guest: roomType.DefaultGuest,
          extra_guest_price: roomType.ExtraGuestPrice,
          default_deposit: roomType.DefaultDeposit,
        }

        await createRoomType(Payload)
      }

      fetchRoomType()
      toast.success(t('toast.defaultRoomTypesImported'))
    } catch (error) {
      console.error('Erreur lors de l\'importation des types de chambre par défaut', error)
      toast.error(t('toast.importError'))
    } finally {
      isLoading.value = false
    }
  }
}

// Gestionnaires d'événements
const onEditRoomType = (type: any) => handleBookingAction('edit', type)
const onDeleteRoomType = (type: any) => handleBookingAction('delete', type)

const handleBookingAction = (action: string, type: any) => {
  if (action === 'edit') {
    const roomTypeToEdit = roomTypeData.value.find((r: any) => r.id === Number(type.id))
    selectedRoomTypeId.value = type.id

    if (roomTypeToEdit) {
      const priceTTC = roomTypeToEdit.price
      const vatRate = form.value.vat || 0
      const priceHT = Math.round(priceTTC / (1 + vatRate / 100))

      form.value = {
        name: roomTypeToEdit.name,
        status: roomTypeToEdit.status,
        description: roomTypeToEdit.description,
        price: priceHT,
        default_guest: Number(roomTypeToEdit.defaultGuest),
        extra_guest: roomTypeToEdit.extraGuestPrice,
        default_deposit: roomTypeToEdit.defaultDeposit,
        vat: vatRate,
      }

      isEditMode.value = true
      modalOpen.value = true
    }
  } else if (action === 'delete') {
    selectedRoomTypeId.value = type.id
    show.value = true
  }
}

const handleSubmit = async () => {
  if (isEditMode.value) {
    await updateFormData()
  } else {
    await SaveRoomType()
  }
}

const closeModal = () => {
  form.value = {
    name: '',
    status: '',
    description: '',
    price: 0,
    default_guest: 0,
    extra_guest: 0,
    default_deposit: 0,
    vat: 19.25,
  }
  isEditMode.value = false
  modalOpen.value = false
}

const OpenModal = () => {
  modalOpen.value = true
  isEditMode.value = false
}

// Watchers
watch(locale, fetchRoomType)
watch(statusFilter, () => {
  gridCurrentPage.value = 1
})
watch(searchQuery, () => {
  gridCurrentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  await fetchRoomType()
  await new Promise((resolve) => setTimeout(resolve, 500))
  loading.value = false
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modern-table {
  @apply shadow-sm border border-gray-200 dark:border-gray-700;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
