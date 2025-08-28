<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue';
import { SearchIcon, UserIcon } from 'lucide-vue-next';
import { getCustomer } from '@/services/reservation';
import { useServiceStore } from '@/composables/serviceStore';
import CustomerCreateModal from '@/components/customers/CustomerCreateModal.vue';

const props = defineProps({
    lb: {
        type: String,
        default: 'Name'
    },
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Full Name'
    },
    isRequired: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    id: String,
    customClass: {
        type: String,
        default: ''
    },
    showSearchIcon: {
        type: Boolean,
        default: true
    },
    showUserIcon: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:modelValue', 'search', 'clear-error', 'customerSelected']);

const value = ref(props.modelValue);
const isFocused = ref(false);
const customers = ref<any[]>([]);
const filteredCustomers = ref<any[]>([]);
const selectedCustomer = ref<any>({});
const serviceStore = useServiceStore();
const showCreateModal = ref(false);

// Handle input changes
const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('clear-error');
    emit('update:modelValue', target.value);
    filterCustomers();
};

// Filter customers based on search query
const filterCustomers = () => {
    const query = value.value.toLowerCase().trim();

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

// Select a customer from dropdown
const selectCustomer = (customer: any) => {
    selectedCustomer.value = { ...customer };
    value.value = `${customer.firstName} ${customer.lastName}`.trim();
    emit('update:modelValue', value.value);
    emit('customerSelected', selectedCustomer.value);
    filteredCustomers.value = [];
    isFocused.value = false;
};

// Handle search functionality
const handleSearch = () => {
    emit('search', value.value);
    filterCustomers();
};

// Handle focus states
const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    // Delay hiding dropdown to allow click on dropdown items
    setTimeout(() => {
        isFocused.value = false;
        filteredCustomers.value = [];
    }, 200);
};

// Fetch customers from API
const fetchCustomers = async () => {
    try {
        const serviceId = serviceStore.serviceId;
        const response = await getCustomer(serviceId!);
        customers.value = response.data.map((c: any) => {
            return {
                ...c,
                firstName: c.firstName,
                lastName: c.lastName,
                phoneNumber: c.phonePrimary,
                email: c.email
            };
        });
    } catch (error) {
        console.error('Failed to fetch customers:', error);
    }
};

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
    value.value = newValue;
}, { immediate: true });

// Watch for search query changes
watch(value, (newValue) => {
    const query = newValue.toLowerCase().trim();

    if (!query) {
        filteredCustomers.value = [];
        selectedCustomer.value = {};
        emit('customerSelected', null);
        return;
    }

    filterCustomers();

    const exactMatch = filteredCustomers.value.find(c =>
        `${c.firstName?.toLowerCase()} ${c.lastName?.toLowerCase()}`.trim() === query ||
        c.firstName?.toLowerCase() === query
    );

    if (exactMatch) {
        selectCustomer(exactMatch);
    } else {
        const newCustomer = { firstName: newValue };
        selectedCustomer.value.firstName = newValue;
        emit('customerSelected', newCustomer);
    }
});

// Handle opening create customer modal
const handleCreateCustomer = () => {
    showCreateModal.value = true;
};

// Handle when new customer is created
const handleCustomerCreated = (newCustomer: any) => {
    // Add the new customer to the list
    customers.value.unshift(newCustomer);
    
    // Select the newly created customer
    selectCustomer(newCustomer);
    
    // Close the modal
    showCreateModal.value = false;
};

// Fetch customers on component mount
onBeforeMount(() => {
    fetchCustomers();
});
</script>

<template>
    <div class="w-full relative">
        <label 
            v-if="lb" 
            :for="id" 
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
            :class="{ 'text-purple-500': isFocused }"
        >
            {{ lb }}
            <span v-if="isRequired" class="text-red-500">*</span>
        </label>
        
        <div class="relative">
            <!-- User Icon (left side) -->
            <div 
                v-if="showUserIcon" 
                class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
            >
                <button
                    type="button"
                    class="text-gray-400 dark:text-gray-500 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 transition-colors duration-200 p-1 rounded"
                    :class="{ 'text-purple-500': isFocused }"
                    @click="handleCreateCustomer"
                    :disabled="disabled"
                    :title="'Create new customer'"
                >
                    <UserIcon :size="18" />
                </button>
            </div>
            
            <!-- Input Field -->
            <input
                :id="id"
                v-model="value"
                type="text"
                :placeholder="placeholder"
                :required="isRequired"
                :disabled="disabled"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keydown.enter="handleSearch"
                :class="[
                    'dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800 transition-all duration-200',
                    showUserIcon ? 'pl-10' : 'pl-4',
                    showSearchIcon ? 'pr-10' : 'pr-4',
                    customClass,
                    {
                        'border-purple-500 ring-3 ring-purple-500/10': isFocused,
                        'cursor-not-allowed opacity-50': disabled
                    }
                ]"
            />
            
            <!-- Search Icon (right side) -->
            <button
                v-if="showSearchIcon"
                type="button"
                @click="handleSearch"
                :disabled="disabled"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors duration-200"
                :class="{
                    'cursor-not-allowed opacity-50': disabled,
                    'hover:text-purple-500': !disabled
                }"
            >
                <SearchIcon 
                    :size="18" 
                    class="text-gray-400 dark:text-gray-500"
                    :class="{ 'text-purple-500': isFocused }"
                />
            </button>
        </div>
        
        <!-- Customer Dropdown -->
        <div v-if="filteredCustomers.length > 0 && isFocused" class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div
                v-for="customer in filteredCustomers"
                :key="customer.id"
                class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors duration-200"
                @click="selectCustomer(customer)"
            >
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-medium text-gray-900 dark:text-white">
                            {{ customer.firstName }} {{ customer.lastName }}
                        </div>
                        <div v-if="customer.phoneNumber" class="text-sm text-gray-500 dark:text-gray-400">
                            {{ customer.phoneNumber }}
                        </div>
                    </div>
                    <div v-if="customer.email" class="text-sm text-gray-400 dark:text-gray-500">
                        {{ customer.email }}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Customer Create Modal -->
         <CustomerCreateModal
             :is-open="showCreateModal"
             :initial-data="{ firstName: value }"
             @close="showCreateModal = false"
             @customer-created="handleCustomerCreated"
         />
    </div>
</template>

<style scoped>
input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    border-color: #d1d5db;
}

.dark input:disabled {
    background-color: #374151;
    border-color: #4b5563;
}

/* Smooth transitions for focus states */
input {
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* Custom focus ring */
input:focus {
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}
</style>