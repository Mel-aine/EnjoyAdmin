<script setup lang="ts">
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        default: 'primary'
    },
    icon: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['click'])

</script>

<template>
    <div>
        <button @click="emit('click')" :class="`flex gap-2 text-sm text-primary btn btn-${variant}`"
                    class="dark:bg-dark-900 items-center h-10 self-center align-middle w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800">

            <component v-if="icon" :is="icon" class="w-4 h-4"></component>

            {{ label }}
        </button>
        <slot></slot>
    </div>
</template>

<style>
    .btn {
        padding: 0.5rem 1rem;
        font-weight: 500;
    }
    .btn-primary {
        color: black;
    }
    .btn-secondary {
        color: black;
    }
    .btn-success {
        background-color: #28a745;
        color: #fff;
    }
    .btn-danger {
        background-color: #dc3545;
        color: #fff;
    }
    .btn-warning {
        background-color: #ffc107;
        color: #212529;
    }
    .btn-info {
        background-color: #17a2b8;
        color: #fff;
    }
    .btn-light {
        background-color: #f8f9fa;
        color: #212529;
    }
    .btn-dark {
        background-color: #343a40;
        color: #fff;
    }
    .btn-link {
        background-color: transparent;
        color: #007bff;
    }
    .btn-outline-primary {
        background-color: transparent;
        color: #007bff;
        border: 1px solid #007bff;
    }
    .btn-outline-secondary {
        background-color: transparent;
        color: #6c757d;
        border: 1px solid #6c757d;
    }
    .btn-outline-success {
        background-color: transparent;
        color: #28a745;
        border: 1px solid #28a745;
    }
    .btn-outline-danger {
        background-color: transparent;
        color: #dc3545;
        border: 1px solid #dc3545;
    }
    .btn-outline-warning {
        background-color: transparent;
        color: #ffc107;
        border: 1px solid #ffc107;
    }
    .btn-outline-info {
        background-color: transparent;
        color: #17a2b8;
        border: 1px solid #17a2b8;
    }
    .btn-outline-light {
        background-color: transparent;
        color: #f8f9fa;
        border: 1px solid #f8f9fa;
    }
    .btn-outline-dark {
        background-color: transparent;
        color: #343a40;
        border: 1px solid #343a40;
    }
    .btn-link {
        background-color: transparent;
        color: #007bff;
    }




</style>