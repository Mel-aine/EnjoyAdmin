<template>
  <div class="vip-status-management">
    <!-- Add/Edit Form -->
    <el-dialog :title="isEditing ? 'Edit VIP Status' : 'Add VIP Status'" v-model="dialogVisible">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter VIP status name" />
        </el-form-item>
        
        <el-form-item label="Color" prop="color">
          <div class="color-input-group">
            <el-color-picker v-model="form.color" />
            <el-input 
              v-model="form.color" 
              placeholder="#RRGGBB" 
              style="margin-left: 10px; width: 120px;"
            />
          </div>
        </el-form-item>
        
        <el-form-item label="Icon" prop="icon">
          <el-input v-model="form.icon" placeholder="Enter icon name or class" />
          <div class="icon-preview" v-if="form.icon">
            <i :class="form.icon" :style="{ color: form.color }"></i>
            Preview
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEditing ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Data Table -->
    <el-table :data="vipStatuses" v-loading="tableLoading">
      <el-table-column prop="name" label="Name" />
      
      <el-table-column label="Color" width="100">
        <template #default="{ row }">
          <div class="color-display">
            <div 
              class="color-box" 
              :style="{ backgroundColor: row.color }"
            ></div>
            <span>{{ row.color }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="Icon" width="100">
        <template #default="{ row }">
          <div class="icon-display">
            <i :class="row.icon" :style="{ color: row.color }"></i>
            <span>{{ row.icon }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="editVipStatus(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="deleteVipStatus(row.id)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { vipStatusApi } from '@/services/configurationApi'

// Reactive data
const dialogVisible = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const tableLoading = ref(false)
const vipStatuses = ref([])
const formRef = ref()

// Form data
const form = reactive({
  name: '',
  color: '#000000',
  icon: '',
  hotelId: 1 // Get from store/props
})

// Validation rules
const rules = {
  name: [
    { required: true, message: 'Name is required', trigger: 'blur' },
    { min: 1, max: 100, message: 'Name must be 1-100 characters', trigger: 'blur' }
  ],
  color: [
    { required: true, message: 'Color is required', trigger: 'blur' },
    { pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, message: 'Invalid hex color format', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: 'Icon is required', trigger: 'blur' },
    { min: 1, max: 100, message: 'Icon must be 1-100 characters', trigger: 'blur' }
  ]
}

// Methods
const fetchVipStatuses = async () => {
  try {
    tableLoading.value = true
    const response = await vipStatusApi.getVipStatuses(form.hotelId)
    vipStatuses.value = response.data.data || []
  } catch (error) {
    ElMessage.error('Failed to fetch VIP statuses')
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    if (isEditing.value) {
      await vipStatusApi.updateVipStatus(form.id, form)
      ElMessage.success('VIP status updated successfully')
    } else {
      await vipStatusApi.createVipStatus(form)
      ElMessage.success('VIP status created successfully')
    }
    
    dialogVisible.value = false
    resetForm()
    await fetchVipStatuses()
  } catch (error) {
    ElMessage.error(error.message || 'Operation failed')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const editVipStatus = (row) => {
  isEditing.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const deleteVipStatus = async (id) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this VIP status?', 'Confirm Delete')
    await vipStatusApi.deleteVipStatus(id, form.hotelId)
    ElMessage.success('VIP status deleted successfully')
    await fetchVipStatuses()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete VIP status')
      console.error(error)
    }
  }
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    color: '#000000',
    icon: '',
    hotelId: form.hotelId
  })
  isEditing.value = false
}

const openCreateDialog = () => {
  resetForm()
  dialogVisible.value = true
}

// Lifecycle
onMounted(() => {
  fetchVipStatuses()
})
</script>

<style scoped>
.color-input-group {
  display: flex;
  align-items: center;
}

.color-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.icon-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-preview {
  margin-top: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>