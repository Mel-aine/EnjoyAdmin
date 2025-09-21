<template>
  <AdminLayout>
    <div class="min-h-screen dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <!-- Enhanced Header -->
       <div class=" px-8 ">
      <div class=" px-2 relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 mb-8">
        <div class="absolute inset-0 bg-white dark:from-blue-400/5 dark:to-indigo-400/5"></div>
        <div class="relative py-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="mb-6 lg:mb-0">
              <h1 class="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                {{ $t('frontOffice.dashboard.title') }}
              </h1>
            </div>
            
            <!-- Enhanced Controls -->
            <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <!-- Premium Date Filter -->
              <div class=" space-y-2">
                <Select :lb="$t('Période d analyse')" :options = " Periodes" v-model="selectedRange"   @change="handleDateRangeChange"/>
                <!-- <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Période d'analyse
                </label>
                <div class="relative">
                  <select 
                    v-model="selectedRange"
                    @change="handleDateRangeChange"
                    class="appearance-none bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-300/60 dark:border-slate-600/60 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 transition-all duration-200"
                  >
                    <option value="today">Aujourd'hui</option>
                    <option value="yesterday">Hier</option>
                    <option value="thisWeek">Cette semaine</option>
                    <option value="lastWeek">Semaine dernière</option>
                    <option value="thisMonth">Ce mois</option>
                    <option value="lastMonth">Mois dernier</option>
                    <option value="custom">Date personnalisée</option>
                  </select>
                  <ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                 -->
                <!-- Custom Date Input -->
                <InputDatePicker class="bg-white rounded-lg w-40 h-full" v-model="customDate"  v-if="selectedRange === 'custom'" @change="loadDashboardData"/>
                <!-- <input 
                  v-if="selectedRange === 'custom'"
                  type="date" 
                  v-model="customDate"
                  @change="loadDashboardData"
                  class="mt-2 w-full px-4 py-3 border border-slate-300/60 dark:border-slate-600/60 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:bg-slate-800/90 dark:text-slate-100 backdrop-blur-sm transition-all duration-200"
                /> -->
              </div>

              <!-- Premium Refresh Button -->
              <div class="relative">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 opacity-0">
                  Action
                </label>
                <button 
                  @click="loadDashboardData" 
                  :disabled="isLoading"
                  class="group relative flex items-center px-6 py-3  focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed  transform hover:-translate-y-0.5   group/refresh text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all duration-200"
                >
                  <RefreshCw class="w-4 h-4 mr-2 transition-transform duration-300" :class="{ 'animate-spin': isLoading, 'group-hover:rotate-180': !isLoading }" />
                  Actualiser
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="px-8">
        <!-- Premium Alerts -->
        <div v-if="dashboardData?.alerts?.length > 0" class="mb-8">
          <div class="relative overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/60 dark:border-red-800/60 rounded-2xl p-4 shadow-xl shadow-red-500/10">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <h3 class="text-xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center">
                <div class="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg mr-3">
                  <AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                Alertes Critiques
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="alert in dashboardData.alerts" 
                  :key="alert.message"
                  :class="['p-4 rounded-xl backdrop-blur-sm border', getAlertClass(alert.type)]"
                >
                  <p class="font-semibold text-sm">{{ alert.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Premium KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <!-- Occupancy Rate Card -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-12 -mt-12"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Taux d'Occupation
                </h3>
                <div class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <div class="w-4 h-4 bg-blue-500 rounded"></div>
                </div>
              </div>
              <div class="text-3xl font-black mb-4" :class="getOccupancyColor(occupancyRate)">
                {{ occupancyRate }}%
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                <div 
                  class="h-2 rounded-full transition-all duration-500" 
                  :class="getOccupancyColor(occupancyRate, true)"
                  :style="{ width: `${occupancyRate}%` }"
                ></div>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {{ dashboardData?.roomStatus?.sold || 0 }}/{{ dashboardData?.roomStatus?.total || 0 }} chambres occupées
              </p>
            </div>
          </div>

          <!-- In House Guests Card -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-12 -mt-12"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Clients Présents
                </h3>
                <div class="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                  <User class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div class="text-3xl font-black text-purple-600 dark:text-purple-400 mb-4">
                {{ dashboardData?.guestInHouse?.total || 0 }}
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-slate-600 dark:text-slate-400">Adultes:</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ dashboardData?.guestInHouse?.adult || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-600 dark:text-slate-400">Enfants:</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ dashboardData?.guestInHouse?.child || 0 }}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-600">
                  <span class="text-slate-600 dark:text-slate-400 font-semibold">Total invités:</span>
                  <span class="font-black text-slate-800 dark:text-slate-200">{{ dashboardData?.guestInHouse?.totalGuests || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue Card -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-12 -mt-12"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Revenus Total
                </h3>
                <div class="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div class="text-3xl font-black text-green-600 dark:text-green-400 mb-4 flex justify-center">
                {{ formatCurrency(dashboardData?.revenue?.total || 0) }}
              </div>
            </div>
          </div>

          <!-- Arrivals Card -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-12 -mt-12"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Arrivées
                </h3>
                <div class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <Calendar class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div class="text-3xl font-black text-blue-600 dark:text-blue-400 mb-4">
                {{ dashboardData?.arrival?.total || 0 }}
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-slate-600 dark:text-slate-400">En attente:</span>
                  <span class="font-bold">{{ dashboardData?.arrival?.pending || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-600 dark:text-slate-400">Arrivés:</span>
                  <span class="font-bold">{{ dashboardData?.arrival?.arrived || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Departures Card -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -mr-12 -mt-12"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Départs
                </h3>
                <div class="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                  <Clock class="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div class="text-3xl font-black text-orange-600 dark:text-orange-400 mb-4">
                {{ dashboardData?.departure?.total || 0 }}
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-slate-600 dark:text-slate-400">En attente:</span>
                  <span class="font-bold">{{ dashboardData?.departure?.pending || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-600 dark:text-slate-400">Partis:</span>
                  <span class="font-bold">{{ dashboardData?.departure?.checkedOut || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Chart Section -->
      <div class="mb-10">
        <RevenueChart :dashboardData="dashboardData" :selectedRange="selectedRange" />
      </div>


        <!-- Premium Chart Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <!-- Room Status -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-8 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
                <div class="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg mr-3">
                  <Home class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                Statut des Chambres
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div 
                  v-for="(status, key) in roomStatusData" 
                  :key="key"
                  class="p-4 rounded-xl border border-slate-200/60 dark:border-slate-600/60"
                  :class="status.bgClass"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-3" :class="status.colorClass"></div>
                      <div>
                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ $t(status.label) }}</p>
                        <p class="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{{ status.count }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Maintenance Section -->
              <div class="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200/60 dark:border-red-700/60">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg mr-3">
                      <Wrench class="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span class="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                      Maintenance
                    </span>
                  </div>
                  <span class="text-2xl font-black text-yellow-800 dark:text-yellow-200">
                    {{ dashboardData?.roomStatus?.maintenance || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Suite Occupancy with Enhanced Management -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-8 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <!-- Header with Controls -->
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                  <div class="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mr-3">
                    <Star class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Occupation des Types de Chambres
                  <span class="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                    ({{ Object.keys(dashboardData?.suites || {}).length }} types)
                  </span>
                </h3>
                
                <!-- View Toggle -->
                <div class="flex items-center space-x-2">
                  <button
                    @click="suiteViewMode = 'grid'"
                    :class="[
                      'p-2 rounded-lg',
                      suiteViewMode === 'grid' 
                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                  </button>
                  <button
                    @click="suiteViewMode = 'list'"
                    :class="[
                      'p-2 rounded-lg transition-all duration-200',
                      suiteViewMode === 'list' 
                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Search Bar -->
              <div v-if="Object.keys(dashboardData?.suites || {}).length > 8" class="mb-4">
                <div class="relative">
                  <input
                    v-model="suiteSearchQuery"
                    type="text"
                    placeholder="Rechercher un type de chambre..."
                    class="w-full px-4 py-2 pl-10 text-sm bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200"
                  >
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>

              <!-- Grid View -->
              <div v-if="suiteViewMode === 'grid'" :class="[
                'grid gap-4',
                filteredSuites.length <= 4 ? 'grid-cols-1' : 
                filteredSuites.length <= 8 ? 'grid-cols-2' : 
                'grid-cols-2 lg:grid-cols-3'
              ]">
                <div 
                  v-for="(count, suiteName) in paginatedSuites" 
                  :key="suiteName"
                  class="group/item relative overflow-hidden p-4 rounded-xl border border-slate-200/60 dark:border-slate-600/60 cursor-pointer"
                  :class="getSuiteTypeClass(suiteName)"
                >
                  <div class="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-6 -mt-6"></div>
                  <div class="relative text-center space-y-2">
                    <div class="mx-auto w-fit p-2 rounded-lg" :class="getSuiteIconBg(suiteName)">
                      <component :is="getSuiteIcon(suiteName)" class="w-5 h-5" :class="getSuiteIconColor(suiteName)" />
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">{{ suiteName }}</p>
                      <p class="text-xs text-slate-600 dark:text-slate-400">occupées</p>
                    </div>
                    <div class="text-2xl font-black" :class="getSuiteTextColor(suiteName)">
                      {{ count }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- List View -->
              <div v-else class="space-y-3">
                <div 
                  v-for="(count, suiteName) in paginatedSuites" 
                  :key="suiteName"
                  class="group/item relative overflow-hidden p-4 rounded-xl border border-slate-200/60 dark:border-slate-600/60 cursor-pointer"
                  :class="getSuiteTypeClass(suiteName)"
                >
                  <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-8 -mt-8"></div>
                  <div class="relative flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="p-2 rounded-lg mr-3" :class="getSuiteIconBg(suiteName)">
                        <component :is="getSuiteIcon(suiteName)" class="w-4 h-4" :class="getSuiteIconColor(suiteName)" />
                      </div>
                      <div>
                        <p class="font-bold text-slate-900 dark:text-slate-100 text-sm">{{ suiteName }}</p>
                        <p class="text-xs text-slate-600 dark:text-slate-400">Chambres occupées</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-xl font-black" :class="getSuiteTextColor(suiteName)">
                        {{ count }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="totalSuitePages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-600/60">
                <div class="flex items-center space-x-2">
                  <button
                    @click="currentSuitePage = Math.max(1, currentSuitePage - 1)"
                    :disabled="currentSuitePage === 1"
                    class="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown class="w-4 h-4 rotate-90" />
                  </button>
                  
                  <div class="flex items-center space-x-1">
                    <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="currentSuitePage = page"
                      :class="[
                        'w-8 h-8 rounded-lg text-xs font-bold',
                        page === currentSuitePage
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                      ]"
                    >
                      {{ page }}
                    </button>
                  </div>
                  
                  <button
                    @click="currentSuitePage = Math.min(totalSuitePages, currentSuitePage + 1)"
                    :disabled="currentSuitePage === totalSuitePages"
                    class="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown class="w-4 h-4 -rotate-90" />
                  </button>
                </div>
                
                <div class="text-xs text-slate-600 dark:text-slate-400">
                  {{ (currentSuitePage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentSuitePage * itemsPerPage, filteredSuites.length) }} 
                  sur {{ filteredSuites.length }} types
                </div>
              </div>

              <!-- Empty State for Search -->
              <div v-if="filteredSuites.length === 0 && suiteSearchQuery" class="text-center py-8">
                <div class="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Aucun type de chambre trouvé pour "{{ suiteSearchQuery }}"
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Premium Housekeeping & Notifications -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <!-- Housekeeping Status -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-8 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
                <div class="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mr-3">
                  <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                État du Ménage
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="group/card relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/60 dark:border-green-700/60">
                  <div class="absolute top-0 right-0 w-12 h-12 bg-green-500/10 rounded-full -mr-6 -mt-6"></div>
                  <div class="relative text-center">
                    <div class="text-3xl font-black text-green-600 dark:text-green-400 mb-1">
                      {{ dashboardData?.housekeepingStatus?.clean || 0 }}
                    </div>
                    <p class="text-sm font-semibold text-green-700 dark:text-green-300">Propres</p>
                  </div>
                </div>
                <div class="group/card relative overflow-hidden p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200/60 dark:border-yellow-700/60">
                  <div class="absolute top-0 right-0 w-12 h-12 bg-yellow-500/10 rounded-full -mr-6 -mt-6"></div>
                  <div class="relative text-center">
                    <div class="text-3xl font-black text-yellow-600 dark:text-yellow-400 mb-1">
                      {{ dashboardData?.housekeepingStatus?.inspected || 0 }}
                    </div>
                    <p class="text-sm font-semibold text-yellow-700 dark:text-yellow-300">Inspectées</p>
                  </div>
                </div>
                <div class="group/card relative overflow-hidden p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200/60 dark:border-orange-700/60">
                  <div class="absolute top-0 right-0 w-12 h-12 bg-orange-500/10 rounded-full -mr-6 -mt-6"></div>
                  <div class="relative text-center">
                    <div class="text-3xl font-black text-orange-600 dark:text-orange-400 mb-1">
                      {{ dashboardData?.housekeepingStatus?.dirty || 0 }}
                    </div>
                    <p class="text-sm font-semibold text-orange-700 dark:text-orange-300">Sales</p>
                  </div>
                </div>
                <div class="group/card relative overflow-hidden p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200/60 dark:border-red-700/60">
                  <div class="absolute top-0 right-0 w-12 h-12 bg-red-500/10 rounded-full -mr-6 -mt-6"></div>
                  <div class="relative text-center">
                    <div class="text-3xl font-black text-red-600 dark:text-red-400 mb-1">
                      {{ dashboardData?.housekeepingStatus?.toClean || 0 }}
                    </div>
                    <p class="text-sm font-semibold text-red-700 dark:text-red-300">À nettoyer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Premium Notifications Panel -->
          <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-8 hover:shadow-2xl">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
                <div class="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg mr-3">
                  <AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                Centre de Notifications
              </h3>
              <div class="space-y-3">
                <div 
                  v-for="notification in notificationItems" 
                  :key="notification.key"
                  class="group/notif relative overflow-hidden flex items-center justify-between p-4 rounded-xl cursor-pointer"
                  :class="getNotificationClass(notification.count)"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover/notif:opacity-100 transition-opacity"></div>
                  <div class="relative flex items-center">
                    <div class="p-2 rounded-lg mr-3" :class="getNotificationIconBg(notification.count)">
                      <component :is="notification.icon" class="w-4 h-4" :class="getNotificationIconClass(notification.count)" />
                    </div>
                    <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ $t(notification.label) }}</span>
                  </div>
                  <div class="relative flex items-center">
                    <span class="px-3 py-1.5 text-xs font-black rounded-lg" :class="getNotificationBadgeClass(notification.count)">
                      {{ notification.count }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Premium Activity Feed -->
        <div class="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-8 transition-all duration-300 hover:shadow-2xl">
          <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full -mr-20 -mt-20"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mr-3">
                  <Clock class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Activité Récente
              </h3>
              <button 
                @click="loadDashboardData" 
                class="group/refresh flex items-center px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all duration-200"
              >
                <RefreshCw class="w-4 h-4 mr-2 transition-transform duration-300" :class="{ 'animate-spin': isLoading, 'group-hover/refresh:rotate-180': !isLoading }" />
                Actualiser
              </button>
            </div>
            
            <!-- Loading State -->
            <!-- <div v-if="isLoading" class="flex items-center justify-center py-16">
              <div class="relative">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                <div class="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-r-blue-400 animate-ping"></div>
              </div>
            </div> -->
            
            <!-- Activities List -->
            <div v-if="dashboardData?.activityFeeds?.length > 0" class="space-y-4">
              <div 
                v-for="activity in dashboardData.activityFeeds" 
                :key="activity.id"
                class="group/activity relative overflow-hidden flex items-center p-4 bg-white dark:bg-slate-700/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-100/80 dark:hover:bg-slate-600/80 cursor-pointer"
              >
                <div class="absolute inset-0 bg-white opacity-0 group-hover/activity:opacity-100 transition-opacity duration-300"></div>
                <div class="relative flex items-center flex-1">
                  <div class="flex-shrink-0 mr-4">
                    <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                      <User class="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{{ activity.description }}</p>
                    <div class="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400">
                      <div class="flex items-center">
                        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mr-1"></div>
                        <span class="font-medium">{{ activity.user }}</span>
                      </div>
                      <div class="flex items-center">
                        <Clock class="w-3 h-3 mr-1" />
                        <span>{{ activity.timestamp }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex-shrink-0 ml-4">
                    <span 
                      class="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm"
                      :class="getActivityTypeClass(activity.type)"
                    >
                      {{ $t(`frontOffice.dashboard.activityTypes.${activity.type}`) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-16 text-center">
              <div class="relative mb-6">
                <div class="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center shadow-xl">
                  <Clock class="w-10 h-10 text-slate-400 dark:text-slate-500" />
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Aucune activité récente
              </h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
                Les nouvelles activités apparaîtront ici en temps réel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted,nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  RefreshCw, User, FileText, Calendar, MessageSquare, AlertTriangle, 
  CheckCircle, Clock, Home, Star, Wrench, ChevronDown, DollarSign 
} from 'lucide-vue-next'
import { getFrontOfficeDashboard } from '@/services/dashboard'
import { useServiceStore } from '@/composables/serviceStore'
import RevenueChart from '@/components/frontOffice/RevenueChart.vue'
import { formatCurrency } from '@/components/utilities/UtilitiesFunction'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import Select from '@/components/forms/FormElements/Select.vue'

const { t } = useI18n()
const serviceStore = useServiceStore()

// Reactive data
const isLoading = ref(true)
const dashboardData = ref<any>(null)
const selectedRange = ref('today')
const customDate = ref(new Date().toISOString().split('T')[0])
const lastUpdate = ref<Date | null>(null)
const autoRefreshInterval = ref<NodeJS.Timeout | null>(null)

// Suite management state
const suiteViewMode = ref<'grid' | 'list'>('grid')
const suiteSearchQuery = ref('')
const currentSuitePage = ref(1)
const itemsPerPage = ref(12)



// Computed properties

const Periodes = computed(()=>[
  {value:'today' , label:t('today')},
  {value:'yesterday' , label:t('yesterday')},
  {value:'thisWeek' , label:t('thisWeek')},
  {value:'lastWeek' , label:t('lastWeek')},
  {value:'thisMonth' , label:t('thisMonth')},
  {value:'lastMonth' , label:t('lastMonth')},
  {value:'custom' , label:t('customDate')},

])
const getStartOfWeek = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  return new Date(d.setDate(diff))
}

const dateRange = computed(() => {
  const today = new Date()
  let startDate = new Date()
  let endDate = new Date()

  switch (selectedRange.value) {
    case 'today':
      startDate = today
      endDate = today
      break
    case 'yesterday':
      startDate.setDate(today.getDate() - 1)
      endDate.setDate(today.getDate() - 1)
      break
    case 'thisWeek':
      startDate = getStartOfWeek(today)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      break
    case 'lastWeek':
      const lastWeekStartDate = new Date()
      lastWeekStartDate.setDate(today.getDate() - 7)
      startDate = getStartOfWeek(lastWeekStartDate)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      break
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
    case 'lastMonth':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    case 'custom':
      startDate = new Date(customDate.value)
      endDate = new Date(customDate.value)
      break
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
})

const occupancyRate = computed(() => {
  if (!dashboardData.value?.roomStatus) return 0
  return dashboardData.value.roomStatus.occupancyRate || 0
})

const formatSelectedDate = computed(() => {
  return new Date(dateRange.value.startDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const roomStatusData = computed(() => {
  const status = dashboardData.value?.roomStatus || {}
  return {
    vacant: {
      count: status.vacant || 0,
      label: 'frontOffice.dashboard.vacant',
      colorClass: 'bg-green-500',
      bgClass: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/60 dark:border-green-700/60'
    },
    sold: {
      count: status.sold || 0,
      label: 'frontOffice.dashboard.sold',
      colorClass: 'bg-red-500',
      bgClass: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200/60 dark:border-red-700/60'
    },
    dayUse: {
      count: status.dayUse || 0,
      label: 'frontOffice.dashboard.dayUse',
      colorClass: 'bg-blue-500',
      bgClass: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/60 dark:border-blue-700/60'
    },
    complimentary: {
      count: status.complimentary || 0,
      label: 'frontOffice.dashboard.complimentary',
      colorClass: 'bg-purple-500',
      bgClass: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/60 dark:border-purple-700/60'
    }
  }
})

const notificationItems = computed(() => {
  const notifications = dashboardData.value?.notifications || {}
  return [
    { key: 'workOrder', icon: FileText, count: notifications.workOrder || 0, label: 'frontOffice.dashboard.workOrders' },
    { key: 'bookingInquiry', icon: Calendar, count: notifications.bookingInquiry || 0, label: 'frontOffice.dashboard.bookingInquiries' },
    { key: 'paymentFailed', icon: AlertTriangle, count: notifications.paymentFailed || 0, label: 'frontOffice.dashboard.paymentFailed' },
    { key: 'overbooking', icon: AlertTriangle, count: notifications.overbooking || 0, label: 'frontOffice.dashboard.overbooking' },
    { key: 'guestMessage', icon: MessageSquare, count: notifications.guestMessage || 0, label: 'frontOffice.dashboard.guestMessages' },
    { key: 'unpaidFolios', icon: FileText, count: notifications.unpaidFolios || 0, label: 'frontOffice.dashboard.unpaidFolios' },
    { key: 'tasks', icon: CheckCircle, count: notifications.tasks || 0, label: 'frontOffice.dashboard.tasks' },
    { key: 'review', icon: Star, count: notifications.review || 0, label: 'frontOffice.dashboard.reviews' }
  ]
})

// Suite management computed properties
const filteredSuites = computed(() => {
  const suites = dashboardData.value?.suites || {}
  if (!suiteSearchQuery.value.trim()) {
    return suites
  }
  
  const query = suiteSearchQuery.value.toLowerCase().trim()
  const filtered : any = {}
  
  Object.entries(suites).forEach(([suiteName, count]) => {
    if (suiteName.toLowerCase().includes(query)) {
      filtered[suiteName] = count
    }
  })
  
  return filtered
})

const totalSuitePages = computed(() => {
  return Math.ceil(Object.keys(filteredSuites.value).length / itemsPerPage.value)
})

const paginatedSuites = computed(() => {
  const suites = filteredSuites.value
  const entries = Object.entries(suites)
  const startIndex = (currentSuitePage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  
  const paginatedEntries = entries.slice(startIndex, endIndex)
  const result : any = {}
  
  paginatedEntries.forEach(([suiteName, count]) => {
    result[suiteName] = count
  })
  
  return result
})

const visiblePages = computed(() => {
  const total = totalSuitePages.value
  const current = currentSuitePage.value
  const pages :any[] = []
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 2) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2)
    }
  }
  
  return pages
})

// Methods
// const loadDashboardData = async () => {
//   try {
//     isLoading.value = true
//     const hotelId = serviceStore.serviceId
//     if (!hotelId) {
//       console.warn("Aucun hotelId trouvé")
//       return
//     }

//     const params = {
//       startDate: dateRange.value.startDate,
//       endDate: dateRange.value.endDate,
//     }

//     console.log('Loading dashboard with params:', params)
//     const response = await getFrontOfficeDashboard(hotelId, params)
//     console.log('Dashboard response:', response)
    
//     if (response.success) {
//       dashboardData.value = response.data
//     } else {
//       console.error('Erreur:', response.message)
//       dashboardData.value = null
//     }
//     lastUpdate.value = new Date()
//   } catch (error) {
//     console.error("Erreur lors du chargement du dashboard:", error)
//     dashboardData.value = null
//   } finally {
//     isLoading.value = false
//   }
// }
// Dans votre composant Vue.js, corrigez la méthode loadDashboardData

const loadDashboardData = async () => {
  try {
    isLoading.value = true
    const hotelId = serviceStore.serviceId
    if (!hotelId) {
      console.warn("Aucun hotelId trouvé")
      return
    }

    // CORRECTION: Utiliser dateRange computed property qui calcule les bonnes dates
    const params = {
      range: selectedRange.value,  // Ajouter le range
      date: selectedRange.value === 'custom' ? customDate.value : undefined,
      startDate: dateRange.value.startDate,  // Utiliser les dates calculées
      endDate: dateRange.value.endDate
    }

    console.log('Loading dashboard with params:', params)
    console.log('Selected range:', selectedRange.value)
    console.log('Date range computed:', dateRange.value)
    
    const response = await getFrontOfficeDashboard(hotelId, params)
    console.log('Dashboard response:', response)
    
    if (response.success) {
      dashboardData.value = response.data
    } else {
      console.error('Erreur:', response.message)
      dashboardData.value = null
    }
    lastUpdate.value = new Date()
  } catch (error) {
    console.error("Erreur lors du chargement du dashboard:", error)
    dashboardData.value = null
  } finally {
    isLoading.value = false
  }
}

// Aussi, assurez-vous que handleDateRangeChange déclenche bien le rechargement
const handleDateRangeChange = () => {
  console.log('Date range changed to:', selectedRange.value)
  console.log('New date range will be:', dateRange.value)
  // Forcer le recalcul des dates
  nextTick(() => {
    loadDashboardData()
  })
}

// const handleDateRangeChange = () => {
//   console.log('Date range changed to:', selectedRange.value)
//   loadDashboardData()
// }




// Enhanced styling methods
const getSuiteTypeClass = (suiteName: any) => {
  if (suiteName.toLowerCase().includes('home')) {
    return 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/60 dark:border-blue-700/60'
  }
  if (suiteName.toLowerCase().includes('lifestyle')) {
    return 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/60 dark:border-purple-700/60'
  }
  return 'bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-slate-200/60 dark:border-slate-700/60'
}

const getSuiteIcon = (suiteName: any) => {
  if (suiteName.toLowerCase().includes('home')) return Home
  if (suiteName.toLowerCase().includes('lifestyle')) return Star
  return Home
}

const getSuiteIconColor = (suiteName: any) => {
  if (suiteName.toLowerCase().includes('home')) return 'text-blue-600 dark:text-blue-400'
  if (suiteName.toLowerCase().includes('lifestyle')) return 'text-purple-600 dark:text-purple-400'
  return 'text-slate-600 dark:text-slate-400'
}

const getSuiteIconBg = (suiteName: any) => {
  if (suiteName.toLowerCase().includes('home')) return 'bg-blue-100 dark:bg-blue-900/40'
  if (suiteName.toLowerCase().includes('lifestyle')) return 'bg-purple-100 dark:bg-purple-900/40'
  return 'bg-slate-100 dark:bg-slate-900/40'
}

const getSuiteTextColor = (suiteName: any) => {
  if (suiteName.toLowerCase().includes('home')) return 'text-blue-600 dark:text-blue-400'
  if (suiteName.toLowerCase().includes('lifestyle')) return 'text-purple-600 dark:text-purple-400'
  return 'text-slate-600 dark:text-slate-400'
}

const getOccupancyColor = (rate: number, isBg = false) => {
  if (rate >= 90) return isBg ? 'bg-gradient-to-r from-red-500 to-red-600' : 'text-red-600 dark:text-red-400'
  if (rate >= 70) return isBg ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'text-yellow-600 dark:text-yellow-400'
  return isBg ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'text-green-600 dark:text-green-400'
}

const getAlertClass = (type: string) => {
  switch (type) {
    case 'critical': return 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
    case 'warning': return 'bg-gradient-to-r from-yellow-100 to-orange-50 dark:from-yellow-900/30 dark:to-orange-800/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700'
    case 'info': return 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
    default: return 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/30 dark:to-slate-800/20 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
  }
}

const getNotificationClass = (count: number) => {
  return count > 0 
    ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/60 dark:border-red-700/60' 
    : 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-600/60'
}

const getNotificationIconClass = (count: number) => {
  return count > 0 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-slate-600 dark:text-slate-400'
}

const getNotificationIconBg = (count: number) => {
  return count > 0 
    ? 'bg-red-100 dark:bg-red-900/40' 
    : 'bg-slate-100 dark:bg-slate-700'
}

const getNotificationBadgeClass = (count: number) => {
  return count > 0 
    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' 
    : 'bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 text-slate-600 dark:text-slate-300'
}

const getActivityTypeClass = (type: string) => {
  const classes : any = {
    'arrival': 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700',
    'departure': 'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-700',
    'booking': 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700',
    'modification': 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700',
    'cancellation': 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700',
    'payment': 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700',
    'maintenance': 'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/40 dark:to-gray-900/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
    'housekeeping': 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700',
    'communication': 'bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 text-pink-800 dark:text-pink-200 border border-pink-200 dark:border-pink-700',
    'system': 'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/40 dark:to-gray-900/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
  }
  return classes[type] || classes['system']
}

// Auto-refresh setup
const startAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
  }
  
  autoRefreshInterval.value = setInterval(() => {
    if (!isLoading.value) {
      loadDashboardData()
    }
  }, 30000)
}

const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
    autoRefreshInterval.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
  startAutoRefresh()
})

// Watch for date changes to trigger data reload
watch([selectedRange, customDate], () => {
  console.log('Date filters changed:', { selectedRange: selectedRange.value, customDate: customDate.value })
  loadDashboardData()
}, { deep: true })

// Reset pagination when search changes
watch(suiteSearchQuery, () => {
  currentSuitePage.value = 1
})

// Auto-adjust view mode based on number of items
watch(filteredSuites, (newSuites) => {
  const count = Object.keys(newSuites).length
  if (count > 12 && suiteViewMode.value === 'grid') {
    suiteViewMode.value = 'list'
  }
  if (suiteViewMode.value === 'grid') {
    itemsPerPage.value = 12
  } else {
    itemsPerPage.value = 10
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})



</script>

<style scoped>
.hover\:scale-102:hover {
  transform: scale(1.02);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slideInUp 0.3s ease-out;
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.shadow-blue-500\/25 {
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
}

.shadow-blue-500\/40 {
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4), 0 4px 6px -2px rgba(59, 130, 246, 0.2);
}

.shadow-red-500\/25 {
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.25), 0 4px 6px -2px rgba(239, 68, 68, 0.1);
}

.shadow-red-500\/10 {
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05);
}
</style>