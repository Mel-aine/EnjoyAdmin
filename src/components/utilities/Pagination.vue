<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  totalPage: {
    type: Number,
    required: true
  },
  totalElement: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  }
});

const emits = defineEmits<{
  (e: 'update:currentPage', value: number): void;
}>();

const fromElement = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1;
});

const toElement = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalElement);
});

const pages = computed(() => {
  return Array.from({ length: props.totalPage }, (_, i) => i + 1);
});

const prevPage = () => {
  if (props.currentPage > 1) {
    emits('update:currentPage', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPage) {
    emits('update:currentPage', props.currentPage + 1);

  }
};

const goToPage = (page: number) => {
  if (page !== props.currentPage) {
    emits('update:currentPage', page);
  }
};
</script>

<template>
  <div class="flex items-center justify-between border-t border-slate-200 bg-white dark:bg-boxdark px-4 py-3 sm:px-6">
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
      <p class="text-sm text-slate-700">
       {{ $t('showing') }}
        <span class="font-medium">{{ fromElement }}</span>
       {{ $t('to') }}
        <span class="font-medium">{{ toElement }}</span>
        {{ $t('of') }}
        <span class="font-medium">{{ totalElement }}</span>
        {{ $t('results') }}
      </p>

      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <ul class="inline-flex -space-x-px text-base h-10">
          <li>
            <button
              @click="prevPage"
              :disabled="props.currentPage === 1"
              class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-slate-500 bg-white border border-e-0 border-slate-300 rounded-s-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Page précédente"
            >
             {{ $t('previous') }}
            </button>
          </li>

          <li v-for="page in pages" :key="page">
            <button
              @click="goToPage(page)"
              :class="[
                'flex items-center justify-center px-4 h-10 leading-tight border',
                page === props.currentPage
                  ? 'text-black bg-slate-200 border-slate-300'
                  : 'text-slate-500 bg-white border-slate-300 hover:bg-slate-100 hover:text-slate-700'
              ]"
              :aria-label="`Page ${page}`"
            >
              {{ page }}
            </button>
          </li>

          <li>
            <button
              @click="nextPage"
              :disabled="props.currentPage === props.totalPage"
              class="flex items-center justify-center px-4 h-10 leading-tight text-slate-500 bg-white border border-slate-300 rounded-e-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Page suivante"
            >
              {{ $t('next') }}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
