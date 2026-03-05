<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { getGuests } from '@/services/guestApi';
import { useServiceStore } from '@/composables/serviceStore';

interface Props {
  modelValue: string | object | null;
  placeholder?: string;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search or create a guest...',
  disabled: false,
});

const emit = defineEmits(['update:modelValue', 'customerSelected', 'select']);

const serviceStore = useServiceStore();
const searchQuery = ref(
  typeof props.modelValue === 'object' && props.modelValue !== null
    ? (props.modelValue as any).firstName || ''
    : props.modelValue || ''
);
const customers = ref<any[]>([]);
const filteredCustomers = ref<any[]>([]);
const isLoading = ref(false);
const isManualSelection = ref(false);
const debounceTimeout = ref<number | null>(null);
const dropdownContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// Position de la dropdown
const dropdownTop = ref(0);
const dropdownLeft = ref(0);
const dropdownWidth = ref(0);

// Sync modelValue → searchQuery
watch(() => props.modelValue, (newVal) => {
  const val = typeof newVal === 'object' && newVal !== null
    ? (newVal as any).firstName || ''
    : newVal || ''

  if (val !== searchQuery.value) {
    searchQuery.value = val;
  }
});

// Recalculer la position quand la dropdown s'ouvre
const updatePosition = () => {
  if (!inputRef.value) return;
  const rect = inputRef.value.getBoundingClientRect();
  dropdownTop.value = rect.bottom + window.scrollY;
  dropdownLeft.value = rect.left + window.scrollX;
  dropdownWidth.value = rect.width;
};

watch(
  () => filteredCustomers.value.length,
  (newLen) => {
    if (newLen > 0) {
      nextTick(() => updatePosition());
    }
  }
);

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  searchQuery.value = value;
  emit('update:modelValue', value);

  if (isManualSelection.value) return;

  if (!value.trim()) {
    filteredCustomers.value = [];
    return;
  }

  if (value.length < 3) {
    filterLocal();
    return;
  }

  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  debounceTimeout.value = window.setTimeout(async () => {
    await fetchCustomers(value);
    filterLocal();
  }, 300);
};

const filterLocal = () => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) {
    filteredCustomers.value = [];
    return;
  }
  filteredCustomers.value = customers.value.filter(c =>
    c.firstName?.toLowerCase().startsWith(query) ||
    c.lastName?.toLowerCase().startsWith(query)
  );
};

const fetchCustomers = async (search: string) => {
  try {
    isLoading.value = true;
    const response = await getGuests({
      hotel_id: serviceStore.serviceId!,
      search
    });
    customers.value = response.data?.data.data?.map((c: any) => ({
      ...c,
      phoneNumber: c.phonePrimary,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch guests:', error);
  } finally {
    isLoading.value = false;
  }
};

const selectCustomer = (customer: any) => {
  isManualSelection.value = true;
  filteredCustomers.value = [];

  searchQuery.value = customer.firstName || '';

  emit('update:modelValue', customer.firstName || '');

  emit('customerSelected', customer);

  //  Pour GuestDetails - remplir tous les champs
  emit('select', customer);

  setTimeout(() => {
    isManualSelection.value = false;
  }, 300);
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
    filteredCustomers.value = [];
  }
};

const handleScroll = () => {
  if (filteredCustomers.value.length > 0) {
    updatePosition();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleScroll);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('resize', handleScroll);
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
});
</script>

<template>
  <div ref="dropdownContainer" class="relative w-full">

    <!-- Input -->
    <div class="relative">
      <input
        ref="inputRef"
        :value="searchQuery"
        @input="onInput"
        :placeholder="placeholder"
        :disabled="disabled"
        class="h-11 w-full border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800
               placeholder:text-gray-400 focus:border-purple-500 focus:outline-none
               focus:ring-3 focus:ring-purple-500/10
               dark:border-gray-700 dark:bg-gray-900 dark:text-white/90
               dark:placeholder:text-white/30 dark:focus:border-purple-800
               disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <!-- Spinner -->
      <div v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
        <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    </div>

    <!-- Dropdown via Teleport pour échapper aux overflow parents -->
    <Teleport to="body">
      <ul
        v-if="filteredCustomers.length > 0"
        :style="{
          position: 'absolute',
          top: dropdownTop + 'px',
          left: dropdownLeft + 'px',
          width: dropdownWidth + 'px',
          zIndex: 99999,
        }"
        class="bg-white dark:bg-gray-800 max-h-60 overflow-y-auto rounded-b-lg shadow-xl
               border border-gray-200 dark:border-gray-700"
      >
        <li
          v-for="customer in filteredCustomers"
          :key="customer.id"
          @mousedown.prevent="selectCustomer(customer)"
          class="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700
                 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
        >
          <div class="font-medium text-gray-900 dark:text-gray-100">
            {{ customer.firstName }} {{ customer.lastName }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 mt-0.5">
            <span>ID: {{ customer.id }}</span>
            <span v-if="customer.phoneNumber">{{ customer.phoneNumber }}</span>
          </div>
        </li>
      </ul>
    </Teleport>

  </div>
</template>

<style scoped>
input:disabled {
  background-color: transparent;
}
</style>
