<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ t('hotelInformation.whatsapp.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            {{ t('hotelInformation.whatsapp.help') }}
          </p>
        </div>

        <BasicButton
          variant="primary"
          :icon="Save"
          :label="isSaving ? t('Processing') + '...' : t('hotelInformation.saveChanges')"
          @click="saveConfig"
          :disabled="isSaving || !testPassed"
        />
      </div>

      <!-- Test not passed warning -->
      <div
        v-if="!testPassed && form.whatsappEnabled"
        class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200"
      >
        {{ t('hotelInformation.whatsapp.saveRequiresTest') }}
      </div>

      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6 animate-pulse">
        <!-- Grid 2 colonnes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="i in 7" :key="i" class="space-y-2">
            <div class="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <!-- Séparateur + test section -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
          <div class="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
              <div class="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
            <div class="md:col-span-2 space-y-2">
              <div class="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div class="h-24 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div class="flex justify-end">
            <div class="h-9 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>


      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6 space-y-6" :class="{ 'pointer-events-none opacity-60': isSaving }">

          <!-- Config Fields -->
          <div
            class=" p-4 space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Provider -->
              <AutoCompleteSelect
                v-model="form.whatsappProviderType"
                @update:model-value="(value) => {
                  form.whatsappProviderType = value
                  handleProviderChange(value)
                  resetTest()
                }"
                :lb="t('hotelInformation.whatsapp.provider')"
                :defaultValue="t('hotelInformation.whatsapp.providerPlaceholder')"
                :options="providerOptions"
              />

              <Input
                v-model="form.whatsappConfig.sender_name"
                :lb="t('hotelInformation.whatsapp.senderName')"
                :placeholder="t('hotelInformation.whatsapp.senderNamePlaceholder')"
                @update:model-value="resetTest"
              />

              <Input
                v-model="form.whatsappConfig.api_base_url"
                :lb="t('hotelInformation.whatsapp.apiBaseUrl')"
                placeholder="https://graph.facebook.com"
                @update:model-value="resetTest"
              />

              <Input
                v-model="form.whatsappConfig.api_version"
                :lb="t('hotelInformation.whatsapp.apiVersion')"
                placeholder="v18.0"
                @update:model-value="resetTest"
              />

              <Input 
                v-if="form.whatsappProviderType !== 'platform'"
                v-model="form.whatsappConfig.phone_number_id"
                :lb="t('hotelInformation.whatsapp.phoneNumberId')"
                placeholder="123456789"
                @update:model-value="resetTest"
              />

              <Input 
                v-if="form.whatsappProviderType !== 'platform'"
                v-model="form.whatsappConfig.business_account_id"
                :lb="t('hotelInformation.whatsapp.businessAccountId')"
                placeholder="987654321"
                @update:model-value="resetTest"
              />

              <Input 
                v-if="form.whatsappProviderType !== 'platform'"
                v-model="form.whatsappConfig.endpoint_url"
                :lb="t('hotelInformation.whatsapp.endpointUrl')"
                placeholder="https://..."
                @update:model-value="resetTest"
              />

              <!-- Access Token -->
              <div v-if="form.whatsappProviderType !== 'platform'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ t('hotelInformation.whatsapp.accessToken') }}
                </label>
                <div class="relative">
                  <input
                    :type="showToken ? 'text' : 'password'"
                    v-model="form.whatsappConfig.access_token"
                    placeholder="••••••••"
                    @input="resetTest"
                    class="h-11 w-full rounded-lg border border-black/50 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    @click="showToken = !showToken"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg v-if="!showToken" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Test Section -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ t('hotelInformation.whatsapp.testHelp') }}
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputPhone
                  v-model="testForm.recipient_phone_number"
                  :title="t('hotelInformation.whatsapp.testRecipient')"
                  :is-required="true"
                  :disabled="isTesting"
                />
                <div class="md:col-span-2">
                  <InputTextarea
                    v-model="testForm.message"
                    :label="t('hotelInformation.whatsapp.testMessage')"
                    :placeholder="t('hotelInformation.whatsapp.testMessagePlaceholder')"
                    :required="true"
                    :disabled="isTesting"
                  />
                </div>
              </div>

              <div class="flex items-center justify-end">
                <button
                  type="button"
                  @click="runTest"
                  :disabled="isTesting"
                  class="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <svg v-if="isTesting" class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  {{ isTesting ? t('hotelInformation.whatsapp.testing') : t('hotelInformation.whatsapp.test') }}
                </button>
              </div>

              <!-- Test Result -->
              <div
                v-if="testResult"
                class="rounded-lg border px-3 py-2 text-sm"
                :class="testResult.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200'
                  : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200'"
              >
                {{ testResult.message }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import InputPhone from '../../../components/forms/FormElements/InputPhone.vue'
import InputTextarea from '../../../components/forms/FormElements/InputTextArea.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import { testWhatsappConfiguration } from '../../../services/whatsapp'
import { updateHotelInformation ,getById} from '../../../services/hotelApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const Save = null // remplacez par votre icône Save
const serviceStore = useServiceStore()
const toast = useToast()
const { t } = useI18n({ useScope: 'global' })

const isSaving = ref(false)
const isTesting = ref(false)
const showToken = ref(false)
const testPassed = ref(false) 
const testResult = ref(null)
const loading = ref(false)

const form = ref({
  whatsappEnabled: false,
  whatsappProviderType: '',
  whatsappConfig: {
    sender_name: '',
    api_base_url: '',
    api_version: '',
    phone_number_id: '',
    business_account_id: '',
    endpoint_url: '',
    access_token: '',
  },
})

const testForm = ref({
  recipient_phone_number: '',
  message: '',
})

const providerOptions = ref([
  { label: t('hotelInformation.whatsappProviders.meta'), value: 'meta' },
  { label: t('hotelInformation.whatsappProviders.platform'), value: 'platform' },
])

// Réinitialise le statut du test dès qu'un champ change
const resetTest = () => {
  testPassed.value = false
  testResult.value = null
}


const handleProviderChange = (providerType) => {
  if (providerType === 'platform') {
    form.value.whatsappConfig.sender_name = 'Enjoy-Stay'
    form.value.whatsappConfig.api_base_url = 'https://graph.facebook.com'
    form.value.whatsappConfig.api_version = 'v25.0'
  } else {
    Object.assign(form.value.whatsappConfig, {
      sender_name: '', api_base_url: '', api_version: '',
      phone_number_id: '', business_account_id: '',
      endpoint_url: '', access_token: '',
    })
  }
}

const loadConfig = async () => {
  loading.value = true

  try {
    const response = await getById(serviceStore.serviceId)
    const service = response.data.data

    form.value.whatsappEnabled = service.whatsappEnabled ?? false
    form.value.whatsappProviderType = service.whatsappProviderType ?? ''
    form.value.whatsappConfig = service.whatsappConfig && typeof service.whatsappConfig === 'object'
      ? { ...service.whatsappConfig }
      : { sender_name: '', api_base_url: '', api_version: '', phone_number_id: '', business_account_id: '', endpoint_url: '', access_token: '' }

    testPassed.value = service.whatsappEnabled ?? false
  } catch (error) {
    console.error('Error fetching hotel data:', error)
    toast.error(t('toast.error'))
  } finally {
    loading.value = false
  }
}

const runTest = async () => {
  if (!testForm.value.recipient_phone_number || !testForm.value.message) {
    testResult.value = { type: 'error', message: t('hotelInformation.whatsapp.testRequiredFields') }
    return
  }

  isTesting.value = true
  testResult.value = null
  testPassed.value = false

  try {
    const response = await testWhatsappConfiguration(serviceStore.serviceId, {
      recipient_phone_number: testForm.value.recipient_phone_number,
      message: testForm.value.message,
      providerType: form.value.whatsappProviderType,
      config: form.value.whatsappConfig,
    })

    const success = response.data?.status === 'success'
    testPassed.value = success
    testResult.value = {
      type: success ? 'success' : 'error',
      message: success
        ? t('hotelInformation.whatsapp.testSuccess')
        : t('hotelInformation.whatsapp.testError'),
    }
  } catch (err) {
    console.error('Error testing WhatsApp config:', err)
    testPassed.value = false
    testResult.value = {
      type: 'error',
      message: err?.response?.data?.error ?? t('hotelInformation.whatsapp.testError'),
    }
  } finally {
    isTesting.value = false
  }
}

const saveConfig = async () => {
  if (!testPassed.value) return
  if (!serviceStore.serviceId) {
    toast.error(t('toast.error'))
    return
  }

  isSaving.value = true
  try {
    const response = await updateHotelInformation(serviceStore.serviceId, {
      whatsappEnabled: form.value.whatsappEnabled,
      whatsappProviderType: form.value.whatsappProviderType,
      whatsappConfig: form.value.whatsappConfig,
    })

    if (response.status === 200) {
      const raw = serviceStore.currentService
      const current = typeof raw === 'string' ? JSON.parse(raw) : raw
      serviceStore.setCurrentService({
        ...current,
        whatsappEnabled: form.value.whatsappEnabled,
        whatsappProviderType: form.value.whatsappProviderType,
        whatsappConfig: form.value.whatsappConfig,
      })
      toast.success(t('toast.hotelInfoUpdated'))
    } else {
      toast.error(t('toast.hotelInfoUpdateError'))
    }
  } catch (error) {
    console.error('Error saving WhatsApp config:', error)
    toast.error(t('toast.hotelInfoUpdateError'))
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>