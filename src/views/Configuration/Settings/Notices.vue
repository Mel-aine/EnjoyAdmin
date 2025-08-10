<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Notices</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-center py-12">
          <Settings class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Notices Configuration</h3>
          <p class="text-gray-500">
            Manage system notices and announcements.
          </p>
          <div class="mt-6">
            <BasicButton variant="primary">
              Configure Notices
            </BasicButton>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/ui/BasicButton.vue'
import { Settings } from 'lucide-vue-next'
</script>
