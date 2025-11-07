<template>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="$t('LostAndFound')" :breadcrumb="breadcrumb" />
      <div class="h-full">
        <ReusableTable
          :title="$t('LostAndFound')"
          :columns="columns"
          :data="filteredLostFoundItems"
          :actions="actions"
          :selectable="false"
          :loading="loading"
          :searchPlaceholder="$t('search...')"
          @page-change="handlePageChange"
          :meta="paginationMeta"
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
              :icon="FileDown"
              @click="exportLostFound"
              :loading="exportLoading"
            />

          </template>
          <!-- Template pour la colonne status -->
          <template #column-status="{ item }">
            <span :class="getStatusClass(item.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ $t(`statuses.${item.status}`) }}
            </span>
          </template>

          <!-- Template pour la colonne type -->
          <template #column-type="{ item }">
            <span :class="getTypeClass(item.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ $t(`types.${item.type}`) }}
            </span>
          </template>
        </ReusableTable>
      </div>
      <ConfirmationModal
        v-model:show="showDeleteConfirmation"
        :title="$t('confirmDelete')"
        :message="$t('deleteBlockConfirmMessage')"
        :confirm-text="$t('delete')"
        :cancel-text="$t('cancel')"
        variant="danger"
        :loading="deleteLoading"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </AdminLayout>

    <ModalLostAndFound
      :isOpen="showModal"
      :isEditMode="isEditMode"
      :isFoundMode="isFoundMode"
      :lostFoundData="selectedItem"
      @close="handleCloseModal"
      @submit="handleSubmitLostFound"
    />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'))
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import type { ReservationType } from '@/types/option'
import { useI18n } from 'vue-i18n'
import { UserIcon, FolderOutputIcon, IdCard } from 'lucide-vue-next'
import { defineAsyncComponent as defineAsyncComponentBreadcrumb } from 'vue'
const PageBreadcrumb = defineAsyncComponentBreadcrumb(() => import('@/components/common/PageBreadcrumb.vue'))
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import ModalLostAndFound from '@/components/modal/AddLostAndFound.vue'
import { useToast } from 'vue-toastification';
import BasicButton from '../../components/buttons/BasicButton.vue'
import UserFilters from '../../components/filters/UserFilters.vue'
import { getLostFound, addLostFound, updateLostFoundItem, deleteLostFoundItem } from '@/services/lostfound'
import {  Edit, Trash2, FileDown } from 'lucide-vue-next'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

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
const showDeleteConfirmation = ref(false)
const deleteLoading = ref(false)
const exportLoading = ref(false)
const paginationMeta = ref<any>(null)

const columns = computed(() => [
  {
    key: 'status',
    label: t('Status'),
    type: 'custom' as const, // Changé de 'status' à 'custom'
    sortable: true,
    translatable: true,
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
    type: 'custom' as const, // Changé de 'text' à 'custom'
    sortable: true,
    translatable: true,
  }
])




const actions = computed(() => [
  {
    label: t('Edit'),
    action: 'edit',
    icon: Edit,
    variant: 'primary',
    handler: (item: any) => handleLostFoundAction('edit', item)
  },
  {
    label: t('Delete'),
    action: 'delete',
    icon: Trash2,
    variant: 'danger',
    handler: (item: any) => handleLostFoundAction('delete', item)
  }
])

const breadcrumb = [
  { label: t('navigation.frontOffice'), href: '#' },
  { label: t('LostAndFound'), href: '#' }
]

// Search functionality
const searchQuery = ref('')

// Propriété computed pour les données filtrées
const filteredLostFoundItems = computed(() => {
  let filtered = lostFoundItems.value

  if (searchQuery.value) {
    const searchTerm = searchQuery.value.toLowerCase().trim()

    if (searchTerm) {
      filtered = filtered.filter(item => {
        // Recherche dans tous les champs pertinents
        const status = item.status?.toLowerCase() || ''
        const whoFound = item.whoFound?.toLowerCase() || ''
        const itemName = item.itemName?.toLowerCase() || ''
        const itemColor = item.itemColor?.toLowerCase() || ''
        const location = item.lostLocation?.toLowerCase() || ''
        const roomNumber = item.room?.roomNumber?.toLowerCase() || ''
        const type = item.type?.toLowerCase() || ''
        const date = formatDate(item.lost_on).toLowerCase()

        return status.includes(searchTerm) ||
               whoFound.includes(searchTerm) ||
               itemName.includes(searchTerm) ||
               itemColor.includes(searchTerm) ||
               location.includes(searchTerm) ||
               roomNumber.includes(searchTerm) ||
               type.includes(searchTerm) ||
               date.includes(searchTerm)
      })
    }
  }

  return filtered
})

const onSearchChange = (query: string) => {
  console.log('Search query changed:', query)
  searchQuery.value = query
}

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

// Fonction d'exportation modifiée pour utiliser les données filtrées
const exportLostFound = async () => {
  if (filteredLostFoundItems.value.length === 0) {
    toast.error(t('noDataToExport'))
    return
  }

  exportLoading.value = true

  try {
    // Utiliser filteredLostFoundItems au lieu de lostFoundItems
    const csvData = filteredLostFoundItems.value.map(item => ({
      [t('lostFound.csv.status')]: item.status || '',
      [t('lostFound.csv.date')]: formatDate(item.lost_on),
      [t('lostFound.csv.whoFound')]: item.whoFound || '',
      [t('lostFound.csv.itemName')]: item.itemName || '',
      [t('lostFound.csv.itemColor')]: item.itemColor || '',
      [t('lostFound.csv.location')]: item.lostLocation || '',
      [t('lostFound.csv.roomNumber')]: item.room?.roomNumber || '',
      [t('lostFound.csv.type')]: item.type || ''
    }))

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(header => {
          const value = row[header as keyof typeof row] || ''
          // Escape quotes and wrap in quotes if contains comma or quote
          const escapedValue = value.toString().replace(/"/g, '""')
          return escapedValue.includes(',') || escapedValue.includes('"')
            ? `"${escapedValue}"`
            : escapedValue
        }).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `lost_and_found_filtered_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Message d'exportation amélioré
    const totalItems = lostFoundItems.value.length
    const filteredItems = filteredLostFoundItems.value.length

    if (filteredItems < totalItems) {
      toast.success(t('lostFoundExportedSuccessfully') + ` (${filteredItems}/${totalItems} items)`)
    } else {
      toast.success(t('lostFoundExportedSuccessfully'))
    }
  } catch (error: any) {
    console.error('Error exporting lost & found items:', error)
    toast.error(t('errorExportingLostFound'))
  } finally {
    exportLoading.value = false
  }
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

  const foundItem = lostFoundItems.value.find((lf: any) => lf.id === parseInt(item.id))

  if (!foundItem) {
    console.error('Item introuvable pour ID:', item.id)
    return
  }

  selectedItem.value = foundItem

  if (action === 'view' || action === 'edit') {
    if (action === 'edit') {
      isEditMode.value = true
      isFoundMode.value = foundItem.type === 'found'
      showModal.value = true
    }
    // Vous pouvez ajouter la logique pour 'view' ici si nécessaire
    console.log('Selected item:', selectedItem.value)
  }
  else if (action === 'delete') {
    showDeleteConfirmation.value = true
  }
}

// Fonction pour récupérer les objets perdus et trouvés
const fetchLostFoundItems = async (pageNumber = 1) => {
  try {
    loading.value = true
    const response = await getLostFound({page: pageNumber,limit: 10});
    console.log('response',response)
    paginationMeta.value = response.meta;
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

const handlePageChange = (newPage: number) => {
  fetchLostFoundItems(newPage);
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

    // Normaliser les dates en format YYYY-MM-DD et nettoyer les champs vides
    const normalizeDateToYMD = (value: any) => {
      if (!value) return undefined
      if (typeof value === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
        const match = value.match(/^\d{4}-\d{2}-\d{2}/)
        if (match) return match[0]
      }
      return value
    }

    const payloadData: any = { ...data }
    payloadData.service_id = serviceStore.serviceId

    // foundOn: convertir en YYYY-MM-DD ou supprimer si vide
    const normalizedFoundOn = normalizeDateToYMD(payloadData.foundOn)
    if (normalizedFoundOn) payloadData.foundOn = normalizedFoundOn
    else delete payloadData.foundOn

    // lostOn: convertir en YYYY-MM-DD ou supprimer si vide
    const normalizedLostOn = normalizeDateToYMD(payloadData.lostOn)
    if (normalizedLostOn) payloadData.lostOn = normalizedLostOn
    else delete payloadData.lostOn

    // Ajouter le type d'item selon le mode
    if (!isEdit) {
      payloadData.type = isFound ? 'found' : 'lost'
    }

    console.log('Submit lost found:', payloadData)

    if (isEdit) {
      // Appel API pour modifier
      const id = selectedItem.value?.id
      if (!id) {
        throw new Error('ID de l\'item non trouvé pour la mise à jour')
      }

      // Mise à jour locale pour la démo
      await updateLostFoundItem(id, payloadData)
      fetchLostFoundItems()
      const index = lostFoundItems.value.findIndex(item => item.id === selectedItem.value?.id)
      if (index !== -1) {
        lostFoundItems.value[index] = { ...lostFoundItems.value[index], ...payloadData }
      }

      toast.success(t('toast.Updated'))
    } else {
      // Appel API pour créer
      console.log("data.send", payloadData)

      const response = await addLostFound(payloadData)
      fetchLostFoundItems()
      console.log("data.receive", response)

      toast.success(t('toast.Created'))
    }

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

const confirmDelete = async () => {
  deleteLoading.value = true

  try {
    await deleteLostFoundItem(selectedItem.value?.id)
    fetchLostFoundItems()
    toast.success(t('successBlockDeleted'))

  } catch (error: any) {
    console.error('Error deleting block:', error)
    const errorMsg = error.response?.data?.message || error.message || t('errorDeletingBlock')
    console.log('errorMsg',errorMsg)
    toast.error(t('errorDeleteBlock'))
  } finally {
    deleteLoading.value = false
    showDeleteConfirmation.value = false
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'returned':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'discarded':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'found':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'lost':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const cancelDelete = () => {
  showDeleteConfirmation.value = false
}

// Debounce search pour améliorer les performances
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    console.log('Search query changed to:', searchQuery.value)
  }, 300)
})

onMounted(async () => {
  await fetchLostFoundItems(1)
})
</script>

<style scoped></style>
