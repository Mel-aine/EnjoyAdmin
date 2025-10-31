<template>
  <ReportsLayout>
    <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="$t('StockMovements')" />
      <FullScreenLayout>
      <div class="py-5 mt-8  container mx-auto">
        <!-- <div
          class="rounded-2xl border border-gray-200 max-w-6xl bg-white shadow-lg dark:border-gray-800 dark:bg-white/[0.03]"
        > -->
        <!-- Header -->
        <div class="flex justify-end items-center p-6 border-b border-gray-100 dark:border-gray-800">

          <div class="flex gap-3">
            <!-- Nouveau Mouvement -->
            <button @click="openModal"
              class="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {{ $t('addMovement') }}
            </button>

            <!-- Exporter -->
            <!-- <button
                @click="exportToExcel"
                class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4 4m0 0l4-4m-4 4V4" /></svg>
                {{ $t('export') }}
              </button> -->
          </div>
        </div>

        <!-- Tableau -->
        <div class="space-y-5 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">

          <TableComponent :items="titles" :datas="movements" :filterable="true" :pagination="true" :loading="loading"
            :showHeader="true" :title="$t('StockMovements')" :pageSize="15" :showButtonAllElement="true"
            @edit="onEditMovement" @delete="onDeleteMovement" class="modern-table" />
        </div>
        <!-- </div> -->
      </div>

      <!-- Modal pour ajouter/modifier un mouvement -->
      <Modal v-if="showModal" @close="closeModal()">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <!-- close btn -->
            <button @click="closeModal()"
              class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
              <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                  fill="" />
              </svg>
            </button>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">
                {{ isEditing ? $t('edit') : $t('new') }} {{ $t('stockMovement') }}
              </h3>
            </div>

            <form @submit.prevent="saveMovement">
              <div class="grid grid-cols-2 gap-4">
                <div class="mb-4">
                  <Input :inputType="'date'" :lb="$t('Date')" :id="'date'" :forLabel="'date'"
                    v-model="currentMovement.date" required />
                </div>

                <div class="mb-4">
                  <Select v-model="currentMovement.type" :lb="$t('Type')" :options="mouvementTypes" required />
                </div>

                <div class="mb-4">
                  <Select :lb="$t('category')" :options="categories" v-model="currentMovement.sourceId" />
                </div>
                <div class="mb-4">
                  <AutoCompleteSelect
                   :lb="$t('product')" :options="productData" v-model="currentMovement.productId" />
                </div>

                <div class="mb-4">
                  <Input :inputType="'number'" :lb="$t('quantity')" :id="'quantity'" :forLabel="'quantity'"
                    v-model="currentMovement.quantity" required min="1" />
                </div>

                <div v-if="currentMovement.type === 'Transfer'" class="mb-4">
                  <Select :lb="$t('destination')" :options="departments" v-model="currentMovement.destinationId"
                    required />
                </div>

                <div class="mb-4 col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{
                    $t('Note')
                    }}</label>
                  <textarea v-model="currentMovement.notes" class="w-full border rounded-md px-3 py-2 h-20"
                    :placeholder="$t('Largetext')"></textarea>
                </div>
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <button type="button" @click="closeModal"
                  class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
                  {{ $t('Cancel') }}
                </button>
                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  <span v-if="!isLoading"> {{ isEditing ? $t('update') : $t('Save') }}</span>
                  <span v-else class="flex items-center gap-2">
                    <Spinner class="w-4 h-4" />
                    {{ $t('Processing') }}...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </template>
      </Modal>
      </FullScreenLayout>
    </AdminLayout>
    </div>
    <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
  </ReportsLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import {
  getProduct,
  movementService,
  getMovementService,
  updateMovementService,
  deleteMovement,
  getCategory,
  getDepartment,
} from '@/services/api'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import { useI18n } from 'vue-i18n'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
interface StockMovement {
  id?: number
  date: string
  productId: number | any
  type: string
  quantity: number
  sourceId: number
  destinationId: number | any
  user: string
  notes?: string
}

const isLoading = ref(false)
const loading = ref(false)
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const showModal = ref(false)
const show = ref(false)
const isEditing = ref(false)
const selectedId = ref<number | null>(null)
const loadingDelete = ref(false)
const mouvementTypes = computed(() => [
  { label: t('movement.entry'), value: 'Entry' },
  { label: t('movement.exit'), value: 'Exit' },
  { label: t('movement.transfer'), value: 'Transfer' },
])

// const roleId = roleStore.roleId

// const userData = authStore.user
const user = authStore.user

const currentMovement = reactive<StockMovement>({
  date: new Date().toISOString().split('T')[0],
  productId: null,
  type: 'Entry',
  quantity: 1,
  sourceId: 0,
  destinationId: null,
  user: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
  notes: '',
})

const movements = ref<any[]>([])
const categories = ref<any[]>([]);
const departmentId = ref<number | null>(null)
const productData = ref<any[]>([])


const titles = computed(() => [
  {
    name: 'date',
    label: t('Date'),
    type: 'date',
    filterable: false,
  },
  {
    name: 'productName',
    label: t('product'),
    type: 'text',
    filterable: true,
    isTranslatable:true
  },
  {
    name: 'statusColor',
    label: t('Type'),
    type: 'badge',
    filterable: false,
  },
  {
    name: 'quantity',
    label: t('quantity'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'category',
    label: t('category'),
    type: 'text',
    filterable: true,
    isTranslatable:true
  },
  {
    name: 'destination',
    label: t('destination'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'stockInitial',
    label: t('stockInitial'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'stockFinal',
    label: t('stockFinal'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: t('common.edit'),
        event: 'edit',
        icone: ` <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
            <line x1="16" y1="5" x2="19" y2="8" />
          </svg>`,
      },
      {
        name: t('common.delete'),
        event: 'delete',
        icone: `<svg class="h-5 w-5 text-red-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>`,
      },
    ],
  },
])

const onEditMovement = (m: any) => handleMovementAction('edit', m)
const onDeleteMovement = (m: any) => handleMovementAction('delete', m)

const handleMovementAction = (action: string, m: any) => {
  if (action === 'edit') {
    const movementEdit = movements.value.find((r: any) => r.id === m.id)
    console.log('Editing :', movements.value)

    if (movementEdit) {
      selected.value = movementEdit
      currentMovement.date = movementEdit.date
      currentMovement.destinationId = movementEdit.departmentId
      currentMovement.notes = movementEdit.notes
      currentMovement.productId = movementEdit.productId
      currentMovement.quantity = movementEdit.quantity
      currentMovement.sourceId = movementEdit.category
      currentMovement.type = movementEdit.type
      isEditing.value = true
      showModal.value = true
    }
  } else if (action === 'delete') {
    selectedId.value = m.id
    show.value = true
  }
}

const product = ref<any[]>([])
const departments = ref<any[]>([])

const fetchProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getProduct(serviceId)
    // TODO Add the route to get the product with the category
    product.value = response.data

    } catch (error) {
    console.error('Erreur lors de la récupération :', error)
  }
}

const fetchDepartment = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getDepartment(serviceId)

    departments.value = response.data.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
    console.log('cate:', departments.value)
  } catch (error) {
    console.error('Erreur lors de la récupération :', error)
  }
}

const fetchCategorie = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getCategory(serviceId)

    categories.value = response.data.map((item: any) => ({
      label: t(item.name),
      value: item.id,
    }))
    console.log('cate:', categories.value)
  } catch (error) {
    console.error('Erreur lors de la récupération :', error)
  }
}

const selected = ref<any>(null)

const updateData = async () => {
  isLoading.value = true

  try {
    const serviceId = serviceStore.serviceId
    const id = selected.value?.id

    if (!id) {
      toast.error(t('toast.selectError'))
      return
    }
    const prod = categories.value.find((s: any) => s.label === currentMovement.sourceId)?.value
     const DepartmentId = currentMovement.destinationId || null;
    const Payload = {
      service_id: serviceId,
      date: currentMovement.date,
      department_id: DepartmentId,
      notes: currentMovement.notes,
      product_id: currentMovement.productId,
      quantity: currentMovement.quantity,
      stock_category_id: prod,
      type: currentMovement.type,
    }
    console.log("payload", Payload)

    await updateMovementService(id, Payload)

    resetForm()
    selected.value = null
    isEditing.value = false
    showModal.value = false
    fetchMovements()
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    isLoading.value = false
  }
}

// Gestion du modal
const openModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(currentMovement, {
    date: new Date().toISOString().split('T')[0],
    product: '',
    type: 'Entry',
    quantity: 1,
    sourceId: 0,
    destinationId: 0,
    user: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
    notes: '',
  })
}


const saveMovement = async () => {
  isLoading.value = true
  const serviceId = serviceStore.serviceId
  try {
    if (isEditing.value) {
      await updateData()
      toast.success(t('toast.SucessUpdate'))
    } else {

      const prod = categories.value.find((s: any) => s.value === currentMovement.sourceId)?.value
      const DepartmentId = currentMovement.destinationId || null;
      console.log('prod', categories.value)

      console.log('........', typeof (prod))
      const payload = {
        product_id: currentMovement.productId,
        type: currentMovement.type,
        quantity: currentMovement.quantity,
        stock_category_id: prod,
        department_id: DepartmentId,
        user: currentMovement.user,
        notes: currentMovement.notes,
        service_id: serviceId,
        date: currentMovement.date,
        created_by : authStore.UserId
      }
      console.log('mouvement stock', payload)
      const response = await movementService(payload)
      console.log('mouvement stock', payload)
      console.log('response', response)
      toast.success(t('toast.Sucess'))
    }

    closeModal()
    await fetchMovements()
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error)
    toast.error(t('toast.error'))
  } finally {
    isLoading.value = false
  }
}
const confirmDelete = async () => {
  if (selectedId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteMovement(selectedId.value)
      toast.success(t('toast.DeletedSuccess'))
      movements.value = movements.value.filter((r: any) => r.id !== selectedId.value)
      console.log(`Suppression du room type ID: ${selectedId.value}`)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(t('toast.userDeleteError'))
    } finally {
      loadingDelete.value = false
      show.value = false
      selectedId.value = null
    }
  }
}



const getStatusColor = (status: string) => {
  switch (status) {
    case 'Entry':
      return 'bg-green-100 text-green-700'
    case 'Ajustment':
      return 'bg-yellow-100 text-yellow-700'
    case 'Exit':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getMovementTypeLabel = (type: string) => {
  switch (type) {
    case 'Entry':
      return t('movement.entry')
    case 'Exit':
      return t('movement.exit')
    case 'Transfer':
      return t('movement.transfer')
    case 'Ajustment':
    case 'Adjustment':
      return t('movement.adjustment')
    default:
      return type
  }
}

onMounted(async () => {
  loading.value = true
  await fetchProduct()
  await fetchDepartment()
  await fetchCategorie()
  await fetchMovements()
  await new Promise((resolve) => setTimeout(resolve, 500))

  loading.value = false
})


const fetchMovements = async () => {
  loading.value = true
  try {
    const serviceId = serviceStore.serviceId
    const response = await getMovementService(serviceId)

    console.log('🧾 chaque produit :', response)

    const stockMap: Record<string, number> = {}
    product.value.forEach((p: any) => {
      stockMap[p.id] = p.quantityAvailable
    })

    movements.value = response.data.map((m: any) => {
      const statusClasses = getStatusColor(m.type).split(' ')
      const productId = m.productId
      const currentStock = stockMap[productId] ?? 0

      const qtyIn = m.type === 'Entry' ? m.quantity : 0
      const qtyOut = m.type === 'Exit' ? m.quantity : 0
      const stockFinal = currentStock + qtyIn - qtyOut
      const prod = product.value.find((p: any) => p.id === productId)
      const productName = prod?.name || t('Unknown')
      const category = prod?.stockCategoryId ? getCategoryName(prod.stockCategoryId) : t('common.na')

      console.log('Produit ID :', productId)
      console.log('Type :', m.type)
      console.log('Quantité :', m.quantity)
      console.log('Stock initial :', currentStock)
      console.log('Stock final :', stockFinal)
      console.log('Catégorie du produit :', category)

      // Mise à jour du stock courant
      stockMap[productId] = stockFinal
      console.log('Destination (département) :', m)

      return {
        ...m,
        productName,
        category,
        statusColor: {
          label: getMovementTypeLabel(m.type),
          bg: statusClasses[0],
          text: statusClasses[1],
        },
        destination: m.departmentId ? getDepartmentName(m.departmentId) : t('common.na'),

        stockInitial: currentStock,
        stockFinal,
      }
    })

    console.log('✅ Mouvements traités :', movements.value)
  } catch (error) {
    console.error('Erreur lors du chargement des mouvements :', error)
  }
}

const getCategoryName = (id: number) => {
  const found = categories.value.find((s: any) => s.value === Number(id))
  return found ? found.label : ''
}

const getDepartmentName = (id: number) => {
  const found = departments.value.find((s: any) => s.value === Number(id))
  return found ? found.label : ''
}


// Watch for changes on sourceId and reset productId if not in filtered list
watch(
  () => currentMovement.sourceId,
  (newSourceId) => {
    // If the currently selected product is not in the filtered list, reset it
    productData.value = product.value.filter((p: any) => p.stockCategoryId === newSourceId)?.map((el: any) => ({
      value: el.id,
      label: t(el.name),
    }))
  }
)

</script>
