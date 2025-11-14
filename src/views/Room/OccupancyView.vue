<template>
<!-- @reference tailwindcss -->
  <AdminLayout>
    <div class="min-h-full bg-gray-50 dark:bg-gray-800">
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="px-2 sm:px-4 lg:px-6">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ $t('OccupancyofRooms') }}</h1>
              <div class="ml-4 px-3 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-sm rounded-full">
                {{ roomStats.total }} {{ $t('Rooms') }}
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center space-x-3">
              <!-- View Mode Toggle -->
              <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  @click="viewMode = 'grid'"
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                  ]"
                >
                  <svg
                    class="w-4 h-4 mr-1 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  {{ $t('Grid') }}
                </button>
                <button
                  @click="viewMode = 'list'"
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                  ]"
                >
                  <svg
                    class="w-4 h-4 mr-1 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  {{ $t('List') }}
                </button>
                <button
                  @click="viewMode = 'status'"
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                    viewMode === 'status'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                  ]"
                >
                  <svg
                    class="w-4 h-4 mr-1 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V17m0-10a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2"
                    />
                  </svg>
                  {{ $t('Status') }}
                </button>
              </div>

              <button
                @click="refreshRooms"
                :disabled="isLoading"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {{ $t('refresh') }}
              </button>

              <button
                @click="exportData"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {{ $t('export') }}
              </button>

              <button
                @click="openAuditTrail"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:border-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {{ $t('audit_trial') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Status View -->
        <div v-if="viewMode === 'status'" class="px-4 sm:px-6 lg:px-8 py-6">
          <!-- Stats Dashboard -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ roomStats.available }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-300">{{ $t('Available') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ roomStats.occupied }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-300">{{ $t('Occupied') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div
                      class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
                    >
                      <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ roomStats.cleaning }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-300">{{ $t('Cleaning') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div
                      class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
                    >
                      <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ roomStats.maintenance }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-300">{{ $t('Maintenance') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ roomStats.out_of_order }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-300">{{ $t('statut.outOfOrder') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status View Table -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                {{ $t('House Status View') }}
              </h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {{ $t('Room Types') }}
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        <div class="flex items-center justify-center">
                          <div class="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                          {{ $t('No Status') }}
                        </div>
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        <div class="flex items-center justify-center">
                          <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          {{ $t('Available') }}
                        </div>
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        <div class="flex items-center justify-center">
                          <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          {{ $t('Occupied') }}
                        </div>
                      </th>
                       <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        <div class="flex items-center justify-center">
                          <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          {{ $t('Cleaning') }}
                        </div>
                      </th>
                       <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        <div class="flex items-center justify-center">
                          <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                          {{ $t('Dirty') }}
                        </div>
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        <div class="flex items-center justify-center">
                          <div class="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                          {{ $t('Out Of Order') }}
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <template v-for="roomType in roomTypeStats" :key="roomType.id">
                      <!-- Room Type Row -->
                      <tr
                        class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        @click="toggleRoomType(roomType.id)"
                      >
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          <div class="flex items-center">
                            <svg
                              class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                              :class="{ 'rotate-90': expandedRoomTypes.has(roomType.id) }"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            {{ roomType.name }}
                            <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              ({{ roomType.totalRooms }} {{ roomType.totalRooms > 1 ? $t('Rooms') : $t('Room') }})
                            </span>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                          {{ roomType.noStatus }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                          {{ roomType.available }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                          {{ roomType.occupied }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                          {{ roomType.cleaning }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                          {{ roomType.dirty }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                          {{ roomType.outOfOrder }}
                        </td>
                      </tr>

                      <!-- Expanded Room Details Row -->
                      <tr v-if="expandedRoomTypes.has(roomType.id)" class="bg-gray-50 dark:bg-gray-900">
                        <td></td>
                        <!-- No Status Rooms -->
                        <td class="px-2 py-2 space-y-1">

                          <div
                            v-for="room in getRoomsByStatus(roomType.rooms, 'nostatus')"
                            :key="room.id"
                            class="p-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-800 dark:text-gray-100 text-center"
                          >
                            {{ room.roomNumber }}
                          </div>
                        </td>
                        <!-- Available Rooms -->
                        <td class="px-2 py-2 space-y-1">
                          <div
                            v-for="room in getRoomsByStatus(roomType.rooms, 'available')"
                            :key="room.id"
                            class="p-2 border flex items-center justify-between border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900 rounded-lg text-xs text-green-800 dark:text-green-100 text-center hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                          >
                            <span class="font-medium text-sm text-green-800 dark:text-green-100">{{ room.roomNumber }}</span>
                            <div class="text-right">
                            <div v-if="room.floorNumber" class="text-xs text-green-500 dark:text-green-400">
                              {{ $t('Floor') }} {{ room.floorNumber }}
                            </div>
                            </div>
                          </div>
                        </td>
                        <!-- Occupied Rooms -->
                        <td class="px-2 py-2 space-y-1">
                          <div
                            v-for="room in getRoomsByStatus(roomType.rooms, 'occupied')"
                            :key="room.id"
                            class="p-2 border flex items-center justify-between border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 rounded-lg text-xs text-red-800 dark:text-red-100 text-center hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                          >
                            <span class="font-medium text-sm text-red-800 dark:text-red-100">{{ room.roomNumber }}</span>
                            <div class="text-right">
                            <div v-if="room.floorNumber" class="text-xs text-red-500 dark:text-red-400">
                              {{ $t('Floor') }} {{ room.floorNumber }}
                            </div>
                            </div>
                          </div>
                        </td>
                        <!-- Cleaning Rooms -->
                        <td class="px-2 py-2 space-y-1">
                          <div
                            v-for="room in getRoomsByStatus(roomType.rooms, 'cleaning')"
                            :key="room.id"
                            class="p-2 border flex items-center justify-between border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900 rounded-lg text-xs text-purple-800 dark:text-purple-100 text-center hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                          >
                            <span class="font-medium text-sm text-purple-800 dark:text-purple-100">{{ room.roomNumber }}</span>
                            <div class="text-right">
                            <div v-if="room.floorNumber" class="text-xs text-purple-500 dark:text-purple-400">
                              {{ $t('Floor') }} {{ room.floorNumber }}
                            </div>
                            </div>
                          </div>
                        </td>
                        <!-- Dirty Rooms -->
                        <td class="px-2 py-2 space-y-1">
                          <div
                            v-for="room in getRoomsByStatus(roomType.rooms, 'dirty')"
                            :key="room.id"
                            class="p-2 border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900 rounded-lg text-xs text-orange-800 dark:text-orange-100 text-center flex items-center justify-between hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors"
                          >
                            <span class="font-medium text-sm text-orange-800 dark:text-orange-100">{{ room.roomNumber }}</span>
                            <div class="text-right">
                            <div v-if="room.floorNumber" class="text-xs text-orange-500 dark:text-orange-400">
                              {{ $t('Floor') }} {{ room.floorNumber }}
                            </div>
                            </div>
                          </div>
                        </td>
                        <!-- Out of Order Rooms -->
                        <td class="px-2 py-2 space-y-1">
                          <div
                            v-for="room in getRoomsByStatus(roomType.rooms, 'maintenance')"
                            :key="room.id"
                            class="p-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-800 dark:text-gray-100 text-center flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span class="font-medium text-sm text-gray-800 dark:text-gray-100">{{ room.roomNumber }}</span>
                            <div v-if="room.maintenanceNotes" class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-20" :title="room.maintenanceNotes">
                              {{ room.maintenanceNotes }}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>

                    <!-- Total Row -->
                    <tr class="bg-gray-100 dark:bg-gray-900 font-semibold border-t-2 border-gray-300 dark:border-gray-700">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                        {{ $t('Total') }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-bold">
                        {{ totalStats.noStatus }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-bold">
                        {{ totalStats.available }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-bold">
                        {{ totalStats.occupied }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-bold">
                        {{ totalStats.cleaning }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-bold">
                        {{ totalStats.dirty }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-bold">
                        {{ totalStats.outOfOrder }}
                      </td>
                    </tr>
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search (for Grid and List views) -->
        <div v-if="viewMode !== 'status'" class="px-4 sm:px-6 lg:px-8">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
              >
                <div class="flex items-center space-x-3">
                  <!-- Search -->
                  <div class="relative w-[500px]">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <svg
                        class="h-5 w-5 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="searchQuery"
                      type="text"
                      :placeholder="$t('search...')"
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>

                  <!-- Status Filter -->
                  <select
                    v-model="statusFilter"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  >
                    <option value="">{{ $t('All_statuses') }}</option>
                    <option value="available">{{ $t('Available') }}</option>
                    <option value="occupied">{{ $t('Occupied') }}</option>
                    <option value="out_of_order">{{ $t('statut.outOfOrder') }}</option>
                    <option value="dirty">{{ $t('Dirty') }}</option>
                    <option value="maintenance">{{ $t('Maintenance') }}</option>
                  </select>

                  <!-- Room Type Filter -->
                  <select
                    v-model="roomTypeFilter"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  >
                    <option value="">{{ $t('All_room_types') }}</option>
                    <option v-for="type in roomTypeData" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                </div>

                <div class="flex items-center space-x-3">
                  <!-- Items per page -->
                  <select
                    v-model="itemsPerPage"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  >
                    <option value="12">12 {{ $t('per_page') }}</option>
                    <option value="24">24 {{ $t('per_page') }}</option>
                    <option value="48">48 {{ $t('per_page') }}</option>
                    <option value="96">96 {{ $t('per_page') }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div class="p-6">
              <div class="animate-pulse">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div v-for="n in 6" :key="n" class="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Room Grid View -->
          <div v-if="viewMode === 'grid'" class="mt-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <RoomCard
                v-for="room in paginatedRooms"
                :key="room.id"
                :room="room"
                :isCheckingIn="isCheckingIn"
                :isCheckingOut="isCheckingOut"
                @request-status-change="handleQuickStatusChange(room, $event)"
                @change="handleStatusChange"
                @maintenance-set="handleMaintenance(room, $event)"
                @status-change="handleQuickStatusChange"
              />
            </div>
          </div>

          <!-- Room Table View -->
          <div v-if="viewMode === 'list'" class="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <ReusableTable
              :title="$t('RoomOccupancy')"
              :data="processedTableData"
              :columns="tableColumns"
              :loading="isLoading"
              :searchable="false"
              :selectable="false"
              :showHeader="true"
              @action="onTableAction"
            />
          </div>

          <!-- Pagination -->
          <div
            v-if="filteredRooms.length > 0"
            class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 mt-6 rounded-lg shadow"
          >
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="currentPage > 1 && currentPage--"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('Previous') }}
              </button>
              <button
                @click="currentPage < totalPages && currentPage++"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('Next') }}
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ $t('showing') }}
                  <span class="font-medium">{{ startIndex + 1 }}</span>
                  {{ $t('to') }}
                  <span class="font-medium">{{ Math.min(endIndex, filteredRooms.length) }}</span>
                  {{ $t('of') }}
                  <span class="font-medium">{{ filteredRooms.length }}</span>
                  {{ $t('results') }}
                </p>
              </div>
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  :aria-label="$t('common.pagination')"
                >
                  <button
                    @click="currentPage > 1 && currentPage--"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">{{ $t('common.previous') }}</span>
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentPage
                        ? 'z-10 bg-purple-50 dark:bg-purple-900 border-purple-500 dark:border-purple-600 text-purple-600 dark:text-purple-300'
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                    ]"
                  >
                    {{ page }}
                  </button>

                  <button
                    @click="currentPage < totalPages && currentPage++"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">{{ $t('common.next') }}</span>
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Change Modal -->
    <StatusChangeModal
      v-if="showStatusModal"
      :room="selectedRoom"
      :currentStatus="selectedRoom?.status"
      @updateStatus="confirmStatusChange"
      @close="showStatusModal = false"
    />
    <!-- Modal de maintenance -->
    <div
      v-if="showMaintenanceModal"
      class="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full bg-black/25 bg-opacity-50 flex items-center justify-center modal z-99999"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4 dark:text-gray-100">{{ $t('maintenanceSetup') }}</h3>
        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ $t('reason') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="maintenanceForm.reason"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
              required
            >
              <option value="">{{ $t('selectReason') }}</option>
              <option value="plumbing">{{ $t('reasons.plumbing') }}</option>
              <option value="electrical">{{ $t('reasons.electrical') }}</option>
              <option value="deepCleaning">{{ $t('reasons.deepCleaning') }}</option>
              <option value="renovation">{{ $t('reasons.renovation') }}</option>
              <option value="other">{{ $t('reasons.other') }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('startDate') }}
              </label>
              <input
                v-model="maintenanceForm.startDate"
                type="date"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('endDate') }}
              </label>
              <input
                v-model="maintenanceForm.endDate"
                type="date"
                :min="maintenanceForm.startDate"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
              />
            </div>
            <p class="text-red-500 text-sm font-normal whitespace-nowrap">{{ error }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ $t('notes') }}
            </label>
            <textarea
              v-model="maintenanceForm.notes"
              class="p-2 dark:bg-dark-900 min-h-[88px] w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
              rows="3"
              :placeholder="$t('additionalNotes')"
            ></textarea>
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button
            @click="showMaintenanceModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {{ $t('Cancel') }}
          </button>
          <button
            @click="confirmMaintenance"
            class="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!maintenanceForm.reason.trim()"
          >
            <span v-if="!isLoading">{{ $t('confirm') }}</span>
            <span v-else class="flex items-center gap-2">
              <Spinner class="w-4 h-4" />
              {{ $t('Processing') }}...
            </span>
          </button>
        </div>
      </div>
    </div>

    <PopupModal
      v-if="showMessage"
      :title="$t('warning')"
      :message="popupMessage"
      :isOpen="showMessage"
      @close="closeModal"
    >
      <template #footer>
        <button
          class="text-sm bg-gray-300 px-3 py-2 rounded-md font-normal mr-2"
          @click="closeModal"
        >
          {{ $t('no') }}
        </button>
        <button
          class="text-sm bg-brand-300 px-3 py-2 rounded-md font-normal"
          @click="confirmForceChange"
        >
          {{ $t('yes') }}
        </button>
      </template>
    </PopupModal>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, computed, onMounted, watch } from 'vue'
import RoomCard from './RoomCard.vue'
import StatusChangeModal from './StatusChangeModal.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { getRoomsWithDetails,updateRoomStatus } from '@/services/configrationApi'
import { getRoomTypes } from '@/services/roomTypeApi'
import { useI18n } from 'vue-i18n'
import Spinner from '@/components/spinner/Spinner.vue'
import PopupModal from '@/components/modal/PopupModal.vue'
import { useToast } from 'vue-toastification'
import router from '@/router'

// State variables
const Rooms = ref<any[]>([])
const serviceStore = useServiceStore()
const statusFilter = ref('')
const roomTypeFilter = ref('')
const searchQuery = ref('')
const loading = ref(false)
const error = ref('')
const isCheckingIn = ref(false)
const isCheckingOut = ref(false)
const isLoading = ref(false)
const roomTypeData = ref<any[]>([])
const itemsPerPage = ref(12)
const currentPage = ref<any>(1)
const showStatusModal = ref(false)
const selectedRoom = ref<any>(null)
const showMaintenanceModal = ref(false)
const viewMode = ref<'grid' | 'list' | 'status'>('grid')
const { t, locale } = useI18n()
const showMessage = ref(false)
const popupMessage = ref('')
const pendingForceRetry = ref<null | (() => void)>(null)
const toast = useToast()

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredRooms.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const paginatedRooms = computed(() => {
  return filteredRooms.value.slice(startIndex.value, endIndex.value)
})

// Watch for filter changes to reset pagination
watch([statusFilter, roomTypeFilter, searchQuery, itemsPerPage], () => {
  currentPage.value = 1
})

const fetchRoomWithDetails = async () => {
  loading.value = true
  error.value = ''

  try {
    const hotelId = serviceStore.serviceId
    const response = await getRoomsWithDetails(hotelId!)
    Rooms.value = response.data
    console.log('Rooms', Rooms.value)
  } catch (error: any) {
    console.error('Erreur lors de la récupération des chambres:', error)
    error.value = 'Erreur lors du chargement des chambres'
  } finally {
    loading.value = false
  }
}

const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getRoomTypes(serviceId!)
    console.log('response', response.data.data.data)

    roomTypeData.value = response.data.data.data.map((item: any) => ({
      ...item,
      value: item.id,
      label: item.roomTypeName,
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des roomtypes:', error)
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([fetchRoomWithDetails(), fetchRoomType()])
    console.log('serviceProducts', Rooms.value)
  } catch (e) {
    console.error('Erreur lors du fetch des données:', e)
  } finally {
    isLoading.value = false
  }
})

// Flatten service products for display
const flattenServiceProducts = computed(() => {
  const products = Rooms.value.length > 0 ? Rooms.value : []

  return products.map((product: any) => {
    const flatProduct: any = {
      ...product,
      productTypeName: getRoomTypeName(product.productTypeId),
    }

    product.options?.forEach((option: any) => {
      const key = `option_${option.optionId}`
      flatProduct[key] = option.value
    })

    return flatProduct
  })
})

// Filtered rooms based on status, type, and search
const filteredRooms = computed(() => {
  let filtered = flattenServiceProducts.value

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter((room: any) => room.status === statusFilter.value)
  }

  // Filter by room type
  if (roomTypeFilter.value) {
    filtered = filtered.filter((room: any) => room.roomTypeId === roomTypeFilter.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (room: any) =>
        room.roomNumber?.toLowerCase().includes(query) ||
        room.roomType.roomTypeName?.toLowerCase().includes(query) ||
        room.guestName?.toLowerCase().includes(query),
    )
  }

  return filtered
})

// Room statistics
const roomStats = computed(() => {
  const stats = {
    available: 0,
    booked: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
    out_of_order: 0,
    total: flattenServiceProducts.value.length,
  }

  flattenServiceProducts.value.forEach((room: any) => {
    if (stats.hasOwnProperty(room.status)) {
      stats[room.status as keyof typeof stats]++
    }
  })

  return stats
})

const getRoomTypeName = (id: number): string => {
  return roomTypeData.value.find((t: any) => t.value === id)?.label || ''
}



const tableColumns = computed(() => [
  {
    key: 'roomNumber',
    label: t('Room'),
    type: 'text' as const,
  },
  {
    key: 'roomType.roomTypeName',
    label: t('Type'),
    type: 'text' as const,
  },
  {
    key: 'status',
    label: t('Status'),
    type: 'badge' as const,
    badgeColors: {
      available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      occupied: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cleaning: 'bg-purple-100 text-purple-808 dark:bg-purple-900 dark:text-purple-200',
      maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      out_of_order: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    },
    translatable: true,
  },
  {
    key: 'displayGuestName',
    label: t('Guest'),
    type: 'text' as const,
  },
  {
    key: 'displayCheckInTime',
    label: t('Check-in'),
    type: 'text' as const,
  },
  {
    key: 'displayCheckOutTime',
    label: t('Check-out'),
    type: 'text' as const,
  },
])

// Données de table avec affichage conditionnel du contenu
const processedTableData = computed(() => {
  return paginatedRooms.value.map(room => ({
    ...room,
    // Afficher le nom du guest seulement si la chambre est occupée ET a un guest
    displayGuestName: (room.status === 'occupied' && room.guestName) ? room.guestName : '',
    // Afficher check-in seulement si la chambre est occupée ET a une date de check-in
    displayCheckInTime: (room.status === 'occupied' && room.checkInTime) ?
      new Date(room.checkInTime).toLocaleDateString() : '',
    // Afficher check-out seulement si la chambre est occupée ET a une date de check-out
    displayCheckOutTime: (room.status === 'occupied' && room.checkOutTime) ?
      new Date(room.checkOutTime).toLocaleDateString() : '',
  }))
})


const refreshRooms = () => {
  window.location.reload();
};

// Handle table actions
const onTableAction = (action: string, room: any) => {
  console.log('Table action:', action, 'on room:', room)
}

// Open audit trail
const openAuditTrail = () => {
  router.push({ name: 'AuditTrailEntity', params: { entityType: 'Room', entityId: 'all' } })
}

const exportData = () => {
  const data = filteredRooms.value.map((room) => ({
    room: room.roomNumber,
    type: room.roomType.roomTypeName,
    status: room.status,
  }))

  const csv = [['Room', 'Type', 'Status'], ...data.map((row: any) => Object.values(row))]
    .map((row) => row.join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'rooms-export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const handleQuickStatusChange = (room: any, newStatus: string) => {
  selectedRoom.value = room
  showStatusModal.value = true
}

const handleMaintenance = (room: any, newStatus: string) => {
  selectedRoom.value = room
  showMaintenanceModal.value = true
}

const confirmStatusChange = (payload: { roomId: number | string; newStatus: string }) => {
  handleStatusChange(payload)
  showStatusModal.value = false
  selectedRoom.value = null
}

const maintenanceForm = ref({
  reason: '',
  startDate: '',
  endDate: '',
  notes: '',
})

// Add form validation
const validateMaintenanceForm = () => {
  const errors = []

  if (!maintenanceForm.value.reason.trim()) {
    errors.push(t('validation.reasonRequired'))
  }

  if (maintenanceForm.value.startDate && maintenanceForm.value.endDate) {
    const start = new Date(maintenanceForm.value.startDate)
    const end = new Date(maintenanceForm.value.endDate)

    if (end <= start) {
      errors.push(t('validation.endDateMustBeAfterStartDate'))
      error.value = t('date_must')
    }
  }

  return errors
}

const confirmMaintenance = async () => {
  const errors = validateMaintenanceForm()
  if (errors.length > 0) {
    console.error('Validation errors:', errors)
    return
  }

  if (!selectedRoom.value) {
    console.error('No room selected for maintenance')
    return
  }

  const maintenanceData = {
    reason: maintenanceForm.value.reason.trim(),
    startDate: maintenanceForm.value.startDate || null,
    endDate: maintenanceForm.value.endDate || null,
    notes: maintenanceForm.value.notes.trim(),
  }

  isLoading.value = true

  try {
    await handleStatusChange({
      room: selectedRoom.value,
      status: 'maintenance',
      ...maintenanceData,
    })

    showMaintenanceModal.value = false
    resetMaintenanceForm()
  } catch (err) {
    console.error('Erreur lors de la mise en maintenance :', err)
  } finally {
    isLoading.value = false
  }
}

const resetMaintenanceForm = () => {
  maintenanceForm.value = {
    reason: '',
    startDate: '',
    endDate: '',
    notes: '',
  }
}

const handleStatusChange = async (payload: any) => {
  let roomId: number, newStatus: string
  const force = false

  if (payload.roomId && payload.newStatus) {
    roomId = payload.roomId
    newStatus = payload.newStatus
  } else if (payload.room && payload.status) {
    roomId = payload.room.id
    newStatus = payload.status
  } else {
    console.error('handleStatusChange called with invalid payload:', payload)
    return
  }

  const roomToUpdate = Rooms.value.find((r: any) => r.id === roomId)
  if (!roomToUpdate) {
    console.warn(`Room with ID ${roomId} not found.`)
    return
  }

  const oldStatus = roomToUpdate.status

  roomToUpdate.status = newStatus

  const maintenanceData =
    newStatus === 'maintenance'
      ? {
          reason: payload.reason || '',
          startDate: payload.startDate || '',
          endDate: payload.endDate || '',
          notes: payload.notes || '',
        }
      : undefined

  const tryUpdate = async (forced = false) => {
    try {
      await updateRoomStatus(roomId, newStatus, forced, maintenanceData)

      console.log(`Room ${roomId} status updated on server.`)
    } catch (error: any) {
      if (error?.response?.data?.message?.includes('forcer')) {
        popupMessage.value = t('room_force')
        showMessage.value = true

        pendingForceRetry.value = async () => {
          showMessage.value = false
          await tryUpdate(true)
        }

        return
      } else {
        roomToUpdate.status = oldStatus
        console.error('API Error:', error)
      }
    }
  }

  await tryUpdate(force)

  if (newStatus === 'cleaning') {
    setTimeout(() => {
      if (roomToUpdate.status === 'cleaning') {
        roomToUpdate.status = 'available'
        updateRoomStatus(roomId, 'available').catch((e) =>
          console.error('Error auto-updating cleaning → available:', e),
        )
      }
    }, 1800000)
  }

  if (newStatus === 'maintenance') {
    delete roomToUpdate.guestName
    delete roomToUpdate.checkInTime
    delete roomToUpdate.checkOutTime
    delete roomToUpdate.nextAvailable
    console.log(`Guest data removed for room ${roomToUpdate.id} (maintenance).`)
  }

  console.log(`✅ Room ${roomToUpdate.productName} → ${newStatus}`)
}

const confirmForceChange = async () => {
  if (pendingForceRetry.value) {
    await pendingForceRetry.value()
    pendingForceRetry.value = null
  }
  fetchRoomWithDetails()
}

const closeModal = () => {
  showMessage.value = false

  if (pendingForceRetry.value) {
    pendingForceRetry.value = null
  }
  window.location.reload()
  // toast.info(t('status_change_cancelled'));
}

// État pour gérer les types de chambres étendus
const expandedRoomTypes = ref(new Set())

// Fonction pour basculer l'expansion d'un type de chambre
const toggleRoomType = (roomTypeId:any) => {
  if (expandedRoomTypes.value.has(roomTypeId)) {
    expandedRoomTypes.value.delete(roomTypeId)
  } else {
    expandedRoomTypes.value.add(roomTypeId)
  }
}

// Fonction pour obtenir les chambres par statut
const getRoomsByStatus = (rooms:any, targetStatus:any) => {
  return rooms.filter((room:any) => {
    switch (targetStatus) {
      case 'occupied':
        return room.status === 'occupied'
      case 'cleaning':
        return (
          room.status === 'cleaning'
        )
      case 'available':
        return room.status === 'available' && room.housekeepingStatus === 'clean'
      case 'dirty':
        return room.housekeepingStatus === 'dirty' || room.status === 'dirty'
      case 'maintenance':
        return (
          room.status === 'maintenance' ||
          room.status === 'out_of_order' ||
          room.housekeepingStatus === 'maintenance'
        )
      case 'nostatus':
        return !room.status && !room.housekeepingStatus
      default:
        return false
    }
  })
}

// Interface pour les statistiques par type de chambre
interface RoomTypeStat {
  id: number | string
  name: string
  noStatus: number
  available: number
  cleaning: number
  occupied: number
  dirty: number
  outOfOrder: number
  totalRooms: number
  rooms: typeof flattenServiceProducts.value
  dirtyRooms: typeof flattenServiceProducts.value
}

// Statistiques par type de chambre
const roomTypeStats = computed(() => {
  const typeStats: RoomTypeStat[] = []

  roomTypeData.value.forEach((roomType) => {
    const roomsOfType = flattenServiceProducts.value.filter((room) => {
      return (
        room.roomTypeId === roomType.id ||
        room.roomTypeName === roomType.label ||
        room.roomType?.id === roomType.id
      )
    })

    const availableRooms = getRoomsByStatus(roomsOfType, 'available')
    const cleanRooms = getRoomsByStatus(roomsOfType, 'cleaning')
    const occupiedRooms = getRoomsByStatus(roomsOfType, 'occupied')
    const dirtyRooms = getRoomsByStatus(roomsOfType, 'dirty')
    const outOfOrderRooms = getRoomsByStatus(roomsOfType, 'maintenance')
    const noStatusRooms = getRoomsByStatus(roomsOfType, 'nostatus')

    const stats: RoomTypeStat = {
      id: roomType.id,
      name: roomType.label,
      noStatus: noStatusRooms.length,
      available: availableRooms.length,
      cleaning: cleanRooms.length,
      occupied: occupiedRooms.length,
      dirty: dirtyRooms.length,
      outOfOrder: outOfOrderRooms.length,
      totalRooms: roomsOfType.length,
      rooms: roomsOfType.sort((a, b) =>
        a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })
      ),
      dirtyRooms: dirtyRooms,
    }

    typeStats.push(stats)
  })

  return typeStats.sort((a, b) => a.name.localeCompare(b.name))
})

// Statistiques totales
const totalStats = computed(() => {
  return roomTypeStats.value.reduce(
    (total, roomType) => ({
      noStatus: total.noStatus + roomType.noStatus,
      available: total.available + roomType.available,
      occupied: total.occupied + roomType.occupied,
      cleaning: total.cleaning + roomType.cleaning,
      dirty: total.dirty + roomType.dirty,
      outOfOrder: total.outOfOrder + roomType.outOfOrder,
    }),
    { noStatus: 0, available: 0, occupied: 0, cleaning: 0, dirty: 0, outOfOrder: 0 }
  )
})

</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.bg-gray-25 {
  background-color: #fafafa;
}

.bg-green-25 {
  background-color: #f0fdf4;
}

.bg-red-25 {
  background-color: #fef2f2;
}
</style>
