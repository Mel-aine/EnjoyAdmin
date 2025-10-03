<template>
  <div class="space-y-2">
    <label v-if="$props.label" class="block text-sm font-medium text-gray-700">
      {{ $props.label }}
    </label>
    <CloneAutoCompleteSelect
      :model-value="$props.modelValue"
      @update:model-value="updateModelValue"
      :options="reasons"
      :default-value="$props.defaultValue || $t('SelectReason')"
      :is-required="$props.isRequired"
      :use-dropdown="useDropdown"
      :is-loading="isLoading"
      @update:useDropdown="onUseDropdownUpdate"
      @add-custom="handleAddCustomReason"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
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
  
  setup(props, { emit }) {
    const { t } = useI18n()
    const toast = useToast()
    const serviceStore = useServiceStore()
    const reasons = ref<Array<Reason & { isActive?: boolean }>>([])
    const isLoading = ref(false)
    const useDropdown = ref(true)
    const error = ref('')

    // Load reasons when category changes
    watch(() => props.category, async (newCategory) => {
      if (newCategory) {
        await loadReasons()
      } else {
        reasons.value = []
      }
    }, { immediate: true })

    const loadReasons = async () => {
      try {
        if (!serviceStore.serviceId) {
          throw new Error('Service ID not available')
        }
        
        if (!props.category) {
          console.warn('No category provided for ReasonSelector')
          reasons.value = []
          return
        }
        
        isLoading.value = true
        error.value = ''
        
        const response = await getByCategory(serviceStore.serviceId, props.category)
        
        if (Array.isArray(response?.data)) {
          reasons.value = response.data
            .map((reason: { reasonName?: string; name?: string; isActive?: boolean }) => ({
              value: reason.reasonName || reason.name || '',
              label: reason.reasonName || reason.name || '',
              isActive: reason.isActive !== false // default to true if not specified
            }))
            .filter((r: Reason & { isActive?: boolean }) => r.value && r.label && r.isActive)
            .sort((a, b) => a.label.localeCompare(b.label))
          
          // Log pour le débogage
          console.log(`Loaded ${reasons.value.length} reasons for category '${props.category}'`)
        } else {
          console.warn('Unexpected response format when loading reasons:', response)
          reasons.value = []
        }
      } catch (err) {
        console.error('Error loading reasons:', err)
        error.value = t('Failed to load reasons')
        reasons.value = []
      } finally {
        isLoading.value = false
      }
    }

    const updateModelValue = (value: string) => {
      emit('update:modelValue', value)
    }

    const onUseDropdownUpdate = (value: boolean) => {
      useDropdown.value = value
    }

    const handleAddCustomReason = async (reason: string) => {
      if (!serviceStore.serviceId) {
        error.value = t('Service ID not available')
        return false
      }
      
      if (!props.category) {
        error.value = t('Category is required')
        return false
      }
      
      try {
        isLoading.value = true
        error.value = ''
        
        const response = await postReason({
          reasonName: reason,
          category: props.category,
          isActive: true,
          hotelId: serviceStore.serviceId
        })

        if (response?.data) {
          const newReason = {
            value: response.data.reasonName || response.data.name || reason,
            label: response.data.reasonName || response.data.name || reason
          }
          
          // Ajouter la nouvelle raison en tête de liste
          reasons.value = [newReason, ...reasons.value]
          updateModelValue(newReason.value)
          emit('reason-added', newReason)
          
          // Afficher un message de succès
          toast.success(t('Reason added successfully'))
          return true
        }
        
        error.value = t('Unexpected response format when adding reason')
        return false
        
      } catch (err) {
        console.error('Error adding custom reason:', err)
        error.value = t('Failed to add custom reason')
        return false
      } finally {
        isLoading.value = false
      }
    }

    return {
      t,
      reasons,
      isLoading,
      useDropdown,
      error,
      updateModelValue,
      handleAddCustomReason,
      onUseDropdownUpdate
    }
  }
})
</script>
