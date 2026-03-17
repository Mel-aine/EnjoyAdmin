<template>
  <PopupModal :isOpen="isOpen" :closable="false" :title="$t('subscriptionExpiringSoon.title')">
    <div class="space-y-4">
      <p class="text-sm text-slate-500 dark:text-white whitespace-pre-line">
        {{ $t('subscriptionExpiringSoon.message', { days }) }}
      </p>

      <div
        class="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-900 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-100"
      >
        <div class="text-sm font-semibold">{{ $t('subscriptionExpiringSoon.countdownTitle') }}</div>
        <div class="mt-2 font-mono text-base">{{ countdownText }}</div>
      </div>
    </div>

    <template #footer>
      <div class="w-full px-6 pb-4 flex justify-end">
        <button
          type="button"
          @click="$emit('ack')"
          class="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
        >
          {{ $t('subscriptionExpiringSoon.ok') }}
        </button>
      </div>
    </template>
  </PopupModal>
</template>

<script setup lang="ts">
import PopupModal from '@/components/modal/PopupModal.vue'

defineProps<{
  isOpen: boolean
  days: number
  countdownText: string
}>()

defineEmits<{
  (e: 'ack'): void
}>()
</script>
