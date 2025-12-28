<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Meal Plans Table using ReusableTable -->
      <ReusableTable
        :title="$t('Meal Plans')"
        :columns="columns"
        :data="mealPlans"
        :actions="actions"
        :search-placeholder="$t('Search meal plans...')"
        :selectable="false"
        :empty-title="$t('No meal plans found')"
        :empty-description="$t('Start by adding your first meal plan.')"
        :loading="isLoading"
        :meta="paginationMeta"
        @page-change="handlePageChange"
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton
            @click="openAddModal"
            :label="$t('Add Meal Plan')"
            :icon="Plus"
          >
          </BasicButton>

          <BasicButton
            v-if="selectedMealPlans.length > 0"
            @click="deleteSelected"
            :label="$t('Delete Selected')"
            :icon="Trash2"
          >
          </BasicButton>
        </template>
        <template #column-assignMealPlanOn="{ item }">
          <span class="text-sm text-gray-900 dark:text-white break-words">
            {{ formatAssignMealPlanOn(item) }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? $t('Add Meal Plan') : $t('Edit Meal Plan') }}
          </h3>

          <form @submit.prevent="saveMealPlan" class="space-y-4">
            <!-- General Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input v-model="formData.name" :lb="$t('Plan Name')" :placeholder="$t('Enter plan name')" :is-required="true" />
              </div>
              <div>
                <Input v-model="formData.shortCode" :lb="$t('Short Code')" :placeholder="$t('e.g., DP, PC')" :is-required="true" />
              </div>
              <div>
                <Select v-model="formData.status" :lb="$t('Status')" :options="statusOptions" :placeholder="$t('Select status')" />
              </div>
              <div class="flex items-center">
                <input id="isAllInclusive" v-model="formData.isAllInclusive" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded" />
                <label for="isAllInclusive" class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('All-Inclusive (includes drinks and activities)') }}</label>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('Assign meal plan on') }}
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label class="flex items-center">
                    <input v-model="formData.assignMealPlanOn" type="checkbox" value="CheckIn" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Check In') }}</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="formData.assignMealPlanOn" type="checkbox" value="StayOver" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Stay Over') }}</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="formData.assignMealPlanOn" type="checkbox" value="CheckOut" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Check Out') }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Plan Construction -->
            <div class="pt-2 border-t">
              <h2 class="text-base font-semibold text-gray-800 mb-4">{{ $t('Plan Components') }}</h2>
              <p class="text-gray-600 mb-4">{{ $t('Add unit charges that compose the package. Only extra charges marked as Meal Plan Component are selectable.') }}</p>

              <!-- Add Component Tool -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <!-- <div>
                  <Select v-model="newComponent.extraChargeId" :lb="'Extra Charge'" :options="extraChargeOptions" :placeholder="'Select extra charge'" />
                </div> -->
                <div>
                  <InputExtractChargeSelect  v-model="newComponent.extraChargeId" :lb="$t('Extra Charge')" />
                </div>
                <div>
                  <Input v-model.number="newComponent.quantityPerDay" :lb="$t('Quantity / Night')" input-type="number" :min="1" :placeholder="'1'" />
                </div>
                <div>
                  <Select v-model="newComponent.targetGuestType" :lb="$t('Guest Type')" :options="guestTypeOptions" :placeholder="$t('Select guest type')" />
                </div>
                <div class="flex justify-end">
                  <BasicButton type="button" variant="primary" :label="$t('Add Component')" @click="addComponent" />
                </div>
              </div>

              <!-- Components Table -->
              <div class="mt-6 overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 dark:bg-black">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('Extra Charge') }}</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('Quantity / Night') }}</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('Guest Type') }}</th>
                      <th class="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-black divide-y divide-gray-200">
                    <tr v-for="(comp, idx) in components" :key="idx">
                      <td class="px-4 py-2">{{ comp.extraChargeName }}</td>
                      <td class="px-4 py-2">{{ comp.quantityPerDay }}</td>
                      <td class="px-4 py-2">{{ capitalize(comp.targetGuestType) }}</td>
                      <td class="px-4 py-2 text-right">
                        <BasicButton type="button" variant="outline" :label="$t('Remove')" @click="removeComponent(idx)" />
                      </td>
                    </tr>
                    <tr v-if="components.length === 0" class="dark:bg-black">
                      <td class="px-4 py-4 text-sm text-gray-500" colspan="4">{{ $t('No components added yet.') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Save -->
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" :label="$t('Cancel')" @click="closeModal" />
              <BasicButton type="submit" variant="primary" :icon="Save" :label="isSaving ? $t('Saving...') : (showEditModal ? $t('Update Meal Plan') : $t('Save Meal Plan'))" :loading="isSaving" />
            </div>
          </form>
        </div>
      </div>
    </div>
     <ConfirmationModal
        v-model:show="show"
        :title="$t('confirmDelete')"
        :message="$t('deleteMealPlan',{message:deleteItem?.name})"
        :confirm-text="$t('delete')"
        :cancel-text="$t('cancel')"
        variant="danger"
        :loading="loadingDelete"
        @confirm="confirmDelete"
        @cancel="show = false"
      />
  </ConfigurationLayout>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { Save, Plus, Trash2, Edit } from 'lucide-vue-next'
import { getExtraCharges, getMealPlans, postMealPlan, updateMealPlanById, deleteMealPlanById } from '@/services/configrationApi'
import type { Column } from '../../../utils/models'
import InputExtractChargeSelect from '@/components/reservations/foglio/InputExtractChargeSelect.vue'
import { useI18n } from 'vue-i18n'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'

const toast = useToast()

// Table state
const isLoading = ref(false)
const show = ref(false)
const loadingDelete = ref(false)
const mealPlans = ref<any[]>([])
const selectedMealPlans = ref<any[]>([])
const paginationMeta = ref<any>(null)
const deleteItem = ref<any>(null)
const {t} = useI18n()

const columns :Column[] = [
  { key: 'name', label: t('Name'), type: 'text' },
  { key: 'shortCode', label: t('Short Code'), type: 'text' },
  { key: 'status', label: t('Status'), type: 'badge', translatable:true },
  { key: 'assignMealPlanOn', label: t('Assign meal plan on'), type: 'custom' },
]

const actions = [
  { name: 'edit', label: t('Edit'), variant: 'primary', icon: Edit, handler: (item:any) => onAction('edit', item) },
  { name: 'delete', label: t('Delete'), variant: 'danger', icon: Trash2 , handler: (item:any) => onAction('delete', item) },
]

// Modal state
const showAddModal = ref(false)
const showEditModal = ref(false)
const isSaving = ref(false)
const editingMealPlan = ref<any | null>(null)

// Form data
const formData = reactive({
  name: '',
  shortCode: '',
  status: 'Active',
  isAllInclusive: false,
  assignMealPlanOn: [] as string[],
})

const statusOptions = [
  { value: 'Active', label: t('Active') },
  { value: 'Inactive', label: t('Inactive') },
]

const guestTypeOptions = [
  { value: 'adult', label: t('Adult') },
  { value: 'child', label: t('Child') },
]

// Extra charges options filtered by meal plan component flag
const extraChargeOptions = ref<{ value: number; label: string }[]>([])

const newComponent = reactive({
  extraChargeId: undefined as number | undefined,
  quantityPerDay: 1,
  targetGuestType: 'adult',
})

const components = ref<{
  extraChargeId: number
  extraChargeName: string
  quantityPerDay: number
  targetGuestType: string
}[]>([])

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const openAddModal = () => {
  showAddModal.value = true
  showEditModal.value = false
  editingMealPlan.value = null
  resetForm()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingMealPlan.value = null
  resetForm()
}

const resetForm = () => {
  formData.name = ''
  formData.shortCode = ''
  formData.status = 'Active'
  formData.isAllInclusive = false
  formData.assignMealPlanOn = []
  components.value = []
}

type AssignMealPlanOn = 'CheckIn' | 'StayOver' | 'CheckOut'

const assignMealPlanOnLabel: Record<AssignMealPlanOn, string> = {
  CheckIn: 'Check In',
  StayOver: 'Stay Over',
  CheckOut: 'Check Out',
}

const normalizeAssignMealPlanOn = (value: unknown): AssignMealPlanOn[] => {
  const rawValues: string[] = Array.isArray(value)
    ? value.map((v) => String(v))
    : typeof value === 'string'
      ? value.split(',')
      : []

  const mapped = rawValues
    .map((v) => String(v).trim())
    .filter(Boolean)
    .map((v) => {
      const normalized = v.replace(/\s+/g, '').toLowerCase()
      if (normalized === 'checkin') return 'CheckIn'
      if (normalized === 'stayover') return 'StayOver'
      if (normalized === 'checkout') return 'CheckOut'
      return null
    })
    .filter((v): v is AssignMealPlanOn => v !== null)

  return Array.from(new Set(mapped))
}

const formatAssignMealPlanOn = (item: any): string => {
  const raw =
    item?.assignMealPlanOn ??
    item?.assign_meal_plan_on ??
    item?.assignOn ??
    item?.assign_on
  const values = normalizeAssignMealPlanOn(raw)
  return values.length ? values.map((v) => t(assignMealPlanOnLabel[v])).join(', ') : '-'
}

const addComponent = () => {
  if (!newComponent.extraChargeId) {
    toast.error('Please select an extra charge')
    return
  }
  const option = extraChargeOptions.value.find((o) => o.value === newComponent.extraChargeId)
  components.value.push({
    extraChargeId: newComponent.extraChargeId,
    extraChargeName: option?.label || `ID ${newComponent.extraChargeId}`,
    quantityPerDay: newComponent.quantityPerDay || 1,
    targetGuestType: newComponent.targetGuestType || 'adult',
  })
  // reset selector
  newComponent.extraChargeId = undefined
  newComponent.quantityPerDay = 1
  newComponent.targetGuestType = 'adult'
}

const removeComponent = (idx: number) => {
  components.value.splice(idx, 1)
}

const fetchExtraCharges = async () => {
  try {
    const res = await getExtraCharges({ limit: 200 })
    const list = (res.data?.data?.data || res.data?.data || []) as any[]
    // Filter by flag isMealPlanComponent or is_meal_plan_component
    const filtered = list//.filter((item) => item.isMealPlanComponent === true || item.is_meal_plan_component === true)
    extraChargeOptions.value = filtered.map((item) => ({ value: Number(item.id), label: item.name }))
  } catch (e) {
    console.error('Failed to load extra charges', e)
    toast.error(t('Failed to load extra charges'))
  }
}

const fetchMealPlans = async (pageNumber=1) => {
  try {
    isLoading.value = true
    const res = await getMealPlans({page:pageNumber,limit:10})
    console.log('res',res)
    mealPlans.value = (res.data?.data?.data || res.data?.data || res.data || [])
    paginationMeta.value = (res.data?.data?.meta || res.data?.meta || [])
  } catch (e) {
    console.error('Failed to load meal plans', e)
    toast.error(t('Failed to load meal plans'))
  } finally {
    isLoading.value = false
  }
}

const saveMealPlan = async () => {
  if (!formData.name || !formData.shortCode) {
    toast.error(t('Name and Short Code are required'))
    return
  }
  if (components.value.length === 0) {
    toast.error(t('Add at least one component'))
    return
  }
  isSaving.value = true
  try {
    const payload = {
      name: formData.name,
      shortCode: formData.shortCode,
      status: formData.status,
      isAllInclusive: !!formData.isAllInclusive,
      assignMealPlanOn: normalizeAssignMealPlanOn(formData.assignMealPlanOn),
      components: components.value.map((c) => ({
        extraChargeId: c.extraChargeId,
        quantityPerDay: c.quantityPerDay,
        targetGuestType: c.targetGuestType,
      })),
    }
    let res
    if (showEditModal.value && editingMealPlan.value?.id) {
      res = await updateMealPlanById(editingMealPlan.value.id, payload)
    } else {
      res = await postMealPlan(payload)
    }
    if (res.status === 200 || res.status === 201) {
      toast.success(showEditModal.value ? t('Meal plan updated') : t('Meal plan saved'))
      closeModal()
      await fetchMealPlans(1)
    } else {
      toast.error(t('Failed to save meal plan'))
    }
  } catch (e) {
    console.error('Failed to save meal plan', e)
    toast.error(t('Failed to save meal plan'))
  } finally {
    isSaving.value = false
  }
}
const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editMealPlan(item)
  } else if (action === 'delete') {
    deleteMealPlan(item)
  }
}

const editMealPlan = (item: any) => {

  showEditModal.value = true
  showAddModal.value = false
  editingMealPlan.value = item
  formData.name = item.name || ''
  formData.shortCode = item.shortCode || ''
  formData.status = item.status || 'Active'
  formData.isAllInclusive = !!item.isAllInclusive
  formData.assignMealPlanOn = normalizeAssignMealPlanOn(
    item.assignMealPlanOn ??
      item.assign_meal_plan_on ??
      item.assignOn ??
      item.assign_on,
  )
  // Map API components to local components table if present
  const apiComponents = item.components || []
  components.value = apiComponents.map((c: any) => ({
    extraChargeId: Number(c.extraChargeId || c.extra_charge_id),
    extraChargeName: c.extraCharge.name || c.extra_charge_name || String(c.extraChargeId || c.extra_charge_id),
    quantityPerDay: Number(c.quantityPerDay || c.quantity_per_day || 1),
    targetGuestType: c.targetGuestType || c.target_guest_type || 'adult',
  }))

}

const deleteMealPlan =  (item: any) => {
  deleteItem.value = item
  show.value = true
}
  const confirmDelete = async() =>{
  try {
    loadingDelete.value = true
    await deleteMealPlanById(deleteItem.value.id)
     deleteItem.value = null
    show.value = false
    toast.success(t('Meal plan deleted'))
    await fetchMealPlans(1)
  } catch (e) {
    console.error('Failed to delete meal plan', e)
    toast.error(t('Failed to delete meal plan'))
  }finally{
    loadingDelete.value = false
  }
}



const onSelectionChange = (selected: any[]) => {
  selectedMealPlans.value = selected
}

const deleteSelected = async () => {
  if (selectedMealPlans.value.length === 0) return
  // const confirmed = window.confirm(`Delete ${selectedMealPlans.value.length} selected meal plan(s)?`)
  const confirmed = window.confirm(t('deleteMealPlans',{message:selectedMealPlans.value.length}))
  if (!confirmed) return
  try {
    for (const item of selectedMealPlans.value) {
      if (item?.id) {
        await deleteMealPlanById(item.id)
      }
    }
    toast.success(t('Selected meal plans deleted'))
    selectedMealPlans.value = []
    await fetchMealPlans(1)
  } catch (e) {
    console.error('Failed bulk delete', e)
    toast.error(t('Failed to delete selected meal plans'))
  }
}
const handlePageChange = (page:number) =>{
  fetchMealPlans(page)
}

onMounted(() => {
  fetchMealPlans(1)
  fetchExtraCharges()
})
</script>
