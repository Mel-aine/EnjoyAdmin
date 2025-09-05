<template>
 <ChannelManagerLayout>
     <div class="channel-manager-overview">
    <!-- Main Content Grid -->
    <div class="overview-grid">
      <!-- Booking Sources Card -->
      <div class="card booking-sources-card">
        <div class="card-header">
          <h3>Booking Sources</h3>
          <div class="date-range">
            <input type="date" v-model="dateRange.start" class="date-input" />
            <span class="date-separator">-</span>
            <input type="date" v-model="dateRange.end" class="date-input" />
          </div>
        </div>
        
        <div class="booking-sources-content">
          <div class="booking-circle">
            <div class="circle-chart">
              <div class="circle-inner">
                <span class="bookings-label">Bookings</span>
                <span class="bookings-count">{{ totalBookings }}</span>
              </div>
            </div>
          </div>
          
          <div class="booking-details">
            <div class="booking-source" v-for="source in bookingSources" :key="source.name">
              <div class="source-info">
                <div class="source-icon">
                  <span class="platform-badge">{{ source.initial }}</span>
                </div>
                <span class="source-name">{{ source.name }}</span>
              </div>
              <div class="source-stats">
                <span class="booking-count">{{ source.bookings }}</span>
                <span class="revenue">{{ source.revenue }}</span>
                <span class="percentage">{{ source.percentage }}%</span>
              </div>
              <button class="details-btn" @click="viewSourceDetails(source)">Details</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Feed Events Card -->
      <div class="card live-feed-card">
        <div class="card-header">
          <h3>Live Feed Events</h3>
          <div class="filter-dropdown">
            <select v-model="selectedFilter" class="filter-select">
              <option value="all">All Events</option>
              <option value="bookings">New Bookings</option>
              <option value="cancellations">Cancellations</option>
            </select>
          </div>
        </div>
        
        <div class="live-feed-content">
          <div class="event-item" v-for="event in filteredEvents" :key="event.id">
            <div class="event-time">{{ event.timeAgo }}</div>
            <div class="event-badge" :class="event.type.toLowerCase().replace(' ', '-')">{{ event.type }}</div>
            <div class="event-details">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-subtitle" v-if="event.subtitle">{{ event.subtitle }}</div>
            </div>
            <div class="event-amount">{{ event.amount }}</div>
            <div class="platform-icon">
              <span class="platform-badge">{{ event.platform }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 </ChannelManagerLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'

const { t } = useI18n()

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

const liveEvents = ref([
  {
    id: 1,
    timeAgo: 'a day ago',
    type: 'CANCELLATION',
    title: 'Original Missed Cancellation',
    subtitle: '',
    amount: '0.00 USD',
    platform: 'B'
  },
  {
    id: 2,
    timeAgo: 'a day ago',
    type: 'NEW BOOKING',
    title: 'Fri, Jan 09, 2026',
    subtitle: 'Arvind Verma • 1 room • 1 night',
    amount: '50.00 GBP',
    platform: 'B'
  },
  {
    id: 3,
    timeAgo: 'a day ago',
    type: 'NEW BOOKING',
    title: 'Sun, Sep 07, 2025',
    subtitle: 'Pushparaj Kumaraguru • 2 rooms • 1 night',
    amount: '810.44 GBP',
    platform: 'B'
  },
  {
    id: 4,
    timeAgo: 'a day ago',
    type: 'NEW BOOKING',
    title: 'Wed, Nov 05, 2025',
    subtitle: 'Arvind Verma • 1 room • 1 night',
    amount: '50.00 GBP',
    platform: 'B'
  },
  {
    id: 5,
    timeAgo: 'a day ago',
    type: 'NEW BOOKING',
    title: 'Fri, Sep 12, 2025',
    subtitle: 'Kos3 Udnik3 • 1 room • 1 night',
    amount: '110.00 GBP',
    platform: 'B'
  },
  {
    id: 6,
    timeAgo: 'a day ago',
    type: 'NEW BOOKING',
    title: 'Thu, Sep 04, 2025',
    subtitle: 'Wend Test • 1 room • 1 night',
    amount: '629.48 GBP',
    platform: 'B'
  },
  {
    id: 7,
    timeAgo: 'a day ago',
    type: 'NEW BOOKING',
    title: 'Tue, Dec 09, 2025',
    subtitle: 'Arvind Verma • 1 room • 1 night',
    amount: '50.00 GBP',
    platform: 'B'
  },
  {
    id: 8,
    timeAgo: 'a day ago',
    type: 'NEW BOOKING',
    title: 'Fri, Feb 27, 2026',
    subtitle: 'Arvind Verma • 1 room • 1 night',
    amount: '50.00 GBP',
    platform: 'B'
  },
  {
    id: 9,
    timeAgo: 'a day ago',
    type: 'NEW BOOKING',
    title: 'Fri, Sep 12, 2025',
    subtitle: 'Kos4 Udnik4 • 1 room • 1 night',
    amount: '110.00 GBP',
    platform: 'B'
  }
])

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

onMounted(() => {
  // Initialize component
})
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