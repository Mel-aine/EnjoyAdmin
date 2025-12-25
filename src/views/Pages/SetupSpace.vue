<template>
  <div class="min-h-full bg-white flex items-center justify-center">
    <div class="text-center px-6 py-10">
      <div class="flex items-center justify-center mb-6">
        <img src="@/assets/images/header/logo2.png" alt="Enjoy PM" class="h-10 w-auto" />
      </div>
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">{{ $t('settingSpeace') }}</h1>
      <p class="text-gray-600 mb-6">{{ $t('settingSpeaceMessage') }}</p>
      <div class="flex items-center justify-center gap-3">
        <Spinner />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/spinner/Spinner.vue'
import { ref } from 'vue'
import { useAuthStore } from '../../composables/user'
import { useServiceStore } from '../../composables/serviceStore'
import { useStatusColor } from '../../composables/statusColorStore'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/lang/language'
import { initSpace } from '../../services/api'
import router from '../../router'


const { locale } = useI18n()
const languageStore = useLanguageStore()
const isLoading = ref(false);
const authStore = useAuthStore()
const serviceStore = useServiceStore()
const statusColor = useStatusColor()


const initializeSpace = async () => {
  isLoading.value = true;
  try {

    const res = await initSpace({
      userId: authStore.UserId!
    });
    const { user } = res.data.data;
    // Stocker les services et permissions
    serviceStore.setService(res.data.data.userServices);
    serviceStore.setPermissions(res.data.data.permissions);
    serviceStore.setBookingSources(res.data.data.bookingSources)
    serviceStore.setBusinessSources(res.data.data.businessSources)
    serviceStore.setReservationType(res.data.data.reservationTypes)
    statusColor.setStatusColors(res.data.data.userServices[0]?.statusColors || []);
    if (user.permisReports) {
      try {
        const reportsPermissions = JSON.parse(user.permisReports);

        authStore.setReportsPermissions(reportsPermissions);

      } catch (parseError) {
        console.error('Erreur lors du parsing des permissions de rapports:', parseError);
        // Définir des permissions vides en cas d'erreur
        authStore.setReportsPermissions([]);
      }
    } else {
      console.warn('Aucune permission de rapport trouvée pour cet utilisateur');
      authStore.setReportsPermissions([]);
    }
    authStore.setRoleId(user.roleId);
    authStore.setUserId(user.id);

    if (user) {
      if (user.language) {
        locale.value = user.language;
        languageStore.set(user.language);
      }
      const userServices = res.data.data.userServices || [];

      const service = userServices[0];
      serviceStore.setServiceId(service.id);
      serviceStore.setCurrentService(service);
      if (authStore.hasPermission('access_to_dashboard_view')) {
        router.push({ path: '/front-office/dashboard' });
      }else if (authStore.hasPermission('access_to_stay_view')) {
        router.push({ path: '/stay_view' });
      }
    }
  } catch (err: any) {
    console.error("Erreur handleSubmit:", err);
  } finally {
    isLoading.value = false;
  }
}

initializeSpace();


</script>

<style scoped></style>
