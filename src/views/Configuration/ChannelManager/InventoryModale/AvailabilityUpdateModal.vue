<template>
  <!-- Overlay -->
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-[9998]" @click="closeModal" />

  <!-- Right side panel -->
  <div :class="[
    'fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 dark:text-gray-100 shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out',
    isOpen ? 'translate-x-0' : 'translate-x-full'
  ]">
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold">{{ $t('Availability Update') }}</h2>
        <button @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div class="space-y-4">
          <div v-for="(entry, idx) in entries" :key="entry.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Room Types -->
              <div class="w-full">
                <MultipleSelect v-model="entry.selectedRoomTypes" :options="roomTypeOptions" :lb="$t('Room Types')"
                  :maxVisibleTags="1" defaultDisplayMode="limited" />
              </div>

              <!-- Apply to all room types removed -->

              <!-- Availability -->
              <Input :lb="$t('Availability')" v-model="entry.availability" :input-type="'number'" min="0"
                :placeholder="$t('Enter availability')" :is-required="true" />
            </div>

            <!-- Date Range -->
            <div class="mt-4">
              <InputDoubleDatePicker :modelValue="{ start: entry.dateFrom, end: entry.dateTo }"
                @update:modelValue="(val: any) => updateDateRange(idx, val)" :allowPastDates="false"
                :is-required="true" />
            </div>

            <!-- Remove row -->
            <div class="mt-4 flex justify-end">
              <button v-if="entries.length > 1" @click="removeEntry(entry.id)"
                class="text-gray-400 dark:text-gray-300 hover:text-red-500 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Add row -->
        <button @click="addEntry" class="text-purple-500 text-sm font-medium hover:text-purple-600">
          {{ $t('Add Entry') }}
        </button>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <BasicButton :label="$t('cancel')" variant="light" @click="closeModal" />
        <BasicButton :label="$t('saveChanges')" :variant="'success'" :loading="isSaving" @click="save" />
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import MultipleSelect from '@/components/forms/FormElements/MultipleSelect.vue'
import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { updateAvaibility } from '@/services/channelManagerApi'

interface RoomType {
  id: string
  name: string
}

const props = defineProps<{
  isOpen: boolean
  propertyId: string | number
  roomTypes: RoomType[]
}>()

const emit = defineEmits(['close', 'save', 'refresh'])
const { t } = useI18n()
const toast = useToast()
const isSaving = ref(false)

type Entry = {
  id: string
  selectedRoomTypes: Array<{ label: string; value: string | number }>
  dateFrom: string | null
  dateTo: string | null
  availability: string | number
}

const entries = ref<Entry[]>([])

const roomTypeOptions = computed(() => {
  return (props.roomTypes || []).map(rt => ({ label: rt.name, value: rt.id }))
})

const initEntries = () => {
  entries.value = [
    {
      id: crypto.randomUUID(),
      selectedRoomTypes: [],
      dateFrom: null,
      dateTo: null,
      availability: '',
    }
  ]
}

watch(() => props.isOpen, (open) => {
  if (open) initEntries()
})

const addEntry = () => {
  entries.value.push({
    id: crypto.randomUUID(),
    selectedRoomTypes: [],
    dateFrom: null,
    dateTo: null,
    availability: '',
  })
}

const removeEntry = (id: string) => {
  entries.value = entries.value.filter(e => e.id !== id)
}

const updateDateRange = (idx: number, val: { start: string | null; end: string | null }) => {
  const e = entries.value[idx]
  if (!e) return
  e.dateFrom = val?.start || null
  e.dateTo = val?.end || null
}

const closeModal = () => emit('close')

const save = async () => {
  console.log('reservation',)
  try {
    isSaving.value = true
    // Validate entries
    const invalid = entries.value.some(e => (
      (!e.selectedRoomTypes || e.selectedRoomTypes.length === 0)
    ) || !e.dateFrom || !e.dateTo || e.availability === '' || e.availability === null)
    if (invalid) {
      toast.error(t('Please fill all fields'))
      isSaving.value = false
      return
    }
    console.log('entries.value', entries.value)
    const values: any[] = []
    const safeEntries = Array.isArray(entries.value) ? entries.value : []
    for (const e of safeEntries) {
      const base = {
        property_id: String(props.propertyId),
        date_from: String(e.dateFrom),
        date_to: String(e.dateTo),
        availability: Number(e.availability)
      }
      const roomTypes = Array.isArray(e.selectedRoomTypes) ? e.selectedRoomTypes : []
      for (const sel of roomTypes) {
        if (!sel || sel.value === undefined || sel.value === null) continue
        values.push({ ...base, room_type_id: String(sel.value) })
      }
    }

    if (values.length === 0) {
      toast.error(t('Please fill all fields'))
      isSaving.value = false
      return
    }

    const payload = { values }

    const res = await updateAvaibility(String(props.propertyId), payload)
    console.log('res call back', res)
    toast.success(t('toast.SucessUpdate'))
    emit('save', payload)
    emit('refresh')
    closeModal()
  } catch (error: any) {
    const serverMessage = error?.response?.data?.message || error?.message
    toast.error(serverMessage || t('toast.error'))
  } finally {
    isSaving.value = false
  }
}

</script>
