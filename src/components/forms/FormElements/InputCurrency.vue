<script setup lang="ts">
const props = defineProps({
    lb: String,
    inputType: {
        type: String,
        default: 'number' // type nombre car c'est un prix
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: [String, Number],
        default: ''
    },
    forLabel: String,
    id: String,
    placeholder: String,
    min: Number,
    currency: {
        type: String,
        default: 'XAF' // devise par défaut
    }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    emit('update:modelValue', input.value)
}
</script>

<template>
    <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" :for="id">
            {{ lb }}<span v-if="isRequired" class="text-red-500">*</span>
        </label>
        <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 pointer-events-none">
                {{ currency }}
            </span>
            <input
                :type="inputType"
                :id="id"
                :required="isRequired"
                :disabled="disabled"
                :min="min"
                :value="modelValue"
                @input="handleInput"
                :placeholder="placeholder"
                class="pl-14 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
            />
        </div>
    </div>
</template>

<style scoped>
input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    border-color: #d1d5db;
}
/* padding-left = espace pour le symbole XAF affiché à gauche */
</style>
