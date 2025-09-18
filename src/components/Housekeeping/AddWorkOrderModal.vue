<template>
  <RightSideModal :is-open="isOpen" :title="$t('AddWorkOrder')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">
        {{ isEditing ? $t('EditWorkOrder') : $t('AddWorkOrder') }}
      </h3>
    </template>
    
    <div class="space-y-6">
      <!-- Order & Date Block -->
      <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
        <div>
          <Input 
            v-model="formData.recVouNumber" 
            type="text" 
            :lb="$t('Order#')" 
            :disabled="!isEditing" 
          />
        </div>
        <div>
          <InputDoubleDatePicker :title="$t('Block')" v-model="formData.blockDates" />
        </div>
      </div>

      <!-- Folio -->
      <div>
        <Select 
          v-model="formData.unit" 
          :options="Rooms" 
          :lb="$t('Unit/Room')" 
          required
        />
      </div>

      <!-- Due Date -->
      <div>
        <InputDateTimePicker 
          v-model="formData.dueDate" 
          :title="$t('Duedate')" 
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {{ $t('Description') }} <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="formData.description"
          :placeholder="$t('Largetext')"
          rows="6"
          class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
          required
        ></textarea>
      </div>

      <!-- Category / Priority / Status -->
      <div class="grid md:grid-cols-3 grid-cols-1 gap-2">
        <div>
          <Select 
            v-model="formData.category" 
            :options="categoryOptions" 
            :lb="$t('Category')" 
            required
          />
        </div>
        <div>
          <Select 
            v-model="formData.priority" 
            :options="priorityOptions" 
            :lb="$t('Priority')" 
            required
          />
        </div>
        <div>
          <Select 
            v-model="formData.status" 
            :options="statusOptions" 
            :lb="$t('Status')" 
            required
          />
        </div>
      </div>

      <!-- AssignTo / Room Status -->
      <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
        <div>
          <Select 
            v-model="formData.assignTo" 
            :options="Users" 
            :lb="$t('AssignTo')" 
            required
          />
        </div>
        <div>
          <Select
            v-model="formData.roomStatus"
            :options="roomStatusOptions"
            :lb="$t('configuration.housekeeping.roomStatus')"
          />
        </div>
      </div>

      <!-- Reason -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {{ $t('Reason') }}
        </label>
        <textarea
          v-model="formData.reason"
          :placeholder="$t('Largetext')"
          rows="6"
          class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-4">
        <BasicButton 
          variant="outline" 
          @click="closeModal" 
          :label="$t('Cancel')"
          :disabled="isSaving"
        />
        <BasicButton 
          variant="primary" 
          @click="saveWorkOrder" 
          :label="isEditing ? $t('Update') : $t('Save')"
          :loading="isSaving"
          :disabled="isSaving"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue'
import InputDateTimePicker from '../forms/FormElements/InputDateTimePicker.vue'
import InputDoubleDatePicker from '../forms/FormElements/InputDoubleDatePicker.vue'
import Select from '../forms/FormElements/Select.vue'
import Input from '../forms/FormElements/Input.vue'
import { useI18n } from 'vue-i18n'
import { getEmployeesForService } from '@/services/userApi'
import { useServiceStore } from '@/composables/serviceStore'
import { getRoomsByHotelId } from '@/services/configrationApi'
import { createWorkOrder, updateWorkOrder } from '@/services/workOrderApi'
import { useToast } from 'vue-toastification'

interface Props {
  isOpen: boolean
  workOrderData?: any
  isEditing?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

interface DateRange {
  start: string | null
  end: string | null
}

const { t } = useI18n()
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const Users = ref<any[]>([])
const Rooms = ref<any[]>([])
const loading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const toast = useToast()
const serviceStore = useServiceStore()

const isEditing = computed(() => props.isEditing || false)

const statusOptions = computed(() => [
  { value: 'assigned', label: t('statuses.assigned') },
  { value: 'in_progress', label: t('statuses.in_progress') },
  { value: 'completed', label: t('statuses.completed') },
])

const roomStatusOptions = computed(() => [
  { value: 'dirty', label: t('roomStatus.dirty') },
  { value: 'clean', label: t('Clean') },
  { value: 'out_of_order', label: t('roomStatus.out_of_order') },
])

const categoryOptions = computed(() => [
  { value: 'clean', label: t('Clean') },
  { value: 'repair', label: t('repair') },
  { value: 'maintenance', label: t('maintenance') },
  { value: 'other', label: t('others_tasks') },
])

const priorityOptions = computed(() => [
  { value: 'low', label: t('taskManagement.priorities.low') },
  { value: 'medium', label: t('taskManagement.priorities.medium') },
  { value: 'high', label: t('taskManagement.priorities.high') },
 
])

const formData = reactive({
  recVouNumber: '',
  unit: '',
  blockDates: null,
  dueDate: '',
  description: '',
  category: '',
  priority: '',
  status: '',
  assignTo: '',
  roomStatus: '',
  reason: '',
})



// Validation
const validateForm = () => {
  errorMessage.value = ''
  
  if (!formData.unit) {
    errorMessage.value = t('PleaseSelectRoom')
    return false
  }
  
  if (!formData.description.trim()) {
    errorMessage.value = t('PleaseEnterDescription')
    return false
  }
  
  if (!formData.category) {
    errorMessage.value = t('PleaseSelectCategory')
    return false
  }
  
  if (!formData.priority) {
    errorMessage.value = t('PleaseSelectPriority')
    return false
  }
  
  if (!formData.assignTo) {
    errorMessage.value = t('PleaseAssignUser')
    return false
  }
   // Validate block dates if provided
   if (formData.blockDates) {
    // Assuming blockDates is an object like { from: Date, to: Date } or array [fromDate, toDate]
    let fromDate, toDate
    
    if (Array.isArray(formData.blockDates)) {
      fromDate = formData.blockDates[0]
      toDate = formData.blockDates[1]
    } else if (typeof formData.blockDates === 'object') {
      fromDate = formData.blockDates.from || formData.blockDates.start
      toDate = formData.blockDates.to || formData.blockDates.end
    }
    
    if (fromDate && toDate) {
      const from = new Date(fromDate)
      const to = new Date(toDate)
      
      if (from > to) {
        errorMessage.value = t('BlockFromDateMustBeBeforeToDate')
        return false
      }
    }
  }
  
  return true
}

// Initialize form data
const initializeForm = () => {
  if (isEditing.value && props.workOrderData) {
    // Pour l'édition, reconstruire l'objet blockDates pour InputDoubleDatePicker
    let blockDates = null
    if (props.workOrderData.block_from_date && props.workOrderData.block_to_date) {
      // Adapter selon le format attendu par votre InputDoubleDatePicker
      blockDates = {
        from: props.workOrderData.block_from_date,
        to: props.workOrderData.block_to_date
      }
      // Ou si c'est un array: blockDates = [props.workOrderData.block_from_date, props.workOrderData.block_to_date]
    }

    Object.assign(formData, {
      roomId: props.workOrderData.room_id || '',
      blockDates: blockDates,
      dueDateTime: props.workOrderData.due_date_time || '',
      description: props.workOrderData.description || '',
      category: props.workOrderData.category || '',
      priority: props.workOrderData.priority || '',
      status: props.workOrderData.status || '',
      assignTo: props.workOrderData.assigned_to || '',
      roomStatus: props.workOrderData.room_status || '',
      reason: props.workOrderData.reason || '',
    })
  } else {
    // Reset form for new work order
    Object.assign(formData, {
      roomId: '',
      blockDates: null,
      dueDateTime: '',
      description: '',
      category: '',
      priority: 'medium',
      status: '',
      assignTo: '',
      roomStatus: '',
      reason: '',
    })
  }
}


const closeModal = () => {
  errorMessage.value = ''
  emit('close')
}

const saveWorkOrder = async () => {
  if (!validateForm()) {
    return
  }

  isSaving.value = true
  errorMessage.value = ''

  try {

    let blockFromDate = null
    let blockToDate = null
    
    if (formData.blockDates) {
      if (Array.isArray(formData.blockDates)) {
        blockFromDate = formData.blockDates[0]
        blockToDate = formData.blockDates[1]
      } else if (typeof formData.blockDates === 'object') {
        blockFromDate = formData.blockDates.from || formData.blockDates.start
        blockToDate = formData.blockDates.to || formData.blockDates.end
      }
    }
    const workOrderData = {
      hotelId: serviceStore.serviceId,
      roomId: formData.unit,
      dueDateTime: formData.dueDate,
      blockFromDate:blockFromDate,
      blockToDate:blockToDate,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      assignedToUserId: formData.assignTo,
      roomStatus: formData.roomStatus,
      reason: formData.reason,
    }

    console.log("workOrderData",workOrderData)
    let response
    
    if (isEditing.value && props.workOrderData) {
      // Update existing work order
      response = await updateWorkOrder(props.workOrderData.id, workOrderData)
      toast.success(t('WorkOrderUpdatedSuccessfully'))
    } else {
      // Create new work order
      response = await createWorkOrder(workOrderData)
      toast.success(t('WorkOrderCreatedSuccessfully'))
    }

    emit('save', {
      isEditing: isEditing.value,
      data: response.data,
      success: true
    })
    
    closeModal()
  } catch (error: any) {
    console.error('Error saving work order:', error)
    
    if (error.response?.status === 422) {
      errorMessage.value = t('ValidationError')
    } else if (error.response?.status === 409) {
      errorMessage.value = t('ConflictError')
    } else {
      errorMessage.value = error.response?.data?.message || error.message || t('ErrorSavingWorkOrder')
    }
    
    toast.error(errorMessage.value)
  } finally {
    isSaving.value = false
  }
}

// Fetch users
const fetchUsers = async () => {
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) throw new Error('hotelId is not defined')
    
    const response = await getEmployeesForService(hotelId)
    Users.value = response.data.data.map((user: any) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    }))
  } catch (error) {
    console.error('Failed to fetch users:', error)
    toast.error(t('ErrorFetchingUsers'))
  }
}

// Fetch rooms
const fetchRooms = async () => {
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) throw new Error('hotelId is not defined')
    
    const response = await getRoomsByHotelId(hotelId)
    Rooms.value = response.data.data.data.map((room: any) => ({
      value: room.id,
      label: room.roomNumber,
    }))
  } catch (error) {
    console.error('Failed to fetch rooms:', error)
    toast.error(t('ErrorFetchingRooms'))
  }
}

// Watch for modal open/close and props changes
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      initializeForm()
      
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
  }
)

watch(
  () => props.workOrderData,
  () => {
    if (props.isOpen) {
      initializeForm()
    }
  }
)

onMounted(() => {
  fetchUsers()
  fetchRooms()
})
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
</style>