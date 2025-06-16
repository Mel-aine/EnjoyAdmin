<template>
  <div class="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
        <component :is="icon" class="w-5 h-5 text-white" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ label }}</p>
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-gray-900" v-if="!status">{{ value }}</p>
          <span
            v-else
            class="px-3 py-1 rounded-full text-xs font-medium border"
            :class="getStatusColor(value)"
          >
            {{ value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon: Component
  label: string
  value: string | number
  status?: boolean
}

const props = defineProps<Props>()

function getStatusColor(status: string | number): string {
  const s = String(status).toLowerCase()

  switch (s) {
    case 'actif':
    case 'active':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'paid':
    case 'payee':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'confirmé':
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'en attente':
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'annulé':
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
</script>
