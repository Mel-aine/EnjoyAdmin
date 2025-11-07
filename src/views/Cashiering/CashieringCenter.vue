<template>
  <AdminLayout>
    <CashieringCenterInterface :isCashering="true" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const AdminLayout = defineAsyncComponent(() => import('../../components/layout/AdminLayout.vue'))
import CashieringCenterInterface from './CashieringCenterInterface.vue'
</script>