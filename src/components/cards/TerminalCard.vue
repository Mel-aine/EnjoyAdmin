<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden group">
    <!-- Header -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate flex-1">
          {{ terminal.name }}
        </h3>
        <span
          :class="{
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': terminal.isActive,
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': !terminal.isActive
          }"
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
        >
          <span
            class="w-2 h-2 rounded-full mr-1.5 animate-pulse"
            :class="terminal.isActive ? 'bg-green-600' : 'bg-red-600'"
          ></span>
          {{ terminal.isActive ? $t('Online') : $t('Offline') }}
        </span>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <Wifi class="w-4 h-4 mr-2" />
          <span class="font-mono">{{ terminal.ipAddress }}:{{ terminal.port }}</span>
        </div>

        <div v-if="terminal.room" class="flex items-center text-gray-600 dark:text-gray-400">
          <Home class="w-4 h-4 mr-2" />
          <span class="font-medium text-gray-900 dark:text-white">{{ terminal.room.roomNumber }}</span>
          <span class="mx-2">·</span>
          <span class="text-xs">{{ terminal.room.roomType?.roomTypeName }}</span>
        </div>
        <div v-else class="flex items-center text-gray-400">
          <AlertCircle class="w-4 h-4 mr-2" />
          <span class="text-xs">{{ $t('Not assigned to a room') }}</span>
        </div>

        <!-- NOUVEAU: Statut de synchronisation des accès -->
        <div v-if="terminal.activeAccessCount !== undefined" class="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center text-gray-600 dark:text-gray-400">
            <Users class="w-4 h-4 mr-2" />
            <span class="text-xs">{{ $t('Active Access') }}</span>
          </div>
          <span
            :class="{
              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': terminal.activeAccessCount > 0,
              'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400': terminal.activeAccessCount === 0
            }"
            class="px-2 py-0.5 rounded-full text-xs font-semibold"
          >
            {{ terminal.activeAccessCount }} {{ terminal.activeAccessCount > 1 ? $t('users') : $t('user') }}
          </span>
        </div>

        <!-- NOUVEAU: Dernier accès synchronisé -->
        <div v-if="terminal.lastAccessSync" class="flex items-center text-gray-500 dark:text-gray-400 text-xs">
          <Clock class="w-3 h-3 mr-1.5" />
          <span>{{ $t('Last sync') }}: {{ formatRelativeTime(terminal.lastAccessSync) }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="p-4 bg-gray-50 dark:bg-gray-900/30">
      <div class="grid grid-cols-2 gap-2">
        <!-- Unlock Button (Primary Action) -->
        <button
          @click="$emit('unlock', terminal)"
          :disabled="isAnyActionRunning"
          :class="{
            'opacity-50 cursor-not-allowed': isAnyActionRunning,
            'hover:shadow-lg hover:scale-100': !isAnyActionRunning
          }"
          class="col-span-2 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg transition-all shadow-md font-medium"
        >
          <Unlock :class="{ 'animate-pulse': unlocking }" class="w-5 h-5" />
          <span>{{ unlocking ? $t('Unlocking...') : $t('Unlock Door (5min)') }}</span>
        </button>

        <!-- Sync Time Button -->
        <button
          @click="$emit('retry-terminal', terminal)"
          :disabled="isAnyActionRunning"
          :class="{
            'opacity-50 cursor-not-allowed': isAnyActionRunning,
            'hover:bg-gray-100 dark:hover:bg-gray-700': !isAnyActionRunning
          }"
          class="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition-all border border-gray-200 dark:border-gray-600 text-sm"
        >

           <RefreshCcw class="w-4 h-4" :class="{ 'animate-spin': syncingTime }" />
          <span>{{ $t('Retry access') }}</span>
        </button>

        <!-- Logs Button -->
        <button
          @click="$emit('logs', terminal)"
          :disabled="isAnyActionRunning"
          :class="{
            'opacity-50 cursor-not-allowed': isAnyActionRunning,
            'hover:bg-gray-100 dark:hover:bg-gray-700': !isAnyActionRunning
          }"
          class="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition-all border border-gray-200 dark:border-gray-600 text-sm"
        >
          <FileText :class="{ 'animate-pulse': loadingLogs }" class="w-4 h-4" />
          <span>{{ $t('View Access Logs') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Wifi, Home, AlertCircle, Unlock, RefreshCcw, FileText, Users } from 'lucide-vue-next'
import { DateTime } from 'luxon'

interface Terminal {
  id: number
  name: string
  ipAddress: string
  port: number
  roomId: number | null
  isActive: boolean
  activeAccessCount?: number  // NOUVEAU
  lastAccessSync?: string      // NOUVEAU
  room?: {
    roomNumber: string
    roomType?: { roomTypeName: string }
  }
}

const props = defineProps<{
  terminal: Terminal
  unlocking?: boolean
  loadingInfo?: boolean
  syncingTime?: boolean
  loadingLogs?: boolean
}>()

defineEmits<{
  unlock: [terminal: Terminal]
  info: [terminal: Terminal]
  'retry-terminal': [terminal: Terminal]
  logs: [terminal: Terminal]
}>()

const isAnyActionRunning = computed(() => {
  return props.unlocking || props.loadingInfo || props.syncingTime || props.loadingLogs
})

const formatRelativeTime = (dateString: string) => {
  const date = DateTime.fromISO(dateString)
  const diff = DateTime.now().diff(date, ['hours', 'minutes']).toObject()

  if (diff.hours && diff.hours >= 1) {
    return `${Math.floor(diff.hours)}h ago`
  } else if (diff.minutes) {
    return `${Math.floor(diff.minutes)}min ago`
  } else {
    return 'Just now'
  }
}
</script>
