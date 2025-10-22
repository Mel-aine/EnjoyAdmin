<template>
  <aside class="bg-white rounded-lg shadow-sm border p-4">
    <div class="flex items-center justify-between">
      <div class="font-semibold text-sm">Booking Summary</div>
      <div class="text-[11px] text-gray-500">{{ nights }} night<span v-if="nights>1">s</span></div>
    </div>
    <div class="mt-2 text-xs text-gray-600">
      <div>Dates: {{ arrivalDate }} - {{ departureDate }}</div>
    </div>

    <div class="mt-3 space-y-2">
      <div v-for="(item, idx) in items" :key="idx" class="border rounded p-2 mb-2">
        <div class="flex items-start justify-between">
          <div>
            <div class="font-medium text-sm">{{ item.roomName }} – {{ item.planName }}</div>
            <div class="text-gray-500 text-xs">{{ adultsLabel(item.adults) }}, {{ childrenLabel(item.children) }}, {{ item.qty }} Room<span v-if="item.qty > 1">s</span></div>
          </div>
          <button class="text-xs text-red-600 hover:underline"  @click="onRemove(idx)">Remove</button>
        </div>
        <div class="mt-2 text-sm">
          <div>{{ formatCurrency(item.planPrice) }} / night</div>
          <div class="text-[11px] text-gray-500">x {{ nights }} night<span v-if="nights > 1">s</span> x {{ item.qty }} room<span v-if="item.qty > 1">s</span></div>
          <div class="mt-1 font-semibold">{{ formatCurrency(item.planPrice * nights * item.qty) }}</div>
        </div>
      </div>
    </div>

    <div class="mt-3 border-t pt-3 flex justify-between items-center">
      <div class="text-sm">Total</div>
      <div class="font-bold">{{ formatCurrency(items.reduce((sum, it) => sum + (it.planPrice * props.nights * it.qty), 0)) }}</div>
    </div>

    <button class="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded py-2 text-sm" :disabled="items.length === 0" @click="onBook">
      Book
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SummaryItem {
  roomName: string
  planName: string
  planPrice: number
  adults: number
  children: number
  qty: number
}



const props = defineProps<{ items: SummaryItem[]; arrivalDate: string; departureDate: string; nights: number }>()

const emit = defineEmits<{ (e: 'book'): void; (e: 'remove', index: number): void }>()

const total = computed(() => props.items.reduce((sum, it) => sum + (it.planPrice * props.nights * it.qty), 0))

function onBook() {
  emit('book')
}

function onRemove(index: number) {
  emit('remove', index)
}

function adultsLabel(count: number) {
  return `${count} Adult${count > 1 ? 's' : ''}`
}

function childrenLabel(count: number) {
  return `${count} Child${count > 1 ? 'ren' : ''}`
}


function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
}
</script>
