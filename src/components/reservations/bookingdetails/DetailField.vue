<template>
  <div class="detail-field">
    <span class="text-xs text-gray-500 dark:text-gray-400">
      {{ label }}:
    </span>

    <template v-if="!value || value === '-'">
      <p class="text-sm text-gray-400 dark:text-gray-500 italic">N/A</p>
    </template>

    <template v-else-if="type === 'email'">
      <a
        :href="`mailto:${value}`"
        class="text-sm text-blue-600 dark:text-blue-400 hover:underline block font-medium"
      >
        {{ value }}
      </a>
    </template>

    <template v-else>
      <p class="text-sm font-medium">{{ value }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// Définition des props avec des valeurs par défaut
defineProps({

  label: {
    type: String,
    required: true,
  },

  value: {
    type: [String, Number, Date, Object],
    required: false,
    default: null,
  },
  type: {
    type: String,
    required: false,
    default: 'text',
    validator: (value: string) => ['text', 'email', 'date'].includes(value)
  },
});
</script>

<style scoped>
.detail-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem; /* Ajustez selon vos besoins d'espacement */
}
</style>
