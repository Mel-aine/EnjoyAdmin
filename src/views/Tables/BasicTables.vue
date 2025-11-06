<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Basic Table 1">
        <BasicTableOne />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import { defineAsyncComponent as defineAsyncComponentBreadcrumb } from 'vue'
const PageBreadcrumb = defineAsyncComponentBreadcrumb(() => import("@/components/common/PageBreadcrumb.vue"));
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { defineAsyncComponent } from 'vue'
const ComponentCard = defineAsyncComponent(() => import("@/components/common/ComponentCard.vue"));
import BasicTableOne from "@/components/tables/basic-tables/BasicTableOne.vue";
const currentPageTitle = ref("Basic Tables");
</script>
