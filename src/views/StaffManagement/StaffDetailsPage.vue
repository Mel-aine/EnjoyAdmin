<template>
  <!-- Skeleton Loading State -->
  <div v-if="isLoading" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <EStaffDetailsSkeleton />
    </div>
  </div>

  <!-- Actual Content -->
  <div v-else class="min-h-screen   dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
    <div class="max-w-7xl mx-auto" v-if="user && user.id">
      <!-- Header Section -->
      <div class="mb-6 relative">

        <div class="relative bg-white dark:bg-gray-800 rounded-2xl  overflow-hidden border border-gray-200 dark:border-gray-700">
          <div class="h-48 bg-gray-50 relative">
            <div class="absolute inset-0 bg-black/10"></div>
          </div>

          <!-- Profile Info -->
          <div class="relative px-6 pb-6">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              <div class="flex flex-col md:flex-row md:items-end gap-4">
                <!-- Avatar & Initials -->
                <div class="relative">
                  <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                    <div class="w-full h-full rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center">
                      <span class="text-4xl font-bold bg-gradient-to-br capitalize from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <!-- Name & Role -->
                <div class="mb-4 md:mb-0">
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ user.firstName }} {{ user.lastName }}
                  </h1>
                  <div class="flex flex-wrap gap-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {{ user.role.roleName }}
                    </span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {{ user.department?.name || 'N/A' }}
                    </span>
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    ]">
                      {{ t(user.status ?? '') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2 mt-4 md:mt-0">
                <button @click="editUser" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-0.5">
                  {{ $t('edit') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <!-- <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6 rounded-lg">
        <nav class="flex overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 '
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
            ]"
          >
            <component :is="tab.icon" class="w-5 h-5" />
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </div> -->

      <!-- Tab Content (exemple : Details) -->
      <div class="space-y-6">
        <div v-if="activeTab === 'details'">
          <personal-info-card :user="user" @update-profile="editUser" />
        </div>
      </div>

      <OverLoading v-if="isLoading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import EStaffDetailsSkeleton from '../../components/skeletons/EStaffDetailsSkeleton.vue'
import OverLoading from '@/components/spinner/OverLoading.vue'

const PersonalInfoCard = defineAsyncComponent(() => import('../../components/profile/PersonalInfoCard.vue'))
const InfoIcon = defineAsyncComponent(() => import('@/icons/InfoIcon.vue'))

// Props
const props = defineProps<{ user: any ,isLoading?: boolean }>()

// Ref local synchronisée avec la prop
const user = ref(props.user)
watch(() => props.user, (newUser) => {
  user.value = newUser
})

// Tabs
const { t } = useI18n()
const tabs = computed(() => [
  { id: 'details', label: t('tab.details'), icon: InfoIcon },
  // { id: 'history', label: t('auditTrail'), icon: InfoIcon }, // Remplacer par ClockIcon si nécessaire
])

const activeTab = ref('details')
const isLoading = ref(false)

// Fonctions placeholder
const editUser = () => {
  console.log('Edit user clicked')
}
</script>
