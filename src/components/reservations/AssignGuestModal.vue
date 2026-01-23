<template>
  <RightSideModal
    :is-open="isOpen"
    :title="modalTitle"
    @close="handleClose"
  >
    <template #header>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ modalTitle }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ getRoomTitle() }}
        </p>

      </div>
    </template>

    <div class="px-4 space-y-4 text-gray-900 dark:text-gray-100">
      <!-- Barre de recherche -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          @input="handleSearchInput"
          type="text"
          :placeholder="$t('Search by name, email, or phone...')"
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-hidden dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <!-- Loading state -->
      <div v-if="loadingGuests" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Liste des guests -->
      <div v-else-if="filteredGuests.length > 0" class="max-h-[calc(100vh-350px)] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        <div
          v-for="guest in filteredGuests"
          :key="guest.id"
          @click="selectGuest(guest)"
          :class="guestCardClass(guest)"
          class="p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <div class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ getGuestDisplayName(guest) }}
                </div>
                <span v-if="guest.vipStatusId" class="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  VIP
                </span>
                <span v-if="guest.blacklisted" class="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  {{ $t('Blacklisted') }}
                </span>
                   <span
                    v-if="currentRoomGuestIds.includes(guest.id)"
                    class="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {{ $t('Already in room') }}
                  </span>
              </div>

              <div class="mt-2 space-y-1">
                <div v-if="guest.email" class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {{ guest.email }}
                </div>

                <div v-if="guest.phone || guest.phonePrimary" class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  {{ guest.phone || guest.phonePrimary }}
                </div>

                <div v-if="guest.nationality" class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ guest.nationality }}
                </div>
              </div>
            </div>

            <!-- Checkmark si sélectionné -->
            <div v-if="selectedGuest?.id === guest.id" class="ml-3">
              <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <p class="mt-4 text-gray-500 dark:text-gray-400">{{ $t('No guests found') }}</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {{ $t('Try adjusting your search criteria') }}
        </p>
      </div>
    </div>

    <template #footer>
  <div class="flex justify-end space-x-2">
    <BasicButton
      variant="secondary"
      @click="handleClose"
      :label="$t('Cancel')"
    />
    <BasicButton
      variant="success"
      @click="handleAssign(false)"
      :label="isAssigningAdd ? $t('Adding...') : $t('Add Guest')"
      :loading="isAssigningAdd"
      :disabled="!selectedGuest || isAssigningAdd || isAssigningReplace || isGuestAlreadyInRoom"
    />
    <BasicButton
      variant="warning"
      @click="handleAssign(true)"
      :label="isAssigningReplace ? $t('Replacing...') : $t('Assign to Room (Replace)')"
      :loading="isAssigningReplace"
      :disabled="!selectedGuest || isAssigningAdd || isAssigningReplace || isGuestAlreadyInRoom"
    />
  </div>
</template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import { getGuests } from '@/services/guestApi'
import { useServiceStore } from '@/composables/serviceStore'
import { assignExistingGuestToRoom } from '@/services/configrationApi'

interface Props {
  isOpen: boolean
  room: any
  reservation: any
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'assigned'])
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// État

const isAssigningAdd = ref(false)
const isAssigningReplace = ref(false)
const loadingGuests = ref(false)
const searchQuery = ref('')
const selectedGuest = ref<any>(null)
const existingGuests = ref<any[]>([])

let searchTimeout: ReturnType<typeof setTimeout> | null = null



// Computed
const filteredGuests = computed(() => existingGuests.value)

// Nouveau: Obtenir les IDs des guests déjà dans la chambre
const currentRoomGuestIds = computed(() => {
  const ids: number[] = []

  // Ajouter l'ID du guest principal
  if (props.room?.guest?.id) {
    ids.push(props.room.guest.id)
  }

  // Ajouter les IDs des guests additionnels
  if (props.room?.guests && Array.isArray(props.room.guests)) {
    props.room.guests.forEach((guestAssignment: any) => {
      if (guestAssignment.guestId) {
        ids.push(guestAssignment.guestId)
      }
    })
  }

  return ids
})

// Nouveau: Vérifier si le guest sélectionné est déjà dans la chambre
const isGuestAlreadyInRoom = computed(() => {
  if (!selectedGuest.value) return false
  return currentRoomGuestIds.value.includes(selectedGuest.value.id)
})

const modalTitle = computed(() => {
  return t('Assign Guest to Room')
})


const guestCardClass = (guest: any) => {
  const isAlreadyInRoom = currentRoomGuestIds.value.includes(guest.id)

  if (isAlreadyInRoom) {
    return 'border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 opacity-50 cursor-not-allowed'
  }

  return selectedGuest.value?.id === guest.id
    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
}

// Méthodes
const getRoomTitle = () => {
  return `${t('Room')} ${props.room?.room?.roomNumber || t('Unknown')}`
}

const getGuestDisplayName = (guest: any) => {
  const parts = [
    guest.title,
    guest.firstName,
    guest.lastName,
    guest.maidenName
  ].filter(Boolean)

  return parts.join(' ') || t('Unnamed Guest')
}



const selectGuest = (guest: any) => {
  // Empêcher la sélection si le guest est déjà dans la chambre
  if (currentRoomGuestIds.value.includes(guest.id)) {
    toast.warning(t('This guest is already assigned to this room'))
    return
  }

  selectedGuest.value = guest
}

const handleClose = () => {
  selectedGuest.value = null
  searchQuery.value = ''
  emit('close')
}

const handleAssign = async (shouldReplace: boolean = false) => {
  if (!selectedGuest.value) {
    toast.error(t('Please select a guest'))
    return
  }

  // Vérifier une dernière fois si le guest n'est pas déjà dans la chambre
  if (currentRoomGuestIds.value.includes(selectedGuest.value.id)) {
    toast.error(t('This guest is already assigned to this room'))
    return
  }

  // Activer le bon état de chargement
  if (shouldReplace) {
    isAssigningReplace.value = true
  } else {
    isAssigningAdd.value = true
  }

  try {
    // Passer le shouldReplace à l'API
    await assignExistingGuestToRoom(
      props.room.id,
      selectedGuest.value.id,
      shouldReplace
    )

    const successMessage = shouldReplace
      ? t('Guest assigned successfully to room (replaced existing guest)')
      : t('Guest added to room successfully')

    toast.success(successMessage)
    emit('assigned')
    handleClose()
  } catch (error: any) {
    console.error(error)
    const errorMessage = error.response?.data?.message || t('Failed to assign guest')
    toast.error(errorMessage)
  } finally {
    // Désactiver tous les états de chargement
    isAssigningAdd.value = false
    isAssigningReplace.value = false
  }
}

const loadExistingGuests = async () => {
  loadingGuests.value = true
  try {
    const serviceId = serviceStore.serviceId
    const allParams = {
      search: searchQuery.value.trim() || undefined,
      hotel_id: serviceId,
      limit: 'all',
    }

    const response = await getGuests(allParams)

    if (response.data?.data?.data) {
      existingGuests.value = response.data.data.data
    } else {
      existingGuests.value = response.data || []
    }
  } catch (error) {
    console.error('Error loading guests:', error)
    toast.error(t('Failed to load guests'))
  } finally {
    loadingGuests.value = false
  }
}

const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    loadExistingGuests()
  }, 500)
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadExistingGuests()
  } else {
    selectedGuest.value = null
    searchQuery.value = ''
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadExistingGuests()
  }
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
