<template>
  <RightSideModal :is-open="isOpen" :title="$t('UnblockRoom')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('UnblockRoom') }}</h3>
    </template>
    <div class="space-y-6">
      <Select
        v-model="selectedRoomTypeId"
        :options="roomTypeOptions"
        :placeholder="$t('SelectRoomType')"
        :lb="$t('roomType')"
        :disabled="true"
      />
      <MultipleSelect
        :key="`room-select-${selectedRoomTypeId}-${formData.selectedRooms.length}`"
        v-model="formData.selectedRooms"
        :options="filteredRooms"
        :placeholder="$t('SelectRooms')"
        :disabled="true"
      />
      <InputDoubleDatePicker
        :modelValue="formData.dateRanges[0]"
        @update:modelValue="updateDateRange(0, $event)"
        :title="$t('DateRange')"
        :allowPastDates="true"
        :is-required="true"
        @clear-error="clearDateRangeError(0)"
        :min-date="allowedMinDate"
        :max-date="allowedMaxDate"
      />
    </div>
    <template #footer>
      <div class="flex justify-end gap-4">
        <BasicButton variant="outline" @click="closeModal" :label="$t('Cancel')" :disabled="isLoading || isSaving" />
        <BasicButton variant="primary" @click="saveBlock" :label="$t('commons.apply')" :disabled="!isFormValid || isSaving" :loading="isSaving" />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification';
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import Select from '../forms/FormElements/Select.vue'
import MultipleSelect from '../forms/FormElements/MultipleSelect.vue'
import InputDoubleDatePicker from '../forms/FormElements/InputDoubleDatePicker.vue'
import { getRoomTypesIndex } from '@/services/roomTypeApi'
import {  getRoomBlockById, unLockRoomBlock } from '@/services/roomBlockApi'
import { useServiceStore } from '@/composables/serviceStore'

interface MaintenanceBlock {
  id: string
  room: { id: string, roomNumber: string, roomType?: { id: string, roomTypeName: string } }
  roomType: { id: string, roomTypeName: string }
  blockFromDate: string
  blockToDate: string
  description: string
  blockedBy: { id: string, firstName: string, lastName: string }
  createdAt: string
  reason: string
  status: string
}

interface Props { isOpen: boolean, blockData?: MaintenanceBlock | null, blockId?: string | number | null }
interface Emits { (e: 'close'): void; (e: 'save', data: any): void }
interface DateRange { start: string | null, end: string | null }
interface RoomOption { value: string | number, label: string }

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)
const isSaving = ref(false)
const selectedRoomTypeId = ref<string | number | undefined>(undefined)
const roomTypeOptions = ref<{ value: number; label: string; [key: string]: any }[]>([])
const errorMessage = ref<string>('')
const allowedMinDate = ref<string | Date | undefined>(undefined)
const allowedMaxDate = ref<string | Date | undefined>(undefined)
const formData = reactive({ selectedRooms: [] as RoomOption[], reason: '', status: '', description: '', dateRanges: [{ start: null, end: null }] as DateRange[] })
const validationErrors = reactive({ selectedRooms: '', dateRanges: '', reason: '' })
const modalTitle = computed(() => t('UpdateBlock'))
const handleReasonAdded = (newReason: { value: string; label: string }) => { formData.reason = newReason.value }
const filteredRooms = computed(() => {
  if (!selectedRoomTypeId.value) return []
  const roomType = roomTypeOptions.value.find(rt => rt.id === selectedRoomTypeId.value)
  return roomType?.rooms ? roomType.rooms.map((room: any) => ({ value: room.id, label: room.roomNumber })) : []
})
const isFormValid = computed(() => !!serviceStore.serviceId && !!selectedRoomTypeId.value && formData.selectedRooms.length > 0 && formData.reason && Object.values(validationErrors).every(e => e === ''))

const mapApiBlockToMaintenance = (rb: any): MaintenanceBlock => {
  return {
    id: String(rb?.id ?? ''),
    room: {
      id: String(rb?.room?.id ?? ''),
      roomNumber: String(rb?.room?.room_number ?? rb?.room?.roomNumber ?? ''),
      roomType: rb?.room_type
        ? { id: String(rb.room_type.id ?? ''), roomTypeName: String(rb.room_type.name ?? rb.room_type.roomTypeName ?? '') }
        : undefined
    },
    roomType: {
      id: String(rb?.room_type?.id ?? rb?.room?.roomType?.id ?? ''),
      roomTypeName: String(rb?.room_type?.name ?? rb?.room?.roomType?.roomTypeName ?? '')
    },
    blockFromDate: rb?.block_from_date ?? rb?.blockFromDate ?? '',
    blockToDate: rb?.block_to_date ?? rb?.blockToDate ?? '',
    description: rb?.description ?? '',
    blockedBy: {
      id: String(rb?.blocked_by?.id ?? ''),
      firstName: String(rb?.blocked_by?.first_name ?? ''),
      lastName: String(rb?.blocked_by?.last_name ?? '')
    },
    createdAt: rb?.created_at ?? '',
    reason: rb?.reason ?? '',
    status: rb?.status ?? ''
  }
}

const populateFormData = async () => {
  let blk: MaintenanceBlock | null = null
  try {
    if (props.blockId) {
      const resp = await getRoomBlockById(String(props.blockId))
      const rb = resp.data?.data ?? resp.data
      blk = mapApiBlockToMaintenance(rb)
    } else if (props.blockData) {
      blk = props.blockData
    }
  } catch (e: any) {
    errorMessage.value = e?.message || t('ErrorLoadingData')
  }

  if (blk) {
    const roomTypeId = blk.roomType?.id || blk.room?.roomType?.id
    if (roomTypeId) {
      selectedRoomTypeId.value = Number(roomTypeId)
      await nextTick()
      if (filteredRooms.value.length > 0) {
        const roomToSelect = filteredRooms.value.find((room: any) => room.value === blk!.room.id)
        if (roomToSelect) formData.selectedRooms = [roomToSelect]
      }
    }
    
    // Calculate allowed date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let minD: string | Date = blk.blockFromDate
    let startStr = blk.blockFromDate
    
    if (blk.blockFromDate) {
      // Ensure we treat the date string as YYYY-MM-DD regardless of time components
      const datePart = blk.blockFromDate.substring(0, 10)
      const parts = datePart.split('-')
      
      if (parts.length === 3) {
        const blockStart = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
        blockStart.setHours(0, 0, 0, 0)
        
        if (blockStart < today) {
          minD = today
          const year = today.getFullYear()
          const month = String(today.getMonth() + 1).padStart(2, '0')
          const day = String(today.getDate()).padStart(2, '0')
          startStr = `${year}-${month}-${day}`
        }
      }
    }
    
    allowedMinDate.value = minD
    allowedMaxDate.value = blk.blockToDate
    
    formData.dateRanges = [{ start: startStr || null, end: blk.blockToDate || null }]
    formData.reason = blk.reason || ''
    formData.status = blk.status || ''
    formData.description = blk.description || ''
  } else {
    resetForm()
  }
}
const resetForm = () => {
  formData.selectedRooms = []
  formData.reason = ''
  formData.status = ''
  formData.description = ''
  formData.dateRanges = [{ start: null, end: null }]
  allowedMinDate.value = undefined
  allowedMaxDate.value = undefined
  selectedRoomTypeId.value = undefined
  Object.keys(validationErrors).forEach(key => { validationErrors[key as keyof typeof validationErrors] = '' })
  errorMessage.value = ''
}
const validateForm = (): boolean => {
  Object.keys(validationErrors).forEach(key => { validationErrors[key as keyof typeof validationErrors] = '' })
  let isValid = true
  if (!serviceStore.serviceId) { errorMessage.value = t('ServiceIdRequired'); isValid = false }
  if (!selectedRoomTypeId.value) { errorMessage.value = t('PleaseSelectRoomType'); isValid = false }
  if (formData.selectedRooms.length === 0) { validationErrors.selectedRooms = t('PleaseSelectAtLeastOneRoom'); isValid = false }
  const validDateRanges = formData.dateRanges.filter(range => range.start && range.end)
  if (validDateRanges.length === 0) { validationErrors.dateRanges = t('PleaseSelectAtLeastOneDateRange'); isValid = false }
  else {
    const range = validDateRanges[0]; const startDate = new Date(range.start!); const endDate = new Date(range.end!)
    if (startDate >= endDate) { validationErrors.dateRanges = t('EndDateMustBeAfterStartDate'); isValid = false }
  }
  if (!formData.reason || formData.reason.trim() === '') { validationErrors.reason = t('ReasonIsRequired'); isValid = false }
  return isValid
}
const saveBlock = async () => {
  if (!validateForm()) { toast.error(t('PleaseCorrectFormErrors')); return }
  isSaving.value = true; errorMessage.value = ''
  try {
    const validDateRanges = formData.dateRanges.filter(range => range.start && range.end)
    const updateData = {
      room_id: formData.selectedRooms[0]?.value,
      unblock_from_date: validDateRanges[0]?.start,
      unblock_to_date: validDateRanges[0]?.end,
    }
    const targetBlockId = String(props.blockId ?? props.blockData?.id ?? '')
    const response = await unLockRoomBlock(targetBlockId, updateData)
    toast.success(t('BlockUpdatedSuccessfully'))
    emit('save', { isEditing: true, updated: true, data: response.data })
    closeModal()
  } catch (err: any) {
    if (err.response?.status === 409) {
      const conflictMsg = err.response?.data?.message || t('ConflictError')
      toast.error(`${conflictMsg}`)
    } else {
      const errorMsg = err.response?.data?.message || err.message || t('ErrorUpdatingBlock')
      toast.error(errorMsg)
    }
  } finally {
    isSaving.value = false
  }
}
const closeModal = () => { resetForm(); emit('close') }
watch(() => props.isOpen, async (newVal) => { if (newVal) { await nextTick(); await populateFormData() } })
watch(() => props.blockData, () => { if (props.isOpen) { nextTick(() => { populateFormData() }) } }, { deep: true })
watch(() => props.blockId, () => { if (props.isOpen) { nextTick(() => { populateFormData() }) } })
watch(selectedRoomTypeId, (newValue, oldValue) => { if (newValue !== oldValue) { formData.selectedRooms = []; validationErrors.selectedRooms = '' } })
watch(() => formData.selectedRooms, () => { if (formData.selectedRooms.length > 0) { validationErrors.selectedRooms = '' } })
watch(() => formData.reason, (newValue) => { if (newValue && newValue.trim() !== '') { validationErrors.reason = '' } })
onMounted(async () => {
  isLoading.value = true
  try {
    const hotel_id = serviceStore.serviceId
    if (!hotel_id) { throw new Error(t('HotelIdNotSet')) }
    const roomTypesResponse = await getRoomTypesIndex(hotel_id)
    const roomTypesData = roomTypesResponse.data?.data?.data || roomTypesResponse.data?.data || roomTypesResponse.data
    if (Array.isArray(roomTypesData)) {
      roomTypeOptions.value = roomTypesData.map((type: any) => ({ ...type, value: type.id, label: type.roomTypeName || type.name }))
      if (props.isOpen) { await nextTick(); await populateFormData() }
    }
  } catch (err: any) {
    errorMessage.value = err.message || t('ErrorLoadingData')
    toast.error(t('ErrorLoadingData'))
  } finally {
    isLoading.value = false
  }
})
const clearDateRangeError = (index: number) => { validationErrors.dateRanges = ''; errorMessage.value = '' }
const updateDateRange = (index: number, newRange: { start: string | null, end: string | null }) => {
  if (index >= 0 && index < formData.dateRanges.length) {
    formData.dateRanges[index] = { ...newRange }
    if (newRange.start && newRange.end) {
      validationErrors.dateRanges = ''
      if (new Date(newRange.start) >= new Date(newRange.end)) { validationErrors.dateRanges = t('EndDateMustBeAfterStartDate') }
    }
  }
}
</script>

