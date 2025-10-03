<template>
    <div :class="'relative dropdown-container '+id " :id="id">

        <button @click="toggleDropdown" :class="[
            'flex items-center gap-2 px-4 py-2 rounded-md  duration-200',
            buttonClass
        ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
        </button>

        <!-- Dropdown Menu -->
        <div v-if="isOpen" :class="[
            'absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-999',
            dropdownClass
        ]">
            <div class="py-2">
                <button v-for="option in options" :key="option.id" @click="handleOptionClick(option)"
                    class="w-full flex items-center gap-3 px-4 py-1 text-left hover:bg-gray-50 transition-colors duration-150">
                    <component v-if="option.icon" :is="option.icon" class="w-4 h-5"  />
                    <span class="text-gray-700 font-medium text-sm">{{ $t (option.label)}}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface DropdownOption {
    id: string
    label: string
    icon?: any
    color?: string
}

interface Props {
    options: DropdownOption[]
    buttonText?: string
    buttonClass?: string
    dropdownClass?: string
    id?: string
}

interface Emits {
    (e: 'option-selected', option: DropdownOption): void
}

const props = withDefaults(defineProps<Props>(), {
    buttonText: 'Options',
    buttonClass: 'bg-white text-black hover:text-primary',
    dropdownClass: 'w-64',
    id:""
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const handleOptionClick = (option: DropdownOption) => {
    emit('option-selected', option)
    isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    const dropdown = document.getElementById(props.id)
    if (dropdown && !dropdown.contains(target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>