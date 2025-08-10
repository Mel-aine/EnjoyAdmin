<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Hotel Information</h1>
        <BasicButton variant="primary" @click="saveHotelInfo">
          <Save class="w-4 h-4 mr-2" />
          Save Changes
        </BasicButton>
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <form @submit.prevent="saveHotelInfo" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="hotelName" class="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name
                </label>
                <input
                  id="hotelName"
                  v-model="hotelInfo.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter hotel name"
                />
              </div>
              
              <div>
                <label for="hotelEmail" class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="hotelEmail"
                  v-model="hotelInfo.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter hotel email"
                />
              </div>
              
              <div>
                <label for="hotelPhone" class="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  id="hotelPhone"
                  v-model="hotelInfo.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter hotel phone"
                />
              </div>
              
              <div>
                <label for="hotelWebsite" class="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  id="hotelWebsite"
                  v-model="hotelInfo.website"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter hotel website"
                />
              </div>
            </div>
            
            <div>
              <label for="hotelAddress" class="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="hotelAddress"
                v-model="hotelInfo.address"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter hotel address"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="hotelCity" class="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  id="hotelCity"
                  v-model="hotelInfo.city"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label for="hotelState" class="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  id="hotelState"
                  v-model="hotelInfo.state"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter state/province"
                />
              </div>
              
              <div>
                <label for="hotelZip" class="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  id="hotelZip"
                  v-model="hotelInfo.zipCode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter ZIP/postal code"
                />
              </div>
            </div>
            
            <div>
              <label for="hotelDescription" class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="hotelDescription"
                v-model="hotelInfo.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter hotel description"
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/ui/BasicButton.vue'
import { Save } from 'lucide-vue-next'

const hotelInfo = ref({
  name: 'Grand Hotel & Resort',
  email: 'info@grandhotel.com',
  phone: '+1-555-0100',
  website: 'https://www.grandhotel.com',
  address: '123 Luxury Avenue',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  description: 'A luxury hotel offering world-class amenities and exceptional service in the heart of the city.'
})

const saveHotelInfo = () => {
  // TODO: Implement save functionality
  console.log('Save hotel information:', hotelInfo.value)
  // Show success message
}
</script>