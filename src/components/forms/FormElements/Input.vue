<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
    lb: String,
    inputType: {
        type: String,
        default: 'text'
    },
    isRequired: {
        type: Boolean,
        default: false,
    },


    disabled: {
        type: Boolean,
        default: false
    }, // Désactivation du champ
    modelValue: {
        type: [String, Number], // Support for different input types like text and number
        default: ''
    },
    forLabel: String,
    id: String,
    placeholder: String,
    min: [String, Number],
    max: [String, Number],
    errorMsg: {
        type: String,
        default: ""
    },
     customClass: {
        type: String,
        default: ''
    }

});
// Emit input event to update the v-model value
const emit = defineEmits(['update:modelValue', 'clear-error'])

// Handle the input change
const handleInput = (event: Event) => {
    emit('clear-error')
    emit('update:modelValue', (event.target as HTMLInputElement).value)
}
const value = ref(props.modelValue);
watch(() => props.modelValue, (newValue) => {
    value.value = newValue;
}, { immediate: true });
</script>

<template>
    <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" v-if="lb">
            {{ lb }}<span v-if="isRequired" class="text-red-500">*</span>
        </label>
        <input :type="inputType" :id="id" :required="isRequired" :disabled="disabled" :min="min" v-model="value"
            @input="handleInput" :placeholder="placeholder" :max="max"
            :class="[
                'dark:bg-dark-900 h-11 w-full rounded-lg border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800',
                'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 dark:disabled:border-gray-700',
                customClass
            ]">
        <div v-if="errorMsg.length > 0" class="text-red-500 text-sm font-light italic">{{ errorMsg }}</div>
    </div>
</template>

<style scoped>
</style>
