<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Meal Plans Table using ReusableTable -->
      <ReusableTable
        title="Meal Plans"
        :columns="columns"
        :data="mealPlans"
        :actions="actions"
        search-placeholder="Search meal plans..."
        :selectable="false"
        empty-title="No meal plans found"
        empty-description="Start by adding your first meal plan."
        :loading="isLoading"
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton
            @click="openAddModal"
            :label="'Add Meal Plan'"
            :icon="Plus"
          >
          </BasicButton>

          <BasicButton
            v-if="selectedMealPlans.length > 0"
            @click="deleteSelected"
            :label="'Delete Selected'"
            :icon="Trash2"
          >
          </BasicButton>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? 'Add Meal Plan' : 'Edit Meal Plan' }}
          </h3>

          <form @submit.prevent="saveMealPlan" class="space-y-4">
            <!-- General Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input v-model="formData.name" :lb="'Plan Name'" :placeholder="'Enter plan name'" :is-required="true" />
              </div>
              <div>
                <Input v-model="formData.shortCode" :lb="'Short Code'" :placeholder="'e.g., DP, PC'" :is-required="true" />
              </div>
              <div>
                <Select v-model="formData.status" :lb="'Status'" :options="statusOptions" :placeholder="'Select status'" />
              </div>
              <div class="flex items-center">
                <input id="isAllInclusive" v-model="formData.isAllInclusive" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded" />
                <label for="isAllInclusive" class="ml-2 text-sm text-gray-700 dark:text-gray-300">All-Inclusive (includes drinks and activities)</label>
              </div>
            </div>

            <!-- Plan Construction -->
            <div class="pt-2 border-t">
              <h2 class="text-base font-semibold text-gray-800 mb-4">Plan Components</h2>
              <p class="text-gray-600 mb-4">Add unit charges that compose the package. Only extra charges marked as Meal Plan Component are selectable.</p>

              <!-- Add Component Tool -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <!-- <div>
                  <Select v-model="newComponent.extraChargeId" :lb="'Extra Charge'" :options="extraChargeOptions" :placeholder="'Select extra charge'" />
                </div> -->
                <div>
                  <InputExtractChargeSelect  v-model="newComponent.extraChargeId" :lb="$t('Extra Charge')" />
                </div>
                <div>
                  <Input v-model.number="newComponent.quantityPerDay" :lb="'Quantity / Night'" input-type="number" :min="1" :placeholder="'1'" />
                </div>
                <div>
                  <Select v-model="newComponent.targetGuestType" :lb="'Guest Type'" :options="guestTypeOptions" :placeholder="'Select guest type'" />
                </div>
                <div class="flex justify-end">
                  <BasicButton type="button" variant="primary" :label="'Add Component'" @click="addComponent" />
                </div>
              </div>

              <!-- Components Table -->
              <div class="mt-6 overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 dark:bg-black">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Charge</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity / Night</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Type</th>
                      <th class="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-black divide-y divide-gray-200">
                    <tr v-for="(comp, idx) in components" :key="idx">
                      <td class="px-4 py-2">{{ comp.extraChargeName }}</td>
                      <td class="px-4 py-2">{{ comp.quantityPerDay }}</td>
                      <td class="px-4 py-2">{{ capitalize(comp.targetGuestType) }}</td>
                      <td class="px-4 py-2 text-right">
                        <BasicButton type="button" variant="outline" :label="'Remove'" @click="removeComponent(idx)" />
                      </td>
                    </tr>
                    <tr v-if="components.length === 0" class="dark:bg-black">
                      <td class="px-4 py-4 text-sm text-gray-500" colspan="4">No components added yet.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Save -->
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" :label="'Cancel'" @click="closeModal" />
              <BasicButton type="submit" variant="primary" :icon="Save" :label="isSaving ? 'Saving...' : (showEditModal ? 'Update Meal Plan' : 'Save Meal Plan')" :loading="isSaving" />
            </div>
          </form>
        </div>
      </div>
    </div>
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

const toast = useToast()

// Table state
const isLoading = ref(false)
const mealPlans = ref<any[]>([])
const selectedMealPlans = ref<any[]>([])

const columns :Column[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'shortCode', label: 'Short Code', type: 'text' },
  { key: 'status', label: 'Status', type: 'badge' },
]

const actions = [
  { name: 'edit', label: 'Edit', variant: 'primary', icon: Edit, handler: (item:any) => onAction('edit', item) },
  { name: 'delete', label: 'Delete', variant: 'danger', icon: Trash2 , handler: (item:any) => onAction('delete', item) },
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
})

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const guestTypeOptions = [
  { value: 'adult', label: 'Adult' },
  { value: 'child', label: 'Child' },
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
  components.value = []
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
    toast.error('Failed to load extra charges')
  }
}

const fetchMealPlans = async () => {
  try {
    isLoading.value = true
    const res = await getMealPlans()
    mealPlans.value = (res.data?.data?.data || res.data?.data || res.data || [])
  } catch (e) {
    console.error('Failed to load meal plans', e)
    toast.error('Failed to load meal plans')
  } finally {
    isLoading.value = false
  }
}

const saveMealPlan = async () => {
  if (!formData.name || !formData.shortCode) {
    toast.error('Name and Short Code are required')
    return
  }
  if (components.value.length === 0) {
    toast.error('Add at least one component')
    return
  }
  isSaving.value = true
  try {
    const payload = {
      name: formData.name,
      shortCode: formData.shortCode,
      status: formData.status,
      isAllInclusive: !!formData.isAllInclusive,
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
      toast.success(showEditModal.value ? 'Meal plan updated' : 'Meal plan saved')
      closeModal()
      await fetchMealPlans()
    } else {
      toast.error('Failed to save meal plan')
    }
  } catch (e) {
    console.error('Failed to save meal plan', e)
    toast.error('Failed to save meal plan')
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
  // Map API components to local components table if present
  const apiComponents = item.components || []
  components.value = apiComponents.map((c: any) => ({
    extraChargeId: Number(c.extraChargeId || c.extra_charge_id),
    extraChargeName: c.extraCharge.name || c.extra_charge_name || String(c.extraChargeId || c.extra_charge_id),
    quantityPerDay: Number(c.quantityPerDay || c.quantity_per_day || 1),
    targetGuestType: c.targetGuestType || c.target_guest_type || 'adult',
  }))

}

const deleteMealPlan = async (item: any) => {
  if (!item?.id) {
    toast.error('Invalid meal plan item')
    return
  }
  const confirmed = window.confirm(`Delete meal plan "${item.name}"? This cannot be undone.`)
  if (!confirmed) return
  try {
    await deleteMealPlanById(item.id)
    toast.success('Meal plan deleted')
    await fetchMealPlans()
  } catch (e) {
    console.error('Failed to delete meal plan', e)
    toast.error('Failed to delete meal plan')
  }
}



const onSelectionChange = (selected: any[]) => {
  selectedMealPlans.value = selected
}

const deleteSelected = async () => {
  if (selectedMealPlans.value.length === 0) return
  const confirmed = window.confirm(`Delete ${selectedMealPlans.value.length} selected meal plan(s)?`)
  if (!confirmed) return
  try {
    for (const item of selectedMealPlans.value) {
      if (item?.id) {
        await deleteMealPlanById(item.id)
      }
    }
    toast.success('Selected meal plans deleted')
    selectedMealPlans.value = []
    await fetchMealPlans()
  } catch (e) {
    console.error('Failed bulk delete', e)
    toast.error('Failed to delete selected meal plans')
  }
}

onMounted(() => {
  fetchMealPlans()
  fetchExtraCharges()
})
</script>
