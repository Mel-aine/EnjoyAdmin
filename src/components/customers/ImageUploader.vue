<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>
    <div
      class="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-40 relative"
      :class="{ 'opacity-50 cursor-not-allowed': props.disabled }"
    >

      <!-- État de chargement (seulement pendant l'upload) -->
      <div v-if="isUploading" class="space-y-2 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p class="text-sm text-gray-600">{{ $t('uploadInProgress') }}</p>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-orange-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Zone de drop/upload -->
      <div
        v-else-if="!previewUrl && !modelValue"
        class="space-y-1 text-center w-full flex flex-col items-center justify-center"
        @dragover.prevent="!props.disabled && (dragOver = true)"
        @dragleave.prevent="!props.disabled && (dragOver = false)"
        @drop.prevent="!props.disabled && handleDrop"

        :class="{ 'bg-orange-50 border-orange-300': dragOver }"
      >
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="flex text-sm text-gray-600">
          <label :for="`file-upload-${uniqueId}`" class="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
            <span class="font-normal text-sm">{{ dragOver ? $t('upload.drop_file') : $t('upload.select_file') }}</span>
            <input
              :id="`file-upload-${uniqueId}`"
              name="file-upload"
              type="file"
              class="sr-only"
              accept="image/*"
              :disabled="props.disabled"
              @change="handleImageSelect"
            >
          </label>
          <!-- <p class="pl-1">ou glissez-déposez</p> -->
        </div>
        <p class="text-xs text-gray-500">PNG, JPG, GIF, WEBP {{ $t('upto') }} {{ maxSizeMB }}MB</p>
      </div>

      <!-- Aperçu de l'image -->
      <div v-else class="relative h-full w-full">
        <img
          :src="previewUrl || modelValue || ''"
          alt="Preview"
          class="h-full w-full object-contain rounded-md"
        />
        <button
          type="button"
          @click="!props.disabled && removeImage()"
          class="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          :disabled="isUploading || props.disabled"
        >
          <svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Indicateur d'état -->
        <div class="absolute bottom-1 right-1">
          <!-- Image uploadée (URL Cloudinary) -->
          <div v-if="modelValue && !selectedFile" class="bg-green-500 rounded-full p-1">
            <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <!-- Image sélectionnée mais pas encore uploadée -->
          <div v-else-if="selectedFile" class="bg-orange-500 rounded-full p-1">
            <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        <!-- Badge informatif -->
        <div class="absolute top-1 left-1">
          <span v-if="modelValue && !selectedFile" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {{ $t('uploaded') }}
          </span>
          <span v-else-if="selectedFile" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {{ $t('pending') }}
          </span>
        </div>
      </div>

      <!-- Messages d'erreur -->
      <div v-if="error" class="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
        {{ error }}
        <button
          type="button"
          @click="clearError"
          class="ml-2 text-red-800 hover:text-red-900 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch ,readonly} from 'vue'
import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config'

interface Props {
  modelValue: string | null
  label?: string
  maxSizeMB?: number
  cloudinaryConfig?: {
    cloudName: string
    uploadPreset: string
    apiKey?: string
  }
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  maxSizeMB: 10,
  disabled: false,
  cloudinaryConfig: () => ({
    cloudName: CLOUDINARY_NAME || '',
    uploadPreset: CLOUDINARY_UPLOAD_PRESET || '',
  })
})

const emit = defineEmits([
  'update:modelValue',
  'file-selected',
  'upload-success',
  'upload-error',
  'file-removed'
])

// État du composant
const isUploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const dragOver = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// ID unique pour éviter les conflits
const uniqueId = computed(() => Math.random().toString(36).substr(2, 9))

// Validation du fichier
const validateFile = (file: File): boolean => {
  error.value = ''

  // Vérifier le type de fichier
  if (!file.type.startsWith('image/')) {
    error.value = 'Veuillez sélectionner un fichier image valide'
    return false
  }

  // Vérifier la taille
  const maxSizeBytes = props.maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    error.value = `Le fichier est trop volumineux. Taille maximum: ${props.maxSizeMB}MB`
    return false
  }

  return true
}

// Créer une URL de prévisualisation locale
const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

// Sélection de fichier (sans upload)
const selectFile = (file: File) => {
  if (!validateFile(file)) return

  // Nettoyer l'ancienne URL de prévisualisation
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  selectedFile.value = file
  previewUrl.value = createPreviewUrl(file)
  error.value = ''

  // Informer le parent qu'un fichier a été sélectionné
  emit('file-selected', { file, preview: previewUrl.value })
}

// Upload vers Cloudinary (appelé depuis l'extérieur)
const uploadToCloudinary = async (): Promise<string> => {
  if (!selectedFile.value) {
    throw new Error('Aucun fichier sélectionné')
  }

  isUploading.value = true
  uploadProgress.value = 0
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('upload_preset', props.cloudinaryConfig.uploadPreset)
    formData.append('folder', 'customers')
    formData.append('quality', 'auto:good')
    formData.append('fetch_format', 'auto')

    // Simulation du progrès
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 20
      }
    }, 200)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${props.cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    clearInterval(progressInterval)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Erreur lors de l\'upload')
    }

    const data = await response.json()
    uploadProgress.value = 100

    // Nettoyer après succès
    setTimeout(() => {
      isUploading.value = false
      uploadProgress.value = 0

      // Nettoyer l'URL de prévisualisation locale
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
      }

      selectedFile.value = null
      emit('update:modelValue', data.secure_url)
      emit('upload-success', { url: data.secure_url, file: selectedFile.value })
    }, 500)

    return data.secure_url

  } catch (err: any) {
    isUploading.value = false
    uploadProgress.value = 0
    error.value = err instanceof Error ? err.message : 'Erreur lors de l\'upload'
    emit('upload-error', err)
    throw err
  }
}

// Handlers d'événements
const handleImageSelect = (event: Event) => {
   if (props.disabled) return
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectFile(file)
  }
  // Réinitialiser l'input pour permettre le même fichier
  target.value = ''
}

const handleDrop = (event: DragEvent) => {
   if (props.disabled) return
  dragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    selectFile(file)
  }
}

const removeImage = () => {
   if (props.disabled) return
  if (!isUploading.value) {
    // Nettoyer l'URL de prévisualisation
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }

    selectedFile.value = null
    emit('update:modelValue', null)
    emit('file-removed')
    error.value = ''
  }
}

const clearError = () => {
  error.value = ''
}

// Fonction utilitaire pour vérifier si un fichier est sélectionné
const hasSelectedFile = () => {
  return selectedFile.value !== null
}

// Exposer les méthodes pour le composant parent
defineExpose({
  uploadToCloudinary,
  hasSelectedFile,
  selectedFile: readonly(selectedFile)
})

// Nettoyer les URLs à la destruction du composant
watch(() => previewUrl.value, (newUrl, oldUrl) => {
  if (oldUrl) {
    URL.revokeObjectURL(oldUrl)
  }
})
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
