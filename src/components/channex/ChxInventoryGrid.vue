<template>
  <div class="p-4 bg-white rounded-2xl shadow">
    <div class="overflow-x-auto">
      <table class="min-w-full border text-sm">
        <thead>
          <tr class="bg-gray-50">
            <th class="p-2 text-left align-top">
              <div class="flex items-center gap-2">
                <button @click="prevRange" class="p-2 hover:bg-gray-100 rounded" aria-label="Previous">
                  <span class="text-xl">←</span>
                </button>
                <InputDoubleDatePicker
                  v-model="dateRange"
                  :title="$t('selected_period')"
                  :allowPastDates="false"
                />
                <button @click="nextRange" class="p-2 hover:bg-gray-100 rounded" aria-label="Next">
                  <span class="text-xl">→</span>
                </button>
              </div>
            </th>
            <th v-for="date in visibleDates" :key="date" class="p-2 text-center font-medium border-l">
              {{ formatDate(date, true) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(days, roomId) in data" :key="roomId" class="border-t hover:bg-gray-50">
            <td class="p-2 font-medium">{{ roomId.slice(0, 8) }}...</td>
            <td v-for="date in visibleDates" :key="date" class="p-2 text-center border-l">
              <div v-if="days[date]">
                <div :class="rateColor(days[date].stop_sell)">{{ days[date].rate }}</div>
                <div class="text-xs text-gray-500">A: {{ days[date].availability }}</div>
              </div>
              <div v-else class="text-gray-300">–</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import InputDoubleDatePicker from '../forms/FormElements/InputDoubleDatePicker.vue'
import { getRestriction } from '@/services/channelManagerApi'

const rangeSize = 14
const restrictions = 'rate,availability,min_stay_arrival,min_stay_through,min_stay,closed_to_arrival,closed_to_departure,stop_sell,max_stay,availability_offset,max_availability'

const data = ref<Record<string, any>>({})
const useMock = true

type DayInfo = { rate: number; availability: number; stop_sell: boolean }
type RoomData = Record<string, DayInfo>
type GridData = Record<string, RoomData>

const format = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const today = new Date()
const initialEnd = new Date(today)
initialEnd.setDate(initialEnd.getDate() + (rangeSize - 1))

const dateRange = ref<{ start: string | null; end: string | null }>({
  start: format(today),
  end: format(initialEnd)
})

const date_from = computed(() => dateRange.value.start || '')
const date_to = computed(() => dateRange.value.end || '')

const visibleDates = computed(() => {
  const out: string[] = []
  if (!date_from.value || !date_to.value) return out
  const start = new Date(date_from.value)
  const end = new Date(date_to.value)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().split('T')[0])
  }
  return out
})

const buildMockData = (dates: string[]): GridData => {
  const rooms = [
    'Twin Room Bed & Breakfast Rate',
    'Twin Room Best Available Rate',
    'Double Room Bed & Breakfast Rate',
    'Double Room Best Available Rate'
  ]
  const out: GridData = {}
  rooms.forEach((room, idx) => {
    const roomDays: RoomData = {}
    dates.forEach((d, di) => {
      const stop = di % 7 === 5 || di % 11 === 3
      const rateBase = idx % 2 === 0 ? 2000 : 120
      const rate = rateBase
      const availability = idx < 2 ? 1 : 10
      roomDays[d] = { rate, availability, stop_sell: stop }
    })
    out[room] = roomDays
  })
  return out
}

const fetchData = async () => {
  if (!date_from.value || !date_to.value) return
  if (useMock) {
    data.value = buildMockData(visibleDates.value)
    return
  }
  try {
    const res = await getRestriction({
      date_from: date_from.value,
      date_to: date_to.value,
      restrictions
    })
    data.value = res.data?.data || buildMockData(visibleDates.value)
  } catch (e) {
    data.value = buildMockData(visibleDates.value)
  }
}

onMounted(fetchData)
watch(dateRange, fetchData, { deep: true })

const shiftRange = (days: number) => {
  const start = new Date(date_from.value)
  const end = new Date(date_to.value)
  start.setDate(start.getDate() + days)
  end.setDate(end.getDate() + days)
  dateRange.value = { start: format(start), end: format(end) }
}

const nextRange = () => shiftRange(rangeSize)
const prevRange = () => shiftRange(-rangeSize)

const formatDate = (dateStr: string, short = false) => {
  const date = new Date(dateStr)
  const options = short
    ? { day: '2-digit', month: 'short' }
    : { day: '2-digit', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

const rateColor = (stopSell: boolean) => (stopSell ? 'text-red-500 font-bold' : 'text-green-600')
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
