<template>
    <div>
        <label for="consentDate" class="block text-gray-700 text-sm font-bold mb-2">{{
            title }} <span class="text-red-500" v-if="isRequired">*</span></label>
        <div class="relative">
            <flat-pickr v-model="localValue" :config="flatpickrConfig" @on-change="updateValue"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                :placeholder="placeholder" />
            <span
                class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalendarIcon />
            </span>
        </div>
        <div v-if="errorMsg.length > 0" class="text-red-500 text-sm font-light italic">{{ errorMsg }}</div>
    </div>
</template>
<script setup lang="ts">
import CalendarIcon from '@/icons/CalendarIcon.vue';
import { computed, ref, watch } from 'vue';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    isRequired: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    maxDate: {
        type: String,
        default: ''
    }, minDate: {
        type: String,
        default: ''
    },
    errorMsg: {
        type: String,
        default: ""
    },
})

const emits = defineEmits(['update:modelValue', 'clear-error'])
const localValue = ref(props.modelValue);
const flatpickrConfig = computed(() => {
    const config:any = {
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'F j, Y',
        wrap: true,
       
    };
    if(props.maxDate){
        config.maxDate = props.maxDate
    }
    if(props.minDate){
        config.minDate = props.minDate
    }
    
    return config
})
const updateValue = () => {
    emits('clear-error')
    emits('update:modelValue', localValue.value)
}

watch(() => props.modelValue, (newVal) => {
    localValue.value = newVal;
})

</script>