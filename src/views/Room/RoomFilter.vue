<!-- RoomsSearch.vue -->
<template>
  <div class="flex justify-end mb-3" v-if="!showFilter">
    <button
      @click="showFilter = true"
      class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
    >
      <FilterIcon class="mr-2 text-white" :size="20" />
      {{ $t('reservationsList.filterSectionTitle') }}
    </button>
  </div>
  <div
    class="shadow-lg bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    v-if="showFilter"
  >
    <div class="p-6 bg-gray-50 border-b border-gray-200">
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FilterIcon class="mr-2 text-primary" :size="20" />
          {{ $t('reservationsList.filterSectionTitle') }}
        </h2>
        <button @click="showFilter = false">
          <XCircleIcon class="mr-2 text-primary" :size="20" />
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div class="">
          <Input
            :lb="$t('roomsSearch.searchByRoomNumber')"
            :inputType="'text'"
            :placeholder="$t('roomsSearch.searchPlaceholder')"
            :id="'searchText'"
            :forLabel="'roomsSearch.searchByRoomNumber'"
            v-model="filters.searchText"
          />
        </div>

        <div>
          <label
            for="equipment"
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >{{ $t('roomsSearch.filterEquipment') }}:</label
          >
          <MultipleSelect :options="equipmentOptions" v-model="filters.equipment" />

          <p class="text-xs text-gray-500 mt-1">{{ $t('roomsSearch.multiSelectHint') }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div>
          <label
            for="roomType"
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >{{ $t('roomsSearch.filterRoomType') }}:</label
          >
          <select
            id="roomType"
            v-model="filters.roomType"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">{{ $t('roomsSearch.filterAll') }}</option>
            <option v-for="type in activeRoomTypes" :key="type.id" :value="type.id">
              {{ type.label }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="status"
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >{{ $t('roomsSearch.filterStatus') }}:</label
          >
          <select
            id="status"
            v-model="filters.status"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">{{ $t('roomsSearch.filterAll') }}</option>
            <option v-for="statusOption in statusOptions" :key="statusOption" :value="statusOption">
              {{ $t(`statut.${statusOption}`) }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="floor"
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >{{ $t('roomsSearch.filterFloor') }}:</label
          >
          <select
            id="floor"
            v-model="filters.floor"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">{{ $t('roomsSearch.filterAll') }}</option>
            <option v-for="floorOption in floorOptions" :key="floorOption" :value="floorOption">
               {{ floorOption }}
            </option>
          </select>
        </div>

        <div></div>

        <div class="mt-6 flex justify-end gap-3 lg:col-span-2">
          <button
            @click="applyFilters"
            class="relative bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center disabled:opacity-50"
          >
            <!-- <svg
              v-if="loading"
              class="animate-spin h-4 w-4 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg> -->

            <SearchIcon class="mr-2" :size="18" />
            {{ $t('reservationsList.applyFilters') }}
          </button>


          <button
            @click="clearFilters"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <XCircleIcon class="mr-2" :size="18" /> {{ $t('reservationsList.clearFilters') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Filter as FilterIcon, Search as SearchIcon, XCircle as XCircleIcon } from 'lucide-vue-next'
import { defineAsyncComponent as defineAsyncComponentInput } from 'vue'
const Input = defineAsyncComponentInput(() => import('@/components/forms/FormElements/Input.vue'))
import type { RoomFilterItem } from '@/utils/models'
import { getTypeProductByServiceId, getOptionsEquipement } from '@/services/api'
import type { RoomTypeData } from '@/types/option'
import { useServiceStore } from '@/composables/serviceStore'
import MultipleSelect from '@/components/forms/FormElements/MultipleSelect.vue'


const emits = defineEmits(['filter'])


// const props = defineProps<{
//   loading: boolean
// }>()


// Filter state
const filters = ref<RoomFilterItem>({
  searchText: '',
  status: '',
  roomType: '',
  equipment: [],
  floor: '',
})

const showFilter = ref(false)
const serviceStore = useServiceStore()

// Options for status dropdown
const statusOptions = ref([
  'available',
  'occupied',
  'outOfOrder',
  'maintenance',
  'cleaning',
  'booked',
])

// Equipment and room type options
const activeRoomTypes = ref<RoomTypeData[]>([])
const equipmentOptions = ref<any[]>([])

// Floor options (you can adjust this based on your hotel's floors)
const floorOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const applyFilters = async () => {
emits('filter', filters.value)
}


const clearFilters = () => {
  filters.value.searchText = ''
  filters.value.status = ''
  filters.value.roomType = ''
  filters.value.equipment = []
  filters.value.floor = ''
   applyFilters()
}

const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getTypeProductByServiceId(serviceId)

    activeRoomTypes.value = response.data
      .filter((type: RoomTypeData) => type.status === 'active')
      .map((item: RoomTypeData) => ({
        ...item,
        value: item.id,
        label: item.roomTypeName,
      }))
  } catch (error) {
    console.error('Erreur lors de la récupération des types de chambre:', error)
  }
}

const fetchEquipments = async () => {
  try {
    const response = await getOptionsEquipement()

    equipmentOptions.value = response.data
    console.log('equipmentOptions.value', equipmentOptions.value)
    // .filter((equipment: EquipmentData) => equipment.status === 'active')
    // .map((item: EquipmentData) => ({
    //   ...item,
    //   roomType: item.roomType?.roomTypeName,
    //   value: item.id,
    //   label: item.name,
    // }));
  } catch (error) {
    console.error('Erreur lors de la récupération des équipements:', error)
  }
}

// Initial filter application on component mount
onMounted(() => {
  fetchRoomType()
  fetchEquipments()
  applyFilters()
})
</script>

<style>
.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Custom styling for multi-select */
select[multiple] option:checked {
  background: linear-gradient(0deg, #0d9488 0%, #0d9488 100%);
  color: white;
}
</style>
