<template>
  <AdminLayout>
    <FullScreenLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="space-y-5 sm:space-y-6  ">
          <AllBooking/>
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref,computed } from "vue";
import { defineAsyncComponent as defineAsyncComponentBreadcrumb } from 'vue'
const PageBreadcrumb = defineAsyncComponentBreadcrumb(() => import("@/components/common/PageBreadcrumb.vue"));
import AdminLayout from "@/components/layout/AdminLayout.vue";
// import ComponentCard from "@/components/common/ComponentCard.vue";
import AllBooking from "@/components/tables/booking-tables/AllBookingTable.vue";
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currentPageTitle = computed(()=>t("BookingLists"));


const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>
