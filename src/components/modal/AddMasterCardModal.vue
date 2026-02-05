<template>
  <RightSideModal :is-open="isOpen" :title="$t('Add Master Access Card') " @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('Add Master Access Card') }}</h3>
    </template>



        <!-- Modal Body -->
        <form @submit.prevent="saveMasterCard" class="p-6 space-y-3 ">
          <!-- Staff Type Toggle -->
          <div
            class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ $t('Staff Type') }} <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-3">
              <button
                type="button"
                @click="formData.isLinkedToUser = true"
                :class="[
                  formData.isLinkedToUser
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
                  'flex-1 px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm',
                ]"
              >
                <Users class="w-5 h-5 mx-auto mb-1" />
                {{ $t('Has User Account') }}
              </button>
              <button
                type="button"
                @click="formData.isLinkedToUser = false"
                :class="[
                  !formData.isLinkedToUser
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
                  'flex-1 px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm',
                ]"
              >
                <UserX class="w-5 h-5 mx-auto mb-1" />
                {{ $t('Standalone Staff') }}
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{
                formData.isLinkedToUser
                  ? $t('Select if this person has a PMS account')
                  : $t('Select for staff without PMS account (housekeeping, security, etc.)')
              }}
            </p>
          </div>

          <!-- CAS 1: Staff avec compte User -->
          <div v-if="formData.isLinkedToUser">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('User Account') }} <span class="text-red-500">*</span>
            </label>
            <Select
              v-model="formData.userId"
              :options="userOptions"
              :placeholder="$t('Select user')"
              customClass="w-full"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ $t('Link this card to an existing staff user account') }}
            </p>
          </div>

          <!-- CAS 2: Staff standalone (sans compte) -->
          <div v-else class="space-y-4">
            <!-- Nom et Prénom -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('First Name') }} <span class="text-red-500">*</span>
                </label>
                <Input
                  v-model="formData.staffFirstName"
                  :placeholder="$t('e.g., John')"
                  customClass="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('Last Name') }} <span class="text-red-500">*</span>
                </label>
                <Input
                  v-model="formData.staffLastName"
                  :placeholder="$t('e.g., Doe')"
                  customClass="w-full"
                />
              </div>
            </div>

            <!-- Poste et Matricule -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('Position') }}
                </label>
                <Select
                  v-model="formData.staffPosition"
                  :options="positionOptions"
                  :placeholder="$t('Select position')"
                  customClass="w-full"
                />
              </div>
               <!-- Téléphone -->
            <div>
               <InputPhone
                  :title="$t('Phone')"
                  v-model="formData.staffPhoneNumber"
                  :id="'phone'"
                  :is-required="false"
                  custom-class="h-11"
                />

            </div>
            </div>


          </div>

          <!-- Access Type (commun) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Access Type') }} <span class="text-red-500">*</span>
            </label>
            <Select
              v-model="formData.accessType"
              :options="accessTypeOptions"
              customClass="w-full"
            />
          </div>

          <!-- Sélection des portes pour accès limité -->
          <div v-if="formData.accessType === 'limited'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Select Doors') }} <span class="text-red-500">*</span>
            </label>
            <MultiSelect
              v-model="formData.selectedDoors"
              :options="doorOptions"
              :lb="$t('Authorized Doors')"
              :max-visible-tags="3"
              customClass="w-full"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ $t('Select which doors this card can access') }}
            </p>
          </div>

          <!-- Card UID (commun) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Card UID / Badge Number') }} <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="formData.cardUid"
              :placeholder="$t('Scan badge or enter UID manually')"
              customClass="w-full"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ $t('Physical RFID card unique identifier') }}
            </p>
          </div>

          <!-- Validity Period (si temporary) -->
          <div v-if="formData.accessType === 'temporary'" class="grid grid-cols-2 gap-4">
            <div>
              <InputDatePicker
                :title="$t('Valid From')"
                v-model="formData.validFrom"
                :placeholder="$t('select_date')"
              />
            </div>
            <div>
               <InputDatePicker
                :title="$t('Valid Until')"
                v-model="formData.validUntil"
                :placeholder="$t('select_date')"
              />
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Notes (Optional)') }}
            </label>
            <textarea
              v-model="formData.notes"
              :placeholder="$t('Additional information...')"
              rows="3"
              class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all text-sm outline-0 resize-none"
            ></textarea>
          </div>

          <!-- Warning -->
          <div
            class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
          >
            <div class="flex items-start space-x-3">
              <AlertCircle
                class="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <p class="text-sm font-medium text-amber-900 dark:text-amber-300 mb-1">
                  {{ $t('Important') }}
                </p>
                <p class="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  {{ getWarningMessage() }}
                </p>
              </div>
            </div>
          </div>
        </form>

        <!-- Modal Footer -->
         <template #footer>
        <div
          class="flex justify-end space-x-3"
        >
          <BasicButton
            type="button"
            variant="outline"
            :label="$t('Cancel')"
            @click="closeModal"
            :disabled="props.isSaving"
          />
          <BasicButton
            @click="saveMasterCard"
            variant="primary"
            :icon="Plus"
            :label="props.isSaving ? $t('Creating & Syncing...') : $t('Create Master Card')"
            :loading="props.isSaving"
            :disabled="props.isSaving || !isFormValid"
          />
        </div>
        </template>

  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { X, Users, UserX, AlertCircle, Plus } from 'lucide-vue-next'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import MultiSelect from '@/components/forms/FormElements/MultipleSelect.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import RightSideModal from '@/components/modal/RightSideModal.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputPhone from '../forms/FormElements/InputPhone.vue'


interface Props {
  isOpen: boolean
  isSaving?: boolean
  userOptions: Array<{ value: number; label: string }>
  doorOptions: Array<{ value: number; label: string }>
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  isSaving: false
})
const emit = defineEmits<Emits>()

const { t } = useI18n()
const toast = useToast()


// Form data
const formData = reactive({
  // Toggle User / Standalone
  isLinkedToUser: true,

  // Si isLinkedToUser = true
  userId: null as number | null,

  // Si isLinkedToUser = false
  staffFirstName: '',
  staffLastName: '',
  staffPosition: '',
  staffPhoneNumber: '',
  staffEmployeeId: '',

  // Commun
  accessType: 'master',
  cardUid: '',
  validFrom: '',
  validUntil: '',
  notes: '',
  selectedDoors: [] as Array<{ label: string; value: number }>
})

// Options pour les postes
const positionOptions = computed(() => [
  { value: 'housekeeping', label: t('Housekeeping') },
  { value: 'security', label: t('Security') },
  { value: 'maintenance', label: t('Maintenance') },
  { value: 'reception', label: t('Reception') },
  { value: 'management', label: t('Management') },
  { value: 'other', label: t('Other') },
])

const accessTypeOptions = computed(() => [
  { value: 'master', label: t('Master - All Rooms') },
  { value: 'limited', label: t('Limited - Selected Rooms') },
  { value: 'temporary', label: t('Temporary - Time Limited') }
])

// Validation du formulaire
const isFormValid = computed(() => {
  // Validation commune
  const hasCardUid = !!formData.cardUid

  // Validation selon le type de staff
  let hasStaffInfo = false
  if (formData.isLinkedToUser) {
    hasStaffInfo = !!formData.userId
  } else {
    hasStaffInfo = !!(formData.staffFirstName && formData.staffLastName)
  }

  // Validation selon le type d'accès
  if (formData.accessType === 'limited') {
    return hasStaffInfo && hasCardUid && formData.selectedDoors.length > 0
  }

  if (formData.accessType === 'temporary') {
    return hasStaffInfo && hasCardUid &&
           !!formData.validFrom &&
           !!formData.validUntil
  }

  return hasStaffInfo && hasCardUid
})

// Message d'avertissement dynamique
const getWarningMessage = () => {
  switch (formData.accessType) {
    case 'master':
      return t('This master card will be synchronized to ALL active terminals in the system. The synchronization process may take a few minutes depending on network conditions.')
    case 'limited':
      return t('This card will only be synchronized to the selected doors. Make sure to select all required doors before creating.')
    case 'temporary':
      return t('This temporary card will automatically expire after the specified date. The system will revoke access automatically.')
    default:
      return ''
  }
}
// Méthode de sauvegarde
const saveMasterCard = async () => {
  if (!isFormValid.value) {
    toast.error(t('Please fill all required fields'))
    return
  }

  const payload: any = {
    cardUid: formData.cardUid,
    accessType: formData.accessType,
    notes: formData.notes || null
  }

  if (formData.isLinkedToUser) {
    payload.userId = formData.userId
  } else {
    payload.staffFirstName = formData.staffFirstName
    payload.staffLastName = formData.staffLastName
    payload.staffPosition = formData.staffPosition || null
    payload.staffPhoneNumber = formData.staffPhoneNumber || null
    payload.staffEmployeeId = formData.staffEmployeeId || null
  }

  if (formData.accessType === 'temporary') {
    payload.validFrom = formData.validFrom
    payload.validUntil = formData.validUntil
  }

  if (formData.accessType === 'limited') {
    payload.doorIds = formData.selectedDoors.map(d => d.value)
  }

  emit('save', payload)
}




// Réinitialiser le formulaire
const resetForm = () => {
  Object.assign(formData, {
    isLinkedToUser: true,
    userId: null,
    staffFirstName: '',
    staffLastName: '',
    staffPosition: '',
    staffPhoneNumber: '',
    staffEmployeeId: '',
    accessType: 'master',
    cardUid: '',
    validFrom: '',
    validUntil: '',
    notes: '',
    selectedDoors: []
  })
}

const closeModal = () => {
  resetForm()
  emit('close')
}

// Réinitialiser le formulaire quand le modal s'ouvre
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

// Gestion de la touche Escape
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})
</script>

<style scoped>
/* Animation du modal */
.animate-in {
  animation: fadeInZoom 0.2s ease-out;
}

@keyframes fadeInZoom {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
