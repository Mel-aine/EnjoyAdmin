<!-- <script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import Input from '@/components/forms/FormElements/Input.vue';
import { getUser, getReservation } from '@/services/api';
import { useServiceStore } from '@/composables/serviceStore';

const props = defineProps({
  customer_id: String
});

const customers = ref<any[]>([]);
const users = ref<any[]>([]);
const serviceStore = useServiceStore();

const filteredCustomers = ref<any[]>([]);
const searchQuery = ref('');
const selectedCustomer = ref<any>({});
const emit = defineEmits(['customerSelected']);

const filterCustomer = () => {
  const query = searchQuery.value.toLowerCase();
  filteredCustomers.value = customers.value.filter(c =>
    c.phoneNumber?.toLowerCase().includes(query)
  );
};

const selectCustomer = (customer: any) => {
  selectedCustomer.value = { ...customer };
  emit('customerSelected', selectedCustomer.value);
  searchQuery.value = `${customer.firstName} ${customer.lastName}`;
  filteredCustomers.value = [];
};

const fetchUsers = async () => {
  const response = await getUser();
  users.value = response.data.data;
};

const fetchReservation = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getReservation(serviceId);
    customers.value = response.data.map((res: any) => {
      const user = users.value.find((u: any) => u.id === res.userId);
      return {
        ...res,
        ...user,
        userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
      };
    });
  } catch (error) {
    console.error('fetch failed:', error);
  }
};

onBeforeMount(async () => {
  await fetchUsers();
  await fetchReservation();
});
</script>

<template>
  <div>
    <form>
      <Input
        :lb="$t('name')"
        v-model="searchQuery"
        @input="filterCustomer"
        :isRequired="true"
        :id="'name'"
        :forLabel="'name'"
      />
      <ul
        v-if="filteredCustomers.length > 0 && searchQuery"
        class="absolute left-8 right-8 bg-white z-20 max-h-52 overflow-y-auto rounded-b-lg shadow-lg"
        style="border-top: none; border-left: none; border-right: none; border-bottom: 1px solid #D1D5DB;"
      >
        <li
          class="px-4 py-2 cursor-pointer hover:bg-gray-100"
          v-for="customer in filteredCustomers"
          :key="customer.id"
          @click="selectCustomer(customer)"
        >
          {{ customer.firstName }}, {{ customer.lastName }}
        </li>
      </ul>
    </form>
  </div>
</template> -->
<script setup lang="ts">
import { onBeforeMount, ref,watch } from 'vue';
import Input from '@/components/forms/FormElements/Input.vue';
import { getUser, getReservation } from '@/services/api';
import { useServiceStore } from '@/composables/serviceStore';

const props = defineProps({
  customer_id: String
});

const customers = ref<any[]>([]);
const users = ref<any[]>([]);
const serviceStore = useServiceStore();

const filteredCustomers = ref<any[]>([]);
const searchQuery = ref('');
const selectedCustomer = ref<any>({});
const emit = defineEmits(['customerSelected']);

const filterCustomer = () => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) {
    filteredCustomers.value = [];
    return;
  }

  filteredCustomers.value = customers.value.filter(c => {
    // Search by ID (exact match or partial)
    // const idMatch = c.id?.toString().includes(query);

    // // Search by phone number (partial match)
    // const phoneMatch = c.phoneNumber?.toLowerCase().includes(query);

    // // Search by user ID if available
    // const userIdMatch = c.userId?.toString().includes(query);

    // You can also add name search as a bonus
    const nameMatch = (
      c.firstName?.toLowerCase().includes(query) ||
      c.lastName?.toLowerCase().includes(query) ||
      c.userFullName?.toLowerCase().includes(query)
    );

    // return idMatch || phoneMatch || userIdMatch || nameMatch;
    return  nameMatch;
  });
};

watch(searchQuery, (newValue) => {
  const query = newValue.toLowerCase().trim();

  if (!query) {
    filteredCustomers.value = [];
    selectedCustomer.value = {};
    emit('customerSelected', null);
    return;
  }

  filterCustomer();

  const exactMatch = filteredCustomers.value.find(c =>
    `${c.firstName?.toLowerCase()} ${c.lastName?.toLowerCase()}`.trim() === query ||
    c.firstName?.toLowerCase() === query
  );

  if (exactMatch) {
    selectCustomer(exactMatch);
  } else {
    const newCustomer = { firstName: newValue };
    selectedCustomer.value = newCustomer;
    emit('customerSelected', newCustomer);
  }
});



const selectCustomer = (customer: any) => {
  selectedCustomer.value = { ...customer };
  emit('customerSelected', selectedCustomer.value);
  // searchQuery.value = `${customer.firstName} ${customer.lastName} (${customer.phoneNumber})`;
  searchQuery.value = `${customer.firstName}`;
  filteredCustomers.value = [];
};


const clearSearch = () => {
  searchQuery.value = '';
  filteredCustomers.value = [];
  selectedCustomer.value = {};
  emit('customerSelected', null);
};

const fetchUsers = async () => {
  try {
    const response = await getUser();
    users.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const fetchReservation = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getReservation(serviceId);
    customers.value = response.data.map((res: any) => {
      const user = users.value.find((u: any) => u.id === res.userId);
      return {
        ...res,
        ...user,
        userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
      };
    });
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
  }
};

onBeforeMount(async () => {
  await fetchUsers();
  await fetchReservation();
});
</script>

<template>
  <div class="relative">
    <form @submit.prevent>
      <div class="relative">
        <Input
          :lb="$t('FirstName')"
          v-model="searchQuery"
          @input="filterCustomer"
          :id="'customer-search'"
          :forLabel="'customer-search'"

        />

        <!-- Clear button -->
        <!-- <button
          v-if="searchQuery"
          type="button"
          @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/8 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button> -->
      </div>

      <!-- Search results dropdown -->
      <ul
        v-if="filteredCustomers.length > 0 && searchQuery"
        class="absolute left-0 right-0 bg-white z-20 max-h-60 overflow-y-auto rounded-b-lg shadow-lg border-l border-r border-b border-gray-200 mt-1"
      >
        <li
          class="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          v-for="customer in filteredCustomers"
          :key="customer.id"
          @click="selectCustomer(customer)"
        >
          <div class="flex flex-col">
            <div class="font-medium text-gray-900">
              {{ customer.firstName }} {{ customer.lastName }}
            </div>
            <div class="text-sm text-gray-500 flex items-center gap-4">
              <span>ID: {{ customer.id }}</span>
              <span v-if="customer.phoneNumber">{{ customer.phoneNumber }}</span>
              <span v-if="customer.userId && customer.userId !== customer.id" class="text-xs">
                User ID: {{ customer.userId }}
              </span>
            </div>
          </div>
        </li>
      </ul>

      <!-- No results message -->
      <!-- <div
        v-if="searchQuery && filteredCustomers.length === 0"
        class="absolute left-0 right-0 bg-white z-20 px-4 py-3 rounded-b-lg shadow-lg border-l border-r border-b border-gray-200 mt-1"
      >
        <p class="text-sm text-gray-500">{{ $t('no_customers_found') }}</p>
      </div> -->
    </form>

    <!-- Selected customer info -->
    <!-- <div v-if="selectedCustomer.id" class="mt-4 p-4 bg-blue-50 rounded-lg">
      <h4 class="font-medium text-blue-900 mb-2">{{ $t('selected_customer') }}</h4>
      <div class="text-sm text-blue-800">
        <p><strong>{{ $t('name') }}:</strong> {{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</p>
        <p v-if="selectedCustomer.phoneNumber"><strong>{{ $t('phone') }}:</strong> {{ selectedCustomer.phoneNumber }}</p>
        <p><strong>ID:</strong> {{ selectedCustomer.id }}</p>
        <p v-if="selectedCustomer.userId && selectedCustomer.userId !== selectedCustomer.id">
          <strong>User ID:</strong> {{ selectedCustomer.userId }}
        </p>
      </div>
    </div> -->
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
ul, div {
  transition: all 0.2s ease-in-out;
}

/* Focus styles */
li:focus {
  outline: 2px solid #3B82F6;
  outline-offset: -2px;
}
</style>
