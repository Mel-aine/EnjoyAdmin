<template>
  <div v-if="isOpen" class="fixed inset-0 overflow-hidden z-999999" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div class="relative w-screen max-w-4xl">
          <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-hidden">
            <div class="px-4 py-2 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-start justify-between">
                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">{{ $t('transfer_posting') }}</h2>
                <XIcon @click="onClose" class="text-gray-300 hover:text-red-300 cursor-pointer" aria-label="Close panel" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5 p-5">
              <div class="flex flex-col col-span-4">
                <Input :inputType="'search'" :placeholder="$t('Search folio, Room or Guest')" :id="'searchText'" :forLabel="'reservationsList.searchByNameOrNumber'" v-model="filters.searchText" />
                <div class="flex gap-2 mt-2">
                  <InputCheckBox :label="$t('inHouse')" :id="'inHouse'" v-model="filters.inHouse" />
                  <InputCheckBox :label="$t('Reservation')" :id="'reservation'" v-model="filters.reservation" />
                </div>
              </div>
              <div class=" col-span-2 align-middle mt-2 "></div>
            </div>

            <ReusableTable :columns="columnsFolios" :data="folios" :selectable="false" :loading="loading" :searchable="false" :show-header="false" :title="''">
              <template #column-action="{ item }">
                <BasicButton :label="$t('select')" @click="selectFolio(item)" />
              </template>
            </ReusableTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { XIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import BasicButton from '../../buttons/BasicButton.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputCheckBox from '../../forms/FormElements/InputCheckBox.vue'
import ReusableTable from '../../tables/ReusableTable.vue'
import type { Column } from '../../../utils/models'
import { findFolio } from '../../../services/foglioApi'
import { useServiceStore } from '../../../composables/serviceStore'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'select'])
const { t } = useI18n()

const loading = ref(false)
const folios = ref<any[]>([])
const filters = ref({ searchText: '', inHouse: true, reservation: false })

const onClose = () => emit('close')

const fetchFolio = async () => {
  loading.value = true
  try {
    const playload = {
      hotelId: useServiceStore().serviceId!,
      searchText: filters.value.searchText,
      inhouse: filters.value.inHouse,
      reservation: filters.value.reservation,
    }
    const response = await findFolio(playload)
    folios.value = response.data
  } catch (e) {
    console.log('error fetching folios', e)
  } finally {
    loading.value = false
  }
}

const debouncedFetchFolio = useDebounceFn(() => {
  const query = filters.value.searchText?.trim() || ''
  // For searches, keep threshold; empty query should still fetch all (with filters)
  if (query.length === 0 || query.length > 2) fetchFolio()
}, 300)

watch(() => filters.value.searchText, () => debouncedFetchFolio())
// When toggles change, always refetch (even with empty search)
watch(() => [filters.value.inHouse, filters.value.reservation], () => {
  debouncedFetchFolio()
})

// Fetch immediately when component mounts (shown via v-if in parent)
onMounted(() => {
  fetchFolio()
})

const columnsFolios = computed<Column[]>(() => [
  { key: 'folioNumber', label: t('Folio No.'), sortable: true },
  { key: 'roomNumber', label: t('Room'), sortable: true },
  { key: 'guest', label: t('Guest'), sortable: true },
  { key: 'arrivedDate', label: t('arrivalDate'), type: 'date', sortable: true },
  { key: 'departureDate', label: t('departureDate'), type: 'date', sortable: true },
  { key: 'balance', label: t('balance') },
  { key: 'action', label: '', type: 'custom' },
])

const selectFolio = (item: any) => {
  emit('select', item)
}
</script>

<style scoped></style>
