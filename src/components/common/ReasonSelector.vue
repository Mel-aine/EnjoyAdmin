<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}<span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <CloneAutoCompleteSelect
      :model-value="modelValue"
      @update:model-value="updateModelValue"
      :options="reasons"
      :default-value="defaultValue || $t('SelectReason')"
      :is-required="isRequired"
      :use-dropdown="useDropdown"
      :is-loading="isLoading"
      @update:use-dropdown="onUseDropdownUpdate"
      @add-custom="handleAddCustomReason"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { getByCategory, postReason } from '@/services/configrationApi'
import { useServiceStore } from '@/composables/serviceStore'
import CloneAutoCompleteSelect from '@/components/forms/FormElements/CloneAutoCompleteSelect.vue'

interface Reason {
  value: string
  label: string
  isActive?: boolean
}

interface ReasonSelectorProps {
  modelValue: string
  category: string
  label?: string
  defaultValue?: string
  isRequired?: boolean
}

export default defineComponent({
  name: 'ReasonSelector',

  components: {
    CloneAutoCompleteSelect
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: ''
    },
    isRequired: {
      type: Boolean,
      default: true
    }
  },

  emits: ['update:modelValue', 'reason-added'],

  setup(props: ReasonSelectorProps, { emit }) {
    const { t } = useI18n()
    const toast = useToast()
    const serviceStore = useServiceStore()
    const reasons = ref<Reason[]>([])
    const isLoading = ref(false)
    const useDropdown = ref(true)
    const error = ref('')

    // Déclaration des méthodes avant leur utilisation
    const updateModelValue = (value: string) => {
      emit('update:modelValue', value)
    }

    const onUseDropdownUpdate = (value: boolean) => {
      useDropdown.value = value
    }

    const loadReasons = async () => {
      console.log('loadReasons called with category:', props.category)
      try {
        if (!serviceStore.serviceId) {
          console.error('Service ID not available in serviceStore:', serviceStore)
          throw new Error('Service ID not available')
        }

        if (!props.category) {
          console.warn('No category provided for ReasonSelector')
          reasons.value = []
          return
        }

        isLoading.value = true
        error.value = ''

        console.log('Calling getByCategory with:', {
          hotelId: serviceStore.serviceId,
          category: props.category
        })

        const response = await getByCategory(serviceStore.serviceId, props.category)

        console.log('API Response:', response)

        if (Array.isArray(response?.data)) {
          reasons.value = response.data
            .map((reason: { reasonName?: string; name?: string; isActive?: boolean }) => ({
              value: reason.reasonName || reason.name || '',
              label: reason.reasonName || reason.name || '',
              isActive: reason.isActive !== false // default to true if not specified
            }))
            .filter((r: Reason) => r.value && r.label && r.isActive)
            .sort((a, b) => a.label.localeCompare(b.label))

          console.log(`Loaded ${reasons.value.length} reasons for category '${props.category}':`, reasons.value)
        } else {
          console.warn('Unexpected response format when loading reasons:', response)
          console.log('Response data:', response?.data)
          reasons.value = []
        }
      } catch (err: unknown) {
        console.error('Error loading reasons:', err)
        const errorObj = err as {
          message: string
          response?: {
            data?: {
              message?: string
              [key: string]: unknown
            }
            status?: number
          }
        }
        console.log('Error details:', {
          message: errorObj?.message || 'Unknown error',
          response: errorObj?.response?.data,
          status: errorObj?.response?.status,
          category: props.category,
          hotelId: serviceStore.serviceId
        })
        error.value = t('Failed to load reasons')
        reasons.value = []
      } finally {
        isLoading.value = false
      }
    }

    const handleAddCustomReason = async (reason: string): Promise<boolean> => {
      if (!serviceStore.serviceId) {
        error.value = t('Service ID not available')
        return false
      }

      if (!props.category) {
        error.value = t('Category is required')
        return false
      }

      // Vérifier si la raison existe déjà dans la catégorie actuelle
      const reasonExists = reasons.value.some(
        r => r.value.toLowerCase() === reason.toLowerCase() ||
             r.label.toLowerCase() === reason.toLowerCase()
      )

      if (reasonExists) {
        error.value = t('This reason already exists in this category')
        toast.warning(t('This reason already exists in this category'))
        return false
      }

      try {
        isLoading.value = true
        error.value = ''

        const reasonData = {
          reasonName: reason,
          category: props.category,
          isActive: true,
          hotelId: serviceStore.serviceId
        }

        console.log('Sending reason data:', reasonData)

        const response = await postReason(reasonData)

        console.log('API Response:', response)

        if (response?.data) {
          console.log('Response data:', response.data)

          // Vérifier que la raison a bien été enregistrée avec la bonne catégorie
          if (response.data.category !== props.category) {
            console.warn('Warning: The reason was not saved with the expected category', {
              expected: props.category,
              received: response.data.category
            })
          }

          // Recharger la liste des raisons pour cette catégorie
          await loadReasons()

          // Mettre à jour la valeur sélectionnée avec la nouvelle raison
          const newReasonValue = response.data.reasonName || response.data.name || reason
          updateModelValue(newReasonValue)

          // Émettre l'événement pour informer le composant parent
          emit('reason-added', {
            value: newReasonValue,
            label: response.data.reasonName || response.data.name || reason,
            category: response.data.category || props.category
          })

          // Afficher un message de succès
          toast.success(t('Reason added successfully to category'))
          // toast.success(t('Reason added successfully to category: {category}', {
          //   category: response.data.category || props.category
          // }))
          return true
        }

        error.value = t('Unexpected response format when adding reason')
        return false

      } catch (err: unknown) {
        const errorObj = err as {
          message: string
          response?: {
            data?: {
              message?: string
              [key: string]: unknown
            }
            status?: number
          }
        }
        console.error('Error adding custom reason:', err)
        console.error('Error details:', {
          message: errorObj?.message || 'Unknown error',
          response: errorObj?.response?.data,
          status: errorObj?.response?.status,
          category: props.category,
          hotelId: serviceStore.serviceId
        })
        error.value = t('Failed to add custom reason: ') + errorObj?.message || 'Unknown error'
        return false
      } finally {
        isLoading.value = false
      }
    }

    // Load reasons when category changes
    watch(() => props.category, async (newCategory) => {
      console.log('Category changed:', newCategory)
      if (newCategory) {
        console.log('Loading reasons for category:', newCategory)
        await loadReasons()
      } else {
        console.log('No category provided, clearing reasons')
        reasons.value = []
      }
    }, { immediate: true })

    // Retourner toutes les propriétés nécessaires au template
    return {
      // Méthodes
      t,
      updateModelValue,
      handleAddCustomReason,
      onUseDropdownUpdate,

      // Références réactives
      reasons: reasons as unknown as Reason[],
      isLoading: isLoading as unknown as boolean,
      useDropdown: useDropdown as unknown as boolean,
      error: error as unknown as string,

      // Propriétés du composant nécessaires au template
      label: props.label,
      defaultValue: props.defaultValue
    }
  }
})
</script>
