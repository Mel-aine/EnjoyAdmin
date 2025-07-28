
<template>
  <div class="max-w-full mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('managingHotel') }}</h2>

    <!-- Section Informations Généralesb  :cloudinary-config="cloudinaryConfig" -->
    <InfoGeneral v-model="hotelInfo" />

    <!-- section upLoader l image  -->

    <div class="max-w-full mx-auto p-6 bg-white rounded-lg  py-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('image_logo') }}</h2>
      <div class="flex justify-end">
        <img :src="logoUrl" alt="Logo" class="w-15 h-auto rounded-full border border-gray-300" />
      </div>

      <!-- Section Logo -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {{ $t('logo_service') }}
        </h3>

        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors"
        >
          <input
            type="file"
            accept="image/*"
            @change="handleLogoFile"
            class="hidden"
            ref="logoInput"
            id="logo-upload"
          />

          <div v-if="!logoPreview" @click="logoInput?.click()" class="cursor-pointer">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-600">{{ $t('click_to') }}</p>
            <p class="text-xs text-gray-500">PNG, JPG, GIF {{ $t('until') }} 10MB</p>
          </div>

          <div v-if="logoPreview" class="relative">
            <img
              :src="logoPreview"
              alt="Logo preview"
              class="mx-auto max-h-32 object-contain rounded-lg"
            />
            <div class="mt-3 flex justify-center space-x-2">
              <button
                @click="logoInput?.click()"
                class="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                {{ $t('change') }}
              </button>
              <button
                @click="removeLogo"
                class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                {{ $t('delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Images multiples -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ $t('images') }}
        </h3>

        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleFiles"
            class="hidden"
            ref="fileInput"
            id="images-upload"
          />

          <div @click="fileInput?.click()" class="cursor-pointer">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-600">{{ $t('click_to_select') }}</p>
            <p class="text-xs text-gray-500">{{ $t('multiple_selection') }} - PNG, JPG, GIF</p>
          </div>
        </div>

        <!-- Prévisualisation des images -->
        <div v-if="imagePreviews.length > 0" class="mt-6">
          <h4 class="text-md font-medium text-gray-700 mb-3">
            Images sélectionnées ({{ imagePreviews.length }})
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(preview, index) in imagePreviews" :key="index" class="relative group">
              <img
                :src="preview.url"
                :alt="`Preview ${index + 1}`"
                class="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
              >
                <button
                  @click="removeImage(index)"
                  class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1 truncate">{{ preview.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-center space-x-4">
        <button
          @click="clearAll"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          :disabled="!logoFile && imagePreviews.length === 0"
        >
          {{ $t('clear_all') }}
        </button>
      </div>

      <!-- Résultats de l'upload -->
      <div v-if="uploadedUrls.length > 0" class="mt-8 p-4 bg-green-50 rounded-lg">
        <h3 class="text-lg font-semibold text-green-800 mb-3">✅ Images uploadées avec succès !</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(result, index) in uploadedUrls"
            :key="index"
            class="flex items-center space-x-3 p-2 bg-white rounded border"
          >
            <img :src="result.url" :alt="result.type" class="w-12 h-12 object-cover rounded" />
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-700">
                {{ result.type === 'logo' ? 'Logo' : 'Image ' + (index + 1) }}
              </p>
              <a
                :href="result.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-blue-600 hover:text-blue-800 break-all"
              >
                {{ result.url }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages d'erreur -->
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">❌ {{ errorMessage }}</p>
      </div>
    </div>

     <div class="mb-8">
    <GeneralSetting/>
    </div>

    <!-- Section Paramètres de Tarification -->
    <div class="mb-8 max-w-full mx-auto p-6 bg-white rounded-lg">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">{{ $t('pricingSettings') }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Select
            :lb="t('currency')"
            :options="currencyOptions"
            v-model="pricingParameters.currency"
          />
        </div>

        <div>
          <Input
            :lb="t('taxRate')"
            :inputType="'number'"
            :id="'taxRate'"
            :forLabel="'taxRate'"
            v-model.number="pricingParameters.taxRate"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <PaymentMethod v-model="selectedPaymentMethods"
      @update:modelValue="handlePaymentMethodsUpdate"  />

    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-4">
      <button
        type="button"
        @click="updateParameters"
        class="px-5 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
      >
        <svg
          v-if="isLoading"
          class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline-flex"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>

        {{ isLoading ? $t('Processing...') : $t('Save') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted, computed } from 'vue'
import { getService, updateService } from '@/services/api'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { useToast } from 'vue-toastification'
import PaymentMethod from './PaymentMethod.vue'
import InfoGeneral from './InfoGeneral.vue'
import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config'
import GeneralSetting from './GeneralSetting.vue'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const isLoading = ref(false)
const payment = ref<any[]>([])

const newPayment = ref('')

interface ImagePreview {
  file: File
  url: string
  name: string
}

interface UploadResult {
  url: string
  type: 'logo' | 'image'
}

const logoFile = ref<File | null>(null)
const logoPreview = ref<string>('')
const imagePreviews = ref<ImagePreview[]>([])
const uploadedUrls = ref<UploadResult[]>([])
const uploading = ref(false)
const errorMessage = ref('')
const newFacility = ref('')
const logoInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const logoUrl = ref('')
const availableServices = ref<string[]>([])
const Logo = ref<any>('')
const Images = ref<any[]>([])
const selectedPaymentMethods = ref<any[]>([])

const addPayment = () => {
  if (newPayment.value && !payment.value.includes(newPayment.value)) {
    payment.value.push(newPayment.value)
    newPayment.value = ''
  }
}

const removePayment = (index: any) => {
  payment.value.splice(index, 1)
}

interface PricingParameters {
  currency: string
  taxRate: number
}

const addService = () => {
  const trimmed = newFacility.value.trim()
  if (trimmed && !availableServices.value.includes(trimmed)) {
    availableServices.value.push(trimmed)
    newFacility.value = ''
  }
}

const removeService = (service: any) => {
  availableServices.value = availableServices.value.filter((s: any) => s !== service)
}
const hotelInfo = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
})

const pricingParameters = reactive<PricingParameters>({
  currency: 'XAF',
  taxRate: 19.25,
})

const availableCurrencies = computed(() => [
  { code: 'XAF', name: t('currencies.XAF') },
  { code: 'EUR', name: t('currencies.EUR') },
  { code: 'USD', name: t('currencies.USD') },
  { code: 'GBP', name: t('currencies.GBP') },
  { code: 'CHF', name: t('currencies.CHF') },
  { code: 'CAD', name: t('currencies.CAD') },
])

const currencyOptions = computed(() =>
  availableCurrencies.value.map((curr: any) => ({
    label: curr.name,
    value: curr.code,
  })),
)



const handlePaymentMethodsUpdate = (newPaymentMethods:any) => {
  console.log('Méthodes de paiement mises à jour:', newPaymentMethods)
  selectedPaymentMethods.value = newPaymentMethods

}

onMounted(async () => {
  try {
    const serviceId = serviceStore.serviceId
    const data = await getService(serviceId)

    console.log('Données complètes de l\'API:', data.data)
    console.log('Type de paymentMethods:', typeof data.data.paymentMethods)
    console.log('Valeur brute de paymentMethods:', data.data.paymentMethods)

    if (Array.isArray(data.data.paymentMethods)) {
      selectedPaymentMethods.value = [...data.data.paymentMethods]
    } else if (typeof data.data.paymentMethods === 'string') {
      try {
        const parsed = JSON.parse(data.data.paymentMethods)
        selectedPaymentMethods.value = Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.error('Erreur de parsing des méthodes de paiement:', e)
        selectedPaymentMethods.value = []
      }
    } else if (data.data.paymentMethods) {

      selectedPaymentMethods.value = Object.values(data.data.paymentMethods)
    } else {
      selectedPaymentMethods.value = []
    }

    console.log('selectedPaymentMethods final:', selectedPaymentMethods.value)

    serviceStore.currentService = JSON.stringify(data.data)
    availableServices.value = data.data.facilities
    logoUrl.value = data.data.logo

    console.log('logoUrl.value :', logoUrl.value)
    console.log('Adresse brute:', data.data.addressService)
    console.log('facilities :', data.data.facilities)

    let address = data.data.addressService
    if (typeof address === 'string') {
      try {
        address = JSON.parse(address)
      } catch (e) {
        console.error('Erreur de parsing de addressService:', e)
        address = { text: '' }
      }
    }

    hotelInfo.value = {
      name: data.data.name,
      address: address,
      phone: data.data.phoneNumberService,
      email: data.data.emailService,
    }

  } catch (error) {
    console.error('Erreur lors du chargement du service:', error)
    selectedPaymentMethods.value = []
  }
})

const updateParameters = async () => {
  isLoading.value = true
  await uploadImages()

  try {
    const serviceId = serviceStore.serviceId

    const payload = {
      name: hotelInfo.value.name,
      address_service: JSON.stringify(hotelInfo.value.address),
      email_service: hotelInfo.value.email,
      phone_number_service: hotelInfo.value.phone,
      facilities: JSON.stringify(availableServices.value),
      payment_methods: JSON.stringify(selectedPaymentMethods.value),
      logo: Logo.value,
      images: JSON.stringify(Images.value),
    }
    console.log('payloadServiceupdate', payload)

    await updateService(serviceId, payload)

    toast.success(t('toast.SucessUpdate'))
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres :', error)
    toast.error(t('toast.updateError'))
  } finally {
    isLoading.value = false
  }
}

function handleLogoFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez sélectionner un fichier image valide pour le logo.'
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'Le logo ne peut pas dépasser 10MB.'
    return
  }

  logoFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  errorMessage.value = ''
}

function handleFiles(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  files.forEach((file) => {
    if (!file.type.startsWith('image/')) {
      errorMessage.value = `Le fichier ${file.name} n'est pas une image valide.`
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      errorMessage.value = `Le fichier ${file.name} ne peut pas dépasser 10MB.`
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push({
        file,
        url: e.target?.result as string,
        name: file.name,
      })
    }
    reader.readAsDataURL(file)
  })

  errorMessage.value = ''
}

function removeLogo() {
  logoFile.value = null
  logoPreview.value = ''
  if (logoInput.value) logoInput.value.value = ''
}

function removeImage(index: number) {
  imagePreviews.value.splice(index, 1)
  if (fileInput.value) fileInput.value.value = ''
}

function clearAll() {
  removeLogo()
  imagePreviews.value = []
  uploadedUrls.value = []
  errorMessage.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Upload échoué')
  return data.secure_url
}

async function uploadImages() {
  if (!logoFile.value && imagePreviews.value.length === 0) {
    errorMessage.value = 'Veuillez sélectionner au moins une image à uploader.'
    return
  }

  uploading.value = true
  uploadedUrls.value = []
  errorMessage.value = ''

  try {
    const allUrls: string[] = []
    const results: UploadResult[] = []

    if (logoFile.value) {
      const logoUrl = await uploadToCloudinary(logoFile.value)
      allUrls.push(logoUrl)
      results.push({ url: logoUrl, type: 'logo' })
    }

    for (const preview of imagePreviews.value) {
      const url = await uploadToCloudinary(preview.file)
      allUrls.push(url)
      results.push({ url, type: 'image' })
    }

    uploadedUrls.value = results
    console.log('uploadedUrls.value', uploadedUrls.value)

    Logo.value = uploadedUrls.value.find((f: any) => f.type === 'logo')?.url
    Images.value = uploadedUrls.value.filter((f: any) => f.type === 'image').map((f: any) => f.url)

    clearAll()
  } catch (error) {
    errorMessage.value = "Erreur lors de l'upload : " + (error as Error).message
  } finally {
    uploading.value = false
  }
}
</script>
