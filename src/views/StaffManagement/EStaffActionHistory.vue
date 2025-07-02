<template>
  <AdminLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">{{ $t('actionHistory.title') }}</h2>
        <p class="text-gray-600 mt-1">{{ $t('actionHistory.subtitle') }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('actionHistory.recentActivities') }}</h3>
        </div>
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div v-else>
          <div class="divide-y divide-gray-200">
            <div
              v-for="log in actionLogs"
              :key="log.id"
              class="px-6 py-4 hover:bg-gray-50"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <span class="text-lg">{{ getActionIcon(log.action) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getActionColor(log.action)"
                    >
                      {{ $t(`actionHistory.actions.${log.action}`) }}
                    </span>
                    <span class="text-sm text-gray-500 capitalize">{{ $t(`actionHistory.entities.${log.entity_type}`) }}</span>
                  </div>
                  <p class="text-sm text-gray-900 mt-1">{{ log.details }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ new Date(log.timestamp).toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="actionLogs.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('actionHistory.noLogs') }}</h3>
            <p class="text-gray-500">{{ $t('actionHistory.noLogsMsg') }}</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { actionsMock } from "@/assets/data/staffData";
import AdminLayout from '@/components/layout/AdminLayout.vue';

const { t } = useI18n()
const actionLogs = ref([])
const loading = ref(true)

function getActionIcon(action: string) {
  switch (action) {
    case 'created': return '➕'
    case 'updated': return '✏️'
    case 'deleted': return '🗑️'
    case 'completed': return '✅'
    default: return '📝'
  }
}
function getActionColor(action: string) {
  switch (action) {
    case 'created': return 'bg-green-100 text-green-800'
    case 'updated': return 'bg-blue-100 text-blue-800'
    case 'deleted': return 'bg-red-100 text-red-800'
    case 'completed': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

onMounted(async () => {
  try {
    actionLogs.value = actionsMock
  } catch (error) {
    // handle error
  } finally {
    loading.value = false
  }
})
</script>