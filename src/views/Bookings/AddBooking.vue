<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">

      <DefaultCard>
          <template v-slot:button v-if="isEditMode">
                    <button class="flex items-center" @click="goBack">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-purple-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>&nbsp;&nbsp;
                        <span class="text-nowrap">{{ $t('Goback') }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </button>
          </template>
        <form class="space-y-6">
          <!-- Personal information section -->

          <div>
            <CustomerCard @customerSelected="onCustomerSelected" v-model="formData" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('ArrivedDate') }}
              </label>
              <div class="relative">
                <flat-pickr
                  v-model="form.arrivalDate"
                  :config="flatpickrConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="$t('Selectdate')"
                />
                <span
                  class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
                >
                  <svg
                    class="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                      fill=""
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('DepartDate') }}
              </label>
              <div class="relative">
                <flat-pickr
                  v-model="form.departureDate"
                  :config="flatpickrConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="$t('Selectdate')"
                />
                <span
                  class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
                >
                  <svg
                    class="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                      fill=""
                    />
                  </svg>
                </span>
              </div>
              <p v-if="dateError" class="text-sm text-red-600">
                {{ dateError }}
              </p>
            </div>
            <div>
              <Input
                :lb="$t('Numberofnights')"
                :inputType="'Number'"
                :placeholder="$t('Numberofnights')"
                :id="'total1'"
                :forLabel="'total1'"
                :modelValue="numberOfNights ?? ''"
                :disabled="true"
              />
            </div>
          </div>



          <!-- Room Selection Component -->
          <RoomSector
            :ActiveRoomTypes="ActiveRoomTypes"
            :availableRooms="availableRooms"
             :selectedRoomType="selectedRoomType"
              @update:selectedRoomType="val => selectedRoomType = val"
            @update:roomSelections="updateRoomSelections"
            @update:totalPrice="updateTotalPrice"
            v-model="fetchData"
          />


           <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Input
            :lb="$t('DefaultGuest')"
            :inputType="'Number'"
            :placeholder="$t('DefaultGuest')"
            :id="'defaultGuest'"
            :forLabel="'defaultGuest'"
            :disabled="true"
            v-model="form.default_guest"
            :min="1"
            :required="true"
          />
        </div>

        <div>
          <Input
            :lb="$t('ExtraGuest')"
            :inputType="'Number'"
            :placeholder="$t('ExtraGuest')"
            :id="'extraGuest'"
            :forLabel="'extraGuest'"
            v-model="form.extra_guest"
            :min="0"
          />
        </div>
      </div>

      <!-- Total Guests Display -->
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex justify-between items-center">
          <span class="font-medium text-blue-900 dark:text-blue-100">
            {{ $t('TotalGuests') }}
          </span>
          <span class="font-bold text-xl text-blue-900 dark:text-blue-100">
            {{ totalGuests }}
          </span>
        </div>
      </div>

          <div
            class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <!-- <div class="flex justify-between items-center">
              <span class="font-medium text-lg text-gray-900 dark:text-white">{{
                $t('TotalPrice')
              }}</span>
              <span class="font-bold text-xl text-gray-900 dark:text-white"
                >{{ calculateTotalPrice }} FCFA</span
              >
            </div> -->

            <div>
        <Input
          :lb="$t('DefaultDeposit')"
          :inputType="'Number'"
          :placeholder="$t('DefaultDeposit')"
          :id="'defaultDeposit'"
          :forLabel="'defaultDeposit'"
          :disabled="true"
          v-model="form.default_deposit"
          :min="0"
          :step="0.01"
        />
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ $t('DepositNote') }}
        </p>
      </div>

      <!-- Price Summary -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">{{ $t('BasePrice') }}</span>
            <span class="text-gray-900 dark:text-white">{{ calculateTotalPrice }} FCFA</span>
          </div>

          <div v-if="form.extra_guest > 0" class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">
              {{ $t('ExtraGuestFee') }} ({{ form.extra_guest }} {{ $t('guests') }})
            </span>
            <span class="text-gray-900 dark:text-white">{{ extraGuestPrice }} FCFA</span>
          </div>

          <hr class="border-gray-300 dark:border-gray-600">

          <div class="flex justify-between items-center">
            <span class="font-medium text-lg text-gray-900 dark:text-white">
              {{ $t('TotalPrice') }}
            </span>
            <span class="font-bold text-xl text-gray-900 dark:text-white">
              {{ finalTotalPrice }} FCFA
            </span>
          </div>

          <div v-if="form.default_deposit > 0" class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">{{ $t('Deposit') }}</span>
            <span class="text-green-600 dark:text-green-400 font-medium">
              {{ form.default_deposit }} FCFA
            </span>
          </div>

          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ $t('Remaining') }}</span>
            <span class="font-bold text-red-600 dark:text-red-400">
              {{ remainingAmount }} FCFA
            </span>
          </div>
        </div>
      </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ $t('special_request') }}
            </label>
            <textarea
              v-model="form.normalDescription"
              :placeholder="$t('Largetext')"
              rows="6"
              class="dark:bg-dark-900 h-40 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
            ></textarea>
          </div>
        </form>

        <ButtonComponent type="button" :disabled="!!dateError || isLoading" @click="handleSubmit">
          <span v-if="!isLoading"> {{ isEditMode ? $t('update') : $t('SaveBooking') }}</span>
          <span v-else class="flex items-center gap-2">
            <Spinner class="w-4 h-4" />
            {{ $t('Processing') }}...
          </span>
        </ButtonComponent>

      </DefaultCard>
    </div>
  </AdminLayout>

  <Modal v-if="isPaymentModalOpen" @close="isPaymentModalOpen = false">
    <template #body>
      <div
        class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <!-- Close button -->
        <button
          @click="isPaymentModalOpen = false"
          class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
        >
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.04 16.54a.9.9 0 0 0 1.41 1.42L12 13.41l4.54 4.55a.9.9 0 1 0 1.41-1.42L13.41 12l4.55-4.54a.9.9 0 0 0-1.42-1.41L12 10.59 7.46 6.05a.9.9 0 0 0-1.41 1.42L10.59 12l-4.55 4.54Z"
              fill=""
            />
          </svg>
        </button>

        <!-- Title -->
        <div class="mb-6 text-center">
          <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ $t('ConfirmBookingPayment') }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('Reviewthereservationdetailsbeforeconfirming.') }}
          </p>
        </div>
        <form class="flex flex-col">
          <div class="custom-scrollbar h-[400px] overflow-y-auto p-2">
            <div class="space-y-8">
              <div class="border rounded-md p-4 text-sm text-gray-700 dark:text-gray-300">
                <div class="space-y-2">
                  <div>
                    <strong>{{ $t('Customer') }}:</strong> {{ reservationSummary.clientName }}
                  </div>
                  <div>
                    <strong>{{ $t('Total') }}:</strong> {{ reservationSummary.total }} FCFA
                  </div>
                </div>
              </div>

              <!-- <div class="mt-6 border rounded-md p-4">
              <Select :lb="'Payment Method'" :options="Payements[0].paymentMethods" v-model="selectedPaymentMethod"/>

            </div> -->
              <Select
                :lb="$t('PaymentMethod')"
                :options="Payements[0].paymentMethods"
                v-model="selectedPaymentMethod"
              />
            </div>
          </div>
        </form>

        <!-- Buttons -->
        <div class="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
          <!-- Cancel -->
          <button
            type="button"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] sm:w-auto"
            @click="isPaymentModalOpen = false"
          >
            {{ $t('Cancel') }}
          </button>

          <!-- Confirm -->
          <ButtonComponent
            type="button"
            :disabled="isLoading || !selectedPaymentMethod"
            @click="savePayment"
          >
            <span v-if="!isLoading">{{ $t('ConfirmPay') }}</span>
            <span v-else class="flex items-center gap-2">
              <Spinner class="w-4 h-4" />
              {{ $t('Processing') }}...
            </span>
          </ButtonComponent>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
// import FileInput from "@/components/forms/FormElements/FileInput.vue";
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import flatPickr from 'vue-flatpickr-component'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import {
  getServiceProduct,
  createReservation,
  getService,
  createPayment,
  getReservationById,
  getUserId,
  putReservation,
  getReservationServiceProduct,
  getTypeProductByServiceId
} from '@/services/api'
import type { ProductType } from '@/types/option'
import 'flatpickr/dist/flatpickr.css'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
import Modal from '@/components/profile/Modal.vue'
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/composables/user'
import RoomSector from './RoomSector.vue'
import { useBookingStore } from '@/composables/booking'
import { useRouter } from 'vue-router'
import CustomerCard from '@/components/customers/CustomerCard.vue'
import DefaultCard from '@/components/common/DefaultCard.vue'

const store = useBookingStore()
const ServiceProduct = ref<ProductType[]>([])
const ProductList = ref<ProductType[]>([])
const reservations = ref({})
const route = useRoute()
const isLoading = ref(false)
const { t } = useI18n()
const isPaymentModalOpen = ref(false)
const toast = useToast()
const fetchData = ref<any>([])
const adults = ref(1)
const children = ref(0)
const totalPersons = computed(() => adults.value + children.value)
const serviceStore = useServiceStore()
const router = useRouter()
defineProps<{ id: string }>()
const isEditMode = ref(false)
const selectedProducts = ref([])
const totalPrice = ref(0)
const ActiveRoomTypes = ref<any[]>([])
const selectedRoomType = ref<any | null>(null)
const extraGuestPrice = ref<number | null>(null)




const updateRoomSelections = (newSelections: any) => {
  selectedProducts.value = newSelections
  console.log('Updated room selections:', selectedProducts.value)
}

const updateTotalPrice = (newPrice: any) => {
  totalPrice.value = newPrice
  console.log('Updated total price:', totalPrice.value)
}



const Payements = ref<any[]>([])
const reservationSummary = ref({
  clientName: '',
  room: '',
  type: '',
  total: 0,
})



const currentPageTitle = computed(() => t('Booking'))

onMounted(() => {
  console.log('availableRooms:', availableRooms.value)
  fetchServiceData()
})

const fetchServiceData = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getService(serviceId)

    const service = response.data
    console.log('Service brut :', service)
    const parsedMethods: string[] = Array.isArray(service.paymentMethods)
      ? service.paymentMethods
      : JSON.parse(service.paymentMethods || '[]')

    const paymentMethods = parsedMethods.map((method) => ({
      label: method,
      value: method,
    }))

    Payements.value = [
      {
        ...service,
        paymentMethods,
      },
    ]

    console.log('Service formaté avec méthodes de paiement :', Payements.value)
  } catch (error) {
    console.error('Erreur lors de la récupération du service :', error)
  }
}

const selectedRoomPrice = ref<number | null>(null)
const handleRoomSelection = () => {
  const selectedProduct = ServiceProduct.value.find(
    (product: any) => product.productName === form.value.roomType,
  )
  if (selectedProduct) {
    selectedRoomPrice.value = selectedProduct.price
    console.log('Prix de la chambre sélectionnée:', selectedRoomPrice.value)
  }
}

const fetchServiceProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getServiceProduct(serviceId)
    const serviceProducts = response.data
    ProductList.value = response.data
    console.log('hhh', response)
    ServiceProduct.value = serviceProducts
      .filter((product: any) => product.status == 'available')
      .map((products: any) => {
        return {
          ...products,
          value: products.productName,
          label: products.productName,
          price: products.price,
        }
      })

    console.log('Service Products avec options (depuis backend):', ServiceProduct.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
  }
}

fetchServiceProduct()

const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}

watch(totalPersons, (newVal: any) => {
  form.value.totalPerson = newVal
})
watch(selectedRoomPrice, (newPrice: any) => {
  console.log('newPrice', newPrice)
})

watch(reservations.value, (newReservation: any) => {
  console.log('✅ reservations', newReservation)
})
onMounted(async() => {
  await fetchServiceData()
  await fetchRoomType()
})

interface ReservationForm {
  roomType: string | null
  package: string
  arrivalDate: string
  departureDate: string
  normalDescription: string
  totalPerson: number | null
  numberOfNights: number | null
  totalPrice: number | null
  payment: string
  default_guest:number
  default_deposit : number
  extra_guest: number
}

const selectedPaymentMethod = ref('')


const form = ref<ReservationForm>({
  roomType: null,
  package: '',
  arrivalDate: '',
  departureDate: '',
  normalDescription: '',
  totalPerson: totalPersons.value,
  totalPrice: null,
  numberOfNights: totalPersons.value,
  payment: 'pending',
  default_guest:0,
  default_deposit : 0,
  extra_guest: 0
})
const reservationId = ref<number | null>(null)

const userId = ref<number | null>(null)
const authStore = useAuthStore()


const formData = ref<any>({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
})

const saveReservation = async () => {
  isLoading.value = true
  try {
    const reservationPayload = {

      first_name: selectedCustomer.value.firstName,
      last_name: selectedCustomer.value.lastName,
      email: selectedCustomer.value.email,
      phone_number: selectedCustomer.value.phoneNumber,
      service_id: serviceStore.serviceId,
      reservation_type: 'Hotels & Stays',
      total_amount: calculateTotalPrice.value,
      guest_count: form.value.totalPerson,
      arrived_date: form.value.arrivalDate,
      depart_date: form.value.departureDate,
      comment: form.value.normalDescription,
      role_id: authStore.roleId,
      // payment_status: 'pending',
      products: selectedProducts.value.map((product: any) => ({
        service_product_id: product.roomType,
        start_date: form.value.arrivalDate,
        end_date: form.value.departureDate,
      })),
    }

    console.log('✅ reservationPayload', reservationPayload)

    const response = await createReservation(reservationPayload)
    reservationSummary.value = {
      clientName: `${selectedCustomer.value.firstName} ${selectedCustomer.value.lastName}`,
      room: form.value.roomType ?? '',
      type: form.value.package ?? 'Hotels & Stays',
      total: Number(calculateTotalPrice.value ?? 0),
    }
    reservationId.value = response.data.reservation.id
    userId.value = response.data.reservation.userId

    console.log('User ID:', userId.value)
    console.log('Reservation ID:', reservationId.value)

    form.value = {
      roomType: null,
      package: '',
      arrivalDate: '',
      departureDate: '',
      normalDescription: '',
      totalPerson: totalPersons.value,
      totalPrice: null,
      numberOfNights: totalPersons.value,
      payment: '',
    }
    toast.success(t('toast.reservationCreated'))
    isPaymentModalOpen.value = true
    reservations.value = response.data
    console.log('✅ Réservation créée avec succès !', response.data)
    console.log('✅ Réservation créée avec succès !', reservations.value)
  } catch (error: any) {
    console.error('❌ Error while saving:', error.response?.data || error.message)
  } finally {
    isLoading.value = false
  }
}

const savePayment = async () => {
  isLoading.value = true
  const paymentStatus = selectedPaymentMethod.value === 'Cash' ? 'pending' : 'paid'
  try {
    const payload = {
      user_id: userId.value,
      reservation_id: reservationId.value,
      amount_paid: reservationSummary.value.total,
      payment_method: selectedPaymentMethod.value,
      payment_date: new Date().toISOString(),
      transaction_id: '#TRAN-001',
      status: paymentStatus,
      created_by: userId.value,
      last_modified_by: userId.value,
      service_id: serviceStore.serviceId,
    }

    console.log('payment', payload)
    const response = await createPayment(payload)
    console.log('payment', response.data)

    if (response.status === 201) {
      toast.success(t('toast.paymentSucess'))
      isPaymentModalOpen.value = false
      router.push({ name: 'ViewInvoice', params: { id: response.data.id } })
    } else {
      toast.error(t('toast.paymentError'))
    }
  } catch (error) {
    console.error(error)
    toast.error('An error occurred during payment.')
  } finally {
    isLoading.value = false
  }
}

const dateError = ref<string | null>(null)

watch([() => form.value.arrivalDate, () => form.value.departureDate], () => {
  const arrivalDate = form.value.arrivalDate
  const departureDate = form.value.departureDate

  if (!arrivalDate || !departureDate) {
    dateError.value = null
    return
  }

  const arrival = new Date(arrivalDate)
  const departure = new Date(departureDate)

  if (departure <= arrival) {
    dateError.value = 'The departure date must be after the arrival date.'
  } else {
    dateError.value = null
  }
})

const numberOfNights = computed(() => {
  const { arrivalDate, departureDate } = form.value

  if (!arrivalDate || !departureDate) return null

  const arrival = new Date(arrivalDate)
  const departure = new Date(departureDate)

  const diffTime = departure.getTime() - arrival.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return diffDays > 0 ? diffDays : null
})

const selectedServiceProduct = ref<any>({})

onMounted(async () => {
  const rawId = route.params.id

  if (rawId) {
    isEditMode.value = true
    reservationId.value = Number(rawId)
    const response = await getReservationById(reservationId.value)
    const response1 = await getUserId(response.data.userId)
    const response2 = await getReservationServiceProduct(reservationId.value)
    console.log('response.data2', response2.data)
    const matchingService = response2.data.filter((p: any) => p.reservationId === reservationId.value)
    console.log('matchingServic', matchingService)
    console.log('reservationId.value', reservationId.value)
    // const matchingServiceId = matchingService.serviceProductId
    const matchingServiceId = matchingService.map((i:any)=>i.serviceProductId)
    console.log('matchingServiceId', matchingServiceId)

   const matchedServiceProduct = ProductList.value.filter((sp: any) =>
        matchingServiceId.includes(sp.id)
      );

    selectedServiceProduct.value = matchedServiceProduct
    console.log('matchedServiceProduct', selectedServiceProduct.value)


   fetchData.value = matchedServiceProduct.map((product: any) => ({
      roomType: Number(product.id) || 0,
      roomTypeSelect: Number(product.productTypeId) || 0,
      arrivalDate: response.data.arrivedDate || '',
      departureDate: response.data.departDate || '',
      numberOfNights: numberOfNights,
      adults: response.data.totalPerson || 1,
      children: 0,
      price: product.price || 0,
      dateError: '',
      showOccupancyDropdown: false,
    }));


    console.log('match', fetchData.value)

    formData.value = {
      firstName: response1.data.firstName,
      lastName: response1.data.lastName,
      phoneNumber: response1.data.phoneNumber,
      email: response1.data.email,
    }
    console.log('formData.value', formData.value)

    form.value = {
      roomType: response.data.reservationProduct,
      package: response.data.reservationType,
      arrivalDate: response.data.arrivedDate,
      departureDate: response.data.departDate,
      normalDescription: response.data.comment,
      totalPerson: response.data.totalPerson,
      totalPrice: response.data.totalPrice,
      numberOfNights: null,
      payment: response.data.payment,
    }
  }
})

const calculateTotalPrice = computed(() => {
  if (fetchData.value.length > 0) {
    return fetchData.value.reduce((total:number, room:any) => {
      const nights = room.numberOfNights ?? 1
      return total + (room.price || 0) * nights
    }, 0)
  }

  const nights = numberOfNights.value ?? 0
  return (totalPrice.value || 0) * nights
})

watch(
  fetchData,
  (newVal) => {
    console.log('Données mises à jour depuis RoomSector :', newVal)
  },
  { deep: true },
)

const availableRooms = computed(() => {
   const rooms = ServiceProduct.value

  console.log('Rooms initiales (store.selectedRoom ou ProductList.value) :', rooms)

  const existingRoomIds = rooms.map((r) => r.id)
  console.log('IDs des chambres existantes :', existingRoomIds)
  console.log('fetchData.value :', fetchData.value)
  console.log('ProductList.value :', ProductList.value)

  const missingRooms = fetchData.value
    .filter((r:any) => !existingRoomIds.includes(r.roomType))
    .map((r:any) => {
      const roomFromAll = ProductList.value.find((room:any) => room.id === r.roomType)
      console.log(
        `Recherche chambre pour roomType ${r.roomType} dans ProductList.value :`,
        roomFromAll,
      )

      return {
        id: roomFromAll?.id || r.roomType,
        productName: roomFromAll ? roomFromAll.productName : r.roomType,
        price: r.price,
        label: roomFromAll ? `${roomFromAll.productName} (réservée)` : `${r.roomType} (réservée)`,
      }
    })

  console.log('Chambres manquantes ajoutées :', missingRooms)

  const finalRooms = [...rooms, ...missingRooms]
  console.log('Liste finale des chambres disponibles :', finalRooms)

  return finalRooms.map((room) => ({
    ...room,
    label: room.label || room.productName,
    roomType : room.productTypeId,
    roomPrice: room.price,
  }))
})


const updateReservation = async () => {
  try {
    if (!reservationId.value) throw new Error('Aucune réservation sélectionnée')

    const payloadUpdate = {
      first_name: selectedCustomer.value.firstName,
      last_name: selectedCustomer.value.lastName,
      email: selectedCustomer.value.email,
      phone_number: selectedCustomer.value.phoneNumber,

      service_id: serviceStore.serviceId,
      reservation_type: form.value.package,
      arrived_date: form.value.arrivalDate,
      depart_date: form.value.departureDate,
      comment: form.value.normalDescription,
      last_modified_by: authStore.UserId,
      payment_status: form.value.payment,

      products: selectedProducts.value.map((product: any) => ({
        service_product_id: product.roomType,
        start_date: form.value.arrivalDate,
        end_date: form.value.departureDate,
      })),
    }
    console.log('payloadUpdate', payloadUpdate)

    const response = await putReservation(reservationId.value, payloadUpdate)

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Error while updating')
    }

    toast.success(t('toast.updateReservation'))
    console.log('✅ Update successful:', response.data)
  } catch (error: any) {
    console.error('❌ Erreur:', error.message || error)
    toast.error(t('toast.Error'))
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (isEditMode.value) {
      await updateReservation()
    } else {
      await saveReservation()
    }
  } finally {
    isLoading.value = false
  }
}

// const closeUpdate = () => {
//   isEditMode.value = false
//   formData.value = {
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     email: '',
//   }
//   form.value = {
//     roomType: null,
//     package: '',
//     arrivalDate: '',
//     departureDate: '',
//     normalDescription: '',
//     totalPerson: totalPersons.value,
//     totalPrice: null,
//     numberOfNights: totalPersons.value,
//     payment: ' ',
//   }
//   router.push('/add_booking')
// }

const selectedCustomer = ref<any>(null)
const manualInput = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
})

const onCustomerSelected = (customer: any) => {
  if (customer) {
    selectedCustomer.value = customer
    manualInput.value = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
    }
  } else {
    selectedCustomer.value = null
    manualInput.value = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
    }
  }
}

const goBack = () => {
  isEditMode.value = false
  formData.value = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  }
  form.value = {
    roomType: null,
    package: '',
    arrivalDate: '',
    departureDate: '',
    normalDescription: '',
    totalPerson: totalPersons.value,
    totalPrice: null,
    numberOfNights: totalPersons.value,
    payment: ' ',
  }
   window.history.back();
}
const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getTypeProductByServiceId(serviceId)

    ActiveRoomTypes.value = response.data
  .filter((type: any) => type.status === 'active')
  .map((item: any) => ({
    ...item,
    value: item.id,
    label: item.name,
  }));
  console.log("ActiveRoomTypes.value",ActiveRoomTypes.value)

  } catch (error) {
    console.error('Erreur lors de la récupération des roomtypes:', error)
  }
}

watch(selectedRoomType, (newType) => {
  console.log('[Parent] selectedRoomType changed:', newType)
  // Met à jour le form par exemple
  form.value.default_guest = Number(newType?.defaultGuest) || 1
  extraGuestPrice.value = newType?.extraGuestPrice || 0
  form.value.default_deposit = newType?.defaultDeposit || 0
})




const totalGuests = computed(() => {
  return Number(form.value.default_guest) + Number(form.value.extra_guest)
})

   const finalTotalPrice = computed(() => {
      return Number(calculateTotalPrice.value) +  Number(extraGuestPrice.value)
    })

    const remainingAmount = computed(() => {
      return Math.max(0, finalTotalPrice.value - (form.value.default_deposit || 0))
    })

</script>
