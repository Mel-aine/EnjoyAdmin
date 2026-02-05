<template>
  <AdminLayout>
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('Access Control System') }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ $t('Manage ZKTeco terminals and staff master access cards') }}
          </p>
        </div>

        <!-- Global Stats -->
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('Active Terminals') }}</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ doors.filter(d => d.isActive).length }}/{{ doors.length }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('Master Cards') }}</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ masterCards.filter(c => c.status === 'active').length }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'terminals'"
            :class="[
              activeTab === 'terminals'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors'
            ]"
          >
            <DoorOpen class="w-5 h-5 mr-2" />
            {{ $t('Terminals') }}
            <span class="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
              {{ doors.length }}
            </span>
          </button>

          <button
            @click="activeTab = 'master-cards'"
            :class="[
              activeTab === 'master-cards'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors'
            ]"
          >
            <Key class="w-5 h-5 mr-2" />
            {{ $t('Master Cards') }}
            <span class="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
              {{ masterCards.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- TERMINALS TAB -->
      <div v-show="activeTab === 'terminals'" class="space-y-4">
        <!-- Filters -->
        <div class="flex items-center space-x-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('Search by name, IP address, or room number...')"
              class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all text-sm outline-0"
            />
          </div>
          <div class="w-48">
            <Select :options="statusOptions" v-model="statusFilter" />
          </div>
        </div>

        <!-- Loading State -->

       <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-6">
        <TerminalSkeleton v-for="n in 8" :key="n" />
       </div>


        <!-- Terminals Grid -->
        <div v-else-if="filteredDoors.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <TerminalCard
            v-for="door in filteredDoors"
            :key="door.id"
            :terminal="door"
            :unlocking="unlocking[door.id]"
            :loading-info="loadingInfo[door.id]"
            :syncing-time="syncingTime[door.id]"
            :loading-logs="loadingLogs[door.id]"
            @unlock="unlockDoor"
            @retry-terminal="RetryTerminalQueue"
            @logs="viewLogs"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
            <DoorOpen class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('No terminals found') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ searchQuery ? $t('Try adjusting your search filters') : $t('No terminals configured yet') }}
          </p>
        </div>
      </div>

      <!-- MASTER CARDS TAB -->
      <div v-show="activeTab === 'master-cards'" class="space-y-4">
        <!-- Header with Add Button -->
        <div class="flex items-center justify-between">
          <div class="flex-1 max-w-md relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="masterCardSearch"
              type="text"
              :placeholder="$t('Search staff cards...')"
              class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 outline-0 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <BasicButton
            @click="showAddMasterCardModal = true"
            :label="$t('Add Master Card')"
            :icon="Plus"
            variant="primary"
          />
        </div>

        <!-- Loading State -->
        <div v-if="loadingMasterCards" class="flex items-center justify-center py-20">
          <div class="flex flex-col items-center space-y-3">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Loading master cards...') }}</p>
          </div>
        </div>

        <!-- Master Cards Grid -->
        <div v-else-if="filteredMasterCards.length > 0" class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <MasterCardCard
            v-for="card in filteredMasterCards"
            :key="card.id"
            :card="card"
            :syncing="syncingCard[card.id]"
            :revoking="revokingCard[card.id]"
            @sync="syncMasterCard"
            @revoke="openModal"
            @view-details="viewCardDetails"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
            <Key class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('No master cards found') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {{ masterCardSearch ? $t('Try adjusting your search') : $t('Create master access cards for your staff') }}
          </p>

        </div>
      </div>

      <!-- MODALS -->

      <!-- Add Master Card Modal -->
      <AddMasterCardModal
        :is-open="showAddMasterCardModal"
        :user-options="userOptions"
        :door-options="doorOptions"
        @close="showAddMasterCardModal = false"
        @save="handleSaveMasterCard"
        :is-saving="savingMasterCard"
      />

      <!-- Access Logs Modal -->
       <LogsDetailsModal
        :is-open="showLogsModal"
        :logs="accessLogs"
        :selected-door="selectedDoorForLogs"
        :loading="loadingLogsData"
        :syncing="syncing"
        @close="showLogsModal = false"
        @sync="syncLogs"
      />

      <!--confirm revoked-->

      <ConfirmationModal
        v-model:show="showModal"
        :title="$t('revoke_title')"
        :message="$t('revoke_confirm_message')"
        :confirm-text="$t('Delete')"
        :cancel-text="$t('Cancel')"
        variant="danger"
        :loading="selectedCardToRevoke
          ? revokingCard[selectedCardToRevoke.id]
          : false"
        @confirm="confirmRevokeMasterCard"
        @cancel="closeModal"
      />

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import TerminalCard from '@/components/cards/TerminalCard.vue'
import MasterCardCard from '@/components/cards/MasterPassCard.vue'
import AddMasterCardModal from '@/components/modal/AddMasterCardModal.vue'
import LogsDetailsModal from '@/components/modal/LogsDetailsModal.vue'
import {
  Search, DoorOpen, Key, Plus, X, RefreshCw, CheckCircle, XCircle, FileText
} from 'lucide-vue-next'
import { getDoors } from '@/services/configrationApi'
import { unlockDoorRemote, getDoorLogs, syncDoorLogs, retryTerminalQueue } from '@/services/doors'
import {
   getMasterCards,
  createMasterCard,
   syncMasterCardAPI,
   revokeMasterCard
} from '@/services/masterCardsApi'
import { getAllUsers } from '@/services/userApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import TerminalSkeleton from '@/components/skeletons/TerminalSkeleton.vue'


// Types
interface Door {
  id: number
  name: string
  ipAddress: string
  port: number
  roomId: number | null
  isActive: boolean
  activeAccessCount?: number
  lastAccessSync?: string
  room?: {
    roomNumber: string
    roomType?: { roomTypeName: string }
  }
}

interface MasterCard {
  id: number
  userId: number | null
  cardUid: string
  userIdOnDevice: string
  accessType: 'master' | 'limited' | 'temporary'
  status: 'active' | 'revoked' | 'lost' | 'suspended'
  validFrom: string | null
  validUntil: string | null
  syncStatus: 'pending' | 'synced' | 'failed'
  syncedDoorsCount: number
  user?: {
    firstName: string
    lastName: string
  }
}

interface AccessLog {
  id: number
  doorId: number
  userIdOnDevice: string
  accessTime: string
  inOutStatus: number
  verifyMode: number
  accessGranted: boolean
}

const { t } = useI18n()
const toast = useToast()

// State
const activeTab = ref<'terminals' | 'master-cards'>('terminals')
const loading = ref(false)
const loadingMasterCards = ref(false)
const searchQuery = ref('')
const masterCardSearch = ref('')
const statusFilter = ref('all')
const doors = ref<Door[]>([])
const masterCards = ref<MasterCard[]>([])
const users = ref<any[]>([])
const unlocking = ref<Record<number, boolean>>({})
const loadingInfo = ref<Record<number, boolean>>({})
const syncingTime = ref<Record<number, boolean>>({})
const loadingLogs = ref<Record<number, boolean>>({})
const syncingCard = ref<Record<number, boolean>>({})
const revokingCard = ref<Record<number, boolean>>({})
const showLogsModal = ref(false)
const showAddMasterCardModal = ref(false)
const accessLogs = ref<AccessLog[]>([])
const selectedDoorForLogs = ref<Door | null>(null)
const loadingLogsData = ref(false)
const syncing = ref(false)
const savingMasterCard = ref(false)
const showModal = ref(false)
const selectedCardToRevoke = ref<MasterCard | null>(null)

// Computed
const statusOptions = computed(() => [
  { value: 'all', label: t('All Status') },
  { value: 'active', label: t('Active Only') },
  { value: 'inactive', label: t('Inactive Only') }
])

const userOptions = computed(() =>
  users.value.map(user => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} (${user.email})`
  }))
)

const doorOptions = computed(() =>
  doors.value.map(door => ({
    value: door.id,
    label: door.room
      ? `${door.name} - ${door.room.roomNumber}`
      : door.name
  }))
)

const filteredDoors = computed(() => {
  let filtered = doors.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(door =>
      door.name.toLowerCase().includes(query) ||
      door.ipAddress.toLowerCase().includes(query) ||
      door.room?.roomNumber.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value === 'active') {
    filtered = filtered.filter(d => d.isActive)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(d => !d.isActive)
  }

  return filtered
})

const filteredMasterCards = computed(() => {
  if (!masterCardSearch.value) return masterCards.value

  const query = masterCardSearch.value.toLowerCase()
  return masterCards.value.filter(card => {
    const userName = card.user ? `${card.user.firstName} ${card.user.lastName}`.toLowerCase() : ''
    return userName.includes(query) || card.cardUid.toLowerCase().includes(query)
  })
})

// Methods - Terminals
const unlockDoor = async (door: Door) => {
  unlocking.value[door.id] = true
  try {
    const response = await unlockDoorRemote(door.id, 5)
    if (response.data.success) {
      toast.success(t('Door unlocked for 5 seconds'))
    } else {
      toast.error(t('Failed to unlock door'))
    }
  } catch (error: any) {
    console.error(error)
    toast.error(error.response?.data?.message || t('Error unlocking door'))
  } finally {
    unlocking.value[door.id] = false
  }
}

const RetryTerminalQueue = async (door: Door) => {
  syncingTime.value[door.id] = true
  try {
    const response = await retryTerminalQueue(door.id)
    if (response.data.success) {
      toast.success(t('Access synchronization restarted'))
    } else {
      toast.error(t('Failed to retry terminal queue'))
    }
  } catch (error) {
    console.error(error)
    toast.error(t('Failed to retry terminal queue'))
  } finally {
    syncingTime.value[door.id] = false
  }
}

const viewLogs = async (door: Door) => {
  loadingLogs.value[door.id] = true
  loadingLogsData.value = true
  selectedDoorForLogs.value = door
  accessLogs.value = []
  showLogsModal.value = true
  try {
    const response = await getDoorLogs(door.id, { page: 1, per_page: 50 })
    if (response.data.success) {
      accessLogs.value = response.data.data.data || []
    } else {
      toast.error(t('Failed to load logs'))
    }
  } catch (error) {
    console.error(error)
    toast.error(t('Error loading logs'))
  } finally {
    loadingLogs.value[door.id] = false
    loadingLogsData.value = false
  }
}

const syncLogs = async (door: Door | null) => {
  if (!door) return
  syncing.value = true
  try {
    const response = await syncDoorLogs(door.id, false)
    if (response.data.success) {
      toast.success(t('Logs synchronized successfully'))
      await viewLogs(door)
    } else {
      toast.error(t('Failed to sync logs'))
    }
  } catch (error) {
    console.error(error)
    toast.error(t('Error syncing logs'))
  } finally {
    syncing.value = false
  }
}

// Methods - Master Cards
const handleSaveMasterCard = async (payload: any) => {
  savingMasterCard.value = true
  try {
    console.log('Saving master card with payload:', payload)
    const response = await createMasterCard(payload)

    if (response.data.success) {
      toast.success(t('Master card created and synchronized successfully'))
      showAddMasterCardModal.value = false
      await loadMasterCards()
    } else {
      toast.warning(response.data.message)
    }
    await loadMasterCards()
  } catch (error: any) {
    console.error(error)
    toast.error(error.response?.data?.message || t('Error creating master card'))
  }finally {
    savingMasterCard.value = false
  }
}

const syncMasterCard = async (card: any) => {
  syncingCard.value[card.id] = true
  try {
    const response = await syncMasterCardAPI(card.id)
    if (response.data.success) {
      toast.success(t('Master card synchronized to all terminals'))
      await loadMasterCards()
    }
  } catch (error: any) {
    console.error(error)
    toast.error(t('Error syncing master card'))
  } finally {
    syncingCard.value[card.id] = false
  }
}

const confirmRevokeMasterCard = async () => {
  if (!selectedCardToRevoke.value) return

  const card = selectedCardToRevoke.value
  revokingCard.value[card.id] = true

  try {
    const response = await revokeMasterCard(card.id)
    if (response.data.success) {
      closeModal()
      toast.success(t('Master card revoked from all terminals'))
      await loadMasterCards()

    }
  } catch (error: any) {
    console.error(error)
    toast.error(t('Error revoking master card'))
  } finally {
    revokingCard.value[card.id] = false
    selectedCardToRevoke.value = null
  }
}


const viewCardDetails = (card: MasterCard) => {
  console.log('View card details:', card)
}


// Data Loading
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      all:true
    }
    const resp = await getDoors(params)
    doors.value = resp.data.data?.data || resp.data.data || resp.data || []
  } catch (error) {
    console.error('Error loading terminals:', error)
    toast.error(t('Error loading terminals'))
  } finally {
    loading.value = false
  }
}

const loadMasterCards = async () => {
  loadingMasterCards.value = true
  try {
    const response = await getMasterCards({ page: 1, perPage: 100 })
    masterCards.value = response.data.data?.data || []
  } catch (error) {
    console.error('Error loading master cards:', error)
  } finally {
    loadingMasterCards.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await getAllUsers(useServiceStore().serviceId!, true)
    users.value = response.data?.data || []
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const openModal = (card: MasterCard) => {
  selectedCardToRevoke.value = card
  showModal.value = true
}


const closeModal = () =>{
  showModal.value = false
  selectedCardToRevoke.value = null
}

// Lifecycle
onMounted(() => {
  loadData()
  loadMasterCards()
  loadUsers()
})
</script>
