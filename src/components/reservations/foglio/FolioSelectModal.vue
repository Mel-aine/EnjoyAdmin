<template>
  <RightSideModal :is-open="isOpen" :title="$t('selectFolio')" @close="closeModal">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <FileText class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ $t('selectFolio') }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ guestName }}</p>
        </div>
      </div>
    </template>

    <div class="mt-4 px-1">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-3">
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/5 animate-pulse mb-4"></div>
        <div v-for="n in 3" :key="n"
          class="animate-pulse rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex justify-between items-start">
            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
              </div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div class="space-y-2 text-right">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14 ml-auto"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-4">
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="folios.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          <FileX class="w-7 h-7 text-gray-400" />
        </div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('noFoliosFound') }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ $t('noFoliosFoundDescription') }}</p>
      </div>

      <!-- Folio List -->
      <div v-else class="space-y-3">
        <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          {{ folios.length }} {{ $t('folio') }}{{ folios.length > 1 ? 's' : '' }} {{ $t('available') }}
        </p>

        <div
          v-for="folio in folios" :key="folio.id"
          @click="selectFolio(folio)"
          class="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary hover:shadow-md dark:hover:border-primary transition-all duration-200 overflow-hidden">

          <!-- Top section -->
          <div class="p-4">
            <div class="flex justify-between items-start gap-3">
              <!-- Left: Folio info -->
              <div class="flex items-start gap-3 min-w-0">
                <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Receipt class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="font-semibold text-sm text-gray-900 dark:text-white">
                      {{ $t('folio') }} #{{ folio.folioNumber || folio.id }}
                    </p>
                    <span :class="statusClass(folio.status)" class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium">
                      <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(folio.status)"></span>
                      {{ folio.status }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {{ folio.guestName || guestName }}
                  </p>
                </div>
              </div>

              <!-- Right: Total amount -->
              <div class="text-right flex-shrink-0">
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(folio.totalCharges ?? 0) }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ $t('total') }}</p>
              </div>
            </div>
          </div>

          <!-- Bottom section: financials strip -->
          <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-green-400"></span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('paid') }}</span>
              <span class="text-xs font-semibold text-green-600 dark:text-green-400 ml-1">
                {{ formatCurrency(folio.totalPayments ?? 0) }}
              </span>
            </div>
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-red-400"></span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('balance') }}</span>
              <span class="text-xs font-semibold ml-1"
                :class="(folio.balance ?? 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'">
                {{ formatCurrency(folio.balance ?? 0) }}
              </span>
            </div>
            <div class="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-xs font-medium">{{ $t('select') }}</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end bg-gray-50 dark:bg-gray-800 ">
        <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')" />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FileText, Receipt, ChevronRight, FileX } from 'lucide-vue-next'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import { formatCurrency } from '../../utilities/UtilitiesFunction'

interface Folio {
  id: number
  folioNumber?: string
  guestName?: string
  status: string
  totalCharges?: number
  totalPayments?: number
  balance?: number
}

interface Props {
  isOpen: boolean
  folios: Folio[]
  guestName?: string
  loading?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'folio-selected', folio: Folio): void
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  folios: () => [],
  guestName: '',
  loading: false,
})

const emit = defineEmits<Emits>()
const isLoading = ref(false)

watch(() => props.isOpen, (val) => {
  if (val) isLoading.value = props.loading
})
watch(() => props.loading, (val) => {
  isLoading.value = val
})

const statusClass = (status: string) => ({
  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': status === 'open',
  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300': status === 'closed',
  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': status !== 'open' && status !== 'closed',
})

const statusDotClass = (status: string) => ({
  'bg-green-500': status === 'open',
  'bg-gray-400': status === 'closed',
  'bg-yellow-500': status !== 'open' && status !== 'closed',
})

const closeModal = () => emit('close')

const selectFolio = (folio: Folio) => {
  emit('folio-selected', folio)
  closeModal()
}
</script>
