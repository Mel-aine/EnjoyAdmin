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
                <SelectChannel />
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

    <!--Override Modal-->
    <OverrideModal
      :show="showModal"
      @update:show="showModal = $event"
      @confirm="handleConfirm"
      @cancel="showModal = false"
      title="Value Override"
      room-type="SUita"
    />

    <ValueOverrideRateModal
    :show="showModals"
    room-type="Lifestyle Suite"
    rate-plan="Rate Plan for Lifestyle Suite A2"
    current-price="200000"
    :loading="isProcessing"
    @update:show="showModals = $event"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
  </ChannelManagerLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import SelectChannel from '@/components/forms/FormElements/SelectChannel.vue'
import { CloudUpload, RotateCw, PenLine, Settings, Copy } from 'lucide-vue-next'
import BulkUpdateModal from './InventoryModale/BulkUpdateModal.vue'
import OverrideModal from './InventoryModale/OverrideModal.vue'
import ValueOverrideRateModal from './InventoryModale/ValueOverrideRateModal.vue'

// Types
interface RoomType {
  id: string
  name: string
}

interface RateType {
  id: string
  name: string
  code: string
  roomId: string // Lien avec le room
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
const showModal = ref(false)
const showModals = ref(false)



// Computed
const roomTypesOptions = computed(() => {
  return [
    { label: t('allRooms'), value: 'all' },
    ...roomTypes.value.map((rt) => ({ label: rt.name, value: rt.id })),
  ]
})

const rateTypesOptions = computed(() => {
  return [
    { label: t('allRates'), value: 'all' },
    ...rateTypes.value.map((rt) => ({ label: rt.name, value: rt.id })),
  ]
})

// Methods
const handleRoomTypeChange = (value: string) => {
  selectedRoom.value = value
}

const handleRateTypeChange = (value: string) => {
  selectedRate.value = value
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null

  try {
    // TODO: Remplacer par vos appels API réels
    // const roomTypesResponse = await api.get('/room-types')
    // const rateTypesResponse = await api.get('/rate-types')

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Données simulées - à remplacer par votre API
    roomTypes.value = [
      { id: 'standard', name: 'Standard Room' },
      { id: 'deluxe', name: 'Deluxe Room' },
      { id: 'suite', name: 'Suite' },
    ]

    rateTypes.value = [
      { id: 'a2-standard', name: 'Rate A2', code: 'A2', roomId: 'standard' },
      { id: 'a3-standard', name: 'Rate A3', code: 'A3', roomId: 'standard' },
      { id: 'a4-standard', name: 'Rate A4', code: 'A4', roomId: 'standard' },
      { id: 'a2-deluxe', name: 'Rate A2', code: 'A2', roomId: 'deluxe' },
      { id: 'a3-deluxe', name: 'Rate A3', code: 'A3', roomId: 'deluxe' },
      { id: 'a2-suite', name: 'Rate A2', code: 'A2', roomId: 'suite' },
      { id: 'a4-suite', name: 'Rate A4', code: 'A4', roomId: 'suite' },
    ]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    toast.error(error.value)
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

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>
