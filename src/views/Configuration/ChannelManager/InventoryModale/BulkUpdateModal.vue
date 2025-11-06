<template>
  <!-- Overlay avec z-index plus élevé -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 bg-opacity-50 z-[9998] transition-opacity"
    @click="closeModal"
  />


  <div
    :class="[
      'fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 dark:text-gray-100 shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('tooltip.Bulk Update') }}</h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6">
        <!-- Affected Dates -->

        <div class="mb-6">
          <div
            v-for="(range, index) in dateRanges"
            :key="`date-range-${range.id}`"
            class="mb-4"
          >
            <!-- Ligne titre + input + bouton -->
            <div class="flex items-center gap-3 mb-3">
              <h3
                v-if="index === 0"
                class="w-[180px] text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap"
              >
                {{ $t('Affected Dates') }}:
              </h3>
              <div v-else class="w-[180px]"></div>

              <InputDoubleDatePicker
                class="flex-1"
                :modelValue="range"
                @update:modelValue="updateDateRange(index, $event)"
                :allowPastDates="false"
                :is-required="true"
              />

              <button
                v-if="dateRanges.length > 1"
                @click="removeDateRange(range.id)"
                class="text-gray-400 dark:text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>

            <!-- Cases à cocher - UN PAR RANGE -->
            <div class="flex flex-wrap gap-2 ml-[190px]">
              <InputCheckBox label="Mo" v-model="range.days.mo" />
              <InputCheckBox label="Tu" v-model="range.days.tu" />
              <InputCheckBox label="We" v-model="range.days.we" />
              <InputCheckBox label="Th" v-model="range.days.th" />
              <InputCheckBox label="Fr" v-model="range.days.fr" />
              <InputCheckBox label="Sa" v-model="range.days.sa" />
              <InputCheckBox label="Su" v-model="range.days.su" />
            </div>
          </div>

          <button
            @click="addDateRange"
            class="text-purple-500 text-sm font-medium hover:text-purple-600"
          >
            {{ $t('Add Date Range') }}
          </button>
        </div>


        <!-- Affected Restrictions -->
        <div class="mb-6">
          <div class="grid grid-cols-[180px_1fr_1fr] items-center gap-3">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ $t('Affected Restrictions') }} :</h3>

            <InputCheckBox
              label="Rate"
              id="rate"
              v-model="restrictions.rate"
            />
            <Input v-model="rateValue" placeholder="Rate"  :input-type="'number'" min="0" :disabled="!restrictions.rate" />

            <div></div>
            <InputCheckBox
              label="Stop Sell"
              id="stopSell"
              v-model="restrictions.stopSell"
            />
            <Toggle v-model="stopSellValue" :disabled="!restrictions.stopSell" />

            <div></div>
            <InputCheckBox
              label="Closed To Arrival"
              id="closedToArrival"
              v-model="restrictions.closedToArrival"
            />
            <Toggle v-model="closedToArrivalValue" :disabled="!restrictions.closedToArrival" />

            <div></div>
            <InputCheckBox
              label="Closed To Departure"
              id="closedToDeparture"
              v-model="restrictions.closedToDeparture"
            />
            <Toggle v-model="closedToDepartureValue" :disabled="!restrictions.closedToDeparture" />

            <div></div>
            <InputCheckBox
              label="Min Stay Arrival"
              id="minStayArrival"
              v-model="restrictions.minStayArrival"
            />
            <Input
              v-model="minStayArrivalValue"
              :input-type="'number'"
              placeholder="Min Stay Arrival"
              :disabled="!restrictions.minStayArrival"
            />

            <div></div>
            <InputCheckBox
              label="Min Stay Through"
              id="minStayThrough"
              v-model="restrictions.minStayThrough"
            />
            <Input
              v-model="minStayThroughValue"
              :input-type="'number'"
              placeholder="Min Stay Through"
              :disabled="!restrictions.minStayThrough"
            />

            <div></div>
            <InputCheckBox
              label="Max Stay"
              id="maxStay"
              v-model="restrictions.maxStay"
            />
            <Input
              v-model="maxStayValue"
              :input-type="'number'"
              placeholder="Max Stay"
              :disabled="!restrictions.maxStay"
            />
          </div>
        </div>

        <!-- Affected Rooms -->
        <div class="mb-6">
          <div class="grid grid-cols-[180px_1fr] items-start">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ $t('Affected Rooms') }}:</h3>

            <div class="relative">
              <input
                type="text"
                :placeholder="$t('common.search')"
                v-model="searchQuery"
                class="w-full h-10 rounded-t-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 pl-3 pr-10 focus:border-purple-300 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
            </div>

            <div></div>
            <div class="border border-gray-200 dark:border-gray-700 rounded-b-lg p-4 space-y-3 max-h-64 overflow-y-auto bg-white dark:bg-gray-900">
              <InputCheckBox
                :label="$t('commons.selectAll')"
                id="selectAll"
                v-model="selectAll"
                @update:modelValue="handleSelectAll"
              />

              <div class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div v-for="room in filteredRoomTypesAndRates" :key="room.id" class="space-y-2">
                  <InputCheckBox
                    :label="room.name"
                    :id="`room-${room.id}`"
                    v-model="selectedRooms[room.id]"
                    @update:modelValue="handleRoomChange(room.id)"
                  />

                  <div  class="ml-6 space-y-2">
                    <div v-for="rate in room.filteredRates" :key="rate.id">
                      <InputCheckBox
                        :label="rate.name"
                        :id="`rate-${rate.id}`"
                        v-model="selectedRates[rate.id]"
                        @update:modelValue="() => handleRateChange(room.id)"
                      />
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
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="!isSaving">{{ $t('Save') }}</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('Processing') }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { updateRestrictions } from '@/services/channelManagerApi';
import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue';
import InputCheckBox from '@/components/forms/FormElements/InputCheckBox.vue';
import Toggle from '@/components/forms/FormElements/Toggle.vue';
import Input from '@/components/forms/FormElements/Input.vue';

// Props
interface Props {
  isOpen: boolean;
  roomTypes?: Array<{ id: string; name: string; filteredRates?:[] }>;
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
  id: number;
  start: string;
  end: string;
  days: {
    mo: boolean;
    tu: boolean;
    we: boolean;
    th: boolean;
    fr: boolean;
    sa: boolean;
    su: boolean;
  };
}

interface Restrictions {
  rate: boolean;
  stopSell: boolean;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  minStayArrival: boolean;
  minStayThrough: boolean;
  maxStay: boolean;
}

// State
const dateRanges = ref<DateRange[]>([
  {
    id: 1,
    start: '',
    end: '',
    days: {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false
    }
  }
]);

const restrictions = reactive<Restrictions>({
  rate: false,
  stopSell: false,
  closedToArrival: false,
  closedToDeparture: false,
  minStayArrival: false,
  minStayThrough: false,
  maxStay: false
});

// Valeurs séparées pour les restrictions
const rateValue = ref('');
const stopSellValue = ref(false);
const closedToArrivalValue = ref(false);
const closedToDepartureValue = ref(false);
const minStayArrivalValue = ref('');
const minStayThroughValue = ref('');
const maxStayValue = ref('');

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

const addDateRange = () => {
  dateRanges.value.push({
    id: Date.now(),
    start: '',
    end: '',
    days: {
      mo: true,
      tu: true,
      we: true,
      th: true,
      fr: true,
      sa: true,
      su: true
    }
  });
};

const removeDateRange = (id: number) => {
  dateRanges.value = dateRanges.value.filter(range => range.id !== id);
};

const updateDateRange = (index: number, newRange: { start: string | null; end: string | null }) => {
  if (index >= 0 && index < dateRanges.value.length) {
    dateRanges.value[index].start = newRange.start || '';
    dateRanges.value[index].end = newRange.end || '';
  }
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
  // Build days array from checkbox booleans
  const toDaysArray = (dr: DateRange) => {
    const map: Record<string, boolean> = {
      mo: dr.days.mo,
      tu: dr.days.tu,
      we: dr.days.we,
      th: dr.days.th,
      fr: dr.days.fr,
      sa: dr.days.sa,
      su: dr.days.su
    }
    return Object.keys(map).filter((k) => map[k])
  }

  // Selected rate plan ids
  const ratePlanIds = Object.keys(selectedRates.value).filter((id) => selectedRates.value[id])

  // Compose entries for each date range × rate plan
  const entries = [] as any[]
  for (const rpId of ratePlanIds) {
    for (const dr of dateRanges.value) {
      if (!dr.start || !dr.end) continue
      const entry: Record<string, any> = {
        property_id: props.propertyId,
        rate_plan_id: rpId,
        date_from: dr.start,
        date_to: dr.end
      }

      const days = toDaysArray(dr)
      if (days.length > 0 && days.length < 7) entry.days = days

  if (restrictions.rate && rateValue.value !== '') {
    // Format rate as a decimal string per API specification
    const formatRateString = (val: string | number): string => {
      const raw = typeof val === 'string' ? val : String(val)
      const normalized = raw.replace(',', '.')
      const n = Number(normalized)
      if (!Number.isFinite(n)) return normalized.trim()
      return n.toString()
    }
    // Only include positive rates
    const n = Number(String(rateValue.value).replace(',', '.'))
    if (Number.isFinite(n) && n > 0) {
      entry.rate = formatRateString(rateValue.value)
    }
  }
      if (restrictions.minStayArrival && minStayArrivalValue.value !== '') {
        entry.min_stay_arrival = Number(minStayArrivalValue.value)
      }
      if (restrictions.minStayThrough && minStayThroughValue.value !== '') {
        entry.min_stay_through = Number(minStayThroughValue.value)
      }
      if (restrictions.maxStay && maxStayValue.value !== '') {
        entry.max_stay = Number(maxStayValue.value)
      }
      if (restrictions.closedToArrival) {
        entry.closed_to_arrival = closedToArrivalValue.value ? 1 : 0
      }
      if (restrictions.closedToDeparture) {
        entry.closed_to_departure = closedToDepartureValue.value ? 1 : 0
      }
      if (restrictions.stopSell) {
        entry.stop_sell = stopSellValue.value ? 1 : 0
      }

      entries.push(entry)
    }
  }

  const payload = { values: entries }

  console.log(payload)
  const data = {
    dateRanges: dateRanges.value,
    restrictions: {
      ...restrictions,
      rateValue: restrictions.rate ? rateValue.value : null,
      stopSellValue: restrictions.stopSell ? stopSellValue.value : null,
      closedToArrivalValue: restrictions.closedToArrival ? closedToArrivalValue.value : null,
      closedToDepartureValue: restrictions.closedToDeparture ? closedToDepartureValue.value : null,
      minStayArrivalValue: restrictions.minStayArrival ? minStayArrivalValue.value : null,
      minStayThroughValue: restrictions.minStayThrough ? minStayThroughValue.value : null,
      maxStayValue: restrictions.maxStay ? maxStayValue.value : null
    },
    rooms: {
      selectedRooms: Object.keys(selectedRooms.value).filter(id => selectedRooms.value[id]),
      selectedRates: Object.keys(selectedRates.value).filter(id => selectedRates.value[id])
    },
    payload
  };

  // Call backend to update restrictions
  try {
    isSaving.value = true
    await updateRestrictions(props.propertyId as string, payload)
    toast.success(t('toast.SucessUpdate'))
    emit('save', data)
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

// Watch pour réinitialiser les valeurs quand on décoche
watch(() => restrictions.minStayArrival, (newVal) => {
  if (!newVal) minStayArrivalValue.value = '';
});

watch(() => restrictions.minStayThrough, (newVal) => {
  if (!newVal) minStayThroughValue.value = '';
});

watch(() => restrictions.maxStay, (newVal) => {
  if (!newVal) maxStayValue.value = '';
});

watch(() => restrictions.rate, (newVal) => {
  if (!newVal) rateValue.value = '';
});
</script>
