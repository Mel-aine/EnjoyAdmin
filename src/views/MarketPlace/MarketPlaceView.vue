<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('Marketplace')" />

    <!-- Search -->
    <div class="relative max-w-sm mb-6">
      <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('marketplace.search')"
        class="pl-9 pr-4 h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white shadow-sm placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-purple-500 focus:outline-none focus:ring-3 focus:ring-purple-500/10 dark:focus:border-purple-600 transition"
      />
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div
        v-for="i in 8"
        :key="i"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2"
      >
        <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse mb-3" />
        <div class="h-3.5 w-3/4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        <div class="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        <div class="h-3 w-2/3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    </div>

    <template v-else>
      <!-- Modules grid -->
      <div v-if="filteredModules.length" class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div
          v-for="mod in filteredModules"
          :key="mod.id"
          class="relative bg-white dark:bg-gray-900 border rounded-xl p-4 cursor-pointer transition-all duration-200 group"
          :class="mod.slug === 'pms'
            ? 'border-amber-200 dark:border-amber-800/60 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md hover:shadow-amber-500/5'
            : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md hover:shadow-purple-500/5'"
          @click="openModule(mod)"
        >
          

          <div class="flex justify-between items-start">
            <!-- Icon -->
            <div
              class="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-3 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:border-purple-100 dark:group-hover:border-purple-800 transition-all overflow-hidden"
            >
              <img
                v-if="mod.iconUrl"
                :src="mod.iconUrl"
                :alt="mod.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <component
                v-else
                :is="getModuleIcon(mod)"
                class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors"
              />
            </div>

            <!-- Installed badge / PMS core badge -->
            <div v-if="mod.slug === 'pms'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
              <svg class="w-2.5 h-2.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m0-6v2m-6.364 4.364A9 9 0 1118.364 5.636 9 9 0 015.636 18.364z"/>
              </svg>
              <span class="text-[10px] text-amber-600 dark:text-amber-400 font-medium">{{ $t('marketplace.core') }}</span>
            </div>
            <div
              v-else-if="mod.isInstalled"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {{ $t('marketplace.installed') }}
              </span>
            </div>
          </div>

          <h3 class="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
            {{ mod.name }}
          </h3>
          <p class="text-gray-400 dark:text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">
            {{ mod.description }}
          </p>

          <!-- Prix -->
          <div v-if="mod.addOns?.length">
            <p class="mt-2 text-xs font-semibold text-gray-800 dark:text-gray-200">
              {{ $t('marketplace.startingFrom') }}
              {{ Number(Math.min(...mod.addOns.map((a: any) => a.priceMonth))).toLocaleString() }}
              <span class="font-normal text-gray-400">/ {{ $t('marketplace.month') }}</span>
            </p>
          </div>
          <p v-else-if="mod.priceMonthly !== null && mod.priceMonthly !== undefined" class="mt-2 text-xs font-semibold text-gray-800 dark:text-gray-200">
            {{ Number(mod.priceMonthly).toLocaleString() }}
            <span class="font-normal text-gray-400">/ {{ $t('marketplace.month') }}</span>
          </p>
          <p v-else class="mt-2 text-xs font-medium text-gray-400 dark:text-gray-500 italic">
            
          </p>

          <div class="mt-3 flex gap-1.5 flex-wrap">
            <span
              v-if="mod.badge"
              class="text-[10px] font-medium px-2 py-0.5 rounded-full"
              :class="badgeClass(mod.badge)"
            >
              {{ mod.badge }}
            </span>
          
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="!isLoading && !error && filteredModules.length === 0"
        class="flex flex-col items-center py-24 text-center"
      >
        <div class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <SearchIcon class="w-6 h-6 text-gray-300 dark:text-gray-600" />
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {{ $t('marketplace.noResults') }} "{{ searchQuery }}"
        </p>
      </div>
    </template>

    <!-- Module Detail Modal -->
    <teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedModule"
          class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-0"
          @click.self="closeModal"
        >
          <div
            class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            @click.stop
          >
            <div class="p-6">
              <!-- Top row: icon + name + close -->
              <div class="flex items-start justify-between mb-5">
                <div class="flex items-center gap-3.5">
                  <!-- Icon -->
                  <div
                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-900/30 dark:to-orange-900/20 border border-purple-100 dark:border-purple-800/50 flex items-center justify-center overflow-hidden flex-shrink-0"
                  >
                    <img
                      v-if="selectedModule.iconUrl"
                      :src="selectedModule.iconUrl"
                      :alt="selectedModule.name"
                      class="w-full h-full object-cover rounded-xl"
                    />
                    <component
                      v-else
                      :is="getModuleIcon(selectedModule)"
                      class="w-5 h-5 text-purple-500 dark:text-purple-400"
                    />
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-0.5">
                      <h2 class="text-gray-900 dark:text-white font-bold text-base leading-tight">
                        {{ selectedModule.name }}
                      </h2>
                      <span
                        v-if="selectedModule.isInstalled"
                        class="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      >
                        <span class="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                        {{ $t('marketplace.installed') }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span
                        v-if="selectedModule.badge"
                        class="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        :class="badgeClass(selectedModule.badge)"
                      >{{ selectedModule.badge }}</span>
                
                    </div>
                  </div>
                </div>

                <button
                  @click="closeModal"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0"
                >
                  <XIcon class="w-4 h-4" />
                </button>
              </div>

              <!-- Description -->
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">
                {{ selectedModule.description }}
              </p>

              <!-- Prix row -->
              <div class="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 px-4 py-3 mb-5">
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('marketplace.monthlyRate') }}</span>
                <span v-if="selectedModule.addOns?.length" class="text-xs text-gray-400 italic">
                  {{ $t('marketplace.dependsOnAddon') }}
                </span>
                <span v-else-if="selectedModule.priceMonthly !== null && selectedModule.priceMonthly !== undefined" class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ Number(selectedModule.priceMonthly).toLocaleString() }}
                  <span class="text-xs font-normal text-gray-400">{{ selectedModule.currency ?? 'FCFA' }} / {{ $t('marketplace.month') }}</span>
                </span>
                <span v-else class="text-xs font-medium text-gray-400 italic">
                  5000 FCFA / {{ $t('marketplace.month') }}
                </span>
              </div>

              <!-- Add-ons section -->
              <div v-if="selectedModule.addOns?.length" class="mb-5">
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Add-ons
                </p>

               
                <template v-if="selectedModule.slug === 'pms'">
                  <div v-if="activePmsSubscription" class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                        <p class="text-sm font-semibold text-gray-800 dark:text-white">
                          {{ activePmsSubscription.addOn?.name }}
                        </p>
                      </div>
                      <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                        {{ $t('marketplace.active') }}
                      </span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                      <div class="rounded-lg bg-white dark:bg-gray-800 border border-amber-100 dark:border-amber-800/30 px-3 py-2">
                        <p class="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">{{ $t('marketplace.units') }}</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">
                          {{ activePmsSubscription.limitCount }}
                          <span class="text-xs font-normal text-gray-400">/ {{ activePmsSubscription.addOn?.max }}</span>
                        </p>
                      </div>
                      <div class="rounded-lg bg-white dark:bg-gray-800 border border-amber-100 dark:border-amber-800/30 px-3 py-2">
                        <p class="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">{{ $t('marketplace.monthlyRate') }}</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">
                          {{ Number(activePmsSubscription.price).toLocaleString() }}
                          <span class="text-xs font-normal text-gray-400"> {{ hotelCurrency }}</span>
                        </p>
                      </div>
                    </div>
                    <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                      {{ $t('marketplace.renewsOn') }}
                      {{ new Date(activePmsSubscription.endsAt).toLocaleDateString() }}
                    </p>
                  </div>

                  <!-- Aucune souscription add-on active pour le PMS -->
                  <div v-else class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 px-4 py-3 text-center">
                    <p class="text-xs text-gray-400 dark:text-gray-500 italic">{{ $t('marketplace.noActiveAddon') }}</p>
                  </div>
                </template>

                
          
                <template v-else>
                  <!-- Si installé : afficher uniquement l'add-on souscrit en lecture seule -->
                  <template v-if="selectedModule.isInstalled">
                    <div v-if="activeAddonForModule(selectedModule.id)" class="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 px-4 py-3">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
                          <p class="text-sm font-semibold text-gray-800 dark:text-white">
                            {{ activeAddonForModule(selectedModule.id).addOn?.name }}
                          </p>
                        </div>
                        <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                          {{ $t('marketplace.active') }}
                        </span>
                      </div>
                      <div class="grid grid-cols-2 gap-2 mt-2">
                        <div class="rounded-lg bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-800/30 px-3 py-2">
                          <p class="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">{{ $t('marketplace.units') }}</p>
                          <p class="text-sm font-bold text-gray-900 dark:text-white">
                            {{ activeAddonForModule(selectedModule.id).addOn?.min }}–{{ activeAddonForModule(selectedModule.id).addOn?.max }}
                          </p>
                        </div>
                        <div class="rounded-lg bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-800/30 px-3 py-2">
                          <p class="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">{{ $t('marketplace.monthlyRate') }}</p>
                          <p class="text-sm font-bold text-gray-900 dark:text-white">
                            {{ Number(activeAddonForModule(selectedModule.id).price).toLocaleString() }}
                            <span class="text-xs font-normal text-gray-400"> {{ hotelCurrency }}</span>
                          </p>
                        </div>
                      </div>
                      <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                        {{ $t('marketplace.renewsOn') }}
                        {{ new Date(activeAddonForModule(selectedModule.id).endsAt).toLocaleDateString() }}
                      </p>
                    </div>

                    <div v-else class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 px-4 py-3 text-center">
                      <p class="text-xs text-gray-400 dark:text-gray-500 italic">{{ $t('marketplace.noActiveAddon') }}</p>
                    </div>
                  </template>

                  <!-- Si non installé : liste avec radio -->
                  <template v-else>
                    <div class="space-y-2">
                      <label
                        v-for="addon in selectedModule.addOns"
                        :key="addon.id"
                        class="flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-all duration-150"
                        :class="selectedAddonId === addon.id
                          ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400 dark:border-purple-600 shadow-sm shadow-purple-500/10'
                          : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800'"
                        @click="selectedAddonId = addon.id"
                      >
                        <div class="flex items-center gap-3">
                          <!-- Radio custom -->
                          <div
                            class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                            :class="selectedAddonId === addon.id
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'"
                          >
                            <div v-if="selectedAddonId === addon.id" class="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                          <div>
                            <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ addon.name }}</p>
                            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                              {{ addon.min }}–{{ addon.max }} {{ $t('marketplace.units') }}
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-bold" :class="selectedAddonId === addon.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-white'">
                            {{ Number(addon.priceMonth).toLocaleString() }}
                            <span class="text-xs font-normal text-gray-400">/ {{ $t('marketplace.month') }}</span>
                          </p>
                          <p class="text-[11px] text-gray-400 dark:text-gray-500">
                            {{ Number(addon.priceYear).toLocaleString() }} / {{ $t('marketplace.year') }}
                          </p>
                        </div>
                      </label>
                    </div>
                  </template>
                </template>
              </div>

              <!-- Actions -->
              <div class="flex gap-2.5">
               
                <button
                  v-if="!selectedModule.isInstalled"
                  @click="handleInstall(selectedModule)"
                  :disabled="actionLoading"
                  class="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm shadow-purple-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="actionLoading" class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  <span>{{ actionLoading ? $t('marketplace.installing') : $t('marketplace.activate') }}</span>
                </button>

              
                <div
                  v-else-if="selectedModule.slug === 'pms'"
                  class="flex-1 flex items-center gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 px-4 py-2.5"
                >
                  <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  </svg>
                  <span class="text-xs text-amber-700 dark:text-amber-400 font-medium leading-snug">
                    {{ $t('marketplace.coreModule') }}
                  </span>
                </div>

               
                <template v-else>
                  <button
                    @click="handleUninstall(selectedModule)"
                    :disabled="actionLoading"
                    class="flex-1 flex items-center justify-center gap-2 border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="actionLoading" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    <span>{{ actionLoading ? $t('marketplace.uninstalling') : $t('marketplace.deactivate') }}</span>
                  </button>

                  <button
                    @click="closeModal"
                    class="px-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm rounded-xl transition"
                  >
                    {{ $t('Cancel') }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Search as SearchIcon,
  X as XIcon,
  Box as BoxIcon,
  Database as DatabaseIcon,
  Plug as PlugInIcon,
  Shield as ShieldIcon,
  Bell as BellIcon,
  BarChart2 as ChartBarIcon,
 
} from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import WhatsAppIcon from '@/icons/WhatsAppIcon.vue'
import {
  getModules,
  installModule,
  updateHotelInformation,
  getHotelById,
  buildInstallPayload,
  uninstallModule
} from '@/services/marketPlaceApi'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()


const modules = ref<any[]>([])
const subscriptions = ref<any[]>([])
const isLoading = ref(false)
const error = ref<any>(null)
const searchQuery = ref('')
const selectedModule = ref<any>(null)
const actionLoading = ref(false)
const whatsappEnabled = ref(false)
const hotelCurrency = ref('XAF')
const selectedAddonId = ref<number | null>(null)


const whatsappModule = computed(() => ({
  id: 'whatsapp',
  slug: 'whatsapp',
  name: 'WhatsApp',
  description: t('marketplace.whatsappDescription'),
  priceMonthly: null,
  isOfficial: true,
  badge: null,
  iconUrl: null,
  category: 'whatsapp',
  addOns: [],
  isInstalled: whatsappEnabled.value,
  isStatic: true,
}))

const normalizeModuleId = (value: unknown) => {
  if (value === null || value === undefined) return null
  return String(value)
}

const checkActiveSubscription = (moduleId: unknown) => {
  const normalizedModuleId = normalizeModuleId(moduleId)
  const currentDate = new Date()

  return subscriptions.value.some((sub) => {
    const subscriptionModuleId = normalizeModuleId(sub.moduleId ?? sub.module?.id ?? sub.module_id)
    const endDateRaw = sub.endsAt ?? sub.endDate ?? sub.periodEnd
    const endDate = endDateRaw ? new Date(endDateRaw) : null
    const hasValidEndDate = endDate instanceof Date && !Number.isNaN(endDate.getTime())
    const status = String(sub.status ?? '').toLowerCase()

    return (
      subscriptionModuleId === normalizedModuleId &&
      (status === 'active' || status === 'paid') &&
      (!hasValidEndDate || endDate >= currentDate)
    )
  })
}

const syncInstalledModules = () => {
  modules.value = modules.value.map((mod) => ({
    ...mod,
    isInstalled: checkActiveSubscription(mod.id),
  }))

  if (selectedModule.value && !selectedModule.value.isStatic) {
    const currentModule = modules.value.find((mod) => mod.id === selectedModule.value.id)
    if (currentModule) {
      selectedModule.value = {
        ...selectedModule.value,
        isInstalled: currentModule.isInstalled,
        currency: hotelCurrency.value,
      }
    }
  }
}




// Exemple d'utilisation dans fetchModules
const fetchModules = async () => {
  isLoading.value = true
  error.value = null
  try {
    const resp = await getModules()
    modules.value = resp?.data?.data || []
    syncInstalledModules()
  } catch (err) {
    console.error('Failed to fetch modules:', err);
    toast.error(t('marketplace.fetchError'));
    error.value = err;
  } finally {
    isLoading.value = false;
  }
}



const fetchHotelInfo = async () => {
  try {
    const response = await getHotelById(serviceStore.serviceId!)
    const data = response?.data?.data
    console.log(data)
    whatsappEnabled.value = data?.whatsappEnabled ?? false
    subscriptions.value = data?.subscriptions  || []
    hotelCurrency.value = data?.currencyCode ?? 'XAF'
     serviceStore.setWhatsappEnabled(data?.whatsappEnabled ?? false)
    syncInstalledModules()
  } catch (err) {
    console.error('Failed to fetch hotel info:', err)
  }
}

const allModules = computed(() => [whatsappModule.value, ...modules.value])

const filteredModules = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return allModules.value
  return allModules.value.filter(
    (m) =>
      m.name?.toLowerCase().includes(query) ||
      m.description?.toLowerCase().includes(query),
  )
})


const iconMap: Record<string, any> = {
  database: DatabaseIcon,
  auth: ShieldIcon,
  notification: BellIcon,
  analytics: ChartBarIcon,
  integration: PlugInIcon,
  whatsapp: WhatsAppIcon,
}

const getModuleIcon = (mod: any) => iconMap[mod.category?.toLowerCase()] ?? BoxIcon

const badgeClass = (badge: string) => {
  const b = badge?.toLowerCase()
  if (b === 'alpha')
    return 'bg-orange-50 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400'
  if (b === 'beta')
    return 'bg-purple-50 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400'
  if (b === 'new')
    return 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
  return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
}

const openModule = (mod: any) => {
  selectedAddonId.value = null
  if (mod.isStatic && mod.slug === 'whatsapp') {
    selectedModule.value = { ...whatsappModule.value }
  } else {
    selectedModule.value = { ...mod, currency: hotelCurrency.value }
  }
}

const closeModal = () => {
  selectedModule.value = null
}

const handleInstall = async (mod: any) => {
  if (mod.addOns?.length && !selectedAddonId.value) {
    toast.warning(t('marketplace.selectAddon'))
    return
  }

  actionLoading.value = true
  try {
    if (mod.isStatic && mod.slug === 'whatsapp') {
      const resp = await updateHotelInformation(serviceStore.serviceId!, {
        whatsappEnabled: true,
      })
      if (resp.status === 200) {
        whatsappEnabled.value = true
        serviceStore.setWhatsappEnabled(true)
        toast.success(t('marketplace.installSuccess'))
        closeModal()
      } else {
        toast.error(t('marketplace.installError'))
      }
      return
    }

    const payload = buildInstallPayload(mod, {
      currency: hotelCurrency.value,
      addOnId: selectedAddonId.value,  
    })

   
    const resp = await installModule(serviceStore.serviceId!, mod.id, payload)

    if (resp.status === 200 || resp.status === 201) {
      const idx = modules.value.findIndex((m) => m.id === mod.id)
      if (idx !== -1) modules.value[idx].isInstalled = true
      await fetchHotelInfo() 
      toast.success(t('marketplace.installSuccess'))
      closeModal()
    } else {
      toast.error(t('marketplace.installError'))
    }
  } catch (err: any) {
    console.error('Install failed:', err)
    const serverMessage = err?.response?.data?.message
    toast.error(serverMessage ?? t('marketplace.installError'))
  } finally {
    actionLoading.value = false
  }
}

const handleUninstall = async (mod: any) => {
  actionLoading.value = true
  try {
    // WhatsApp 
    if (mod.isStatic && mod.slug === 'whatsapp') {
      const resp = await updateHotelInformation(serviceStore.serviceId!, {
        whatsappEnabled: false,
      })
      if (resp.status === 200) {
        whatsappEnabled.value = false
        serviceStore.setWhatsappEnabled(false)
        toast.success(t('marketplace.uninstallSuccess'))
        closeModal()
      } else {
        toast.error(t('marketplace.uninstallError'))
      }
      return
    }

    // Trouver la subscription active du module
    const activeSub = subscriptions.value.find((sub) => {
      const subModuleId = normalizeModuleId(sub.moduleId ?? sub.module?.id)
      const status = String(sub.status ?? '').toLowerCase()
      return subModuleId === normalizeModuleId(mod.id) && (status === 'active' || status === 'paid')
    })

    if (!activeSub) {
      toast.error(t('marketplace.uninstallError'))
      return
    }

    const resp = await uninstallModule(activeSub.id, { status: 'canceled' })

    if (resp.status === 200 || resp.status === 204) {
      await fetchHotelInfo() 
      toast.success(t('marketplace.uninstallSuccess'))
      closeModal()
    } else {
      toast.error(t('marketplace.uninstallError'))
    }
  } catch (err: any) {
    console.error('Uninstall failed:', err)
    const serverMessage = err?.response?.data?.message
    toast.error(serverMessage ?? t('marketplace.uninstallError'))
  } finally {
    actionLoading.value = false
  }
}

const activePmsSubscription = computed(() => {
  return subscriptions.value.find((sub) => {
    const status = String(sub.status ?? '').toLowerCase()
    return (
      String(sub.moduleId ?? sub.module?.id) === '1' &&
      (status === 'active' || status === 'paid') &&
      sub.addOnId !== null
    )
  }) ?? null
})

const activeAddonForModule = (moduleId: unknown) => {
  const normalizedId = normalizeModuleId(moduleId)
  const currentDate = new Date()
  return subscriptions.value.find((sub) => {
    const subModuleId = normalizeModuleId(sub.moduleId ?? sub.module?.id)
    const endDate = sub.endsAt ? new Date(sub.endsAt) : null
    const hasValidEndDate = endDate instanceof Date && !Number.isNaN(endDate.getTime())
    const status = String(sub.status ?? '').toLowerCase()
    return (
      subModuleId === normalizedId &&
      (status === 'active' || status === 'paid') &&
      sub.addOnId !== null &&
      (!hasValidEndDate || endDate >= currentDate)
    )
  }) ?? null
}


onMounted(async () => {
  await Promise.all([fetchModules(), fetchHotelInfo()])
  syncInstalledModules()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>
