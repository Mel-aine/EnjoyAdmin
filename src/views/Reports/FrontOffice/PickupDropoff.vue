<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.pickupDropoffDetails.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('reports.frontOffice.pickupDropoffDetails.description') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('common.filters') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Pick/Drop From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.frontOffice.pickupDropoffDetails.pickDropFrom') }}
            </label>
            <InputDatepicker
              v-model="filters.dateFrom"
              :placeholder="t('common.from')"
              class="w-full"
              @update:modelValue="updateDateFilter('startDate', $event)"
            />
          </div>

          <!-- To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.dateTo') }}
            </label>
            <InputDatepicker
              v-model="filters.dateTo"
              :placeholder="t('common.to')"
              class="w-full"
              @update:modelValue="updateDateFilter('endDate', $event)"
            />
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.type') }}
            </label>
            <SelectComponent
              v-model="filters.type"
              :options="typeOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-5 pt-5 border-t border-gray-200">
          <!-- Bouton d'export avec menu déroulant -->
          <div class="relative">
            <button
              @click="toggleExportMenu"
              :disabled="exportLoading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <svg
                v-if="exportLoading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span v-if="!exportLoading">{{ t('common.export') }}</span>
              <svg
                v-if="!exportLoading"
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <!-- Menu déroulant Export -->
            <div
              v-if="exportMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
            >
              <!--           <button
                @click="exportCSV"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {{ t('common.csv') }}
              </button> -->
              <button
                @click="exportPDF"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg
                  class="w-4 h-4 mr-2 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                {{ t('common.pdf') }}
              </button>
              <!--               <button
                @click="exportExcel"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ t('common.excel') }}
              </button> -->
            </div>
          </div>

          <!-- Bouton Report -->
          <button
            @click="generateReport"
            :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ t('common.report') }}
          </button>

          <!-- Bouton Reset -->
          <button
            @click="resetForm"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ t('common.reset') }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <!-- Skeleton En-tête -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            </div>
            <div class="space-y-2 text-right">
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div class="flex gap-4 mt-4">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-40"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-40"></div>
          </div>
        </div>

        <!-- Skeleton Tableau Pickup -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 bg-blue-50 dark:bg-blue-900/20">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800"></div>
              <div class="h-4 bg-blue-200 dark:bg-blue-800 rounded w-24"></div>
            </div>
            <div class="h-6 bg-blue-200 dark:bg-blue-800 rounded-full w-20"></div>
          </div>
          <!-- Thead -->
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex gap-4">
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-6"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-28"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
          </div>
          <!-- Rows -->
          <div
            v-for="i in 4"
            :key="i"
            class="px-4 py-3 flex gap-4 border-b border-gray-100 dark:border-gray-700"
          >
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>

        <!-- Skeleton Tableau Dropoff -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 bg-red-50 dark:bg-red-900/20">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800"></div>
              <div class="h-4 bg-red-200 dark:bg-red-800 rounded w-24"></div>
            </div>
            <div class="h-6 bg-red-200 dark:bg-red-800 rounded-full w-20"></div>
          </div>
          <!-- Thead -->
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex gap-4">
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-6"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-28"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
          </div>
          <!-- Rows -->
          <div
            v-for="i in 4"
            :key="i"
            class="px-4 py-3 flex gap-4 border-b border-gray-100 dark:border-gray-700"
          >
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
      >
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="space-y-6 mb-6">
        <!-- En-tête du rapport -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400">
                {{ reportData?.title || t('reports.frontOffice.pickupDropoffDetails.title') }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{
                  t('reports.frontOffice.pickupDropoffDetails.pickDropDateRange', {
                    from: filters.dateFrom,
                    to: filters.dateTo,
                  })
                }}
              </p>
            </div>
            <div class="text-right text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>
                {{ t('reports.generatedAt') }}:
                {{ reportData?.generatedAt ? formatDate(reportData.generatedAt) : '' }}
              </p>
              <p>
                {{ t('reports.frontOffice.pickupDropoffDetails.by') }}:
                {{ reportData?.generatedBy || '' }}
              </p>
            </div>
          </div>

          <!-- Badges résumé -->
          <div class="flex gap-4 mt-4">
            <div
              v-if="reportData?.data?.pickup"
              class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full"
            >
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <span class="text-sm font-medium text-blue-700 dark:text-blue-300">
                {{ t('reports.frontOffice.pickupDropoffDetails.pickup') }} :
                {{ reportData.data.pickup.totalGuests }}
                {{ t('reports.frontOffice.pickupDropoffDetails.totalGuests') }}
              </span>
            </div>
            <div
              v-if="reportData?.data?.dropoff"
              class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full"
            >
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              <span class="text-sm font-medium text-red-700 dark:text-red-300">
                {{ t('reports.frontOffice.pickupDropoffDetails.dropoff') }} :
                {{ reportData.data.dropoff.totalGuests }}
                {{ t('reports.frontOffice.pickupDropoffDetails.totalGuests') }}
              </span>
            </div>
          </div>
        </div>


        <!-- Fallback si pas de HTML -->
        <div  class=" space-y-6">
          <!-- Pickup Section -->
          <div
            v-if="reportData?.data?.pickup"
            class="bg-white dark:bg-gray-800 rounded-lg  overflow-hidden shadow-sm"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-blue-600 dark:text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </div>
                <h4 class="font-semibold text-blue-800 dark:text-blue-200 text-base">
                  {{ t('reports.frontOffice.pickupDropoffDetails.pickup') }}
                </h4>
              </div>
              <span
                class="text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full"
              >
                {{ reportData.data.pickup.totalGuests }}
                {{ t('reports.frontOffice.pickupDropoffDetails.totalGuests') }}
              </span>
            </div>

            <!-- Tableau Pickup -->
            <div
              v-if="reportData.data.pickup.list.length === 0"
              class="text-gray-500 dark:text-gray-400 text-center py-10"
            >
              <svg
                class="w-10 h-10 mx-auto mb-2 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {{ t('reports.frontOffice.pickupDropoffDetails.noPickupData') }}
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700 text-left">
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      #
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.date') }}/{{ t('common.time') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.guestName') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.roomNumber') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.mode') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.vehicle') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.description') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr
                    v-for="(item, index) in reportData.data.pickup.list"
                    :key="'pickup-' + index"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td class="px-4 py-3 text-gray-400 dark:text-gray-500 font-mono text-xs">
                      {{ Number(index) + 1 }}
                    </td>
                    <td
                      class="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap font-medium"
                    >
                      {{ item.pickDropDateTime }}
                    </td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white">{{ item.guestName }}</td>
                    <td class="px-4 py-3">
                      <span
                        class="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded text-xs font-mono"
                      >
                        {{ item.roomNo }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ item.mode }}</td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ item.vehicle || '—' }}
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ item.description || '—' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Dropoff Section -->
          <div
            v-if="reportData?.data?.dropoff"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-red-600 dark:text-red-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <h4 class="font-semibold text-red-800 dark:text-red-200 text-base">
                  {{ t('reports.frontOffice.pickupDropoffDetails.dropoff') }}
                </h4>
              </div>
              <span
                class="text-xs font-medium bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1 rounded-full"
              >
                {{ reportData.data.dropoff.totalGuests }}
                {{ t('reports.frontOffice.pickupDropoffDetails.totalGuests') }}
              </span>
            </div>

            <!-- Tableau Dropoff -->
            <div
              v-if="reportData.data.dropoff.list.length === 0"
              class="text-gray-500 dark:text-gray-400 text-center py-10"
            >
              <svg
                class="w-10 h-10 mx-auto mb-2 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {{ t('reports.frontOffice.pickupDropoffDetails.noDropoffData') }}
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700 text-left">
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      #
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.date') }}/{{ t('common.time') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.guestName') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.roomNumber') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.mode') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.vehicle') }}
                    </th>
                    <th
                      class="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {{ t('common.description') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr
                    v-for="(item, index) in reportData.data.dropoff.list"
                    :key="'dropoff-' + index"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td class="px-4 py-3 text-gray-400 dark:text-gray-500 font-mono text-xs">
                      {{ Number(index) + 1 }}
                    </td>
                    <td
                      class="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap font-medium"
                    >
                      {{ item.pickDropDateTime }}
                    </td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white">{{ item.guestName }}</td>
                    <td class="px-4 py-3">
                      <span
                        class="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded text-xs font-mono"
                      >
                        {{ item.roomNo }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ item.mode }}</td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ item.vehicle || '—' }}
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ item.description || '—' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { generatePickupDropoff, exportData, type PickupDropoffFilters } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useToast } from 'vue-toastification'

const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

interface FilterOptions {
  value: string
  label: string
}

interface Filters {
  dateFrom: string
  dateTo: string
  type: string
}

interface PickupDropoffItem {
  hotelName: string
  startDate: string
  endDate: string
  pickDropDateTime: string
  guestName: string
  roomNo: string
  mode: string
  vehicle: string
  description: string
}

interface ReportData {
  title: string
  html: string
  generatedAt: string
  generatedBy: string
  data?: {
    pickup?: {
      list: PickupDropoffItem[]
      totalGuests: number
    }
    dropoff?: {
      list: PickupDropoffItem[]
      totalGuests: number
    }
  }
}

// Définition des dates par défaut
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

const todayFormatted = today.toISOString().split('T')[0]
const yesterdayFormatted = yesterday.toISOString().split('T')[0]
const toast = useToast()
// Reactive data
const showResults = ref<boolean>(false)
const loading = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const exportMenuOpen = ref<boolean>(false)
const error = ref<string>('')
const reportData = ref<any | null>(null)
const Data = ref<any[]>([])
const pdfUrl = ref('')
const idHotel = serviceStore.serviceId

// Filtres pour l'interface utilisateur avec les valeurs par défaut
const filters = ref<Filters>({
  dateFrom: yesterdayFormatted, // Date de la veille
  dateTo: todayFormatted, // Date du jour
  type: 'Both', // Both par défaut
})

// Filtres pour l'API - correspond aux données attendues par le backend
const apiFilters = ref<PickupDropoffFilters>({
  startDate: yesterdayFormatted, // Date de la veille
  endDate: todayFormatted, // Date du jour
  type: 'Both', // Both par défaut
  hotelId: idHotel !== null ? idHotel : 0,
})

// Options pour les sélecteurs - correspondent aux valeurs attendues par le backend
const typeOptions = computed<FilterOptions[]>(() => [
  { value: 'Pickup', label: t('reports.frontOffice.pickupDropoffDetails.pickup') },
  { value: 'Dropoff', label: t('reports.frontOffice.pickupDropoffDetails.dropoff') },
  { value: 'Both', label: t('reports.frontOffice.pickupDropoffDetails.both') },
])

// Computed
const reportTitle = computed(() => {
  return reportData.value?.title || t('reports.frontOffice.pickupDropoffDetails.title')
})

// Watchers
watch(
  filters,
  (newFilters) => {
    // Mapper les filtres UI vers les filtres API
    apiFilters.value = {
      ...apiFilters.value,
      startDate: newFilters.dateFrom || '',
      endDate: newFilters.dateTo || '',
      type: newFilters.type,
    }
  },
  { deep: true },
)

// Methods
const updateDateFilter = (field: 'startDate' | 'endDate', value: string) => {
  if (value) {
    const date = new Date(value)
    apiFilters.value[field] = date.toISOString().split('T')[0]
  } else {
    apiFilters.value[field] = ''
  }
}

const generateReport = async () => {
  if (!filters.value.dateFrom || !filters.value.dateTo || !filters.value.type) {
    error.value = t('validation.fillRequiredFields')
    return
  }

  loading.value = true
  error.value = ''
  showResults.value = false

  try {
    console.log('Generating pickup/dropoff report with filters:', apiFilters.value)
    const response = await generatePickupDropoff(apiFilters.value)
    console.log('Report Data:', response)

    if (response && response.success && response.data) {
      reportData.value = {
        ...response,
        data: response.data,
      }

      showResults.value = true
    }
  } catch (err) {
    // error.value = err instanceof Error ? err.message : t('errors.generatingReport')
    toast.error(t('errors.generatingReport'))
    console.error('Report generation error:', err)
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV avec filtres:', apiFilters.value)
    const result = await exportData('csv', 'pickupDropoff', 'pickup-dropoff', apiFilters.value)
    console.log('Résultat export CSV:', result)
  } catch (error) {
    console.error('Erreur détaillée CSV:', error)
  } finally {
    exportLoading.value = false
  }
}

const exportPDF = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    // Clear previous PDF URL
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    console.log('Export PDF avec filtres:', apiFilters.value)
    const result = await exportData('pdf', 'pickupDropoff', 'pickup-dropoff', apiFilters.value)
    pdfUrl.value = result?.fileUrl || ''
    openPDFInNewPage()
    console.log('Résultat export PDF:', result)
  } catch (error) {
    toast.error(t('errors.generatingReport'))
    console.error('Erreur détaillée PDF:', error)
  } finally {
    exportLoading.value = false
  }
}

const exportExcel = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export Excel avec filtres:', apiFilters.value)
    const result = await exportData('excel', 'pickupDropoff', 'pickup-dropoff', apiFilters.value)
    console.log('Résultat export Excel:', result)
  } catch (error) {
    console.error('Erreur détaillée Excel:', error)
  } finally {
    exportLoading.value = false
  }
}

const openPDFInNewPage = () => {
  if (pdfUrl.value) {
    const encodedUrl = btoa(encodeURIComponent(pdfUrl.value))
    const routeData = router.resolve({
      name: 'PDFViewer',
      query: {
        url: encodedUrl,
        title: reportTitle.value,
      },
    })
    window.open(routeData.href, '_blank')
  }
}



const formatDate = (dateString: string): string => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return dateString
  }
}

const resetForm = (): void => {
  filters.value = {
    dateFrom: yesterdayFormatted, // Réinitialiser à la veille
    dateTo: todayFormatted, // Réinitialiser au jour actuel
    type: 'Both', // Réinitialiser à Both
  }
  showResults.value = false
  reportData.value = null
  error.value = ''
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
}

// Fermer le menu d'export en cliquant à l'extérieur
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    exportMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }

  .flex-wrap {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .min-width-150,
  .min-width-120,
  .min-width-80,
  .min-width-100 {
    min-width: auto;
    width: 100%;
  }

  .flex-col > div {
    width: 100%;
  }

  .flex-col > div + div {
    margin-top: 1rem;
  }
}

/* Styles pour le contenu HTML du rapport */
:deep .report-html-container {
  width: 100%;
}

:deep .report-html-container table {
  width: 100%;
  border-collapse: collapse;
}

:deep .report-html-container th,
:deep .report-html-container td {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
}

:deep .report-html-container .report-container {
  margin: 0;
  box-shadow: none;
  border-radius: 0;
}

:deep .report-html-container .results-table {
  font-size: 12px;
}

/* Adaptation pour le mode sombre */
.dark :deep .report-html-container {
  color: #e5e7eb;
}

.dark :deep .report-html-container .report-container {
  background-color: transparent;
}

.dark :deep .report-html-container th,
.dark :deep .report-html-container td {
  border-color: #4b5563;
  color: #e5e7eb;
}

/* Styles pour les boutons d'export */
.export-button {
  transition: all 0.2s ease-in-out;
}

.export-button:hover {
  transform: translateY(-1px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.export-button:active {
  transform: translateY(0);
}

/* Animation pour le menu déroulant */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
