<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Notices</h1>
          <p class="text-gray-600 mt-1">
            This page allows you to write notices which will be used on different paper handouts in hotel.
          </p>
        </div>
        <BasicButton variant="primary" icon="Save" label="Save Changes" @click="saveNotices" />
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Bill to Company -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bill to Company
                </label>
                <textarea
                  v-model="notices.billToCompany"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Bill to Company notice..."
                ></textarea>
              </div>
              
              <!-- Folio -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Folio
                </label>
                <textarea
                  v-model="notices.folio"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Folio notice..."
                ></textarea>
              </div>
              
              <!-- New Configuration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  New Configuration
                </label>
                <textarea
                  v-model="notices.newConfiguration"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter New Configuration notice..."
                ></textarea>
              </div>
              
              <!-- Registration Card -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Registration Card
                </label>
                <textarea
                  v-model="notices.registrationCard"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Registration Card notice..."
                ></textarea>
              </div>
              
              <!-- T&C (Terms and Condition) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  T&C (Terms and Condition)
                </label>
                <textarea
                  v-model="notices.termsAndConditions"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Terms and Conditions notice..."
                ></textarea>
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Cancellation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation
                </label>
                <textarea
                  v-model="notices.cancellation"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Cancellation notice..."
                ></textarea>
              </div>
              
              <!-- Group Reservation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Group Reservation
                </label>
                <textarea
                  v-model="notices.groupReservation"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Group Reservation notice..."
                ></textarea>
              </div>
              
              <!-- Receipt -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Receipt
                </label>
                <textarea
                  v-model="notices.receipt"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Receipt notice..."
                ></textarea>
              </div>
              
              <!-- Reservation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Reservation
                </label>
                <textarea
                  v-model="notices.reservation"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Reservation notice..."
                ></textarea>
              </div>
              
              <!-- Voucher -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Voucher
                </label>
                <textarea
                  v-model="notices.voucher"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter Voucher notice..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'

const notices = ref({
  billToCompany: 'Bill To Comp NOTICE\nBill To Comp NOTICE',
  folio: 'Folio NOTICE\nFolio NOTICE',
  newConfiguration: 'This is a new configuration\nThis is a new configuration',
  registrationCard: 'Reg. Card NOTICE\nReg. Card NOTICE',
  termsAndConditions: 'Terms and conditions\nTerms and condition',
  cancellation: 'Cancellation NOTICE\nCancellation NOTICE',
  groupReservation: 'Group Reservation NOTICE\nGroup Reservation NOTICE',
  receipt: 'Receipt NOTICE\nReceipt NOTICE',
  reservation: 'Reservation NOTICE\nReservation NOTICE',
  voucher: 'Voucher NOTICE\nVoucher NOTICE'
})

const saveNotices = () => {
  // TODO: Implement save functionality
  console.log('Save notices configuration:', notices.value)
  alert('Notices configuration saved successfully!')
}
</script>
