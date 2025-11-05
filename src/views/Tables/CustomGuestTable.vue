<template>
  <AdminLayout>    
    <div class="space-y-6">
      <!-- Custom Guest Database Table -->
      <GuestDatabaseTable />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GuestDatabaseTable from '@/components/tables/GuestDatabaseTable.vue'
import AdminLayout from '../../components/layout/AdminLayout.vue';

const { t } = useI18n()

const breadcrumb = computed(() => [
  { label: t('tables.tables'), href: '#' },
  { label: t('tables.customGuestTable'), href: '#' }
])
</script>