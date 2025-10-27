<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Set Offers</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-center py-12">
          <Settings class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Set Offers Configuration</h3>
          <p class="text-gray-500 dark:text-gray-400">
            Create and manage special offers and promotions.
          </p>
          <div class="mt-6">
            <BasicButton variant="primary">
              Configure Set Offers
            </BasicButton>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import { Settings } from 'lucide-vue-next'
</script>
