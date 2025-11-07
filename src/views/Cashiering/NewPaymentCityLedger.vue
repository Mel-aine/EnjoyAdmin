<template>
  <div class="fixed inset-0  z-999" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <div class="absolute inset-0 ">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div class="relative w-screen max-w-6xl">

          <!-- Slide-over panel -->
          <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <!-- Header -->
            <div class="px-4 py-2 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-start justify-between">
                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">{{
                  $t('new_payment') }}</h2>
                <XIcon @click="closeModal" class="text-gray-300 hover:text-black" aria-label="Close panel" />
              </div>
            </div>

            <!-- Main content -->
            <div class="flex-1 overflow-y-auto">
              <div class="px-4 py-5 sm:p-6">
                <!-- Payment Form -->
                <div class="space-y-4">
                  <!-- Section Header
                  <div class="bg-blue-50 dark:bg-blue-900 rounded-md p-3">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">{{
                      $t('cashiering.paymentFromCityLedger', 'Payment from City Ledger') }}</h3>
                  </div> -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <!-- City Ledger Account -->
                    <InputSelectCityLeger v-model="formData.cityLedgerAccountId" @select="handChangeCityLedger" :disabled="isMappingMode" />

                    <!-- Date -->
                    <InputDatePicker :title="t('Date')" v-model="formData.date" :isRequired="true" :disabled="isMappingMode" />

                    <!-- Payment Type -->
                    <Select :lb="$t('Payment Type')" v-model="formData.paymentType" :options="[
                      { label: t('cash'), value: 'cash' },
                    ]" :isRequired="true" :disabled="isMappingMode" />

                    <!-- Payment method -->
                    <InputPaymentMethodSelect v-model="formData.paymentMethod" :payment-type="formData.paymentType" :disabled="isMappingMode" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <!--amount-->
                    <div class="col-span-2">
                      <InputCurrency
                        lb="Total Amount to Pay"
                        v-model="formData.amount"
                        v-model:currency="formData.currency"
                        placeholder="0.00"
                        step="0.01"
                        :disabled="isMappingMode"
                      />
                      <small class="text-gray-500 text-xs mt-1">Auto-calculated from assigned amounts</small>
                    </div>
                    <div class="col-span-3">
                      <Input :lb="$t('comment')" v-model="formData.comment" :disabled="isMappingMode" :placeholder="$t('comment')" />
                    </div>
                  </div>
                  <!-- Map Payment Section -->
                  <h4 class="text-md mt-2 font-medium text-gray-900 dark:text-white mb-4">{{ $t('Map Payment') }}</h4>
                  <h4 class="text-md mt-2 font-medium text-gray-900 dark:text-white mb-4">{{ $t('Map Payment') }}</h4>

                  <div class="mt-2 grid grid-cols-12 align-middle items-center gap-3">


                    <!-- Date Range -->
                    <div class="flex flex-col gap-2 col-span-4">
                      <div>
                        <RadioGroup class="flex space-x-4" :options="[
                          { label: t('Posting date'), value: 'posting' },
                          { label: t('Departure date'), value: 'departure' },
                          { label: t('Posting date'), value: 'posting' },
                          { label: t('Departure date'), value: 'departure' },
                        ]" v-model="formData.filter_options" />

                      </div>
                      <div class="mr-4">
                        <InputDoubleDatePicker :lb="$t('Posting Date')" v-model="formData.dateRange"
                          :allow-past-dates="true" />
                      </div>
                    </div>
                    <!-- <div class="col-span-7">
                      <Input :lb="$t('res.no')" :disabled="true" :placeholder="$t('new')" />
                    </div> -->
                    <div class="justify-center align-middle pt-6">
                      <BasicButton :label="t('Search')" :icon="SearchCodeIcon" @click="searchTransactions" class="w-80"
                        :loading="isSearching" :disabled="loading || isSearching|| isSaving"></BasicButton>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Guest Data Table -->
              <ReusableTable :columns="guestColumns" :data="guestData" :selectable="true" :loading="loading"
                @selection-change="handleGuestSelectionChange" :searchable="false" :show-header="false"
                :can-select-item="canSelectItem">
                <!-- Custom cell for Date column -->
                <template #column-date="{ item }">
                  <span class="text-xs text-gray-900 dark:text-white">{{ formatDateT(item.date) }}</span>
                </template>

                <!-- Custom cell for Name column -->
                <template #cell-name="{ item }">
                  <span class="text-xs font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
                </template>

                <!-- Custom cell for Amount column -->
                <template #cell-amount="{ item }">
                  <span class="text-xs font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.amount)
                  }}</span>
                </template>

                <!-- Custom cell for Assigned column -->
                <template #cell-assigned="{ item }">
                  <span class="text-xs text-gray-900 dark:text-white">{{ formatCurrency(item.assigned) }}</span>
                </template>
                <template #column-assign="{ item }">
                  <Input v-model="item.assign" :disabled="!isItemSelected(item)" @input="validateAssignAmount(item)"
                    @blur="validateAssignAmount(item)" type="number" :min="0" :max="item.open" step="0.01"
                    placeholder="0.00" />
                </template>

                <!-- Custom cell for Open column -->
                <template #cell-open="{ item }">
                  <span class="text-xs text-gray-900 dark:text-white">{{ formatCurrency(item.open) }}</span>
                </template>


              </ReusableTable>
            </div>


            <!-- Footer -->
            <div class="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-200 dark:border-gray-700">

              <div class="flex space-x-3">
                <span class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-900 dark:text-white">
                  {{ $t('Balance') }}: {{ formatCurrency(totalAssignedAmount) }} </span>
                <BasicButton :label="$t('Close')" variant="secondary" @click="closeModal" />
                <BasicButton :label="$t('Save')" variant="primary" @click="savePayment" :icon="Save"
                  :loading="isSaving" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ReusableTable from '../../components/tables/ReusableTable.vue'
import Select from '../../components/forms/FormElements/Select.vue'
import { defineAsyncComponent as defineAsyncComponentInput } from 'vue'
const Input = defineAsyncComponentInput(() => import('../../components/forms/FormElements/Input.vue'))
import InputDatePicker from '../../components/forms/FormElements/InputDatePicker.vue'
import { Save, Search, SearchCodeIcon, SearchIcon, SearchSlash, XIcon } from 'lucide-vue-next'
import InputCurrency from '../../components/forms/FormElements/InputCurrency.vue'
import InputDoubleDatePicker from '../../components/forms/FormElements/InputDoubleDatePicker.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import { formatCurrency } from '../../utils/numericUtils'
import RadioGroup from '../../components/forms/FormElements/RadioGroup .vue'
import { formatDateT } from '../../components/utilities/UtilitiesFunction'
import type { Column } from '../../utils/models'
import InputSelectCityLeger from '../../components/reservations/foglio/InputSelectCityLeger.vue'
import { getCityLedgerDetails, postTransactionPayCompanyBulk } from '../../services/companyApi'
import { useServiceStore } from '../../composables/serviceStore'
import InputPaymentMethodSelect from '../../components/reservations/foglio/InputPaymentMethodSelect.vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../../composables/user'

const router = useRouter()
const { t } = useI18n()
const serviceStore = useServiceStore()
const toast = useToast()
const authStore = useAuthStore()

// Props from parent component
const props = defineProps<{
  selectedCompanyId?: number | null
  dateRange?: {
    start: string
    end: string
  }
  activeTab?: string
  // Mapping mode: invoked from CashieringCenterInterface 'map' action
  mappingMode?: boolean
  mapPaymentContext?: any | null
}>()

// Loading state
const loading = ref(false)
const isSearching =ref(false)
const isSaving = ref(false)
const emit = defineEmits(['close', 'payment-saved'])

// Mapping mode helper
const isMappingMode = computed(() => !!props.mappingMode)

// Initialize date range with yesterday and today
const getYesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

const getToday = () => {
  const date = new Date()
  return date.toISOString().split('T')[0]
}

// Form data with props initialization
const formData = ref({
  cityLedgerAccount: null,
  cityLedgerAccountId: props.selectedCompanyId ?? 0,
  paymentType: 'cash',
  reference: '',
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  amount: 0,
  currency: 'XAF',
  comment: '',
  dateRange: {
    start: props.dateRange?.start || getYesterday(),
    end: props.dateRange?.end || getToday(),
  },
  paymentMethod: 0,
  filter_options: props.activeTab || "posting"
})

// City ledger data
const cityLedgerData = ref<any>({
  transactions: [],
  totals: {
    cityLedgerTotal: 0,
    unpaidInvoice: 0,
    unassignedPayments: 0,
    assignedPayments: 0,
    openingBalance: 0
  },
  companyAccount: null
})


// Guest data from API
const guestData = ref([])

// Load city ledger data function
const loadCityLedgerData = async () => {
  if (!formData.value.cityLedgerAccountId) {
    guestData.value = []
    cityLedgerData.value = {
      transactions: [],
      totals: {
        cityLedgerTotal: 0,
        unpaidInvoice: 0,
        unassignedPayments: 0,
        assignedPayments: 0,
        openingBalance: 0
      },
      companyAccount: null
    }
    return
  }

  try {
    guestData.value = []
    loading.value = true
    const response = await getCityLedgerDetails({
      companyAccountId: formData.value.cityLedgerAccountId,
      hotelId: serviceStore.serviceId!,
      dateFrom: formData.value.dateRange.start,
      dateTo: formData.value.dateRange.end,
      usePostingDate: formData.value.filter_options === 'posting',
      searchText: '',
      showVoided: false,
      page: 1,
      limit: 100
    })

    if (response) {
      console.log('esponse', response)
      cityLedgerData.value = response
      // Transform API data to guest data format
      guestData.value = response.data.filter((e:any)=>(e.transactionType =='transfer' && e.open >0)).map((transaction: any, index: number) => ({
        id: transaction.id,
        date: transaction.date,
        name: transaction.guestName,
        folioNo: transaction.folioNo,
        user: transaction.user,
        amount: Math.abs(transaction.amount),
        open: Math.abs(transaction.open),
        assign: 0,
        assigned: Math.abs(transaction.assigned),
        unassigned: Math.abs(transaction.unassigned),
        selected: false
      }))

      // Update form amount with total balance
      //formData.value.amount = 0;//cityLedgerData.value.totals?.unassignedPayments || 0
    }
  } catch (error) {
    console.error('Error loading city ledger data:', error)
  } finally {
    loading.value = false
  }
}

// Selected guests
const selectedGuests = ref([])

// Table columns definition
const guestColumns = computed<Column[]>(() => {
  return [
    { key: 'date', label: t('Date'), sortable: true, type: 'date' },
    { key: 'name', label: t('Guest Name'), sortable: true },
    { key: 'folioNo', label: t('Folio No.'), sortable: true },
    { key: 'user', label: t('User'), sortable: true },
    { key: 'amount', label: t('Amount'), sortable: true, type: 'text' },
    { key: 'assigned', label: t('Assigned'), sortable: true, type: 'text' },
    { key: 'open', label: t('Open'), sortable: true, type: 'text' },
    { key: 'assign', label: t('Assign'), sortable: false, type: 'custom' }
  ]
})

// Computed property for total assigned amount
const totalAssignedAmount = computed(() => {
  return formData.value.amount - guestData.value.reduce((sum, item: any) => {
    return sum + (parseFloat(item.assign) || 0)
  }, 0)
})

// Table actions
const guestActions = [
  { key: 'assign', label: 'Assign', icon: 'check-circle' }
]



// Check if an item can be selected (has open balance > 0)
const canSelectItem = (item: any) => {
  const openAmount = parseFloat(item.open) || 0
  return openAmount > 0
}

const handleGuestSelectionChange = (selected: any) => {
  // Filter out items that cannot be selected (open balance <= 0)
  const validSelected = selected.filter((item: any) => canSelectItem(item))

  // Show warning if user tried to select items with zero balance
  if (selected.length > validSelected.length) {
    toast.warning(t('Cannot select items with zero open balance'))
  }

  selectedGuests.value = validSelected

  // Update the selected property in guestData
  guestData.value.forEach((guest: any) => {
    const isSelected = selectedGuests.value.some((item: any) => item.id === guest.id)
    guest.selected = isSelected

    if (isSelected) {
      // Auto-assign the open value when selected
      const openAmount = parseFloat(guest.open) || 0
      if (openAmount > 0) {
        //guest.assign = openAmount
        console.log(`Auto-assigned ${formatCurrency(openAmount)} to ${guest.name}`)
      }
    } else {
      // Reset assign value when deselected
      guest.assign = 0
      console.log(`Reset assignment for ${guest.name}`)
    }
  })

  // Log total assigned amount for debugging
  const total = guestData.value.reduce((sum, item: any) => sum + (parseFloat(item.assign) || 0), 0)
  console.log(`Total assigned amount: ${formatCurrency(total)}`)
}
const handChangeCityLedger = (item: any) => {
  formData.value.cityLedgerAccount = item;
  formData.value.cityLedgerAccountId = item.id
  loadCityLedgerData()
}
// Check if an item is selected
const isItemSelected = (item: any) => {
  return selectedGuests.value.some((selected: any) => selected.id === item.id)
}

// Validate assign amount to not exceed open value
const validateAssignAmount = (item: any) => {
console.log('item',item)  // Convert to number to handle string inputs
  const assignValue = parseFloat(item.assign) || 0
  const openValue = parseFloat(item.open) || 0

  if (assignValue > openValue) {
    item.assign = openValue
    toast.warning(t('Assigned amount cannot exceed open amount', { amount: formatCurrency(openValue) }))
  }
  if (assignValue < 0) {
    item.assign = 0
    toast.warning(t('Assigned amount cannot be negative'))
  }

  // Ensure the value is properly formatted
  item.assign = parseFloat(item.assign) || 0
}

// Search transactions with refined details
const searchTransactions = async () => {
  if (!formData.value.cityLedgerAccountId) {
    toast.error(t('Please select a city ledger account first'))
    return
  }

  try {
    isSearching.value = true
    // Clear current selections when searching
    selectedGuests.value = []

    // Reload data with current filter settings
    await loadCityLedgerData()

    toast.success(t('transacctions.found', { count: guestData.value.length }))
    // toast.success(`Found ${guestData.value.length} transactions`)

    console.log('Transaction search completed with filters:', {
      cityLedgerAccountId: formData.value.cityLedgerAccountId,
      dateRange: `${formData.value.dateRange.start} to ${formData.value.dateRange.end}`,
      filterOption: formData.value.filter_options,
      totalTransactions: guestData.value.length
    })
  } catch (error) {
    console.error('Search error:', error)
    toast.error(t('Failed to search transactions'))
  } finally {
    isSearching.value = false
  }
}





const savePayment = async () => {
  try {
    // Start loading
    isSaving.value = true

    // Validate form
    if (!formData.value.cityLedgerAccountId) {
      toast.error(t('Please select a city ledger account'))
      return
    }

    if (!formData.value.paymentMethod) {
      toast.error(t('Please select a payment method'))
      toast.error(t('Please select a payment method'))
      return
    }

    if (!formData.value.amount) {
      toast.error(t('Please assign amounts to selected items'))
      toast.error(t('Please assign amounts to selected items'))
      return
    }

    // Get selected items with assigned amounts
    const selectedItems = guestData.value.filter((g: any) => g.selected && g.assign > 0)
    const paymentData = {
      companyId: formData.value.cityLedgerAccountId,
      hotelId: serviceStore.serviceId,
      amount: formData.value.amount,
      description: formData.value.comment || t('City Ledger Payment'),
      reference: formData.value.reference || '',
      voucher: formData.value.reference || '',
      paymentMethodId: formData.value.paymentMethod,
      postingDate: new Date().toISOString(),
      transactionDate: formData.value.date ? new Date(formData.value.date).toISOString() : new Date().toISOString(),
      mappings: selectedItems.map((item: any) => ({
        transactionId: item.id,
        newAssignedAmount: parseFloat(item.assign) || 0
      })),
      assignedBy: authStore.user?.id,
      assignmentDate: new Date().toISOString(),
      notes: formData.value.comment || ''
    }

    // If opened in mapping mode, include the payment transaction ID to avoid creating a new one
    if (isMappingMode.value && props.mapPaymentContext?.transactionId) {
      // Backend expects existing payment transaction identifier
      ;(paymentData as any).transactionId = Number(props.mapPaymentContext?.transactionId)
    }

    console.log('Saving payment with data:', paymentData)

    // Call API
    const response = await postTransactionPayCompanyBulk(paymentData)

    if (response && response.success) {
      toast.success(t('Payment saved successfully!'))
      // Emit event to parent component to refresh data
      emit('payment-saved')
      // Close modal after successful save
      closeModal()
    } else {
      const errorMessage = response?.message || t('Failed to save payment. Please try again.')
      toast.error(errorMessage)
    }
  } catch (error) {
    console.error('Error saving payment:', error)
    toast.error(t('An error occurred while saving the payment'))
    toast.error(t('An error occurred while saving the payment'))
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  emit('close')
}

// Watchers for prop changes
watch(
  () => props.selectedCompanyId,
  (newCompanyId) => {
    if (newCompanyId) {
      formData.value.cityLedgerAccountId = newCompanyId
      // Set a placeholder cityLedgerAccount object to enable search
      loadCityLedgerData()
    } else {
      formData.value.cityLedgerAccount = null
      formData.value.cityLedgerAccountId = 0
      guestData.value = []
    }
  },
  { immediate: true }
)

watch(
  () => props.dateRange,
  (newDateRange) => {
    if (newDateRange) {
      formData.value.dateRange.start = newDateRange.start
      formData.value.dateRange.end = newDateRange.end
      if (formData.value.cityLedgerAccount) {
        loadCityLedgerData()
      }
    }
  },
  { deep: true }
)

watch(
  () => props.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      formData.value.filter_options = newActiveTab
      if (formData.value.cityLedgerAccount) {
        loadCityLedgerData()
      }
    }
  }
)



// Load data on component mount
onMounted(() => {
  // Prefill amount when mapping an existing payment
  if (props.mapPaymentContext && props.mapPaymentContext.id) {
    formData.value.amount = Math.abs(Number(props.mapPaymentContext?.open ?? 0))
    formData.value.paymentMethod = props.mapPaymentContext?.paymentTypeId
  }
  // Load data if props are provided or if cityLedgerAccount is set
  if (formData.value.cityLedgerAccount || props.selectedCompanyId) {
    loadCityLedgerData()
  }


})
</script>
