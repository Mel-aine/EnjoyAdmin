<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.workOfficeReport') }}
        </h1>
        <!-- <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.workOfficeReportDescription') }}
        </p> -->
      </div>

      <!-- Content will be added here later -->
      
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import ReportsLayout from '@/components/layout/ReportsLayout.vue';

const { t } = useI18n();

onMounted(() => {
  console.log('=== WORK OFFICE REPORT COMPONENT MOUNTED ===');
  console.log('Current route:', window.location.pathname);
  console.log('i18n ready:', t('reports.backOffice.workOfficeReport'));
  console.log('==========================================');
});
</script>

<style scoped>
/* Add styles here when needed */
</style>
