<template>
  <AdminLayout>
      <div class="space-y-5 sm:space-y-6">
        <ReservationGrid />
      </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const AdminLayout = defineAsyncComponent(() => import("@/components/layout/AdminLayout.vue"));
import ReservationGrid from "@/components/grids/ReservationGrid.vue";
</script>