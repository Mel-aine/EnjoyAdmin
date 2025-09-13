<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('vip_status.title') }}</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          {{ $t('vip_status.subtitle') }}
        </p>
        <ReusableTable :title="$t('vip_status.title')" :columns="columns" :data="vipStatuses"
          :actions="actions" :loading="loading" @action="onAction"
          :selectable="true"
          :search-placeholder="$t('vip_status.search')"
          :empty-title="$t('vip_status.noResults')"
          :empty-description="$t('vip_status.noResultsMessage')">
          <template v-slot:header-actions>
            <BasicButton variant="primary" @click="openAddModal" :icon="Plus"
              :label="$t('vip_status.add')" :loading="loading" />
          </template>
          
          <!-- Custom column for color display -->
          <template #column-color="{ item }">
            <div class="flex items-center gap-2">
              <div 
                class="w-5 h-5 rounded border border-gray-300" 
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="text-sm text-gray-700">{{ item.color }}</span>
            </div>
          </template>

          <!-- Custom column for icon display -->
          <template #column-icon="{ item }">
            <div class="flex items-center gap-2">
              <component v-if="item.icon" :is="getIconComponent(item.icon)" :style="{ color: item.color }" class="w-5 h-5" />
              <span class="text-sm text-gray-700">{{ item.icon }}</span>
            </div>
          </template>

          <!-- Custom column for created info -->
          <template #column-createdInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName }}</div>
              <div class="text-xs text-gray-400">{{ item.createdAt }}</div>
            </div>
          </template>

          <!-- Custom column for modified info -->
          <template #column-modifiedInfo="{ item }">
            <div>
              <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName }}</div>
              <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
            </div>
          </template>
        </ReusableTable>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? $t('vip_status.edit') : $t('vip_status.add') }}
          </h3>

          <form @submit.prevent="saveVipStatus">
            <div class="mb-4">
              <Input v-model="formData.name" :lb="$t('vip_status.name')" inputType="text"
                :isRequired="true" :placeholder="$t('vip_status.namePlaceholder')" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('vip_status.color') }} *
              </label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  v-model="formData.color" 
                  class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <Input v-model="formData.color" inputType="text" :placeholder="$t('vip_status.colorPlaceholder')" class="flex-1" />
              </div>
            </div>

            <div class="mb-4">
              <VipIconPicker 
                v-model="formData.icon" 
                :label="$t('vip_status.icon')" 
                :required="true"
                :icon-color="formData.color"
              />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('vip_status.cancel')"
                :disabled="saving" />
              <BasicButton type="submit" variant="primary" :icon="Save"
                :label="isEditing ? $t('vip_status.update') : $t('vip_status.save')"
                :loading="saving" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { 
  Plus, Save, Edit, Trash2, Crown, Star, Award, Trophy, Medal, Gem, Diamond, Heart, Shield, Zap, Sparkles, Gift, Target, Flame, Sun, Moon, Rocket, Wand2, Key, Lock, Unlock, BadgeCheck, CheckCircle, Minus, X, Settings, User, Users, UserCheck, UserPlus, UserX, Eye, EyeOff, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, BarChart, PieChart, Activity, Briefcase, Building, Home, MapPin, Globe, Compass, Navigation, Anchor, Feather, Leaf, Flower, TreePine, Mountain, Waves, Cloud, Snowflake, Umbrella, Coffee, Wine, Utensils, Car, Plane, Ship, Train, Bike, Camera, Music, Headphones, Gamepad2, Palette, Brush, Scissors, Wrench, Hammer, Lightbulb, Battery, Wifi, Smartphone, Laptop, Monitor, Printer, HardDrive, Database, Server, Download, Upload, Share, Link, Bookmark, Tag, Flag, Bell, Volume2, VolumeX, Play, Pause, Square, SkipForward, SkipBack, Repeat, Shuffle, Calendar, Clock, Timer, AlarmClock, Hourglass, Sunrise, Sunset, CloudRain, CloudSnow, Thermometer, Droplets, Wind, Tornado, Rainbow, Cloudy
} from 'lucide-vue-next'
import { vipStatusApi } from '@/services/configrationApi'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import VipIconPicker from '../../../components/utilities/VipIconPicker.vue'
import { useServiceStore } from '../../../composables/serviceStore'

const toast = useToast()
const { t } = useI18n()

// Reactive data
const vipStatuses = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const saving = ref(false)

// Form data
const formData = reactive({
  id: null,
  name: '',
  color: '#3B82F6',
  icon: ''
})

// Icon components mapping
const iconComponents = {
  Crown, Star, Award, Trophy, Medal, Gem, Diamond, Heart, Shield, Zap, Sparkles, Gift, Target, Flame, Sun, Moon, Rocket, Wand2, Key, Lock, Unlock, BadgeCheck, CheckCircle, Plus, Minus, X, Settings, User, Users, UserCheck, UserPlus, UserX, Eye, EyeOff, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, BarChart, PieChart, Activity, Briefcase, Building, Home, MapPin, Globe, Compass, Navigation, Anchor, Feather, Leaf, Flower, TreePine, Mountain, Waves, Cloud, Snowflake, Umbrella, Coffee, Wine, Utensils, Car, Plane, Ship, Train, Bike, Camera, Music, Headphones, Gamepad2, Palette, Brush, Scissors, Wrench, Hammer, Lightbulb, Battery, Wifi, Smartphone, Laptop, Monitor, Printer, HardDrive, Database, Server, Download, Upload, Share, Link, Bookmark, Tag, Flag, Bell, Volume2, VolumeX, Play, Pause, Square, SkipForward, SkipBack, Repeat, Shuffle, Calendar, Clock, Timer, AlarmClock, Hourglass, Sunrise, Sunset, CloudRain, CloudSnow, Thermometer, Droplets, Wind, Tornado, Rainbow, Cloudy
}

// Get icon component by name
function getIconComponent(iconName) {
  return iconComponents[iconName] || Crown
}

// Table columns configuration
const columns = computed(() => [
  {
    key: 'name',
    label: t('vip_status.name'),
    sortable: true
  },
  {
    key: 'color',
    label: t('vip_status.color'),
    sortable: false,
    type:'custom'
  },
  {
    key: 'icon',
    label: t('vip_status.icon'),
    sortable: false,
    type:'custom'
  },
  {
    key: 'createdInfo',
    label: 'Created',
    sortable: true,
    type:'custom'
  },
  {
    key: 'modifiedInfo',
    label: 'Modified',
    sortable: true,
    type:'custom'
  }
])

// Table actions configuration
const actions = computed(() => [
  {
    key: 'edit',
    label: t('vip_status.edit'),
    icon: Edit,
    variant: 'outline'
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    variant: 'danger'
  }
])

// Methods
const fetchVipStatuses = async () => {
  try {
    loading.value = true
    const response = await vipStatusApi.getVipStatuses(useServiceStore().serviceId);
    console.log("respinse",response)
    vipStatuses.value = response.data?.data || []
  } catch (error) {
    toast.error(t('vip_status.loadError'))
    console.error(error)
  } finally {
    loading.value = false
  }
}

const saveVipStatus = async () => {
  try {
    saving.value = true
    
    if (isEditing.value) {
      await vipStatusApi.updateVipStatus(formData.id, formData)
      toast.success(t('vip_status.saveSuccess'))
    } else {
      await vipStatusApi.createVipStatus({...formData,hotelId:useServiceStore().serviceId})
      toast.success(t('vip_status.saveSuccess'))
    }
    
    closeModal()
    await fetchVipStatuses()
  } catch (error) {
    toast.error(error.message || t('vip_status.saveError'))
    console.error(error)
  } finally {
    saving.value = false
  }
}

const onAction = async (action, item) => {
  if (action === 'edit') {
    editVipStatus(item)
  } else if (action === 'delete') {
    await deleteVipStatus(item.id)
  }
}

const editVipStatus = (item) => {
  isEditing.value = true
  Object.assign(formData, item)
  showModal.value = true
}

const deleteVipStatus = async (id) => {
  try {
    if (confirm(t('vip_status.confirmDelete'))) {
      await vipStatusApi.deleteVipStatus(id)
      toast.success(t('vip_status.deleteSuccess'))
      await fetchVipStatuses()
    }
  } catch (error) {
    toast.error(t('vip_status.deleteError'))
    console.error(error)
  }
}

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    name: '',
    color: '#3B82F6',
    icon: ''
  })
  isEditing.value = false
}

const openAddModal = () => {
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

// Lifecycle
onMounted(() => {
  fetchVipStatuses()
})
</script>

<style scoped>
/* Custom styles for VIP Status component */
</style>