<template>
  <div class="flex justify-between items-center py-1">
    <span class="text-sm font-medium text-gray-600">{{ label }}:</span>
    <span class="text-sm text-gray-900">
      <span v-if="type === 'boolean'" class="inline-flex items-center">
        <svg v-if="isTrue" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <svg v-else class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span class="ml-1">{{ isTrue ? $t('yes') : $t('no') }}</span>
      </span>
      <span v-else-if="type === 'badge'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getBadgeClass(value)">
        {{ value || '-' }}
      </span>
      <span v-else>
        {{ value || '-' }}{{ suffix }}
      </span>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [String, Number, Boolean],
  type: {
    type: String,
    default: 'text'
  },
  suffix: {
    type: String,
    default: ''
  }
})

const isTrue = computed(() => {
  if (props.type === 'boolean') {
    return props.value === true || props.value === 'true' || props.value === 'oui' || props.value === 'yes'
  }
  return false
})

const getBadgeClass = (status) => {
  const statusMap = {
    'available': 'bg-green-100 text-green-800',
    'occupied': 'bg-red-100 text-red-800',
    'maintenance': 'bg-yellow-100 text-yellow-800',
    'booked': 'bg-blue-100 text-blue-800'
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}
</script>
