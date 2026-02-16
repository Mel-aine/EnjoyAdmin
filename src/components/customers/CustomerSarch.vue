<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue';
import Input from '@/components/forms/FormElements/Input.vue';
import { getGuests } from '@/services/guestApi'
import { useServiceStore } from '@/composables/serviceStore';

const props = defineProps({
  customer_id: String,
  modelValue: Object
});

const customers = ref<any[]>([]);
const users = ref<any[]>([]);
const serviceStore = useServiceStore();
const isLoading = ref(false)

const filteredCustomers = ref<any[]>([]);
const searchQuery = ref('');
const selectedCustomer = ref<any>({});
const isManualSelection = ref(false)
const emit = defineEmits(['customerSelected']);
// Debounce timer for API calls
const debounceTimeout = ref<number | null>(null);


const filterCustomer = () => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) {
    filteredCustomers.value = [];
    return;
  }

  filteredCustomers.value = customers.value.filter(c => {
    const firstNameMatch = c.firstName?.toLowerCase().startsWith(query);
    const lastNameMatch = c.lastName?.toLowerCase().startsWith(query);
    const fullNameMatch = c.userFullName?.toLowerCase().startsWith(query);

    return firstNameMatch || lastNameMatch || fullNameMatch;
  });
};



watch(searchQuery, (newValue) => {
  // Si c'est une sélection manuelle, ignorer complètement ce watch
  if (isManualSelection.value) {
    return;
  }

  const query = newValue.toLowerCase().trim();

  if (!query) {
    filteredCustomers.value = [];
    selectedCustomer.value = {};

    emit('customerSelected', {
      firstName: '',
      guestId: null,
      id: 0
    });

    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value);
      debounceTimeout.value = null;
    }
    return;
  }

  // If fewer than 3 characters, do not call API; clear any pending debounce
  if (query.length < 3) {
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value);
      debounceTimeout.value = null;
    }
    filterCustomer();
  } else {
    // 300ms debounce before fetching customers
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value);
    }
    debounceTimeout.value = window.setTimeout(async () => {
      await fetchCustomers();
      filterCustomer();
    }, 300);
  }

  const exactMatch = filteredCustomers.value.find(c =>
    `${c.firstName?.toLowerCase()} ${c.lastName?.toLowerCase()}`.trim() === query ||
    c.firstName?.toLowerCase() === query
  );

  if (exactMatch) {
    selectCustomer(exactMatch);
  } else {
    const newCustomer = { firstName: newValue };
    selectedCustomer.value.firstName = newValue;
    console.log("newCustomer", newCustomer);
    emit('customerSelected', newCustomer);
  }
});

watch(() => props.modelValue, (newVal) => {
  if (newVal?.firstName && !searchQuery.value) {
    searchQuery.value = newVal.firstName;
  }
});


const selectCustomer = (customer: any) => {
  // Activer le flag AVANT toute modification
  isManualSelection.value = true;

  // Fermer immédiatement la dropdown
  filteredCustomers.value = [];

  // Mettre à jour les valeurs
  selectedCustomer.value = { ...customer };
  emit('customerSelected', selectedCustomer.value);
  console.log("Selected customer:", selectedCustomer.value);

  // Mettre à jour le champ de recherche
  searchQuery.value = `${customer.firstName}`;

  // Désactiver le flag après un délai suffisant pour que tous les watchers se soient exécutés
  setTimeout(() => {
    isManualSelection.value = false;
  }, 300);
};


const fetchCustomers = async () => {
  try {
    isLoading.value = true;
    const serviceId = serviceStore.serviceId;
    const response = await getGuests({ hotel_id: serviceId!,search: searchQuery.value});
    console.log('Fetched customers:', response);
    customers.value = response.data?.data.data?.map((c: any) => {
      return {
        ...c,
        firstName: c.firstName,
        lastName: c.lastName,
        phoneNumber: c.phonePrimary,
        email: c.email

      }
    })
    console.log("customers", customers.value)

  } catch (error) {
    console.error('Failed to fetch reservations:', error);
  } finally {
    isLoading.value = false;
  }

};



const dropdownContainer = ref<HTMLElement | null>(null);

// Ajoutez cette fonction
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
    filteredCustomers.value = [];
  }
};


onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});



</script>

<template>
  <div class="relative" ref="dropdownContainer">
    <form @submit.prevent>
      <div class="relative">
        <Input :lb="$t('FirstName')" v-model="searchQuery" @input="filterCustomer" :id="'customer-search'" :is-required="true"
          custom-class="rounded-none" :placeholder="$t('FirstName')" :forLabel="'customer-search'" />
      </div>

      <!-- Search results dropdown -->
      <ul v-if="filteredCustomers.length > 0"
        class="absolute left-0 right-0 bg-white z-20 max-h-60 overflow-y-auto rounded-b-lg shadow-lg border-l border-r border-b border-gray-200 mt-1 dark:bg-gray-800 dark:border-gray-700 dark:shadow-lg">
        <li
          class="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 dark:hover:bg-gray-700 dark:border-gray-700"
          v-for="customer in filteredCustomers" :key="customer.id" @click="selectCustomer(customer)">
          <div class="flex flex-col">
            <div class="font-medium text-gray-900 dark:text-gray-100">
              {{ customer.firstName }} {{ customer.lastName }}
            </div>
            <div class="text-sm text-gray-500 flex items-center gap-4 dark:text-gray-400">
              <span class="text-xs">
                ID: {{ customer.id }}
              </span>
              <span v-if="customer.phoneNumber">{{ customer.phoneNumber }}</span>

            </div>
          </div>
        </li>
      </ul>
    </form>

  </div>
</template>

<style scoped>
/* Additional styles for better UX */
.relative {
  position: relative;
}

/* Ensure dropdown appears above other elements */
ul {
  z-index: 1000;
}

/* Smooth transitions */
ul,
div {
  transition: all 0.2s ease-in-out;
}

/* Focus styles */
li:focus {
  outline: 2px solid #3B82F6;
  outline-offset: -2px;
}
</style>
