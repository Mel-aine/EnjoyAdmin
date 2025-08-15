 <template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <DefaultCard>
        <template v-slot:button v-if="isEditMode">
          <button class="flex items-center" @click="goBack">
            <ChevromLeftIcon />
            <span class="text-nowrap">{{ $t('Goback') }}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </button>
        </template>
        <form class="space-y-6">

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('ArrivedDate') }}
              </label>
              <div class="relative">
                <flat-pickr v-model="form.arrivalDate" :config="flatpickrConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="$t('Selectdate')" />
                <span
                  class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('DepartDate') }}
              </label>
              <div class="relative">
                <flat-pickr v-model="form.departureDate" :config="flatpickrConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="$t('Selectdate')" />
                <span
                  class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
              <p v-if="dateError" class="text-sm text-red-600">
                {{ dateError }}
              </p>
            </div>
            <div>
              <Input :lb="$t('Numberofnights')" :inputType="'Number'" :placeholder="$t('Numberofnights')" :id="'total1'"
                :forLabel="'total1'" :modelValue="numberOfNights ?? ''" :disabled="true" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('reservationType') }}
              </label>
              <select v-model="reservationCustomerType"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                <option v-for="option in reservationCustomerTypeOptions" :key="option.id" :value="option.id">
                  {{ option.label }}
                </option>
              </select>
            </div>

          </div>
          <div>
            <CustomerCard @customerSelected="onCustomerSelected" v-model="formData"
              :customerType="reservationCustomerType" />
          </div>


          <template
            v-if="(numberOfNights > 0 && serviceStore.serviceId) && ((isEditMode && fetchData && fetchData.length > 0) || !isEditMode)">
            <RoomSector :ActiveRoomTypes="ActiveRoomTypes" :availableRooms="availableRooms" @room-change="roomChange"
              :availableTakens="availableTakens" :selectedRoomType="selectedRoomType" :numberOfNights="numberOfNights"
              @update:selectedRoomType="(val) => (selectedRoomType = val)" @update:roomSelections="updateRoomSelections"
              :arrival-date="form.arrivalDate" :departure-date="form.departureDate" :service-id="serviceStore.serviceId"
              @update:totalPrice="updateTotalPrice" v-model="fetchData" />
          </template>
          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">

            <div>
              <OutputFieldCurrency :lb="$t('DefaultDeposit')" :inputType="'Number'" :placeholder="$t('DefaultDeposit')"
                :id="'defaultDeposit'" :forLabel="'defaultDeposit'" :disabled="true" :value="totalMinimalAmount"
                :min="0" :step="0.01" />
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('DepositNote') }}
              </p>
            </div>


            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-700 dark:text-gray-300">{{ $t('BasePrice') }}</span>
                  <span class="text-gray-900 dark:text-white">{{ formatCurrency(calculateTotalPrice) }}</span>
                </div>

                <div v-if="extraGuestPrice > 0 || isEditMode" class="flex justify-between items-center">
                  <span class="text-gray-700 dark:text-gray-300">
                    {{ $t('ExtraGuestFee') }} ({{ totalExtraGuests }} {{ $t('guests') }})
                  </span>
                  <span class="text-gray-900 dark:text-white">{{ formatCurrency(extraGuestPrice ?? '') }}</span>
                </div>

                <hr class="border-gray-300 dark:border-gray-600" />

                <div class="flex justify-between items-center">
                  <span class="font-medium text-lg text-gray-900 dark:text-white">
                    {{ $t('TotalPrice') }}
                  </span>
                  <span class="font-bold text-xl text-gray-900 dark:text-white">
                    {{ formatCurrency(finalTotalPrice) }}
                  </span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{
                    $t('Remaining')
                    }}</span>
                  <span class="font-bold text-red-600 dark:text-red-400">
                    {{ formatCurrency(remainingAmount) }}
                  </span>
                </div>
              </div>
            </div>
          </div>


          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ $t('special_request') }}
            </label>
            <textarea v-model="form.normalDescription" :placeholder="$t('Largetext')" rows="6"
              class="dark:bg-dark-900 h-40 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"></textarea>
          </div>
        </form>

        <ButtonComponent type="button" :disabled="!canSave || !!dateError || isLoading" @click="handleSubmit">
          <span v-if="!isLoading"> {{ isEditMode ? $t('update') : $t('SaveBooking') }}</span>
          <span v-else class="flex items-center gap-2">
            <Spinner class="w-4 h-4" />
            {{ $t('Processing') }}...
          </span>
        </ButtonComponent>
      </DefaultCard>
    </div>
    <template v-if="selectBooking">
      <PaymentModal :reservation="selectBooking" :is-open="isPaymentModalOpen" @close="closePaymentModal" @payment-recorded="closePaymentModal" />
    </template>
  </AdminLayout>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import flatPickr from 'vue-flatpickr-component'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import 'flatpickr/dist/flatpickr.css'
import Spinner from '@/components/spinner/Spinner.vue'
import RoomSector from './RoomSector.vue'
import CustomerCard from '@/components/customers/CustomerCard.vue'
import DefaultCard from '@/components/common/DefaultCard.vue'
import { formatCurrency } from '@/components/utilities/UtilitiesFunction'
import ChevromLeftIcon from '@/icons/ChevromLeftIcon.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import OutputFieldCurrency from '@/components/forms/FormElements/outputFieldCurrency.vue'
import { useBooking } from '@/composables/useBooking'
import PaymentModal from './PaymentModal.vue'

const {
  isLoading,
  isPaymentModalOpen,
  fetchData,
  isEditMode,
  ActiveRoomTypes,
  selectedRoomType,
  availableTakens,
  updateRoomSelections,
  updateTotalPrice,
  closePaymentModal,
  selectBooking,
  currentPageTitle,
  fetchServiceData,
  fetchServiceProduct,
  reservationCustomerTypeOptions,
  reservationCustomerType,
  flatpickrConfig,
  form,
  serviceStore,
  formData,
  dateError,
  numberOfNights,
  loadReservationData,
  calculateTotalPrice,
  extraGuestPrice,
  totalExtraGuests,
  totalMinimalAmount,
  availableRooms,
  handleSubmit,
  onCustomerSelected,
  goBack,
  fetchRoomType,
  finalTotalPrice,
  remainingAmount,
  roomChange,
  canSave,
} = useBooking()

onMounted(async () => {
  await fetchServiceData()
  await fetchServiceProduct()
  await fetchRoomType()
  await loadReservationData()
})
</script>
 <!-- <template>
  <div class="min-h-screen bg-gray-50">

    <div v-if="currentStep === 'booking'" class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div class="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">

          <div class="flex items-center border-b border-gray-200 px-6 py-4">
            <button @click="goBack" class="mr-4 p-2 hover:bg-gray-200 rounded">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 class="text-xl font-semibold">Nouvelle Réservation</h1>
          </div>


          <div class="p-6 space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <div class="flex">
                  <input type="date" v-model="reservation.checkinDate"
                         class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <input type="time" v-model="reservation.checkinTime"
                         class="px-3 py-2 border-l-0 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nuits</label>
                <input type="number" :value="numberOfNights" readonly
                       class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <div class="flex">
                  <input type="date" v-model="reservation.checkoutDate"
                         class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <input type="time" v-model="reservation.checkoutTime"
                         class="px-3 py-2 border-l-0 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <p v-if="dateError" class="text-sm text-red-600 mt-1">{{ dateError }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                <input type="number" v-model.number="reservation.rooms" min="1"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>


            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type de réservation</label>
                <select v-model="reservation.bookingType"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="option in bookingTypes" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Source de réservation</label>
                <select v-model="reservation.bookingSource"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="option in bookingSources" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Source business</label>
                <select v-model="reservation.businessSource"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="option in businessSources" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>


            <div class="flex flex-wrap gap-4">
              <label class="flex items-center">
                <input type="checkbox" v-model="reservation.isComplementary" class="mr-2">
                <span class="text-sm">Complémentaire</span>
              </label>
            </div>


            <div class="border-t pt-6">
              <h3 class="text-lg font-medium mb-4">Détails de la chambre</h3>
              <div class="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Type de chambre</label>
                  <select v-model="reservation.roomType"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option v-for="option in roomTypes" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Type de tarif</label>
                  <select v-model="reservation.rateType"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option v-for="option in rateTypes" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de chambre</label>
                  <input v-model="reservation.roomNumber"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Adultes</label>
                  <input type="number" v-model.number="reservation.adultCount" min="0"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Enfants</label>
                  <input type="number" v-model.number="reservation.childCount" min="0"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div class="relative">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarif (XAF)</label>
                  <div class="flex items-center border border-gray-300 rounded-md bg-gray-100 px-4 py-2">
                    <span class="flex-grow font-medium">{{ formatCurrency(reservation.rate) }}</span>
                    <button @click="rateDropdownOpen = !rateDropdownOpen" type="button"
                            class="text-gray-500 hover:text-gray-700 ml-2">
                      <svg class="w-5 h-5" :class="{'rotate-180': rateDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                  </div>

                  <div v-if="rateDropdownOpen"
                       class="absolute left-0 top-full mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg z-20">
                    <div v-for="option in rateOptions" :key="option.value"
                         @click="selectRateOption(option)"
                         class="flex items-center gap-3 px-4 py-2 hover:bg-purple-100 cursor-pointer">
                      <span class="font-medium text-gray-700">{{ option.label }}</span>
                    </div>
                    <div class="px-4 py-2 border-t">
                      <input type="number" v-model.number="reservation.rate"
                             placeholder="Tarif personnalisé"
                             class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div class="border-t pt-6">
              <h3 class="text-lg font-medium mb-4">Informations client</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input v-model="guest.name" required
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" v-model="guest.email" required
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input v-model="guest.mobile" required
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input v-model="guest.address"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <input v-model="guest.country"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input v-model="guest.city"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>


            <div class="border-t pt-6">
              <h3 class="text-lg font-medium mb-4">Autres informations</h3>
              <div class="space-y-3">
                <div>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="otherInfo.emailBookingVouchers" class="mr-2">
                    <span class="text-sm">Envoyer les bons de réservation par email</span>
                  </label>
                  <div v-if="otherInfo.emailBookingVouchers" class="ml-6 mt-2">
                    <input type="email" v-model="otherInfo.voucherEmail"
                           placeholder="Email pour les bons"
                           class="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md text-sm">
                  </div>
                </div>

                <div>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="otherInfo.sendEmailAtCheckout" class="mr-2">
                    <span class="text-sm">Envoyer un email au checkout</span>
                  </label>
                  <div v-if="otherInfo.sendEmailAtCheckout" class="ml-6 mt-2">
                    <select v-model="otherInfo.emailTemplate"
                            class="max-w-md px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option v-for="template in emailTemplates" :key="template.value" :value="template.value">
                        {{ template.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <label class="flex items-center">
                  <input type="checkbox" v-model="otherInfo.accessToGuestPortal" class="mr-2">
                  <span class="text-sm">Accès au portail client</span>
                </label>
              </div>
            </div>
          </div>


          <div class="border-t px-6 py-4 flex justify-between">
            <button @click="goBack" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Annuler
            </button>
            <div class="space-x-3">
              <button @click="handleReservation" :disabled="isLoading"
                      class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                {{ isLoading ? 'Traitement...' : 'Réserver' }}
              </button>
            </div>
          </div>
        </div>


        <div class="bg-white rounded-lg shadow p-6 h-fit">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-semibold text-lg text-gray-800">Résumé de facturation</h2>
          </div>

          <div class="flex justify-between text-sm text-gray-600 mb-4 border-b border-gray-300 pb-3">
            <div>
              <div class="font-medium">{{ reservation.checkinDate }}</div>
              <div class="text-xs">{{ reservation.checkinTime }}</div>
            </div>
            <div class="text-xl text-gray-400">→</div>
            <div class="text-right">
              <div class="font-medium">{{ reservation.checkoutDate }}</div>
              <div class="text-xs">{{ reservation.checkoutTime }}</div>
            </div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-700">
              <span>Charges chambres ({{ numberOfNights }} nuit{{ numberOfNights > 1 ? 's' : '' }})</span>
              <span>{{ formatCurrency(billing.roomCharges) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Taxes (15%)</span>
              <span>{{ formatCurrency(billing.taxes) }}</span>
            </div>
            <div class="flex justify-between font-semibold text-gray-900 border-t border-gray-300 pt-3">
              <span>Total</span>
              <span>{{ formatCurrency(billing.totalAmount) }}</span>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Facturer à</label>
              <select v-model="billing.billTo"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in billToOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <label class="flex items-center">
              <input type="checkbox" v-model="billing.taxExempt" class="mr-2">
              <span class="text-sm">Exempté de taxes</span>
            </label>

            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Mode de paiement</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="radio" v-model="billing.paymentMode" value="cash" class="mr-2">
                  <span class="text-sm">Espèces</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="billing.paymentMode" value="credit" class="mr-2">
                  <span class="text-sm">Carte de crédit</span>
                </label>
                <div v-if="billing.paymentMode === 'credit'" class="ml-6">
                  <select v-model="billing.creditType"
                          class="px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option v-for="option in creditTypes" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-else-if="currentStep === 'payment'" class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow overflow-hidden">

          <div class="bg-blue-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <button @click="goBack" class="mr-4 p-2 hover:bg-blue-700 rounded text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <h1 class="text-xl font-semibold text-white">Paiement</h1>
              </div>
              <div class="text-white text-sm">
                Réservation: {{ reservationId }}
              </div>
            </div>
          </div>


          <div class="p-6 border-b">
            <h2 class="text-lg font-semibold mb-4">Résumé de votre réservation</h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Client:</strong> {{ guest.name }}<br>
                <strong>Email:</strong> {{ guest.email }}<br>
                <strong>Téléphone:</strong> {{ guest.mobile }}
              </div>
              <div>
                <strong>Check-in:</strong> {{ reservation.checkinDate }} à {{ reservation.checkinTime }}<br>
                <strong>Check-out:</strong> {{ reservation.checkoutDate }} à {{ reservation.checkoutTime }}<br>
                <strong>Durée:</strong> {{ numberOfNights }} nuit{{ numberOfNights > 1 ? 's' : '' }}<br>
                <strong>Chambre:</strong> {{ reservation.roomType }} ({{ reservation.roomNumber }})
              </div>
            </div>
          </div>


          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Détails du paiement</h3>

            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="flex justify-between items-center mb-2">
                <span>Charges chambres:</span>
                <span>{{ formatCurrency(billing.roomCharges) }}</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span>Taxes (15%):</span>
                <span>{{ formatCurrency(billing.taxes) }}</span>
              </div>
              <div class="border-t border-gray-300 pt-2 mt-2">
                <div class="flex justify-between items-center font-bold text-lg">
                  <span>Total à payer:</span>
                  <span>{{ formatCurrency(billing.totalAmount) }}</span>
                </div>
              </div>
            </div>


            <div v-if="billing.paymentMode === 'credit'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                <input type="text" placeholder="1234 5678 9012 3456" maxlength="19"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                  <input type="text" placeholder="MM/YY" maxlength="5"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Code CVV</label>
                  <input type="text" placeholder="123" maxlength="4"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
                <input type="text" :value="guest.name"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span class="text-sm text-yellow-800">
                  Le paiement en espèces sera effectué à la réception lors de votre arrivée.
                </span>
              </div>
            </div>


            <div v-if="paymentStatus === 'processing'" class="mt-6 text-center">
              <div class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-blue-600">Traitement du paiement en cours...</span>
              </div>
            </div>


            <div class="flex justify-between items-center mt-8 pt-6 border-t">
              <button @click="goBack" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Retour
              </button>
              <button @click="handlePayment" :disabled="isLoading || paymentStatus === 'processing'"
                      class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                {{ paymentStatus === 'processing' ? 'Traitement...' : 'Confirmer le paiement' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="currentStep === 'confirmation'" class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          Header de succès
          <div class="bg-green-600 px-6 py-4">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <h1 class="text-xl font-semibold text-white">Réservation Confirmée</h1>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Merci {{ guest.name }} !
              </h2>
              <p class="text-gray-600">
                Votre réservation a été confirmée avec succès.
              </p>
            </div>

            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="text-center">
                <div class="text-lg font-semibold text-green-800 mb-1">
                  Numéro de réservation
                </div>
                <div class="text-2xl font-bold text-green-900">
                  {{ reservationId }}
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="font-semibold text-lg mb-4">Détails de votre séjour</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="mb-2">
                    <strong>Check-out:</strong><br>
                    {{ new Date(reservation.checkoutDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}<br>
                    à {{ reservation.checkoutTime }}
                  </div>
                  <div>
                    <strong>Durée:</strong> {{ numberOfNights }} nuit{{ numberOfNights > 1 ? 's' : '' }}
                  </div>
                </div>
                <div>
                  <div class="mb-2">
                    <strong>Chambre:</strong> {{ reservation.roomType }}<br>
                    <strong>Numéro:</strong> {{ reservation.roomNumber }}
                  </div>
                  <div class="mb-2">
                    <strong>Clients:</strong> {{ reservation.adultCount }} adulte{{ reservation.adultCount > 1 ? 's' : '' }}
                    {{ reservation.childCount > 0 ? ', ' + reservation.childCount + ' enfant' + (reservation.childCount > 1 ? 's' : '') : '' }}
                  </div>
                  <div>
                    <strong>Total payé:</strong><br>
                    <span class="text-lg font-semibold text-green-600">{{ formatCurrency(billing.totalAmount) }}</span>
                  </div>
                </div>
              </div>
            </div>

          
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-semibold text-blue-800 mb-2">Informations importantes</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• Présentez-vous à la réception avec une pièce d'identité valide</li>
                <li>• L'enregistrement se fait à partir de {{ reservation.checkinTime }}</li>
                <li>• La libération de la chambre doit se faire avant {{ reservation.checkoutTime }}</li>
                <li>• Un email de confirmation a été envoyé à {{ guest.email }}</li>
              </ul>
            </div>

           
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button @click="window.print()"
                      class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Imprimer
              </button>
              <button @click="goBack"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Nouvelle réservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Traitement en cours...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

// Types/Interfaces
interface Reservation {
  checkinDate: string
  checkinTime: string
  checkoutDate: string
  checkoutTime: string
  rooms: number
  bookingType: string
  bookingSource: string
  businessSource: string
  isComplementary: boolean
  roomType: string
  rateType: string
  roomNumber: string
  adultCount: number
  childCount: number
  rate: number
}

interface Guest {
  title: string
  name: string
  mobile: string
  email: string
  address: string
  country: string
  state: string
  city: string
  zipcode: string
}

interface Billing {
  roomCharges: number
  taxes: number
  totalAmount: number
  billTo: string
  taxExempt: boolean
  paymentMode: string
  creditType: string
}

interface OtherInfo {
  emailBookingVouchers: boolean
  voucherEmail: string
  sendEmailAtCheckout: boolean
  emailTemplate: string
  accessToGuestPortal: boolean
  successRateOnRegistrationCard: boolean
}

interface Option {
  label: string
  value: string
}

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed'
type Step = 'booking' | 'payment' | 'confirmation'

// Factory functions
const createReservation = (): Reservation => ({
  checkinDate: new Date().toISOString().split('T')[0],
  checkinTime: '15:00',
  checkoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  checkoutTime: '11:00',
  rooms: 1,
  bookingType: 'confirm',
  bookingSource: 'direct',
  businessSource: 'leisure',
  isComplementary: false,
  roomType: 'deluxe',
  rateType: 'standard',
  roomNumber: '101',
  adultCount: 2,
  childCount: 0,
  rate: 150000
})

const createGuest = (): Guest => ({
  title: 'Mr',
  name: 'Jean Dupont',
  mobile: '+237 6 78 90 12 34',
  email: 'jean.dupont@email.com',
  address: '123 Rue de la Paix',
  country: 'Cameroon',
  state: 'Centre',
  city: 'Yaoundé',
  zipcode: '1234'
})

const createBilling = (): Billing => ({
  roomCharges: 0,
  taxes: 0,
  totalAmount: 0,
  billTo: 'guest',
  taxExempt: false,
  paymentMode: 'cash',
  creditType: 'visa'
})

const createOtherInfo = (): OtherInfo => ({
  emailBookingVouchers: true,
  voucherEmail: 'jean.dupont@email.com',
  sendEmailAtCheckout: false,
  emailTemplate: 'confirmation',
  accessToGuestPortal: true,
  successRateOnRegistrationCard: false
})

// États réactifs
const currentStep = ref<Step>('booking')
const isLoading = ref(false)
const rateDropdownOpen = ref(false)
const dateError = ref('')
const paymentStatus = ref<PaymentStatus>('pending')
const reservationId = ref<string | null>(null)

// Données
const reservation = ref<Reservation>(createReservation())
const guest = ref<Guest>(createGuest())
const billing = ref<Billing>(createBilling())
const otherInfo = ref<OtherInfo>(createOtherInfo())

// Options statiques
const bookingTypes: Option[] = [
  { label: 'Confirmé', value: 'confirm' },
  { label: 'En attente', value: 'pending' },
  { label: 'Annulé', value: 'cancelled' }
]

const bookingSources: Option[] = [
  { label: 'Direct', value: 'direct' },
  { label: 'En ligne', value: 'online' },
  { label: 'Téléphone', value: 'phone' },
  { label: 'Walk-in', value: 'walk-in' }
]

const businessSources: Option[] = [
  { label: 'Entreprise', value: 'corporate' },
  { label: 'Loisir', value: 'leisure' },
  { label: 'Groupe', value: 'group' }
]

const roomTypes: Option[] = [
  { label: 'Standard', value: 'standard' },
  { label: 'Deluxe', value: 'deluxe' },
  { label: 'Suite', value: 'suite' },
  { label: 'Premium', value: 'premium' }
]

const rateTypes: Option[] = [
  { label: 'Standard', value: 'standard' },
  { label: 'Promotion', value: 'promo' },
  { label: 'Groupe', value: 'group' },
  { label: 'Entreprise', value: 'corporate' }
]

const creditTypes: Option[] = [
  { label: 'Visa', value: 'visa' },
  { label: 'MasterCard', value: 'mastercard' },
  { label: 'American Express', value: 'amex' }
]

const billToOptions: Option[] = [
  { label: 'Client', value: 'guest' },
  { label: 'Entreprise', value: 'company' },
  { label: 'Agent', value: 'agent' }
]

const emailTemplates: Option[] = [
  { label: 'Email de confirmation', value: 'confirmation' },
  { label: 'Email de bienvenue', value: 'welcome' },
  { label: 'Email de remerciement', value: 'thank-you' }
]

const rateOptions: Option[] = [
  { value: 'inclusion', label: 'Inclusions' },
  { value: 'remarks', label: 'Remarques' },
  { value: 'create_task', label: 'Créer tâche' },
  { value: 'pickup_dropoff', label: 'Transport' }
]

// Computed
const numberOfNights = computed(() => {
  const checkin = new Date(reservation.value.checkinDate)
  const checkout = new Date(reservation.value.checkoutDate)
  const diffTime = checkout.getTime() - checkin.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return diffDays > 0 ? Math.ceil(diffDays) : 0
})

// Watchers
watch(
  [() => reservation.value.checkinDate, () => reservation.value.checkoutDate],
  () => {
    const arrival = new Date(reservation.value.checkinDate)
    const departure = new Date(reservation.value.checkoutDate)

    if (departure <= arrival) {
      dateError.value = 'La date de départ doit être après la date d\'arrivée'
    } else {
      dateError.value = ''
    }
  }
)

watch(
  [() => reservation.value.rate, numberOfNights, () => reservation.value.rooms],
  () => {
    updateBilling()
  }
)

// Methods
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(value)
}

const updateBilling = (): void => {
  const roomCharges = reservation.value.rate * numberOfNights.value * reservation.value.rooms
  const taxes = roomCharges * 0.15 // 15% de taxe

  billing.value.roomCharges = roomCharges
  billing.value.taxes = taxes
  billing.value.totalAmount = roomCharges + taxes
}

const handleReservation = async (): Promise<void> => {
  if (dateError.value) {
    alert('Veuillez corriger les erreurs de dates')
    return
  }

  if (!guest.value.name || !guest.value.email || !guest.value.mobile) {
    alert('Veuillez remplir les informations client obligatoires')
    return
  }

  isLoading.value = true

  // Simulation d'appel API
  await new Promise(resolve => setTimeout(resolve, 2000))

  const newReservationId = 'RES' + Date.now()
  reservationId.value = newReservationId
  currentStep.value = 'payment'
  isLoading.value = false
}

const handlePayment = async (): Promise<void> => {
  paymentStatus.value = 'processing'
  isLoading.value = true

  // Simulation de traitement du paiement
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Simulation de succès (90% de chance)
  const success = Math.random() > 0.1

  if (success) {
    paymentStatus.value = 'success'
    currentStep.value = 'confirmation'
  } else {
    paymentStatus.value = 'failed'
    alert('Échec du paiement. Veuillez réessayer.')
  }

  isLoading.value = false
}

const goBack = (): void => {
  if (currentStep.value === 'payment') {
    currentStep.value = 'booking'
    paymentStatus.value = 'pending'
  } else if (currentStep.value === 'confirmation') {
    // Reset pour une nouvelle réservation
    reservation.value = createReservation()
    guest.value = createGuest()
    billing.value = createBilling()
    otherInfo.value = createOtherInfo()
    currentStep.value = 'booking'
    reservationId.value = null
    paymentStatus.value = 'pending'
  }
}

const selectRateOption = (option: Option): void => {
  console.log('Option sélectionnée:', option)
  rateDropdownOpen.value = false
}

// Initialize
onMounted(() => {
  updateBilling()
})
</script> -->
