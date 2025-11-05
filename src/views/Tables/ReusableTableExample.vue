<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('tables.reusableTableExample')" :breadcrumb="breadcrumb" />
    
    <div class="space-y-6">
      <!-- Example 1: Guest Database Table -->
      <ReusableTable
        :title="$t('tables.guestDatabase')"
        :columns="guestColumns"
        :data="guestData"
        :actions="guestActions"
        :header-actions="guestHeaderActions"
        :search-placeholder="$t('tables.quickSearchGuest')"
        :selectable="true"
        :show-header="true"
        :empty-state-title="$t('tables.noGuestsFound')"
        :empty-state-message="$t('tables.getStartedByAddingGuest')"
        @selection-change="onGuestSelectionChange"
        @action="onGuestAction"
      />
      
      <!-- Example 2: User Management Table -->
      <ReusableTable
        :title="$t('tables.userManagement')"
        :columns="userColumns"
        :data="userData"
        :actions="userActions"
        :header-actions="userHeaderActions"
        :search-placeholder="$t('tables.searchUsers')"
        :selectable="false"
        :show-header="true"
        :empty-state-title="$t('tables.noUsersFound')"
        :empty-state-message="$t('tables.addUsersToGetStarted')"
        @action="onUserAction"
      >
        <!-- Custom column slot for avatar -->
        <template #column-avatar="{ item }">
          <div class="flex items-center gap-3">
            <img 
              :src="item.avatar || '/images/default-avatar.png'" 
              :alt="item.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ getRoleLabel(item.role) }}</div>
            </div>
          </div>
        </template>
      </ReusableTable>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'

const { t } = useI18n()

const breadcrumb = computed(() => [
  { label: t('tables.tables'), href: '#' },
  { label: t('tables.reusableTableExample'), href: '#' }
])

const getRoleLabel = (role: string) => {
  const roleMap: Record<string, string> = {
    'Administrator': 'tables.roles.administrator',
    'Manager': 'tables.roles.manager',
    'Employee': 'tables.roles.employee'
  }
  return t(roleMap[role] || role)
}

// Guest Database Configuration
const guestColumns = computed(() => [
  { key: 'name', label: t('tables.guestName'), type: 'text' as const },
  { 
    key: 'country', 
    label: t('common.country'), 
    type: 'image' as const, 
    imageKey: 'countryFlag' 
  },
  { key: 'email', label: t('Email'), type: 'email' as const },
  { key: 'phone', label: t('tables.phone'), type: 'text' as const },
  { key: 'mobile', label: t('tables.mobile'), type: 'text' as const },
  { 
    key: 'vipStatus', 
    label: t('tables.vipStatus'), 
    type: 'badge' as const,
    badgeColors: {
      'vip': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'premium': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'regular': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }
])

const guestData = ref([
  {
    id: 1,
    name: 'John Doe',
    country: 'United States',
    countryFlag: 'https://flagcdn.com/w20/us.png',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    mobile: '+1-555-0124',
    vipStatus: 'vip'
  },
  {
    id: 2,
    name: 'Jane Smith',
    country: 'Canada',
    countryFlag: 'https://flagcdn.com/w20/ca.png',
    email: 'jane.smith@example.com',
    phone: '',
    mobile: '+1-416-555-0199',
    vipStatus: 'premium'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    country: 'United Kingdom',
    countryFlag: 'https://flagcdn.com/w20/gb.png',
    email: 'bob.johnson@example.com',
    phone: '+44-20-7946-0958',
    mobile: '',
    vipStatus: 'regular'
  }
])

const guestActions = computed(() => [
  {
    label: t('tables.viewDetails'),
    handler: (item: any) => console.log('View guest:', item),
    variant: 'primary' as const
  },
  {
    label: t('tables.editGuest'),
    handler: (item: any) => console.log('Edit guest:', item)
  },
  {
    label: t('tables.sendEmail'),
    handler: (item: any) => window.open(`mailto:${item.email}`),
    condition: (item: any) => !!item.email
  },
  {
    label: t('tables.deleteGuest'),
    handler: (item: any) => {
      if (confirm(t('tables.confirmDeleteGuest', { name: item.name }))) {
        const index = guestData.value.findIndex(g => g.id === item.id)
        if (index > -1) guestData.value.splice(index, 1)
      }
    },
    variant: 'danger' as const
  }
])

const guestHeaderActions = computed(() => [
  {
    label: t('tables.addGuest'),
    handler: () => console.log('Add new guest'),
    variant: 'primary' as const
  },
  {
    label: t('common.export'),
    handler: () => console.log('Export guests'),
    variant: 'success' as const
  },
  {
    label: t('tables.import'),
    handler: () => console.log('Import guests'),
    variant: 'secondary' as const
  }
])

// User Management Configuration
const userColumns = computed(() => [
  { key: 'avatar', label: t('common.user'), type: 'custom' as const },
  { key: 'email', label: t('Email'), type: 'email' as const },
  { key: 'department', label: t('tables.department'), type: 'text' as const },
  { 
    key: 'status', 
    label: t('Status'), 
    type: 'badge' as const,
    badgeColors: {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'inactive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  },
  { key: 'lastLogin', label: t('tables.lastLogin'), type: 'text' as const }
])

const userData = ref([
  {
    id: 1,
    name: 'Alice Cooper',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    email: 'alice.cooper@company.com',
    department: 'IT',
    status: 'active',
    lastLogin: '2024-01-15 10:30 AM'
  },
  {
    id: 2,
    name: 'David Wilson',
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    email: 'david.wilson@company.com',
    department: 'Sales',
    status: 'active',
    lastLogin: '2024-01-14 3:45 PM'
  },
  {
    id: 3,
    name: 'Sarah Davis',
    role: 'Employee',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    email: 'sarah.davis@company.com',
    department: 'Marketing',
    status: 'pending',
    lastLogin: 'Never'
  }
])

const userActions = computed(() => [
  {
    label: t('tables.viewProfile'),
    handler: (item: any) => console.log('View user profile:', item)
  },
  {
    label: t('tables.editUser'),
    handler: (item: any) => console.log('Edit user:', item)
  },
  {
    label: t('tables.resetPassword'),
    handler: (item: any) => console.log('Reset password for:', item.name)
  },
  {
    label: t('tables.deactivate'),
    handler: (item: any) => {
      item.status = 'inactive'
      console.log('Deactivated user:', item.name)
    },
    variant: 'warning' as const,
    condition: (item: any) => item.status === 'active'
  },
  {
    label: t('tables.activate'),
    handler: (item: any) => {
      item.status = 'active'
      console.log('Activated user:', item.name)
    },
    variant: 'success' as const,
    condition: (item: any) => item.status !== 'active'
  },
  {
    label: t('tables.deleteUser'),
    handler: (item: any) => {
      if (confirm(t('tables.confirmDeleteUser', { name: item.name }))) {
        const index = userData.value.findIndex(u => u.id === item.id)
        if (index > -1) userData.value.splice(index, 1)
      }
    },
    variant: 'danger' as const
  }
])

const userHeaderActions = computed(() => [
  {
    label: t('tables.addUser'),
    handler: () => console.log('Add new user'),
    variant: 'primary' as const
  },
  {
    label: t('tables.bulkImport'),
    handler: () => console.log('Bulk import users'),
    variant: 'secondary' as const
  }
])

// Event handlers
const onGuestSelectionChange = (selectedItems: any[]) => {
  console.log('Selected guests:', selectedItems)
}

const onGuestAction = (action: string, item: any) => {
  console.log('Guest action:', action, 'on item:', item)
}

const onUserAction = (action: string, item: any) => {
  console.log('User action:', action, 'on item:', item)
}
</script>