<template>
 <div
    v-if="meta && meta.total > meta.perPage"
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
  >

    <div class="flex flex-1 items-center justify-between sm:hidden">
      <button
        @click="changePage(meta.currentPage - 1)"
        :disabled="!meta.previousPageUrl"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t('previous') }}
      </button>
      <span class="text-sm text-gray-700">
        {{ $t('page') }} {{ meta.currentPage }} {{ $t('of') }} {{ meta.lastPage }}
      </span>
      <button
        @click="changePage(meta.currentPage + 1)"
        :disabled="!meta.nextPageUrl"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t('next') }}
      </button>
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

      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Bouton précédent -->
          <button
            @click="changePage(meta.currentPage - 1)"
            :disabled="!meta.previousPageUrl"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="h-5 w-5" />
          </button>

          <!-- Boutons de page -->
          <button
            v-for="(page, index) in pages"
            :key="index"
            @click="typeof page === 'number' && changePage(page)"
            :disabled="page === '...'"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
              page === meta.currentPage
                ? 'z-10 bg-indigo-600 text-white'
                : page === '...'
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>

          <!-- Bouton suivant -->
          <button
            @click="changePage(meta.currentPage + 1)"
            :disabled="!meta.nextPageUrl"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
  const totalPages = props.meta.lastPage;
  const current = props.meta.currentPage;
  const delta = 2;
  const range: (number | string)[] = [];

  // Toujours inclure la première et la dernière page
  const left = Math.max(2, current - delta);
  const right = Math.min(totalPages - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('...');

  // Pages autour de la page courante
  for (let i = left; i <= right; i++) {
    range.push(i);
  }
  if (right < totalPages - 1) range.push('...');
  if (totalPages > 1) range.push(totalPages);

  return range;
});
</script>
