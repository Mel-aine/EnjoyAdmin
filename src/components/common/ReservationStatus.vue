<template>
  <span :class="[
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    statusConfig.bgColor,
    statusConfig.textColor
  ]">
    {{ $t(statusConfig.label) }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ReservationStatus } from '@/types/reservation'

interface Props {
  status: string
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true
})

const statusConfig = computed(() => {
  switch (props.status) {
    case ReservationStatus.CONFIRMED:
      return {
        label: 'confirmed',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-400'
      }
    case ReservationStatus.PENDING:
      return {
        label: 'pending',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-400'
      }
    case ReservationStatus.CANCELLED:
      return {
        label: 'cancelled',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-400'
      }
    case ReservationStatus.CHECKED_IN:
      return {
        label: 'in_house',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-400'
      }
    case 'checked_in':
      return {
        label: 'in_house',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-400'
      }
    case ReservationStatus.CHECKED_OUT:
      return {
        label: 'checked_out',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        textColor: 'text-purple-700 dark:text-purple-400'
      }
    case ReservationStatus.NOSHOW:
      return {
        label: 'no_show',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        textColor: 'text-orange-700 dark:text-orange-400'
      }
    case ReservationStatus.VOIDED:
      return {
        label: 'voided',
        bgColor: 'bg-gray-100 dark:bg-gray-900/20',
        textColor: 'text-gray-700 dark:text-gray-400'
      }
    default:
      return {
        label: props.status,
        bgColor: 'bg-gray-100 dark:bg-gray-900/20',
        textColor: 'text-gray-700 dark:text-gray-400'
      }
  }
})
</script>