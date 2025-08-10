<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Season</h1>
        <p class="text-gray-600 mt-1">
          Define the season so as to define rates to be charged during that season. Configure seasonal periods with start/end dates and activation periods.
        </p>
      </div>

      <!-- Seasons Table using ReusableTable -->
      <ReusableTable
        title="Seasons List"
        :columns="columns"
        :data="seasons"
        :actions="actions"
        search-placeholder="Search seasons..."
        :selectable="true"
        empty-state-title="No seasons found"
        empty-state-message="Click 'Add Season' to create your first season."
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Season"
            :icon="Plus"
          > 
          </BasicButton>
          
          <BasicButton 
            v-if="selectedSeasons.length > 0"
            @click="deleteSelected"
            label="Delete Selected"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <!-- Custom column for period info -->
        <template #column-periodInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.fromDay }}-{{ item.fromMonth }} to {{ item.toDay }}-{{ item.toMonth }}</div>
            <div class="text-xs text-gray-500">{{ item.startDate }} - {{ item.expireDate }}</div>
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
        <div class="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? 'Add Season' : 'Edit Season' }}
          </h3>
          
          <form @submit.prevent="saveSeason" class="space-y-4">
            <!-- Short Code -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Short Code *
              </label>
              <Input 
                v-model="formData.shortCode"
                placeholder="Enter the short name or code for the season"
                required
              />
            </div>

            <!-- Season Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Season Name *
              </label>
              <Input 
                v-model="formData.seasonName"
                placeholder="Enter the name of the season"
                required
              />
            </div>

            <!-- From Day/Date and From Month -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  From Day/Date *
                </label>
                <Select 
                  v-model="formData.fromDay"
                  :options="dayOptions"
                  placeholder="Select day"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  From Month *
                </label>
                <Select 
                  v-model="formData.fromMonth"
                  :options="monthOptions"
                  placeholder="Select month"
                  required
                />
              </div>
            </div>

            <!-- To Day/Date and To Month -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  To Day/Date *
                </label>
                <Select 
                  v-model="formData.toDay"
                  :options="dayOptions"
                  placeholder="Select day"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  To Month *
                </label>
                <Select 
                  v-model="formData.toMonth"
                  :options="monthOptions"
                  placeholder="Select month"
                  required
                />
              </div>
            </div>

            <!-- Start Date and Expire Date -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <InputDatePicker 
                  v-model="formData.startDate"
                  placeholder="Enter the date from when the season settings will be activated"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Expire Date *
                </label>
                <InputDatePicker 
                  v-model="formData.expireDate"
                  placeholder="Enter the date on which the season settings will expired"
                  required
                />
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select 
                v-model="formData.status"
                :options="statusOptions"
                placeholder="Select status"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ showAddModal ? 'Add Season' : 'Update Season' }}
              </button>
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
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import { Plus, Edit, Trash, Trash2 } from 'lucide-vue-next'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingSeason = ref(null)
const selectedSeasons = ref([])

// Form data
const formData = ref({
  shortCode: '',
  seasonName: '',
  fromDay: '',
  fromMonth: '',
  toDay: '',
  toMonth: '',
  startDate: '',
  expireDate: '',
  status: 'Active'
})

// Table columns
const columns = ref([
  {
    key: 'shortCode',
    label: 'Short Code',
    sortable: true
  },
  {
    key: 'seasonName',
    label: 'Season Name',
    sortable: true
  },
  {
    key: 'periodInfo',
    label: 'Period Info',
    sortable: false
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true
  },
  {
    key: 'createdInfo',
    label: 'Created By',
    sortable: false
  },
  {
    key: 'modifiedInfo',
    label: 'Modified By',
    sortable: false
  }
])

// Sample data
const seasons = ref([
  {
    id: 1,
    shortCode: 'SUMMER',
    seasonName: 'Summer Season',
    fromDay: '1',
    fromMonth: 'June',
    toDay: '31',
    toMonth: 'August',
    startDate: '2024-06-01',
    expireDate: '2024-08-31',
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-15 10:30 AM',
    modifiedBy: 'Manager',
    modifiedDate: '2024-01-20 02:15 PM'
  },
  {
    id: 2,
    shortCode: 'WINTER',
    seasonName: 'Winter Season',
    fromDay: '1',
    fromMonth: 'December',
    toDay: '28',
    toMonth: 'February',
    startDate: '2024-12-01',
    expireDate: '2025-02-28',
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-18 09:15 AM',
    modifiedBy: 'Admin',
    modifiedDate: '2024-01-18 09:15 AM'
  }
])

// Options for dropdowns
const dayOptions = ref(
  Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1)
  }))
)

const monthOptions = ref([
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' }
])

const statusOptions = ref([
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
])

// Methods
const editSeason = (season) => {
  editingSeason.value = season
  formData.value = { ...season }
  showEditModal.value = true
}

const deleteSeason = (season) => {
  if (confirm(`Are you sure you want to delete season "${season.seasonName}"?`)) {
    const index = seasons.value.findIndex(s => s.id === season.id)
    if (index > -1) {
      seasons.value.splice(index, 1)
    }
  }
}

// Actions configuration
const actions = ref([
  {
    label: 'Edit',
    handler: editSeason,
    icon: Edit
  },
  {
    label: 'Delete',
    handler: deleteSeason,
    icon: Trash,
    variant: 'danger'
  }
])

const onAction = (action, item) => {
  if (action === 'edit') {
    editSeason(item)
  } else if (action === 'delete') {
    deleteSeason(item)
  }
}

const onSelectionChange = (selected) => {
  selectedSeasons.value = selected
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedSeasons.value.length} selected season(s)?`)) {
    selectedSeasons.value.forEach(season => {
      const index = seasons.value.findIndex(s => s.id === season.id)
      if (index > -1) {
        seasons.value.splice(index, 1)
      }
    })
    selectedSeasons.value = []
  }
}

const saveSeason = () => {
  if (showAddModal.value) {
    // Add new season
    const newSeason = {
      id: Date.now(),
      ...formData.value,
      createdBy: 'Current User',
      createdDate: new Date().toLocaleString(),
      modifiedBy: 'Current User',
      modifiedDate: new Date().toLocaleString()
    }
    seasons.value.push(newSeason)
  } else {
    // Update existing season
    const index = seasons.value.findIndex(s => s.id === editingSeason.value.id)
    if (index > -1) {
      seasons.value[index] = {
        ...seasons.value[index],
        ...formData.value,
        modifiedBy: 'Current User',
        modifiedDate: new Date().toLocaleString()
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingSeason.value = null
  formData.value = {
    shortCode: '',
    seasonName: '',
    fromDay: '',
    fromMonth: '',
    toDay: '',
    toMonth: '',
    startDate: '',
    expireDate: '',
    status: 'Active'
  }
}
</script>
