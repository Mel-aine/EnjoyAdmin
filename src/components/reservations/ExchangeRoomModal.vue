<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Exchange Room</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-10">
        <Spinner />
      </div>

      <div v-else>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">From Room</label>
              <select v-model="formData.fromRoomId" class="w-full border rounded px-3 py-2">
                <option :value="null">Select room</option>
                <option v-for="room in reservationRooms" :key="room.id" :value="room.id">
                  {{ room.room?.roomNumber || room.room?.name || room.id }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">To Room</label>
              <select v-model="formData.toRoomId" class="w-full border rounded px-3 py-2">
                <option :value="null">Select room</option>
                <option v-for="room in reservationRooms" :key="room.id" :value="room.id">
                  {{ room.room?.roomNumber || room.room?.name || room.id }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Move Date</label>
              <input type="date" v-model="formData.moveDate" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Reason</label>
              <input type="text" v-model="formData.reason" class="w-full border rounded px-3 py-2" placeholder="Reason for exchange" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <BasicButton variant="secondary" type="button" :label="$t('cancel')" @click="closeModal" />
          <BasicButton variant="primary" type="button" :label="$t('save')" :loading="isExchangingRoom" @click="confirmExchange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import Spinner from '@/components/spinner/Spinner.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { useReservation } from '@/composables/useReservation'
import { getReservationDetailsById } from '@/services/reservation'
import { useToast } from 'vue-toastification'

interface Props {
  reservationId: number | null
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'success'])

const { exchangeRoom, isExchangingRoom } = useReservation()
const toast = useToast()
const loading = ref(false)
const reservationRooms = ref<any[]>([])

const formData = reactive({
  fromRoomId: null as number | null,
  toRoomId: null as number | null,
  moveDate: new Date().toISOString().split('T')[0],
  reason: ''
})

watch(() => props.isOpen, async (open) => {
  if (open && props.reservationId) {
    await loadReservationRooms()
  }
})

const loadReservationRooms = async () => {
  try {
    loading.value = true
    const res = await getReservationDetailsById(Number(props.reservationId))
    reservationRooms.value = res?.reservationRooms || []
  } catch (e) {
    console.error('Failed to load reservation rooms', e)
    toast.error('Failed to load reservation rooms')
  } finally {
    loading.value = false
  }
}

const confirmExchange = async () => {
  if (!formData.fromRoomId || !formData.toRoomId) {
    toast.error('Please select both From and To rooms')
    return
  }

  try {
    await exchangeRoom({
      reservationId: Number(props.reservationId),
      fromRoomId: formData.fromRoomId!,
      toRoomId: formData.toRoomId!,
      moveDate: formData.moveDate,
      reason: formData.reason || 'Exchange'
    })
    emit('success')
    closeModal()
  } catch (e) {
    console.error('Failed to exchange room', e)
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
</style>