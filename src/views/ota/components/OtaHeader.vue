<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-12">
        <div class="flex items-center gap-2 text-[11px] uppercase tracking-wide">
          <span>{{ brand }}</span>
          <!-- Stars to convey quality like booking.com -->
          <div class="flex items-center gap-0.5">
            <StaredIcon v-for="n in 5" :key="n" class="w-3 h-3 text-yellow-300" />
          </div>
        </div>
        <nav class="flex items-center gap-2">
          <button :class="navClass('/ota/web-booking')" @click="goHome">
            <HomeIcon class="w-4 h-4" />
            <span class="text-sm">Home</span>
          </button>
          <button :class="navClass('/ota/hotel-info')" @click="goHotelInfo">
            <InfoIcon class="w-4 h-4" />
            <span class="text-sm">Hotel Info</span>
          </button>
          <div class="relative">
            <button class="h-12 px-3 hover:bg-blue-700 flex items-center gap-1" @click="toggleLogin">
              <LogoutIcon class="w-4 h-4" />
              <span class="text-sm">Login</span>
            </button>
            <div v-if="loginOpen" class="absolute top-full left-0 bg-white text-gray-800 rounded shadow p-4 w-80 mt-2">
              <div class="text-center text-sm font-semibold mb-2">Login</div>
              <div class="space-y-2">
                <input v-model="login.username" type="text" placeholder="Enter Username" class="w-full border rounded px-3 py-2 text-sm" />
                <input v-model="login.password" type="password" placeholder="Enter Password" class="w-full border rounded px-3 py-2 text-sm" />
                <div class="text-xs text-blue-600"><a href="#">Forgot Password?</a></div>
                <button class="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded py-2 text-sm" @click="submitLogin">Login</button>
              </div>
            </div>
          </div>
          <button :class="navClass('/ota/contact-us')" @click="goContactUs">
            <MailIcon class="w-4 h-4" />
            <span class="text-sm">Contact Us</span>
          </button>
          <button :class="navClass('/ota/map')" @click="goMap">
            <MappingIcon class="w-4 h-4" />
            <span class="text-sm">Map</span>
          </button>
          <button :class="navClass('/ota/reviews')" @click="goReviews">
            <Message2Line class="w-4 h-4" />
            <span class="text-sm">Reviews</span>
          </button>
          <button :class="navClass('/ota/cancel-booking')" @click="goCancelBooking">
            <CheckIcon class="w-4 h-4" />
            <span class="text-sm">Cancel Bookings</span>
          </button>
          <div class="relative">
            <button class="h-12 px-3 hover:bg-blue-700 flex items-center gap-1" @click="toggleCurrency">
              <span class="text-sm">{{ currency }}</span>
              <span class="text-xs">▼</span>
            </button>
            <div v-if="currencyOpen" class="absolute right-0 top-full bg-white text-gray-800 rounded shadow mt-2 w-28">
              <button v-for="c in currencies" :key="c" class="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm" @click="setCurrency(c)">{{ c }}</button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HomeIcon from '@/icons/HomeIcon.vue'
import InfoIcon from '@/icons/InfoIcon.vue'
import LogoutIcon from '@/icons/LogoutIcon.vue'
import MailIcon from '@/icons/MailIcon.vue'
import MappingIcon from '@/icons/MappingIcon.vue'
import Message2Line from '@/icons/Message2Line.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
import StaredIcon from '@/icons/StaredIcon.vue'

const props = defineProps<{ brand?: string; currency?: string }>()
const emit = defineEmits<{ (e: 'currency-change', value: string): void }>()

const brand = props.brand ?? 'TAMI SARL (SUITA HOTEL)'
const currency = ref(props.currency ?? 'XAF')
const currencies = ['XAF', 'USD', 'EUR']

const loginOpen = ref(false)
const currencyOpen = ref(false)
const login = ref({ username: '', password: '' })

const router = useRouter()
const route = useRoute()

function navClass(path: string) {
  const base = 'h-12 px-3 flex items-center gap-1 rounded-md transition-colors'
  const active = route.path === path ? 'bg-blue-700' : 'hover:bg-blue-700'
  return `${base} ${active}`
}

function goHome() {
  router.push('/ota/web-booking')
}
function toggleLogin() {
  loginOpen.value = !loginOpen.value
  currencyOpen.value = false
}
function submitLogin() {
  loginOpen.value = false
}
function toggleCurrency() {
  currencyOpen.value = !currencyOpen.value
  loginOpen.value = false
}
function setCurrency(c: string) {
  currency.value = c
  currencyOpen.value = false
  emit('currency-change', c)
}
function goHotelInfo() {
  router.push('/ota/hotel-info')
}
function goContactUs() {
  router.push('/ota/contact-us')
}
function goMap() {
  router.push('/ota/map')
}
function goReviews() {
  router.push('/ota/reviews')
}
function goCancelBooking() {
  router.push('/ota/cancel-booking')
}
</script>

<style scoped>
/* En-tête poli avec survols doux et lien actif */
</style>