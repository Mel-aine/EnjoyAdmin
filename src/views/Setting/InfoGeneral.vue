<!-- CloudinaryImageUpload.vue -->
<template>
    <div class="mb-8 bg-white rounded-lg p-6 max-w-4xl mx-auto  shadow-lg">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">{{ $t('generalInfo') }}</h3>

      <div class="mb-4">
        <Input
          :lb="t('hotelName')"
          :id="'hotelName'"
          :forLabel="'hotelName'"
          v-model="hotelInfo.name"
        />
      </div>

      <!-- Logo Upload -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('logo') }}
        </label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
          <div v-if="!logoUrl" class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="mt-4">
              <button
                type="button"
                @click="triggerLogoUpload"
                :disabled="logoUploading"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg v-if="logoUploading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ logoUploading ? t('uploading') : t('uploadLogo') }}
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
          </div>

          <div v-else class="relative">
            <img :src="logoUrl" alt="Logo" class="max-h-32 mx-auto rounded-lg shadow-md">
            <button

              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div class="mt-2 text-center">
              <button
                @click="triggerLogoUpload"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {{ t('changeLogo') }}
              </button>
            </div>
          </div>
        </div>
        <input
          ref="logoInput"
          type="file"
          accept="image/*"

          class="hidden"
        >
      </div>

      <!-- Gallery Upload   @click="removeLogo" @change="uploadLogo" -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('images') }} ({{ images.length }}/{{ maxImages }})
        </label>

        <!-- Upload Zone @drop="handleDrop"-->
        <div

          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors"
          :class="{ 'border-blue-400 bg-blue-50': dragOver }"
          @dragenter="dragOver = true"
          @dragleave="dragOver = false"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="mt-4">
              <button
                type="button"
                @click="triggerImageUpload"
                :disabled="imagesUploading || images.length >= maxImages"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <svg v-if="imagesUploading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ imagesUploading ? t('uploading') : t('uploadImages') }}
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              Glissez-déposez vos images ici ou cliquez pour sélectionner<br>
              PNG, JPG, GIF jusqu'à 10MB chacune
            </p>
          </div>
        </div>

        <input
          ref="imagesInput"
          type="file"
          accept="image/*"
          multiple

          class="hidden"
        >

        <!-- Progress Bar  @change="uploadImages"-->
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
          <div class="bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mt-1">Upload en cours... {{ uploadProgress }}%</p>
        </div>

        <!-- Images Grid -->
        <div v-if="images.length > 0" class="mt-6">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in images"
              :key="image.id"
              class="relative group"
            >
              <img
                :src="image.thumbnailUrl || image.url"
                :alt="`Image ${index + 1}`"
                class="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
              >

              <!-- Image Actions @click="viewImage(image)" -->
              <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                <button

                  class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  :title="t('viewImage')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>

                <button

                  class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  :title="t('deleteImage')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>

              <!-- Main Image Badge -->
              <div v-if="image.isMain" class="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                {{ t('mainImage') }}
              </div>

              <!-- Set as Main Button @click="setAsMainImage(index)" -->
              <button
                v-if="!image.isMain"

                class="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded hover:bg-opacity-100 transition-all"
              >
                {{ t('setAsMain') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Autres champs existants -->
      <div class="mb-4">
        <Input
          :lb="t('hotelAddress')"
          :id="'hotelAddress'"
          :forLabel="'hotelAddress'"
          v-model="hotelInfo.address"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="mb-4">
          <Select :lb="t('Numberofstars')" :options="stars" />
        </div>

        <div class="mb-4">
          <Input
            :lb="t('hotelPhone')"
            :id="'hotelPhone'"
            :forLabel="'hotelPhone'"
            :inputType="'tel'"
            v-model="hotelInfo.phone"
          />
        </div>

        <div class="mb-4">
          <Input
            :lb="t('hotelEmail')"
            :id="'hotelEmail'"
            :forLabel="'hotelEmail'"
            :inputType="'email'"
            v-model="hotelInfo.email"
          />
        </div>
      </div>

      <!-- Image Viewer Modal @click="closeImageViewer" @click="closeImageViewer" -->
      <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" >
        <div class="max-w-4xl max-h-full p-4">
          <img :src="selectedImage.url" alt="'selectedImage.alt'" class="max-w-full max-h-full object-contain">
          <button

            class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, reactive, onMounted,defineAsyncComponent } from 'vue'
  import { useI18n } from 'vue-i18n'
  const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'));
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));

  // Types
  interface CloudinaryImage {
    id: string
    url: string
    thumbnailUrl?: string
    publicId: string
    isMain: boolean
    uploadedAt: Date
  }

  interface CloudinaryConfig {
    cloudName: string
    uploadPreset: string
    apiKey?: string
  }

  // Props
  interface Props {
    cloudinaryConfig?: CloudinaryConfig
    maxImages?: number
    maxFileSize?: number // en MB
  }

  const props = withDefaults(defineProps<Props>(), {
    maxImages: 10,
    maxFileSize: 10
  })

  // Emits
  const emit = defineEmits<{
    logoChanged: [url: string | null]
    imagesChanged: [images: CloudinaryImage[]]
  }>()

  // Composables
  const { t } = useI18n()

  // Reactive data
  const hotelInfo = reactive({
    name: '',
    address: '',
    phone: '',
    email: ''
  })

  const stars = ref([
    { value: 1, label: '1 étoile' },
    { value: 2, label: '2 étoiles' },
    { value: 3, label: '3 étoiles' },
    { value: 4, label: '4 étoiles' },
    { value: 5, label: '5 étoiles' }
  ])

  // Image management
  const logoUrl = ref<string | null>(null)
  const logoUploading = ref(false)
  const images = ref<CloudinaryImage[]>([])
  const imagesUploading = ref(false)
  const uploadProgress = ref(0)
  const dragOver = ref(false)
  const selectedImage = ref<CloudinaryImage | null>(null)

  // Refs
  const logoInput = ref<HTMLInputElement>()
  const imagesInput = ref<HTMLInputElement>()

  // Methods
  const triggerLogoUpload = () => {
    logoInput.value?.click()
  }

  const triggerImageUpload = () => {
    imagesInput.value?.click()
  }

  // const uploadToCloudinary = async (file: File, isLogo = false): Promise<CloudinaryImage | string> => {
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   formData.append('upload_preset', props.cloudinaryConfig.uploadPreset)

  //   if (isLogo) {
  //     formData.append('folder', 'hotels/logos')
  //   } else {
  //     formData.append('folder', 'hotels/gallery')
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://api.cloudinary.com/v1_1/${props.cloudinaryConfig.cloudName}/image/upload`,
  //       {
  //         method: 'POST',
  //         body: formData
  //       }
  //     )

  //     if (!response.ok) {
  //       throw new Error('Upload failed')
  //     }

  //     const data = await response.json()

  //     if (isLogo) {
  //       return data.secure_url
  //     } else {
  //       return {
  //         id: data.public_id,
  //         url: data.secure_url,
  //         thumbnailUrl: data.secure_url.replace('/upload/', '/upload/w_300,h_200,c_fill/'),
  //         publicId: data.public_id,
  //         isMain: images.value.length === 0,
  //         uploadedAt: new Date()
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Cloudinary upload error:', error)
  //     throw error
  //   }
  // }

  // const uploadLogo = async (event: Event) => {
  //   const target = event.target as HTMLInputElement
  //   const file = target.files?.[0]

  //   if (!file) return

  //   if (file.size > props.maxFileSize * 1024 * 1024) {
  //     alert(`Le fichier est trop volumineux. Taille maximum: ${props.maxFileSize}MB`)
  //     return
  //   }

  //   logoUploading.value = true

  //   try {
  //     const url = await uploadToCloudinary(file, true) as string
  //     logoUrl.value = url
  //     emit('logoChanged', url)
  //   } catch (error) {
  //     alert('Erreur lors de l\'upload du logo')
  //   } finally {
  //     logoUploading.value = false
  //     target.value = ''
  //   }
  // }

  // const uploadImages = async (event: Event) => {
  //   const target = event.target as HTMLInputElement
  //   const files = Array.from(target.files || [])

  //   if (files.length === 0) return

  //   if (images.value.length + files.length > props.maxImages) {
  //     alert(`Vous ne pouvez pas ajouter plus de ${props.maxImages} images`)
  //     return
  //   }

  //   imagesUploading.value = true
  //   uploadProgress.value = 0

  //   try {
  //     const uploadPromises = files.map(async (file, index) => {
  //       if (file.size > props.maxFileSize * 1024 * 1024) {
  //         throw new Error(`Fichier ${file.name} trop volumineux`)
  //       }

  //       const result = await uploadToCloudinary(file) as CloudinaryImage
  //       uploadProgress.value = Math.round(((index + 1) / files.length) * 100)
  //       return result
  //     })

  //     const uploadedImages = await Promise.all(uploadPromises)
  //     images.value.push(...uploadedImages)
  //     emit('imagesChanged', images.value)

  //   } catch (error) {
  //     alert('Erreur lors de l\'upload des images')
  //   } finally {
  //     imagesUploading.value = false
  //     uploadProgress.value = 0
  //     target.value = ''
  //   }
  // }

  // const handleDrop = (event: DragEvent) => {
  //   event.preventDefault()
  //   dragOver.value = false

  //   const files = Array.from(event.dataTransfer?.files || [])
  //   const imageFiles = files.filter(file => file.type.startsWith('image/'))

  //   if (imageFiles.length > 0) {
  //     // Simuler un événement change pour réutiliser la logique d'upload
  //     const fakeEvent = {
  //       target: {
  //         files: imageFiles
  //       }
  //     } as any
  //     uploadImages(fakeEvent)
  //   }
  // }

  // const removeLogo = () => {
  //   logoUrl.value = null
  //   emit('logoChanged', null)
  // }

  // const removeImage = async (index: number) => {
  //   const image = images.value[index]

  //   try {
  //     // Optionnel: supprimer de Cloudinary
  //     await fetch(
  //       `https://api.cloudinary.com/v1_1/${props.cloudinaryConfig.cloudName}/image/destroy`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           public_id: image.publicId,
  //           api_key: props.cloudinaryConfig.apiKey
  //         })
  //       }
  //     )
  //   } catch (error) {
  //     console.warn('Erreur lors de la suppression sur Cloudinary:', error)
  //   }

  //   images.value.splice(index, 1)

  //   // Si c'était l'image principale, définir la première comme principale
  //   if (image.isMain && images.value.length > 0) {
  //     images.value[0].isMain = true
  //   }

  //   emit('imagesChanged', images.value)
  // }

  // const setAsMainImage = (index: number) => {
  //   images.value.forEach((img, i) => {
  //     img.isMain = i === index
  //   })
  //   emit('imagesChanged', images.value)
  // }

  // const viewImage = (image: CloudinaryImage) => {
  //   selectedImage.value = image
  // }

  // const closeImageViewer = () => {
  //   selectedImage.value = null
  // }

  // // Expose methods for parent component
  // defineExpose({
  //   getLogoUrl: () => logoUrl.value,
  //   getImages: () => images.value,
  //   clearAll: () => {
  //     logoUrl.value = null
  //     images.value = []
  //   }
  // })
  </script>
