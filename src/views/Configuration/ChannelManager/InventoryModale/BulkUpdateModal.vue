<template>
  <!-- Overlay avec z-index plus élevé -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 bg-opacity-50 z-[9998] transition-opacity"
    @click="closeModal"
  />


  <div
    :class="[
      'fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">{{ $t('tooltip.Bulk Update') }}</h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 transition-colors"
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
                class="text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                {{ $t('Affected Dates') }}:
              </h3>
              <div v-else class="w-[110px]"></div>

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
                class="text-gray-400 hover:text-red-500 transition-colors"
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
            <div class="flex flex-wrap gap-4 ml-[110px]">
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
            <h3 class="text-sm font-semibold text-gray-900">{{ $t('Affected Restrictions') }} :</h3>

            <InputCheckBox
              label="Rate"
              id="rate"
              :input-type="'number'"
              v-model="restrictions.rate"
            />
            <Input v-model="rateValue" placeholder="Rate" :disabled="!restrictions.rate" />

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
            <h3 class="text-sm font-semibold text-gray-900">{{ $t('Affected Rooms') }}:</h3>

            <div class="relative">
              <input
                type="text"
                :placeholder="$t('common.search')"
                v-model="searchQuery"
                class="w-full h-10 rounded-t-lg border border-gray-300 pl-3 pr-10 text-sm focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
            </div>

            <div></div>
            <div class="border border-gray-200 rounded-b-lg p-4 space-y-3 max-h-64 overflow-y-auto">
              <InputCheckBox
                :label="$t('commons.selectAll')"
                id="selectAll"
                v-model="selectAll"
                @update:modelValue="handleSelectAll"
              />

              <div class="space-y-3 border-t border-gray-200 pt-4">
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
      <div class="px-6 py-4 border-t border-gray-200">
        <button
          @click="handleSave"
          class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          {{ $t('Save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue';
import InputCheckBox from '@/components/forms/FormElements/InputCheckBox.vue';
import Toggle from '@/components/forms/FormElements/Toggle.vue';
import Input from '@/components/forms/FormElements/Input.vue';

// Props
interface Props {
  isOpen: boolean;
  roomTypes?: Array<{ id: string; name: string; filteredRates?:[] }>;
  rateTypes?: Array<{ id: string; name: string; roomId?: string }>;
}

const props = withDefaults(defineProps<Props>(), {
  roomTypes: () => [],
  rateTypes: () => []
});

// Emits
const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'save': [data: any];
  'close': [value: boolean];
}>();

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
      mo: true,
      tu: true,
      we: true,
      th: true,
      fr: true,
      sa: true,
      su: true
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







const handleSave = () => {
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
    }
  };

  emit('save', data);
  closeModal();
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
