<template>
  <div class="fixed inset-0 z-999 flex items-start hide-scrollbar justify-end bg-black/25 bg-opacity-40">
    <div class="bg-white dark:bg-gray-900 rounded-l-lg shadow-lg w-full max-w-5xl h-full mr-0 relative flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('Guest Registration Form') }}</h2>
        <button class="text-gray-500 hover:text-red-500" @click="$emit('close')">
          <span class="sr-only">Close</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-5 space-y-6">
        <!-- First Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input :lb="'Room n°'" v-model="form.roomNumber" :id="'roomNumber'" :placeholder="'Room n°'" />
          <Input :lb="'N° of persons'" :inputType="'Number'" v-model="form.numPersons" :id="'numPersons'" :placeholder="'N° of persons'" />
          
          <!-- Arrival Date with Time -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Arrival date
            </label>
            <div class="flex gap-0">
              <div class="relative flex-1">
                <flat-pickr v-model="form.arrivalDate" :config="flatpickrDateOnlyConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-l-lg rounded-r-none border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="'Select date'" />
                <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
              <InputTimePicker v-model="form.arrivalTime" custom-class="rounded-l-none border-l-0" />
            </div>
          </div>
          
          <!-- Departure Date with Time -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Departure date
            </label>
            <div class="flex gap-0">
              <div class="relative flex-1">
                <flat-pickr v-model="form.departureDate" :config="flatpickrDateOnlyConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-l-lg rounded-r-none border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="'Select date'" />
                <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
              <InputTimePicker v-model="form.departureTime" custom-class="rounded-l-none border-l-0" />
            </div>
            <p v-if="dateError" class="text-sm text-red-600 mt-1">
              {{ dateError }}
            </p>
          </div>
          
          <Input :lb="'Arriving from'" v-model="form.arrivingFrom" :id="'arrivingFrom'" :placeholder="'Arriving from'" />
          <Input :lb="'Going to'" v-model="form.goingTo" :id="'goingTo'" :placeholder="'Going to'" />
          <div class="sm:col-span-2">
            <Input :lb="'Means of transportation'" v-model="form.transport" :id="'transport'" :placeholder="'Means of transportation'" />
          </div>
          <div class="sm:col-span-2">
            <InputPaymentMethodSelect :label="$t('PaymentMethod')" v-model="form.paymentMethodId" />
          </div>
        </div>

        <!-- Personal Information Section -->
        <div class="grid grid-cols-1 gap-4">
          <Input :lb="'GIVEN NAME'" v-model="form.givenName" :id="'givenName'" :placeholder="'GIVEN NAME'" />
          <Input :lb="'SURNAME'" v-model="form.surname" :id="'surname'" :placeholder="'SURNAME'" />
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Date of Birth
            </label>
            <div class="relative">
              <flat-pickr v-model="form.birthDate" :config="flatpickrDateConfig"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                :placeholder="'Select date'" />
              <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalendarIcon />
              </span>
            </div>
          </div>
          <Input :lb="'Place of Birth'" v-model="form.birthPlace" :id="'birthPlace'" :placeholder="'Place of Birth'" />
          <Input :lb="'Nationality'" v-model="form.nationality" :id="'nationality'" :placeholder="'Nationality'" />
          <Input :lb="'Country of permanent residence'" v-model="form.residenceCountry" :id="'residenceCountry'" :placeholder="'Country of permanent residence'" />
        </div>

        <!-- Contact Information Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input :lb="'Tel'" v-model="form.tel" :id="'tel'" :placeholder="'Tel'" />
          <Input :lb="'Fax'" v-model="form.fax" :id="'fax'" :placeholder="'Fax'" />
          <Input :lb="'E-mail address'" :inputType="'email'" v-model="form.email" :id="'email'" :placeholder="'E-mail address'" />
          <Input :lb="'B.P'" v-model="form.bp" :id="'bp'" :placeholder="'B.P'" />
        </div>

        <!-- Document Information Section -->
        <div class="grid grid-cols-1 gap-4">
          <Input :lb="'Profession'" v-model="form.profession" :id="'profession'" :placeholder="'Profession'" />
          <Input :lb="'Passport N° / Identification card'" v-model="form.documentNumber" :id="'documentNumber'" :placeholder="'Passport N° / Identification card'" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Delivered on the
              </label>
              <div class="relative">
                <flat-pickr v-model="form.documentDeliveredOn" :config="flatpickrDateConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="'Select date'" />
                <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
            </div>
            <Input :lb="'at'" v-model="form.documentDeliveredAt" :id="'documentDeliveredAt'" :placeholder="'at'" />
          </div>
        </div>
      </div>

      <!-- Footer with buttons -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
        <button 
          type="button" 
          @click="$emit('close')" 
          class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Cancel
        </button>
        <ButtonComponent 
          type="button" 
          @click="save"
        >
          Save Guest
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import Input from '@/components/forms/FormElements/Input.vue'
import flatPickr from 'vue-flatpickr-component'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import InputTimePicker from '@/components/forms/FormElements/InputTimePicker.vue'
import 'flatpickr/dist/flatpickr.css'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import InputPaymentMethodSelect from '@/components/reservations/foglio/InputPaymentMethodSelect.vue'

const emit = defineEmits(['close', 'save'])

const form = reactive({
  roomNumber: '',
  numPersons: 1,
  arrivalDate: '',
  arrivalTime: '14:00', // Heure par défaut pour le check-in
  departureDate: '',
  departureTime: '12:00', // Heure par défaut pour le check-out
  arrivingFrom: '',
  goingTo: '',
  transport: '',
  paymentMethodId: null as number | null,
  givenName: '',
  surname: '',
  birthDate: '',
  birthPlace: '',
  nationality: '',
  residenceCountry: '',
  tel: '',
  fax: '',
  email: '',
  bp: '',
  profession: '',
  documentNumber: '',
  documentDeliveredOn: '',
  documentDeliveredAt: '',
})

// Validation des dates avec prise en compte de l'heure
const dateError = computed(() => {
  if (form.arrivalDate && form.departureDate) {
    const arrivalDateTime = new Date(`${form.arrivalDate}T${form.arrivalTime || '00:00'}`)
    const departureDateTime = new Date(`${form.departureDate}T${form.departureTime || '00:00'}`)
    
    if (departureDateTime <= arrivalDateTime) {
      return 'Departure date and time must be after arrival date and time'
    }
  }
  return null
})

const save = () => {
  if (dateError.value) {
    return // Empêcher la sauvegarde si erreur de date
  }
  emit('save', { ...form })
  emit('close')
}

// Configuration flatpickr pour date seulement (sans heure)
const flatpickrDateOnlyConfig = {
  altInput: true,
  altFormat: 'd-m-Y',
  dateFormat: 'Y-m-d'
}

// Configuration pour les dates simples (sans heure) - comme date de naissance
const flatpickrDateConfig = {
  altInput: true,
  altFormat: 'd-m-Y',
  dateFormat: 'Y-m-d'
}

</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

.input {
  @apply dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90;
}
</style>