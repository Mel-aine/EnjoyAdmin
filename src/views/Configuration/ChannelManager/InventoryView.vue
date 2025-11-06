<template>
  <ChannelManagerLayout>
    <div class="bg-gray-50">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">{{ t('loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('error') }}</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button @click="fetchData" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {{ t('retry') }}
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="p-6 min-h-screen">
        <div class="max-w-full mx-auto">
          <!-- Header Controls -->
          <div class="flex flex-wrap gap-4 items-center justify-between">
            <!-- Filters -->
            <div class="flex gap-3 items-center">
              <div class="w-full">
                <SelectChannel @change="handleRestrictionFilterChange" />
              </div>

              <div class="w-full">
                <AutoCompleteSelect
                  :options="roomTypesOptions"
                  :defaultValue="t('room_filter')"
                  :is-required="false"
                  :use-dropdown="true"
                  @update:modelValue="handleRoomTypeChange"
                />
              </div>

              <div class="w-full">
                <AutoCompleteSelect
                  :options="rateTypesOptions"
                  :defaultValue="t('rate_filter')"
                  :is-required="false"
                  :use-dropdown="true"
                  @update:modelValue="handleRateTypeChange"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <BasicButton
                :label="t('saveChanges')"
                variant="light"
                :disabled="!hasChanges"
                :icon="CloudUpload"
                @click="saveChanges"
              />

              <BasicButton
                :label="t('resetChanges')"
                variant="light"
                :disabled="!hasChanges"
                :icon="RotateCw"
                @click="resetChanges"
              />

              <BasicButton
                :label="t('bulkUpdate')"
                variant="light"
                :icon="PenLine"
                @click="showBulkUpdateModal = true"
              />
            </div>
          </div>

          <!-- Calendar Grid -->
           <ChannelInventoryCalendar ref="calendarRef"  :roomTypes="roomTypes"></ChannelInventoryCalendar>
        </div>
      </div>
    </div>

    <!-- bulk Update -->
    <BulkUpdateModal
      :is-open="showBulkUpdateModal"
      :roomTypes="roomTypes"
      :rateTypes="rateTypes"
      @close="showBulkUpdateModal = false"
      @save="handleBulkUpdateSave"
    />

  </ChannelManagerLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import SelectChannel from '@/components/forms/FormElements/SelectChannel.vue'
import { CloudUpload, RotateCw, PenLine } from 'lucide-vue-next'
import BulkUpdateModal from './InventoryModale/BulkUpdateModal.vue'
import { getRoomTypesAndRatePlans } from '@/services/channelManagerApi'
import { useServiceStore } from '@/composables/serviceStore'
import ChannelInventoryCalendar from './ChannelInventoryCalendar.vue'

// Types
interface RoomType {
  id: string
  name: string
  occupancy: number
  count_of_rooms: number
}

interface RateType {
  id: string
  name: string
  roomId: string
}

// Composables
const { t } = useI18n()
const toast = useToast()

// Refs
const isLoading = ref(true)
const error = ref<string | null>(null)
const selectedRoom = ref<string>('all')
const selectedRate = ref<string>('all')
const roomTypes = ref<RoomType[]>([])
const rateTypes = ref<RateType[]>([])
const showBulkUpdateModal = ref(false)
const hasChanges = ref(false)
const currentService = useServiceStore().getCurrentService
const calendarRef = ref<any>(null)

// Computed
const roomTypesOptions = computed(() => [
  { label: t('allRooms'), value: 'all' },
  ...roomTypes.value.map((r) => ({ label: r.name, value: r.id }))
])

const rateTypesOptions = computed(() => {
  const filteredRates = selectedRoom.value === 'all'
    ? rateTypes.value
    : rateTypes.value.filter(rt => rt.roomId === selectedRoom.value)

  return [
    { label: t('allRates'), value: 'all' },
    ...filteredRates.map(rt => ({ label: rt.name, value: rt.id }))
  ]
})

// Handlers
const handleRoomTypeChange = (value: string) => {
  selectedRoom.value = value
  if (selectedRate.value !== 'all' && !rateTypes.value.some(rt => rt.id === selectedRate.value && rt.roomId === value)) {
    selectedRate.value = 'all'
  }
}

const handleRateTypeChange = (value: string) => {
  selectedRate.value = value
}

// Fetch data - MODIFIÉ POUR UTILISER UNE SEULE API
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const propertyId = currentService.channexPropertyId
    const response = await getRoomTypesAndRatePlans(propertyId)

    console.log('API Response:', response.data?.data?.roomTypes)

    if (response.data?.data?.roomTypes) {
      const apiRoomTypes = response.data.data.roomTypes

      // Transformer les données de l'API
      const transformedRoomTypes: RoomType[] = []
      const transformedRateTypes: RateType[] = []

      apiRoomTypes.forEach((item: any) => {
        const roomType = item.roomType

        // Ajouter le room type
        transformedRoomTypes.push({
          id: roomType.id,
          name: roomType.title,
          occupancy: roomType.default_occupancy || roomType.occ_adults,
          count_of_rooms: roomType.count_of_rooms
        })

        // Ajouter les rate plans associés
        if (item.ratePlans && item.ratePlans.length > 0) {
          item.ratePlans.forEach((ratePlan: any) => {
            transformedRateTypes.push({
              id: ratePlan.id,
              name: ratePlan.title,
              roomId: roomType.id
            })
          })
        }
      })

      roomTypes.value = transformedRoomTypes
      rateTypes.value = transformedRateTypes

      console.log('Transformed Room Types:', roomTypes.value)
      console.log('Transformed Rate Types:', rateTypes.value)

    } else {
      throw new Error('Invalid response format')
    }

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    toast.error(error.value)
    console.error('Fetch error:', err)
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(t('changesSaved'))
    hasChanges.value = false
  } catch (err) {
    toast.error(t('errorSaving'))
  } finally {
    isLoading.value = false
  }
}

const resetChanges = () => {
  hasChanges.value = false
  toast.info(t('changesReset'))
}

const handleBulkUpdateSave = (data: any) => {
  console.log('Bulk update data:', data)
  toast.success('Bulk update applied successfully')
  hasChanges.value = true
}

const handleRestrictionFilterChange = (restrictions: string[]) => {
  if (calendarRef.value) {
    calendarRef.value.handleRestrictionChange(restrictions)
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>
