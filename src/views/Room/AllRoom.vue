<template>
  <div class="">
    <AdminLayout>
      <FullScreenLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />

        <RoomFilter @filter="applyFilter" />

        <div class="mt-10">
          <div class="space-y-6">
            <TableComponent
              :items="essentialColumns"
              :datas="flattenServiceProducts"
              :filterable="true"
              :pagination="true"
              :loading="loading"
              :showHeader="true"
              :title="$t('Rooms')"
              :pageSize="15"
              :searchable="false"
              :showButtonAllElement="true"
              @edit="onEditProduct"
              @delete="onDeleteProduct"
              @view-details="showRoomDetails"
              class="modern-table"
            >
              <template v-slot:headerActions>
                <div class="flex justify-end">
                  <button
                    @click="OpenModal"
                    class="block px-4 py-2 dark:hover:text-white bg-primary hover:bg-primary/85 text-white font-bold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 items-center"
                  >
                    {{ $t('AddRoom') }}
                  </button>
                </div>
                <div>

                </div>
              </template>
            </TableComponent>
          </div>
        </div>
      </FullScreenLayout>
    </AdminLayout>
    <Modal v-if="modalOpen" @close="closeModal()">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- close btn -->
          <button
            @click="closeModal()"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
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
              {{ isEditMode ? $t('EditRoom') : $t('AddRoom') }}
            </h4>
          </div>
          <form class="flex flex-col custom-scrollbar h-[460px] overflow-y-auto p-1">
            <!-- Section Informations Générales -->
            <fieldset class="space-y-6">
              <legend class="border-b border-gray-200 pb-4 w-full">
                <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  👁️‍🗨️
                  {{ $t('RoomInformation') }}
                </h2>
              </legend>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <!-- Nom de la chambre -->
                <div class="space-y-2">
                  <label
                    for="room-number"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >{{ $t('room_number') }}</label
                  >
                  <input
                    type="number"
                    id="room-number"
                    name="room-number"
                    :placeholder="'Ex : 101'"
                    min="1"
                    v-model="formData.number"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <Input :lb="$t('Name')" :id="'name'" :forLabel="'name'" v-model="formData.name" />
                </div>
                <div class="space-y-2">
                  <Select
                    :lb="$t('RoomTypes')"
                    :options="roomTypeData"
                    v-model="formData.roomType"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Loyer mensuel -->
                <div class="space-y-2">
                  <InputCurrency
                    :lb="$t('Rent')"
                    :placeholder="'Ex: 10000 '"
                    :id="'rent'"
                    :forLabel="'rent'"
                    :disabled="true"
                    v-model="formData.rent"
                  />
                </div>

                <div class="space-y-2">
                  <Input
                    :lb="$t('capacity')"
                    :id="'capacity'"
                    :forLabel="'capacity'"
                    :input-type="'number'"
                    v-model="formData.capacity"
                  />
                </div>

                <div class="space-y-2">
                  <Input
                    :lb="$t('floor')"
                    :id="'etage'"
                    :forLabel="'etage'"
                    :input-type="'number'"
                    v-model="formData.floor"
                  />
                </div>

                <!-- Statut -->
                <div class="space-y-2">
                  <Select :lb="$t('Status')" :options="status" v-model="formData.status" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <!-- Description -->
                <div class="md:col-span-2 space-y-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('Description') }}
                  </label>
                  <textarea
                    v-model="formData.description"
                    :placeholder="$t('Largetext')"
                    rows="4"
                    class="dark:bg-dark-900 w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  ></textarea>
                </div>
                <div class="space-y-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('Note') }}
                  </label>
                  <textarea
                    :placeholder="$t('Largetext')"
                    rows="4"
                    class="dark:bg-dark-900 w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  ></textarea>
                </div>
              </div>
            </fieldset>

            <!-- Section des options dynamiques -->
            <div
              v-for="(optionsArray, category) in defaultOptionsByType"
              :key="category"
              class="mt-6"
            >
              <fieldset class="border rounded-xl p-4 shadow-sm">
                <legend class="text-xl font-semibold mb-4 flex items-center gap-3 px-2">
                  <span class="text-2xl" :aria-label="`Catégorie: ${category}`">{{
                    categoryIcons[category] || '❓'
                  }}</span>
                  <span>{{ t(`${category}`) }}</span>
                </legend>

                <!-- Boucle sur chaque option de cette catégorie -->
                <div v-for="option in optionsArray" :key="option.id" class="mb-6">
                  <!-- Radios pour boolean ou picklist binaire (Oui/Non) -->
                  <div
                    v-if="
                      option.type === 'boolean' ||
                      (option.type === 'picklist' && option.values && option.values.length < 4)
                    "
                    class="space-y-2"
                  >
                    <p class="text-sm font-medium text-gray-700">
                      {{ t(`options.${option.optionName}`) }}
                    </p>
                    <div class="flex flex-wrap gap-4">
                      <label
                        v-for="val in option.values"
                        :key="val.value"
                        class="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          :name="`option_${option.id}`"
                          :value="val.value"
                          v-model="formData.options[option.id]"
                          class="w-4 h-4 text-purple-500 focus:ring-purple-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">{{
                          t(`options.values.${val.label}`)
                        }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Checkbox pour multiselect -->
                  <div v-else-if="option.type === 'multiselect' && option.values" class="space-y-2">
                    <p class="text-sm font-medium text-gray-700">
                      {{ t(`options.${option.optionName}`) }}
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        v-for="val in option.values"
                        :key="val.value"
                        class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          :value="val.value"
                          :checked="formData.options[option.id]?.includes(val.value)"
                          @change="onMultiSelectChange(Number(option.id), val.value, $event)"
                          class="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                        />
                        <span class="ml-3 text-sm font-medium text-gray-700">{{
                          t(`options.values.${val.label}`)
                        }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Select pour picklists avec plus de 2 valeurs -->
                  <div
                    v-else-if="
                      option.type === 'picklist' && option.values && option.values.length > 3
                    "
                    class="space-y-2"
                  >
                    <label
                      :for="`option_${option.id}`"
                      class="block text-sm font-medium text-gray-700"
                    >
                      {{ t(`options.${option.optionName}`) }}
                    </label>
                    <select
                      :id="`option_${option.id}`"
                      v-model="formData.options[option.id]"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                    >
                      <option disabled value="">-- {{ $t('select_option')}}--</option>
                      <option v-for="val in option.values" :key="val.value" :value="val.value">
                        {{ t(`options.values.${val.label}`) }}
                      </option>
                    </select>
                  </div>

                  <!-- Champ texte par défaut pour les autres types -->
                  <div v-else class="space-y-2">
                    <label
                      :for="`option_${option.id}`"
                      class="block text-sm font-medium text-gray-700"
                    >
                      {{ t(`options.${option.optionName}`) }}
                    </label>
                    <input
                      :id="`option_${option.id}`"
                      type="text"
                      v-model="formData.options[option.id]"
                      :placeholder="option.optionName"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </form>

          <!-- Boutons d'action -->
          <div
            class="flex flex-col sm:flex-row-reverse gap-4 pt-6 border-t border-gray-200 mt-8 sticky bottom-0 bg-white"
          >
            <button
              type="button"
              @click.prevent="handleSubmit"
              class="flex-1 sm:flex-grow-0 px-4 py-2 w-1/2 text-sm h-11 bg-purple-400 rounded-md hover:from-primary-dark hover:to-purple-500 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform whitespace-nowrap"
            >
              <span v-if="!isLoading">{{ isEditMode ? $t('EditRoom') : $t('AddRoom') }}</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>
            </button>

            <button
              type="button"
              @click.prevent="closeModal()"
              class="flex-1 sm:flex-grow-0 px-4 py-2 w-1/2 text-sm h-11 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              {{ $t('Cancel') }}
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
  <ModalDelete
    v-if="Show"
    @close="Show = false"
    @delete="confirmDelete"
    :isLoading="loadingDelete"
  />
  <PopupModal
    v-if="showMessage"
    :title="$t('warning')"
    :message="popupMessage"
    :isOpen="showMessage"
    @close="showMessage = false"
  />
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { ref, onMounted, computed, nextTick, watchEffect, watch } from 'vue'
import {
  getOptions,
  getServiceProductWithOptions,
  updateRoom,
  updateRoomOptions,
  deleteServiceProduct,
  getTypeProductByServiceId,
  createRoom,
  createRoomOptions,
  filterRoom,
} from '@/services/api'
import type { OptionType, ServiceProductType, ProductOptionType } from '@/types/option'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import { useBookingStore } from '@/composables/booking'
import { useI18n } from 'vue-i18n'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import InputCurrency from '@/components/forms/FormElements/InputCurrency.vue'
import PopupModal from '@/components/modal/PopupModal.vue'
import { useRouter } from 'vue-router'
import RoomFilter from './RoomFilter.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import type { RoomFilterItem } from '@/utils/models'

const { t, locale } = useI18n()
const serviceStore = useServiceStore()
const userStore = useAuthStore()
const isLoading = ref(false)
const loading = ref(true)
const loadingDelete = ref(false)
const selectedRoomId = ref<number | null>(null)
const Show = ref(false)
const toast = useToast()
const modalOpen = ref(false)
const options = ref<OptionType[]>([])
const roomTypeData = ref<any[]>([])
const showMessage = ref(false)
const popupMessage = ref('')
const ServiceProduct = ref<ServiceProductType[]>([])
const currentPageTitle = computed(() => t('RoomList'))
const selectedRoom = ref<any>(null)
const isEditMode = ref(false)
import Papa from 'papaparse'
const menuItems = computed(() => [
  { label: t('AddRoom'), onClick: () => OpenModal() },
  // { label: t('importdefault'), onClick: () => importDefaultDefaults() },
])
const router = useRouter()
const store = useBookingStore()

const initializeFormData = () => {
  const initialOptions: Record<number, any> = {}
  options.value.forEach((option: any) => {
    if (option.type === 'multiselect') {
      // Pour multiselect, initialiser avec un tableau vide
      initialOptions[option.id] = []
    } else if (option.type === 'boolean' || option.type === 'picklist') {
      // Pour boolean/picklist, initialiser avec une chaîne vide
      initialOptions[option.id] = ''
    } else {
      // Pour les autres types, initialiser avec une chaîne vide
      initialOptions[option.id] = ''
    }
  })

  return initialOptions
}
const formData = ref<any>({
  name: '',
  status: '',
  description: '',
  rent: '',
  roomType: null,
  floor: null,
  capacity: null,
  number: null,
  options: initializeFormData(),
})

watch(
  options,
  (newOptions: any[]) => {
    if (newOptions && newOptions.length > 0) {
      const updatedOptions: Record<number, any> = {}

      newOptions.forEach((option: any) => {
        const existingValue = formData.value.options[option.id]

        if (option.type === 'multiselect') {
          updatedOptions[option.id] = Array.isArray(existingValue) ? existingValue : []
        } else {
          updatedOptions[option.id] = existingValue !== undefined ? existingValue : ''
        }
      })

      formData.value.options = updatedOptions
    }
  },
  { immediate: true },
)

// function pour gérer les multiselects de façon fiable
const onMultiSelectChange = (optionId: number, value: string, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  const currentValues = formData.value.options[optionId] || []

  if (isChecked) {
    // Ajouter la valeur si elle n est pas dans le tableau
    if (!currentValues.includes(value)) {
      formData.value.options[optionId] = [...currentValues, value]
    }
  } else {
    // Retirer la valeur si décochée
    formData.value.options[optionId] = currentValues.filter((v: string) => v !== value)
  }
}

const status = computed(() => [
  { value: 'available', label: t('Available') },
  { value: 'maintenance', label: t('Maintenance') },
  { value: 'occupied', label: t('Occupied') },
])

const fetchOptions = async () => {
  try {
    const response = await getOptions()
    console.log(response.data.data)
    options.value = response.data.data.map((el: any) => {
      return {
        ...el,
        values: el.values.map((val: any) => ({ value: val, label: val })),
      }
    })
    console.log('.....', options.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}

const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getTypeProductByServiceId(serviceId)

    roomTypeData.value = response.data
      .filter((type: any) => type.status === 'active')
      .map((item: any) => ({
        ...item,
        value: item.id,
        label: item.name,
      }))
    console.log('fetchRoomType', roomTypeData.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des roomtypes:', error)
  }
}

const categoryIcons: Record<string, string> = {
  Accommodation: '🏠',
  Amenities: '🛋️',
  'View & Outdoor': '🌅',
  Services: '🛎️',
  'Accessibility & Rules': '♿',
  Timings: '🕒',
  Other: '❓',
}

watch(
  () => formData.value.roomType,
  (selectedId: any) => {
    const selectedRoom = roomTypeData.value.find((room: any) => room.id === selectedId)
    formData.value.rent = selectedRoom ? selectedRoom.price : 0
  },
)

interface OptionValue {
  value: string
  label: string
}

interface optionsTypes {
  id: string
  optionName: string
  type: 'picklist' | 'multiselect' | 'boolean' | 'text'
  values?: OptionValue[]
}

const optionTypeMap: Record<string, string> = {
  'Accommodation Type': 'Accommodation',
  'Number of Rooms': 'Accommodation',
  'Room Size (sqm)': 'Accommodation',
  'Maximum Occupancy': 'Accommodation',
  'Bed Type': 'Accommodation',

  'Air Conditioning': 'Amenities',
  'Wi-Fi': 'Amenities',
  TV: 'Amenities',
  'Mini Bar': 'Amenities',
  'Safe Deposit Box': 'Amenities',
  'Extra Bed': 'Amenities',
  'Kitchen / Kitchenette': 'Amenities',
  'Washing Machine': 'Amenities',
  'Private Bathroom': 'Amenities',
  'Private Pool': 'Amenities',
  'Jacuzzi / Spa': 'Amenities',

  View: 'View & Outdoor',
  Balcony: 'View & Outdoor',
  Terrace: 'View & Outdoor',

  'Breakfast Included': 'Services',
  'Room Service': 'Services',
  Housekeeping: 'Services',
  Parking: 'Services',
  'Self Check-in': 'Services',

  'Wheelchair Accessible': 'Accessibility & Rules',
  'Smoking Allowed': 'Accessibility & Rules',
  'Pets Allowed': 'Accessibility & Rules',
  'House Rules': 'Accessibility & Rules',

  'Check-in Time': 'Timings',
  'Check-out Time': 'Timings',
}

const defaultOptionsByType = computed(() => {
  const grouped: Record<string, optionsTypes[]> = {}
  options.value
    .filter((option: any) => option.isDefault === true)
    .forEach((option: any) => {
      const type = optionTypeMap[option.optionName] || 'Other'
      if (!grouped[type]) grouped[type] = []
      grouped[type].push(option)
    })
  return grouped
})

const defaultOptionsMap = computed(() => {
  const map: Record<number, OptionType> = {}
  options.value.forEach((opt: OptionType) => {
    map[opt.id] = opt
  })
  return map
})

const resetFormData = () => {
  formData.value = {
    name: '',
    status: '',
    description: '',
    rent: '',
    roomType: null,
    floor: null,
    capacity: null,
    number: null,
    options: initializeFormData(),
  }
}

function showError(message: string) {
  popupMessage.value = message
  showMessage.value = true
}

const saveFormData = async () => {
  isLoading.value = true
  try {
    // Validation de l'unicité du numéro
      const existingRoomNumbers = ServiceProduct.value
      .map((room: any) => String(room.roomNumber))
      .filter((num:any) => num !== 'null' && num !== 'undefined')

    if (existingRoomNumbers.includes(String(formData.value.number))) {
      showError(t('Errors.roomNumberExists'))
      return
    }



    // Validation de la capacité selon le type
    const roomType = roomTypeData.value.find((t: any) => t.id === formData.value.roomType)
    const requestedCapacity = Number(formData.value.capacity)
    const maxAllowedCapacity = Number(roomType?.defaultGuest)

    if (roomType && requestedCapacity > maxAllowedCapacity) {
      showError(t('Errors.capacityExceeded', { max: maxAllowedCapacity }))
      return
    }

    const roomPayload = {
      service_id: serviceStore.serviceId,
      product_name: formData.value.name,
      product_type_id: formData.value.roomType,
      description: formData.value.description,
      capacity: formData.value.capacity,
      room_number: formData.value.number,
      floor: formData.value.floor,
      status: formData.value.status,
      price: formData.value.rent,
      created_by: userStore.UserId,
    }

    console.log('roomPayload', roomPayload)

    const roomResponse = await createRoom(roomPayload)
    const roomId = roomResponse.data.id
    console.log('roomId', roomId)

    // applyDefaultOptions()

    const optionsPayload = Object.entries(formData.value.options).map(
      ([id, value]: [string, any]) => {
        const optionMeta = defaultOptionsMap.value[Number(id)]
        return {
          service_product_id: roomId,
          option_id: Number(id),
          option_type: optionMeta?.type || null,
          value,
          created_by: userStore.UserId,
          last_modified_by: userStore.UserId,
        }
      },
    )

    console.log('optionsPayload', optionsPayload)

    const optionsResponse = await createRoomOptions({ data: optionsPayload })

    closeModal()
    fetchServiceProduct()

    resetFormData()

    toast.success(t('toast.roomCreated'))
    console.log('optionsResponse', optionsResponse)
  } catch (error) {
    console.error('Error while saving', error)
  } finally {
    isLoading.value = false
  }
}

const fetchServiceProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getServiceProductWithOptions(serviceId)
    const serviceProducts = response.data
    console.log('Service Products:', serviceProducts)

    if (Array.isArray(serviceProducts)) {
      console.log('response.data est un tableau')
      const serviceProductWithOptions = serviceProducts.map((product: any) => {
        const associatedOptions = product.options.filter(
          (option: any) => option.serviceProductId == product.id,
        )
        return {
          ...product,
          options: associatedOptions,
        }
      })
      ServiceProduct.value = serviceProductWithOptions
    } else {
      console.error("response.data n'est pas un tableau.")
      console.log(response.data)
    }

    console.log('Service Products avec options (depuis backend):', ServiceProduct.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
  }
}

onMounted(async () => {
  await fetchOptions()
  await fetchRoomType()
  console.log('defaultOptionsByType', defaultOptionsByType.value)
})
onMounted(async () => {
  setTimeout(async () => {
    await fetchServiceProduct()
    loading.value = false
  }, 500)
})

const flattenServiceProducts = computed(() => {
  return ServiceProduct.value.map((product: any) => {
    const statusClasses = getStatusColor(product.status).split(' ')
    const flatProduct: ProductOptionType = {
      ...product,
      statusColor: {
        label: t(`statut.${product.status}`),
        bg: statusClasses[0],
        text: statusClasses[1],
      },
      RoomTypeName: getRoomTypeName(product.productTypeId),
    }
    console.log('00000', flatProduct)

    product.options?.forEach((option: any) => {
      const key = `option_${option.optionId}`
      flatProduct[key] = option.value
    })

    return flatProduct
  })
})

watch(locale, fetchServiceProduct)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-700'
    case 'booked':
      return 'bg-blue-100 text-blue-700'
    case 'occupied':
      return 'bg-red-100 text-red-700'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-700'
    case 'cleaning':
      return 'bg-purple-50 text-purple-700'
    case 'dirty':
      return 'bg-red-50 text-orange-700'
    default:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-500/15 dark:text-gray-500'
  }
}

const roomIds = ref<any>(null)

const onEditProduct = (room: any) => handleProductAction('edit', room)
const onDeleteProduct = (room: any) => handleProductAction('delete', room)
const showRoomDetails = (room: any) => handleProductAction('view-details', room)

const handleProductAction = (action: string, room: any) => {
  if (action === 'edit') {
    roomIds.value = room.id
    console.log('room.id', roomIds.value)
    const roomToEdit = flattenServiceProducts.value.find((r: any) => r.id === Number(room.id))

    if (roomToEdit) {
      selectedRoom.value = roomToEdit
      formData.value.name = roomToEdit.productName
      formData.value.description = roomToEdit.description
      formData.value.rent = roomToEdit.price
      formData.value.status = roomToEdit.status
      formData.value.roomType = roomToEdit.productTypeId
      formData.value.floor = roomToEdit.floor
      formData.value.capacity = roomToEdit.capacity
      formData.value.number = roomToEdit.roomNumber
      let roomOptions = Array.isArray(roomToEdit.options) ? roomToEdit.options : []

      const updatedOptions: Record<number, any> = {}

      options.value.forEach((opt: any) => {
        const existing = roomOptions.find((o: any) => o.optionId === opt.id)
        if (opt.type === 'multiselect') {
          updatedOptions[opt.id] = existing ? existing.value || [] : []
        } else {
          updatedOptions[opt.id] = existing ? existing.value || '' : ''
        }
      })

      formData.value.options = updatedOptions

      console.log('Editing reservation:', formData.value.options)

      isEditMode.value = true

      nextTick(() => {
        modalOpen.value = true
      })
    }
  } else if (action === 'delete') {
    selectedRoomId.value = room.id
    console.log('selectedRoomId.value', room.id)
    Show.value = true
  } else if (action === 'view-details') {
    roomIds.value = room.id
    console.log('room.id', roomIds.value)
    const roomToEdit = flattenServiceProducts.value.find((r: any) => r.id === Number(room.id))

    if (roomToEdit) {
      selectedRoom.value = roomToEdit
      router.push({
        name: 'RoomDetailsModal',
        params: { id: room.id.toString() },
      })
      store.setRoomSelect(selectedRoom.value)
      console.log('selectedRoom.value', selectedRoom.value)
    }
  }
}

const confirmDelete = async () => {
  if (selectedRoomId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteServiceProduct(selectedRoomId.value)
      toast.success(t('toast.roomDelete'))
      ServiceProduct.value = ServiceProduct.value.filter((r: any) => r.id !== selectedRoomId.value)
      fetchServiceProduct()
      console.log(`Suppression du room  ID: ${selectedRoomId.value}`)
    } catch (error: any) {
      console.error('Error:', error?.data?.message || 'Unexpected error occurred')
      toast.error(t('errorKey'))
    } finally {
      loadingDelete.value = false
      Show.value = false
      selectedRoomId.value = null
    }
  }
}

const updateFormData = async () => {
  isLoading.value = true
  try {
    const roomId = selectedRoom.value?.id
    if (!roomId) {
      throw new Error('Aucune chambre sélectionnée pour la mise à jour.')
    }

    // Obtenir tous les numéros de chambres, sauf celle en cours de mise à jour
    const existingRoomNumbers = ServiceProduct.value
      .filter((room: any) => room.id !== roomId)
      .map((room: any) => String(room.roomNumber))
      .filter((num: any) => num !== 'null' && num !== 'undefined')

    // Vérifier si un autre a déjà ce numéro
    if (existingRoomNumbers.includes(String(formData.value.number))) {
      showError(t('Errors.roomNumberExists'))
      return
    }

    // Validation de la capacité selon le type
    const roomType = roomTypeData.value.find((t: any) => t.id === formData.value.roomType)
    const requestedCapacity = Number(formData.value.capacity)
    const maxAllowedCapacity = Number(roomType?.defaultGuest)

    if (roomType && requestedCapacity > maxAllowedCapacity) {
      showError(t('Errors.capacityExceeded', { max: maxAllowedCapacity }))
      return
    }

    const roomPayload = {
      service_id: serviceStore.serviceId,
      product_name: formData.value.name,
      description: formData.value.description,
      status: formData.value.status,
      product_type_id: formData.value.roomType,
      price: formData.value.rent,
      capacity: formData.value.capacity,
      room_number: formData.value.number,
      floor: formData.value.floor,
    }

    console.log('Mise à jour de la chambre ID:', roomId)
    await updateRoom(roomId, roomPayload)

    const optionsPayload = Object.entries(formData.value.options).map(
      ([id, value]: [string, any]) => {
        const optionMeta = defaultOptionsMap.value[Number(id)]
        return {
          service_product_id: roomId,
          option_id: Number(id),
          option_type: optionMeta?.type || null,
          value: value,
        }
      }
    )

    console.log('Payload des options à mettre à jour:', optionsPayload)
    await updateRoomOptions(roomId, optionsPayload)

    toast.success(t('toast.updateRoom'))

    // Réinitialisation du formulaire
    formData.value = {
      name: '',
      status: '',
      description: '',
      rent: '',
      options: {},
    }
    fetchServiceProduct()
    selectedRoom.value = null
    isEditMode.value = false
    modalOpen.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    toast.error(t('toast.Error'))
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
      await saveFormData()
    }
    // router.push('/reservations') // Redirige une fois terminé
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  formData.value = {
    name: '',
    status: '',
    description: '',
    rent: '',
    options: {},
  }
  isEditMode.value = false
  modalOpen.value = false
}

const OpenModal = () => {
  modalOpen.value = true
  isEditMode.value = false
}

const getRoomTypeName = (id: number) => {
  const found = roomTypeData.value.find((s: any) => s.value === id)
  return found ? found.label : ''
}

const roomDetailsModal = ref(false)

// Colonnes essentielles pour la table
const essentialColumns = computed(() => [
  {
    name: 'productName',
    label: t('Name'),
    type: 'text',
    sortable: true,
    filterable: true,
    width: '200px',
  },
  {
    name: 'roomNumber',
    label: t('room_number'),
    type: 'text',
    sortable: true,
    filterable: true,
    width: '100px',
  },
  {
    name: 'price',
    label: t('Rent'),
    type: 'currency',
    filterable: true,
    width: '120px',
  },
  {
    name: 'statusColor',
    label: t('Status'),
    filterable: true,
    sortable: true,
    type: 'badge',
    width: '100px',
  },
  {
    name: 'RoomTypeName',
    label: t('RoomTypes'),
    filterable: true,
    sortable: true,
    type: 'text',
    width: '150px',
  },
  {
    name: 'capacity',
    label: t('capacity'),
    filterable: true,
    sortable: true,
    type: 'text',
  },

  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    width: '150px',
    actions: [
      {
        name: 'View Details',
        event: 'view-details',
        icone: `<svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>`,
        tooltip: t('View_Details'),
      },
      {
        name: 'Edit',
        event: 'edit',
        icone: `<svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>`,
        tooltip: t('Edit'),
      },
      {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
        tooltip: t('Delete'),
      },
    ],
  },
])

const closeRoomDetails = () => {
  roomDetailsModal.value = false
  selectedRoom.value = null
}

const onEditFromModal = (room: any) => {
  closeRoomDetails()
  onEditProduct(room)
}

const onDeleteFromModal = (room: any) => {
  closeRoomDetails()
  onDeleteProduct(room)
}




const applyFilter = async (filter: RoomFilterItem) => {
  loading.value = true
  const res = await filterRoom(serviceStore.serviceId!, filter)
   ServiceProduct.value = res.data
  console.log('re', res)

  loading.value = false
}
onMounted(async () => {
  await applyFilter({
    searchText: '',
    status: '',
    roomType: '',
    equipment: [],
    floor: '',
  })
  loading.value = false
})



</script>

<style scoped>
/* Style amélioré pour le bouton */
</style>
