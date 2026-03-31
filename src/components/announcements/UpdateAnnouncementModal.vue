<template>
  <PopupModal :isOpen="isOpen" :closable="false" :title="title">
    <div class="space-y-4">
      <p class="text-sm text-slate-500 dark:text-white whitespace-pre-line">
        {{ content }}
      </p>
    </div>
    <template #footer>
      <div class="w-full px-6 pb-4 flex justify-end">
        <button
          type="button"
          @click="$emit('ack')"
          class="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
        >
          {{ okText }}
        </button>
      </div>
    </template>
  </PopupModal>
</template>

<script setup lang="ts">
import PopupModal from '@/components/modal/PopupModal.vue'

defineProps<{
  isOpen: boolean
  title: string
  content: string
  okText: string
}>()

defineEmits<{
  (e: 'ack'): void
}>()
</script>
