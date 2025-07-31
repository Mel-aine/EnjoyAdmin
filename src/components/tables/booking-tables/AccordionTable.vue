<template>
    <div class="md:max-w-7xl lg:max-w-full w-full mx-auto px-2">
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">

            <div v-if="showHeader"
                class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="flex items-center gap-3 min-w-0 flex-shrink-0">
                        <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002-2M9 7a2 2 0 012 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2" />
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <h2 class="text-xl font-bold text-gray-900 dark:text-white truncate">{{ title || $t('datas')
                                }}</h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {{ filteredData.length }} {{ $t('item') }}{{ filteredData.length > 1 ? 's' : '' }}
                                {{ totalElement !== filteredData.length ? `sur ${totalElement}` : '' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto min-w-0">
                        <div v-if="searchable" class="relative flex-1 sm:flex-none sm:w-64 lg:w-80 min-w-0">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input v-model="searchQuery" type="text" :placeholder="searchPlaceholder || $t('search...')"
                                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-w-0" />
                            <button v-if="searchQuery" @click="searchQuery = ''"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div v-if="filterable && options?.length" class="relative flex-shrink-0">
                            <select v-model="selectedFilter"
                                class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-8 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-w-0">
                                <option v-for="option in options" :key="option.api" :value="option">
                                    {{ option.name }}
                                </option>
                            </select>
                            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div class="flex gap-2 flex-shrink-0">
                            <slot name="headerActions"></slot>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full overflow-x-auto">
                <div class="inline-block min-w-full align-middle">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th v-for="(item, index) in items" :key="index"
                                    :class="getOptimizedHeaderClasses(item, index)"
                                    class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <div class="flex items-center justify-between group min-w-0">
                                        <span class="truncate">{{ item.label }}</span>
                                        <button v-if="item.sortable" @click="toggleSort(item.name)" :class="[
                                            'ml-2 transition-opacity duration-200 flex-shrink-0',
                                            (sortField === item.name) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        ]">
                                            <svg class="w-4 h-4 text-gray-400 hover:text-gray-600 transition-transform duration-200"
                                                :class="{
                                                    'text-indigo-600': sortField === item.name,
                                                    'rotate-180': sortField === item.name && sortDirection === 'desc'
                                                }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                            </svg>
                                        </button>
                                    </div>
                                </th>
                                <th v-if="hasSubTableSlot"
                                    class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12 sm:w-16">
                                </th>
                            </tr>
                        </thead>

                        <tbody v-if="props.loading"
                            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-for="n in 5" :key="n" class="animate-pulse">
                                <td v-for="(item, i) in items" :key="i" :class="getOptimizedCellClasses(item, i)"
                                    class="px-3 sm:px-4 py-3">
                                    <div v-if="item.type === 'image'"
                                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-300 dark:bg-slate-700">
                                    </div>
                                    <div v-else-if="item.type === 'badge'"
                                        class="h-6 bg-slate-200 dark:bg-slate-600 rounded-full w-16 sm:w-20"></div>
                                    <div v-else-if="item.type === 'percentage'" class="w-full">
                                        <div class="h-3 bg-slate-300 dark:bg-slate-700 rounded-full w-3/4 mb-1"></div>
                                        <div class="h-2 bg-slate-200 dark:bg-slate-600 rounded-full w-full"></div>
                                    </div>
                                    <div v-else class="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                                </td>
                                <td v-if="hasSubTableSlot" class="px-3 sm:px-4 py-3">
                                    <div class="h-4 bg-slate-200 dark:bg-slate-600 rounded w-6"></div>
                                </td>
                            </tr>
                        </tbody>

                        <tbody v-else class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-if="paginatedData.length === 0">
                                <td :colspan="items.length + (hasSubTableSlot ? 1 : 0)" class="px-6 py-12 text-center">
                                    <div
                                        class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                        <svg class="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p class="text-lg font-medium">{{ emptyMessage || $t('noData') }}</p>
                                        <p class="text-sm mt-1">{{ searchQuery ? $t('try...') : $t('thedata') }}</p>
                                    </div>
                                </td>
                            </tr>

                            <template v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
                                <tr class="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                    :class="{ 'bg-indigo-100 dark:bg-gray-700': expandedRows[rowIndex] }">
                                    <td v-for="(item, colIndex) in items" :key="colIndex"
                                        :class="getOptimizedCellClasses(item, colIndex)"
                                        class="px-3 sm:px-4 py-3 sm:py-4">
                                        <div v-if="row[item.name] !== undefined" class="min-w-0 w-full">

                                            <template v-if="item.type === 'url'">
                                                <template v-if="item.inputField">
                                                    <input :type="item.inputField.type"
                                                        :placeholder="item.inputField.placeholder"
                                                        v-model="row.inputField"
                                                        class="w-full max-w-[120px] sm:max-w-[150px] px-2 sm:px-3 py-1 sm:py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200" />
                                                </template>
                                                <template v-else>
                                                    <button @click="$emit(item.event, row)"
                                                        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium underline-offset-2 hover:underline transition-colors duration-200 truncate block max-w-full"
                                                        :title="row[item.name]">
                                                        {{ row[item.name] }}
                                                    </button>
                                                </template>
                                            </template>

                                            <template
                                                v-else-if="item.type === 'badge' && typeof row[item.name] === 'object'">
                                                <span :class="[
                                                    row[item.name].bg || 'bg-gray-100 dark:bg-gray-700',
                                                    row[item.name].text || 'text-gray-800 dark:text-white',
                                                    'inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold capitalize shadow-sm truncate max-w-full'
                                                ]" :title="row[item.name].label">
                                                    {{ row[item.name].label }}
                                                </span>
                                            </template>

                                            <template
                                                v-else-if="item.type === 'imageText' && typeof row[item.name] === 'object'">
                                                <div class="flex items-center gap-2 min-w-0 max-w-full">
                                                    <img :src="row[item.name].image" alt="img"
                                                        class="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0" />
                                                    <span
                                                        class="truncate text-sm font-medium text-gray-800 dark:text-white min-w-0 flex-1"
                                                        :title="row[item.name].name">{{ row[item.name].name }}</span>
                                                </div>
                                            </template>

                                            <template v-else-if="item.type === 'rating'">
                                                <div class="flex items-center gap-1">
                                                    <template v-for="n in 5" :key="n">
                                                        <svg v-if="n <= row[item.name]"
                                                            class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0"
                                                            fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.967z" />
                                                        </svg>
                                                        <svg v-else
                                                            class="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0"
                                                            fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.967z" />
                                                        </svg>
                                                    </template>
                                                </div>
                                            </template>

                                            <template
                                                v-else-if="item.type === 'TextRoom' && row[item.name] && typeof row[item.name] === 'object'">
                                                <div class="flex flex-col min-w-0 max-w-full">
                                                    <span
                                                        class="text-sm font-medium text-gray-800 dark:text-white truncate"
                                                        :title="row[item.name].name || '-'">
                                                        {{ row[item.name].name || '-' }}
                                                    </span>
                                                    <span
                                                        class="text-xs text-purple-500 dark:text-gray-300 whitespace-nowrap">
                                                        {{ row[item.name].roomCount ?? 0 }} {{ $t('Rooms') }}
                                                    </span>
                                                </div>
                                            </template>

                                            <template v-else-if="item.type === 'percentage'">
                                                <div class="flex items-center gap-2 min-w-0 max-w-full">
                                                    <span
                                                        class="font-medium text-gray-900 dark:text-white whitespace-nowrap text-sm">{{
                                                        row[item.name] }}%</span>
                                                    <div
                                                        class="w-12 sm:w-16 lg:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 flex-shrink-0">
                                                        <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                                            :style="{ width: `${Math.min(row[item.name], 100)}%` }">
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>

                                            <template v-else-if="item.type === 'image'">
                                                <div class="flex items-center">
                                                    <img v-if="row[item.name]?.trim()" :src="row[item.name]"
                                                        :alt="row.title || 'Image'"
                                                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm flex-shrink-0" />
                                                    <div v-else
                                                        class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                                                            fill="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </template>

                                            <template v-else-if="item.type === 'currency'">
                                                <span
                                                    class="text-gray-900 dark:text-white font-medium text-sm whitespace-nowrap">{{
                                                    formatCurrency(row[item.name]) }}</span>
                                            </template>
                                            <template v-else-if="item.type === 'date'">
                                                <span
                                                    class="text-gray-900 dark:text-white font-medium text-sm whitespace-nowrap">
                                                    {{ row[item.name] ? formatDateT(row[item.name]) : "_" }}
                                                </span>
                                            </template>

                                            <template v-else>
                                                <template v-if="item.isTranslatable">
                                                    <span
                                                        class="text-gray-900 dark:text-white font-medium text-sm capitalize truncate block max-w-full"
                                                        :title="$t(row[item.name] ?? '')">{{ $t(row[item.name] ?? '')
                                                        }}</span>
                                                </template>
                                                <template v-else>
                                                    <span
                                                        class="text-gray-900 dark:text-white font-medium text-sm capitalize truncate block max-w-full"
                                                        :title="row[item.name]">{{ row[item.name] }}</span>

                                                </template></template>
                                        </div>

                                        <div v-else-if="item.type === 'action'" class="flex items-center gap-1">
                                            <button
                                                v-for="(action, actionIndex) in typeof item.actions === 'function' ? [] : item.actions"
                                                :key="actionIndex" @click.stop="$emit(action.event, row)"
                                                :title="action.name"
                                                class="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex-shrink-0"
                                                :class="[
                                                    item.colored && row?.event === action.event ? action.color : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                                ]">
                                                <span v-html="action.icone" class="w-3 h-3 sm:w-4 sm:h-4"></span>
                                            </button>
                                        </div>
                                    </td>
                                    <td v-if="hasSubTableSlot"
                                        class="px-3 sm:px-4 py-3 sm:py-4 w-12 sm:w-16 text-right">
                                        <button @click="toggleRow(rowIndex)"
                                            class="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex-shrink-0">
                                            <svg class="w-4 h-4 transition-transform duration-200"
                                                :class="{ 'rotate-90': expandedRows[rowIndex] }" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="expandedRows[rowIndex]">
                                    <td :colspan="items.length + (hasSubTableSlot ? 1 : 0)" class="p-0">
                                        <div
                                            class="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
                                            <slot :name="`subTable-${rowIndex}`" :rowData="row"></slot>
                                            <slot name="subTable" :rowData="row" v-if="!$slots[`subTable-${rowIndex}`]">
                                            </slot>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="pagination && filteredData.length > pageSize"
                class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div class="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                        {{ $t('showing') }} {{ ((currentPage - 1) * pageSize) + 1 }} {{ $t('to') }} {{
                            Math.min(currentPage *
                                pageSize,
                        filteredData.length) }}
                        {{ $t('of') }} {{ filteredData.length }} {{ $t('results') }}
                    </div>

                    <div class="flex items-center gap-2">
                        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage <= 1"
                            class="px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200">
                            {{ $t('previous') }}
                        </button>

                        <div class="flex gap-1">
                            <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="[
                                'px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                                page === currentPage
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                            ]">
                                {{ page }}
                            </button>
                        </div>

                        <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                            :disabled="currentPage >= totalPages"
                            class="px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200">
                            {{ $t('next') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, useSlots } from 'vue'
import { formatCurrency, formatDateT } from "@/components/utilities/UtilitiesFunction";
import type { TableColumn } from '@/utils/models';


interface FilterOption {
    name: string
    api: string
    price?: number
}

// Props
interface Props {
    title?: string
    items: TableColumn[] // Changed to TableColumn[] for better type safety
    datas: any[]
    options?: FilterOption[]
    filterable?: boolean
    searchable?: boolean
    pagination?: boolean
    searchPlaceholder?: string
    emptyMessage?: string
    pageSize?: number
    loading: boolean
    showHeader: boolean
}

const props = withDefaults(defineProps<Props>(), {
    filterable: false,
    searchable: true,
    pagination: true,
    pageSize: 10,
    showHeader: true,
})

// Emits
const emit = defineEmits<{
    [key: string]: [data: any],
    (e: 'pageChange', page: number): void
}>()

function changePage(page: number) {
    currentPage.value = page
    emit('pageChange', page)
}

// Local state
const searchQuery = ref('')
const selectedFilter = ref<FilterOption>()
const currentPage = ref(1)
const sortField = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const expandedRows = ref<boolean[]>([]); // New state for accordion rows

// Check if a subTable slot is provided
const slots = useSlots();
const hasSubTableSlot = computed(() => {
    return !!slots.subTable || Object.keys(slots).some(name => name.startsWith('subTable-'));
});


// Initialization of filter
onMounted(() => {
    if (props.options?.length) {
        selectedFilter.value = props.options[0]
    }
})

// Filtered and sorted data
const filteredData = computed(() => {
    let data = [...(props.datas || [])]

    // Search
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        data = data.filter(row =>
            props.items.some(item =>
                String(row[item.name] || '').toLowerCase().includes(query)
            )
        )
    }

    // Sort
    if (sortField.value) {
        data.sort((a, b) => {
            const aVal = a[sortField.value]
            const bVal = b[sortField.value]

            if (aVal === bVal) return 0

            const comparison = aVal < bVal ? -1 : 1
            return sortDirection.value === 'asc' ? comparison : -comparison
        })
    }

    return data
})

// Paginated data
const paginatedData = computed(() => {
    if (!props.pagination) return filteredData.value

    const start = (currentPage.value - 1) * props.pageSize
    return filteredData.value.slice(start, start + props.pageSize)
})

// Pagination
const totalElement = computed(() => filteredData.value.length)
const totalPages = computed(() => Math.ceil(totalElement.value / props.pageSize))

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

// Accordion Logic
const toggleRow = (index: number) => {
    expandedRows.value[index] = !expandedRows.value[index];
}

// Methods for CSS classes with width management
const getOptimizedHeaderClasses = (item: TableColumn, index: number) => {
    let classes = ''

    // Optimized widths by column type
    switch (item.type) {
        case 'image':
            classes += 'w-12 sm:w-16'
            break
        case 'badge':
            classes += 'w-20 sm:w-24'
            break
        case 'percentage':
            classes += 'w-28 sm:w-32'
            break
        case 'action':
            classes += 'w-16 sm:w-20'
            break
        case 'currency':
            classes += 'w-24 sm:w-28'
            break
        case 'rating':
            classes += 'w-24 sm:w-32'
            break
        case 'url':
            classes += 'min-w-[120px] max-w-[200px] sm:min-w-[150px] sm:max-w-[250px]'
            break
        case 'imageText':
            classes += 'min-w-[140px] max-w-[200px] sm:min-w-[160px] sm:max-w-[250px]'
            break
        case 'TextRoom':
            classes += 'min-w-[120px] max-w-[180px] sm:min-w-[140px] sm:max-w-[200px]'
            break
        default:
            if (item.width) {
                classes += ` ${item.width}`
            } else {
                classes += 'min-w-[100px] max-w-[180px] sm:min-w-[120px] sm:max-w-[200px]'
            }
    }

    if (item.minWidth) {
        classes += ` ${item.minWidth}`
    }

    return classes
}

const getOptimizedCellClasses = (item: TableColumn, index: number) => {
    let classes = ''

    // Widths identical to headers
    switch (item.type) {
        case 'image':
            classes += 'w-12 sm:w-16'
            break
        case 'badge':
            classes += 'w-20 sm:w-24'
            break
        case 'percentage':
            classes += 'w-28 sm:w-32'
            break
        case 'action':
            classes += 'w-16 sm:w-20'
            break
        case 'currency':
            classes += 'w-24 sm:w-28'
            break
        case 'rating':
            classes += 'w-24 sm:w-32'
            break
        case 'url':
            classes += 'min-w-[120px] max-w-[200px] sm:min-w-[150px] sm:max-w-[250px]'
            break
        case 'imageText':
            classes += 'min-w-[140px] max-w-[200px] sm:min-w-[160px] sm:max-w-[250px]'
            break
        case 'TextRoom':
            classes += 'min-w-[120px] max-w-[180px] sm:min-w-[140px] sm:max-w-[200px]'
            break
        default:
            if (item.width) {
                classes += ` ${item.width}`
            } else {
                classes += 'min-w-[100px] max-w-[180px] sm:min-w-[120px] sm:max-w-[200px]'
            }
    }

    if (item.minWidth) {
        classes += ` ${item.minWidth}`
    }

    return classes
}

const toggleSort = (field: string) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDirection.value = 'asc'
    }
}

// Reset pagination and expanded rows when data or search/filter changes
watch([searchQuery, selectedFilter, () => props.datas], () => {
    currentPage.value = 1;
    expandedRows.value = Array(paginatedData.value.length).fill(false); // Reset expanded rows
}, { immediate: true }); // immediate: true ensures it runs on component mount
</script>

<style scoped>
.animate-pulse {
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }
}

.overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background-color: #a0aec0;
}
</style>