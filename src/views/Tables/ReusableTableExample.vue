<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Reusable Table Example" :breadcrumb="breadcrumb" />
    
    <div class="space-y-6">
      <!-- Example 1: Guest Database Table -->
      <ReusableTable
        title="Guest Database"
        :columns="guestColumns"
        :data="guestData"
        :actions="guestActions"
        :header-actions="guestHeaderActions"
        search-placeholder="Quick Search by Name, Email, Contact..."
        :selectable="true"
        :show-header="true"
        empty-state-title="No guests found"
        empty-state-message="Get started by adding a new guest to the database."
        @selection-change="onGuestSelectionChange"
        @action="onGuestAction"
      />
      
      <!-- Example 2: User Management Table -->
      <ReusableTable
        title="User Management"
        :columns="userColumns"
        :data="userData"
        :actions="userActions"
        :header-actions="userHeaderActions"
        search-placeholder="Search users..."
        :selectable="false"
        :show-header="true"
        empty-state-title="No users found"
        empty-state-message="Add users to get started."
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
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.role }}</div>
            </div>
          </div>
        </template>
      </ReusableTable>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { defineAsyncComponent as defineAsyncComponentBreadcrumb } from 'vue'
const PageBreadcrumb = defineAsyncComponentBreadcrumb(() => import('@/components/common/PageBreadcrumb.vue'))
import ReusableTable from '@/components/tables/ReusableTable.vue'

const breadcrumb = [
  { label: 'Tables', href: '#' },
  { label: 'Reusable Table Example', href: '#' }
]

// Guest Database Configuration
const guestColumns = [
  { key: 'name', label: 'Guest Name', type: 'text' as const },
  { 
    key: 'country', 
    label: 'Country', 
    type: 'image' as const, 
    imageKey: 'countryFlag' 
  },
  { key: 'email', label: 'Email', type: 'email' as const },
  { key: 'phone', label: 'Phone', type: 'text' as const },
  { key: 'mobile', label: 'Mobile', type: 'text' as const },
  { 
    key: 'vipStatus', 
    label: 'VIP Status', 
    type: 'badge' as const,
    badgeColors: {
      'vip': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'premium': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'regular': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }
]

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

const guestActions = [
  {
    label: 'View Details',
    handler: (item: any) => console.log('View guest:', item),
    variant: 'primary' as const
  },
  {
    label: 'Edit Guest',
    handler: (item: any) => console.log('Edit guest:', item)
  },
  {
    label: 'Send Email',
    handler: (item: any) => window.open(`mailto:${item.email}`),
    condition: (item: any) => !!item.email
  },
  {
    label: 'Delete Guest',
    handler: (item: any) => {
      if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        const index = guestData.value.findIndex(g => g.id === item.id)
        if (index > -1) guestData.value.splice(index, 1)
      }
    },
    variant: 'danger' as const
  }
]

const guestHeaderActions = [
  {
    label: 'Add Guest',
    handler: () => console.log('Add new guest'),
    variant: 'primary' as const
  },
  {
    label: 'Export',
    handler: () => console.log('Export guests'),
    variant: 'success' as const
  },
  {
    label: 'Import',
    handler: () => console.log('Import guests'),
    variant: 'secondary' as const
  }
]

// User Management Configuration
const userColumns = [
  { key: 'avatar', label: 'User', type: 'custom' as const },
  { key: 'email', label: 'Email', type: 'email' as const },
  { key: 'department', label: 'Department', type: 'text' as const },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'badge' as const,
    badgeColors: {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'inactive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  },
  { key: 'lastLogin', label: 'Last Login', type: 'text' as const }
]

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

const userActions = [
  {
    label: 'View Profile',
    handler: (item: any) => console.log('View user profile:', item)
  },
  {
    label: 'Edit User',
    handler: (item: any) => console.log('Edit user:', item)
  },
  {
    label: 'Reset Password',
    handler: (item: any) => console.log('Reset password for:', item.name)
  },
  {
    label: 'Deactivate',
    handler: (item: any) => {
      item.status = 'inactive'
      console.log('Deactivated user:', item.name)
    },
    variant: 'warning' as const,
    condition: (item: any) => item.status === 'active'
  },
  {
    label: 'Activate',
    handler: (item: any) => {
      item.status = 'active'
      console.log('Activated user:', item.name)
    },
    variant: 'success' as const,
    condition: (item: any) => item.status !== 'active'
  },
  {
    label: 'Delete User',
    handler: (item: any) => {
      if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        const index = userData.value.findIndex(u => u.id === item.id)
        if (index > -1) userData.value.splice(index, 1)
      }
    },
    variant: 'danger' as const
  }
]

const userHeaderActions = [
  {
    label: 'Add User',
    handler: () => console.log('Add new user'),
    variant: 'primary' as const
  },
  {
    label: 'Bulk Import',
    handler: () => console.log('Bulk import users'),
    variant: 'secondary' as const
  }
]

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