<template>
  <div class="relative inline-block">
    <!-- Info Icon Button -->
    <button 
      @click="toggleTooltip" 
      class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
      aria-label="Show status legend"
    >
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </slot>
    </button>

    <!-- Tooltip Content -->
    <div 
      v-if="isOpen" 
      class="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 dark:bg-gray-800 dark:border-gray-700"
      :class="positionClasses"
    >
      <!-- Title -->
      <div v-if="title" class="font-bold text-gray-800 dark:text-gray-200 mb-2">{{ title }}</div>
      
      <!-- Legend Items -->
      <div class="space-y-3">
        <template v-if="sections && sections.length > 0">
          <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="mb-4">
            <div v-if="section.title" class="font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ section.title }}</div>
            <div class="space-y-2 grid grid-cols-2">
              <div 
                v-for="(item, itemIndex) in section.items" 
                :key="itemIndex"
                class="flex items-center gap-2"
              >
                <!-- Color Indicator -->
                <div 
                  v-if="item.color" 
                  class="w-4 h-4 rounded" 
                  :style="{ backgroundColor: item.color }"
                ></div>
                
                <!-- Icon -->
                <component 
                  v-if="item.icon" 
                  :is="item.icon" 
                  class="w-4 h-4"
                  :class="item.iconClass"
                />
                
                <!-- Label -->
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <div 
            v-for="(item, index) in items" 
            :key="index"
            class="flex items-center gap-2"
          >
            <!-- Color Indicator -->
            <div 
              v-if="item.color" 
              class="w-4 h-4 rounded" 
              :style="{ backgroundColor: item.color }"
            ></div>
            
            <!-- Icon -->
            <component 
              v-if="item.icon" 
              :is="item.icon" 
              class="w-4 h-4"
              :class="item.iconClass"
            />
            
            <!-- Label -->
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.label }}</span>
          </div>
        </template>
      </div>
      
      <!-- Close Button -->
      <button 
        @click="isOpen = false"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface LegendItem {
  label: string;
  color?: string;
  icon?: any;
  iconClass?: string;
}

interface LegendSection {
  title?: string;
  items: LegendItem[];
}

interface Props {
  title?: string;
  items?: LegendItem[];
  sections?: LegendSection[];
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'left-center' | 'right-center';
  closeOnClickOutside?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  items: () => [],
  sections: () => [],
  position: 'bottom-right',
  closeOnClickOutside: true
});

// Computed property for positioning classes
const positionClasses = computed(() => {
  switch (props.position) {
    case 'top-left':
      return 'bottom-full left-0 mb-2';
    case 'top-right':
      return 'bottom-full right-0 mb-2';
    case 'top-center':
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    case 'bottom-left':
      return 'top-full left-0 mt-2';
    case 'bottom-right':
      return 'top-full right-0 mt-2';
    case 'bottom-center':
      return 'top-full left-1/2 -translate-x-1/2 mt-2';
    case 'left-center':
      return 'right-full top-1/2 -translate-y-1/2 mr-2';
    case 'right-center':
      return 'left-full top-1/2 -translate-y-1/2 ml-2';
    default:
      return 'top-full right-0 mt-2';
  }
});

const isOpen = ref(false);
const tooltipRef = ref<HTMLElement | null>(null);

const toggleTooltip = () => {
  isOpen.value = !isOpen.value;
};

// Close tooltip when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (props.closeOnClickOutside && 
      tooltipRef.value && 
      !tooltipRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  if (props.closeOnClickOutside) {
    document.addEventListener('click', handleClickOutside);
  }
});

onUnmounted(() => {
  if (props.closeOnClickOutside) {
    document.removeEventListener('click', handleClickOutside);
  }
});
</script>

<style scoped>
/* Additional styling if needed */
</style>