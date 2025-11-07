<template>
  <ChannelManagerLayout>
    <div class="bg-gray-50 dark:bg-gray-900">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300">{{ t('loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{{ t('error') }}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ error }}</p>
          <button @click="fetchData"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
            <div class="flex gap-3 items-center w-5/12">
              <div class="w-full">
                <SelectChannel @change="handleRestrictionFilterChange" />
              </div>

              <div class="w-full">
                <MultipleSelect
                  v-model="selectedRooms"
                  :options="roomTypesOptions"
                  :maxVisibleTags="1"
                  defaultDisplayMode="limited"
                  class="w-full"
                />
              </div>

              <div class="w-full">
                <MultipleSelect
                  v-model="selectedRates"
                  :options="rateTypesOptions"
                  :maxVisibleTags="1"
                  defaultDisplayMode="limited"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <BasicButton
                :label="t('saveChanges')"
                :variant="hasChanges ? 'success' : 'light'"
                :disabled="!hasChanges"
                :icon="CloudUpload"
                :loading="isSaving"
                @click="saveChanges"
              />

              <BasicButton
                :label="t('resetChanges')"
                :variant="hasChanges ? 'danger' : 'light'"
                :disabled="!hasChanges"
                :icon="RotateCw"
                @click="resetChanges"
              />

              <BasicButton :label="t('bulkUpdate')" variant="light" :icon="PenLine"
                @click="showBulkUpdateModal = true" />

              <BasicButton :label="t('Availability Update')" variant="light" :icon="PenLine"
                @click="showAvailabilityUpdateModal = true" />

              <BasicButton :label="t('Rate Update')" variant="light" :icon="PenLine"
                @click="showRateUpdateModal = true" />
            </div>
          </div>

          <!-- Calendar Grid -->
          <ChannelInventoryCalendar
            ref="calendarRef"
            :roomTypes="filteredRoomTypes"
            :rateTypes="filteredRateTypes"
            @value-selected="onValueSelected"
          ></ChannelInventoryCalendar>
        </div>
      </div>
    </div>

    <!-- bulk Update -->
    <template v-if="showBulkUpdateModal">
      <BulkUpdateModal :is-open="showBulkUpdateModal" :roomTypes="roomTypes" :rateTypes="rateTypes"
        @close="showBulkUpdateModal = false" @save="handleBulkUpdateSave"
        :propertyId="currentService.channexPropertyId" />
    </template>

    <!-- Availability Update -->
    <template v-if="showAvailabilityUpdateModal">
      <AvailabilityUpdateModal
        :is-open="showAvailabilityUpdateModal"
        :roomTypes="roomTypes"
        :propertyId="currentService.channexPropertyId"
        @close="showAvailabilityUpdateModal = false"
        @save="handleAvailabilityUpdateSave"
        @refresh="calendarRef?.fetchRestrictions && calendarRef.fetchRestrictions()"
      />
    </template>

    <!-- Rate Update -->
    <template v-if="showRateUpdateModal">
      <RateUpdateModal
        :is-open="showRateUpdateModal"
        :ratePlans="rateTypes"
        :propertyId="currentService.channexPropertyId"
        @close="showRateUpdateModal = false"
        @save="handleRateUpdateSave"
        @refresh="calendarRef?.fetchRestrictions && calendarRef.fetchRestrictions()"
      />
    </template>

  </ChannelManagerLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'
import MultipleSelect from '@/components/forms/FormElements/MultipleSelect.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import SelectChannel from '@/components/forms/FormElements/SelectChannel.vue'
import { CloudUpload, RotateCw, PenLine } from 'lucide-vue-next'
import BulkUpdateModal from './InventoryModale/BulkUpdateModal.vue'
import { getRoomTypesAndRatePlans, updateRestrictions, updateAvaibility } from '@/services/channelManagerApi'
import AvailabilityUpdateModal from './InventoryModale/AvailabilityUpdateModal.vue'
import RateUpdateModal from './InventoryModale/RateUpdateModal.vue'
import { useServiceStore } from '@/composables/serviceStore'
import ChannelInventoryCalendar from './ChannelInventoryCalendar.vue'

// Types
interface RoomType {
  id: string
  name: string
  occupancy: number
  count_of_rooms: number,
  ratePlans: any[]
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
const selectedRooms = ref<Array<{ label: string; value: string }>>([])
const selectedRates = ref<Array<{ label: string; value: string }>>([])
const roomTypes = ref<RoomType[]>([])
const rateTypes = ref<RateType[]>([])
const showBulkUpdateModal = ref(false)
const showAvailabilityUpdateModal = ref(false)
const showRateUpdateModal = ref(false)
const isSaving = ref(false)
const hasChanges = ref(false)
const currentService = useServiceStore().getCurrentService
const calendarRef = ref<any>(null)
const pendingChange = ref<any | null>(null)

// Computed
const roomTypesOptions = computed(() =>
  roomTypes.value.map((r) => ({ label: r.name, value: r.id }))
)

const rateTypesOptions = computed(() => {
  const selectedRoomIds = selectedRooms.value.map(r => r.value)
  const byRoom = selectedRoomIds.length === 0
    ? rateTypes.value
    : rateTypes.value.filter(rt => selectedRoomIds.includes(rt.roomId))
  return byRoom.map(rt => ({ label: rt.name, value: rt.id }))
})

// Filtered arrays passed to calendar
const filteredRoomTypes = computed(() => {
  const ids = selectedRooms.value.map(r => r.value)
  if (ids.length === 0) return roomTypes.value
  return roomTypes.value.filter(r => ids.includes(r.id))
})

const filteredRateTypes = computed(() => {
  const roomIds = selectedRooms.value.map(r => r.value)
  const rateIds = selectedRates.value.map(r => r.value)
  let filtered = rateTypes.value
  if (roomIds.length > 0) {
    filtered = filtered.filter(rt => roomIds.includes(rt.roomId))
  }
  if (rateIds.length > 0) {
    filtered = filtered.filter(rt => rateIds.includes(rt.id))
  }
  return filtered
})

// Trigger calendar refetch when filters change
watch([filteredRoomTypes, filteredRateTypes], () => {
  if (calendarRef.value?.fetchRestrictions) {
    calendarRef.value.fetchRestrictions()
  }
})

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
          count_of_rooms: roomType.count_of_rooms,
          ratePlans:item.ratePlans
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
    if (!pendingChange.value) return
    isSaving.value = true

    const propertyId = currentService.channexPropertyId as string
    const payloadValues: any[] = []

    if (pendingChange.value.type === 'AVL') {
      payloadValues.push({
        property_id: propertyId,
        room_type_id: pendingChange.value.room_type_id,
        date_from: pendingChange.value.date_from,
        date_to: pendingChange.value.date_to,
        availability: Number(pendingChange.value.value)
      })
      await updateAvaibility(propertyId, { values: payloadValues })
    } else {
      const entry: Record<string, any> = {
        property_id: propertyId,
        rate_plan_id: pendingChange.value.rate_plan_id,
        date_from: pendingChange.value.date_from,
        date_to: pendingChange.value.date_to
      }

      const restrictionKey = pendingChange.value.restriction
      const val = pendingChange.value.value
      if (restrictionKey === 'rate') entry.rate = Number(val)
      else if (restrictionKey === 'closed_arrival') entry.closed_to_arrival = val ? 1 : 0
      else if (restrictionKey === 'closed_departure') entry.closed_to_departure = val ? 1 : 0
      else if (restrictionKey === 'stop') entry.stop_sell = val ? 1 : 0
      else if (restrictionKey === 'availability') entry.availability = Number(val)
      else if (restrictionKey === 'min_stay_arrival') entry.min_stay_arrival = Number(val)
      else if (restrictionKey === 'min_stay_through') entry.min_stay_through = Number(val)
      else if (restrictionKey === 'max_stay') entry.max_stay = Number(val)
      else if (restrictionKey === 'closed') entry.closed = val ? 1 : 0

      payloadValues.push(entry)
      await updateRestrictions(propertyId, { values: payloadValues })
    }

    toast.success(t('toast.SucessUpdate'))
    hasChanges.value = false
    pendingChange.value = null
    if (calendarRef.value?.fetchRestrictions) {
      calendarRef.value.fetchRestrictions()
    }
  } catch (err) {
    const serverMessage = (err as any)?.response?.data?.message || (err as any)?.message
    toast.error(serverMessage || t('toast.error'))
  } finally {
    isSaving.value = false
  }
}

const resetChanges = () => {
  hasChanges.value = false
  pendingChange.value = null
  if (calendarRef.value?.resetSelection) {
    calendarRef.value.resetSelection()
  }
  if (calendarRef.value?.fetchRestrictions) {
    calendarRef.value.fetchRestrictions()
  }
}

const handleBulkUpdateSave = (data: any) => {
  console.log('Bulk update data:', data)
  hasChanges.value = false
}

const handleAvailabilityUpdateSave = (payload: any) => {
  console.log('Availability update payload:', payload)
  hasChanges.value = false
  showAvailabilityUpdateModal.value = false
  if (calendarRef.value?.fetchRestrictions) {
    calendarRef.value.fetchRestrictions()
  }
}

const handleRateUpdateSave = (payload: any) => {
  console.log('Rate update payload:', payload)
  hasChanges.value = false
  showRateUpdateModal.value = false
  if (calendarRef.value?.fetchRestrictions) {
    calendarRef.value.fetchRestrictions()
  }
}

const handleRestrictionFilterChange = (restrictions: string[]) => {
  if (calendarRef.value) {
    calendarRef.value.handleRestrictionChange(restrictions)
  }
}

const onValueSelected = (payload: any) => {
  pendingChange.value = payload
  hasChanges.value = true
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>
