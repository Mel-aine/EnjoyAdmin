<template>
  <AdminLayout>
    <CashieringCenterInterface :isCashering="true" />
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '../../components/layout/AdminLayout.vue'
import CashieringCenterInterface from './CashieringCenterInterface.vue'
</script>