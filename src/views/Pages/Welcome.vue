<template>
  <div v-if="!isRedirecting" class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
      <h1 class="text-2xl font-bold mb-4">{{ t('welcome_title') }}</h1>

      <p class="text-gray-600" v-if="noAccess">
        {{ t('welcome_no_access_line1') }}<br />
        {{ t('welcome_no_access_line2') }}
      </p>

      <div v-else-if="isLoading" class="text-gray-600">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        {{ t('welcome_redirecting') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/composables/serviceStore'
import { getHotelMenu } from '@/menus/hotel'
import { extractRoutesFromMenu } from '@/utils/menuUtil'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const serviceStore = useServiceStore()
const noAccess = ref(false)
const isRedirecting = ref(true)
const isLoading = ref(true)

const { t } = useI18n()

// Fonction pour trouver la première route accessible
const findFirstAccessibleRoute = () => {
  const menuItems = getHotelMenu(t)[0].items
  const routeList = extractRoutesFromMenu(menuItems)

  // Ordre de priorité pour la redirection
  const priorityRoutes = [
    'dashboard_view',
    'bookings_view', 
    'rooms_view',
    'calendar_view',
    'customers_view'
  ]

  // Chercher d'abord dans les routes prioritaires
  for (const permission of priorityRoutes) {
    const route = routeList.find(r => r.permission === permission)
    if (route && serviceStore.hasPermission(permission)) {
      return route
    }
  }

  // Si aucune route prioritaire n'est accessible, prendre la première disponible
  return routeList.find((route) => 
    !route.permission || serviceStore.hasPermission(route.permission)
  )
}

onMounted(async () => {
  try {
    // Attendre que les permissions soient chargées
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('🔍 Permissions disponibles:', serviceStore.permissions.map(p => p.name))
    
    if (!serviceStore.permissions.length) {
      console.log('❌ Aucune permission trouvée')
      noAccess.value = true
      isRedirecting.value = false
      isLoading.value = false
      return
    }

    const accessibleRoute = findFirstAccessibleRoute()

    if (accessibleRoute) {
      console.log('✅ Redirection vers:', accessibleRoute.path)
      await router.replace(accessibleRoute.path)
    } else {
      console.log('❌ Aucune route accessible trouvée')
      noAccess.value = true
      isRedirecting.value = false
    }
  } catch (error) {
    console.error('Erreur lors de la redirection:', error)
    noAccess.value = true
    isRedirecting.value = false
  } finally {
    isLoading.value = false
  }
})
</script>