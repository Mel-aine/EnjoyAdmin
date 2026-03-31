<template>
  <div v-if="visible" class="sticky top-0 z-50 px-3 pt-3">
    <div class="rounded-2xl border border-orange-200 bg-orange-50 text-orange-950 shadow-sm">
      <div class="flex items-start gap-4 p-4">
        <div class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            class="h-5 w-5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              v-if="typeLabel"
              class="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800"
            >
              {{ typeLabel }}
            </span>
            <span v-if="windowText" class="text-xs text-orange-800/80">
              {{ windowText }}
            </span>
          </div>

          <div v-if="title" class="mt-2 text-base font-semibold leading-6">
            {{ title }}
          </div>
          <div class="mt-2 text-sm leading-6 text-orange-900/90 whitespace-pre-line break-words">
            {{ content }}
          </div>
        </div>

        <button
          type="button"
          class="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-orange-700 hover:bg-orange-100 transition"
          @click="$emit('dismiss')"
          aria-label="Close"
        >
          <span class="text-xl leading-none">×</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  typeLabel?: string
  windowText?: string
  title?: string
  content: string
}>()

defineEmits<{
  (e: 'dismiss'): void
}>()
</script>
