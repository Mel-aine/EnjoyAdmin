<template>
  <AdminLayout>    
    <div class="space-y-6">
      <!-- Custom Guest Database Table -->
      <GuestDatabaseTable />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import GuestDatabaseTable from '@/components/tables/GuestDatabaseTable.vue'
import { defineAsyncComponent } from 'vue'
const AdminLayout = defineAsyncComponent(() => import('../../components/layout/AdminLayout.vue'));

const breadcrumb = [
  { label: 'Tables', href: '#' },
  { label: 'Custom Guest Table', href: '#' }
]
</script>