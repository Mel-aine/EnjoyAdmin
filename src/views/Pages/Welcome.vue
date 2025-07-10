<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
      <h1 class="text-2xl font-bold mb-4">{{ t('welcome_title') }}</h1>

      <p class="text-gray-600" v-if="noAccess">
        {{ t('welcome_no_access_line1') }}<br />
        {{ t('welcome_no_access_line2') }}
      </p>

      <!-- <p class="text-gray-600" v-else>
        {{ t('welcome_redirecting') }}
      </p> -->
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


const { t } = useI18n()

onMounted(() => {
  const menuItems = getHotelMenu(t)[0].items
  const routeList = extractRoutesFromMenu(menuItems)


  const accessibleRoute = routeList.find((route) =>
    serviceStore.hasPermission(route.permission)
  )

  if (accessibleRoute) {
    router.replace(accessibleRoute.path)
  } else {
    noAccess.value = true
  }
})
</script>
