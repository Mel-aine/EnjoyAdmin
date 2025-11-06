<template>
  <div class="p-6">
    <div>
      <ReusableTable :columns="columns" :data="paginatedData" :loading="loading" :title="''" :showPagination="true"
        :searchable="false" :show-header="false">

        <template #column-date="{item}">
          <div>{{ formatDateT(item.createdAt) }}</div>
        </template>

       <template #column-user="{item}">
          <div>{{ item.user?.firstName }}</div>
        </template>
           <template #column-action="{item}">
          <div>{{ $t(`auditActions.${item.action}`) }}</div>
        </template>
         <template #column-ipAddress="{item}">
          <div class="flex flex-col w-xs overflow-hidden">
            <span>{{ item.ipAddress }}</span>
            <span class="text-gray-600 truncate">{{ item.userAgent }}</span>
          </div>
        </template>

      </ReusableTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { getAuditTrail, exportAuditTrail } from '@/services/auditTrail'
import type { AuditTrailEntry, AuditTrailQueryParams } from '@/services/auditTrail'
import { useAuthStore } from '@/composables/user'
import type { Column } from '../../utils/models'
import { formatDateT } from '../utilities/UtilitiesFunction'
import { useI18n } from 'vue-i18n'

// State
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const auditData = ref<AuditTrailEntry[]>([])
const totalItems = ref(0)
const totalPages = ref(0)
const users = ref([])
const authStore = useAuthStore()
const props = defineProps<{ entityIds: number[] }>()
const {t} = useI18n()


// Filters
const filters = ref<AuditTrailQueryParams>({
  hotelId: authStore.user?.hotelId || 1,
  entityIds:props.entityIds,
  startDate: '',
  endDate: '',
  page: 1,
  perPage: 200,
  sortBy: 'createdAt',
  order: 'desc'
})

// Table columns
const columns = ref<Column[]>([
  { key: 'date', label: t('Date'), type: 'custom' },
  { key: 'user', label: t('User'), type: 'custom' },
  { key: 'action', label: t('Action'), type: 'custom' },
  { key: 'description', label: t('Log'), type: 'custom' },
  { key: 'ipAddress', label: t('IP'), type: 'custom' },
])

// Computed properties
const paginatedData = computed(() => {
  return auditData.value
})



// Methods
const formatDateTime = (dateTimeString: string, part: 'date' | 'time') => {
  if (!dateTimeString) return 'N/A'

  const date = new Date(dateTimeString)

  if (part === 'date') {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } else {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
}

const getActionClass = (action: string) => {
  const actionMap: Record<string, string> = {
    'CREATE': 'text-green-600 dark:text-green-400 font-medium',
    'UPDATE': 'text-blue-600 dark:text-blue-400 font-medium',
    'DELETE': 'text-red-600 dark:text-red-400 font-medium',
    'LOGIN': 'text-purple-600 dark:text-purple-400 font-medium',
    'LOGOUT': 'text-gray-600 dark:text-gray-400 font-medium'
  }

  return actionMap[action] || 'text-gray-600 dark:text-gray-400 font-medium'
}

const fetchAuditTrail = async () => {
  loading.value = true
  error.value = ''

  try {
    // Update pagination parameters
    filters.value.page = currentPage.value
    filters.value.perPage = itemsPerPage.value

    const result = await getAuditTrail(filters.value)
    console.log('result',result)
    if (result) {
      auditData.value = result.data
      totalItems.value = result.meta.total
      totalPages.value = result.meta.last_page
    } else {
      auditData.value = []
      totalItems.value = 0
      totalPages.value = 0
    }
  } catch (err) {
    error.value = 'Failed to load audit trail data. Please try again.'
    console.error('Error fetching audit trail:', err)
  } finally {
    loading.value = false
  }
}

const exportAuditData = async () => {
  try {
    loading.value = true
    const blob = await exportAuditTrail(filters.value)
    if (blob) {
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    }
  } catch (err) {
    console.error('Error exporting audit trail:', err)
    error.value = 'Failed to export audit trail data. Please try again.'
  } finally {
    loading.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchAuditTrail()
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
