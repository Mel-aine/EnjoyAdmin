<template>
 <ChannelManagerLayout>
     <div class="channel-manager-overview">
      <div class="overview-header">
        <div class="flex justify-end" v-if="!currentService.channexPropertyId">
          <BasicButton 
          :label="isLoading ? t('configuration.channelManager.common.migrating') : t('configuration.channelManager.migrateHotelData')"
          :loading="isLoading"
          variant="secondary"
          @click="handleMigrate"
        />
        </div>
        
      </div>
 
   </div>
  </ChannelManagerLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { useToast } from 'vue-toastification'
import { migrateCompleteHotel, getBookings } from '@/services/channelManagerApi'
import { useServiceStore } from '../../../composables/serviceStore'

 const { t } = useI18n()
const toast = useToast()
const isLoading = ref(false)
const eventsLoading = ref(false)
const currentService = useServiceStore().getCurrentService;
const handleMigrate = async () => {
  try {
    isLoading.value = true
    const res = await migrateCompleteHotel()
    const message = res?.data?.message || t('configuration.channelManager.common.success')
    toast.success(message)
  } catch (error: any) {
    const message = error?.response?.data?.message || t('configuration.channelManager.migrationError')
    toast.error(message)
    console.error('migrateCompleteHotel error:', error)
  } finally {
    isLoading.value = false
  }
}

 // Reactive data
 const dateRange = ref({
   start: '2025-08-04',
   end: '2025-09-04'
 })

 const selectedFilter = ref('all')

 const totalBookings = ref(16)

 const bookingSources = ref([
   {
     name: 'Booking.com',
     initial: 'B',
     bookings: 16,
     revenue: '4 306 GBP',
     percentage: 100
   }
 ])

 const liveEvents = ref<any[]>([])

 // Helpers
 const computeTimeAgo = (iso?: string) => {
   if (!iso) return ''
   const then = new Date(iso).getTime()
   const now = Date.now()
   const diffMs = Math.max(0, now - then)
   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
   if (diffDays <= 0) return 'today'
   if (diffDays === 1) return 'a day ago'
   return `${diffDays} days ago`
 }

 /*const loadLiveEvents = async () => {
   try {
     eventsLoading.value = true
     const propertyId = (currentService as any)?.channexPropertyId || useServiceStore().serviceId
     const params = {
       date_from: dateRange.value.start,
       date_to: dateRange.value.end,
     }
     const res = await getBookings(propertyId, params as any)
     console.log('getBookings res:', res)
     const rawData = res?.data?.data as any
     const items = Array.isArray(rawData?.data) ? rawData.data : Array.isArray(rawData) ? rawData : []

     liveEvents.value = items.map((item: any, idx: number) => {
       const a = item?.attributes ?? item
       const status = String(a?.status || '').toLowerCase()
       const type = status === 'cancelled' ? 'CANCELLATION' : 'NEW BOOKING'
       const titleDate = a?.arrival_date || a?.rooms?.[0]?.checkin_date || a?.inserted_at
       const title = titleDate ? formatDatePretty(titleDate) : ''
       const firstName = a?.customer?.name || ''
       const lastName = a?.customer?.surname || ''
       const customerName = `${firstName} ${lastName}`.trim()
       const roomsCount = Array.isArray(a?.rooms) ? a.rooms.length : 1
       const nights = computeNights(
         a?.rooms?.[0]?.checkin_date || a?.arrival_date,
         a?.rooms?.[0]?.checkout_date || a?.departure_date
       )
       const subtitle = customerName
         ? `${customerName} • ${roomsCount} room${roomsCount > 1 ? 's' : ''}${nights ? ` • ${nights} night${nights > 1 ? 's' : ''}` : ''}`
         : ''
       const amountStr = a?.amount && a?.currency ? `${a.amount} ${a.currency}` : ''
       const platformInitial = (a?.ota_name?.[0] || a?.channel?.[0] || 'B').toUpperCase()
       return {
         id: a?.id || item?.id || idx,
         timeAgo: computeTimeAgo(a?.inserted_at),
         type,
         title,
         subtitle,
         amount: amountStr,
         platform: platformInitial,
       }
     })
   } catch (error) {
     console.error('getBookings error:', error)
     toast.error(t('configuration.channelManager.common.error') || 'Failed to load bookings')
   } finally {
     eventsLoading.value = false
   }
 }
*/
  const computeNights = (checkin?: string, checkout?: string) => {
    if (!checkin || !checkout) return undefined
    const start = new Date(checkin)
    const end = new Date(checkout)
    const ms = end.getTime() - start.getTime()
    const nights = Math.round(ms / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : undefined
  }

  const formatDatePretty = (dateStr: string) => {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const wd = weekdays[d.getDay()]
    const m = months[d.getMonth()]
    const day = String(d.getDate()).padStart(2, '0')
    const year = d.getFullYear()
    return `${wd}, ${m} ${day}, ${year}`
  }

 // Computed properties
 const filteredEvents = computed(() => {
   if (selectedFilter.value === 'all') {
     return liveEvents.value
   }
   return liveEvents.value.filter(event => {
     if (selectedFilter.value === 'bookings') {
       return event.type === 'NEW BOOKING'
     }
     if (selectedFilter.value === 'cancellations') {
       return event.type === 'CANCELLATION'
     }
     return true
   })
 })

 // Methods
 const viewSourceDetails = (source: any) => {
   console.log('Viewing details for:', source.name)
 }

</script>

<style scoped>
.channel-manager-overview {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.overview-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.date-separator {
  color: #6b7280;
}

.booking-sources-content {
  display: flex;
  gap: 32px;
  align-items: center;
}

.booking-circle {
  flex-shrink: 0;
}

.circle-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#3b82f6 0deg 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.circle-inner {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bookings-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.bookings-count {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.booking-details {
  flex: 1;
}

.booking-source {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.booking-source:last-child {
  border-bottom: none;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.source-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-badge {
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.source-name {
  font-weight: 500;
  color: #1e293b;
}

.source-stats {
  display: flex;
  gap: 16px;
  align-items: center;
}

.booking-count {
  font-weight: 600;
  color: #1e293b;
}

.revenue {
  color: #6b7280;
}

.percentage {
  color: #6b7280;
}

.details-btn {
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s;
}

.details-btn:hover {
  background: #f1f5f9;
}

.live-feed-card {
  max-height: 600px;
  overflow: hidden;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.live-feed-content {
  max-height: 500px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.event-item:last-child {
  border-bottom: none;
}

.event-time {
  font-size: 12px;
  color: #6b7280;
  width: 60px;
  flex-shrink: 0;
}

.event-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100px;
  text-align: center;
  flex-shrink: 0;
}

.event-badge.cancellation {
  background: #fef2f2;
  color: #dc2626;
}

.event-badge.new-booking {
  background: #f0f9ff;
  color: #0284c7;
}

.event-details {
  flex: 1;
}

.event-title {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.event-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.event-amount {
  font-weight: 600;
  color: #1e293b;
  width: 80px;
  text-align: right;
  flex-shrink: 0;
}

.announcements-section {
  margin-top: 32px;
}

.announcements-card {
  max-width: none;
}

.announcements-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.announcement-item {
  margin-bottom: 24px;
}

.announcement-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.announcement-item p {
  margin: 8px 0;
  color: #4b5563;
}

.announcement-link {
  color: #3b82f6;
  text-decoration: none;
}

.announcement-link:hover {
  text-decoration: underline;
}

.feature-summary {
  margin: 16px 0;
}

.feature-summary h5 {
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.feature-summary ul {
  margin: 0;
  padding-left: 20px;
}

.feature-summary li {
  margin: 4px 0;
  color: #4b5563;
}

.help-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
}

.help-link:hover {
  text-decoration: underline;
}

.bugfixes-section {
  margin: 16px 0;
}

.bugfixes-section h4 {
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.bugfixes-section ul {
  margin: 0;
  padding-left: 20px;
}

.bugfixes-section li {
  margin: 4px 0;
  color: #4b5563;
}

.coming-soon {
  margin: 16px 0;
}

.coming-soon h4 {
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.roadmap-link {
  color: #3b82f6;
  text-decoration: none;
}

.roadmap-link:hover {
  text-decoration: underline;
}

.changelog-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.changelog-link:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-sources-content {
    flex-direction: column;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .channel-manager-overview {
    padding: 16px;
  }
  
  .card {
    padding: 16px;
  }
  
  .booking-source {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .source-stats {
    gap: 8px;
  }
  
  .event-item {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>