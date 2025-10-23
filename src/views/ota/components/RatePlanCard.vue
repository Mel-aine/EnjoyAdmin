<template>
  <div class="rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition">
    <!-- Top content -->
    <div class="grid grid-cols-[160px_1fr_auto] gap-4 items-start">
      <img :src="imageUrl" alt="Room" class="w-40 h-28 object-cover rounded-md border" />
      <div>
        <div class="flex items-center gap-2">
          <div class="font-medium text-sm">{{ plan.name }}</div>
          <span
            v-if="plan.promo"
            class="text-[10px] rounded border border-red-500 text-red-600 px-2 py-0.5"
            >PROMO OFFER</span
          >
        </div>
        <div class="mt-1 text-xs text-gray-600 flex items-center gap-4">
          <span class="flex items-center gap-1"
            ><Adult class="inline w-3 h-3" /> {{ capacityAdults }}</span
          >
          <span class="flex items-center gap-1"
            ><Child class="inline w-3 h-3" /> {{ capacityChildren }}</span
          >
          <span v-if="policiesList.length" class="text-gray-500">{{
            policiesList.join(', ')
          }}</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="(f, idx) in featuresList"
            :key="idx"
            class="text-[10px] bg-gray-100 text-gray-700 rounded px-2 py-0.5"
            >{{ f }}</span
          >
        </div>
      </div>
      <div class="text-right">
        <div class="text-[11px] text-gray-500">Price for 1 Night</div>
        <div class="text-2xl font-bold">{{ formatCurrency(plan.price) }}</div>
        <div class="text-[11px] text-gray-500">Per Room Per Night</div>
        <div class="mt-1 text-[11px] text-gray-600">
          Rooms Left:
          <span class="ml-1 rounded-full bg-gray-200 px-2 py-0.5">{{ room.roomsLeft }}</span>
        </div>
      </div>
    </div>

    <!-- Toolbar: info, enquire, quantity -->
    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center gap-3 text-sm">
        <button type="button" class="text-blue-700 hover:underline" @click="showInfo = true">
          Room Info
        </button>
        <button type="button" class="text-blue-700 hover:underline" @click="enquireLocal">
          Enquire
        </button>
      </div>
      <div v-if="selectedCount == 0" class="flex items-center gap-4">
        <button
          class="bg-primary text-white rounded px-3 py-1 text-sm"
          :disabled="selectedCount >= room.roomsLeft || !canAdd"
          @click="increment"
        >
          Add Room
        </button>
      </div>
      <div v-else class="flex items-center gap-2">
        <div class="text-xs text-gray-600 mr-2">{{ room.roomsLeft }} Rooms Left</div>
        <button
          class="border rounded px-2 py-1 text-sm"
          :disabled="selectedCount <= 0"
          @click="decrement"
        >
          -
        </button>
        <div class="w-8 text-center">{{ selectedCount }}</div>
        <button
          class="border rounded px-2 py-1 text-sm"
          :disabled="selectedCount >= room.roomsLeft || !canAdd"
          @click="increment"
        >
          +
        </button>
      </div>
    </div>

    <!-- Occupants shown only when room added -->
    <div v-if="selectedCount > 0" class="mt-3 grid grid-cols-[1fr_auto] gap-2 items-center">
      <div class="flex gap-3 items-center">
        <span class="text-xs text-gray-600">Room {{ selectedCount }}</span>
        <label class="text-xs text-gray-600">Adult</label>
        <select v-model.number="qtyAdults" class="border rounded px-2 py-1 text-xs w-16">
          <option v-for="n in capacityAdults" :key="`a-${n}`" :value="n">{{ n }}</option>
        </select>
        <label class="text-xs text-gray-600">Child</label>
        <select v-model.number="qtyChildren" class="border rounded px-2 py-1 text-xs w-16">
          <option v-for="n in capacityChildren + 1" :key="`c-${n}`" :value="n - 1">
            {{ n - 1 }}
          </option>
        </select>
        <label class="text-xs text-gray-600">Add To Compare</label>
        <input type="checkbox" class="ml-1" v-model="compare" />
      </div>
    </div>

    <!-- Validation messages -->
    <div v-if="!canAdd" class="text-[11px] text-red-600 mt-2" role="alert">
      <span v-if="roomsLeftZero">No rooms left</span>
      <span v-else-if="needsMoreNights"
        >You need {{ minNightsRemaining }} more nights to book this room.</span
      >
    </div>

    <!-- Room Info Modal -->
    <div v-if="showInfo" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div class="p-4 border-b flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold">{{ room.name }}</div>
            <div class="text-xs text-gray-600">{{ plan.name }}</div>
          </div>
          <button class="text-gray-600 hover:text-black" @click="showInfo = false">✕</button>
        </div>
        <div class="p-4 space-y-3 text-sm text-gray-700">
          <div class="font-medium">Capacity</div>
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1"
              ><Adult class="inline w-4 h-4" /> {{ capacityAdults }} Adults</span
            >
            <span class="flex items-center gap-1"
              ><Child class="inline w-4 h-4" /> {{ capacityChildren }} Children</span
            >
          </div>
          <div v-if="featuresList.length">
            <div class="font-medium mt-2">Features</div>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(f, idx) in featuresList" :key="idx">{{ f }}</li>
            </ul>
          </div>
          <div v-if="policiesList.length">
            <div class="font-medium mt-2">Policies</div>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(p, idx) in policiesList" :key="idx">{{ p }}</li>
            </ul>
          </div>
        </div>
        <div class="p-4 border-t flex items-center justify-end gap-2">
          <button class="border rounded px-3 py-1 text-sm" @click="showInfo = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Adult from '@/icons/Adult.vue'
import Child from '@/icons/Child.vue'

interface RatePlan {
  id: string
  name: string
  price: number
  features: string[]
  policies: string[]
  promo?: boolean
  minNights?: number
}

interface RoomInfo {
  id: number
  name: string
  roomsLeft: number
  capacity?: { adults: number; children: number }
}




const props = defineProps<{ room: RoomInfo; plan: RatePlan; nights: number; currency?: string,selectedCount?: number  }>()

const emit = defineEmits<{
  (e: 'add', payload: { room: RoomInfo; plan: RatePlan; adults: number; children: number }): void
  (e: 'remove', payload: { room: RoomInfo; plan: RatePlan }): void
  (e: 'update', payload: { room: RoomInfo; plan: RatePlan; adults: number; children: number }): void
}>()

const router = useRouter()

const capacityAdults = computed(() => props.room?.capacity?.adults ?? 2)
const capacityChildren = computed(() => props.room?.capacity?.children ?? 0)

// Initialiser avec les valeurs max de capacité
const qtyAdults = ref(capacityAdults.value)
const qtyChildren = ref(0)
const compare = ref(false)
const selectedCount = computed({
  get: () => props.selectedCount || 0,
  set: () => {}
})

const showInfo = ref(false)

// Mettre à jour qtyAdults si la capacité change
watch(capacityAdults, (newVal) => {
  if (qtyAdults.value > newVal) {
    qtyAdults.value = newVal
  }
})

watch(qtyAdults, (newVal) => {
  if (selectedCount.value > 0) {
    emit('update', { room: props.room, plan: props.plan, adults: newVal, children: qtyChildren.value })
  }
})

watch(qtyChildren, (newVal) => {
  if (selectedCount.value > 0) {
    emit('update', { room: props.room, plan: props.plan, adults: qtyAdults.value, children: newVal })
  }
})


const roomsLeftZero = computed(() => props.room.roomsLeft <= 0)
const needsMoreNights = computed(() => (props.plan.minNights ?? 1) > props.nights)
const minNightsRemaining = computed(() => Math.max((props.plan.minNights ?? 1) - props.nights, 0))
const canAdd = computed(() => !roomsLeftZero.value && !needsMoreNights.value)

const featuresList = computed(() =>
  Array.isArray(props.plan.features)
    ? props.plan.features
    : props.plan.features
      ? [props.plan.features]
      : [],
)
const policiesList = computed(() =>
  Array.isArray(props.plan.policies)
    ? props.plan.policies
    : props.plan.policies
      ? [props.plan.policies]
      : [],
)

const imageUrl = computed(
  () => 'https://images.unsplash.com/photo-1560067174-8947b9bf0f59?auto=format&fit=crop&w=640&q=60',
)

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency || 'XAF',
    maximumFractionDigits: 0,
  }).format(amount)
}

function increment() {
  if (!canAdd.value) return
  if (selectedCount.value >= props.room.roomsLeft) return
  emit('add', {
    room: props.room,
    plan: props.plan,
    adults: qtyAdults.value,
    children: qtyChildren.value,
  })
}

function decrement() {
  if (selectedCount.value <= 0) return
  emit('remove', { room: props.room, plan: props.plan })
}




function enquireLocal() {
  router.push('/ota/contact-us')
}
</script>

<style scoped></style>
