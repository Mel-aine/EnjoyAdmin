<template>
    <!-- No Show Reservation Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div
            class="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ $t('noshow_reservation') }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Loading Skeleton -->
                <div v-if="isLoading" class="space-y-4">
                    <div class="animate-pulse">
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="flex space-x-4 mb-4">
                            <div class="h-4 bg-gray-200 rounded w-16"></div>
                            <div class="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-10 bg-gray-200 rounded mb-4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-10 bg-gray-200 rounded mb-4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-10 bg-gray-200 rounded mb-4"></div>
                    </div>
                </div>

                <!-- Modal Form -->
                <form v-else @submit.prevent="handleSubmit">
                    <!-- Apply For Selection -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('Apply For') }}
                        </label>
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input
                                    v-model="formData.noShowType"
                                    type="radio"
                                    value="group"
                                    :disabled="reservationRooms.length === 1"
                                    class="w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span class="ml-2 text-sm" :class="reservationRooms.length === 1 ? 'text-gray-400' : 'text-gray-700'">{{ $t('Group') }}</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="formData.noShowType"
                                    type="radio"
                                    value="individual"
                                    class="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('Individual Reservation') }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Room Selection -->

                    <div v-if="formData.noShowType === 'individual' && reservationRooms.length > 0" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('Select Rooms') }}
                        </label>
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                            <label
                                v-for="room in reservationRooms"
                                :key="room.id"
                                class="flex items-center p-2 border rounded"
                                :class="{
                                    'hover:bg-gray-50 cursor-pointer': room.status !== 'no_show',
                                    'bg-gray-100 cursor-not-allowed opacity-60': room.status === 'no_show'
                                }"
                            >
                                <input
                                    v-model="formData.selectedRooms"
                                    type="checkbox"
                                    :value="room.id"
                                    :disabled="room.status === 'no_show'"
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <div class="ml-2 flex-1">
                                    <span class="text-sm" :class="room.status === 'no_show' ? 'text-gray-500' : 'text-gray-700'">
                                        {{ room.room?.roomNumber }} - {{ room.guest?.displayName || room.guestName }}
                                    </span>
                                    <span v-if="room.status === 'no_show'" class="ml-2 text-xs text-red-600 font-medium">
                                        ({{ $t('Already marked as no-show') }})
                                    </span>
                                </div>
                            </label>
                        </div>
                        <!-- Message d'avertissement si toutes les chambres sont no-show -->
                        <p v-if="allRoomsNoShow" class="mt-2 text-sm text-red-600">
                            {{ $t('All rooms have already been marked as no-show') }}
                        </p>
                    </div>

                    <!-- No Show Fee -->
                    <div class="mb-4">
                        <InputCurrency v-model="formData.noShowFees" :lb="$t('noshow_fee')"
                            :placeholder="$t('enter_noshowFee_fee')" />
                    </div>

                    <!-- Reason Selection -->
                    <div class="mb-4">
                        <ReasonSelector
                          v-model="formData.reason"
                          :category="'No Show'"
                          :label="$t('reason')"
                          :is-required="true"
                          @reason-added="handleReasonAdded"
                        />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3">
                        <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                            :disabled="loading" />
                        <BasicButton type="submit" variant="danger" :label="$t('save')"
                            :loading="loading" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted,computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { markNoShow, getReservationDetailsById } from '../../../services/reservation'
import ReasonSelector from '@/components/common/ReasonSelector.vue'

interface Props {
    isOpen: boolean
    reservationId?: string | number
    reservationNumber?: string
}

interface Emits {
    (e: 'close'): void
    (e: 'noshow-confirmed', data: NoShowReservationData): void
}

interface NoShowReservationData {
    noShowFees: number
    reason: string
    applyTax: boolean
    notes?: string
    reservationId?: string | number
    reservationNumber?: string
    noShowType?: string
    selectedRooms?: number[]
}

const isLoading = ref(false)
// Service store non utilisé pour le moment
const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
interface Guest {
  displayName: string
}

interface Room {
  id: number
  status: string
  roomNumber: string
  guest?: Guest
  guestName?: string
  [key: string]: unknown
}

interface Reservation {
  id: number
  guest: {
    displayName: string
  }
  reservationRooms: Room[]
  [key: string]: unknown
}

const reservation = ref<Reservation | null>(null)

const reservationRooms = ref<Room[]>([])

const formData = ref({
    noShowFees: 0,
    reason: '',
    applyTax: false,
    notes: '',
    noShowType: 'individual',
    selectedRooms: [] as number[]
})
const handleReasonAdded = (newReason: { value: string; label: string }) => {
  formData.value.reason = newReason.value
}

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
    if (newValue && props.reservationId) {
        resetForm()
        getBookingDetailsById()
    }
})

// Watch for reservationId changes
watch(() => props.reservationId, (newVal) => {
    if (newVal) {
        getBookingDetailsById()
    }
})

// Watch for noShowType changes
watch(() => formData.value.noShowType, (newType) => {
    if (newType === 'group') {
        // Ne sélectionner que les chambres non no-show
        formData.value.selectedRooms = reservationRooms.value
            .filter((room: Room) => room.status !== 'no_show')
            .map((room: Room) => room.id)
    } else {
        formData.value.selectedRooms = []
    }
}, { immediate: true })

// Watch for reservationRooms changes to handle single room auto-selection
watch(() => reservationRooms.value, (newRooms: Room[]) => {
    const available = newRooms.filter((room: Room) => room.status !== 'no_show')

    if (available.length === 0) {
        // Toutes les chambres sont no-show
        formData.value.selectedRooms = []
        return
    }

    if (available.length === 1) {
        formData.value.noShowType = 'individual'
        formData.value.selectedRooms = [available[0].id]
    } else if (newRooms.length > 1 && formData.value.noShowType === 'group') {
        // Pour le groupe, ne sélectionner que les chambres disponibles
        formData.value.selectedRooms = available.map((room: any) => room.id)
    }
}, { deep: true })

const getBookingDetailsById = async () => {
    if (!props.reservationId) return

    isLoading.value = true
    try {
        const response = await getReservationDetailsById(Number(props.reservationId))
        console.log('Reservation response:', response)
        
        // Vérifier que la réponse est valide avant de l'assigner
        if (response) {
            reservation.value = {
                id: response.id || 0,
                guest: response.guest || { displayName: '' },
                reservationRooms: response.reservationRooms || [],
                ...response
            }
            
            // Mettre à jour les chambres de réservation
            reservationRooms.value = (response.reservationRooms || []).map((room: any) => ({
                ...room,
                guest: response.guest || { displayName: '' }
            }))
        } else {
            // Réinitialiser si la réponse est invalide
            reservation.value = null
            reservationRooms.value = []
        }
        console.log('Reservation data fetched:', reservation.value)
    } catch (error) {
        console.error('Error fetching reservation details:', error)
        toast.error(t('error_fetching_reservation_details'))
    } finally {
        isLoading.value = false
    }
}

const resetForm = () => {
    formData.value = {
        noShowFees: 0,
        applyTax: false,
        reason: '',
        notes: '',
        noShowType: 'individual',
        selectedRooms: []
    }
}

const closeModal = () => {
    emit('close')
}

// Computed pour vérifier si toutes les chambres sont no-show
const allRoomsNoShow = computed(() => {
    return reservationRooms.value.length > 0 &&
           reservationRooms.value.every((room: Room) => room.status === 'no_show')
})

// Computed pour obtenir les chambres disponibles (non no-show)
const availableRooms = computed(() => {
    return reservationRooms.value.filter((room: Room) => room.status !== 'no_show')
})




const handleSubmit = async () => {
    try {
        loading.value = true

        // Vérifier s'il y a des chambres disponibles
        if (availableRooms.value.length === 0) {
            toast.error(t('All rooms have already been marked as no-show'))
            return
        }

        // Validate form
        if (!formData.value.reason) {
            toast.error(t('please_select_reason'))
            return
        }

        if (formData.value.noShowFees < 0) {
            toast.error(t('noshow_fee_must_be_positive'))
            return
        }

        // Validate room selection for individual no-show
        if (formData.value.noShowType === 'individual' && formData.value.selectedRooms.length === 0) {
            toast.error(t('please_select_at_least_one_room'))
            return
        }

         // Prepare data for emission
        const noShowData: NoShowReservationData = {
            noShowFees: formData.value.noShowFees,
            applyTax: formData.value.applyTax,
            reason: formData.value.reason,
            notes: formData.value.notes || undefined,
            reservationId: props.reservationId,
            reservationNumber: props.reservationNumber,
            noShowType: formData.value.noShowType,
            selectedRooms: formData.value.noShowType === 'group'
                ? reservationRooms.value.map((room: any) => room.id)
                : formData.value.selectedRooms
        }
        console.log('noShowData', noShowData)

        const resp = await markNoShow(noShowData);
        console.log("resp no show",resp)
        // Emit the cancel confirmation event
        emit('noshow-confirmed', noShowData)

        // Show success message
        toast.success(t('reservation_noshow_initiated'))

        // Close modal
        closeModal()
    } catch (error) {
        console.error('Error noshow reservation:', error)
        toast.error(t('error_noshow_reservation'))
    } finally {
        loading.value = false
    }
}
onMounted(() => {
    if (props.reservationId) {
        getBookingDetailsById()
    }
})
</script>

<style scoped>
/* Custom styles for the modal */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Focus styles for better accessibility */
input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error state styles */
.error {
    border-color: #ef4444;
}

.error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
