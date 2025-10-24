<template>
  <FullScreenLayout>
    <OtaHeader :brand="brand" :currency="selectedCurrency" @currency-change="setCurrency" />
    <!-- Hero with dark background image -->
    <section class="relative pt-12">
      <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=60" alt="Hotel hero" class="absolute inset-0 w-full h-40 md:h-52 object-cover" />
      <div class="relative h-40 md:h-52 bg-black/70">
        <div class="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <div class="text-white">
            <div class="text-sm font-semibold">{{ brand }}</div>
            <div class="mt-1 text-xs space-y-0.5">
              <div>Carrefour Bastos, 2723, Yaounde, Cameroon</div>
              <div>reservation@suita-hotel.com • (+237) 658885585</div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-4 text-center w-40">
            <div class="text-3xl font-bold">4.00</div>
            <div class="text-xs text-gray-600">Out of 5</div>
            <div class="mt-1 text-[11px] text-gray-500">Guest Reviews Based on 1 Reviews</div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <!-- Score breakdown -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-4 border-b font-semibold">Score breakdown</div>
          <div class="p-4 space-y-3">
            <div>
              <div class="flex justify-between text-[12px]"><span>Value</span><span>4.0</span></div>
              <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-600 rounded" style="width: 80%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[12px]"><span>Staff service</span><span>4.0</span></div>
              <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-600 rounded" style="width: 80%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[12px]"><span>Rooms</span><span>4.0</span></div>
              <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-600 rounded" style="width: 80%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[12px]"><span>Location</span><span>4.0</span></div>
              <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-600 rounded" style="width: 80%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[12px]"><span>Friendliness</span><span>3.9</span></div>
              <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-600 rounded" style="width: 78%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[12px]"><span>Cleanliness</span><span>3.8</span></div>
              <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-600 rounded" style="width: 76%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[12px]"><span>Breakfast</span><span>3.9</span></div>
              <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-600 rounded" style="width: 78%"></div></div>
            </div>
          </div>
        </div>

        <!-- Reviews list -->
        <section class="space-y-3">
          <!-- Filters -->
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="flex flex-col">
                <label class="text-[11px] text-gray-600">Show reviews from:</label>
                <select class="border rounded px-2 py-1 text-sm">
                  <option>All Reviews</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div class="flex flex-col">
                <label class="text-[11px] text-gray-600">Sort by:</label>
                <select class="border rounded px-2 py-1 text-sm">
                  <option>Date (Newest to Oldest)</option>
                  <option>Date (Oldest to Newest)</option>
                </select>
              </div>
              <div class="flex flex-col">
                <label class="text-[11px] text-gray-600">Stay:</label>
                <select class="border rounded px-2 py-1 text-sm">
                  <option>Select</option>
                </select>
              </div>
              <div class="flex flex-col">
                <label class="text-[11px] text-gray-600">Room:</label>
                <select class="border rounded px-2 py-1 text-sm">
                  <option>Select</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Single review card -->
          <div class="bg-white rounded-lg shadow-sm border">
            <div class="p-4">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <div class="font-semibold text-sm">BABAFEMI GEORGE</div>
                    <div class="text-[11px] text-gray-500">Lagos, Nigeria • Jun 26, 2022</div>
                    <div class="text-[11px] text-gray-500">1 person found this review helpful.</div>
                  </div>
                </div>
                <div class="inline-flex items-center bg-green-100 text-green-800 text-xs font-bold rounded px-2 py-1">4.0</div>
              </div>

              <div class="mt-3 text-sm text-gray-700">
                Good and clean facility. Cozy warm apartment part of the hotel; access to underground parking is great.
              </div>

              <div class="mt-3 flex items-center gap-2 text-[12px]">
                <span>Was this review helpful?</span>
                <button class="px-2 py-1 border rounded hover:bg-gray-50">Yes</button>
                <button class="px-2 py-1 border rounded hover:bg-gray-50">No</button>
              </div>
            </div>

            <div class="border-t p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
              <div class="flex justify-between"><span>Value</span><span>4</span></div>
              <div class="flex justify-between"><span>Staff service</span><span>4</span></div>
              <div class="flex justify-between"><span>Rooms</span><span>4</span></div>
              <div class="flex justify-between"><span>Cleanliness</span><span>5</span></div>
              <div class="flex justify-between"><span>Location</span><span>3</span></div>
              <div class="flex justify-between"><span>Friendliness</span><span>5</span></div>
              <div class="flex justify-between"><span>Breakfast</span><span>3</span></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import OtaHeader from './components/OtaHeader.vue'

const brand = 'TAMI SARL (SUITA HOTEL)'
const selectedCurrency = ref<string>('XAF')
function setCurrency(c: string) { selectedCurrency.value = c }
</script>

<style scoped>
</style>