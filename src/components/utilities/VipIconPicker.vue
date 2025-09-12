<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="flex items-center gap-3">
      <button 
        type="button"
        @click="openModal = true" 
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
      >
        <component v-if="selectedIcon" :is="getIconComponent(selectedIcon)" class="w-4 h-4" />
        {{ t('vip_status.chooseIcon') }}
      </button>
      
      <div v-if="selectedIcon" class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md">
        <component :is="getIconComponent(selectedIcon)" class="w-5 h-5" :style="{ color: iconColor }" />
        <span class="text-sm text-gray-600">{{ selectedIcon }}</span>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="openModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] p-6 overflow-y-auto relative">
        <button 
          @click="openModal = false"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        
        <h2 class="text-lg font-semibold mb-4">{{ t('vip_status.selectVipIcon') }}</h2>
        
        <div class="mb-4">
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="t('vip_status.searchIcons')"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4">
          <div 
            v-for="icon in filteredIcons" 
            :key="icon" 
            @click="selectIcon(icon)" 
            :title="icon"
            class="cursor-pointer p-3 border rounded-lg text-center hover:bg-gray-100 transition-colors"
            :class="{ 'border-blue-500 bg-blue-50': selectedIcon === icon }"
          >
            <component :is="getIconComponent(icon)" class="w-6 h-6 mx-auto" :style="{ color: iconColor }" />
            <div class="text-xs mt-1 text-gray-600 truncate">{{ icon }}</div>
          </div>
        </div>
        
        <div v-if="filteredIcons.length === 0" class="text-center py-8 text-gray-500">
          {{ t('vip_status.noIconsFound') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Crown,
  Star,
  Award,
  Trophy,
  Medal,
  Gem,
  Diamond,
  Heart,
  Shield,
  Zap,
  Sparkles,
  Gift,
  Target,
  Flame,
  Sun,
  Moon,
  Rocket,
  Wand2,
  Key,
  Lock,
  Unlock,
  BadgeCheck,
  CheckCircle,
  Plus,
  Minus,
  X,
  Settings,
  User,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Briefcase,
  Building,
  Home,
  MapPin,
  Globe,
  Compass,
  Navigation,
  Anchor,
  Feather,
  Leaf,
  Flower,
  TreePine,
  Mountain,
  Waves,
  Cloud,
  Snowflake,
  Umbrella,
  Coffee,
  Wine,
  Utensils,
  Car,
  Plane,
  Ship,
  Train,
  Bike,
  Camera,
  Music,
  Headphones,
  Gamepad2,
  Palette,
  Brush,
  Scissors,
  Wrench,
  Hammer,
  Lightbulb,
  Battery,
  Wifi,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  HardDrive,
  Database,
  Server,
  Cloud as CloudIcon,
  Download,
  Upload,
  Share,
  Link,
  Bookmark,
  Tag,
  Flag,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Calendar,
  Clock,
  Timer,
  AlarmClock,
  Hourglass,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  Thermometer,
  Droplets,
  Wind,
  Tornado,
  Zap as Lightning,
  Rainbow,
  Cloudy,
} from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Icon'
  },
  required: {
    type: Boolean,
    default: false
  },
  iconColor: {
    type: String,
    default: '#000000'
  }
})

const emit = defineEmits(['update:modelValue'])

const openModal = ref(false)
const selectedIcon = ref(props.modelValue || '')
const searchQuery = ref('')

// VIP-appropriate Lucide icons
const vipIcons = [
  'Crown',
  'Star',
  'Award',
  'Trophy',
  'Medal',
  'Gem',
  'Diamond',
  'Heart',
  'Shield',
  'Zap',
  'Sparkles',
  'Gift',
  'Target',
  'Flame',
  'Sun',
  'Moon',
  'Rocket',
  'Wand2',
  'Key',
  'Lock',
  'Unlock',
  'BadgeCheck',
  'CheckCircle',
  'Plus',
  'Minus',
  'X',
  'Settings',
  'User',
  'Users',
  'UserCheck',
  'UserPlus',
  'UserX',
  'Eye',
  'EyeOff',
  'ThumbsUp',
  'ThumbsDown',
  'TrendingUp',
  'TrendingDown',
  'BarChart',
  'PieChart',
  'Activity',
  'Briefcase',
  'Building',
  'Home',
  'MapPin',
  'Globe',
  'Compass',
  'Navigation',
  'Anchor',
  'Feather',
  'Leaf',
  'Flower',
  'TreePine',
  'Mountain',
  'Waves',
  'Cloud',
  'Snowflake',
  'Umbrella',
  'Coffee',
  'Wine',
  'Utensils',
  'Car',
  'Plane',
  'Ship',
  'Train',
  'Bike',
  'Camera',
  'Music',
  'Headphones',
  'Gamepad2',
  'Palette',
  'Brush',
  'Scissors',
  'Wrench',
  'Hammer',
  'Lightbulb',
  'Battery',
  'Wifi',
  'Smartphone',
  'Laptop',
  'Monitor',
  'Printer',
  'HardDrive',
  'Database',
  'Server',
  'CloudIcon',
  'Download',
  'Upload',
  'Share',
  'Link',
  'Bookmark',
  'Tag',
  'Flag',
  'Bell',
  'Volume2',
  'VolumeX',
  'Play',
  'Pause',
  'Square',
  'SkipForward',
  'SkipBack',
  'Repeat',
  'Shuffle',
  'Calendar',
  'Clock',
  'Timer',
  'Stopwatch',
  'AlarmClock',
  'Hourglass',
  'Sunrise',
  'Sunset',
  'CloudRain',
  'CloudSnow',
  'Thermometer',
  'Droplets',
  'Wind',
  'Tornado',
  'Lightning',
  'Rainbow',
  'Cloudy',
]

const iconComponents = {
  Crown,
  Star,
  Award,
  Trophy,
  Medal,
  Gem,
  Diamond,
  Heart,
  Shield,
  Zap,
  Sparkles,
  Gift,
  Target,
  Flame,
  Sun,
  Moon,
  Rocket,
  Wand2,
  Key,
  Lock,
  Unlock,
  BadgeCheck,
  CheckCircle,
  Plus,
  Minus,
  X,
  Settings,
  User,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Briefcase,
  Building,
  Home,
  MapPin,
  Globe,
  Compass,
  Navigation,
  Anchor,
  Feather,
  Leaf,
  Flower,
  TreePine,
  Mountain,
  Waves,
  Cloud,
  Snowflake,
  Umbrella,
  Coffee,
  Wine,
  Utensils,
  Car,
  Plane,
  Ship,
  Train,
  Bike,
  Camera,
  Music,
  Headphones,
  Gamepad2,
  Palette,
  Brush,
  Scissors,
  Wrench,
  Hammer,
  Lightbulb,
  Battery,
  Wifi,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  HardDrive,
  Database,
  Server,
  CloudIcon,
  Download,
  Upload,
  Share,
  Link,
  Bookmark,
  Tag,
  Flag,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Calendar,
  Clock,
  Timer,
  AlarmClock,
  Hourglass,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  Thermometer,
  Droplets,
  Wind,
  Tornado,
  Lightning,
  Rainbow,
  Cloudy,
}

const filteredIcons = computed(() => {
  if (!searchQuery.value) {
    return vipIcons
  }
  return vipIcons.filter(icon => 
    icon.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function getIconComponent(iconName) {
  return iconComponents[iconName] || Crown
}

function selectIcon(icon) {
  selectedIcon.value = icon
  emit('update:modelValue', icon)
  openModal.value = false
}
</script>