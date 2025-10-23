<template>
  <RightSideModal :open="isOpen" :title="t('Undo check-out')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ t('Undo check-out') }}</h3>
    </template>
    <div class="p-4 space-y-4" v-if="!isLoading">
      <div class="text-sm text-gray-600">
        {{ t('Select checked-out rooms to undo back to check-in.') }}
      </div>

      <div class="space-y-3">
        <div v-for="room in checkedOutRooms" :key="room.id"
          class="flex items-center justify-between border rounded p-3">
          <div>
            <div class="font-medium">Chambre {{ room.room?.roomNumber || room.roomNumber }}</div>
            <div class="text-xs text-gray-500">Statut: {{ room.status }}</div>
          </div>
          <input type="checkbox" :value="room.id" v-model="formData.selectedRoomIds" />
        </div>
      </div>

      <div v-if="checkedOutRooms.length === 0" class="text-sm text-gray-500">{{ t('No checked-out rooms to undo.') }}
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">{{ t('notes') }}</label>
        <textarea v-model="formData.notes" class="w-full border rounded p-2" rows="3"
          :placeholder="t('Reason for undo')"></textarea>
      </div>
    </div>

    <div v-else class="p-4">
      <div class="animate-pulse space-y-3">
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 p-4 border-t">
        <BasicButton variant="secondary" @click="closeModal" :label="t('cancel')"></BasicButton>
        <BasicButton :disabled="!canSubmit || isUndoingCheckOut" :loading="isUndoingCheckOut" @click="performUndo" :label="t('Undo check-out')">
         
        </BasicButton>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getReservationDetailsById } from '../../services/reservation'
import { useReservation } from '../../composables/useReservation'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'

interface Props {
  reservationId: number
  isOpen: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', data: any): void
}>()

const { t } = useI18n()
const { performUndoCheckOut, isUndoingCheckOut } = useReservation()

const isLoading = ref(false)
const reservationRooms = ref<any[]>([])

const formData = ref<{ selectedRoomIds: number[]; notes?: string }>({
  selectedRoomIds: [],
  notes: ''
})

const checkedOutRooms = computed(() =>
  reservationRooms.value.filter((r: any) => r.status === 'checked_out' || r.checkedOut || !!r.actualCheckOutTime)
)

const canSubmit = computed(() => formData.value.selectedRoomIds.length > 0)

const fetchDetails = async () => {
  if (!props.reservationId) return
  isLoading.value = true
  try {
    const details: any = await getReservationDetailsById(Number(props.reservationId))
    reservationRooms.value = details?.reservationRooms || []
    // pré-sélectionner toutes les chambres en check-out
    formData.value.selectedRoomIds = checkedOutRooms.value.map((r: any) => r.id)
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => emit('close')

const performUndo = async () => {
  if (!canSubmit.value) return
  const payload = {
    reservationRooms: formData.value.selectedRoomIds,
    notes: formData.value.notes || ''
  }
  const response = await performUndoCheckOut(props.reservationId, payload)
  emit('success', {
    updatedRooms: formData.value.selectedRoomIds,
    action: 'undo_check_out',
    response
  })
}

watch(() => props.isOpen, (open) => {
  if (open) fetchDetails()
})

onMounted(() => {
  if (props.isOpen) fetchDetails()
})
</script>