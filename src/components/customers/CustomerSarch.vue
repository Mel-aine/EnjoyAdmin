<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import Input from '@/components/forms/FormElements/Input.vue';
import { getCustomer } from '@/services/reservation'
import { useServiceStore } from '@/composables/serviceStore';

const props = defineProps({
  customer_id: String,
  modelValue: Object
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
    const firstNameMatch = c.firstName?.toLowerCase().startsWith(query);
    const lastNameMatch = c.lastName?.toLowerCase().startsWith(query);
    const fullNameMatch = c.userFullName?.toLowerCase().startsWith(query);

    return firstNameMatch || lastNameMatch || fullNameMatch;
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
  selectedCustomer.value = { ...customer };
  emit('customerSelected', selectedCustomer.value);
  console.log("Selected customer:", selectedCustomer.value);
  searchQuery.value = `${customer.firstName}`;
  filteredCustomers.value = [];
};


const clearSearch = () => {
  searchQuery.value = '';
  filteredCustomers.value = [];
  selectedCustomer.value = {};
  emit('customerSelected', null);
};


const fetchCustomers = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getCustomer(serviceId!);
    console.log('Fetched customers:', response);
    customers.value= response.data.map((c:any)=>{
      return {
        ...c,
        firstName : c.firstName,
        lastName : c.lastName,
        phoneNumber:c.phonePrimary,
        email:c.email

      }
    })
    console.log("customers",customers.value)

  } catch (error) {
    console.error('Failed to fetch reservations:', error);
  }
};


onBeforeMount(() => {
  fetchCustomers()
});



</script>

<template>
  <div class="relative">
    <form @submit.prevent>
      <div class="relative">
        <Input :lb="$t('FirstName')" v-model="searchQuery" @input="filterCustomer" :id="'customer-search'" custom-class="rounded-none" :placeholder="$t('FirstName')"
          :forLabel="'customer-search'" />
      </div>

      <!-- Search results dropdown -->
      <ul v-if="filteredCustomers.length > 0 && searchQuery"
        class="absolute left-0 right-0 bg-white z-20 max-h-60 overflow-y-auto rounded-b-lg shadow-lg border-l border-r border-b border-gray-200 mt-1">
        <li class="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          v-for="customer in filteredCustomers" :key="customer.id" @click="selectCustomer(customer)">
          <div class="flex flex-col">
            <div class="font-medium text-gray-900">
              {{ customer.firstName }} {{ customer.lastName }}
            </div>
            <div class="text-sm text-gray-500 flex items-center gap-4">
               <span  class="text-xs">
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
