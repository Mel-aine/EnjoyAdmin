<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('configuration.settings.tac_configuration.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            {{ $t('configuration.settings.tac_configuration.description') }}
          </p>
        </div>
        <BasicButton
          variant="primary"
          :icon="Save"
          :label="$t('configuration.settings.tac_configuration.save_changes')"
          @click="saveTacSettings"
          :loading="isLoading"
        ></BasicButton>
      </div>

      <div class="space-y-6">
        <!-- Room Revenue -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.tac_configuration.room_revenue') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <Select 
                  v-model="tacSettings.roomRevenue.account" 
                  :lb="$t('configuration.settings.tac_configuration.account')"
                  :options="accountOptions" 
                  :placeholder="$t('configuration.settings.tac_configuration.select_account')" 
                  :disabled="true" 
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('configuration.settings.tac_configuration.tax') }}</label>
                <div v-if="isTaxesLoading" class="grid grid-cols-2 gap-4 animate-pulse">
                  <div class="flex items-center" v-for="n in 6" :key="`tax-skel-room-${n}`">
                    <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="ml-2 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div v-else-if="activeTaxes.length === 0" class="text-sm text-gray-500 dark:text-gray-400">{{ $t('configuration.settings.tac_configuration.no_taxes_available') }}</div>
                <div v-else class="grid grid-cols-2 gap-4">
                  <label class="inline-flex items-center" v-for="tax in activeTaxes" :key="tax.taxRateId">
                    <input type="checkbox" v-model="tacSettings.roomRevenue.taxIds" :value="tax.taxRateId" class="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded" />
                    <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">{{ tax.taxName }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cancellation Revenue -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.tac_configuration.cancellation_revenue') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <Select 
                  v-model="tacSettings.cancellationRevenue.account" 
                  :lb="$t('configuration.settings.tac_configuration.account')"
                  :options="accountOptions" 
                  :placeholder="$t('configuration.settings.tac_configuration.select_account')" 
                  :disabled="true"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('configuration.settings.tac_configuration.tax') }}</label>
                <div v-if="isTaxesLoading" class="grid grid-cols-2 gap-4 animate-pulse">
                  <div class="flex items-center" v-for="n in 6" :key="`tax-skel-cancel-${n}`">
                    <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="ml-2 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div v-else-if="activeTaxes.length === 0" class="text-sm text-gray-500 dark:text-gray-400">{{ $t('configuration.settings.tac_configuration.no_taxes_available') }}</div>
                <div v-else class="grid grid-cols-2 gap-4">
                  <label class="inline-flex items-center" v-for="tax in activeTaxes" :key="tax.taxRateId">
                    <input type="checkbox" v-model="tacSettings.cancellationRevenue.taxIds" :value="tax.taxRateId" class="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded" />
                    <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">{{ tax.taxName }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Show Revenue -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.tac_configuration.no_show_revenue') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <Select 
                  v-model="tacSettings.noShowRevenue.account" 
                  :lb="$t('configuration.settings.tac_configuration.account')"
                  :options="accountOptions" 
                  :placeholder="$t('configuration.settings.tac_configuration.select_account')" 
                  :disabled="true"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('configuration.settings.tac_configuration.tax') }}</label>
                <div v-if="isTaxesLoading" class="grid grid-cols-2 gap-4 animate-pulse">
                  <div class="flex items-center" v-for="n in 6" :key="`tax-skel-noshow-${n}`">
                    <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="ml-2 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div v-else-if="activeTaxes.length === 0" class="text-sm text-gray-500 dark:text-gray-400">{{ $t('configuration.settings.tac_configuration.no_taxes_available') }}</div>
                <div v-else class="grid grid-cols-2 gap-4">
                  <label class="inline-flex items-center" v-for="tax in activeTaxes" :key="tax.taxRateId">
                    <input type="checkbox" v-model="tacSettings.noShowRevenue.taxIds" :value="tax.taxRateId" class="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded" />
                    <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">{{ tax.taxName }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Day Use -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.tac_configuration.day_use') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <Select 
                  v-model="tacSettings.dayUseRevenue.account" 
                  :lb="$t('configuration.settings.tac_configuration.account')"
                  :options="accountOptions" 
                  :placeholder="$t('configuration.settings.tac_configuration.select_account')" 
                  :disabled="true"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('configuration.settings.tac_configuration.tax') }}</label>
                <div v-if="isTaxesLoading" class="grid grid-cols-2 gap-4 animate-pulse">
                  <div class="flex items-center" v-for="n in 6" :key="`tax-skel-dayuse-${n}`">
                    <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="ml-2 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div v-else-if="activeTaxes.length === 0" class="text-sm text-gray-500 dark:text-gray-400">{{ $t('configuration.settings.tac_configuration.no_taxes_available') }}</div>
                <div v-else class="grid grid-cols-2 gap-4">
                  <label class="inline-flex items-center" v-for="tax in activeTaxes" :key="tax.taxRateId">
                    <input type="checkbox" v-model="tacSettings.dayUseRevenue.taxIds" :value="tax.taxRateId" class="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded" />
                    <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">{{ tax.taxName }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Late Checkout -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.tac_configuration.late_checkout') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <Select 
                  v-model="tacSettings.lateCheckoutRevenue.account" 
                  :lb="$t('configuration.settings.tac_configuration.account')"
                  :options="accountOptions" 
                  :placeholder="$t('configuration.settings.tac_configuration.select_account')" 
                  :disabled="true" 
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('configuration.settings.tac_configuration.tax') }}</label>
                <div v-if="isTaxesLoading" class="grid grid-cols-2 gap-4 animate-pulse">
                  <div class="flex items-center" v-for="n in 6" :key="`tax-skel-late-${n}`">
                    <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="ml-2 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div v-else-if="activeTaxes.length === 0" class="text-sm text-gray-500 dark:text-gray-400">{{ $t('configuration.settings.tac_configuration.no_taxes_available') }}</div>
                <div v-else class="grid grid-cols-2 gap-4">
                  <label class="inline-flex items-center" v-for="tax in activeTaxes" :key="tax.taxRateId">
                    <input type="checkbox" v-model="tacSettings.lateCheckoutRevenue.taxIds" :value="tax.taxRateId" class="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded" />
                    <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">{{ tax.taxName }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Select from '../../../components/forms/FormElements/Select.vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { Save } from 'lucide-vue-next'
import { getTaxes } from '../../../services/configrationApi'
import { updateHotelTaxRates } from '../../../services/hotelApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)
const isTaxesLoading = ref(true)

const currentService = computed(() => serviceStore.getCurrentService)

const accountOptions = computed(() => [
  { label: t('configuration.settings.tac_configuration.room_charges'), value: 'room_charges' },
  { label: t('configuration.settings.tac_configuration.cancellation_revenue'), value: 'cancellation_revenue' },
  { label: t('configuration.settings.tac_configuration.no_show_revenue'), value: 'no_show_revenue' },
  { label: t('configuration.settings.tac_configuration.day_use_charges'), value: 'day_use_charges' },
  { label: t('configuration.settings.tac_configuration.late_checkout_charges'), value: 'late_checkout_charges' }
])

// Dynamic taxes from API
const taxes = ref<any[]>([])
const activeTaxes = computed(() => taxes.value.filter((t: any) => (t.status || '').toLowerCase() === 'active'))

const tacSettings = ref({
  roomRevenue: { account: 'room_charges', taxIds: [] },
  cancellationRevenue: { account: 'cancellation_revenue', taxIds: [] },
  noShowRevenue: { account: 'no_show_revenue', taxIds: [] },
  dayUseRevenue: { account: 'day_use_charges', taxIds: [] },
  lateCheckoutRevenue: { account: 'late_checkout_charges', taxIds: [] }
})

const loadTacSettingsFromService = () => {
  if (currentService.value) {
    // Merge nested tacSettings from service if present
    if (currentService.value.tacSettings) {
      tacSettings.value = { ...tacSettings.value, ...currentService.value.tacSettings }
    }

    // Map top-level tax rate IDs (if present on the current service) into local tacSettings
    const cs: any = currentService.value
    if (Array.isArray(cs.roomChargesTaxRateIds)) {
      tacSettings.value.roomRevenue.taxIds = cs.roomChargesTaxRateIds
    }
    if (Array.isArray(cs.cancellationRevenueTaxRateIds)) {
      tacSettings.value.cancellationRevenue.taxIds = cs.cancellationRevenueTaxRateIds
    }
    if (Array.isArray(cs.noShowRevenueTaxRateIds)) {
      tacSettings.value.noShowRevenue.taxIds = cs.noShowRevenueTaxRateIds
    }
  }
}

const loadTaxes = async () => {
  isTaxesLoading.value = true
  try {
    const response = await getTaxes()
    taxes.value = response.data?.data?.data || []
  } catch (error) {
    console.error('Error loading taxes:', error)
  } finally {
    isTaxesLoading.value = false
  }
}

const saveTacSettings = async () => {
  if (!serviceStore.serviceId) {
    toast.error(t('configuration.settings.tac_configuration.unable_to_save_settings_no_active_service'))
    return
  }
  isLoading.value = true
  try {
    const payload: any = {}

    if (tacSettings.value.roomRevenue.taxIds?.length) {
      payload.roomChargesTaxRateIds = tacSettings.value.roomRevenue.taxIds
    }
    if (tacSettings.value.cancellationRevenue.taxIds?.length) {
      payload.cancellationRevenueTaxRateIds = tacSettings.value.cancellationRevenue.taxIds
    }
    if (tacSettings.value.noShowRevenue.taxIds?.length) {
      payload.noShowRevenueTaxRateIds = tacSettings.value.noShowRevenue.taxIds
    }
    console.log("playload", payload)
    await updateHotelTaxRates(serviceStore.serviceId, payload)

    const updatedService = {
      ...currentService.value,
      tacSettings: tacSettings.value,
      roomChargesTaxRateIds: tacSettings.value.roomRevenue.taxIds,
      cancellationRevenueTaxRateIds: tacSettings.value.cancellationRevenue.taxIds,
      noShowRevenueTaxRateIds: tacSettings.value.noShowRevenue.taxIds,
    }
    serviceStore.setCurrentService(updatedService)

    try {
      const { useTacSettingsStore } = await import('@/composables/tacSettingsStore')
      const tacStore = useTacSettingsStore()
      tacStore.setForService(serviceStore.serviceId, tacSettings.value)
    } catch (e) {
      console.warn('Failed to cache TAC settings in store', e)
    }

    toast.success(t('configuration.settings.tac_configuration.tax_rates_saved_and_configuration_updated'))
  } catch (err) {
    console.error('Error saving hotel tax rates:', err)
    toast.error(t('configuration.settings.tac_configuration.failed_to_save_hotel_tax_rates'))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTaxes()
  loadTacSettingsFromService()
})
</script>