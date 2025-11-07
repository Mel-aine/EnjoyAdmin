<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Channel Manager Sidebar -->
 <ChannelManagerHeader />
    <!-- Backdrop for mobile -->
    <Backdrop />
    
    <!-- Main content area -->
    <div >
      <!-- Header -->
     
      
      <!-- Page content -->
      <main class="pt-16 lg:pt-0">
        <div class="p-6">
          <slot />
        </div>
      </main>
      
      <!-- Footer -->
      <AppFooter />
    </div>

    <!-- Add Connection Modal -->
    <ChannelConnectionModal
      v-if="showAddConnectionModal"
      :is-open="showAddConnectionModal"
      @close="showAddConnectionModal = false"
      @saved="handleConnectionSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import ChannelManagerSidebar from './ChannelManagerSidebar.vue'
import Backdrop from './Backdrop.vue'
import ChannelManagerHeader from './ChannelManagerHeader.vue'
import AppFooter from './AppFooter.vue'
import ChannelConnectionModal from '@/components/modal/ChannelConnectionModal.vue'
import { syncAllChannels } from '@/services/channelManagerApi'

const { isExpanded } = useSidebar();

const isHovered = ref(false)
const showAddConnectionModal = ref(false)

// Handle add connection action from sidebar
const handleAddConnection = () => {
  showAddConnectionModal.value = true
}

// Handle sync all action from sidebar
const handleSyncAll = async () => {
  try {
    // Show loading state or notification
    console.log('Syncing all connections...')
    
    // Call sync all API
    await syncAllChannels()
    
    // Show success notification
    console.log('All connections synced successfully')
  } catch (error) {
    console.error('Failed to sync all connections:', error)
    // Show error notification
  }
}

// Handle connection saved
const handleConnectionSaved = () => {
  showAddConnectionModal.value = false
  // Optionally refresh data or show success message
  console.log('Connection saved successfully')
}
</script>