<template>
  <!-- Overlay avec z-index plus élevé -->
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 bg-opacity-50 z-[9998] transition-opacity" @click="closeModal" />


  <div :class="[
    'fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 dark:text-gray-100 shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out',
    isOpen ? 'translate-x-0' : 'translate-x-full'
  ]">
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('tooltip.Full Sync') }}</h2>
        <button @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6">
        <!-- Affected Dates -->

        <div class="mb-6">
          <div class="flex items-center gap-3 mb-3">
              <h3  
                class="w-[180px] text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                {{ $t('Affected Dates') }}:
              </h3>
              <InputDoubleDatePicker class="flex-1" :modelValue="dateRanges"
                @update:modelValue="updateDateRange" :allowPastDates="false" :is-required="true" />
            </div>
            <div class="grid grid-cols-[180px_1fr] items-center gap-3">
              <label class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ $t('SyncDays') }}:</label>
              <div class="flex items-center gap-3">
                <input type="number" v-model.number="daysCount" min="1" max="500" @input="onDaysInput"
                  class="w-32 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 pl-3 focus:border-purple-300 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/10" />
                <span class="text-xs" :class="isDaysValid ? 'text-gray-500 dark:text-gray-400' : 'text-red-600 dark:text-red-400'">
                  {{ isDaysValid ? $t('MaxDaysHelper') : $t('MaxDaysExceeded') }}
                </span>
              </div>
            </div>
        </div>


        <!-- Affected Rooms -->
        <div class="mb-6">
          <div class="grid grid-cols-[180px_1fr] items-start">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ $t('Affected Rooms') }}:</h3>

            <div class="relative">
              <input type="text" :placeholder="$t('common.search')" v-model="searchQuery"
                class="w-full h-10 rounded-t-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 pl-3 pr-10 focus:border-purple-300 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/10" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
            </div>

            <div></div>
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-b-lg p-4 space-y-3 max-h-64 overflow-y-auto bg-white dark:bg-gray-900">
              <InputCheckBox :label="$t('commons.selectAll')" id="selectAll" v-model="selectAll"
                @update:modelValue="handleSelectAll" />

              <div class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div v-for="room in filteredRoomTypesAndRates" :key="room.id" class="space-y-2">
                  <InputCheckBox :label="room.name" :id="`room-${room.id}`" v-model="selectedRooms[room.id]"
                    @update:modelValue="handleRoomChange(room.id)" />

                  <div class="ml-6 space-y-2">
                    <div v-for="rate in room.filteredRates" :key="rate.id">
                      <InputCheckBox :label="rate.name" :id="`rate-${rate.id}`" v-model="selectedRates[rate.id]"
                        @update:modelValue="() => handleRateChange(room.id)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <button @click="handleSave" :disabled="isSaving || !isDaysValid"
          class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <span v-if="!isSaving">{{ $t('sync') }}</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ $t('Processing') }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { fullSync } from '@/services/channelManagerApi';
import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue';
import InputCheckBox from '@/components/forms/FormElements/InputCheckBox.vue';
// Props
interface Props {
  isOpen: boolean;
  roomTypes?: Array<{ id: string; name: string; filteredRates?: [] }>;
  rateTypes?: Array<{ id: string; name: string; roomId?: string }>;
  propertyId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  roomTypes: () => [],
  rateTypes: () => [],
  propertyId: () => 'mock-property-id'
});

// Emits
const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'save': [data: any];
  'close': [value: boolean];
  'refresh': [];
}>();

const toast = useToast();
const { t } = useI18n();


// Types
interface DateRange {
  start: string;
  end: string;
}
// Initialize date range to today's date for both start and end
const getTodayDate = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dateRanges = ref<DateRange>({
  start: getTodayDate(),
  end: getTodayDate(),
})
const daysCount = ref<number>(1)
const isDaysValid = computed(() => Number.isFinite(daysCount.value) && daysCount.value >= 1 && daysCount.value <= 500)
const updatingVia = ref<'dates' | 'days' | null>(null)

const parseDate = (str: string) => {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const diffDaysInclusive = (startStr: string, endStr: string) => {
  const s = parseDate(startStr)
  const e = parseDate(endStr)
  if (!s || !e) return 0
  const msPerDay = 24 * 60 * 60 * 1000
  const startMid = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime()
  const endMid = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime()
  const diff = Math.floor((endMid - startMid) / msPerDay) + 1
  return Math.max(diff, 1)
}

const addDays = (startStr: string, days: number) => {
  const s = parseDate(startStr)
  if (!s) return startStr
  const d = new Date(s)
  d.setDate(d.getDate() + Math.max(days - 1, 0))
  return formatDate(d)
}

const updateDateRange = ( newRange: { start: string | null; end: string | null }) => {
    updatingVia.value = 'dates'
    dateRanges.value.start = newRange.start || ''
    dateRanges.value.end = newRange.end || ''
    const computedDays = diffDaysInclusive(dateRanges.value.start, dateRanges.value.end)
    daysCount.value = computedDays
    updatingVia.value = null
};

const onDaysInput = () => {
  if (updatingVia.value === 'dates') return
  updatingVia.value = 'days'
  if (!Number.isFinite(daysCount.value) || daysCount.value < 1) daysCount.value = 1
  if (daysCount.value > 500) daysCount.value = 500
  if (dateRanges.value.start) {
    dateRanges.value.end = addDays(dateRanges.value.start, daysCount.value)
  }
  updatingVia.value = null
}
const searchQuery = ref('');
const selectAll = ref(false);
const selectedRooms = ref<Record<string, boolean>>({});
const selectedRates = ref<Record<string, boolean>>({});
const isSaving = ref(false);

// Computed
const getRatesForRoom = (roomId: string) => {
  return props.rateTypes.filter(rate => rate.roomId === roomId);
};
const filteredRoomTypesAndRates = computed(() => {
  const query = searchQuery.value?.toLowerCase() || '';

  return props.roomTypes
    .map(room => {

      const filteredRates = getRatesForRoom(room.id).filter(rate =>
        rate.name.toLowerCase().includes(query)
      );
      if (room.name.toLowerCase().includes(query) || filteredRates.length > 0 || !query) {
        return {
          ...room,
          filteredRates
        };
      }

      return null;
    })
    .filter(Boolean) as Array<{ id: string; name: string; filteredRates: any[] }>;
});



// Methods
const closeModal = () => {
  emit('close', false);
};


const handleSelectAll = (value: boolean) => {
  // Sélectionner tous les rooms
  props.roomTypes.forEach(room => {
    selectedRooms.value[room.id] = value;
  });

  // Sélectionner tous les rates
  props.rateTypes.forEach(rate => {
    selectedRates.value[rate.id] = value;
  });
};


const updateSelectAllState = () => {
  const allRoomsSelected = props.roomTypes.every(room => selectedRooms.value[room.id]);
  const allRatesSelected = props.rateTypes.every(rate => selectedRates.value[rate.id]);
  selectAll.value = allRoomsSelected && allRatesSelected;
};
const handleRoomChange = (roomId: string) => {
  const isSelected = selectedRooms.value[roomId];
  const roomRates = getRatesForRoom(roomId);

  roomRates.forEach(rate => {
    selectedRates.value[rate.id] = isSelected;
  });

  updateSelectAllState();
};

const handleRateChange = (roomId: string) => {
  const roomRates = getRatesForRoom(roomId);

  const allRatesSelected = roomRates.every(rate => selectedRates.value[rate.id]);
  selectedRooms.value[roomId] = allRatesSelected;

  updateSelectAllState();
};







const handleSave = async () => {
  if (!isDaysValid.value) {
    toast.error(t('MaxDaysExceeded'))
    return
  }

  const data = {
    dateRanges: {
      from: dateRanges.value.start,
      to: dateRanges.value.end
    },
    selectedRooms: Object.keys(selectedRooms.value).filter(id => selectedRooms.value[id]),
    selectedRates: Object.keys(selectedRates.value).filter(id => selectedRates.value[id])
  };

  // Call backend to update restrictions
  try {
    isSaving.value = true
    await fullSync(props.propertyId as string, data)
    toast.success(t('toast.SucessUpdate'))
    emit('refresh')
    closeModal()
  } catch (error: any) {
    console.error('Error updating restrictions:', error)
    const serverMessage = error?.response?.data?.message || error?.message
    toast.error(serverMessage || t('toast.error'))
  } finally {
    isSaving.value = false
  }
};

</script>
