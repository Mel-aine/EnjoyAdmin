<script setup lang="ts">
/**
 * InputTitleName component
 * 
 * A form component that allows users to input a title, first name, and last name.
 * 
 * @example
 * <InputTitleName v-model="person" :disabled="isReadOnly" />
 * 
 * Where person is an object with the structure:
 * {
 *   title: string,
 *   firstName: string,
 *   lastName: string
 * }
 */
import Select from './Select.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// Define props and emits for v-model support
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      title: '',
      firstName: '',
      lastName: ''
    })
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

// Local refs for form fields
const title = ref(props.modelValue.title || '');
const firstName = ref(props.modelValue.firstName || '');
const lastName = ref(props.modelValue.lastName || '');

// Title options with 'Not Set' option
const titleOptions = computed(() => [
  { label: t('Not Set'), value: '' },
  { label: t('Mr'), value: 'Mr' },
  { label: t('Mrs'), value: 'Mrs' },
  { label: t('Ms'), value: 'Ms' },
  { label: t('Dr'), value: 'Dr' }
]);

// Computed for full name display
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`.trim();
});

// Watch for changes in props
watch(() => props.modelValue, (newValue) => {
  title.value = newValue.title || '';
  firstName.value = newValue.firstName || '';
  lastName.value = newValue.lastName || '';
}, { deep: true });

// Watch for changes in local refs and emit updates
watch([title, firstName, lastName], () => {
  emit('update:modelValue', {
    title: title.value,
    firstName: firstName.value,
    lastName: lastName.value
  });
});
</script>

<template>
    <div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('Name') }}</label>
            <div class="flex">
                <div class="w-20 -translate-y-1.5">
                    <Select v-model="title" :options="titleOptions" customClass="rounded-r-none"
                        :placeholder="$t('Title')" :disabled="disabled" />
                </div>

                <!-- Display mode: Full name as read-only -->
                <div v-if="disabled" class="flex-1">
                    <div
                        class="h-11 w-full rounded-lg rounded-l-none border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white/90">
                        {{ fullName }}
                    </div>
                </div>

                <!-- Edit mode: Separate first name and last name inputs -->
                <div v-else class="flex-1 flex gap-0">
                    <div class="flex-1">
                        <input v-model="firstName" type="text" :placeholder="$t('FirstName')"
                            class="h-11 w-full rounded-lg rounded-l-none rounded-r-none border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                    </div>
                    <div class="flex-1">
                        <input v-model="lastName" type="text" :placeholder="$t('LastName')"
                            class="h-11 w-full rounded-lg rounded-l-none border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style></style>