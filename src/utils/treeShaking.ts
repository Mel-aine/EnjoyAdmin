/**
 * Tree shaking configuration and utilities
 * Helps eliminate unused code from the final bundle
 */

/**
 * Explicitly import only used Lucide icons to enable tree shaking
 * This replaces the wildcard import pattern
 */
export {
  // Core UI icons
  User,
  Users,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  
  // Navigation icons
  Home,
  Settings,
  Menu,
  ArrowLeft,
  ArrowRight,
  
  // Action icons
  Save,
  Download,
  Upload,
  Printer,
  Mail,
  Phone,
  
  // Status icons
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  
  // Business icons
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  Bookmark,
  
  // Hotel specific icons
  Bed,
  KeyRound,
  Car,
  Coffee,
  Wifi
} from 'lucide-vue-next'

/**
 * Lodash functions that are actually used
 * Import only specific functions to enable tree shaking
 */
export {
  debounce,
  throttle,
  cloneDeep,
  merge,
  pick,
  omit,
  groupBy,
  sortBy,
  uniq,
  flatten
} from 'lodash'

/**
 * Date-fns functions that are actually used
 */
export {
  format,
  parseISO,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  differenceInDays
} from 'date-fns'

/**
 * VueUse composables that are actually used
 */
export {
  useLocalStorage,
  useSessionStorage,
  useDebounce,
  useThrottle,
  useEventListener,
  useResizeObserver,
  useIntersectionObserver,
  useMouse,
  useWindowSize
} from '@vueuse/core'

/**
 * Bootstrap Icons that are actually used
 * Define specific icons to prevent loading the entire icon set
 */
export const USED_BOOTSTRAP_ICONS = [
  'bi-house',
  'bi-person',
  'bi-calendar',
  'bi-search',
  'bi-plus',
  'bi-pencil',
  'bi-trash',
  'bi-eye',
  'bi-gear',
  'bi-arrow-left',
  'bi-arrow-right',
  'bi-check',
  'bi-x',
  'bi-download',
  'bi-upload',
  'bi-printer',
  'bi-envelope',
  'bi-telephone'
] as const

/**
 * ECharts modules that are actually used
 * Import only necessary chart types and components
 */
export const ECHARTS_MODULES = {
  // Chart types
  charts: ['BarChart', 'LineChart', 'PieChart'],
  // Components
  components: [
    'TitleComponent',
    'TooltipComponent', 
    'LegendComponent',
    'GridComponent',
    'DataZoomComponent'
  ],
  // Renderers
  renderers: ['CanvasRenderer']
} as const

/**
 * Utility to register only used ECharts components
 */
export const registerEChartsComponents = async () => {
  const echarts = await import('echarts/core')
  
  // Import only used chart types
  const { BarChart, LineChart, PieChart } = await import('echarts/charts')
  
  // Import only used components
  const {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent
  } = await import('echarts/components')
  
  // Import canvas renderer
  const { CanvasRenderer } = await import('echarts/renderers')
  
  // Register components
  echarts.use([
    BarChart,
    LineChart, 
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    CanvasRenderer
  ])
  
  return echarts
}