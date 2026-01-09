<template>
  <div class="nationality-autocomplete w-full max-w-md mx-auto">
    <label for="nationality-input" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 truncate">
      {{ $t(lb) }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        id="nationality-input"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        :disabled="disabled"
       :class="[

          'flex justify-between h-11 w-full rounded-lg  border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
          {
            'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800': disabled,
            'border-black/50': !disabled,
            'border-gray-200': disabled
          },
          props.customClass
        ]"

        :placeholder="computedPlaceholder"
        autocomplete="off"
      />

      <!-- Dropdown only shows when not disabled -->
      <ul
        v-if="isOpen && filteredNationalities.length && !disabled"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm dark:bg-gray-800 dark:ring-gray-600"
      >
        <li
          v-for="nationality in filteredNationalities"
          :key="nationality.value"
          @mousedown.prevent="selectNationality(nationality)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors duration-150 ease-in-out rounded-md"
        >
          <span class="block truncate">{{ nationality.label }}</span>
        </li>
      </ul>

      <!-- No results message -->
      <div
        v-else-if="isOpen && !filteredNationalities.length && searchQuery && !disabled"
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
    default: 'nationality',
  },
  customClass: {
    type: String,
    default: '',
  },
  placeholder:{
    type: String,
    default: ''
  }
});

const emits = defineEmits(['update:modelValue', 'select', 'change']);

const searchQuery = ref<string>('');
const isOpen = ref<boolean>(false);
const selectedNationality = ref<any | null>(null);
const computedPlaceholder = computed(() => {
  return props.placeholder || t('search_nationality');
});

// A comprehensive list of all nationalities
const allNationalities = computed(() => [
  { value: 'AF', label: t('nationalities_lists.af') || 'Afghan' },
  { value: 'AL', label: t('nationalities_lists.al') || 'Albanian' },
  { value: 'DZ', label: t('nationalities_lists.dz') || 'Algerian' },
  { value: 'AD', label: t('nationalities_lists.ad') || 'Andorran' },
  { value: 'AO', label: t('nationalities_lists.ao') || 'Angolan' },
  { value: 'AG', label: t('nationalities_lists.ag') || 'Antiguan/Barbudan' },
  { value: 'AR', label: t('nationalities_lists.ar') || 'Argentine' },
  { value: 'AM', label: t('nationalities_lists.am') || 'Armenian' },
  { value: 'AU', label: t('nationalities_lists.au') || 'Australian' },
  { value: 'AT', label: t('nationalities_lists.at') || 'Austrian' },
  { value: 'AZ', label: t('nationalities_lists.az') || 'Azerbaijani' },
  { value: 'BS', label: t('nationalities_lists.bs') || 'Bahamian' },
  { value: 'BH', label: t('nationalities_lists.bh') || 'Bahraini' },
  { value: 'BD', label: t('nationalities_lists.bd') || 'Bangladeshi' },
  { value: 'BB', label: t('nationalities_lists.bb') || 'Barbadian' },
  { value: 'BY', label: t('nationalities_lists.by') || 'Belarusian' },
  { value: 'BE', label: t('nationalities_lists.be') || 'Belgian' },
  { value: 'BZ', label: t('nationalities_lists.bz') || 'Belizean' },
  { value: 'BJ', label: t('nationalities_lists.bj') || 'Beninese' },
  { value: 'BT', label: t('nationalities_lists.bt') || 'Bhutanese' },
  { value: 'BO', label: t('nationalities_lists.bo') || 'Bolivian' },
  { value: 'BA', label: t('nationalities_lists.ba') || 'Bosnian/Herzegovinian' },
  { value: 'BW', label: t('nationalities_lists.bw') || 'Motswana' },
  { value: 'BR', label: t('nationalities_lists.br') || 'Brazilian' },
  { value: 'BN', label: t('nationalities_lists.bn') || 'Bruneian' },
  { value: 'BG', label: t('nationalities_lists.bg') || 'Bulgarian' },
  { value: 'BF', label: t('nationalities_lists.bf') || 'Burkinabe' },
  { value: 'BI', label: t('nationalities_lists.bi') || 'Burundian' },
  { value: 'CV', label: t('nationalities_lists.cv') || 'Cabo Verdean' },
  { value: 'KH', label: t('nationalities_lists.kh') || 'Cambodian' },
  { value: 'CM', label: t('nationalities_lists.cm') || 'Cameroonian' },
  { value: 'CA', label: t('nationalities_lists.ca') || 'Canadian' },
  { value: 'CF', label: t('nationalities_lists.cf') || 'Central African' },
  { value: 'TD', label: t('nationalities_lists.td') || 'Chadian' },
  { value: 'CL', label: t('nationalities_lists.cl') || 'Chilean' },
  { value: 'CN', label: t('nationalities_lists.cn') || 'Chinese' },
  { value: 'CO', label: t('nationalities_lists.co') || 'Colombian' },
  { value: 'KM', label: t('nationalities_lists.km') || 'Comoran' },
  { value: 'CD', label: t('nationalities_lists.cd') || 'Congolese' },
  { value: 'CG', label: t('nationalities_lists.cg') || 'Congolese' },
  { value: 'CR', label: t('nationalities_lists.cr') || 'Costa Rican' },
  { value: 'CI', label: t('nationalities_lists.ci') || 'Ivorian' },
  { value: 'HR', label: t('nationalities_lists.hr') || 'Croatian' },
  { value: 'CU', label: t('nationalities_lists.cu') || 'Cuban' },
  { value: 'CY', label: t('nationalities_lists.cy') || 'Cypriot' },
  { value: 'CZ', label: t('nationalities_lists.cz') || 'Czech' },
  { value: 'DK', label: t('nationalities_lists.dk') || 'Danish' },
  { value: 'DJ', label: t('nationalities_lists.dj') || 'Djiboutian' },
  { value: 'DM', label: t('nationalities_lists.dm') || 'Dominican' },
  { value: 'DO', label: t('nationalities_lists.do') || 'Dominican' },
  { value: 'EC', label: t('nationalities_lists.ec') || 'Ecuadorian' },
  { value: 'EG', label: t('nationalities_lists.eg') || 'Egyptian' },
  { value: 'SV', label: t('nationalities_lists.sv') || 'Salvadoran' },
  { value: 'GQ', label: t('nationalities_lists.gq') || 'Equatorial Guinean' },
  { value: 'ER', label: t('nationalities_lists.er') || 'Eritrean' },
  { value: 'EE', label: t('nationalities_lists.ee') || 'Estonian' },
  { value: 'SZ', label: t('nationalities_lists.sz') || 'Swazi' },
  { value: 'ET', label: t('nationalities_lists.et') || 'Ethiopian' },
  { value: 'FJ', label: t('nationalities_lists.fj') || 'Fijian' },
  { value: 'FI', label: t('nationalities_lists.fi') || 'Finnish' },
  { value: 'FR', label: t('nationalities_lists.fr') || 'French' },
  { value: 'GA', label: t('nationalities_lists.ga') || 'Gabonese' },
  { value: 'GM', label: t('nationalities_lists.gm') || 'Gambian' },
  { value: 'GE', label: t('nationalities_lists.ge') || 'Georgian' },
  { value: 'DE', label: t('nationalities_lists.de') || 'German' },
  { value: 'GH', label: t('nationalities_lists.gh') || 'Ghanaian' },
  { value: 'GR', label: t('nationalities_lists.gr') || 'Greek' },
  { value: 'GD', label: t('nationalities_lists.gd') || 'Grenadian' },
  { value: 'GT', label: t('nationalities_lists.gt') || 'Guatemalan' },
  { value: 'GN', label: t('nationalities_lists.gn') || 'Guinean' },
  { value: 'GW', label: t('nationalities_lists.gw') || 'Bissau-Guinean' },
  { value: 'GY', label: t('nationalities_lists.gy') || 'Guyanese' },
  { value: 'HT', label: t('nationalities_lists.ht') || 'Haitian' },
  { value: 'HN', label: t('nationalities_lists.hn') || 'Honduran' },
  { value: 'HU', label: t('nationalities_lists.hu') || 'Hungarian' },
  { value: 'IS', label: t('nationalities_lists.is') || 'Icelander' },
  { value: 'IN', label: t('nationalities_lists.in') || 'Indian' },
  { value: 'ID', label: t('nationalities_lists.id') || 'Indonesian' },
  { value: 'IR', label: t('nationalities_lists.ir') || 'Iranian' },
  { value: 'IQ', label: t('nationalities_lists.iq') || 'Iraqi' },
  { value: 'IE', label: t('nationalities_lists.ie') || 'Irish' },
  { value: 'IL', label: t('nationalities_lists.il') || 'Israeli' },
  { value: 'IT', label: t('nationalities_lists.it') || 'Italian' },
  { value: 'JM', label: t('nationalities_lists.jm') || 'Jamaican' },
  { value: 'JP', label: t('nationalities_lists.jp') || 'Japanese' },
  { value: 'JO', label: t('nationalities_lists.jo') || 'Jordanian' },
  { value: 'KZ', label: t('nationalities_lists.kz') || 'Kazakhstani' },
  { value: 'KE', label: t('nationalities_lists.ke') || 'Kenyan' },
  { value: 'KI', label: t('nationalities_lists.ki') || 'I-Kiribati' },
  { value: 'KP', label: t('nationalities_lists.kp') || 'North Korean' },
  { value: 'KR', label: t('nationalities_lists.kr') || 'South Korean' },
  { value: 'KW', label: t('nationalities_lists.kw') || 'Kuwaiti' },
  { value: 'KG', label: t('nationalities_lists.kg') || 'Kyrgyz' },
  { value: 'LA', label: t('nationalities_lists.la') || 'Laotian' },
  { value: 'LV', label: t('nationalities_lists.lv') || 'Latvian' },
  { value: 'LB', label: t('nationalities_lists.lb') || 'Lebanese' },
  { value: 'LS', label: t('nationalities_lists.ls') || 'Basotho' },
  { value: 'LR', label: t('nationalities_lists.lr') || 'Liberian' },
  { value: 'LY', label: t('nationalities_lists.ly') || 'Libyan' },
  { value: 'LI', label: t('nationalities_lists.li') || 'Liechtensteiner' },
  { value: 'LT', label: t('nationalities_lists.lt') || 'Lithuanian' },
  { value: 'LU', label: t('nationalities_lists.lu') || 'Luxembourgish' },
  { value: 'MG', label: t('nationalities_lists.mg') || 'Malagasy' },
  { value: 'MW', label: t('nationalities_lists.mw') || 'Malawian' },
  { value: 'MY', label: t('nationalities_lists.my') || 'Malaysian' },
  { value: 'MV', label: t('nationalities_lists.mv') || 'Maldivian' },
  { value: 'ML', label: t('nationalities_lists.ml') || 'Malian' },
  { value: 'MT', label: t('nationalities_lists.mt') || 'Maltese' },
  { value: 'MH', label: t('nationalities_lists.mh') || 'Marshallese' },
  { value: 'MR', label: t('nationalities_lists.mr') || 'Mauritanian' },
  { value: 'MU', label: t('nationalities_lists.mu') || 'Mauritian' },
  { value: 'MX', label: t('nationalities_lists.mx') || 'Mexican' },
  { value: 'FM', label: t('nationalities_lists.fm') || 'Micronesian' },
  { value: 'MD', label: t('nationalities_lists.md') || 'Moldovan' },
  { value: 'MC', label: t('nationalities_lists.mc') || 'Monegasque' },
  { value: 'MN', label: t('nationalities_lists.mn') || 'Mongolian' },
  { value: 'ME', label: t('nationalities_lists.me') || 'Montenegrin' },
  { value: 'MA', label: t('nationalities_lists.ma') || 'Moroccan' },
  { value: 'MZ', label: t('nationalities_lists.mz') || 'Mozambican' },
  { value: 'MM', label: t('nationalities_lists.mm') || 'Burmese' },
  { value: 'NA', label: t('nationalities_lists.na') || 'Namibian' },
  { value: 'NR', label: t('nationalities_lists.nr') || 'Nauruan' },
  { value: 'NP', label: t('nationalities_lists.np') || 'Nepalese' },
  { value: 'NL', label: t('nationalities_lists.nl') || 'Dutch' },
  { value: 'NZ', label: t('nationalities_lists.nz') || 'New Zealander' },
  { value: 'NI', label: t('nationalities_lists.ni') || 'Nicaraguan' },
  { value: 'NE', label: t('nationalities_lists.ne') || 'Nigerien' },
  { value: 'NG', label: t('nationalities_lists.ng') || 'Nigerian' },
  { value: 'MK', label: t('nationalities_lists.mk') || 'Macedonian' },
  { value: 'NO', label: t('nationalities_lists.no') || 'Norwegian' },
  { value: 'OM', label: t('nationalities_lists.om') || 'Omani' },
  { value: 'PK', label: t('nationalities_lists.pk') || 'Pakistani' },
  { value: 'PW', label: t('nationalities_lists.pw') || 'Palauan' },
  { value: 'PA', label: t('nationalities_lists.pa') || 'Panamanian' },
  { value: 'PG', label: t('nationalities_lists.pg') || 'Papua New Guinean' },
  { value: 'PY', label: t('nationalities_lists.py') || 'Paraguayan' },
  { value: 'PE', label: t('nationalities_lists.pe') || 'Peruvian' },
  { value: 'PH', label: t('nationalities_lists.ph') || 'Filipino' },
  { value: 'PL', label: t('nationalities_lists.pl') || 'Polish' },
  { value: 'PT', label: t('nationalities_lists.pt') || 'Portuguese' },
  { value: 'QA', label: t('nationalities_lists.qa') || 'Qatari' },
  { value: 'RO', label: t('nationalities_lists.ro') || 'Romanian' },
  { value: 'RU', label: t('nationalities_lists.ru') || 'Russian' },
  { value: 'RW', label: t('nationalities_lists.rw') || 'Rwandan' },
  { value: 'KN', label: t('nationalities_lists.kn') || 'Kittian and Nevisian' },
  { value: 'LC', label: t('nationalities_lists.lc') || 'Saint Lucian' },
  { value: 'VC', label: t('nationalities_lists.vc') || 'Saint Vincentian' },
  { value: 'WS', label: t('nationalities_lists.ws') || 'Samoan' },
  { value: 'SM', label: t('nationalities_lists.sm') || 'Sammarinese' },
  { value: 'ST', label: t('nationalities_lists.st') || 'Sao Tomean' },
  { value: 'SA', label: t('nationalities_lists.sa') || 'Saudi' },
  { value: 'SN', label: t('nationalities_lists.sn') || 'Senegalese' },
  { value: 'RS', label: t('nationalities_lists.rs') || 'Serbian' },
  { value: 'SC', label: t('nationalities_lists.sc') || 'Seychellois' },
  { value: 'SL', label: t('nationalities_lists.sl') || 'Sierra Leonean' },
  { value: 'SG', label: t('nationalities_lists.sg') || 'Singaporean' },
  { value: 'SK', label: t('nationalities_lists.sk') || 'Slovak' },
  { value: 'SI', label: t('nationalities_lists.si') || 'Slovenian' },
  { value: 'SB', label: t('nationalities_lists.sb') || 'Solomon Islander' },
  { value: 'SO', label: t('nationalities_lists.so') || 'Somali' },
  { value: 'ZA', label: t('nationalities_lists.za') || 'South African' },
  { value: 'SS', label: t('nationalities_lists.ss') || 'South Sudanese' },
  { value: 'ES', label: t('nationalities_lists.es') || 'Spanish' },
  { value: 'LK', label: t('nationalities_lists.lk') || 'Sri Lankan' },
  { value: 'SD', label: t('nationalities_lists.sd') || 'Sudanese' },
  { value: 'SR', label: t('nationalities_lists.sr') || 'Surinamese' },
  { value: 'SE', label: t('nationalities_lists.se') || 'Swedish' },
  { value: 'CH', label: t('nationalities_lists.ch') || 'Swiss' },
  { value: 'SY', label: t('nationalities_lists.sy') || 'Syrian' },
  { value: 'TW', label: t('nationalities_lists.tw') || 'Taiwanese' },
  { value: 'TJ', label: t('nationalities_lists.tj') || 'Tajikistani' },
  { value: 'TZ', label: t('nationalities_lists.tz') || 'Tanzanian' },
  { value: 'TH', label: t('nationalities_lists.th') || 'Thai' },
  { value: 'TL', label: t('nationalities_lists.tl') || 'Timorese' },
  { value: 'TG', label: t('nationalities_lists.tg') || 'Togolese' },
  { value: 'TO', label: t('nationalities_lists.to') || 'Tongan' },
  { value: 'TT', label: t('nationalities_lists.tt') || 'Trinidadian/Tobagonian' },
  { value: 'TN', label: t('nationalities_lists.tn') || 'Tunisian' },
  { value: 'TR', label: t('nationalities_lists.tr') || 'Turkish' },
  { value: 'TM', label: t('nationalities_lists.tm') || 'Turkmen' },
  { value: 'TV', label: t('nationalities_lists.tv') || 'Tuvaluan' },
  { value: 'UG', label: t('nationalities_lists.ug') || 'Ugandan' },
  { value: 'UA', label: t('nationalities_lists.ua') || 'Ukrainian' },
  { value: 'AE', label: t('nationalities_lists.ae') || 'Emirati' },
  { value: 'GB', label: t('nationalities_lists.gb') || 'British' },
  { value: 'US', label: t('nationalities_lists.us') || 'American' },
  { value: 'UY', label: t('nationalities_lists.uy') || 'Uruguayan' },
  { value: 'UZ', label: t('nationalities_lists.uz') || 'Uzbek' },
  { value: 'VU', label: t('nationalities_lists.vu') || 'Ni-Vanuatu' },
  { value: 'VE', label: t('nationalities_lists.ve') || 'Venezuelan' },
  { value: 'VN', label: t('nationalities_lists.vn') || 'Vietnamese' },
  { value: 'YE', label: t('nationalities_lists.ye') || 'Yemeni' },
  { value: 'ZM', label: t('nationalities_lists.zm') || 'Zambian' },
  { value: 'ZW', label: t('nationalities_lists.zw') || 'Zimbabwean' },
]);

// Filters the list of all nationalities based on the search query
const filteredNationalities = computed(() => {
  if (!searchQuery.value) {
    return allNationalities.value;
  }
  const query = searchQuery.value.toLowerCase();
  return allNationalities.value.filter(nationality =>
    nationality.label.toLowerCase().includes(query)
  );
});

// Watch for changes in the `modelValue` prop and update `searchQuery`
watch(
  () => props.modelValue,
  (newVal) => {
    const selected = allNationalities.value.find((c) => c.value === newVal);
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

function handleBlur() {
  setTimeout(() => {
    isOpen.value = false

    // Vérifie si l’entrée correspond à un pays valide
    const match = allNationalities.value.find(
      (c) => c.label.toLowerCase() === searchQuery.value.toLowerCase()
    )

    if (match) {
      selectedNationality.value = match
      searchQuery.value = match.label
      emits('update:modelValue', match.value)
    } else {
      selectedNationality.value = null
      searchQuery.value = ''
      emits('update:modelValue', '')
    }
  }, 200)
}

const selectNationality = (nationality: { value: string; label: string }) => {
  if (props.disabled) return
  selectedNationality.value = nationality
  searchQuery.value = nationality.label
  emits('update:modelValue', nationality.value)
  emits('select', nationality.value)
  emits('change', nationality.value)
  isOpen.value = false
}


</script>