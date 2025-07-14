<template>
  <div v-if="modelValue" class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
    <!-- Overlay -->
    <div
      class="fixed inset-0 h-full w-full bg-black/25 bg-opacity-50"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[800px] overflow-hidden">

        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ room?.productName }} {{ room?.roomNumber }}</h2>
            <p class="text-sm text-gray-600">{{ $t('Room_Details') }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="$emit('edit', room)" class="inline-flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded-lg text-sm transition">

              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              {{ $t('edit') }}
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            <!-- Informations de base -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ $t('Basic_Information') }}
              </h3>
              <div class="space-y-2">
                <DetailRow :label="$t('Name')" :value="room?.productName" />
                <DetailRow :label="$t('Rent')" :value="room?.price" suffix="XAF" />
                <DetailRow :label="$t('Status')" :value="room?.statusColor.label" type="badge" />
                <DetailRow :label="$t('RoomTypes')" :value="room?.RoomTypeName" />
              </div>
            </div>

            <!-- Spécifications -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                {{ $t('Specifications') }}
              </h3>
              <div class="space-y-2">
                <DetailRow :label="$t('RoomSize(sqm)')" :value="room?.option_12" suffix="m²" />
                <DetailRow :label="$t('NumberofRooms')" :value="room?.option_13" />
                <DetailRow :label="$t('numberBeds')" :value="room?.option_31" />
                <DetailRow :label="$t('numberBathrooms')" :value="room?.option_32" />
                <DetailRow :label="$t('BedType')" :value="$t(`options.values.${room?.option_2}`)" />
              </div>
            </div>

            <!-- Équipements -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
                {{ $t('Amenities') }}
              </h3>
              <div class="space-y-2">
                <DetailRow :label="$t('AirConditioning')" :value="room?.option_6" type="boolean" />
                <DetailRow :label="$t('Wi-fi')" :value="room?.option_7" type="boolean" />
                <DetailRow :label="$t('TV')" :value="$t(`options.values.${room?.option_15}`)"  />
                <DetailRow :label="$t('MiniBar')" :value="room?.option_16" type="boolean" />
                <DetailRow :label="$t('SafeDepositBox')" :value="room?.option_17" type="boolean" />
              </div>
            </div>

            <!-- Caractéristiques -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {{ $t('Features') }}
              </h3>
              <div class="space-y-2">
                <DetailRow :label="$t('View')" :value="$t(`options.values.${room?.option_3}`)" />
                <DetailRow :label="$t('Balcony')" :value="room?.option_4" type="boolean" />
                <DetailRow :label="$t('Terrace')" :value="room?.option_5" type="boolean" />
                <DetailRow :label="$t('PrivatePool')" :value="room?.option_20" type="boolean" />
                <DetailRow :label="$t('Jacuzzi/Spa')" :value="room?.option_21" type="boolean" />
              </div>
            </div>

            <!-- Services -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z"/>
                </svg>
                {{ $t('Services') }}
              </h3>
              <div class="space-y-2">
                <DetailRow :label="$t('BreakfastIncluded')" :value="room?.option_8" type="boolean" />
                <DetailRow :label="$t('Housekeeping')"  :value="$t(`options.values.${room?.option_24}`)" />
                <DetailRow :label="$t('Parking')"  :value="$t(`options.values.${room?.option_25}`)" />
                <DetailRow :label="$t('RoomService')" :value="room?.option_26" type="boolean" />
                <DetailRow :label="$t('SelfCheck-in')" :value="room?.option_27" type="boolean" />
              </div>
            </div>

            <!-- Politiques -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ $t('Policies') }}
              </h3>
              <div class="space-y-2">
                <DetailRow :label="$t('Check-inTime')" :value="room?.option_28" />
                <DetailRow :label="$t('Check-outTime')" :value="room?.option_29" />
                <DetailRow :label="$t('SmokingAllowed')" :value="$t(`options.values.${room?.option_22}`)" />
                <DetailRow :label="$t('PetsAllowed')" :value="room?.option_23" type="boolean" />
                <DetailRow :label="$t('WheelchairAccessible')" :value="room?.option_19" type="boolean" />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            {{ $t('Last_updated') }}: {{ formatDate(room?.updatedAt) }}
          </div>
          <div class="flex space-x-3">
            <button @click="$emit('delete', room)" class="inline-flex items-center gap-1 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-lg text-sm transition">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              {{ $t('delete') }}
            </button>
            <button @click="closeModal" class="inline-flex items-center gap-1 bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-2 rounded-lg text-sm transition">
              {{ $t('Close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DetailRow from './DetailRow.vue'

// Props et événements
const props = defineProps({
  modelValue: Boolean,
  room: Object
})

const emit = defineEmits(['update:modelValue', 'edit', 'delete', 'close'])

// Méthodes
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

.btn-ghost {
  @apply bg-transparent text-gray-400 hover:text-gray-600;
}
</style>
