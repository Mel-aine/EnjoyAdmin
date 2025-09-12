<template>
  <div v-if="meta && meta.total > meta.perPage" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <!-- Info sur les résultats -->
    <div class="flex-1 justify-between sm:hidden">
      <!-- (Version mobile simplifiée) -->
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ $t('showing') }}
          <span class="font-medium">{{ (meta.currentPage - 1) * meta.perPage + 1 }}</span>
          {{ $t('to') }}
          <span class="font-medium">{{ Math.min(meta.currentPage * meta.perPage, meta.total) }}</span>
          {{ $t('of') }}
          <span class="font-medium">{{ meta.total }}</span>
         {{ $t('results') }}
        </p>
      </div>
      <!-- Contrôles de pagination -->
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Bouton Précédent -->
          <button
            @click="changePage(meta.currentPage - 1)"
            :disabled="!meta.previousPageUrl"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="h-5 w-5" />
          </button>

          <!-- Numéros de page (logique simplifiée) -->
          <button
            v-for="page in pages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
              page === meta.currentPage
                ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>

          <!-- Bouton Suivant -->
          <button
            @click="changePage(meta.currentPage + 1)"
            :disabled="!meta.nextPageUrl"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    previousPageUrl?: string | null;
    nextPageUrl?: string | null;
  };
}>();

const emit = defineEmits(['page-change']);

const changePage = (page: number) => {
  if (page > 0 && page <= props.meta.lastPage) {
    emit('page-change', page);
  }
};

// Logique simplifiée pour afficher les numéros de page
const pages = computed(() => {
  const pageArray: number[] = [];
  for (let i = 1; i <= props.meta.lastPage; i++) {
    pageArray.push(i);
  }
  // Pour de nombreuses pages, il faudrait une logique plus complexe (ex: 1, 2, ..., 10, 11, ..., 20)
  return pageArray;
});
</script>
