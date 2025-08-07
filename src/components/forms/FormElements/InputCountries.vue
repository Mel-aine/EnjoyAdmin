<template>
  <div class="country-autocomplete w-full max-w-md mx-auto ">
    <label for="country-input" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ $t('country') }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        id="country-input"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @focus="isOpen = true"
        @blur="handleBlur"
        class="flex justify-between dark:bg-dark-900 h-11 w-full  rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
        :placeholder="$t('search_country')"
        autocomplete="off"
      />
      <ul
        v-if="isOpen && filteredCountries.length"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        <li
          v-for="country in filteredCountries"
          :key="country.value"
          @mousedown.prevent="selectCountry(country)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white transition-colors duration-150 ease-in-out rounded-md"
        >
          <span class="block truncate">{{ country.label }}</span>
        </li>
      </ul>
      <div v-else-if="isOpen && !filteredCountries.length && searchQuery"
           class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-2 px-3 text-sm text-gray-500">
        {{ $t('no_results') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: String,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['update:modelValue', 'select', 'change']);

const searchQuery = ref<string>('');
const isOpen = ref<boolean>(false);

// A comprehensive list of all countries.
// In a real application, you might fetch this from an API or a larger static JSON file.
// For demonstration, I'm including a common list here.
const allCountries = computed(() => [
  { value: 'AF', label: t('countries_list.af') || 'Afghanistan' },
  { value: 'AL', label: t('countries_list.al') || 'Albania' },
  { value: 'DZ', label: t('countries_list.dz') || 'Algeria' },
  { value: 'AD', label: t('countries_list.ad') || 'Andorra' },
  { value: 'AO', label: t('countries_list.ao') || 'Angola' },
  { value: 'AG', label: t('countries_list.ag') || 'Antigua and Barbuda' },
  { value: 'AR', label: t('countries_list.ar') || 'Argentina' },
  { value: 'AM', label: t('countries_list.am') || 'Armenia' },
  { value: 'AU', label: t('countries_list.au') || 'Australia' },
  { value: 'AT', label: t('countries_list.at') || 'Austria' },
  { value: 'AZ', label: t('countries_list.az') || 'Azerbaijan' },
  { value: 'BS', label: t('countries_list.bs') || 'Bahamas' },
  { value: 'BH', label: t('countries_list.bh') || 'Bahrain' },
  { value: 'BD', label: t('countries_list.bd') || 'Bangladesh' },
  { value: 'BB', label: t('countries_list.bb') || 'Barbados' },
  { value: 'BY', label: t('countries_list.by') || 'Belarus' },
  { value: 'BE', label: t('countries_list.be') || 'Belgium' },
  { value: 'BZ', label: t('countries_list.bz') || 'Belize' },
  { value: 'BJ', label: t('countries_list.bj') || 'Benin' },
  { value: 'BT', label: t('countries_list.bt') || 'Bhutan' },
  { value: 'BO', label: t('countries_list.bo') || 'Bolivia' },
  { value: 'BA', label: t('countries_list.ba') || 'Bosnia and Herzegovina' },
  { value: 'BW', label: t('countries_list.bw') || 'Botswana' },
  { value: 'BR', label: t('countries_list.br') || 'Brazil' },
  { value: 'BN', label: t('countries_list.bn') || 'Brunei Darussalam' },
  { value: 'BG', label: t('countries_list.bg') || 'Bulgaria' },
  { value: 'BF', label: t('countries_list.bf') || 'Burkina Faso' },
  { value: 'BI', label: t('countries_list.bi') || 'Burundi' },
  { value: 'CV', label: t('countries_list.cv') || 'Cabo Verde' },
  { value: 'KH', label: t('countries_list.kh') || 'Cambodia' },
  { value: 'CM', label: t('countries_list.cm') || 'Cameroon' },
  { value: 'CA', label: t('countries_list.ca') || 'Canada' },
  { value: 'CF', label: t('countries_list.cf') || 'Central African Republic' },
  { value: 'TD', label: t('countries_list.td') || 'Chad' },
  { value: 'CL', label: t('countries_list.cl') || 'Chile' },
  { value: 'CN', label: t('countries_list.cn') || 'China' },
  { value: 'CO', label: t('countries_list.co') || 'Colombia' },
  { value: 'KM', label: t('countries_list.km') || 'Comoros' },
  { value: 'CD', label: t('countries_list.cd') || 'Congo, Dem. Rep.' },
  { value: 'CG', label: t('countries_list.cg') || 'Congo, Rep.' },
  { value: 'CR', label: t('countries_list.cr') || 'Costa Rica' },
  { value: 'CI', label: t('countries_list.ci') || 'Cote d\'Ivoire' },
  { value: 'HR', label: t('countries_list.hr') || 'Croatia' },
  { value: 'CU', label: t('countries_list.cu') || 'Cuba' },
  { value: 'CY', label: t('countries_list.cy') || 'Cyprus' },
  { value: 'CZ', label: t('countries_list.cz') || 'Czechia' },
  { value: 'DK', label: t('countries_list.dk') || 'Denmark' },
  { value: 'DJ', label: t('countries_list.dj') || 'Djibouti' },
  { value: 'DM', label: t('countries_list.dm') || 'Dominica' },
  { value: 'DO', label: t('countries_list.do') || 'Dominican Republic' },
  { value: 'EC', label: t('countries_list.ec') || 'Ecuador' },
  { value: 'EG', label: t('countries_list.eg') || 'Egypt' },
  { value: 'SV', label: t('countries_list.sv') || 'El Salvador' },
  { value: 'GQ', label: t('countries_list.gq') || 'Equatorial Guinea' },
  { value: 'ER', label: t('countries_list.er') || 'Eritrea' },
  { value: 'EE', label: t('countries_list.ee') || 'Estonia' },
  { value: 'SZ', label: t('countries_list.sz') || 'Eswatini' },
  { value: 'ET', label: t('countries_list.et') || 'Ethiopia' },
  { value: 'FJ', label: t('countries_list.fj') || 'Fiji' },
  { value: 'FI', label: t('countries_list.fi') || 'Finland' },
  { value: 'FR', label: t('countries_list.fr') || 'France' },
  { value: 'GA', label: t('countries_list.ga') || 'Gabon' },
  { value: 'GM', label: t('countries_list.gm') || 'Gambia' },
  { value: 'GE', label: t('countries_list.ge') || 'Georgia' },
  { value: 'DE', label: t('countries_list.de') || 'Germany' },
  { value: 'GH', label: t('countries_list.gh') || 'Ghana' },
  { value: 'GR', label: t('countries_list.gr') || 'Greece' },
  { value: 'GD', label: t('countries_list.gd') || 'Grenada' },
  { value: 'GT', label: t('countries_list.gt') || 'Guatemala' },
  { value: 'GN', label: t('countries_list.gn') || 'Guinea' },
  { value: 'GW', label: t('countries_list.gw') || 'Guinea-Bissau' },
  { value: 'GY', label: t('countries_list.gy') || 'Guyana' },
  { value: 'HT', label: t('countries_list.ht') || 'Haiti' },
  { value: 'HN', label: t('countries_list.hn') || 'Honduras' },
  { value: 'HU', label: t('countries_list.hu') || 'Hungary' },
  { value: 'IS', label: t('countries_list.is') || 'Iceland' },
  { value: 'IN', label: t('countries_list.in') || 'India' },
  { value: 'ID', label: t('countries_list.id') || 'Indonesia' },
  { value: 'IR', label: t('countries_list.ir') || 'Iran' },
  { value: 'IQ', label: t('countries_list.iq') || 'Iraq' },
  { value: 'IE', label: t('countries_list.ie') || 'Ireland' },
  { value: 'IL', label: t('countries_list.il') || 'Israel' },
  { value: 'IT', label: t('countries_list.it') || 'Italy' },
  { value: 'JM', label: t('countries_list.jm') || 'Jamaica' },
  { value: 'JP', label: t('countries_list.jp') || 'Japan' },
  { value: 'JO', label: t('countries_list.jo') || 'Jordan' },
  { value: 'KZ', label: t('countries_list.kz') || 'Kazakhstan' },
  { value: 'KE', label: t('countries_list.ke') || 'Kenya' },
  { value: 'KI', label: t('countries_list.ki') || 'Kiribati' },
  { value: 'KP', label: t('countries_list.kp') || 'Korea, Dem. People\'s Rep.' },
  { value: 'KR', label: t('countries_list.kr') || 'Korea, Rep.' },
  { value: 'KW', label: t('countries_list.kw') || 'Kuwait' },
  { value: 'KG', label: t('countries_list.kg') || 'Kyrgyzstan' },
  { value: 'LA', label: t('countries_list.la') || 'Lao PDR' },
  { value: 'LV', label: t('countries_list.lv') || 'Latvia' },
  { value: 'LB', label: t('countries_list.lb') || 'Lebanon' },
  { value: 'LS', label: t('countries_list.ls') || 'Lesotho' },
  { value: 'LR', label: t('countries_list.lr') || 'Liberia' },
  { value: 'LY', label: t('countries_list.ly') || 'Libya' },
  { value: 'LI', label: t('countries_list.li') || 'Liechtenstein' },
  { value: 'LT', label: t('countries_list.lt') || 'Lithuania' },
  { value: 'LU', label: t('countries_list.lu') || 'Luxembourg' },
  { value: 'MG', label: t('countries_list.mg') || 'Madagascar' },
  { value: 'MW', label: t('countries_list.mw') || 'Malawi' },
  { value: 'MY', label: t('countries_list.my') || 'Malaysia' },
  { value: 'MV', label: t('countries_list.mv') || 'Maldives' },
  { value: 'ML', label: t('countries_list.ml') || 'Mali' },
  { value: 'MT', label: t('countries_list.mt') || 'Malta' },
  { value: 'MH', label: t('countries_list.mh') || 'Marshall Islands' },
  { value: 'MR', label: t('countries_list.mr') || 'Mauritania' },
  { value: 'MU', label: t('countries_list.mu') || 'Mauritius' },
  { value: 'MX', label: t('countries_list.mx') || 'Mexico' },
  { value: 'FM', label: t('countries_list.fm') || 'Micronesia, Fed. Sts.' },
  { value: 'MD', label: t('countries_list.md') || 'Moldova' },
  { value: 'MC', label: t('countries_list.mc') || 'Monaco' },
  { value: 'MN', label: t('countries_list.mn') || 'Mongolia' },
  { value: 'ME', label: t('countries_list.me') || 'Montenegro' },
  { value: 'MA', label: t('countries_list.ma') || 'Morocco' },
  { value: 'MZ', label: t('countries_list.mz') || 'Mozambique' },
  { value: 'MM', label: t('countries_list.mm') || 'Myanmar' },
  { value: 'NA', label: t('countries_list.na') || 'Namibia' },
  { value: 'NR', label: t('countries_list.nr') || 'Nauru' },
  { value: 'NP', label: t('countries_list.np') || 'Nepal' },
  { value: 'NL', label: t('countries_list.nl') || 'Netherlands' },
  { value: 'NZ', label: t('countries_list.nz') || 'New Zealand' },
  { value: 'NI', label: t('countries_list.ni') || 'Nicaragua' },
  { value: 'NE', label: t('countries_list.ne') || 'Niger' },
  { value: 'NG', label: t('countries_list.ng') || 'Nigeria' },
  { value: 'MK', label: t('countries_list.mk') || 'North Macedonia' },
  { value: 'NO', label: t('countries_list.no') || 'Norway' },
  { value: 'OM', label: t('countries_list.om') || 'Oman' },
  { value: 'PK', label: t('countries_list.pk') || 'Pakistan' },
  { value: 'PW', label: t('countries_list.pw') || 'Palau' },
  { value: 'PA', label: t('countries_list.pa') || 'Panama' },
  { value: 'PG', label: t('countries_list.pg') || 'Papua New Guinea' },
  { value: 'PY', label: t('countries_list.py') || 'Paraguay' },
  { value: 'PE', label: t('countries_list.pe') || 'Peru' },
  { value: 'PH', label: t('countries_list.ph') || 'Philippines' },
  { value: 'PL', label: t('countries_list.pl') || 'Poland' },
  { value: 'PT', label: t('countries_list.pt') || 'Portugal' },
  { value: 'QA', label: t('countries_list.qa') || 'Qatar' },
  { value: 'RO', label: t('countries_list.ro') || 'Romania' },
  { value: 'RU', label: t('countries_list.ru') || 'Russian Federation' },
  { value: 'RW', label: t('countries_list.rw') || 'Rwanda' },
  { value: 'KN', label: t('countries_list.kn') || 'Saint Kitts and Nevis' },
  { value: 'LC', label: t('countries_list.lc') || 'Saint Lucia' },
  { value: 'VC', label: t('countries_list.vc') || 'Saint Vincent and the Grenadines' },
  { value: 'WS', label: t('countries_list.ws') || 'Samoa' },
  { value: 'SM', label: t('countries_list.sm') || 'San Marino' },
  { value: 'ST', label: t('countries_list.st') || 'Sao Tome and Principe' },
  { value: 'SA', label: t('countries_list.sa') || 'Saudi Arabia' },
  { value: 'SN', label: t('countries_list.sn') || 'Senegal' },
  { value: 'RS', label: t('countries_list.rs') || 'Serbia' },
  { value: 'SC', label: t('countries_list.sc') || 'Seychelles' },
  { value: 'SL', label: t('countries_list.sl') || 'Sierra Leone' },
  { value: 'SG', label: t('countries_list.sg') || 'Singapore' },
  { value: 'SK', label: t('countries_list.sk') || 'Slovak Republic' },
  { value: 'SI', label: t('countries_list.si') || 'Slovenia' },
  { value: 'SB', label: t('countries_list.sb') || 'Solomon Islands' },
  { value: 'SO', label: t('countries_list.so') || 'Somalia' },
  { value: 'ZA', label: t('countries_list.za') || 'South Africa' },
  { value: 'SS', label: t('countries_list.ss') || 'South Sudan' },
  { value: 'ES', label: t('countries_list.es') || 'Spain' },
  { value: 'LK', label: t('countries_list.lk') || 'Sri Lanka' },
  { value: 'SD', label: t('countries_list.sd') || 'Sudan' },
  { value: 'SR', label: t('countries_list.sr') || 'Suriname' },
  { value: 'SE', label: t('countries_list.se') || 'Sweden' },
  { value: 'CH', label: t('countries_list.ch') || 'Switzerland' },
  { value: 'SY', label: t('countries_list.sy') || 'Syrian Arab Republic' },
  { value: 'TW', label: t('countries_list.tw') || 'Taiwan' },
  { value: 'TJ', label: t('countries_list.tj') || 'Tajikistan' },
  { value: 'TZ', label: t('countries_list.tz') || 'Tanzania' },
  { value: 'TH', label: t('countries_list.th') || 'Thailand' },
  { value: 'TL', label: t('countries_list.tl') || 'Timor-Leste' },
  { value: 'TG', label: t('countries_list.tg') || 'Togo' },
  { value: 'TO', label: t('countries_list.to') || 'Tonga' },
  { value: 'TT', label: t('countries_list.tt') || 'Trinidad and Tobago' },
  { value: 'TN', label: t('countries_list.tn') || 'Tunisia' },
  { value: 'TR', label: t('countries_list.tr') || 'Turkey' },
  { value: 'TM', label: t('countries_list.tm') || 'Turkmenistan' },
  { value: 'TV', label: t('countries_list.tv') || 'Tuvalu' },
  { value: 'UG', label: t('countries_list.ug') || 'Uganda' },
  { value: 'UA', label: t('countries_list.ua') || 'Ukraine' },
  { value: 'AE', label: t('countries_list.ae') || 'United Arab Emirates' },
  { value: 'GB', label: t('countries_list.gb') || 'United Kingdom' },
  { value: 'US', label: t('countries_list.us') || 'United States' },
  { value: 'UY', label: t('countries_list.uy') || 'Uruguay' },
  { value: 'UZ', label: t('countries_list.uz') || 'Uzbekistan' },
  { value: 'VU', label: t('countries_list.vu') || 'Vanuatu' },
  { value: 'VE', label: t('countries_list.ve') || 'Venezuela' },
  { value: 'VN', label: t('countries_list.vn') || 'Vietnam' },
  { value: 'YE', label: t('countries_list.ye') || 'Yemen' },
  { value: 'ZM', label: t('countries_list.zm') || 'Zambia' },
  { value: 'ZW', label: t('countries_list.zw') || 'Zimbabwe' },
]);

// Filters the list of all countries based on the search query
const filteredCountries = computed(() => {
  if (!searchQuery.value) {
    // If no search query, show all countries when dropdown is open
    return allCountries.value;
  }
  const query = searchQuery.value.toLowerCase();
  return allCountries.value.filter(country =>
    country.label.toLowerCase().includes(query)
  );
});

// Watch for changes in the `modelValue` prop and update `searchQuery`
watch(
  () => props.modelValue,
  (newVal) => {
    const selected = allCountries.value.find((c) => c.value === newVal);
    searchQuery.value = selected ? selected.label : '';
  },
  { immediate: true } // Run immediately on component mount
);

// Handles input events, ensuring the dropdown opens
const handleInput = () => {
  isOpen.value = true;
  // Emit change event for potential external listeners
  emits('change', searchQuery.value);
};

// Handles blur event with a slight delay to allow click on suggestions
const handleBlur = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 200); // Small delay to allow click event on list items to fire
};

// Selects a country from the filtered list
const selectCountry = (country: { value: string; label: string }) => {
  searchQuery.value = country.label;
  emits('update:modelValue', country.value);
  emits('select', country.value); // Emit custom select event
  emits('change', country.value); // Emit custom change event with the selected value
  isOpen.value = false;
};
</script>

<style scoped>
/* Tailwind CSS is used for styling, so no custom <style> block is strictly needed
   unless you want to add very specific, non-Tailwind styles.
   The classes like `w-full`, `px-3`, `py-2`, `border`, `rounded-md`, `shadow-sm`,
   `focus:outline-none`, `focus:ring-2`, `focus:ring-indigo-500`,
   `focus:border-indigo-500`, `sm:text-sm`, `absolute`, `z-10`, `mt-1`, `bg-white`,
   `max-h-60`, `overflow-auto`, `cursor-pointer`, `select-none`, `relative`,
   `pl-3`, `pr-9`, `hover:bg-indigo-600`, `hover:text-white`, `transition-colors`,
   `duration-150`, `ease-in-out` are all from Tailwind CSS.
*/
</style>