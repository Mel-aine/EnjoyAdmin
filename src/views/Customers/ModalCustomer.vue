<template>
  <div>
  <Modal v-if="isOpen" @close="emit('close')">
    <template #body>
      <div
        class="no-scrollbar h-11/12 relative w-full max-w-7xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <button
          @click="emit('close')"
          class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
        >
          <svg
            class="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
              fill=""
            />
          </svg>
        </button>

        <div class="px-2 pr-14">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
           {{ isEditMode ? $t('EditCustomer') : $t('add_new_customer') }}
          </h4>
        </div>

        <form class="flex flex-col" @submit.prevent="handleSubmit">
          <div class="custom-scrollbar h-[600px] overflow-y-auto p-2">
            <!-- Informations personnelles -->
            <div class="mb-8">
              <h5
                class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                {{ $t('personalInformation') }}
              </h5>
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Select
                    :is-required="true"
                    :lb="$t('gender')"
                    v-model="customerForm.gender"
                    :options="genders"
                  />
                </div>

                <div>
                  <Input
                    :lb="$t('FirstName')"
                    :id="'name'"
                    :forLabel="'name'"
                    v-model="customerForm.first_name"
                    :is-required="true"
                  />
                </div>

                <div>
                  <Input
                    :lb="$t('LastName')"
                    :id="'last'"
                    :forLabel="'last'"
                    v-model="customerForm.last_name"
                    :is-required="true"
                  />
                </div>

                <div>
                  <InputDatePicker
                    v-model="customerForm.date_of_birth"
                    :is-required="true"
                    :title="$t('dateOfBirth')"
                    :placeholder="$t('dateOfBirth')"
                  />
                </div>

                <div>
                   <Input
                    :is-required="true"
                    :lb="$t('country')"
                    :id="'country'"
                    :forLabel="'country'"
                    v-model="customerForm.country"
                  />
                </div>

                <div>
                  <Input :lb="$t('nationalIdNumber')" :id="'nationalIdNumber'"
                    :forLabel="'nationalIdNumber'" :inputType="'text'" :is-required="true"
                    v-model="customerForm.national_id_number"
                  />
                </div>

              </div>
            </div>

            <!-- Contact -->
            <div class="mb-8">
              <h5
                class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                {{ $t('contact_info') }}
              </h5>
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <InputEmail
                    :is-required="true"
                    v-model="customerForm.email"
                    placeholder="info@gmail.com"
                    :title="$t('Email')"
                  />
                </div>

                <div>
                  <InputPhone
                    :is-required="true"
                    v-model="customerForm.phone_number"
                    :id="'phone'"
                    :title="$t('Phone')"
                  />
                </div>

                <div class="lg:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                   {{ $t('Address') }}
                  </label>
                  <textarea
                    v-model="customerForm.address"
                    rows="1"
                    :placeholder="$t('Address')"
                    class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-400"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Informations de séjour
            <div class="mb-8">
              <h5
                class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                {{ $t('stayInformation') }}
              </h5>
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <InputDatePicker
                    v-model="customerForm.checkInDate"
                    :is-required="true"
                    :title="$t('ArrivedDate')"
                    :placeholder="$t('ArrivedDate')"
                  />
                </div>

                <div>
                   <InputDatePicker
                    v-model="customerForm.checkOutDate"
                    :is-required="true"
                    :title="$t('DepartDate')"
                    :placeholder="$t('DepartDate')"
                  />
                </div>

                <div>
                  <Input :lb="$t('room_number')" :inputType="'Number'" :placeholder="$t('room_number')"
                        :id="'room_number'" :forLabel="'room_number'"
                        v-model="customerForm.room_number" :min="1" :required="true" />
                </div>



                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('RoomTypes') }}
                  </label>
                  <select
                    v-model="customerForm.roomType"
                    class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-500 focus:outline-none focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-purple-400"
                  >
                    <option value="">Sélectionner</option>
                    <option value="single">Chambre simple</option>
                    <option value="double">Chambre double</option>
                    <option value="twin">Chambre twin</option>
                    <option value="suite">Suite</option>
                    <option value="deluxe">Chambre deluxe</option>
                  </select>
                </div>
              </div>
            </div> -->

            <!-- Préférences et demandes spéciales -->
            <div class="mb-4">
              <h5
                class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                {{ $t('Preferences') }}
              </h5>
              <div class="grid grid-cols-1 gap-x-6 gap-y-5">

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{$t('specialPreferences')}}
                  </label>
                  <textarea
                    v-model="customerForm.special_preferences"
                    rows="3"
                    :placeholder="$t('specialPreferences')"
                    class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-400"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex items-center gap-3 px-2 mt-4 lg:justify-end">
            <button
              @click="emit('close')"
              type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              {{ $t('Cancel') }}
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex w-full justify-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto min-w-[140px]"
            >
              <span v-if="loading" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ $t('Processing...') }}
              </span>
              <span v-else>{{ isEditMode ? $t('EditCustomer') : $t('Save') }}</span>
            </button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineAsyncComponent,computed,watch } from 'vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import { useI18n } from 'vue-i18n'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const { t } = useI18n()

interface CustomerForm {
  gender: string
  first_name: string
  last_name: string
  date_of_birth: string
  country: string
  national_id_number: string
  email: string
  phone_number: string
  address: string
  special_preferences: string
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
   isEditMode: {
        type: Boolean,
        default: false,
    },
   customerData: {
    type: Object as () => Partial<CustomerForm>,
    default: () => ({}),
  },
})


const emit = defineEmits(['close', 'submit'])
const genders = ref([
  { label: t('Male'), value: 'male' },
  { label: t('Female'), value: 'female' },
])

const loading = ref(false)


const getEmptyCustomerForm = (): CustomerForm => ({
  gender: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  country: '',
  national_id_number: '',
  email: '',
  phone_number: '',
  address: '',
  special_preferences: '',
})

const customerForm = reactive<CustomerForm>(getEmptyCustomerForm())

// Fonction pour remplir le formulaire avec les données existantes
const populateForm = (data: Partial<CustomerForm>) => {
  Object.keys(customerForm).forEach(key => {
    if (data[key as keyof CustomerForm] !== undefined) {
      (customerForm as any)[key] = data[key as keyof CustomerForm]
    }
  })
}

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  Object.assign(customerForm, getEmptyCustomerForm())
}

// Watcher pour gérer l'ouverture de la modal
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.isEditMode && props.customerData) {
        populateForm(props.customerData)
      } else {
        resetForm()
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Émettre les données avec un flag pour indiquer le mode
    emit('submit', {
      data: { ...customerForm },
      isEdit: props.isEditMode
    })

    // Ne réinitialiser le formulaire qu'en mode ajout
    if (!props.isEditMode) {
      resetForm()
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du client:", error)
  } finally {
    loading.value = false
    emit('close')
  }
}
</script>
