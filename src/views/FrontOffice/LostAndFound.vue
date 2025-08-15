<template>
  <div>
    <AdminLayout>
      <div class="min-h-screen">
        <ReusableTable
          :title="$t('LostAndFound')"
          :columns="columns"
          :data="lostFoundItems"
          :actions="actions"
          :selectable="false"
          :loading="loading"
          v-model="searchQuery"
          @search-change="onSearchChange"
          class="modern-table"
        >
          <template #header-actions="{ searchQuery }">
            <BasicButton
              :label="'✖ ' + $t('AddLost')"
              variant="primary"
              @click="openModal('lost')"
            />
            <BasicButton
              :label="'✓ ' + $t('AddFound')"
              variant="primary"
              @click="openModal('found')"
            />
            <BasicButton
              :label="$t('export')"
              variant="secondary"
              icon="folder-output"
            />
            <UserFilters />
          </template>
        </ReusableTable>
      </div>
    </AdminLayout>

    <ModalLostAndFound 
      :isOpen="showModal" 
      :isEditMode="isEditMode"
      :isFoundMode="isFoundMode"
      :lostFoundData="selectedItem"
      @close="handleCloseModal" 
      @submit="handleSubmitLostFound" 
    />

  </div>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import type { ReservationType } from '@/types/option'
import { useI18n } from 'vue-i18n'
import { UserIcon, FolderOutputIcon, IdCard } from 'lucide-vue-next'

import ReusableTable from '@/components/tables/ReusableTable.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import ModalLostAndFound from '@/components/modal/AddLostAndFound.vue'
import { useToast } from 'vue-toastification';
import BasicButton from '../../components/buttons/BasicButton.vue'
import UserFilters from '../../components/filters/UserFilters.vue'
import { getLostFound, addLostFound, updateLostFoundItem, deleteLostFoundItem } from '@/services/lostfound'


const { t } = useI18n()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const router = useRouter()
const showModal = ref(false)
const isEditMode = ref(false)
const isFoundMode = ref(false) // Nouvelle ref pour le mode Found
const loading = ref(false)
const store = useBookingStore()
const toast = useToast();
const currentPageTitle = computed(() => t('LostAndFoundList'))
const selectedItem = ref<any>(null)
const lostFoundItems = ref<any[]>([])

const columns = computed(() => [
  {
    key: 'status',
    label: t('Status'),
    type: 'badge' as const,
    sortable: true,
    translatable: true,
    badgeVariant: (value: string) => {
      if (value === 'returned') return 'green';
      if (value === 'Discarded') return 'red';
      return 'gray'; // Couleur par défaut pour les autres statuts
    }
  },
  {
    key: 'lost_on',
    label: t('Date'),
    type: 'date' as const,
    sortable: true,
    dateFormat: 'short',
    translatable: false
  },
  {
    key: 'whoFound',
    label: t('Who Found'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'itemName',
    label: t('Item Name'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'itemColor',
    label: t('Item Color'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'lostLocation',
    label: t('Location'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'room.roomNumber',
    label: t('Room'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'type',
    label: t('Type'),
    type: 'badge' as const,
    sortable: true,
    translatable: true,
    badgeVariant: (value: string) => {
      return value === 'found' ? 'blue' : 'red';
    }
  }
])

const actions = computed(() => [
  {
    label: 'View',
    handler: (item: any) => handleLostFoundAction('view', item)
  },
  {
    label: 'Edit',
    handler: (item: any) => handleLostFoundAction('edit', item)
  }
])

// Search functionality
const searchQuery = ref('')

const onSearchChange = (query: string) => {
  console.log('Search query changed:', query)
  // Add any additional search logic here if needed
}

// Fonction pour ouvrir le modal avec le bon type
const openModal = (type: 'lost' | 'found') => {
  isFoundMode.value = type === 'found'
  isEditMode.value = false
  selectedItem.value = null
  showModal.value = true
}

// Actions pour les items lost & found
const handleLostFoundAction = async (action: string, item: any) => {
  console.log('Lost Found action:', action, item)

  if (action === 'view' || action === 'edit') {
    const foundItem = lostFoundItems.value.find((lf: any) => lf.id === parseInt(item.id))

    if (foundItem) {
      selectedItem.value = foundItem
      
      if (action === 'edit') {
        isEditMode.value = true
        // Définir le mode Found basé sur le type de l'item
        isFoundMode.value = foundItem.type === 'found'
        showModal.value = true
      }
      
      console.log('Selected item:', selectedItem.value)
    } else {
      console.error('Item introuvable pour ID:', item.id)
    }
  }
}

// Fonction pour récupérer les objets perdus et trouvés
const fetchLostFoundItems = async () => {
  try {
    loading.value = true
    const response = await getLostFound();
    
    lostFoundItems.value = response.data.map((item: any) => {
      return {
        ...item,
        // Détermine le type en fonction de la présence de whoFound
        type: item.whoFound ? 'found' : 'lost',
        // Formate la date si nécessaire
        lost_on: item.lostOn || item.foundOn,
        // Assure que room est toujours un objet avec roomNumber
        room: item.room || { roomNumber: '' }
      }
    })
    
    console.log("Formatted lostFoundItems", lostFoundItems.value)

  } catch (error) {
    console.error('Failed to fetch lost & found items:', error);
  } finally {
    loading.value = false
  }
};

const handleCloseModal = () => {
  showModal.value = false
  isEditMode.value = false
  isFoundMode.value = false
  selectedItem.value = null
}

// Fonction pour gérer la soumission du formulaire Lost & Found
const handleSubmitLostFound = async (payload: any) => {
  try {
    loading.value = true

    const { data, isEdit, isFound } = payload
    data.service_id = serviceStore.serviceId
    
    // Ajouter le type d'item selon le mode
    if (!isEdit) {
      data.type = isFound ? 'found' : 'lost'
    }

    console.log('Submit lost found:', data)

    if (isEdit) {
      // Appel API pour modifier
      const id = selectedItem.value?.id
      if (!id) {
        throw new Error('ID de l\'item non trouvé pour la mise à jour')
      }
    
      await updateLostFoundItem(id, data)
      
      // Mise à jour locale pour la démo
      const index = lostFoundItems.value.findIndex(item => item.id === selectedItem.value?.id)
      if (index !== -1) {
        lostFoundItems.value[index] = { ...lostFoundItems.value[index], ...data }
      }
      
      toast.success(t('toast.Updated'))
    } else {
      // Appel API pour créer
       await addLostFound(data)
      
      toast.success(t('toast.Created'))
    }

    // Rafraîchir la liste (optionnel si vous faites les modifications locales)
    // await fetchLostFoundItems()
    showModal.value = false

  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      const serverMessage = error.response.data?.message
      toast.error(serverMessage || t('toast.error'))
    } else {
      toast.error(t('toast.error'))
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchLostFoundItems()
})
</script>

<style scoped></style>