<template>
  <!-- Overlay -->
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-[9998]" @click="closeModal" />

  <!-- Right side panel -->
  <div
    :class="[
      'fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 dark:text-gray-100 shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold">{{ $t('Rate Update') }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div class="space-y-4">
          <div v-for="(entry, idx) in entries" :key="entry.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Rate Plans -->
              <div class="w-full">
                <MultipleSelect
                  v-model="entry.selectedRatePlans"
                  :options="ratePlanOptions"
                  :lb="$t('Rate Plans')"
                  :maxVisibleTags="1"
                  defaultDisplayMode="limited"
                />
              </div>

              <!-- Rate -->
              <Input
                :lb="$t('Rate')"
                v-model="entry.rate"
                :input-type="'number'"
                min="0"
                :placeholder="$t('Enter rate')"
                :is-required="true"
              />
            </div>

            <!-- Date Range -->
            <div class="mt-4">
              <InputDoubleDatePicker
                :modelValue="{ start: entry.dateFrom, end: entry.dateTo }"
                @update:modelValue="(val:any) => updateDateRange(idx, val)"
                :allowPastDates="false"
                :is-required="true"
              />
            </div>

            <!-- Remove row -->
            <div class="mt-4 flex justify-end">
              <button
                v-if="entries.length > 1"
                @click="removeEntry(entry.id)"
                class="text-gray-400 dark:text-gray-300 hover:text-red-500 transition-colors"
              >
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
import { updateRestrictions } from '@/services/channelManagerApi'

interface RatePlan {
  id: string | number
  name: string
}

const props = defineProps<{ 
  isOpen: boolean
  propertyId: string | number
  ratePlans: RatePlan[]
}>()

const emit = defineEmits(['close', 'save', 'refresh'])
const { t } = useI18n()
const toast = useToast()
const isSaving = ref(false)

// Safe ID generator fallback
const generateId = () => {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      // @ts-ignore
      return crypto.randomUUID()
    }
  } catch {}
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

type Entry = {
  id: string
  selectedRatePlans: Array<{ label: string; value: string | number }>
  dateFrom: string | null
  dateTo: string | null
  rate: string | number
}

const entries = ref<Entry[]>([])

const ratePlanOptions = computed(() => {
  return (props.ratePlans || []).map(rp => ({ label: rp.name, value: rp.id }))
})

const initEntries = () => {
  entries.value = [
    {
      id: generateId(),
      selectedRatePlans: [],
      dateFrom: null,
      dateTo: null,
      rate: '',
    }
  ]
}

watch(() => props.isOpen, (open) => {
  if (open) initEntries()
})

const addEntry = () => {
  entries.value.push({
    id: generateId(),
    selectedRatePlans: [],
    dateFrom: null,
    dateTo: null,
    rate: '',
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
  try {
    isSaving.value = true
    // Validate entries
    const invalid = (Array.isArray(entries.value) ? entries.value : []).some(e => (
      (!e.selectedRatePlans || e.selectedRatePlans.length === 0)
    ) || !e.dateFrom || !e.dateTo || e.rate === '' || e.rate === null)
    if (invalid) {
      toast.error(t('Please fill all fields'))
      isSaving.value = false
      return
    }

    const values: any[] = []
    const safeEntries = Array.isArray(entries.value) ? entries.value : []
    for (const e of safeEntries) {
      const base = {
        property_id: String(props.propertyId),
        date_from: String(e.dateFrom),
        date_to: String(e.dateTo),
        rate: Number(e.rate)
      }
      const ratePlans = Array.isArray(e.selectedRatePlans) ? e.selectedRatePlans : []
      for (const sel of ratePlans) {
        if (!sel || sel.value === undefined || sel.value === null) continue
        values.push({ ...base, rate_plan_id: String(sel.value) })
      }
    }

    if (values.length === 0) {
      toast.error(t('Please fill all fields'))
      isSaving.value = false
      return
    }

    const payload = { values }
    console.log('play load',payload)
    await updateRestrictions(String(props.propertyId), payload)
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