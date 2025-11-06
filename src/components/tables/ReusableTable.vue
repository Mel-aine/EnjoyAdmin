<template>
  <div class="bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-700">
    <!-- Header -->
    <div v-if="showHeader" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <!-- Search Bar -->
          <div v-if="searchable" class="relative flex-1 sm:flex-none sm:w-64">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input v-model="searchQuery" type="text" :placeholder="translatedSearchPlaceholder"
              class="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>

          <!-- Header Actions Slot -->
          <div class="flex gap-2 align-middle self-center items-center">
            <slot name="header-actions" :searchQuery="searchQuery"></slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div ref="tableContainer" @scroll="handleScroll"   :class="[
        scrollableBody ? 'custom-scrollbar overflow-y-auto' : ''
      ]"
      :style="scrollableBody ? { maxHeight: props.maxHeight } : {}">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
          <tr>
            <th v-if="selectable"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 capitalize tracking-wider">
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </th>
            <th v-for="column in columns" :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300  capitalize tracking-wider">
              {{ getColumnLabel(column) }}
            </th>
            <th v-if="hasActions"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 capitalize tracking-wider">
            </th>
            <th v-if="expandable" class="px-6 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
          <!-- Skeleton Loading Rows -->
          <template v-if="loading">
            <tr v-for="n in 5" :key="`skeleton-${n}`" class="animate-pulse">
              <td v-if="selectable" class="px-6 py-4">
                <div class="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </td>
              <td v-for="column in columns" :key="column.key" class="px-6 py-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              </td>
              <td v-if="hasActions" class="px-6 py-4">
                <div class="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </td>
            </tr>
          </template>

          <!-- Actual Data Rows -->
          <template v-else>
             <template v-for="(item, index) in filteredData" :key="getItemKey(item, index)">
            <tr
              class="transition-colors cursor-pointer" :class="[
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                item.isVoided ? 'bg-gray-100 dark:bg-gray-700 void-status line-through' : '',
                item.status === 'voided' ? 'line-through opacity-60' : '',
                rowClass(item)
              ]" @click="emit('row-click', item)">
              <td v-if="selectable" class="px-6 py-4">
                <input type="checkbox" v-model="selectedItems" :value="item"
                  :disabled="!isItemSelectable(item)"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" />
              </td>
              <td v-for="column in columns" :key="column.key" class="px-6 py-4 break-words max-w-xs">
                <div v-if="column.type === 'text'" class="text-sm text-gray-900 dark:text-white break-words">
                  {{ getColumnValue(item, column) }}
                </div>

                <div v-else-if="column.type === 'email'" class="text-sm">
                  <a :href="`mailto:${getNestedValue(item, column.key)}`"
                    class="text-blue-600 dark:text-blue-400 hover:underline">
                    {{ getColumnValue(item, column) }}
                  </a>
                </div>

                <div v-else-if="column.type === 'badge'" class="text-sm">
                  <span v-if="getNestedValue(item, column.key)"
                    :class="getBadgeClass(getNestedValue(item, column.key), column.badgeColors)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getColumnValue(item, column) }}
                  </span>
                  <span v-else class="text-gray-400 dark:text-gray-500">-</span>
                </div>

                <div v-else-if="column.type === 'image' && column.imageKey" class="flex items-center gap-2">
                  <img v-if="getNestedValue(item, column.imageKey)" :src="getNestedValue(item, column.imageKey)"
                    :alt="getNestedValue(item, column.key)" class="w-4 h-3 object-cover rounded-sm" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ getColumnValue(item, column) }}</span>
                </div>

                <div v-else-if="column.type === 'date'" class="text-sm text-gray-900 dark:text-white break-words">
                  {{ formatDate(getNestedValue(item, column.key), column.dateFormat) }}
                </div>

                <div v-else-if="column.type === 'custom'" class="text-sm">
                  <slot :name="`column-${column.key}`" :item="item" :value="getNestedValue(item, column.key)">
                    {{ getColumnValue(item, column) }}
                  </slot>
                </div>

                <div v-else class="text-sm text-gray-900 dark:text-white break-words">
                  {{ getColumnValue(item, column) || '-' }}
                </div>
              </td>

              <td v-if="hasActions" class="px-6 py-4 relative">
                <div class="flex items-center gap-2">
                  <!-- Dropdown Actions -->
                  <div class="relative" v-if="getItemActions(item).length > 0">
                    <button @click="toggleDropdown(index, $event)"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      :title="'More options'">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    <!-- Dropdown Menu -->
                    <div v-if="openDropdown === index" ref="dropdownMenu"
                      :class="{ 'dropdown-up': dropdownDirection === 'up' }"
                      class="absolute right-0  w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-999999 border border-gray-200 dark:border-gray-600"
                      @click.stop>
                      <div class="py-1">
                        <button v-for="action in getItemActions(item)" :key="action.label"
                          @click="handleAction(action, item)" :class="[
                            'block w-full text-left px-4 py-2 text-sm transition-colors',
                            action.variant === 'danger'
                              ? 'text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                          ]">
                          <div class="flex items-center gap-2">
                            <component v-if="action.icon" :is="action.icon" class="w-4 h-4" />
                            {{ action.label }}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td v-if="expandable" class="px-6 py-4">
                <button @click.stop="toggleExpand(index)" class="text-gray-400 hover:text-gray-600">
                  <ChevronDown
                    class="w-5 h-5 transition-transform"
                    :class="{ 'rotate-180': expandedRows.includes(index) }"
                  />
                </button>
              </td>
            </tr>
           <tr
            v-if="expandable && expandedRows.includes(index)"
            :key="`expanded-${getItemKey(item, index)}`"
            :class="[
              'bg-gray-50 dark:bg-gray-800',
              item.isVoided ? 'void-status line-through' : '',
              item.status === 'voided' ? 'line-through opacity-60' : ''
            ]"
          >
            <td :colspan="columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0) + (expandable ? 1 : 0)" class="px-0 py-0">
              <div class="animate-slideDown">
                <slot name="expanded-content" :item="item"></slot>
              </div>
            </td>
          </tr>
          </template>
          </template>

          <tr v-if="loadingNextPage">
              <td :colspan="columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)"
                  class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Chargement de la page suivante...
              </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredData.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ emptyStateTitleText }}</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ emptyStateMessageText }}</p>
    </div>
  </div>
  <div>
  <TablePagination
    v-if="!props.isInfiniteScroll && meta && meta.total > meta.perPage"
    :meta="meta"
    @page-change="(page) => emit('page-change', page)"
  />
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Action, Column } from '../../utils/models'
import { ChevronDown } from 'lucide-vue-next'
import TablePagination from './TablePagination.vue'

// HeaderAction interface removed as we're using slots now

interface Props {
  title?: string
  columns: Column[]
  data: any[]
  actions?: Action[] | any
  getActions?: Function,
  searchable?: boolean
  searchPlaceholder?: string
  selectable?: boolean
  emptyStateTitle?: string | (() => string)
  emptyStateMessage?: string | (() => string)
  itemKey?: string // Key to use for unique identification
  modelValue?: string // For v-model support on searchQuery
  showHeader?: boolean
  loading?: boolean // Loading state for skeleton display
  rowClass?: (item: any) => string
  canSelectItem?: (item: any) => boolean // Function to determine if an item can be selected
  maxHeight?: string
  meta?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    previousPageUrl?: string | null;
    nextPageUrl?: string | null;
  }
  isInfiniteScroll?: boolean
  expandable?: boolean
  scrollableBody?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  searchable: true,
  searchPlaceholder: '',
  selectable: false,
  emptyStateTitle: 'No data found',
  emptyStateMessage: 'Get started by adding some data.',
  itemKey: 'id',
  modelValue: '',
  showHeader: true,
  loading: false,
  rowClass: () => '',
  maxHeight: '100vh',
  scrollableBody: false,
  isInfiniteScroll:false,
  expandable: false

})

const { t } = useI18n()

const emptyStateTitleText = computed(() => {
  const title = typeof props.emptyStateTitle === 'function' ? props.emptyStateTitle() : props.emptyStateTitle
  return title === 'No data found' ? t('common.noDataFound') : title
})

const emptyStateMessageText = computed(() => {
  const message = typeof props.emptyStateMessage === 'function' ? props.emptyStateMessage() : props.emptyStateMessage
  return message === 'Get started by adding some data.' ? t('common.getStartedByAddingData') : message
})

const translatedSearchPlaceholder = computed(() =>
  props.searchPlaceholder || t('Search...')
)



const emit = defineEmits<{
  'selection-change': [items: any[]]
  'action': [action: string, item: any]
  'update:modelValue': [value: string]
  'search-change': [query: string]
  'row-click': [item: any]
  'page-change': [page: number]
}>()

const searchQuery = ref(props.modelValue)
const selectedItems = ref<any[]>([])
const selectAll = ref(false)
const openDropdown = ref<number | null>(null)
const dropdownDirection = ref<'up' | 'down'>('down')
const tableContainer = ref<HTMLElement | null>(null)
const loadingNextPage = ref(false)
const expandedRows = ref<number[]>([])
const dropdownMenu = ref<HTMLElement | null>(null)

const toggleExpand = (index: number) => {
  const pos = expandedRows.value.indexOf(index)
  if (pos > -1) {
    expandedRows.value.splice(pos, 1)
  } else {
    expandedRows.value.push(index)
  }
}

// const hasActions = computed(() => props.actions.length > 0)
const hasActions = computed(() => {
  const result = props.actions.length > 0 || !!props.getActions
  return result
})

const filteredData = computed(() => {
  if (!searchQuery.value || !props.searchable) return props.data

  const query = searchQuery.value.toLowerCase()
  return props.data.filter(item => {
    return props.columns.some(column => {
      if (column.searchable === false) return false
      const value = getNestedValue(item, column.key)
      return value && value.toString().toLowerCase().includes(query)
    })
  })
})

const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return undefined
  return path.split('.').reduce((current, key) => {
    return (current && typeof current === 'object') ? current[key] : undefined
  }, obj)
}

const getItemKey = (item: any, index: number) => {
  return getNestedValue(item, props.itemKey) || index
}

// const getItemActions = (item: any) => {
//   // Don't show actions if the row has noaction set to true
//   if (item.noaction === true) {
//     return []
//   }

//   return props.actions.filter((action: any) =>
//     !action.condition || action.condition(item)
//   )
// }

const getBadgeClass = (value: string, colorMap?: Record<string, string>) => {
  if (colorMap && colorMap[value.toLowerCase()]) {
    return colorMap[value.toLowerCase()]
  }

  // Default badge colors
  switch (value.toLowerCase()) {
    case 'active':
    case 'success':
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'inactive':
    case 'pending':
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'error':
    case 'failed':
    case 'danger':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'vip':
    case 'premium':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Determine whether a row item can be selected
const isItemSelectable = (item: any): boolean => {
  // Explicit per-item flag to block selection
  if (item && item.selectNotAllow === true) return false
  // External predicate, if provided
  if (props.canSelectItem) return !!props.canSelectItem(item)
  return true
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    // Only select items that are allowed to be selected
    selectedItems.value = filteredData.value.filter(isItemSelectable)
  } else {
    selectedItems.value = []
  }
}

// const toggleDropdown = (index: number) => {
//   openDropdown.value = openDropdown.value === index ? null : index
// }

const getItemActions = (item: any) => {

  // Don't show actions if the row has noaction set to true
  if (item.noaction === true) {
    return []
  }

  // Si getActions existe, l'utiliser (actions dynamiques)
  if (props.getActions) {
    const dynamicActions = props.getActions(item)
    return dynamicActions
  }

  // Sinon, utiliser actions statiques avec filtrage par condition
  const staticActions = props.actions.filter((action: any) =>
    !action.condition || action.condition(item)
  )
  return staticActions
}



const toggleDropdown = async (index: number, event: MouseEvent) => {
  if (openDropdown.value === index) {
    openDropdown.value = null
    return
  }

  // Réinitialiser la direction avant d'ouvrir
  dropdownDirection.value = 'down'
  openDropdown.value = index

  await nextTick()

  const triggerButton = event.currentTarget as HTMLElement
  const menu = triggerButton.nextElementSibling as HTMLElement

  if (!menu) {
    console.error("Le menu déroulant n'a pas été trouvé. Vérifiez la structure HTML.");
    return;
  }

  const menuRect = menu.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  console.log(`Position bas du menu: ${menuRect.bottom}, Hauteur Viewport: ${viewportHeight}`); // LIGNE DE DÉBOGAGE

  // Vérification de la position
  if (menuRect.bottom > viewportHeight - 150) {
    console.log("Pas assez de place en bas. On passe en mode 'up'."); // LIGNE DE DÉBOGAGE
    dropdownDirection.value = 'up'
  }
}

// const toggleDropdown = async (index: number, event: MouseEvent) => {
//   if (openDropdown.value === index) {
//     openDropdown.value = null
//     return
//   }

//   // Réinitialiser la direction avant d'ouvrir
//   dropdownDirection.value = 'down'
//   openDropdown.value = index

//   await nextTick()

//   // Prefer template ref over DOM sibling traversal for robustness in tests and runtime
//   const menu = dropdownMenu.value as HTMLElement

//   if (!menu) {
//     console.error("Le menu déroulant n'a pas été trouvé. Vérifiez la structure HTML.");
//     return;
//   }

//   // Safely compute dropdown direction only if DOM API is available
//   const getRect = (menu as any)?.getBoundingClientRect
//   if (typeof getRect === 'function') {
//     const menuRect = getRect.call(menu)
//     const viewportHeight = window.innerHeight
//     // Vérification de la position
//     if (menuRect.bottom > viewportHeight - 150) {
//       dropdownDirection.value = 'up'
//     }
//   } else {
//     dropdownDirection.value = 'down'
//   }
// }
const handleAction = (action: Action, item: any) => {
  action.handler(item)
  emit('action', action.label, item)
  openDropdown.value = null
}

const closeDropdown = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    openDropdown.value = null
  }
}



// Infinite Scroll Logic
let debounceTimer: any;

const handleScroll = () => {
  if (!props.isInfiniteScroll) return;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const container = tableContainer.value;
    if (!container || props.loading || loadingNextPage.value) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 20; // 20px threshold

    if (isNearBottom) {
      const meta = props.meta;
      if (meta && meta.currentPage < meta.lastPage) {
        loadingNextPage.value = true;
        emit('page-change', meta.currentPage + 1);
      }
    }
  }, 100);
};

// const handleScroll = () => {
//   // Cette fonction ne sera appelée que si props.isInfiniteScroll est vrai
//   const container = tableContainer.value

//   // S'assurer qu'il y a un conteneur, que ce n'est pas le chargement initial, et que la page suivante n'est pas déjà en cours de chargement.
//   if (!container || props.loading || loadingNextPage.value) return

//   // Marge de 100px pour déclencher avant d'atteindre le bas
//   const scrollTolerance = 100
//   const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + scrollTolerance

//   if (isNearBottom) {
//     checkAndLoadNextPage()
//   }
// }

// FONCTION POUR VÉRIFIER ET CHARGER LA PAGE SUIVANTE
// const checkAndLoadNextPage = () => {
//   const meta = props.meta

//   if (!meta) return

//   const hasNextPage = meta.currentPage < meta.lastPage

//   if (hasNextPage) {
//     loadingNextPage.value = true
//     const nextPage = meta.currentPage + 1
//     emit('page-change', nextPage)
//   }
// }





watch(() => props.loading, (newLoading) => {
  if (!newLoading) {
    loadingNextPage.value = false;
  }
});

watch(selectedItems, (newValue) => {
  const selectableCount = filteredData.value.filter(isItemSelectable).length
  selectAll.value = newValue.length === selectableCount && selectableCount > 0
  emit('selection-change', newValue)
}, { deep: true })

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
  emit('search-change', newValue)
})

watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

watch(filteredData, () => {
  // Reset selection when data changes
  selectedItems.value = selectedItems.value.filter(selected =>
    filteredData.value.some(item => getItemKey(item, 0) === getItemKey(selected, 0) && isItemSelectable(item))
  )
})

const getColumnLabel = (column: Column) => {
  // Column labels are already translated when passed as props
  return column.label
}

const getColumnValue = (item: any, column: Column) => {
  const value = getNestedValue(item, column.key)

  // Return empty string or dash for undefined/null values
  if (value === undefined || value === null) {
    return column.type === 'text' ? '-' : ''
  }

  // Apply translation if the column is marked as translatable
  if (column.translatable && value) {
    try {
      return t(value.toString())
    } catch (error) {
      // If translation fails, return original value
      return value
    }
  }

  return value
}

const formatDate = (value: any, format?: string) => {
  if (!value) return '-'

  const date = new Date(value)
  if (isNaN(date.getTime())) return value

  if (format) {
    // Simple date formatting - can be extended with a proper date library
    return date.toLocaleDateString()
  }

  return date.toLocaleDateString()
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
@reference "tailwindcss";

/* Additional custom styles if needed */
.dropdown-up {
  bottom: 100%;
  top: auto;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

/* Scrollbar invisible mais toujours scrollable */

@layer utilities {

  /* Chrome, Safari, Edge, Opera */
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* IE, Edge, Firefox */
  .custom-scrollbar {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}


</style>
