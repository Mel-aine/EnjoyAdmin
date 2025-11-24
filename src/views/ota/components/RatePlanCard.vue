<template>
  <div class="rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition">
    <!-- Top content -->
    <div class="grid grid-cols-[160px_1fr_auto] gap-4 items-start">
      <!-- <img :src="roomImage" alt="Room" class="w-40 h-28 object-cover rounded-md border" /> -->
       <div class="relative w-40 h-28">
          <img
            :src="currentImage"
            alt="Room"
            class="w-full h-full object-cover rounded-md border"
          />

          <!-- Navigation-->
          <div v-if="allImages.length > 1" class="absolute inset-0 flex items-center justify-between px-1">
            <button
              @click.stop="previousImage"
              class="bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ‹
            </button>
            <button
              @click.stop="nextImage"
              class="bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ›
            </button>
          </div>

          <!-- Indicateurs de pagination -->
          <div v-if="allImages.length > 1" class="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            <div
              v-for="(_, idx) in allImages"
              :key="idx"
              class="w-1.5 h-1.5 rounded-full transition-all"
              :class="idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'"
            />
          </div>
        </div>
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
        <button type="button" class="text-blue-700 hover:underline" @click="openModal">
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

    <div v-if="selectedCount > 0" class="mt-3 space-y-2">
      <div v-for="roomNum in selectedCount" :key="roomNum" class="grid grid-cols-[1fr_auto] gap-2 items-center">
        <div class="flex gap-3 items-center">
          <span class="text-xs text-gray-600">Room {{ roomNum }}</span>
          <label class="text-xs text-gray-600">Adult</label>
          <select v-model.number="roomOccupants[roomNum - 1].adults" class="border rounded px-2 py-1 text-xs w-16">
            <option v-for="n in capacityAdults" :key="`a-${n}`" :value="n">{{ n }}</option>
          </select>
          <label class="text-xs text-gray-600">Child</label>
          <select v-model.number="roomOccupants[roomNum - 1].children" class="border rounded px-2 py-1 text-xs w-16">
            <option v-for="n in capacityChildren + 1" :key="`c-${n}`" :value="n - 1">
              {{ n - 1 }}
            </option>
          </select>
        </div>
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
     <div v-if="showInfo" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div class="text-sm font-semibold">{{ room.name }}</div>
            <div class="text-xs text-gray-600">{{ plan.name }}</div>
          </div>
          <button class="text-gray-600 hover:text-black" @click="showInfo = false">✕</button>
        </div>

        <div class="p-4 space-y-4">
          <!-- Gallery Section -->
          <div v-if="allImages.length" class="space-y-3">


            <!-- Main Image -->
            <div class="relative w-full h-64 rounded-lg overflow-hidden">
              <img
                :src="allImages[modalImageIndex]"
                alt="Room"
                class="w-full h-full object-cover"
              />

              <!-- Navigation Arrows (if more than 1 image) -->
              <div v-if="allImages.length > 1" class="absolute inset-0 flex items-center justify-between px-3">
                <button
                  @click="modalImageIndex = (modalImageIndex - 1 + allImages.length) % allImages.length"
                  class="bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                >
                  ‹
                </button>
                <button
                  @click="modalImageIndex = (modalImageIndex + 1) % allImages.length"
                  class="bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                >
                  ›
                </button>
              </div>

              <!-- Image Counter -->
              <div class="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {{ modalImageIndex + 1 }} / {{ allImages.length }}
              </div>
            </div>

            <!-- Thumbnail Gallery (if more than 1 image) -->
            <div v-if="allImages.length > 1" class="grid grid-cols-5 gap-2">
              <button
                v-for="(img, idx) in allImages"
                :key="idx"
                @click="modalImageIndex = idx"
                class="relative h-16 rounded overflow-hidden border-2 transition"
                :class="idx === modalImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-400'"
              >
                <img :src="img" alt="Thumbnail" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Capacity Section -->
          <div>
            <div class="font-medium text-sm">Capacity</div>
            <div class="flex items-center gap-3 mt-2">
              <span class="flex items-center gap-1">
                <Adult class="inline w-4 h-4" /> {{ capacityAdults }} Adults
              </span>
              <span class="flex items-center gap-1">
                <Child class="inline w-4 h-4" /> {{ capacityChildren }} Children
              </span>
            </div>
          </div>

          <!-- Features Section -->
          <div v-if="featuresList.length">
            <div class="font-medium text-sm">Features</div>
            <ul class="list-disc pl-5 space-y-1 mt-2 text-sm text-gray-700">
              <li v-for="(f, idx) in featuresList" :key="idx">{{ f }}</li>
            </ul>
          </div>

          <!-- Policies Section -->
          <div v-if="policiesList.length">
            <div class="font-medium text-sm">Policies</div>
            <ul class="list-disc pl-5 space-y-1 mt-2 text-sm text-gray-700">
              <li v-for="(p, idx) in policiesList" :key="idx">{{ p }}</li>
            </ul>
          </div>
        </div>

        <div class="p-4 border-t flex items-center justify-end gap-2 sticky bottom-0 bg-white">
          <button class="border rounded px-4 py-2 text-sm hover:bg-gray-50" @click="showInfo = false">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter,useRoute } from 'vue-router'
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
  images?: string[]
  rooms?: Array<{ images?: string[] }>
}




const props = defineProps<{ room: RoomInfo; plan: RatePlan; nights: number; currency?: string,selectedCount?: number ,hotelId?:any }>()

const emit = defineEmits<{
  (e: 'add', payload: { room: RoomInfo; plan: RatePlan; occupants: Array<{ adults: number; children: number }> }): void
  (e: 'remove', payload: { room: RoomInfo; plan: RatePlan }): void
  (e: 'update', payload: { room: RoomInfo; plan: RatePlan; occupants: Array<{ adults: number; children: number }> }): void
}>()

const router = useRouter()
const route = useRoute()
const capacityAdults = computed(() => props.room?.capacity?.adults ?? 2)
const capacityChildren = computed(() => props.room?.capacity?.children ?? 0)

// Initialiser avec les valeurs max de capacité
// const qtyAdults = ref(capacityAdults.value)
// const qtyChildren = ref(0)
const compare = ref(false)
const currentImageIndex = ref(0)
const roomOccupants = ref<Array<{ adults: number; children: number }>>([])
const selectedCount = computed({
  get: () => props.selectedCount || 0,
  set: () => {}
})

const showInfo = ref(false)
const modalImageIndex = ref(0)

function openModal() {
  modalImageIndex.value = 0 // Réinitialiser à la première image
  showInfo.value = true
}


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



function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency || 'XAF',
    maximumFractionDigits: 0,
  }).format(amount)
}

// function increment() {
//   if (!canAdd.value) return
//   if (selectedCount.value >= props.room.roomsLeft) return
//   emit('add', {
//     room: props.room,
//     plan: props.plan,
//     adults: qtyAdults.value,
//     children: qtyChildren.value,
//   })
// }

function decrement() {
  if (selectedCount.value <= 0) return
  emit('remove', { room: props.room, plan: props.plan })
}




const allImages = computed(() => {
  const images: string[] = []

  // Images directes du room
  if (props.room.images && props.room.images.length > 0) {
    images.push(...props.room.images)
  }

  // Images des rooms individuels
  if (props.room.rooms && props.room.rooms.length > 0) {
    props.room.rooms.forEach(r => {
      if (r.images && r.images.length > 0) {
        images.push(...r.images)
      }
    })
  }

  //  si vraiment aucune image
  if (images.length === 0) {
    return ['https://via.placeholder.com/160x112?text=No+Image']
  }

  // cas de doublon
  return [...new Set(images)]
})

const currentImage = computed(() => allImages.value[currentImageIndex.value])

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % allImages.value.length
}

function previousImage() {
  currentImageIndex.value = currentImageIndex.value === 0
    ? allImages.value.length - 1
    : currentImageIndex.value - 1
}

function enquireLocal() {
  const hotelId = props.hotelId
  router.push({
    name: 'OtaContactUs',
    query: { hotelId }
  })
}



// Initialiser le tableau quand selectedCount change
watch(selectedCount, (newCount:any, oldCount:any) => {
  if (newCount > oldCount) {
    // Ajouter des chambres
    for (let i = oldCount; i < newCount; i++) {
      roomOccupants.value.push({
        adults: capacityAdults.value,
        children: 0
      })
    }
  } else if (newCount < oldCount) {
    // Retirer des chambres
    roomOccupants.value.splice(newCount)
  }
}, { immediate: true })

// Mettre à jour les watchers :
watch(roomOccupants, (newVal) => {
  if (selectedCount.value > 0 && newVal.length > 0) {
    // Émettre avec les infos de toutes les chambres
    emit('update', {
      room: props.room,
      plan: props.plan,
      occupants: newVal
    })
  }
}, { deep: true })

// Mettre à jour increment() :
function increment() {
  if (!canAdd.value) return
  if (selectedCount.value >= props.room.roomsLeft) return

  // Ajouter une nouvelle chambre avec capacité max
  const newOccupants = [...roomOccupants.value, {
    adults: capacityAdults.value,
    children: 0
  }]

  emit('add', {
    room: props.room,
    plan: props.plan,
    occupants: newOccupants,
  })
}
</script>

<style scoped></style>
