<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="space-y-5 sm:space-y-6">
        <ReservationGrid />
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ReservationGrid from "@/components/grids/ReservationGrid.vue";
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currentPageTitle = computed(() => t("Reservation Grid View"));
</script>