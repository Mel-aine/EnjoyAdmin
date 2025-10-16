<template>
  <div class="country-autocomplete w-full max-w-md mx-auto">
    <label for="country-input" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ $t(lb) }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        id="country-input"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        :disabled="disabled"
       :class="[

          'flex justify-between h-11 w-full  border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
          {
            'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800': disabled,
            'border-black/50': !disabled,
            'border-gray-200': disabled
          },
          props.customClass
        ]"

        :placeholder="$t('search_country')"
        autocomplete="off"
      />

      <!-- Dropdown only shows when not disabled -->
      <ul
        v-if="isOpen && filteredCountries.length && !disabled"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm dark:bg-gray-800 dark:ring-gray-600"
      >
        <li
          v-for="country in filteredCountries"
          :key="country.value"
          @mousedown.prevent="selectCountry(country)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors duration-150 ease-in-out rounded-md"
        >
          <span class="block truncate">{{ country.label }}</span>
        </li>
      </ul>

      <!-- No results message -->
      <div
        v-else-if="isOpen && !filteredCountries.length && searchQuery && !disabled"
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 px-3 text-sm text-gray-500 dark:text-gray-400"
      >
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
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  lb: {
    type: String,
    default: 'country',
  },
  customClass: {
    type: String,
    default: '',
  }
});

const emits = defineEmits(['update:modelValue', 'select', 'change']);

const searchQuery = ref<string>('');
const isOpen = ref<boolean>(false);

// A comprehensive list of all countries
const allCountries = computed(() => [
  { value: 'AF', label: t('countries_lists.af') || 'Afghanistan' },
  { value: 'AL', label: t('countries_lists.al') || 'Albania' },
  { value: 'DZ', label: t('countries_lists.dz') || 'Algeria' },
  { value: 'AD', label: t('countries_lists.ad') || 'Andorra' },
  { value: 'AO', label: t('countries_lists.ao') || 'Angola' },
  { value: 'AG', label: t('countries_lists.ag') || 'Antigua and Barbuda' },
  { value: 'AR', label: t('countries_lists.ar') || 'Argentina' },
  { value: 'AM', label: t('countries_lists.am') || 'Armenia' },
  { value: 'AU', label: t('countries_lists.au') || 'Australia' },
  { value: 'AT', label: t('countries_lists.at') || 'Austria' },
  { value: 'AZ', label: t('countries_lists.az') || 'Azerbaijan' },
  { value: 'BS', label: t('countries_lists.bs') || 'Bahamas' },
  { value: 'BH', label: t('countries_lists.bh') || 'Bahrain' },
  { value: 'BD', label: t('countries_lists.bd') || 'Bangladesh' },
  { value: 'BB', label: t('countries_lists.bb') || 'Barbados' },
  { value: 'BY', label: t('countries_lists.by') || 'Belarus' },
  { value: 'BE', label: t('countries_lists.be') || 'Belgium' },
  { value: 'BZ', label: t('countries_lists.bz') || 'Belize' },
  { value: 'BJ', label: t('countries_lists.bj') || 'Benin' },
  { value: 'BT', label: t('countries_lists.bt') || 'Bhutan' },
  { value: 'BO', label: t('countries_lists.bo') || 'Bolivia' },
  { value: 'BA', label: t('countries_lists.ba') || 'Bosnia and Herzegovina' },
  { value: 'BW', label: t('countries_lists.bw') || 'Botswana' },
  { value: 'BR', label: t('countries_lists.br') || 'Brazil' },
  { value: 'BN', label: t('countries_lists.bn') || 'Brunei Darussalam' },
  { value: 'BG', label: t('countries_lists.bg') || 'Bulgaria' },
  { value: 'BF', label: t('countries_lists.bf') || 'Burkina Faso' },
  { value: 'BI', label: t('countries_lists.bi') || 'Burundi' },
  { value: 'CV', label: t('countries_lists.cv') || 'Cabo Verde' },
  { value: 'KH', label: t('countries_lists.kh') || 'Cambodia' },
  { value: 'CM', label: t('countries_lists.cm') || 'Cameroon' },
  { value: 'CA', label: t('countries_lists.ca') || 'Canada' },
  { value: 'CF', label: t('countries_lists.cf') || 'Central African Republic' },
  { value: 'TD', label: t('countries_lists.td') || 'Chad' },
  { value: 'CL', label: t('countries_lists.cl') || 'Chile' },
  { value: 'CN', label: t('countries_lists.cn') || 'China' },
  { value: 'CO', label: t('countries_lists.co') || 'Colombia' },
  { value: 'KM', label: t('countries_lists.km') || 'Comoros' },
  { value: 'CD', label: t('countries_lists.cd') || 'Congo, Dem. Rep.' },
  { value: 'CG', label: t('countries_lists.cg') || 'Congo, Rep.' },
  { value: 'CR', label: t('countries_lists.cr') || 'Costa Rica' },
  { value: 'CI', label: t('countries_lists.ci') || 'Cote d\'Ivoire' },
  { value: 'HR', label: t('countries_lists.hr') || 'Croatia' },
  { value: 'CU', label: t('countries_lists.cu') || 'Cuba' },
  { value: 'CY', label: t('countries_lists.cy') || 'Cyprus' },
  { value: 'CZ', label: t('countries_lists.cz') || 'Czechia' },
  { value: 'DK', label: t('countries_lists.dk') || 'Denmark' },
  { value: 'DJ', label: t('countries_lists.dj') || 'Djibouti' },
  { value: 'DM', label: t('countries_lists.dm') || 'Dominica' },
  { value: 'DO', label: t('countries_lists.do') || 'Dominican Republic' },
  { value: 'EC', label: t('countries_lists.ec') || 'Ecuador' },
  { value: 'EG', label: t('countries_lists.eg') || 'Egypt' },
  { value: 'SV', label: t('countries_lists.sv') || 'El Salvador' },
  { value: 'GQ', label: t('countries_lists.gq') || 'Equatorial Guinea' },
  { value: 'ER', label: t('countries_lists.er') || 'Eritrea' },
  { value: 'EE', label: t('countries_lists.ee') || 'Estonia' },
  { value: 'SZ', label: t('countries_lists.sz') || 'Eswatini' },
  { value: 'ET', label: t('countries_lists.et') || 'Ethiopia' },
  { value: 'FJ', label: t('countries_lists.fj') || 'Fiji' },
  { value: 'FI', label: t('countries_lists.fi') || 'Finland' },
  { value: 'FR', label: t('countries_lists.fr') || 'France' },
  { value: 'GA', label: t('countries_lists.ga') || 'Gabon' },
  { value: 'GM', label: t('countries_lists.gm') || 'Gambia' },
  { value: 'GE', label: t('countries_lists.ge') || 'Georgia' },
  { value: 'DE', label: t('countries_lists.de') || 'Germany' },
  { value: 'GH', label: t('countries_lists.gh') || 'Ghana' },
  { value: 'GR', label: t('countries_lists.gr') || 'Greece' },
  { value: 'GD', label: t('countries_lists.gd') || 'Grenada' },
  { value: 'GT', label: t('countries_lists.gt') || 'Guatemala' },
  { value: 'GN', label: t('countries_lists.gn') || 'Guinea' },
  { value: 'GW', label: t('countries_lists.gw') || 'Guinea-Bissau' },
  { value: 'GY', label: t('countries_lists.gy') || 'Guyana' },
  { value: 'HT', label: t('countries_lists.ht') || 'Haiti' },
  { value: 'HN', label: t('countries_lists.hn') || 'Honduras' },
  { value: 'HU', label: t('countries_lists.hu') || 'Hungary' },
  { value: 'IS', label: t('countries_lists.is') || 'Iceland' },
  { value: 'IN', label: t('countries_lists.in') || 'India' },
  { value: 'ID', label: t('countries_lists.id') || 'Indonesia' },
  { value: 'IR', label: t('countries_lists.ir') || 'Iran' },
  { value: 'IQ', label: t('countries_lists.iq') || 'Iraq' },
  { value: 'IE', label: t('countries_lists.ie') || 'Ireland' },
  { value: 'IL', label: t('countries_lists.il') || 'Israel' },
  { value: 'IT', label: t('countries_lists.it') || 'Italy' },
  { value: 'JM', label: t('countries_lists.jm') || 'Jamaica' },
  { value: 'JP', label: t('countries_lists.jp') || 'Japan' },
  { value: 'JO', label: t('countries_lists.jo') || 'Jordan' },
  { value: 'KZ', label: t('countries_lists.kz') || 'Kazakhstan' },
  { value: 'KE', label: t('countries_lists.ke') || 'Kenya' },
  { value: 'KI', label: t('countries_lists.ki') || 'Kiribati' },
  { value: 'KP', label: t('countries_lists.kp') || 'Korea, Dem. People\'s Rep.' },
  { value: 'KR', label: t('countries_lists.kr') || 'Korea, Rep.' },
  { value: 'KW', label: t('countries_lists.kw') || 'Kuwait' },
  { value: 'KG', label: t('countries_lists.kg') || 'Kyrgyzstan' },
  { value: 'LA', label: t('countries_lists.la') || 'Lao PDR' },
  { value: 'LV', label: t('countries_lists.lv') || 'Latvia' },
  { value: 'LB', label: t('countries_lists.lb') || 'Lebanon' },
  { value: 'LS', label: t('countries_lists.ls') || 'Lesotho' },
  { value: 'LR', label: t('countries_lists.lr') || 'Liberia' },
  { value: 'LY', label: t('countries_lists.ly') || 'Libya' },
  { value: 'LI', label: t('countries_lists.li') || 'Liechtenstein' },
  { value: 'LT', label: t('countries_lists.lt') || 'Lithuania' },
  { value: 'LU', label: t('countries_lists.lu') || 'Luxembourg' },
  { value: 'MG', label: t('countries_lists.mg') || 'Madagascar' },
  { value: 'MW', label: t('countries_lists.mw') || 'Malawi' },
  { value: 'MY', label: t('countries_lists.my') || 'Malaysia' },
  { value: 'MV', label: t('countries_lists.mv') || 'Maldives' },
  { value: 'ML', label: t('countries_lists.ml') || 'Mali' },
  { value: 'MT', label: t('countries_lists.mt') || 'Malta' },
  { value: 'MH', label: t('countries_lists.mh') || 'Marshall Islands' },
  { value: 'MR', label: t('countries_lists.mr') || 'Mauritania' },
  { value: 'MU', label: t('countries_lists.mu') || 'Mauritius' },
  { value: 'MX', label: t('countries_lists.mx') || 'Mexico' },
  { value: 'FM', label: t('countries_lists.fm') || 'Micronesia, Fed. Sts.' },
  { value: 'MD', label: t('countries_lists.md') || 'Moldova' },
  { value: 'MC', label: t('countries_lists.mc') || 'Monaco' },
  { value: 'MN', label: t('countries_lists.mn') || 'Mongolia' },
  { value: 'ME', label: t('countries_lists.me') || 'Montenegro' },
  { value: 'MA', label: t('countries_lists.ma') || 'Morocco' },
  { value: 'MZ', label: t('countries_lists.mz') || 'Mozambique' },
  { value: 'MM', label: t('countries_lists.mm') || 'Myanmar' },
  { value: 'NA', label: t('countries_lists.na') || 'Namibia' },
  { value: 'NR', label: t('countries_lists.nr') || 'Nauru' },
  { value: 'NP', label: t('countries_lists.np') || 'Nepal' },
  { value: 'NL', label: t('countries_lists.nl') || 'Netherlands' },
  { value: 'NZ', label: t('countries_lists.nz') || 'New Zealand' },
  { value: 'NI', label: t('countries_lists.ni') || 'Nicaragua' },
  { value: 'NE', label: t('countries_lists.ne') || 'Niger' },
  { value: 'NG', label: t('countries_lists.ng') || 'Nigeria' },
  { value: 'MK', label: t('countries_lists.mk') || 'North Macedonia' },
  { value: 'NO', label: t('countries_lists.no') || 'Norway' },
  { value: 'OM', label: t('countries_lists.om') || 'Oman' },
  { value: 'PK', label: t('countries_lists.pk') || 'Pakistan' },
  { value: 'PW', label: t('countries_lists.pw') || 'Palau' },
  { value: 'PA', label: t('countries_lists.pa') || 'Panama' },
  { value: 'PG', label: t('countries_lists.pg') || 'Papua New Guinea' },
  { value: 'PY', label: t('countries_lists.py') || 'Paraguay' },
  { value: 'PE', label: t('countries_lists.pe') || 'Peru' },
  { value: 'PH', label: t('countries_lists.ph') || 'Philippines' },
  { value: 'PL', label: t('countries_lists.pl') || 'Poland' },
  { value: 'PT', label: t('countries_lists.pt') || 'Portugal' },
  { value: 'QA', label: t('countries_lists.qa') || 'Qatar' },
  { value: 'RO', label: t('countries_lists.ro') || 'Romania' },
  { value: 'RU', label: t('countries_lists.ru') || 'Russian Federation' },
  { value: 'RW', label: t('countries_lists.rw') || 'Rwanda' },
  { value: 'KN', label: t('countries_lists.kn') || 'Saint Kitts and Nevis' },
  { value: 'LC', label: t('countries_lists.lc') || 'Saint Lucia' },
  { value: 'VC', label: t('countries_lists.vc') || 'Saint Vincent and the Grenadines' },
  { value: 'WS', label: t('countries_lists.ws') || 'Samoa' },
  { value: 'SM', label: t('countries_lists.sm') || 'San Marino' },
  { value: 'ST', label: t('countries_lists.st') || 'Sao Tome and Principe' },
  { value: 'SA', label: t('countries_lists.sa') || 'Saudi Arabia' },
  { value: 'SN', label: t('countries_lists.sn') || 'Senegal' },
  { value: 'RS', label: t('countries_lists.rs') || 'Serbia' },
  { value: 'SC', label: t('countries_lists.sc') || 'Seychelles' },
  { value: 'SL', label: t('countries_lists.sl') || 'Sierra Leone' },
  { value: 'SG', label: t('countries_lists.sg') || 'Singapore' },
  { value: 'SK', label: t('countries_lists.sk') || 'Slovak Republic' },
  { value: 'SI', label: t('countries_lists.si') || 'Slovenia' },
  { value: 'SB', label: t('countries_lists.sb') || 'Solomon Islands' },
  { value: 'SO', label: t('countries_lists.so') || 'Somalia' },
  { value: 'ZA', label: t('countries_lists.za') || 'South Africa' },
  { value: 'SS', label: t('countries_lists.ss') || 'South Sudan' },
  { value: 'ES', label: t('countries_lists.es') || 'Spain' },
  { value: 'LK', label: t('countries_lists.lk') || 'Sri Lanka' },
  { value: 'SD', label: t('countries_lists.sd') || 'Sudan' },
  { value: 'SR', label: t('countries_lists.sr') || 'Suriname' },
  { value: 'SE', label: t('countries_lists.se') || 'Sweden' },
  { value: 'CH', label: t('countries_lists.ch') || 'Switzerland' },
  { value: 'SY', label: t('countries_lists.sy') || 'Syrian Arab Republic' },
  { value: 'TW', label: t('countries_lists.tw') || 'Taiwan' },
  { value: 'TJ', label: t('countries_lists.tj') || 'Tajikistan' },
  { value: 'TZ', label: t('countries_lists.tz') || 'Tanzania' },
  { value: 'TH', label: t('countries_lists.th') || 'Thailand' },
  { value: 'TL', label: t('countries_lists.tl') || 'Timor-Leste' },
  { value: 'TG', label: t('countries_lists.tg') || 'Togo' },
  { value: 'TO', label: t('countries_lists.to') || 'Tonga' },
  { value: 'TT', label: t('countries_lists.tt') || 'Trinidad and Tobago' },
  { value: 'TN', label: t('countries_lists.tn') || 'Tunisia' },
  { value: 'TR', label: t('countries_lists.tr') || 'Turkey' },
  { value: 'TM', label: t('countries_lists.tm') || 'Turkmenistan' },
  { value: 'TV', label: t('countries_lists.tv') || 'Tuvalu' },
  { value: 'UG', label: t('countries_lists.ug') || 'Uganda' },
  { value: 'UA', label: t('countries_lists.ua') || 'Ukraine' },
  { value: 'AE', label: t('countries_lists.ae') || 'United Arab Emirates' },
  { value: 'GB', label: t('countries_lists.gb') || 'United Kingdom' },
  { value: 'US', label: t('countries_lists.us') || 'United States' },
  { value: 'UY', label: t('countries_lists.uy') || 'Uruguay' },
  { value: 'UZ', label: t('countries_lists.uz') || 'Uzbekistan' },
  { value: 'VU', label: t('countries_lists.vu') || 'Vanuatu' },
  { value: 'VE', label: t('countries_lists.ve') || 'Venezuela' },
  { value: 'VN', label: t('countries_lists.vn') || 'Vietnam' },
  { value: 'YE', label: t('countries_lists.ye') || 'Yemen' },
  { value: 'ZM', label: t('countries_lists.zm') || 'Zambia' },
  { value: 'ZW', label: t('countries_lists.zw') || 'Zimbabwe' },
]);

// Filters the list of all countries based on the search query
const filteredCountries = computed(() => {
  if (!searchQuery.value) {
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
  { immediate: true }
);

// Handles input events, ensuring the dropdown opens only when not disabled
const handleInput = () => {
  if (!props.disabled) {
    isOpen.value = true;
    emits('change', searchQuery.value);
  }
};

// Handles focus event, only opens dropdown when not disabled
const handleFocus = () => {
  if (!props.disabled) {
    isOpen.value = true;
  }
};

// Handles blur event with a slight delay to allow click on suggestions
const handleBlur = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 200);
};

// Selects a country from the filtered list, only works when not disabled
const selectCountry = (country: { value: string; label: string }) => {
  if (props.disabled) return;

  searchQuery.value = country.label;
  emits('update:modelValue', country.value);
  emits('select', country.value);
  emits('change', country.value);
  isOpen.value = false;
};
</script>
