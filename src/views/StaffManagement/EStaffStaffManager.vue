<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref } from 'vue'
import { staffData } from '@/assets/data/StaffData'
import { useI18n } from 'vue-i18n'
// Import lucide-vue icons
import { Building2, Wrench, UserCog, User } from 'lucide-vue-next'

const { t } = useI18n()
const staff = ref(staffData);

function getRoleIcon(role: string) {
  switch (role) {
    case 'receptionist': return Building2
    case 'housekeeper': return Building2
    case 'maintenance': return Wrench
    case 'manager': return UserCog
    default: return User
  }
}
function getRoleColor(role: string) {
  switch (role) {
    case 'receptionist': return 'bg-blue-100 text-blue-800'
    case 'housekeeper': return 'bg-green-100 text-green-800'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800'
    case 'manager': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
<AdminLayout>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-bold text-gray-900">{{ $t('staffManager.title') }}</h2>
      <p class="text-gray-600 mt-1">{{ $t('staffManager.subtitle') }}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="staffMember in staff"
        :key="staffMember.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center space-x-4 mb-4">
          <div class="flex-shrink-0 h-12 w-12">
            <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <component :is="getRoleIcon(staffMember.role)" class="w-6 h-6" />
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ staffMember.name }}</h3>
            <span
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="getRoleColor(staffMember.role)"
            >
              {{ $t(`staffManager.roles.${staffMember.role}`) }}
            </span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">{{ $t('staffManager.department') }}</span>
            <span class="font-medium text-gray-900">{{ staffMember.department }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">{{ $t('staffManager.email') }}</span>
            <span class="font-medium text-gray-900">{{ staffMember.email }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">{{ $t('staffManager.phone') }}</span>
            <span class="font-medium text-gray-900">{{ staffMember.phone }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">{{ $t('staffManager.hireDate') }}</span>
            <span class="font-medium text-gray-900">
              {{ new Date(staffMember.hire_date).toLocaleDateString() }}
            </span>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">{{ $t('staffManager.status') }}</span>
            <span
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="staffMember.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ staffMember.is_active ? $t('staffManager.active') : $t('staffManager.inactive') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="staff.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">
        <User class="w-12 h-12 inline" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('staffManager.noStaff') }}</h3>
      <p class="text-gray-500">{{ $t('staffManager.noStaffMsg') }}</p>
    </div>
  </div>
</AdminLayout>
</template>