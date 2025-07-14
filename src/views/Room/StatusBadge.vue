<template>
  <div ref="containerRef" class="relative inline-block">
    <button
      ref="buttonRef"
      @click="toggleDropdown"
      :class="[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 hover:shadow-sm',
        statusClasses[status] || 'bg-gray-100 text-gray-800'
      ]"
    >
      <span class="mr-1.5 flex-shrink-0">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" />
        </svg>
      </span>
      {{ statusLabels[status] || status }}
      <svg
        class="ml-1 w-3 h-3 transition-transform duration-200"
        :class="{ 'rotate-180': showDropdown }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showDropdown"
        :class="[
          'absolute z-[9999] w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1',
          dropdownDirection === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          'origin-top-right'
        ]"
      >
        <div class="py-1">
          <button
            v-for="(label, statusKey) in statusLabels"
            :key="statusKey"
            @click="changeStatus(statusKey)"
            :class="[
              'group flex w-full items-center px-4 py-2 text-sm transition-colors duration-200',
              statusKey === status
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <span class="flex items-center w-full">
              <span class="mr-3 flex-shrink-0">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" :class="statusColors[statusKey]" />
                </svg>
              </span>
              <span class="flex-1 text-left">{{ label }}</span>
              <span v-if="statusKey === status" class="ml-2 flex-shrink-0">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue';

type StatusType = 'available' | 'booked' | 'occupied' | 'checkout' | 'cleaning' | 'maintenance';

interface Props {
  status: StatusType;
  rowIndex?: number;
  totalRows: number;
}

interface Emits {
  (e: 'change', status: StatusType): void;
}

const props = withDefaults(defineProps<Props>(), {
  rowIndex: 0
});

const emit = defineEmits<Emits>();

const showDropdown = ref(false);
const dropdownDirection = ref<'top' | 'bottom'>('bottom');

const buttonRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

const statusLabels: Record<StatusType, string> = {
  available: 'Disponible',
  booked: 'Réservé',
  occupied: 'Occupé',
  checkout: 'Libération',
  cleaning: 'Nettoyage',
  maintenance: 'Maintenance'
};

const statusClasses: Record<StatusType, string> = {
  available: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
  booked: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  occupied: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
  checkout: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  cleaning: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  maintenance: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
};

const statusColors: Record<StatusType, string> = {
  available: 'text-emerald-500',
  booked: 'text-blue-500',
  occupied: 'text-rose-500',
  checkout: 'text-purple-500',
  cleaning: 'text-amber-500',
  maintenance: 'text-orange-500'
};

// Computed pour déterminer si on est dans les 4 derniers éléments
const isInLastItems = computed(() => {
  const lastItemsThreshold = 4;
  return props.rowIndex >= (props.totalRows - lastItemsThreshold);
});

const determineDropdownDirection = async () => {
  if (!buttonRef.value) return;

  await nextTick();

  // Si on est dans les 4 derniers éléments, forcer vers le haut
  if (isInLastItems.value) {
    dropdownDirection.value = 'top';
    return;
  }

  // Sinon, calculer dynamiquement selon l'espace disponible
  const rect = buttonRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  // Hauteur approximative du dropdown (environ 200px)
  const dropdownHeight = 200;

  // Si pas assez d'espace en bas et assez d'espace en haut, ouvrir vers le haut
  if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
    dropdownDirection.value = 'top';
  } else {
    dropdownDirection.value = 'bottom';
  }
};

const toggleDropdown = async () => {
  if (!showDropdown.value) {
    await determineDropdownDirection();
  }
  showDropdown.value = !showDropdown.value;
};

const changeStatus = (newStatus: StatusType) => {
  if (newStatus !== props.status) {
    emit('change', newStatus);
  }
  showDropdown.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscape);
});
</script>
