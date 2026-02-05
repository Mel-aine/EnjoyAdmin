<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden group">
    <!-- Header -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <!-- Status Indicator -->
        <div
          :class="{
            'bg-green-100 text-green-600 dark:bg-green-900/30': card.status === 'active',
            'bg-red-100 text-red-600 dark:bg-red-900/30': card.status === 'revoked',
            'bg-amber-100 text-amber-600 dark:bg-amber-900/30': card.status === 'suspended',
            'bg-gray-100 text-gray-600 dark:bg-gray-800': card.status === 'lost'
          }"
          class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <Key class="w-6 h-6" />
        </div>

        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate capitalize">
            {{ card.user ? `${card.user.firstName} ${card.user.lastName}` : `${card.staffFirstName} ${card.staffLastName}` }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ $t('Card') }}: {{ card.cardUid }}
          </p>
        </div>

        <!-- Status Badge -->
        <div>
          <span
            :class="{
              'bg-green-100 text-green-700': card.status === 'active',
              'bg-red-100 text-red-700': card.status === 'revoked',
              'bg-amber-100 text-amber-700': card.status === 'suspended',
              'bg-gray-100 text-gray-700': card.status === 'lost'
            }"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          >
            {{ $t(card.status) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="p-4 space-y-3">
      <!-- Access Type -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">{{ $t('Access Type') }}</span>
        <span
          :class="{
            'text-blue-600 dark:text-blue-400': card.accessType === 'master',
            'text-amber-600 dark:text-amber-400': card.accessType === 'limited',
            'text-purple-600 dark:text-purple-400': card.accessType === 'temporary'
          }"
          class="font-medium"
        >
          {{
            card.accessType === 'master' ? $t('Master - All Rooms') :
            card.accessType === 'limited' ? $t('Limited') :
            $t('Temporary')
          }}
        </span>
      </div>

      <!-- Sync Status -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">{{ $t('Synchronized') }}</span>
        <div class="flex items-center space-x-2">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ card.syncedDoorsCount }} {{ $t('terminals') }}
          </span>
          <span
            :class="{
              'bg-green-500': card.syncStatus === 'synced',
              'bg-amber-500': card.syncStatus === 'pending',
              'bg-red-500': card.syncStatus === 'failed'
            }"
            class="w-2 h-2 rounded-full"
            :title="$t(card.syncStatus)"
          ></span>
        </div>
      </div>

      <!-- Validity Period (if temporary) -->
      <div v-if="card.validUntil" class="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <div class="flex items-center space-x-2">
          <Clock class="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div class="text-xs text-amber-700 dark:text-amber-300">
            <span class="font-medium">{{ $t('Expires') }}:</span>
            {{ formatDate(card.validUntil) }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-2 grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-gray-700">
        <!-- Sync Button -->
        <button
          @click="$emit('sync', card)"
          :disabled="syncing || revoking || card.status !== 'active'"
          :class="{
            'opacity-50 cursor-not-allowed': syncing || revoking || card.status !== 'active',
            'hover:bg-blue-100 dark:hover:bg-blue-900/30': card.status === 'active' && !syncing && !revoking
          }"
          class="flex items-center justify-center space-x-1.5 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors"
        >
          <RefreshCw :class="{ 'animate-spin': syncing }" class="w-4 h-4" />
          <span>{{ syncing ? $t('Syncing...') : $t('Re-Sync') }}</span>
        </button>

        <!-- Revoke Button -->
        <button
          @click="$emit('revoke', card)"
          :disabled="revoking || syncing || card.status !== 'active'"
          :class="{
            'opacity-50 cursor-not-allowed': revoking || syncing || card.status !== 'active',
            'hover:bg-red-100 dark:hover:bg-red-900/30': card.status === 'active' && !revoking && !syncing
          }"
          class="flex items-center justify-center space-x-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 :class="{ 'animate-pulse': revoking }" class="w-4 h-4" />
          <span>{{ revoking ? $t('Revoking...') : $t('Revoke') }}</span>
        </button>
      </div>

      <!-- Warning if not synced -->
      <div
         v-if="(card.syncStatus === 'failed' || card.syncStatus === 'pending') && card.status !== 'revoked'"
        class="p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
      >
        <div class="flex items-start space-x-2">
          <AlertCircle class="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p class="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            {{ card.syncStatus === 'pending' ?
              $t('Synchronization in progress...') :
              $t('Synchronization failed. Click Re-Sync to retry.')
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Key, RefreshCw, Trash2, AlertCircle, Clock } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import {formatDate} from '@/components/utilities/UtilitiesFunction'

interface MasterCard {
  id: number
  userId: number
  cardUid: string
  userIdOnDevice: string
  accessType: 'master' | 'limited' | 'temporary'
  status: 'active' | 'revoked' | 'lost' | 'suspended'
  validFrom: string | null
  validUntil: string | null
  syncStatus: 'pending' | 'synced' | 'failed'
  syncedDoorsCount: number
  user?: {
    firstName: string
    lastName: string
  }
}

const { t } = useI18n()

defineProps<{
  card: any
  syncing?: boolean
  revoking?: boolean
}>()

defineEmits<{
  sync: [card: MasterCard]
  revoke: [card: MasterCard]
  'view-details': [card: MasterCard]
}>()


</script>
