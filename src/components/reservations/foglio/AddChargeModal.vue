<template>
  <RightSideModal :is-open="isOpen">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">Add Charge</h3>
    </template>
    <!-- Form -->
     <div class="px-2 space-y-4">
        <!-- Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <div class="relative">
            <input 
              v-model="formData.date" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar class="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <!-- Folio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Folio</label>
          <select 
            v-model="formData.folio" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Folio</option>
            <option value="145 - Mr. Bob Baker">145 - Mr. Bob Baker</option>
            <option value="146 - Ms. Jane Smith">146 - Ms. Jane Smith</option>
          </select>
          <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        
        <!-- Rec/Vou # -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rec/Vou #</label>
          <input 
            v-model="formData.recVouNumber" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter receipt/voucher number"
          />
        </div>
        
        <!-- Charge -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Charge</label>
          <select 
            v-model="formData.charge" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-Select-</option>
            <option value="room_charges">Room Charges</option>
            <option value="food_beverage">Food & Beverage</option>
            <option value="laundry">Laundry</option>
            <option value="telephone">Telephone</option>
            <option value="minibar">Minibar</option>
            <option value="spa">Spa Services</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <!-- Add as Inclusion -->
        <div class="flex items-center">
          <input 
            v-model="formData.addAsInclusion" 
            type="checkbox" 
            id="addAsInclusion" 
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="addAsInclusion" class="ml-2 text-sm text-gray-700">Add as Inclusion</label>
        </div>
        
        <!-- Quantity -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Qty</label>
          <input 
            v-model="formData.quantity" 
            type="number" 
            min="1" 
            class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <!-- Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div class="flex space-x-2">
            <div class="flex-1">
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-gray-500">Rs.</span>
                <input 
                  v-model="formData.amount" 
                  type="number" 
                  step="0.01" 
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div class="flex-1">
              <input 
                v-model="formData.amountSecondary" 
                type="number" 
                step="0.01" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        
        <!-- Discount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Discount</label>
          <select 
            v-model="formData.discount" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-Select-</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
          </select>
        </div>
        
        <!-- Comment -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Comment</label>
          <textarea 
            v-model="formData.comment" 
            rows="3" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Enter any additional comments..."
          ></textarea>
        </div>
      </div>
      
    <template #footer>
      <div class="flex justify-end ">
        <BasicButton type="primary" @click="saveCharge" label="save"></BasicButton>
      </div>
    </template>
  </RightSideModal>

</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X, Calendar, ChevronDown } from 'lucide-vue-next'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = reactive({
  date: new Date().toISOString().split('T')[0],
  folio: '145 - Mr. Bob Baker',
  recVouNumber: '',
  charge: '',
  addAsInclusion: false,
  quantity: 1,
  amount: '',
  amountSecondary: '',
  discount: '',
  comment: ''
})

const closeModal = () => {
  emit('close')
}

const saveCharge = () => {
  // Validate required fields
  if (!formData.charge || !formData.amount) {
    alert('Please fill in all required fields')
    return
  }
  
  // Emit the form data
  emit('save', { ...formData })
  
  // Reset form
  Object.assign(formData, {
    date: new Date().toISOString().split('T')[0],
    folio: '145 - Mr. Bob Baker',
    recVouNumber: '',
    charge: '',
    addAsInclusion: false,
    quantity: 1,
    amount: '',
    amountSecondary: '',
    discount: '',
    comment: ''
  })
  
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
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>