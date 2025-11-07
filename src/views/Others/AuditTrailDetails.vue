<template>
    <AdminLayout>
        <FullScreenLayout>
            <div class="h-full">
                <!-- Modern Header Section -->
                <div class="shadow-sm px-4 py-3 mx-4 bg-white dark:bg-gray-800 flex justify-between items-center">
                    <div class="flex gap-3 items-center">
                        <button @click="goBack"
                            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                            <ArrowLeft class="w-5 h-5" />
                        </button>
                        <FileText class="w-6 h-6 text-primary" />
                        <div class="flex flex-col">
                            <span class="font-bold text-lg">{{ $t('audit_trial') }}</span>
                            <div class="flex items-center gap-2 mt-1">
                                <span v-if="entityType && entityId"
                                    class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {{ $t(entityType) }} #{{ entityId }}
                                </span>
                                <span
                                    class="inline-flex items-center px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                                    {{ totalItems }} {{ $t('Records') }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2">
                        <button @click="exportAuditData" :disabled="loading"
                            class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50">
                            <Download class="w-4 h-4" />
                            {{ $t('Export') }}
                        </button>
                        <button @click="refreshData" :disabled="loading"
                            class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition flex items-center gap-2 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
                            {{ $t('Refresh') }}
                        </button>
                    </div>
                </div>

                <!-- Filters Section -->
                <div class="mx-4 mt-4 bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <InputDatePicker v-model="filters.startDate" :placeholder="$t('dd/mm/yyyy')" :title="$t('StartDate')" @update:model-value="fetchAuditTrail"></InputDatePicker>
                        </div>
                        <div>
                            <InputDatePicker v-model="filters.endDate" :placeholder="$t('dd/mm/yyyy')" :title="$t('EndDate')" @update:model-value="fetchAuditTrail"></InputDatePicker>
                        </div>
                        <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{{ $t('Action') }}</label>
              <SelectComponent
                v-model="filters.action"
                :options="actionOptions"
                :placeholder="$t('Select action...')"
                class="w-full"
                @change="fetchAuditTrail"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{{ $t('User') }}</label>
              <SelectComponent
                v-model="filters.userId"
                :options="userOptions"
                :placeholder="$t('Select user...')"
                class="w-full"
                @change="fetchAuditTrail"
              />
            </div>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mx-4 mt-4 p-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg dark:bg-red-900/30 dark:border-red-700">
                    <div class="flex items-start">
                        <AlertCircle class="h-5 w-5 text-red-500 mt-0.5 dark:text-red-400" />
                        <div class="ml-3">
                            <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
                        </div>
                    </div>
                </div>

                <!-- Audit Trail Table -->
                <div class="mx-4 mt-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <AuditLogsTable :logs="auditData" :expanded-changes="expandedChanges" @toggle-changes="handleToggleChanges" />
                </div>
            </div>
        </FullScreenLayout>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent } from 'vue'
const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'))
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import { getAuditTrail, exportAuditTrail } from '@/services/auditTrail'
import type { AuditTrailEntry, AuditTrailQueryParams } from '@/services/auditTrail'
import { getEmployeesForService } from '@/services/userApi'
import { useAuthStore } from '@/composables/user'
import { ArrowLeft, FileText, Download, RefreshCw, AlertCircle } from 'lucide-vue-next'
import AuditLogsTable from '../../components/tables/AuditLogsTable.vue'
import { useServiceStore } from '../../composables/serviceStore'
import InputDatePicker from '../../components/forms/FormElements/InputDatePicker.vue'
import type { AuditLog } from '../../utils/models'

// Props
const props = defineProps<{
    entityType?: string
    entityId?: string
}>()

// Composables
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const serviceStore = useServiceStore()
const expandedChanges = ref<(string | number)[]>([])

const handleToggleChanges = (logId: string | number) => {

  const logIdStr = String(logId)
  const index = expandedChanges.value.indexOf(logIdStr)

  if (index > -1) {
    expandedChanges.value.splice(index, 1)

  } else {
    expandedChanges.value.push(logIdStr)

  }

}

// State
const loading = ref(false)
const error = ref('')
const auditData = ref<AuditLog[]>([])
const totalItems = ref(0)
const users = ref<any[]>([])
const userOptions = ref<{ value: string; label: string }[]>([])
const actionOptions = ref([
  { value: '', label: t('AllActions') },
  { value: 'create', label: t('Create') },
  { value: 'update', label: t('Update') },
  { value: 'delete', label: t('Delete') },
  { value: 'login', label: t('Login') },
  { value: 'logout', label: t('Logout') }
])

// Computed
const entityIds = computed(() => {
    if (props.entityId && props.entityId != 'all') {
        return [Number(props.entityId)]
    }
    return []
})

// Filters
const filters = ref<AuditTrailQueryParams>({
    hotelId: useServiceStore().serviceId!,
    entityType: props.entityType,
    entityIds: entityIds.value,
    startDate: '',
    endDate: '',
    userId: undefined,
    action: '',
    page: 1,
    perPage: 50,
    sortBy: 'createdAt',
    order: 'desc'
})

// Methods
const goBack = () => {
    router.go(-1)
}

const fetchAuditTrail = async () => {
    loading.value = true
    error.value = ''

    try {
        // Update filters with current entity info
        filters.value.entityType = props.entityType
        filters.value.entityIds = entityIds.value

        const result = await getAuditTrail(filters.value)
        if (result) {
            auditData.value = result.data.map((log: any) => ({
                id: log.id,
                action: log.action,
                description: log.description,
                changes: log.changes || null,
                timestamp: log.updatedAt,
                userId: log.userId,
                userName: log.user?.fullName || null,
                ipAddress: log.ipAddress || null,
                userAgent: log.userAgent || null,
                sessionId: log.sessionId || null,
                entityId: log.entityId || null,
                entityType: log.entityType || null,
                meta: log.meta || null,
            }));
            totalItems.value = result.meta?.total || result.data.length
        } else {
            auditData.value = []
            totalItems.value = 0
        }
    } catch (err) {
        error.value = t('FailedToLoadAuditTrail')
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
        error.value = t('FailedToExportAuditTrail')
    } finally {
        loading.value = false
    }
}

const refreshData = () => {
  fetchAuditTrail()
}

const fetchUser = async () => {
  loading.value = true
  try {
    const hotelId = serviceStore.serviceId || authStore.user?.hotelId
    if (!hotelId) throw new Error('hotelId is not defined')
    const response = await getEmployeesForService(hotelId)
    console.log('response', response)

    const assignmentsWithNames = await Promise.all(
      response.data.data.map(async (user: any) => {
        return {
          value: user.id.toString(),
          label: `${user.firstName} ${user.lastName}`
        }
      }),
    )
    userOptions.value = [
      { value: '', label: t('AllUsers') },
      ...assignmentsWithNames
    ]
    users.value = response.data.data
    console.log('Filtered users with user info:', users.value)
  } catch (error) {
    console.error('fetch failed:', error)
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => [props.entityType, props.entityId], () => {
    if (props.entityType && props.entityId) {
        filters.value.entityType = props.entityType
        filters.value.entityIds = props.entityId && props.entityId != 'all' ? [Number(props.entityId)] : []
        fetchAuditTrail()
    }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  fetchUser()
  fetchAuditTrail()
})
</script>

<style scoped>
.primary {
    color: #3b82f6;
}
</style>
