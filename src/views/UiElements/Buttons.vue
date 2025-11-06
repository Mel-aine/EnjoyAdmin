<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Primary Button">
        <div class="flex items-center gap-5">
          <Button size="sm" variant="primary"> Button Text </Button>
          <Button size="md" variant="primary"> Button Text </Button>
        </div>
      </ComponentCard>
      <ComponentCard title="Primary Button with Left Icon">
        <div class="flex items-center gap-5">
          <Button size="sm" variant="primary" :startIcon="BoxIcon"> Button Text </Button>
          <Button size="md" variant="primary" :startIcon="BoxIcon"> Button Text </Button>
        </div>
      </ComponentCard>
      <ComponentCard title="Primary Button with Right Icon">
        <div class="flex items-center gap-5">
          <Button size="sm" variant="primary" :endIcon="BoxIcon"> Button Text </Button>
          <Button size="md" variant="primary" :endIcon="BoxIcon"> Button Text </Button>
        </div>
      </ComponentCard>
      <ComponentCard title="Primary Button">
        <div class="flex items-center gap-5">
          <Button size="sm" variant="outline"> Button Text </Button>
          <Button size="md" variant="outline"> Button Text </Button>
        </div>
      </ComponentCard>
      <ComponentCard title="Primary Button with Left Icon">
        <div class="flex items-center gap-5">
          <Button size="sm" variant="outline" :startIcon="BoxIcon"> Button Text </Button>
          <Button size="md" variant="outline" :startIcon="BoxIcon"> Button Text </Button>
        </div>
      </ComponentCard>
      <ComponentCard title="Primary Button with Right Icon">
        <div class="flex items-center gap-5">
          <Button size="sm" variant="outline" :endIcon="BoxIcon"> Button Text </Button>
          <Button size="md" variant="outline" :endIcon="BoxIcon"> Button Text </Button>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { defineAsyncComponent as defineAsyncComponentBreadcrumb } from 'vue'
const PageBreadcrumb = defineAsyncComponentBreadcrumb(() => import('@/components/common/PageBreadcrumb.vue'))
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { defineAsyncComponent } from 'vue'
const ComponentCard = defineAsyncComponent(() => import('@/components/common/ComponentCard.vue'))
// import Button from '@/components/ui/Button.vue'
import { BoxIcon } from '@/icons'
const currentPageTitle = ref('Buttons')
</script>

<style></style>
