<!-- Dans RemarkModal.vue - Template section modifiée -->
<template>
  <RightSideModal :is-open="isOpen" :title="modalTitle" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ modalTitle }}</h3>
    </template>

    <template #default>
      <div class="text-left">
        <!-- Indicateur de chargement pour les données existantes -->
        <!-- <div v-if="isLoadingRemark" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span class="ml-2 text-sm text-gray-600">{{ $t('loadingRemark') }}</span>
        </div> -->

        <!-- Formulaire de remarque -->
        <div class="space-y-2">
          <div>
            <label
              for="remarkDescription"
              class="block text-sm font-medium text-gray-700 mb-1.5 text-left"
            >
              {{ $t('remark') }} <span class="text-red-500">*</span>
            </label>
            <textarea
              id="remarkDescription"
              v-model="form.remark"
              rows="4"
              :placeholder="$t('EnterRemarkHere')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              :class="{ 'error-border': errors.remark }"
            ></textarea>
            <p v-if="errors.remark" class="mt-1 text-sm error-text">{{ errors.remark }}</p>
          </div>

          <div>
            <label
              for="fdRemarkDescription"
              class="block text-sm font-medium text-gray-700 mb-1.5 text-left"
            >
              {{ $t('FD Remark') }}
            </label>
            <textarea
              id="fdRemarkDescription"
              v-model="form.fdRemark"
              rows="4"
              :placeholder="$t('EnterRemarkDescription')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="HKstatus"
                class="block text-sm font-medium text-gray-700 mb-1.5 text-left"
              >
                {{ $t('HK status') }}
              </label>
              <Select
                id="HKstatus"
                v-model="form.status"
                :options="priorityOptions"
                :placeholder="$t('SelectStatus')"
              />
            </div>

            <div>
              <label
                for="housekeeper"
                class="block text-sm font-medium text-gray-700 mb-1.5 text-left"
              >
                {{ $t('Housekeeper') }}
              </label>
              <Select
                id="housekeeper"
                v-model="form.housekeeper"
                :options="housekeeperOptions"
                :placeholder="$t('SelectHousekeeper')"
              />
            </div>
          </div>

          <!-- Section améliorée pour les remarques existantes -->
          <div
            v-if="existingRemarkData && existingRemarkData.length > 0"
            class="border-t pt-4 mt-4"
          >
            <div class="flex items-center justify-between mb-4">
              <h5 class="font-semibold text-gray-900 flex items-center">
                <svg
                  class="w-5 h-5 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                {{ $t('ExistingRemarks') }}
              </h5>
              <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                {{ existingRemarkData.length }}
                {{ existingRemarkData.length > 1 ? $t('remarks') : $t('remark') }}
              </span>
            </div>

            <div class="space-y-3 max-h-60 overflow-y-auto pr-2">
              <div
                v-for="(remark, index) in existingRemarkData"
                :key="remark.id"
                class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <!-- En-tête de la remarque -->
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <span
                      class="px-2 py-1 text-xs bg-purple-500 text-white rounded-full font-medium"
                    >
                      #{{ index + 1 }}
                    </span>
                    <span class="text-xs text-gray-500"> ID: {{ remark.id }} </span>
                  </div>
                  <button
                    class="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all duration-200"
                    :disabled="isLoading"
                    :title="$t('DeleteRemark')"
                    @click="deleteRemark(remark.id)"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>

                <!-- Contenu principal -->
                <div class="space-y-3">
                  <!-- Remarque principale -->
                  <div>
                    <label class="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {{ $t('Remark') }}
                    </label>
                    <p class="text-sm text-gray-900 mt-1 bg-white p-1 rounded border">
                      {{ remark.remark || $t('NoRemarkProvided') }}
                    </p>
                  </div>

                  <!-- Remarque FD (si elle existe) -->
                  <div v-if="remark.fdRemark">
                    <label class="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {{ $t('FD Remark') }}
                    </label>
                    <p class="text-sm text-gray-900 mt-1 bg-white p-1 rounded border">
                      {{ remark.fdRemark }}
                    </p>
                  </div>

                  <!-- Informations supplémentaires -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-gray-200">
                    <!-- Statut -->
                    <div class="flex items-center space-x-2">
                      <svg
                        class="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <div>
                        <p class="text-xs text-gray-500">{{ $t('Status') }}</p>
                        <span
                          class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                          :class="getStatusClass(remark.status)"
                        >
                          {{ getStatusLabel(remark.status) }}
                        </span>
                      </div>
                    </div>

                    <!-- Housekeeper -->
                    <div class="flex items-center space-x-2">
                      <svg
                        class="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      <div>
                        <p class="text-xs text-gray-500">{{ $t('Housekeeper') }}</p>
                        <p class="text-sm font-medium text-gray-900">
                          {{ getHousekeeperName(remark.housekeeper) }}
                        </p>
                      </div>
                    </div>

                    <!-- Date de création -->
                    <div class="flex items-center space-x-2">
                      <svg
                        class="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <div>
                        <p class="text-xs text-gray-500">{{ $t('Created') }}</p>
                        <p class="text-sm font-medium text-gray-900">
                          {{ formatDateT(remark.createdAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- button-->
          <div class="border-t pt-4">
            <div class="flex justify-start gap-4">
              <BasicButton
                :label="$t('BlockRoom')"
                variant="primary"
                :icon="KeyRound"
                @click="openCreateBlockModal"
              />
              <BasicButton
                :label="$t('AddWorkOrder')"
                variant="primary"
                :icon="ClipboardCheck"
                @click="openAddWorkModal"
              />
            </div>
          </div>
        </div>

        <!-- Indicateur de chargement -->
        <div v-if="isLoadingRemark" class="flex justify-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>

        <CreateBlockModal
          :is-open="isBlockModalOpen"
          :block-data="selectedBlock"
          :is-editing="isEditing"
          :pre-selected-room="preSelectedRoomData"
          @close="handleBlockClose"
          @save="handleBlockSave"
        />
        <AddWorkOrderModal
          v-if="isAddWorkModalOpen"
          :is-open="isAddWorkModalOpen"
          :work-order-data="selectedWorkOrder"
          :is-editing="isEditing"
          :pre-selected-room="preSelectedRoomData"
          @close="closeAddWorkModal"
          @save="handleWorkOrderSave"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <BasicButton
          variant="outline"
          @click="closeModal"
          :label="$t('Cancel')"
          :disabled="isLoading || isSaving"
        />
        <BasicButton
          variant="primary"
          @click="saveRemark"
          :label="$t('CreateRemark')"
          :disabled="!isFormValid || isSaving || isLoadingRemark"
          :loading="isSaving"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import Select from '../forms/FormElements/Select.vue'
import { KeyRound, ClipboardCheck, Trash2 } from 'lucide-vue-next'
import CreateBlockModal from './CreateBlockModal.vue'
import AddWorkOrderModal from './AddWorkOrderModal.vue'
import { updateHouseStatus ,deleteHousekeepingRemark} from '@/services/configrationApi'
import { formatDateT } from '../utilities/UtilitiesFunction'

interface RemarkModalProps {
  isOpen: boolean
  roomName: string
  roomId?: string
  remarkId?: string
  housekeeperOptions: Array<{ value: string; label: string }>
  existingRemarkData?: ExistingRemarkData[] | null
  isLoadingRemark?: boolean
  roomData?: {
    id: string
    roomNumber: string
    roomType?: {
      id: string
      roomTypeName: string
    }
  }
}

interface Remark {
  id: string
  title: string
  description: string
  priority: string
  category: string
  dueDate?: string
  createdAt: string
  updatedAt?: string
}

interface ExistingRemarkData {
  id: any
  createdAt: any
  remark: string
  fdRemark: string
  status: string
  housekeeper: string
}

const props = defineProps<RemarkModalProps>()

const emit = defineEmits<{
  close: []
  saved: [remark: Remark]
  remarkDeleted: [data: { remainingRemarks: ExistingRemarkData[] }]
}>()

const { t } = useI18n()
const toast = useToast()

// États réactifs
const isLoading = ref(false)
const isSaving = ref(false)
const isLoadingRemark = ref(false)
const isBlockModalOpen = ref(false)
const isAddWorkModalOpen = ref(false)
const selectedBlock = ref<any | null>(null)
const selectedWorkOrder = ref<any | null>(null)

// Formulaire réactif
const form = reactive({
  housekeeper: '',
  remark: '',
  fdRemark: '',
  status: 'clean',
})

// Erreurs de validation
const errors = reactive({
  remark: '',
})

// Options pour les selects
const priorityOptions = [{ value: 'clean', label: t('Clean') }]

// Computed pour les données pré-sélectionnées de la chambre
const preSelectedRoomData = computed(() => {
  console.log('=== Calcul preSelectedRoomData ===')
  console.log('props.roomData:', props.roomData)
  console.log('props.roomId:', props.roomId)
  console.log('props.roomName:', props.roomName)

  if (!props.roomData && !props.roomId) {
    console.log('Aucune donnée de chambre disponible')
    return null
  }

  const result = {
    roomId: Number(props.roomData?.id) || Number(props.roomId),
    roomNumber: props.roomData?.roomNumber || props.roomName,
    roomTypeId: props.roomData?.roomType?.id,
    roomTypeName: props.roomData?.roomType?.roomTypeName,
  }

  console.log('Résultat preSelectedRoomData:', result)
  return result
})

// Propriétés calculées
const modalTitle = computed(() => {
  return t('Room') + ' ' + props.roomName
})

const isEditing = computed(() => !!props.remarkId)

const isFormValid = computed(() => {
  return form.remark.trim() !== ''
})

// Méthodes de validation
const validateForm = () => {
  errors.remark = ''

  if (!form.remark.trim()) {
    errors.remark = t('TitleRequired')
  }

  return isFormValid.value
}

const loadExistingRemark = () => {
  if (!props.roomId) return

  isLoadingRemark.value = true
  try {
    const existingData = props.existingRemarkData
    if (existingData) {


      console.log('Remarque existante chargée dans le formulaire:', form)
    } else {
      resetForm()
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la remarque existante:', error)
  } finally {
    isLoadingRemark.value = false
  }
}
// Méthodes principales
const resetForm = () => {
  form.housekeeper = ''
  form.remark = ''
  form.fdRemark = ''
  form.status = 'clean'
  errors.remark = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const openCreateBlockModal = () => {
  selectedBlock.value = null
  isBlockModalOpen.value = true
}

const openAddWorkModal = () => {
  isAddWorkModalOpen.value = true
}

const closeAddWorkModal = () => {
  isAddWorkModalOpen.value = false
}

const handleWorkOrderSave = async (eventData: any) => {
  if (eventData.success) {
    toast.success(
      eventData.isEditing ? t('WorkOrderUpdatedSuccessfully') : t('WorkOrderCreatedSuccessfully'),
    )
  }
  closeAddWorkModal()
}

const handleBlockSave = async (eventData: any) => {
  if (eventData.isEditing && eventData.updated) {
    toast.success(t('BlockUpdatedSuccessfully'))
  } else if (!eventData.isEditing && eventData.successCount > 0) {
    toast.success(t('BlockCreatedSuccessfully'))
  }
  handleBlockClose()
}

const handleBlockClose = () => {
  isBlockModalOpen.value = false
  selectedBlock.value = null
}

const saveRemark = async () => {
  if (!validateForm()) return

  try {
    isSaving.value = true

    const remarkData = {
      ...form,
    }

    // Appel API
    await updateHouseStatus(Number(props.roomId), remarkData)
    form.remark = remarkData.remark
    form.fdRemark = remarkData.fdRemark
    form.status = remarkData.status
    form.housekeeper = remarkData.housekeeper

    toast.success(isEditing.value ? t('RemarkUpdated') : t('RemarkCreated'))
    emit('saved', remarkData as any)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    toast.error(t('ErrorSavingRemark'))
  } finally {
    isSaving.value = false
  }
}

// Watchers
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      resetForm()
      loadExistingRemark()
    }
  },
)

// Lifecycle hooks
onMounted(() => {
  if (props.isOpen) {
    console.log('Room data received:', preSelectedRoomData.value)
  }
})

// Méthodes à ajouter dans votre script setup

// Obtenir la classe CSS pour le statut
const getStatusClass = (status: string) => {
  switch (status) {
    case 'clean':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'dirty':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'out-of-order':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Obtenir le label traduit pour le statut
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'clean':
      return t('Clean')
    case 'dirty':
      return t('Dirty')
    case 'maintenance':
      return t('Maintenance')
    case 'out-of-order':
      return t('OutOfOrder')
    default:
      return status
  }
}

// Obtenir le nom du housekeeper à partir de l'ID
const getHousekeeperName = (housekeeperId: string | number) => {
  if (!housekeeperId) return t('NotAssigned')

  const housekeeper = props.housekeeperOptions?.find((option) => option.value === housekeeperId)

  return housekeeper?.label || `${t('Housekeeper')} #${housekeeperId}`
}



const deleteRemark = async (remarkId: string) => {


  try {
    isLoading.value = true

    await deleteHousekeepingRemark(Number(props.roomId), remarkId)

    if (props.existingRemarkData) {
      const updatedRemarks = props.existingRemarkData.filter(r => r.id !== remarkId)
      emit('remarkDeleted', { remainingRemarks: updatedRemarks })
    }
    toast.success(t('RemarkDeleted'))
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    toast.error(t('ErrorDeletingRemark'))
  } finally {
    isLoading.value = false
  }
}



</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Button states */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Form validation styles */
.error-border {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
}

/* Scrollbar pour les remarques existantes */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
