<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('roomOwner') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('roomOwnerDescription') }}
        </p>
      </div>

      <!-- Room Owners Table using ReusableTable -->
      <ReusableTable
        :title="t('roomOwnersTitle')"
        :columns="columns"
        :data="roomOwners"
        :actions="actions"
        :search-placeholder="t('searchRoomOwners')"
        :selectable="true"
        :empty-state-title="t('noRoomOwnersFound')"
        :empty-state-message="t('noRoomOwnersMessage')"
        :loading="loading"
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            :label="t('addRoomOwner')"
            :icon="Plus"
          > 
          </BasicButton>
          
          <BasicButton 
            v-if="selectedOwners.length > 0"
            @click="deleteSelected"
            :label="t('deleteSelected')"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <!-- Custom column for owner info -->
        <template #column-ownerInfo="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
            <div class="text-xs text-gray-500">{{ item.businessName || t('noBusinessName') }}</div>
          </div>
        </template>

        <!-- Custom column for contact info -->
        <template #column-contactInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.email }}</div>
            <div class="text-xs text-gray-500">{{ item.phone }}</div>
          </div>
        </template>

        <!-- Custom column for commission info -->
        <template #column-commissionInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.commissionPlan }}</div>
            <div class="text-xs text-gray-500">{{ item.commissionValue }}</div>
          </div>
        </template>

        <!-- Custom column for balance -->
        <template #column-balance="{ item }">
          <div class="text-sm font-medium" :class="item.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'">
            ${{ Math.abs(item.openingBalance).toFixed(2) }}
          </div>
        </template>

        <!-- Custom column for room count -->
        <template #column-roomCount="{ item }">
          <div class="text-sm text-gray-900">
            {{ item.roomIds.length }} {{ item.roomIds.length === 1 ? t('room') : t('rooms') }}
          </div>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdBy }}</div>
            <div class="text-xs text-gray-400">{{ item.createdDate }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifiedBy }}</div>
            <div class="text-xs text-gray-400">{{ item.modifiedDate }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ showAddModal ? t('addRoomOwner') : t('editRoomOwner') }}
            </h3>
          
          <form @submit.prevent="saveRoomOwner" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input 
                  v-model="formData.name" 
                  :lb="t('Name')"
                  inputType="text"
                  :isRequired="true"
                  :placeholder="t('enterOwnerName')"
                />
              </div>

              <div>
                <Input 
                  v-model="formData.businessName" 
                  :lb="t('businessName')"
                  inputType="text"
                  :isRequired="false"
                  :placeholder="t('enterBusinessName')"
                />
              </div>
            </div>

            <!-- Address Information -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">{{ t('addressInformation') }}</h4>
              
              <div>
                  <Input 
                    v-model="formData.address" 
                    :lb="t('Address')"
                    inputType="text"
                    :isRequired="true"
                    :placeholder="t('enterAddress')"
                  />
                </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <InputCountries 
                    v-model="formData.country" 
                    :isRequired="true"
                  />
                </div>
                
                <div>
                  <Input 
                    v-model="formData.state" 
                    :lb="t('State')"
                    inputType="text"
                    :isRequired="true"
                    :placeholder="t('enterState')"
                  />
                </div>
                
                <div>
                  <Input 
                    v-model="formData.city" 
                    :lb="t('City')"
                    inputType="text"
                    :isRequired="true"
                    :placeholder="t('enterCity')"
                  />
                </div>
              </div>
              
              <div>
                <Input 
                    v-model="formData.zipCode" 
                    :lb="t('ZipCode')"
                    inputType="text"
                    :isRequired="true"
                    :placeholder="t('enterZipCode')"
                  />
              </div>
            </div>

            <!-- Contact Information -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">{{ t('contactInformation') }}</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <InputPhone 
                    v-model="formData.phone" 
                    :title="t('phone')"
                    :isRequired="true"
                  />
                </div>
                
                <div>
                  <Input 
                    v-model="formData.fax" 
                    :lb="t('Fax')"
                    inputType="text"
                    :isRequired="false"
                    :placeholder="t('enterFax')"
                  />
                </div>
                
                <div>
                  <InputPhone 
                    v-model="formData.mobile" 
                    :title="t('mobile')"
                    :isRequired="true"
                  />
                </div>
              </div>
              
              <div>
                <InputEmail 
                  v-model="formData.email" 
                  :title="t('email')"
                  :isRequired="true"
                  :placeholder="t('emailAddress')"
                />
              </div>
            </div>

            <!-- Commission & Rate Information -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">{{ t('commissionRateInformation') }}</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select 
                    v-model="formData.commissionPlan" 
                    :lb="t('commissionPlan')"
                    :isRequired="true"
                    :options="[
                      { label: t('percentageOnAllNights'), value: '% on all nights' },
                      { label: t('fixedAmountPerNight'), value: 'Fixed amount per night' },
                      { label: t('fixedAmountPerStay'), value: 'Fixed amount per stay' }
                    ]"
                    :defaultValue="t('selectCommissionPlan')"
                  />
                </div>
                
                <div>
                  <Input 
                    v-model="formData.commissionValue" 
                    :lb="t('commissionValue')"
                    inputType="number"
                    :isRequired="true"
                    :placeholder="t('enterCommissionValue')"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select 
                    v-model="formData.rate" 
                    :lb="t('rate')"
                    :isRequired="true"
                    :options="[
                      { label: t('regular'), value: 'Regular' },
                      { label: t('special'), value: 'Special' },
                      { label: t('allocated'), value: 'Allocated' }
                    ]"
                    :defaultValue="t('selectRate')"
                  />
                </div>
                
                <div>
                  <Select 
                    v-model="formData.roomInventory" 
                    :lb="t('roomInventory')"
                    :isRequired="true"
                    :options="[
                      { label: t('regular'), value: 'Regular' },
                      { label: t('allocated'), value: 'Allocated' }
                    ]"
                    :defaultValue="t('selectInventoryType')"
                  />
                </div>
              </div>
              
              <div>
                <Input 
                  v-model="formData.openingBalance" 
                  :lb="t('openingBalance')"
                  inputType="number"
                  :isRequired="true"
                  :placeholder="t('enterOpeningBalance')"
                />
              </div>
            </div>

            <!-- User Creation -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">{{ t('userAccess') }}</h4>
              
              <div class="flex items-center space-x-2">
                <input 
                  v-model="formData.createUser"
                  type="checkbox" 
                  id="createUser"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
                <label for="createUser" class="text-sm text-gray-700">
                  {{ t('createUserDescription') }}
                </label>
              </div>
            </div>

            <!-- Room Assignment -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">{{ t('roomAssignment') }}</h4>
              <p class="text-sm text-gray-600">{{ t('roomAssignmentDescription') }}</p>
              
              <div class="border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div v-for="room in availableRooms" :key="room.id" class="flex items-center space-x-2">
                    <input 
                      v-model="formData.roomIds"
                      :value="room.id"
                      type="checkbox" 
                      :id="`room-${room.id}`"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <label :for="`room-${room.id}`" class="text-sm text-gray-700">
                      {{ room.name }} ({{ room.type }})
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal" 
                :label="t('cancel')" 
                :disabled="isLoading"
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :label="isLoading ? t('saving') + '...' : showEditModal ? t('updateRoomOwner') : t('addRoomOwner')"
                :loading="isLoading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Trash2, Edit, Trash, User } from 'lucide-vue-next'
import { getRoomOwners, postRoomOwner, updateRoomOwnerById, deleteRoomOwnerById, getRooms } from '../../../services/configrationApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import InputCountries from '../../../components/forms/FormElements/InputCountries.vue'
import InputPhone from '../../../components/forms/FormElements/InputPhone.vue'
import InputEmail from '../../../components/forms/FormElements/InputEmail.vue'
import Select from '../../../components/forms/FormElements/Select.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import { useServiceStore } from '../../../composables/serviceStore'

// TypeScript interfaces
interface Room {
  id: number
  name: string
  type: string
}

interface RoomOwner {
  id?: number
  name: string
  businessName: string
  address: string
  country: string
  state: string
  city: string
  zipCode: string
  phone: string
  fax: string
  mobile: string
  email: string
  commissionPlan: string
  commissionValue: string | number
  rate: string
  roomInventory: string
  openingBalance: number
  createUser: boolean
  roomIds: number[]
}

interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  searchable?: boolean
}

const { t } = useI18n()
const serviceStore = useServiceStore()
const toast = useToast()

// Reactive data
const showAddModal = ref<boolean>(false)
const showEditModal = ref<boolean>(false)
const selectedOwners = ref<RoomOwner[]>([])
const editingOwner = ref<RoomOwner | null>(null)
const isLoading = ref<boolean>(false)
const loading = ref<boolean>(false)

// Form data
const formData = ref<RoomOwner>({
  name: '',
  businessName: '',
  address: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  phone: '',
  fax: '',
  mobile: '',
  email: '',
  commissionPlan: '',
  commissionValue: '',
  rate: '',
  roomInventory: '',
  openingBalance: 0,
  createUser: false,
  roomIds: []
})

// Available options
// Country list is now handled by InputCountries component

const availableRooms = ref<Room[]>([
])

// Table configuration
const columns = ref<TableColumn[]>([
  {
    key: 'ownerInfo',
    label: t('ownerName'),
    sortable: true,
    searchable: true
  },
  {
    key: 'contactInfo',
    label: t('contactInfo'),
    sortable: true
  },
  {
    key: 'address',
    label: t('location'),
    sortable: true,
    searchable: true
  },
  {
    key: 'commissionInfo',
    label: t('commission'),
    sortable: true
  },
  {
    key: 'rate',
    label: t('rate'),
    sortable: true
  },
  {
    key: 'roomInventory',
    label: t('inventory'),
    sortable: true
  },
  {
    key: 'balance',
    label: t('balance'),
    sortable: true
  },
  {
    key: 'roomCount',
    label: t('rooms'),
    sortable: true
  },
  {
    key: 'status',
    label: t('status'),
    sortable: true
  },
  {
    key: 'createdInfo',
    label: t('createdBy'),
    sortable: false
  },
  {
    key: 'modifiedInfo',
    label: t('modifiedBy'),
    sortable: false
  }
])

// Data
const roomOwners = ref<RoomOwner[]>([])

// Methods
const editRoomOwner = (owner: RoomOwner): void => {
  editingOwner.value = owner
  formData.value = { ...owner }
  showEditModal.value = true
}

const deleteRoomOwner = async (owner: RoomOwner): Promise<void> => {
  if (confirm(`Are you sure you want to delete room owner "${owner.name}"?`)) {
    try {
      const resp = await deleteRoomOwnerById(owner.id!)
      if (resp.status === 200 || resp.status === 204) {
        toast.success('Room owner deleted successfully')
        loadData()
      } else {
        toast.error('Failed to delete room owner')
      }
    } catch (error) {
      console.error('Error deleting room owner:', error)
      toast.error('Error deleting room owner')
    }
  }
}

// Actions configuration
const actions = ref([
  {
    label: 'Edit',
    handler: editRoomOwner,
    icon: Edit
  },
  {
    label: 'Delete',
    handler: deleteRoomOwner,
    icon: Trash,
    variant: 'danger'
  }
])

const onAction = (action:string, item:any) => {
  if (action === 'edit') {
    editRoomOwner(item)
  } else if (action === 'delete') {
    deleteRoomOwner(item)
  }
}

const onSelectionChange = (selected:any) => {
  selectedOwners.value = selected
}

const deleteSelected = async (): Promise<void> => {
  if (confirm(`Are you sure you want to delete ${selectedOwners.value.length} selected room owner(s)?`)) {
    try {
      const deletePromises = selectedOwners.value.map(owner => deleteRoomOwnerById(owner.id!))
      await Promise.all(deletePromises)
      toast.success('Selected room owners deleted successfully')
      selectedOwners.value = []
      loadData()
    } catch (error) {
      console.error('Error deleting selected room owners:', error)
      toast.error('Error deleting selected room owners')
    }
  }
}

const saveRoomOwner = async (): Promise<void> => {
  isLoading.value = true
  try {
    if (showEditModal.value && editingOwner.value) {
      // Update existing room owner
      const updatedOwner = {
        ...formData.value,
        hotelId: serviceStore.serviceId
      }
      const resp = await updateRoomOwnerById(editingOwner.value.id!, updatedOwner)
      if (resp.status === 200 || resp.status === 201) {
        toast.success('Room owner updated successfully')
        loadData()
        closeModal()
      } else {
        toast.error('Failed to update room owner')
      }
    } else {
      // Add new room owner
      const newOwner = {
        ...formData.value,
        hotelId: serviceStore.serviceId,
        status: 'Active'
      }
      const resp = await postRoomOwner(newOwner)
      if (resp.status === 200 || resp.status === 201) {
        toast.success('Room owner created successfully')
        loadData()
        closeModal()
      } else {
        toast.error('Failed to create room owner')
      }
    }
  } catch (error) {
    console.error('Error saving room owner:', error)
    toast.error('Error saving room owner')
  } finally {
    isLoading.value = false
  }
}

const loadData = async (): Promise<void> => {
  loading.value = true
  try {
    const resp = await getRoomOwners()
    console.log('Room owners data:', resp)
    roomOwners.value = resp.data.data?.data || resp.data.data || resp.data || []
  } catch (error) {
    console.error('Error loading room owners:', error)
    toast.error('Error loading room owners')
  } finally {
    loading.value = false
  }
}

const loadRooms = async (): Promise<void> => {
  try {
    const resp = await getRooms()
    console.log('Available rooms data:', resp)
    availableRooms.value = resp.data.data?.data || resp.data.data || resp.data || []
  } catch (error) {
    console.error('Error loading rooms:', error)
    toast.error(t('errorLoadingRooms'))
  }
}

const closeModal = (): void => {
  showAddModal.value = false
  showEditModal.value = false
  editingOwner.value = null
  
  // Reset form
  formData.value = {
    name: '',
    businessName: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    phone: '',
    fax: '',
    mobile: '',
    email: '',
    commissionPlan: '',
    commissionValue: '',
    rate: '',
    roomInventory: '',
    openingBalance: 0,
    createUser: false,
    roomIds: []
  }
}

// Load data on component mount
loadData()
loadRooms()
</script>
