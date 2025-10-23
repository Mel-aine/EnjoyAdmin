<template>
  <div class="profession-autocomplete w-full max-w-md mx-auto">
    <label for="profession-input" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 truncate">
      {{ $t(lb) }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        id="profession-input"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        :disabled="disabled"
        :placeholder="computedPlaceholder"
        autocomplete="off"
        :class="[
          'flex justify-between h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
          {
            'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800': disabled,
            'border-black/50': !disabled,
            'border-gray-200': disabled
          },
          props.customClass
        ]"
      />

      <!-- Liste -->
      <ul
        v-if="isOpen && filteredProfessions.length && !disabled"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm dark:bg-gray-800 dark:ring-gray-600"
      >
        <li
          v-for="profession in filteredProfessions"
          :key="profession"
          @mousedown.prevent="selectProfession(profession)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors duration-150 ease-in-out rounded-md"
        >
          <span class="block truncate">{{ profession }}</span>
        </li>
      </ul>

      <!-- Aucun résultat -->
      <div
        v-else-if="isOpen && !filteredProfessions.length && searchQuery && !disabled"
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 px-3 text-sm text-gray-500 dark:text-gray-400"
      >
        {{ $t('no_results') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: { type: String },
  disabled: { type: Boolean, default: false },
  isRequired: { type: Boolean, default: false },
  lb: { type: String, default: 'profession' },
  customClass: { type: String, default: '' },
  placeholder: { type: String, default: '' },
});

const emits = defineEmits(['update:modelValue', 'select', 'change']);

const searchQuery = ref('');
const isOpen = ref(false);

const computedPlaceholder = computed(() => props.placeholder || t('enterProfession'));

// Liste de professions (adaptée à usage hôtel, RH, ou CRM)
const professions = [
  t('doctor'),
  t('nurse'),
  t('teacher'),
  t('engineer'),
  t('lawyer'),
  t('architect'),
  t('developer'),
  t('designer'),
  t('manager'),
  t('accountant'),
  t('chef'),
  t('salesperson'),
  t('driver'),
  t('student'),
  t('retired'),
  t('entrepreneur'),
  t('artist'),
  t('technician'),
  t('scientist'),
  t('consultant'),
  t('photographer'),
  t('writer'),
  t('journalist'),
  t('police_officer'),
  t('firefighter'),
  t('civil_servant')
];

const filteredProfessions = computed(() => {
  if (!searchQuery.value) return professions;
  const q = searchQuery.value.toLowerCase();
  return professions.filter((p) => p.toLowerCase().includes(q));
});

watch(
  () => props.modelValue,
  (newVal) => {
    searchQuery.value = newVal || '';
  },
  { immediate: true }
);

const handleInput = () => {
  if (!props.disabled) {
    isOpen.value = true;
    emits('change', searchQuery.value);
  }
};

const handleFocus = () => {
  if (!props.disabled) isOpen.value = true;
};

const handleBlur = () => {
  setTimeout(() => (isOpen.value = false), 200);
};

const selectProfession = (profession: string) => {
  if (props.disabled) return;
  searchQuery.value = profession;
  emits('update:modelValue', profession);
  emits('select', profession);
  emits('change', profession);
  isOpen.value = false;
};
</script>
