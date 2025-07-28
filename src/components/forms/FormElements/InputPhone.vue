<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';

// Define an interface for the country object
interface Country {
    name: string;
    code: string;
    dial_code: string;
}

// Define props for v-model support
const props = defineProps<{
    modelValue: string |undefined; // The full phone number string (e.g., "+237671234567"),
    title: string,
    isRequired: boolean
}>();

// Define emits for v-model support
const emit = defineEmits(['update:modelValue']);

// Reactive state variables
const selectedCountryCode = ref<string>('+237'); // Default to Cameroon
const phoneNumber = ref<string>('');
const phoneNumberError = ref<string>(''); // This will store the i18n key for the error message

// Data for African countries
const africanCountries: Country[] = [
    { name: 'Algeria', code: 'DZ', dial_code: '+213' },
    { name: 'Angola', code: 'AO', dial_code: '+244' },
    { name: 'Benin', code: 'BJ', dial_code: '+229' },
    { name: 'Botswana', code: 'BW', dial_code: '+267' },
    { name: 'Burkina Faso', code: 'BF', dial_code: '+226' },
    { name: 'Burundi', code: 'BI', dial_code: '+257' },
    { name: 'Cabo Verde', code: 'CV', dial_code: '+238' },
    { name: 'Cameroon', code: 'CM', dial_code: '+237' },
    { name: 'Central African Republic', code: 'CF', dial_code: '+236' },
    { name: 'Chad', code: 'TD', dial_code: '+235' },
    { name: 'Comoros', code: 'KM', dial_code: '+269' },
    { name: 'Congo (Brazzaville)', code: 'CG', dial_code: '+242' },
    { name: 'Congo (Kinshasa)', code: 'CD', dial_code: '+243' },
    { name: 'Côte d\'Ivoire', code: 'CI', dial_code: '+225' },
    { name: 'Djibouti', code: 'DJ', dial_code: '+253' },
    { name: 'Egypt', code: 'EG', dial_code: '+20' },
    { name: 'Equatorial Guinea', code: 'GQ', dial_code: '+240' },
    { name: 'Eritrea', code: 'ER', dial_code: '+291' },
    { name: 'Eswatini', code: 'SZ', dial_code: '+268' },
    { name: 'Ethiopia', code: 'ET', dial_code: '+251' },
    { name: 'Gabon', code: 'GA', dial_code: '+241' },
    { name: 'Gambia', code: 'GM', dial_code: '+220' },
    { name: 'Ghana', code: 'GH', dial_code: '+233' },
    { name: 'Guinea', code: 'GN', dial_code: '+224' },
    { name: 'Guinea-Bissau', code: 'GW', dial_code: '+245' },
    { name: 'Kenya', code: 'KE', dial_code: '+254' },
    { name: 'Lesotho', code: 'LS', dial_code: '+266' },
    { name: 'Liberia', code: 'LR', dial_code: '+231' },
    { name: 'Libya', code: 'LY', dial_code: '+218' },
    { name: 'Madagascar', code: 'MG', dial_code: '+261' },
    { name: 'Malawi', code: 'MW', dial_code: '+265' },
    { name: 'Mali', code: 'ML', dial_code: '+223' },
    { name: 'Mauritania', code: 'MR', dial_code: '+222' },
    { name: 'Mauritius', code: 'MU', dial_code: '+230' },
    { name: 'Morocco', code: 'MA', dial_code: '+212' },
    { name: 'Mozambique', code: 'MZ', dial_code: '+258' },
    { name: 'Namibia', code: 'NA', dial_code: '+264' },
    { name: 'Niger', code: 'NE', dial_code: '+227' },
    { name: 'Nigeria', code: 'NG', dial_code: '+234' },
    { name: 'Rwanda', code: 'RW', dial_code: '+250' },
    { name: 'Sao Tome & Principe', code: 'ST', dial_code: '+239' },
    { name: 'Senegal', code: 'SN', dial_code: '+221' },
    { name: 'Seychelles', code: 'SC', dial_code: '+248' },
    { name: 'Sierra Leone', code: 'SL', dial_code: '+232' },
    { name: 'Somalia', code: 'SO', dial_code: '+252' },
    { name: 'South Africa', code: 'ZA', dial_code: '+27' },
    { name: 'South Sudan', code: 'SS', dial_code: '+211' },
    { name: 'Sudan', code: 'SD', dial_code: '+249' },
    { name: 'Tanzania', code: 'TZ', dial_code: '+255' },
    { name: 'Togo', code: 'TG', dial_code: '+228' },
    { name: 'Tunisia', code: 'TN', dial_code: '+216' },
    { name: 'Uganda', code: 'UG', dial_code: '+256' },
    { name: 'Zambia', code: 'ZM', dial_code: '+260' },
    { name: 'Zimbabwe', code: 'ZW', dial_code: '+263' }
];

// Validation function
const validatePhoneNumber = () => {
    let errorMessageKey: string = '';

    // Only validate if Cameroon is selected
    if (selectedCountryCode.value === '+237') {
        // Cameroon phone number format: 9 digits, starting with 2, 3, 5, 6, 7, or 8
        const cameroonRegex = /^(2|3|5|6|7|8)\d{8}$/;

        if (!phoneNumber.value) {
            errorMessageKey = 'phoneNumberRequired';
        } else if (!cameroonRegex.test(phoneNumber.value)) {
            errorMessageKey = 'invalidCameroonFormat';
        }
    } else {
        // For other countries, a basic check for digits (can be expanded for specific country formats)
        if (phoneNumber.value && !/^\d+$/.test(phoneNumber.value)) {
            errorMessageKey = 'phoneNumberDigitsOnly';
        }
    }
    phoneNumberError.value = errorMessageKey;
};

// Computed property to combine country code and phone number for v-model
const fullPhoneNumber = computed<string>({
    get() {
        // Return the combined phone number for the v-model binding
        return `${selectedCountryCode.value}${phoneNumber.value}`;
    },
    set(newValue: string) {
        // When v-model updates, parse the new value to update internal refs
        let foundCountryCode = false;
        for (const country of africanCountries) {
            if (newValue.startsWith(country.dial_code)) {
                selectedCountryCode.value = country.dial_code;
                phoneNumber.value = newValue.substring(country.dial_code.length);
                foundCountryCode = true;
                break;
            }
        }
        // If no matching country code is found, default to Cameroon and set the whole value as phone number
        if (!foundCountryCode) {
            selectedCountryCode.value = '+237';
            phoneNumber.value = newValue;
        }
    }
});

// Watchers for reactivity
watch(selectedCountryCode, () => {
    validatePhoneNumber();
    emit('update:modelValue', fullPhoneNumber.value); // Emit combined value on country code change
});
watch(phoneNumber, () => {
    validatePhoneNumber();
    emit('update:modelValue', fullPhoneNumber.value); // Emit combined value on phone number change
});

// Watch for external modelValue changes and update internal state
watch(() => props.modelValue, (newValue) => {
    if (newValue !== fullPhoneNumber.value) { // Prevent infinite loop
        fullPhoneNumber.value = newValue as string;
    }
}, { immediate: true }); // Run immediately on component mount

// Initial validation on mount
onMounted(() => {
    // validatePhoneNumber();
});
</script>

<template>
    <div>
        <label for="phone-input-group" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{
            title }} <span v-if="isRequired" class="text-red-500">*</span></label>
        <div class="mt-1 flex rounded-lg shadow-sm">
            <!-- Country Code Selector -->
            <div class="relative flex-grow-0">
                <select id="country-code" name="country-code" v-model="selectedCountryCode"
                    class="h-11 pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-l-lg focus:outline-none focus:ring-purple-500/10 focus:border-purple-300 sm:text-sm appearance-none cursor-pointer transition duration-150 ease-in-out hover:border-purple-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-purple-800">
                    <option v-for="country in africanCountries" :key="country.code" :value="country.dial_code">
                        {{ country.dial_code }}
                    </option>
                </select>
                <!-- Custom arrow for select dropdown -->
                <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                        aria-hidden="true">
                        <path fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            <!-- Phone Number Input -->
            <input type="tel" id="phone-number" name="phone-number" v-model="phoneNumber" :required="isRequired"
                class="h-11 w-full flex-1 rounded-r-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800 -ml-px"
                :placeholder="$t('phoneNumberPlaceholder')" aria-describedby="phone-number-error" />
        </div>
        <!-- Validation Message -->
        <p v-if="phoneNumberError" id="phone-number-error" class="mt-2 text-sm text-red-600 font-medium">
            {{ $t(phoneNumberError) }}
        </p>
    </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed. */
/* The original code had an empty style block, so keeping it minimal. */
</style>
