<template>
    <div :class="'relative dropdown-container '+id " :id="id" ref="dropdownContainer" @mouseenter="onHoverOpen" @mouseleave="onHoverClose">

        <button @click="handleButtonClick" :class="[
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
            'absolute right-0 top-full pt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-9 dark:bg-gray-800 dark:border-gray-700',
            dropdownClass
        ]">
            <div class="py-2">
                <button v-for="option in options" :key="option.id" @click="handleOptionClick(option)"
                    class="w-full flex items-center gap-3 px-4 py-1 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <component v-if="option.icon" :is="option.icon" class="w-4 h-5"  />
                    <span class="text-gray-700 dark:text-gray-300 font-medium text-sm">{{ option.label }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'

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
    openOnHover?: boolean
}

interface Emits {
    (e: 'option-selected', option: DropdownOption): void
}

const props = withDefaults(defineProps<Props>(), {
    buttonText: 'Options',
    buttonClass: 'bg-white text-black hover:text-primary dark:bg-gray-800 dark:text-gray-200',
    dropdownClass: 'w-64',
    id:"",
    openOnHover: true
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
// Unique instance identifier to coordinate open state across page
const instanceId = (getCurrentInstance()?.uid?.toString?.() || Math.random().toString(36).slice(2))
const dropdownContainer = ref<HTMLElement | null>(null)

const onHoverOpen = () => {
    if (props.openOnHover) {
        isOpen.value = true
        // Notify other dropdowns to close
        window.dispatchEvent(new CustomEvent('button-dropdown-open', { detail: { id: instanceId } }))
    }
}

const onHoverClose = () => {
    if (props.openOnHover) {
        isOpen.value = false
    }
}

const toggleDropdown = () => {
    const willOpen = !isOpen.value
    isOpen.value = !isOpen.value
    if (willOpen && isOpen.value) {
        window.dispatchEvent(new CustomEvent('button-dropdown-open', { detail: { id: instanceId } }))
    }
}

const handleButtonClick = () => {
    if (!props.openOnHover) {
        toggleDropdown()
    }
}

const handleOptionClick = (option: DropdownOption) => {
    emit('option-selected', option)
    isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (dropdownContainer.value && !dropdownContainer.value.contains(target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    // Use capture phase so clicks inside modal with @click.stop still trigger this
    document.addEventListener('click', handleClickOutside, true)
    // Close when another dropdown opens
    const handleGlobalOpen = (e: Event) => {
        const anyEvent = e as CustomEvent
        const id = (anyEvent.detail && (anyEvent.detail as any).id) as string | undefined
        if (id && id !== instanceId) {
            isOpen.value = false
        }
    }
    ;(window as any).__btnDropdownActionHandler__ = handleGlobalOpen
    window.addEventListener('button-dropdown-open', handleGlobalOpen as EventListener)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside, true)
    const handler = (window as any).__btnDropdownActionHandler__
    if (handler) {
        window.removeEventListener('button-dropdown-open', handler as EventListener)
    }
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
