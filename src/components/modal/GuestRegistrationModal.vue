<template>
  <div class="fixed inset-0 z-999 flex items-start hide-scrollbar justify-end">
    <div class="bg-white dark:bg-gray-800 shadow-lg  w-[80%] h-full mr-0 relative flex flex-col">
      <!-- Header -->
      <div
        class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('QuickBooking') }}</h2>
        <button class="text-gray-500 hover:text-red-500" @click="$emit('close')">
          <span class="sr-only">Close</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content Area -->
      <div class="p-4 overflow-hidden">
        <div class="flex gap-1 h-full">
          <div class="overflow-y-auto w-6/12 bg-white dark:bg-gray-800">
            <div v-if="isPreviewLoading || !htmlContent" class="p-6">
              <div class="preview-skeleton animate-pulse space-y-4">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>

                <div class="mt-4 grid grid-cols-2 gap-4">
                  <div v-for="n in 6" :key="'col1-'+n" class="flex items-center gap-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                  </div>
                  <div v-for="n in 6" :key="'col2-'+n" class="flex items-center gap-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                  </div>
                </div>

                <div class="mt-4 flex items-center gap-2">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                </div>

                <div class="mt-8 grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else v-html="htmlContent"></div>
          </div>
          <div class="w-8/12 ps-2 min-h-0 overflow-y-auto space-y-6">
            <form @submit.prevent="handleSubmit">
          <!-- Room Configuration Section -->
          <section class="space-y-4">
            <div class="grid md:grid-cols-12 grid-cols-12 gap-1 items-end">
              <!-- Room Type -->
              <div class="relative col-span-3">
                <p v-if="submitted && !roomConfig.roomType" class="text-sm text-red-600 mb-1">
                  {{ $t('validation.invalidRoomType') }}
                </p>
                <AutoCompleteSelect v-model="roomConfig.roomType" :lb="$t('roomType')" :options="RoomTypes"
                  :defaultValue="$t('SelectRoomType')" :is-required="false" :use-dropdown="useDropdownRoomType"
                  :disabled="isLoadingRoom" @update:modelValue="handleRoomTypeChange"
                  :class="{ 'border-red-500': submitted && !roomConfig.roomType }" />
              </div>

              <!-- Rate Type -->
              <div class="relative col-span-2">
                <p v-if="submitted && !roomConfig.rateType" class="text-sm text-red-600 mb-1">
                  {{ $t('validation.invalidRateType') }}
                </p>
                <AutoCompleteSelect v-model="roomConfig.rateType" :lb="$t('rateType')" :options="rateTypeOptions"
                  :defaultValue="$t('SelectRateType')" :is-required="false" :use-dropdown="useDropdownRateType"
                  :disabled="!roomConfig.roomType" @update:modelValue="handleRateTypeChange"
                  :class="{ 'border-red-500': submitted && !roomConfig.rateType }" />
              </div>

              <!-- Room Number -->
              <div class="relative col-span-2">

                <AutoCompleteSelect v-model="roomConfig.roomNumber" :lb="$t('Room')" :options="roomOptions"
                  :defaultValue="$t('SelectRoom')" :is-required="false" :use-dropdown="useDropdownRoom"
                  :disabled="!roomConfig.roomType" :isLoading="roomConfig.isLoadingRooms"
                  @update:modelValue="handleRoomNumberChange"
                  :class="{ 'border-red-500': submitted && !roomConfig.roomNumber }" />
              </div>

              <!-- Adult Count -->
              <div class="col-span-1">
                <Select v-model="roomConfig.adultCount" :lb="$t('Adult')" :options="adultOptions"
                  :disabled="!roomConfig.roomType" :placeholder="$t('1')"
                  @change="handleOccupancyChange('adultCount', $event)" />
              </div>

              <!-- Child Count -->
              <div class="col-span-1">
                <Select v-model="roomConfig.childCount" :lb="$t('child')" :options="childOptions"
                  :disabled="!roomConfig.roomType" :placeholder="$t('0')"
                  @change="handleOccupancyChange('childCount', $event)" />
              </div>

              <!-- Rate -->
              <div class="flex align-center self-center col-span-2">
                <div class="relative inline-block w-full">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('rate') }} (XAF)
                  </label>
                  <div v-if="!isCustomPrize"
                    class="flex items-center rounded-lg border border-gray-300 mt-1.5 h-11 bg-gray-200 dark:bg-black px-4 py-2.5 text-sm"
                    :class="{ 'opacity-50': roomConfig.isLoadingRate }">
                    <span class="text-gray-500 hover:text-gray-700 mr-3 cursor-pointer" @click="isCustomPrize = true">
                      <PencilLine :size="18" />
                    </span>

                    <div v-if="roomConfig.isLoadingRate" class="flex-grow flex justify-end items-end">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                    </div>

                    <div v-else class="flex-grow">
                      <div class="font-medium text-gray-800 justify-end flex">
                        {{ roomConfig.rate }}
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <input type="number" v-model.number="roomConfig.rate"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-black/50 mt-1.5 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Check-in/out Section -->
          <section class="pt-4 space-y-4">
            <div class="md:flex relative items-start gap-0">
              <div class="flex flex-col w-full">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('check_in_date') }}
                </label>
                <div class="flex gap-0">
                  <InputDatePicker v-model="reservation.checkinDate" custom-class="rounded-r-none"
                    :allowPastDates="false" :placeholder="$t('Selectdate')" />
                  <InputTimePicker v-model="reservation.checkinTime" class="rounded-l-none" />
                </div>
              </div>

              <div class="flex flex-col  w-1/5">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('nights') }}
                </label>
                <input type="text" disabled :value="numberOfNights.toString()"
                  class="h-11 w-full rounded-none bg-black text-white px-4 py-2.5 text-sm">
              </div>

              <div class="flex flex-col w-full">
                <label class="mb-1.5 ml-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('check_out_date') }}
                </label>
                <div class="flex gap-0">
                  <InputDatePicker v-model="reservation.checkoutDate" :allowPastDates="false" :minDate="reservation.checkinDate || ''" :placeholder="$t('Selectdate')"
                    custom-class="rounded-none" />
                  <InputTimePicker v-model="reservation.checkoutTime" custom-class="rounded-r-lg" />
                </div>
                <p v-if="dateError" class="text-sm text-red-600 mt-1">
                  {{ $t(dateError) }}
                </p>
              </div>

              <div class="flex-col flex w-[500px] ms-2">
                <AutoCompleteSelect v-model="reservation.bookingType" :options="BookingType"
                  :defaultValue="$t('SelectReservationType')" :lb="$t('ReservationType')" :is-required="false"
                  :use-dropdown="useDropdownBooking" />
              </div>
            </div>
          </section>

          <!-- Additional Info Section -->
          <section class="pt-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input :lb="$t('ArrivingTo')" :id="'arriving'" :forLabel="'arriving'" :placeholder="$t('ArrivingTo')"
                  v-model="reservation.arrivingTo" />
              </div>
              <div>
                <Input :lb="$t('GoingTo')" :id="'going'" :forLabel="'going'" :placeholder="$t('GoingTo')"
                  v-model="reservation.goingTo" />
              </div>
              <div>
                <AutoCompleteSelect
                    v-model="reservation.meansOfTransport"
                    :options="TransportationModes"
                    :defaultValue="$t('MeansOfTransportation')"
                    :lb="$t('MeansOfTransportation')"
                    :is-required="false"
                    :use-dropdown="useDropdownBooking"
                    @clear-error="emit('clear-error')"
                  />
              </div>
              <div>
                <InputPaymentMethodSelect :label="$t('PaymentMethod')" v-model="billing.paymentMode" />
              </div>
            </div>
          </section>

          <!-- Personal Information Section -->
          <section class="pt-4 space-y-4 border-t border-black/50 mt-3">


            <div class="flex items-end w-full space-x-0">
              <div class="w-18">
                <Select :lb="$t('Title')" :options="GuestTitles" v-model="formData.title"
                  :default-value="$t('guestTitles.mr')" custom-class="rounded-r-none h-11" />
              </div>

              <div class="flex-1">
                <CustomerSearch @customer-selected="onCustomerSelected" v-model="formData" />
              </div>

              <div class="flex-1">
                <Input :lb="$t('LastName')" v-model="formData.lastName" :placeholder="$t('LastName')"
                  custom-class="rounded-none h-11 border-l-0" />
              </div>

              <div class="flex-1">
                <Input :lb="$t('MaidenName')" v-model="formData.maidenName" :placeholder="$t('MaidenName')"
                  custom-class="rounded-l-none h-11 border-l-0" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <InputDatePicker :title="$t('DateOfBirth')"  v-model="formData.dateOfBirth" :placeholder="$t('select_date')" />
              </div>

              <Input :lb="$t('placeOfBirth')" v-model="formData.placeOfBirth" :placeholder="$t('placeOfBirth')" />

              <div>
                <InputCountries :lb="$t('nationality')" v-model="formData.nationality"
                  :placeholder="$t('search_nationality')" />
              </div>
              <div>
                <InputCountries :lb="$t('countryOfPermanentResidence')" v-model="formData.country" />
              </div>
            </div>
          </section>

          <!-- Contact Information Section -->
          <section class="pt-4 space-y-4">
            <div :class="[
              'grid grid-cols-1 gap-4',
               formData.contactType ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            ]">
                <InputPhone :title="$t('Phone')" v-model="formData.phoneNumber" :id="'phone'" :is-required="false"
                custom-class="h-11" />

              <AutoCompleteSelect
                  v-model="formData.contactType"
                  :options="TypesOfContact"
                  :defaultValue="$t('contact_type')"
                  :lb="$t('contact_type')"
                  :is-required="false"
                  :use-dropdown="useDropdownBooking"
                  @clear-error="emit('clear-error')"
                  custom-class="h-11"
                />
                <!-- Input conditionnel basé sur le type de contact -->
                <div v-if="formData.contactType">
                  <InputPhone
                    v-if="contactInputComponent === 'InputPhone'"
                    :title="contactInputLabel"
                    v-model="contactValue"
                    :id="'contact-input'"
                    :is-required="false"
                    custom-class="h-11"
                  />

                  <InputEmail
                    v-else-if="contactInputComponent === 'InputEmail'"
                    v-model="contactValue"
                    :placeholder="contactInputLabel"
                    :title="contactInputLabel"
                    custom-class="h-11"
                  />

                  <Input
                    v-else-if="contactInputComponent === 'Input'"
                    :lb="contactInputLabel"
                    v-model="contactValue"
                    :placeholder="contactInputLabel"
                    custom-class="h-11"
                  />
               </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">

              <Input :lb="$t('Fax')" v-model="formData.fax" :placeholder="$t('Fax')" />
              <InputEmail v-model="formData.email" placeholder="info@gmail.com" :title="$t('Email')" required
                custom-class="h-11" />

              <Input :lb="$t('B.P')" v-model="formData.zipcode" :placeholder="$t('B.P')" />
               <ProfessionAutocomplete
                  v-model="formData.profession"
                  :lb="$t('profession')"
                  :placeholder="$t('profession')"
                  custom-class="h-11"
                />
            </div>
          </section>

          <!-- Document Information Section -->
          <section class="pt-4">
            <button @click.prevent="toggleIdentitySection" type="button"
              class="flex items-center justify-between w-full text-left group hover:bg-gray-50 dark:hover:text-black -m-2 p-2 rounded-md transition-colors">
              <h2 class="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                <svg class="w-5 h-5 mr-2 text-black dark:text-white " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-2 5v3m0 0l-1-1m1 1l1-1">
                  </path>
                </svg>
                {{ $t('IdentityInformation') }}
              </h2>

              <div class="flex items-center">
                <ChevronDownIcon :class="[
                  'w-5 h-5 text-gray-500 transition-all duration-200 group-hover:text-gray-700',
                  { 'rotate-180': showIdentitySection },
                ]" />
              </div>
            </button>

            <div v-show="showIdentitySection" class="mt-2 transition-all duration-300 ease-in-out">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Select :lb="$t('IDType')" v-model="formData.idType" :options="idTypeOptions"
                    :placeholder="$t('select_id_type')" />
                </div>
                <div class="">
                  <Input :lb="idNumberLabel" v-model="formData.idNumber" type="text" :placeholder="idNumberLabel" />
                </div>
              </div>
               <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">

                <div>
                  <InputDatePicker :title="$t('ExpiryDate')" v-model="formData.idExpiryDate"
                    :placeholder="$t('select_date')" />
                </div>
                <div>
                  <InputCountries :lb="$t('Countryofissue')" v-model="formData.issuingCountry" />
                </div>
                <div>
                  <Input :lb="$t('Cityofissue')" v-model="formData.issuingCity" :placeholder="$t('Cityofissue')" />
                </div>
              </div>
            </div>
          </section>
        </form>
          </div>
        </div>
      </div>

      <!-- Footer with buttons -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
        <BasicButton type="button" variant="outline" @click="printHtml" :label="$t('print')" />
        <BasicButton v-if="!confirmReservation" variant="info" :loading="isLoading" type="submit"
          @click="handleSubmit()" :disabled="isLoading || hasPendingUploads"
          :label="hasPendingUploads ? $t('UploadingImages') : $t('Reserve')">
        </BasicButton>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import Input from '@/components/forms/FormElements/Input.vue'
import InputTimePicker from '@/components/forms/FormElements/InputTimePicker.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import CustomerSearch from '@/components/customers/CustomerSarch.vue'
import InputPaymentMethodSelect from '@/components/reservations/foglio/InputPaymentMethodSelect.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import InputEmail from '../forms/FormElements/InputEmail.vue'
import InputPhone from '../forms/FormElements/InputPhone.vue'
import { PencilLine, ChevronDownIcon } from 'lucide-vue-next'
import { getIdentityTypesByHotelId } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useBooking } from '@/composables/useBooking2'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/composables/serviceStore'
import ProfessionAutocomplete from '../forms/FormElements/ProfessionAutocomplete.vue'
// @ts-ignore
import pHtml from '@/views/Bookings/p.html?raw'


interface SelectOption {
  value: string
  label: string
  label_fr?: string
}

interface RichSelectOption extends SelectOption {
  numberField: string
  dateField: string
  label_fr: string
}
const { t } = useI18n()
const emit = defineEmits(['close', 'save','clear-error'])


// Utiliser le composable useBooking
const {
  reservation,
  reservationId,
  formData,
  billing,
  roomConfigurations,
  RoomTypes,
  BookingType,
  isLoading,
  isLoadingRoom,
  dateError,
  numberOfNights,
  confirmReservation,
  isCustomPrize,
  pendingUploads,
  onRoomTypeChange,
  onRateTypeChange,
  onCustomerSelected,
  onOccupancyChange,
  getRateTypesForRoom,
  getRoomsForRoom,
  saveReservation,
  initialize,
  onRoomNumberChange,
  getAdultOptions,
  getChildOptions,
  TransportationModes,
} = useBooking()

// State management
const submitted = ref(false)
const showIdentitySection = ref(true)
const htmlContent = ref<string>('')
const isPreviewLoading = ref(true)

// Cache parsed template once; clone for subsequent renders
let _baseDoc: Document | null = null
let _parser: DOMParser | null = null

const renderPrintHtml = () => {
  try {
    // Initialize and cache base document once
    if (!_baseDoc) {
      _parser = new DOMParser()
      _baseDoc = _parser.parseFromString(pHtml as string, 'text/html')
    }
    const doc = document.implementation.createHTMLDocument('')
    const clonedRoot = (_baseDoc ?? (_parser ?? new DOMParser()).parseFromString(pHtml as string, 'text/html')).documentElement.cloneNode(true) as HTMLElement
    doc.replaceChild(clonedRoot, doc.documentElement)

    // Inject hotel header from current service
    const cs: any = serviceStore.getCurrentService
    if (cs) {
      const nameEl = doc.querySelector('.hotel-name') as HTMLElement | null
      if (nameEl) nameEl.textContent = (cs.hotelName ?? '').toString()
      const addrEl = doc.querySelector('.hotel-address') as HTMLElement | null
      if (addrEl) addrEl.textContent = [cs.address, cs.address2, cs.city].filter(Boolean).join(', ')
      const contactEl = doc.querySelector('.contact-info') as HTMLElement | null
      if (contactEl) {
        const bpText = [cs.postalCode, cs.city, cs.country].filter(Boolean).join(' ')
        const telText = cs.phoneNumber ? `Tel: ${cs.phoneNumber}` : ''
        const upperLine = [bpText ? `B.P.: ${bpText}` : '', telText].filter(Boolean).join(' / ')
        const lowerLine = [cs.email, cs.website].filter(Boolean).join(' / ')
        contactEl.innerHTML = [upperLine, lowerLine].filter(Boolean).join('<br>')
      }
    }

    const getSafe = (val: any) => (val ?? '').toString()
    const sumGuests = (() => {
      const rc: any = roomConfig.value || {}
      return (rc.adultCount || 0) + (rc.childCount || 0)
    })()
    const roomNumberLabel = (() => {
      const rc: any = roomConfig.value || {}
      const rn: any = rc.roomNumberLabel
      if (!rn) return ''
      if (typeof rn === 'object') return getSafe(rn.label || rn.value)
      return getSafe(rn)
    })()
    const getOptionLabel = (options: any[], value: any) => {
      const opt = options?.find?.((o: any) => o.value === value)
      return getSafe(opt?.label ?? value)
    }

    const filledMap: Record<string, string> = {
      'N° de chambre :': roomNumberLabel,
      'Nombre de personnes :': getSafe(sumGuests),
      "Date d'arrivée :": getSafe(reservation.value?.checkinDate),
      'Date de départ :': getSafe(reservation.value?.checkoutDate),
      'Venant de :': getSafe(reservation.value?.arrivingTo),
      'Se rendant à :': getSafe(reservation.value?.goingTo),
      'Mode de transport :': getOptionLabel(TransportationModes as unknown as any[], reservation.value?.meansOfTransport),
      'Mode de paiement :': getSafe(billing.value?.paymentMode),
      'NOM (en gros characters) :': getSafe(formData.value.lastName),
      'NOM jeune fille :': getSafe(formData.value.maidenName),
      'Date de naissance :': getSafe(formData.value.dateOfBirth),
      'Lieu de naissance :': getSafe(formData.value.placeOfBirth),
      'Nationalité :': getSafe(formData.value.nationality),
      'Pays de residence :': getSafe(formData.value.country),
      'Tél :': getSafe(formData.value.phoneNumber),
      'Fax :': getSafe(formData.value.fax),
      'E-mail address :': getSafe(formData.value.email),
      'B.P :': getSafe(formData.value.zipcode),
      'Profession :': getSafe(formData.value.profession),
      "Passeport / Carte d'identité N° :": getSafe(formData.value.idNumber),
      'Délivré le :': getSafe(formData.value.idExpiryDate),
      'A :': getSafe([formData.value.issuingCity, formData.value.issuingCountry].filter(Boolean).join(', ')),
    }

    const frLabels = Array.from(doc.querySelectorAll('.label-fr'))
    frLabels.forEach((el: Element) => {
      const text = (el.textContent || '').trim()
      const valueToInsert = filledMap[text]
      if (!valueToInsert) return
      const sibling = el.nextElementSibling as HTMLElement | null
      if (sibling && (sibling.classList.contains('line-dot') || sibling.classList.contains('line-empty'))) {
        const span = doc.createElement('span')
        span.className = 'filled-value'
        span.textContent = valueToInsert
        span.style.marginLeft = '6px'
        span.style.maxWidth = '30ch'
        sibling.appendChild(span)
      }
    })

    const container = doc.createElement('div')
     container.className = 'print-container'
     while (doc.body.firstChild) container.appendChild(doc.body.firstChild as Node)
     doc.body.appendChild(container)

    const style = doc.createElement('style')
    style.textContent = `
    .filled-value{font-weight:normal;color:#111;font-size:9pt;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .line-dot,.line-empty{overflow:hidden;}

    @media print {
      @page { size: A4 portrait; margin: 10mm; }
      .label-fr {
            white-space: nowrap;
            font-weight: bold;
            font-size: 11px;
        }
.      .print-container { width: calc(210mm - 5mm); height: calc(297mm - 20mm); overflow: hidden; zoom: 0.9; }
    }
    `
    doc.head.appendChild(style)

    return doc.documentElement.outerHTML
  } catch (err) {
    console.error('renderPrintHtml error:', err)
    return pHtml as string
  }
}

const updateHtml = () => {
  isPreviewLoading.value = true
  htmlContent.value = renderPrintHtml()
  isPreviewLoading.value = false
}

// Debounce preview updates to avoid heavy recompute on each keystroke
const debouncedUpdateHtml = useDebounceFn(() => {
  updateHtml()
}, 200)

// Dropdown controls
const useDropdownRoomType = ref(true)
const useDropdownRateType = ref(true)
const useDropdownRoom = ref(true)
const useDropdownBooking = ref(true)
const router = useRouter()
const serviceStore = useServiceStore()

// Utiliser la première configuration de chambre
const roomConfig = computed(() => roomConfigurations.value[0])

// Options
const GuestTitles = computed(() => [
  { label: t('guestTitles.mr'), value: 'Mr' },
  { label: t('guestTitles.mrs'), value: 'Mrs' },
  { label: t('guestTitles.miss'), value: 'Miss' },
  { label: t('guestTitles.dr'), value: 'Dr' },
])

const idTypeOptions = ref([])

// Computed properties
const rateTypeOptions = computed(() => {
  return getRateTypesForRoom(roomConfig.value.id)
})

const roomOptions = computed(() => {
  return getRoomsForRoom(roomConfig.value.id)
})

const adultOptions = computed(() => {
  return getAdultOptions(roomConfig.value.roomType)
})

const childOptions = computed(() => {
  return getChildOptions(roomConfig.value.roomType)
})

// Replace deep watchers with targeted field watchers
watch([
  () => formData.value.lastName,
  () => formData.value.maidenName,
  () => formData.value.dateOfBirth,
  () => formData.value.placeOfBirth,
  () => formData.value.nationality,
  () => formData.value.country,
  () => formData.value.phoneNumber,
  () => formData.value.fax,
  () => formData.value.email,
  () => formData.value.zipcode,
  () => formData.value.profession,
  () => formData.value.idNumber,
  () => formData.value.idExpiryDate,
  () => formData.value.issuingCity,
  () => formData.value.issuingCountry,
  () => billing.value?.paymentMode,
  () => reservation.value?.checkinDate,
  () => reservation.value?.checkoutDate,
  () => reservation.value?.arrivingTo,
  () => reservation.value?.goingTo,
  () => reservation.value?.meansOfTransport,
  () => roomConfig.value?.adultCount,
  () => roomConfig.value?.childCount,
  () => roomConfig.value?.roomNumber,
], () => debouncedUpdateHtml(), { immediate: true })

const fetchIdentityTypes = async () => {
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) return

    const res = await getIdentityTypesByHotelId(hotelId)

    idTypeOptions.value = res.data.data.data.map((type: any): RichSelectOption => {
      const normalizedName = type.name.toLowerCase().replace(/ /g, '')

      switch (normalizedName) {
        case 'passport':
        case 'passeport':
          return {
            label: type.name,
            value: type.name,
            numberField: 'passportNumber',
            dateField: 'passportExpiry',
            label_fr: t('identity.passport_number'),
          }
        case 'visa':
          return {
            label: type.name,
            value: type.name,
            numberField: 'visaNumber',
            dateField: 'visaExpiry',
            label_fr: t('identity.visa_number'),
          }
        default:
          return {
            label: type.name,
            value: type.name,
            numberField: 'idNumber',
            dateField: 'idExpiryDate',
            label_fr: t('identity.id_number'),
          }
      }
    })
  } catch (err) {
    console.error('Erreur lors de la récupération des types de pièces:', err)
  }
}

const selectedIdTypeInfo = computed(() => {
  return (idTypeOptions.value as RichSelectOption[]).find(
    (opt: any) => opt.value === formData.value.idType,
  )
})

const idNumberLabel = computed(() => {
  return selectedIdTypeInfo.value?.label_fr || t('identity.id_number')
})

const hasPendingUploads = computed(() => {
  return pendingUploads.value.size > 0
})

// Methods
const handleRoomTypeChange = async (value: string) => {
  await onRoomTypeChange(roomConfig.value.id, value)
}

const handleRateTypeChange = async (value: string) => {
  await onRateTypeChange(roomConfig.value.id, value)
}

const handleRoomNumberChange = async (value: string) => {
  await onRoomNumberChange(roomConfig.value)
}

const handleOccupancyChange = (type: string, event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = parseInt(target.value)
  onOccupancyChange(roomConfig.value.id, type as 'adultCount' | 'childCount', value)
}

const toggleIdentitySection = () => {
  showIdentitySection.value = !showIdentitySection.value
}

const printHtml = () => {
  try {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const doc = iframe.contentWindow?.document
    if (doc) {
      doc.open()
      doc.write(htmlContent.value)
      doc.close()
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }

    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 1000)
  } catch (err) {
    console.error('Error printing HTML:', err)
  }
}

const handleSubmit = async () => {
  submitted.value = true

  // Validation
  if (!roomConfig.value.roomType || !roomConfig.value.rateType || dateError.value) {
    return
  }

  if (hasPendingUploads.value) {
    return
  }

  try {
    await saveReservation()
    emit('save', {
      reservation: reservation.value,
      guest: formData.value
    })
    await router.push({
      name: 'ReservationDetails',
      params: { id: reservationId.value },
    })
    emit('close')
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const TypesOfContact = computed(() => [
  { label: t('contactTypes.mobile'), value: 'Mobile' },
  { label: t('contactTypes.fix'), value: 'Fix' },
  { label: t('contactTypes.email'), value: 'Email' },
  { label: t('contactTypes.facebook'), value: 'Facebook' },
  { label: t('contactTypes.whatsapp'), value: 'Whatsapp' },
])



const contactInputComponent = computed(() => {
  if (!formData.value.contactType) return null

  switch (formData.value.contactType) {
    case 'Email':
      return 'InputEmail'
    case 'Mobile':
    case 'Fix':
    case 'Whatsapp':
      return 'InputPhone'
    case 'Facebook':
      return 'Input'
    default:
      return null
  }
})

const contactInputLabel = computed(() => {
  const type = formData.value.contactType
  if (!type) return ''

  switch (type) {
    case 'Mobile':
      return t('contactTypes.mobile')
    case 'Fix':
      return t('contactTypes.fix')
    case 'Email':
      return t('Email')
    case 'Facebook':
      return t('contactTypes.facebook')
    case 'Whatsapp':
      return t('contactTypes.whatsapp')
    default:
      return type
  }
})

const contactValue = computed({
  get: () => formData.value.contactValue,
  set: (value) => {
    formData.value.contactValue = value
  }
})
watch(() => formData.value.contactType, (newType, oldType) => {
  if (newType !== oldType) {
    formData.value.contactTypeValue = ''
  }
})

// Initialize on mount
onMounted(async () => {
  await fetchIdentityTypes()
  await initialize()
  updateHtml()
})

// Ensure checkout date is never before check-in date
watch(
  () => reservation.value.checkinDate,
  (newCheckin) => {
    const ci = newCheckin ? new Date(newCheckin) : null
    const co = reservation.value.checkoutDate
      ? new Date(reservation.value.checkoutDate)
      : null
    if (ci && co && co < ci) {
      reservation.value.checkoutDate = newCheckin
    }
  }
)
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
