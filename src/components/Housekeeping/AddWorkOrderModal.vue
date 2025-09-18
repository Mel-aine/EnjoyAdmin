<template>
  <RightSideModal :is-open="isOpen" :title="modalTitle" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">
        {{ modalTitle }}
       
      </h3>
    </template>
    
    <div class="space-y-6">
      <!-- Order & Date Block -->
     <div class="grid md:grid-cols-1 grid-cols-1 gap-2">
        <!--  <div>
          <Input 
            v-model="formData.recVouNumber" 
            type="text" 
            :lb="$t('Order#')" 
            :disabled="!isEditing" 
          />
        </div> -->
        <div>
          <InputDoubleDatePicker :title="$t('Block')" v-model="formData.blockDates" />
        </div>
      </div>

      <!-- Folio -->
      <div>
        <Select 
          v-model="formData.unit" 
          :options="Rooms" 
          :isLoading="loading"
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
            :isLoading="loading"
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
import { ref, reactive, watch, computed, onMounted,nextTick } from 'vue'
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
  blockDates: null as any,
  dueDate: null as string | any,
  description: '',
  category: '',
  priority: '',
  status: '',
  assignTo: '',
  roomStatus: '',
  reason: '',
})

const modalTitle = computed(() => {
  return props.isEditing ? t('EditWorkOrder') : t('AddWorkOrder')
})

watch(
  () => formData.dueDate,
  (newVal, oldVal) => {
    console.log('🔍 formData.dueDate changed from:', oldVal, 'to:', newVal, 'type:', typeof newVal)
  },
  { deep: true }
)

//  la validation pour inclure dueDate
const validateForm = () => {
  errorMessage.value = ''
  
  console.log('🔍 Validating form - dueDate:', formData.dueDate)
  
  if (!formData.unit) {
    toast.error(t('PleaseSelectRoom')) 
    return false
  }
  
  // Validation obligatoire pour dueDate
  if (!formData.dueDate || formData.dueDate === '' || formData.dueDate === null) {
    toast.error(t('PleaseSelectDueDate')) 
    return false
  }
  
  if (!formData.description.trim()) {
    toast.error(t('PleaseEnterDescription')) 
    return false
  }
  
  if (!formData.category) {
    toast.error(t('PleaseSelectCategory')) 
    return false
  }
  
  if (!formData.priority) {
    toast.error(t('PleaseSelectPriority')) 
    return false
  }
  
  if (!formData.assignTo) {
    toast.error(t('PleaseAssignUser')) 
    return false
  }
  
  // Validation des dates de blocage
  if (formData.blockDates) {
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
        toast.error(t('BlockFromDateMustBeBeforeToDate')) 
        return false
      }
    }
  }
  
  return true
}

// 3. Modifiez initializeForm pour mieux gérer dueDate
const initializeForm = () => {
  console.log('🔍 Initializing form, isEditing:', isEditing.value, 'workOrderData:', props.workOrderData)

  if (props.isEditing && props.workOrderData) {
    // Bloc de dates
   
    let blockDates: { from: Date | null; to: Date | null } | null = null
    if (props.workOrderData.blockFromDate && props.workOrderData.blockToDate) {
      blockDates = {
        from: new Date(props.workOrderData.blockFromDate),
        to: new Date(props.workOrderData.blockToDate),
      }
    }

    // Due date
    let dueDate: string = ''
    if (props.workOrderData.dueDateTime) {
      const d = props.workOrderData.dueDateTime
      const dateObj = new Date(d)
      const date = dateObj.toISOString().split('T')[0]
      const time = dateObj.toTimeString().slice(0, 5)
      dueDate = `${date} ${time}` // format "YYYY-MM-DD HH:mm"
    }

    // Assigner toutes les valeurs au formData
    Object.assign(formData, {
      unit: props.workOrderData.roomId || '',
      blockDates: blockDates,
      dueDate: dueDate,
      description: props.workOrderData.description || '',
      category: props.workOrderData.category || '',
      priority: props.workOrderData.priority || '',
      status: props.workOrderData.status || '',
      assignTo: props.workOrderData.assignedToUserId || '',
      roomStatus: props.workOrderData.roomStatus || '',
      reason: props.workOrderData.reason || '',
    })
  } else {
    // Reset form pour nouvelle WorkOrder
    Object.assign(formData, {
      unit: '',
      blockDates: null,
      dueDate: '',
      description: '',
      category: '',
      priority: 'medium',
      status: 'assigned',
      assignTo: '',
      roomStatus: '',
      reason: '',
    })
  }

  console.log('🔍 Form initialized with:', formData)
}



const saveWorkOrder = async () => {
  console.log('🔍 SaveWorkOrder called - formData.dueDate:', formData.dueDate)
  
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

    // S'assurer que dueDateTime n'est pas vide
    let dueDateTime = formData.dueDate
    if (!dueDateTime || (typeof dueDateTime === 'string' && dueDateTime.trim() === '')) {
      dueDateTime = null
    }
    
    console.log('🔍 Final dueDateTime value:', dueDateTime)

    const workOrderData = {
      hotelId: serviceStore.serviceId,
      roomId: formData.unit,
      dueDateTime: dueDateTime,
      blockFromDate: blockFromDate,
      blockToDate: blockToDate,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      assignedToUserId: formData.assignTo,
      roomStatus: formData.roomStatus || null,
      reason: formData.reason || null,
    }

    console.log("🔍 Final workOrderData:", workOrderData)
    
    let response
    
    if (isEditing.value && props.workOrderData) {
      response = await updateWorkOrder(props.workOrderData.id, workOrderData)
      toast.success(t('WorkOrderUpdatedSuccessfully'))
    } else {
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






const closeModal = () => {
  errorMessage.value = ''
  emit('close')
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
    loading.value=true
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
  }finally{
    loading.value=false
  }
}



watch(
  [() => props.isOpen, () => props.workOrderData],
  ([isOpen, workOrderData]) => {
    if (isOpen && workOrderData) {
      nextTick(() => {
        console.log('🔍 Modal opened and workOrderData ready')
        initializeForm()
      })
    }
  },
  { immediate: true, deep: true }
)


watch(() => props.workOrderData, () => {
  if (props.isOpen) {
    nextTick(() => {
      initializeForm()
    })
  }
}, { deep: true })

onMounted(async() => {
  await fetchUsers()
  await fetchRooms()
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