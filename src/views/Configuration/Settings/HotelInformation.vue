<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Hotel Information</h1>
          <p class="text-gray-600 mt-1">
            Enter all the details related to your hotel here. These details will be used to print on various folios and invoices.
          </p>
        </div>
        <BasicButton variant="primary" icon="Save" label="Save Changes" @click="saveHotelInfo" />
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <form @submit.prevent="saveHotelInfo" class="space-y-8">
            <!-- General Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">General Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name *
                  </label>
                  <Input
                    v-model="hotelInfo.name"
                    placeholder="Enter hotel name"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    v-model="hotelInfo.email"
                    type="email"
                    placeholder="Enter hotel email"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <Input
                    v-model="hotelInfo.phone"
                    type="phone"
                    placeholder="Enter hotel phone"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Fax
                  </label>
                  <Input
                    v-model="hotelInfo.fax"
                    placeholder="Enter fax number"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <Input
                    v-model="hotelInfo.website"
                    placeholder="Enter hotel website"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <Select
                    v-model="hotelInfo.country"
                    :options="countryOptions"
                    placeholder="Select country"
                    required
                  />
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Address 1 *
                </label>
                <Input
                  v-model="hotelInfo.address1"
                  placeholder="Enter primary address"
                  required
                />
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Address 2
                </label>
                <Input
                  v-model="hotelInfo.address2"
                  placeholder="Enter secondary address (optional)"
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Input
                    v-model="hotelInfo.city"
                    placeholder="Enter city"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                  </label>
                  <Input
                    v-model="hotelInfo.state"
                    placeholder="Enter state/province"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code *
                  </label>
                  <Input
                    v-model="hotelInfo.zipCode"
                    placeholder="Enter ZIP/postal code"
                    required
                  />
                </div>
              </div>
            </div>
            
            <!-- Property Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <Select
                    v-model="hotelInfo.propertyType"
                    :options="propertyTypeOptions"
                    placeholder="Select property type"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Grade/Rating
                  </label>
                  <Select
                    v-model="hotelInfo.grade"
                    :options="gradeOptions"
                    placeholder="Select grade/rating"
                  />
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Logo
                </label>
                <div class="flex items-center space-x-4">
                  <button
                    type="button"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    @click="selectLogo"
                  >
                    Choose File
                  </button>
                  <span class="text-sm text-gray-500">
                    {{ hotelInfo.logoFileName || 'No file selected' }}
                  </span>
                  <button
                    v-if="hotelInfo.logoFileName"
                    type="button"
                    class="text-red-600 hover:text-red-800 text-sm"
                    @click="removeLogo"
                  >
                    Remove
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Upload your hotel logo (PNG, JPG, SVG - Max 2MB)
                </p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Registration No. 1
                  </label>
                  <Input
                    v-model="hotelInfo.regNo1"
                    placeholder="Enter registration number 1"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Registration No. 2
                  </label>
                  <Input
                    v-model="hotelInfo.regNo2"
                    placeholder="Enter registration number 2"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Registration No. 3
                  </label>
                  <Input
                    v-model="hotelInfo.regNo3"
                    placeholder="Enter registration number 3"
                  />
                </div>
              </div>
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
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import Select from '../../../components/forms/FormElements/Select.vue'

const hotelInfo = ref({
  name: 'Royal Hotel',
  email: 'amar@ezeetechnosys.com',
  phone: '91-866-606-6295',
  fax: '91-866-606-6295',
  website: 'http://live.ipms247.com/royalhotel',
  country: 'India',
  address1: 'D 113, International trade centre,',
  address2: 'Surat',
  city: 'Surat',
  state: 'Gujarat',
  zipCode: '395003',
  propertyType: 'Hotel and Resort',
  grade: '5 stars & above',
  logoFileName: '',
  regNo1: '',
  regNo2: '',
  regNo3: ''
})

const countryOptions = [
  { label: 'India', value: 'India' },
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'Japan', value: 'Japan' },
  { label: 'China', value: 'China' },
  { label: 'Other', value: 'Other' }
]

const propertyTypeOptions = [
  { label: 'Hotel and Resort', value: 'Hotel and Resort' },
  { label: 'Hotel', value: 'Hotel' },
  { label: 'Resort', value: 'Resort' },
  { label: 'Motel', value: 'Motel' },
  { label: 'Inn', value: 'Inn' },
  { label: 'Lodge', value: 'Lodge' },
  { label: 'Boutique Hotel', value: 'Boutique Hotel' },
  { label: 'Business Hotel', value: 'Business Hotel' },
  { label: 'Extended Stay', value: 'Extended Stay' },
  { label: 'Bed & Breakfast', value: 'Bed & Breakfast' }
]

const gradeOptions = [
  { label: '5 stars & above', value: '5 stars & above' },
  { label: '4 stars', value: '4 stars' },
  { label: '3 stars', value: '3 stars' },
  { label: '2 stars', value: '2 stars' },
  { label: '1 star', value: '1 star' },
  { label: 'Unrated', value: 'Unrated' }
]

const selectLogo = () => {
  // TODO: Implement file selection
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      hotelInfo.value.logoFileName = file.name
    }
  }
  input.click()
}

const removeLogo = () => {
  hotelInfo.value.logoFileName = ''
}

const saveHotelInfo = () => {
  // TODO: Implement save functionality
  console.log('Save hotel information:', hotelInfo.value)
  alert('Hotel information saved successfully!')
}
</script>