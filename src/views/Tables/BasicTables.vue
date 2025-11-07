<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('tables.basicTable1')">
        <BasicTableOne />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { ref, defineAsyncComponent } from 'vue'
const PageBreadcrumb = defineAsyncComponent(() => import("@/components/common/PageBreadcrumb.vue"))
const AdminLayout = defineAsyncComponent(() => import("@/components/layout/AdminLayout.vue"))
const ComponentCard = defineAsyncComponent(() => import("@/components/common/ComponentCard.vue"))
import BasicTableOne from "@/components/tables/basic-tables/BasicTableOne.vue";

const { t } = useI18n();
const currentPageTitle = computed(() => t('tables.basicTables'));
</script>
