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
    min: [String, Number]

});
// Emit input event to update the v-model value
const emit = defineEmits(['update:modelValue'])

// Handle the input change
const handleInput = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
}
const value = ref(props.modelValue);
watch(() => props.modelValue, (newValue) => {
    value.value = newValue;
}, { immediate: true });
</script>

<template>
    <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ lb }}<span v-if="isRequired" class="text-red-500">*</span>
        </label>
        <input :type="inputType" :id="id" :required="isRequired" :disabled="disabled" :min="min" v-model="value"
            @input="handleInput" :placeholder="placeholder"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800">

    </div>
</template>

<style scoped>
input:disabled {
    background-color: #f3f4f6;
    /* Fond grisé */
    cursor: not-allowed;
    /* Curseur interdit */
    border-color: #d1d5db;
    /* Bord plus clair */
    cursor: not-allowed;
}
</style>
