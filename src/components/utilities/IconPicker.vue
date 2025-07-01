<template>
  <div>
    <button
      @click="openModal = true"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {{ t('iconPicker.chooseIcon') }}
    </button>

    <div class="mt-4 flex items-center gap-2">
      <span>{{ t('iconPicker.selectedIcon') }}</span>
      <i :class="`bi bi-${selectedIcon}`" class="text-xl"></i>
    </div>

    <!-- Modal -->
    <div
      v-if="openModal"
      class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] p-6 overflow-y-auto relative">
        <button
          @click="openModal = false"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h2 class="text-lg font-semibold mb-4">{{ t('iconPicker.selectAnIcon') }}</h2>
        <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4">
          <div
            v-for="icon in icons"
            :key="icon"
            @click="selectIcon(icon)"
            :title="icon"
            class="cursor-pointer p-3 border rounded-lg text-center hover:bg-gray-100"
            :class="{ 'border-blue-500 bg-blue-50': selectedIcon === icon }"
          >
            <i :class="`bi bi-${icon}`" class="text-2xl"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const openModal = ref(false)
const selectedIcon = ref('alarm') // default

// Replace with a full icon list if needed
const icons = [
  'alarm', 'app', 'arrow-down', 'arrow-up', 'bell', 'book', 'calendar',
  'camera', 'chat', 'check-circle', 'cloud', 'emoji-smile', 'envelope',
  'exclamation-circle', 'gear', 'heart', 'house', 'lightning', 'lock',
  'mic', 'pen', 'person', 'search', 'shield', 'star', 'trash', 'wifi'
]
const props = defineProps({
  modelValue: {
    type: String,
    default: 'alarm' // default icon
  }
})
const emit = defineEmits(['update:modelValue'])

function selectIcon(icon) {
  selectedIcon.value = icon
  emit('update:modelValue', icon)
  openModal.value = false
}
</script>