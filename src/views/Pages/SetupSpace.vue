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
import { syncManager } from '../../services/offline'
import { useOfflineStore } from '@/services/offline/offlineStore'
const offlineStore = useOfflineStore()

const { locale } = useI18n({ useScope: 'global' })
const languageStore = useLanguageStore()
const isLoading = ref(false);
const authStore = useAuthStore()
const serviceStore = useServiceStore()
const statusColor = useStatusColor()

// ── Fonction réutilisable pour initialiser le mode offline ────────
// Déclenchée quand l'utilisateur est authentifié ET qu'un hôtel est sélectionné
async function initOfflineMode(hotelId: number): Promise<void> {
  try {
    syncManager.init(hotelId)
    const enabled = await syncManager.checkOfflineModeStatus()
    if (!enabled) return

    const hasData = await syncManager.hasCachedData()
    if (!hasData) {
      console.log('[Offline] Cache vide — chargement initial...')
      syncManager.initialLoad().then(() => {
        syncManager.startPeriodicSync()
        offlineStore.refreshPendingCount()
      }).catch(e => {
        console.debug('[Sync] Init échoué (sera réessayé à la reconnexion):', e)
      })
    } else {
      console.log('[Offline] Cache déjà peuplé, synchronisation...')
      await syncManager.sync()
      syncManager.startPeriodicSync()
      offlineStore.refreshPendingCount()
    }
  } catch (e) {
    console.debug('[Sync] Init failed:', e)
  }
}
const initializeSpace = async () => {
  isLoading.value = true;
  try {

    const res = await initSpace({
      userId: authStore.UserId!
    });
    const { user } = res.data.data;
    // Stocker les services et permissions
    console.log("res",res.data.data)
    serviceStore.setService(res.data.data.userServices);
    serviceStore.setPermissions(res.data.data.permissions);
    serviceStore.setBookingSources(res.data.data.bookingSources)
    serviceStore.setBusinessSources(res.data.data.businessSources)
    serviceStore.setReservationType(res.data.data.reservationTypes)
    statusColor.setStatusColors(res.data.data.userServices[0]?.statusColors || []);
     serviceStore.setWhatsappEnabled(res.data.data.userServices[0]?.whatsappEnabled ?? false)
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
        const baseLanguage = String(user.language).split('_')[0]
        const normalizedLanguage = baseLanguage === 'fr' ? 'fr' : 'en'
        locale.value = normalizedLanguage;
        languageStore.set(normalizedLanguage);
      }
      const userServices = res.data.data.userServices || [];

      const service = userServices[0];
      serviceStore.setServiceId(service.id);
      serviceStore.setCurrentService(service);
      const propertyTypeRaw = String(service?.propertyType ?? service?.property_type ?? '').trim()
      const propertyType = propertyTypeRaw.toLowerCase()
      const apartmentMarkers = [
        'apartment',
        'apart_hotel',
        'aparthotel',
        'serviced apartment',
        'residence',
        'résidence',
        'furnished',
        'meuble',
        'meublé',
        'extended stay',
        'extended-stay',
        'rental',
        'lease',
        'corporate housing',
      ]
      const domain = propertyType
        ? (apartmentMarkers.some(marker => propertyType.includes(marker)) ? 'apartment' : 'hotel')
        : languageStore.domain
      languageStore.setDomain(domain)
      const baseLocale = languageStore.language === 'fr' ? 'fr' : 'en'
      languageStore.set(baseLocale)
      locale.value = domain === 'apartment' ? `${baseLocale}_apartment` : baseLocale
      serviceStore.setCalendarViewDate(service.currentWorkingDate)
      serviceStore.setCalendarDaysToShow(15)
      serviceStore.setRateTypes(res.data.data.rateTypes || []);

      if (authStore.hasPermission('access_to_stay_view')) {
        router.push({ path: '/stay_view' });
      } else
        if (authStore.hasPermission('access_to_dashboard_view')) {
          router.push({ path: '/front-office/dashboard' });
        }
    }
  } catch (err) {
    console.error("Erreur handleSubmit:", err);
  } finally {
    isLoading.value = false;
  }
}

initializeSpace();
const hotelId = serviceStore?.serviceId
      if (hotelId) {
        initOfflineMode(hotelId)
      }

</script>

<style scoped></style>
