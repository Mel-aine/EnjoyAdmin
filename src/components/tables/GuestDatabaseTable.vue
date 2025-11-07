<template>
  <ReusableTable
    :title="$t('tables.guestDatabase')"
    :columns="columns"
    :data="guests"
    :actions="actions"
    :header-actions="headerActions"
    :search-placeholder="$t('tables.quickSearchGuest')"
    :selectable="true"
    :empty-state-title="$t('tables.noGuestsFound')"
    :empty-state-message="$t('tables.getStartedByAddingGuest')"
    @selection-change="onSelectionChange"
  >
    <template #name="{ item }">
      <div>
        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
        <div v-if="item.status" class="text-xs text-gray-500 dark:text-gray-400">{{ item.status }}</div>
      </div>
    </template>
  </ReusableTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ReusableTable from './ReusableTable.vue'
import type { Action, Column } from '../../utils/models'

const { t } = useI18n()

interface Guest {
  id: number
  name: string
  status?: string
  country: string
  countryFlag?: string
  email: string
  phone?: string
  mobile?: string
  vipStatus?: string
}

// Sample data matching the image
const guests = ref<Guest[]>([
  {
    id: 1,
    name: 'Mam. Salutation - Blacklisted',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: 'aniket.sahu@ezeetechnosys.com',
    phone: '',
    mobile: '',
    vipStatus: ''
  },
  {
    id: 2,
    name: 'Mr. Bill to company for a group',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: '',
    phone: '',
    mobile: '',
    vipStatus: ''
  },
  {
    id: 3,
    name: 'Dr. lubhy testing',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: '',
    phone: '',
    mobile: '',
    vipStatus: ''
  },
  {
    id: 4,
    name: 'Mr. is package testing',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: 'aniketsahu521@gmail.com',
    phone: '01231231231',
    mobile: '',
    vipStatus: ''
  },
  {
    id: 5,
    name: 'Mr. is package testing',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: 'aniketsahu1459@gmail.com',
    phone: '',
    mobile: '7069105221',
    vipStatus: ''
  },
  {
    id: 6,
    name: 'Dr. aniket sahu',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: 'aniketsahu1459@gmail.vom',
    phone: '',
    mobile: '7069105221',
    vipStatus: ''
  },
  {
    id: 7,
    name: 'Mr. fg',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: '',
    phone: '',
    mobile: '',
    vipStatus: ''
  },
  {
    id: 8,
    name: 'Mr. task/aniket',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: '',
    phone: '',
    mobile: '',
    vipStatus: ''
  },
  {
    id: 9,
    name: 'Mr. Test',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: 'jayant.ninja@ezeetechnosys.com',
    phone: '',
    mobile: '+91 01234567890',
    vipStatus: ''
  },
  {
    id: 10,
    name: 'Mr. wtf',
    country: 'India',
    countryFlag: 'https://flagcdn.com/w20/in.png',
    email: '',
    phone: '',
    mobile: '',
    vipStatus: ''
  }
])

// Column configuration for ReusableTable
const columns = computed<Column[]>(() => [
  {
    key: 'name',
    label: t('tables.guestName'),
    type: 'custom',
  },
  {
    key: 'country',
    label: t('common.country'),
    type: 'image',
    imageKey: 'countryFlag',
  },
  {
    key: 'email',
    label: t('Email'),
    type: 'email',
  },
  {
    key: 'phone',
    label: t('tables.phone'),
    type: 'text',
  },
  {
    key: 'mobile',
    label: t('tables.mobile'),
    type: 'text',
  },
  {
    key: 'vipStatus',
    label: t('tables.vipStatus'),
    type: 'badge',
    badgeColors: {
      'Gold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Platinum': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Silver': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Bronze': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    }
  }
])

// Row actions configuration
const actions = computed<Action[]>(() => [
  {
    label: t('common.view'),
    handler: (item)=>onAction('view',item),
    icon: 'view'
  },
  {
    label: t('common.edit'),
    handler: (item)=>onAction('edit',item),
    icon: 'edit'
  },
  {
    label: t('common.delete'),
   handler: (item)=>onAction('delete',item),
    icon: 'delete',
    variant: 'danger'
  }
])

// Header actions configuration
const headerActions = computed(() => [
  {
    label: t('tables.addGuest'),
    action: 'add',
    variant: 'primary',
    icon: 'plus'
  },
  {
    label: t('common.export'),
    action: 'export',
    variant: 'success',
    icon: 'download'
  },
  {
    label: t('audit_trial'),
    action: 'audit',
    variant: 'warning',
    icon: 'clipboard'
  },
  {
    label: t('common.search'),
    action: 'search',
    variant: 'secondary',
    icon: 'search'
  }
])

// Event handlers
const onSelectionChange = (selectedItems: Guest[]) => {
  console.log('Selection changed:', selectedItems)
}

const router = useRouter()

const onAction = (action:any, item:any) => {
  
    switch (action) {
      case 'view':
        console.log('Viewing guest:', item)
        break
      case 'edit':
        console.log('Editing guest:', item)
        break
      case 'delete':
        console.log('Deleting guest:', item)
        break
      case 'audit':
        // Navigate to audit trail page for specific guest
        router.push({ name: 'AuditTrailEntity', params: { entityType: 'guest', entityId: item.id.toString() } })
        break
    }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>