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
           {{ getFormTitle() }}
          </h4>
        </div>

        <form class="flex flex-col" @submit.prevent="handleSubmit">
          <div class="custom-scrollbar h-[600px] overflow-y-auto p-2">

            <!-- Formulaire pour ajouter un "Found" -->
            <div v-if="isFoundMode">
              <!-- Item Information -->
              <div class="mb-8">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ $t('ItemInformation') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
                  <div>
                    <InputDatePicker
                      v-model="lostFoundForm.foundOn"
                      :is-required="true"
                      :title="$t('FoundOn')"
                      :placeholder="$t('FoundOn')"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('ItemName')"
                      :id="'item_name'"
                      :forLabel="'item_name'"
                      v-model="lostFoundForm.itemName"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('ItemColor')"
                      :id="'item_color'"
                      :forLabel="'item_color'"
                      v-model="lostFoundForm.itemColor"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('FoundLocation')"
                      :id="'found_location'"
                      :forLabel="'found_location'"
                      v-model="lostFoundForm.foundLocation"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Select
                      :is-required="true"
                      :lb="$t('Room')"
                      v-model="lostFoundForm.roomId"
                      :options="rooms"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('ItemValue')"
                      :id="'item_value'"
                      :forLabel="'item_value'"
                      :inputType="'number'"
                      v-model="lostFoundForm.itemValue"
                      :is-required="true"
                      :currency="'MX$'"
                    />
                  </div>
                </div>
              </div>
                            <!-- Complaint Information -->
              <div class="mb-8">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ $t('ComplaintInformation') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                  <div>
                    <Input
                      :lb="$t('Name')"
                      :id="'complainant_name'"
                      :forLabel="'complainant_name'"
                      v-model="lostFoundForm.complainantName"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <InputPhone
                      :is-required="true"
                      v-model="lostFoundForm.phone"
                      :id="'phone'"
                      :title="$t('Phone')"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                     {{ $t('Address') }}
                    </label>
                    <textarea
                      v-model="lostFoundForm.address"
                      rows="1"
                      :placeholder="$t('Address')"
                      class="w-full  border border-black/50 rounded-lg bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-400"
                    ></textarea>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
                  <div>
                    <Input
                      :lb="$t('City')"
                      :id="'city'"
                      :forLabel="'city'"
                      v-model="lostFoundForm.city"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('State')"
                      :id="'state'"
                      :forLabel="'state'"
                      v-model="lostFoundForm.state"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <InputCountries v-model="lostFoundForm.country">
                    </InputCountries>
                  </div>

                  <div>
                    <Input
                      :lb="$t('ZipCode')"
                      :id="'zip_code'"
                      :forLabel="'zip_code'"
                      v-model="lostFoundForm.zipCode"
                      :is-required="true"
                    />
                  </div>

                </div>
              </div>
              <!-- Found Information -->
              <div class="mb-8">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ $t('FoundInformation') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input
                      :lb="$t('WhoFound')"
                      :id="'who_found'"
                      :forLabel="'who_found'"
                      v-model="lostFoundForm.whoFound"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('CurrentLocation')"
                      :id="'current_location'"
                      :forLabel="'current_location'"
                      v-model="lostFoundForm.currentLocation"
                      :is-required="true"
                    />
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div class="mb-4">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ $t('Status') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <div class="flex gap-4">
                      <label class="flex items-center">
                        <input
                          type="radio"
                          v-model="lostFoundForm.status"
                          value="returned"
                          class="mr-2 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('Returned') }}</span>
                      </label>
                      <label class="flex items-center">
                        <input
                          type="radio"
                          v-model="lostFoundForm.status"
                          value="discarded"
                          class="mr-2 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('Discarded') }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulaire normal (Lost) -->
            <div v-else>
              <!-- Item Information -->
              <div class="mb-8">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ $t('ItemInformation') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">

                  <div>
                    <InputDatePicker
                      v-model="lostFoundForm.lostOn"
                      :is-required="true"
                      :title="$t('LostOn')"
                      :placeholder="$t('LostOn')"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('ItemName')"
                      :id="'item_name'"
                      :forLabel="'item_name'"
                      v-model="lostFoundForm.itemName"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('ItemColor')"
                      :id="'item_color'"
                      :forLabel="'item_color'"
                      v-model="lostFoundForm.itemColor"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('LostLocation')"
                      :id="'lost_location'"
                      :forLabel="'lost_location'"
                      v-model="lostFoundForm.lostLocation"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Select
                      :is-required="true"
                      :lb="$t('Room')"
                      v-model="lostFoundForm.roomId"
                      :options="rooms"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('ItemValue')"
                      :id="'item_value'"
                      :forLabel="'item_value'"
                      :inputType="'number'"
                      v-model="lostFoundForm.itemValue"
                      :is-required="true"
                      :currency="'MX$'"
                    />
                  </div>

                </div>
              </div>

              <!-- Complaint Information -->
              <div class="mb-8">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ $t('ComplaintInformation') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                  <div>
                    <Input
                      :lb="$t('Name')"
                      :id="'complainant_name'"
                      :forLabel="'complainant_name'"
                      v-model="lostFoundForm.complainantName"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <InputPhone
                      :is-required="true"
                      v-model="lostFoundForm.phone"
                      :id="'phone'"
                      :title="$t('Phone')"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                     {{ $t('Address') }}
                    </label>
                    <textarea
                      v-model="lostFoundForm.address"
                      rows="1"
                      :placeholder="$t('Address')"
                      class="w-full  border border-black/50 rounded-lg bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-400"
                    ></textarea>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
                  <div>
                    <Input
                      :lb="$t('City')"
                      :id="'city'"
                      :forLabel="'city'"
                      v-model="lostFoundForm.city"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('State')"
                      :id="'state'"
                      :forLabel="'state'"
                      v-model="lostFoundForm.state"
                      :is-required="true"
                    />
                  </div>

                  <div>
                    <InputCountries v-model="lostFoundForm.country">
                    </InputCountries>
                  </div>

                  <div>
                    <Input
                      :lb="$t('ZipCode')"
                      :id="'zip_code'"
                      :forLabel="'zip_code'"
                      v-model="lostFoundForm.zipCode"
                      :is-required="true"
                    />
                  </div>

                </div>
              </div>

              <!-- Found Information -->
  <!--             <div class="mb-4">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ $t('FoundInformation') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                </div>
              </div> -->

              <!-- Status -->
              <div class="mb-4">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ $t('Status') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                  <div>
                    <div class="flex gap-4">
                      <label class="flex items-center">
                        <input
                          type="radio"
                          v-model="lostFoundForm.status"
                          value="returned"
                          class="mr-2 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('Returned') }}</span>
                      </label>
                      <label class="flex items-center">
                        <input
                          type="radio"
                          v-model="lostFoundForm.status"
                          value="discarded"
                          class="mr-2 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('Discarded') }}</span>
                      </label>
                    </div>
                  </div>
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
              <span v-else>{{ getButtonText() }}</span>
            </button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, watch, computed, onMounted } from 'vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import {getRooms } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const { t } = useI18n()

interface LostFoundForm {
  lostOn: string
  foundOn?: string,
  foundLocation?: string,
  itemName: string
  itemColor: string
  lostLocation: string
  roomId: string
  itemValue: number | string
  complainantName: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  status: string
  additionalNotes: string
  whoFound?: string,
  currentLocation?: string
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
  isFoundMode: {
    type: Boolean,
    default: false,
  },
  lostFoundData: {
    type: Object as () => Partial<LostFoundForm>,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'submit'])

const rooms = ref([])

const getAllRoomsData = async () => {
  try {
    const response = await getRooms()
    console.log("Response from getRooms:", response)
    if (response.data && response.data) {
      rooms.value = response.data.data.data.map((room: any) => ({
        label: room.roomNumber,
        value: room.id
      }))
    }
    console.log("Updated rooms:", rooms.value)
  } catch (error) {
    console.error("Erreur lors de la récupération des chambres:", error)
  }
}
const loading = ref(false)

const getEmptyLostFoundForm = (): LostFoundForm => ({
  lostOn: '',
  foundOn: '',
  foundLocation: '',
  itemName: '',
  itemColor: '',
  lostLocation: '',
  roomId: '',
  itemValue: '',
  complainantName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'CM',
  zipCode: '',
  status: '',
  additionalNotes: 'remarks',
  whoFound: '',
  currentLocation: '',
})

const lostFoundForm = reactive<LostFoundForm>(getEmptyLostFoundForm())

// Computed pour déterminer le titre du formulaire
const getFormTitle = () => {
  if (props.isFoundMode) {
    return props.isEditMode ? t('EditFound') : t('AddNewFound')
  }
  return props.isEditMode ? t('EditLostFound') : t('add_new_lost_found')
}

// Computed pour déterminer le texte du bouton
const getButtonText = () => {
  if (props.isFoundMode) {
    return props.isEditMode ? t('UpdateFound') : t('SaveFound')
  }
  return props.isEditMode ? t('UpdateLostFound') : t('Save')
}

// Fonction pour remplir le formulaire avec les données existantes
const populateForm = (data: Partial<LostFoundForm>) => {
  Object.keys(lostFoundForm).forEach(key => {
    if (data[key as keyof LostFoundForm] !== undefined) {
      (lostFoundForm as any)[key] = data[key as keyof LostFoundForm]
    }
  })
}

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  Object.assign(lostFoundForm, getEmptyLostFoundForm())
}

// Watcher pour gérer l'ouverture de la modal
watch(
  [() => props.isOpen, () => props.isFoundMode, () => props.isEditMode],
  ([isOpen, isFoundMode, isEditMode]) => {
    if (isOpen) {
      if (isEditMode && props.lostFoundData) {
        populateForm(props.lostFoundData)
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
      data: { ...lostFoundForm },
      isEdit: props.isEditMode,
      isFound: props.isFoundMode
    })

    // Ne réinitialiser le formulaire qu'en mode ajout
    if (!props.isEditMode) {
      resetForm()
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error)
  } finally {
    loading.value = false
    emit('close')
  }
}

onMounted(async () => {
  await getAllRoomsData()
})
</script>
