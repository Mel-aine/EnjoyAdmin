<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('configuration.settings.formula.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            {{ $t('configuration.settings.formula.description') }}
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" :label="$t('configuration.settings.formula.save_changes')" @click="saveFormula" :loading="isLoading" />
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6 space-y-8">
          <!-- Total Room Revenue -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('configuration.settings.formula.total_room_revenue') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {{ $t('configuration.settings.formula.select_revenue_components') }}
            </p>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.nightSoldRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.night_sold_revenue') }}</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.dayUseRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.day_use_revenue') }}</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.lateCheckoutRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.late_checkout_revenue') }}</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.cancellationRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.cancellation_revenue') }}</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formula.totalRoomRevenue.noShowRevenue"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.no_show_revenue') }}</span>
              </label>
            </div>
            
            <div class="mt-4 p-3 bg-gray-50 dark:bg-black rounded-md">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.current_formula') }}:</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ totalRoomRevenueFormula }}</p>
            </div>
          </div>
          
          <!-- Total Room Sold -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('configuration.settings.formula.total_room_sold') }}</h3>
            <div class="p-3 bg-gray-50 dark:bg-black rounded-md">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.formula') }}:</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('configuration.settings.formula.total_rooms_sold_formula') }}</p>
            </div>
          </div>
          
          <!-- Total Rooms -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('configuration.settings.formula.total_rooms') }}</h3>
            <div class="flex items-center mb-4">
              <label class="flex items-center">
                <input
                  v-model="formula.totalRooms.includeOutOfOrder"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.include_out_of_order') }}</span>
              </label>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-black rounded-md">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.current_formula') }}:</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ totalRoomsFormula }}</p>
            </div>
          </div>
          
          <!-- Average Daily Rate (ADR) -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('configuration.settings.formula.average_daily_rate') }}</h3>
            <div class="p-3 bg-gray-50 dark:bg-black rounded-md">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.formula') }}:</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('configuration.settings.formula.adr_formula') }}</p>
            </div>
          </div>
          
          <!-- Occupancy % -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('configuration.settings.formula.occupancy_percent') }}</h3>
            <div class="p-3 bg-gray-50 dark:bg-black rounded-md">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.formula') }}:</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('configuration.settings.formula.occupancy_formula') }}</p>
            </div>
          </div>
          
          <!-- Revenue Per Available Room (RevPAR) -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('configuration.settings.formula.revpar') }}</h3>
            <div class="p-3 bg-gray-50 dark:bg-black rounded-md">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('configuration.settings.formula.formula') }}:</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('configuration.settings.formula.revpar_formula') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { updateHotelFormulaSetting } from '../../../services/hotelApi'
import { Save } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)

// Get current service from store
const currentService = computed(() => serviceStore.getCurrentService)

const formula = ref({
  totalRoomRevenue: {
    nightSoldRevenue: true,
    dayUseRevenue: true,
    lateCheckoutRevenue: false,
    cancellationRevenue: false,
    noShowRevenue: false
  },
  totalRooms: {
    includeOutOfOrder: false
  }
})

const totalRoomRevenueFormula = computed(() => {
  const components = []
  if (formula.value.totalRoomRevenue.nightSoldRevenue) components.push(t('configuration.settings.formula.night_sold_revenue'))
  if (formula.value.totalRoomRevenue.dayUseRevenue) components.push(t('configuration.settings.formula.day_use_revenue'))
  if (formula.value.totalRoomRevenue.lateCheckoutRevenue) components.push(t('configuration.settings.formula.late_checkout_revenue'))
  if (formula.value.totalRoomRevenue.cancellationRevenue) components.push(t('configuration.settings.formula.cancellation_revenue'))
  if (formula.value.totalRoomRevenue.noShowRevenue) components.push(t('configuration.settings.formula.no_show_revenue'))
  
  if (components.length === 0) return t('configuration.settings.formula.no_revenue_components')
  if (components.length === 1) return t('configuration.settings.formula.total_room_revenue_equals', { component: components[0] })
  
  return t('configuration.settings.formula.total_room_revenue_formula', { components: components.join(' + ') })
})

const totalRoomsFormula = computed(() => {
  if (formula.value.totalRooms.includeOutOfOrder) {
    return t('configuration.settings.formula.total_rooms_with_out_of_order')
  }
  return t('configuration.settings.formula.total_rooms_available_only')
})

// Load formula from current service
const loadFormulaFromService = () => {
  if (currentService.value && currentService.value.formulaSetting) {
    const serviceFormula = currentService.value.formulaSetting
    formula.value = {
      totalRoomRevenue: {
        nightSoldRevenue: serviceFormula.totalRoomRevenue?.nightSoldRevenue ?? true,
        dayUseRevenue: serviceFormula.totalRoomRevenue?.dayUseRevenue ?? true,
        lateCheckoutRevenue: serviceFormula.totalRoomRevenue?.lateCheckoutRevenue ?? false,
        cancellationRevenue: serviceFormula.totalRoomRevenue?.cancellationRevenue ?? false,
        noShowRevenue: serviceFormula.totalRoomRevenue?.noShowRevenue ?? false
      },
      totalRooms: {
        includeOutOfOrder: serviceFormula.totalRooms?.includeOutOfOrder ?? false
      }
    }
  }
}

const saveFormula = async () => {
  if (!currentService.value || !currentService.value.id) {
    toast.error(t('toast.formulaUpdateError'))
    return
  }

  isLoading.value = true
  
  try {
    // Call API to update formula setting
    await updateHotelFormulaSetting(currentService.value.id, { formulaSetting: formula.value })
    
    // Update the service store with new formula setting
    const updatedService = {
      ...currentService.value,
      formulaSetting: formula.value
    }
    serviceStore.setCurrentService(updatedService)
    
    // Show success toast
    toast.success(t('toast.formulaUpdated'))
  } catch (error) {
    console.error('Error saving formula:', error)
    toast.error(t('toast.formulaUpdateError'))
  } finally {
    isLoading.value = false
  }
}

// Load formula when component mounts
onMounted(() => {
  loadFormulaFromService()
})
</script>
