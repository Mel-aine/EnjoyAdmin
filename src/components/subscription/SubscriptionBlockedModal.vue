<template>
  <PopupModal :isOpen="isOpen" :closable="false" :title="$t('subscriptionBlocked.title')">
    <div class="space-y-4">
      <p class="text-sm text-slate-500 dark:text-white whitespace-pre-line">
        {{ $t('subscriptionBlocked.intro') }}
      </p>

      <div
        class="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-900 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-100"
      >
        <div class="text-sm font-semibold">{{ $t('subscriptionBlocked.goodToKnowTitle') }}</div>
        <ul class="mt-2 list-disc pl-5 text-sm space-y-1">
          <li>{{ $t('subscriptionBlocked.dataSafe') }}</li>
          <li>{{ $t('subscriptionBlocked.accessRestricted') }}</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="w-full px-6 pb-4 flex flex-col gap-2">
        <button
          type="button"
          @click="$emit('renew')"
          class="w-full px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
        >
          {{ $t('subscriptionBlocked.renewCta') }}
        </button>
        <a
          :href="supportMailtoUrl"
          class="w-full text-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:text-black transition"
        >
          {{ $t('subscriptionBlocked.contactSupport') }}
        </a>
      </div>
    </template>
  </PopupModal>
</template>

<script setup lang="ts">
import PopupModal from '@/components/modal/PopupModal.vue'

defineProps<{
  isOpen: boolean
  supportMailtoUrl: string
}>()

defineEmits<{
  (e: 'renew'): void
}>()
</script>
