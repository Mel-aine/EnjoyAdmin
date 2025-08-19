<template>
  <RightSideModal :is-open="isOpen" :title="$t('AddWorkOrder')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('AddWorkOrder') }}</h3>
    </template>
    <!-- Form -->

    <div class="space-y-6">
      <!-- Order & Date Block -->
      <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
        <div>
          <Input v-model="formData.recVouNumber" type="text" :lb="$t('Order#')" :disabled="true"/>
        </div>
        <div>
          <InputDoubleDatePicker v-model="formData.blockDates" :title="$t('Block')" />
        </div>
      </div>

      <!-- Folio -->
      <div>
        <Select v-model="formData.unit" :options="foliosOptions" :lb="$t('Unit/Room')" />
      </div>

      <!-- Due Date -->
      <div>
        <InputDateTimePicker v-model="formData.dueDate" :title="$t('Duedate')" />
      </div>

      <!-- Description -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {{ $t('Description') }}
        </label>
        <textarea v-model="formData.description" :placeholder="$t('Largetext')" rows="6"
          class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"></textarea>
      </div>

      <!-- Category / Priority / Status -->
      <div class="grid md:grid-cols-3 grid-cols-1 gap-2">
        <div>
          <Select v-model="formData.category" :options="chargeOptions" :lb="$t('Category')" />
        </div>
        <div>
          <Select v-model="formData.priority" :options="chargeOptions" :lb="$t('Priority')" />
        </div>
        <div>
          <Select v-model="formData.status" :options="chargeOptions" :lb="$t('Status')" />
        </div>
      </div>

      <!-- AssignTo / Room Status -->
      <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
        <div>
          <Select v-model="formData.assignTo" :options="chargeOptions" :lb="$t('AssignTo')" />
        </div>
        <div>
          <Select v-model="formData.roomStatus" :options="chargeOptions" :lb="$t('configuration.housekeeping.roomStatus')" />
        </div>
      </div>

      <!-- Reason -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {{ $t('Reason') }}
        </label>
        <textarea v-model="formData.reason" :placeholder="$t('Largetext')" rows="6"
          class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"></textarea>
      </div>
    </div>


    <template #footer>

      <div class="flex justify-end gap-4">
        <BasicButton variant="outline" @click="closeModal" :label="$t('Cancel')"></BasicButton>
        <BasicButton variant="primary" @click="saveCharge" :label="$t('Save')"></BasicButton>
      </div>
    </template>
  </RightSideModal>

</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X, Calendar, ChevronDown } from 'lucide-vue-next'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue'
import InputDateTimePicker from '../forms/FormElements/InputDateTimePicker.vue'
import InputDoubleDatePicker from '../forms/FormElements/InputDoubleDatePicker.vue'
import Select from '../forms/FormElements/Select.vue'
import Input from '../forms/FormElements/Input.vue'


interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const foliosOptions = ref([{ value: '', label: '-select-' }])
const chargeOptions = ref([{ value: '', label: '-select-' }])


const formData = reactive({
  recVouNumber: '',
  unit: '',
  blockDates: [],
  dueDate: '',
  description: '',
  category: '',
  priority: '',
  status: '',
  assignTo: '',
  roomStatus: '',
  reason: '',
})


const closeModal = () => {
  emit('close')
}

const saveCharge = () => {
  // Validate required fields
  if (!formData.category || !formData.priority) {
    alert('Please fill in all required fields')
    return
  }

  // Emit the form data
  emit('save', { ...formData })
  closeModal()
}

// Close modal on escape key
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
/* Custom styles for the modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
