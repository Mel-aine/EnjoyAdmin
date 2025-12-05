<template>

    <RightSideModal :is-open="isOpen" :title="$t('Reservation Details')" @close="closeModal"  size="xl">
    <template #header>
      <div class="flex items-center justify-start">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ $t('notifications') }}
        </h3>
      </div>
    </template>
    <div v-if="notifications" class="px-4 space-y-6 text-gray-900 dark:text-gray-100 ">
       <div class="flex flex-col h-auto overflow-y-auto custom-scrollbar" v-if="notifications && notifications.length">
        <div v-for="notification in notifications" :key="notification.id" @click="(e) => handleItemClick(e, notification)">
          <a
            class="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            href="#"
          >
            <span class="relative block w-full h-10 rounded-full z-1 max-w-10">
              <dii v-if="notification.recipientUser?.avatarUrl">
                <img :src="notification.recipientUser?.avatarUrl" alt="User" class="overflow-hidden rounded-full w-10 h-10 object-cover border-2 border-gray-500" />
              </dii>
              <template v-else>
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-white backdrop-blur-sm flex items-center justify-center text-gray-800 text-sm font-bold border-2 border-gray-500"
                >
                  {{ getUserInitials(notification.recipientUser?.fullName) }}
                </div>
              </template>
              <span
                :class="!notification.isRead ? 'bg-error-500' : 'bg-success-500'"
                class="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900"
              ></span>
            </span>

            <span class="block">
              <span class="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-800 dark:text-white/90">
                  {{ notification.recipientUser?.fullName || 'Staff' }}
                </span>
                {{ notification.title || notification.template?.title || notification.template?.name || 'Notification' }}
                <span class="font-medium text-gray-800 dark:text-white/90">
                  <template v-if="notification.relatedEntityType">
                    • {{ notification.relatedEntityType }}
                    <template v-if="notification.relatedEntityId">#{{ notification.relatedEntityId }}</template>
                  </template>
                </span>
              </span>

              <span class="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                <span>{{ notification.body || '—' }}</span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{{ new Date(notification.createdAt || '').toLocaleString() }}</span>
              </span>
            </span>
          </a>
        </div>

      </div>

    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Close')" />
      </div>
    </template>

    </RightSideModal>


</template>
<script setup lang="ts">
import {ref} from 'vue'
import RightSideModal from './RightSideModal.vue';
import BasicButton from '../buttons/BasicButton.vue';
import {  markNotificationRead, type NotificationItem } from '@/services/notificationsApi'


interface Props{
  isOpen : boolean
  notifications : any
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<Props>()

const closeModal = () =>{
  emit('close')
}


const handleItemClick = async (event: MouseEvent, notif: NotificationItem) => {
  event.preventDefault()
  try {
    if (!notif.isRead) await markNotificationRead(notif.id)
    notif.isRead = true
  } catch (e) {
    // non-fatal
  }

}


function getUserInitials(fullName?: string): string {
  const name = (fullName || '').trim()
  if (!name) return 'U'
  const parts = name.split(/\s+/)
  const first = parts[0]?.[0] || ''
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : ''
  return (first + second).toUpperCase() || first.toUpperCase() || 'U'
}

</script>
