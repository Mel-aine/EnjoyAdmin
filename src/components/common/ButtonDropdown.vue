<template>
  <div ref="dropdownContainer" class="relative dropdown-container" @mouseenter="onHoverOpen">
    <button 
      @click="handleButtonClick"
      :class="[
        'flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200',
        buttonClass
      ]"
    >
      <span>{{ buttonText }}</span>
      <ChevronDown 
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen"
      :class="[
        'absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700',
        dropdownClass
      ]"
    >
      <!-- Mode groupé -->
      <template v-if="hasGroups">
        <!-- Groupe Print -->
        <div v-if="printItems.length" class="py-1">
          <p class="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {{ t('print') }}
          </p>
          <button
            v-for="option in printItems" :key="option.id"
            @click="handleOptionClick(option)"
            class="w-full flex items-center gap-3 px-4 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <component v-if="option.icon" :is="option.icon" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-700 dark:text-gray-300 font-medium text-sm">{{ option.label }}</span>
          </button>
        </div>

        <!-- Groupe WhatsApp -->
        <div v-if="whatsappItems.length" class="border-t border-gray-100 dark:border-gray-700 py-1">
          <p class="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <MessageCircle class="w-3 h-3" /> WhatsApp
          </p>
          <button
            v-for="option in whatsappItems" :key="option.id"
            @click="handleOptionClick(option)"
            class="w-full flex items-center gap-3 px-4 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-green-900/20 transition-colors duration-150"
          >
            <component v-if="option.icon" :is="option.icon" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-700 dark:text-gray-400 font-medium text-sm">{{ option.label }}</span>
          </button>
        </div>

        <!-- Groupe Email -->
        <div v-if="emailItems.length" class="border-t border-gray-100 dark:border-gray-700 py-1">
          <p class="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Mail class="w-3 h-3" /> Email
          </p>
          <button
            v-for="option in emailItems" :key="option.id"
            @click="handleOptionClick(option)"
            class="w-full flex items-center gap-3 px-4 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
          >
            <component v-if="option.icon" :is="option.icon" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-700 dark:text-gray-400 font-medium text-sm">{{ option.label }}</span>
          </button>
        </div>
      </template>

      <!-- Mode normal (sans groupes) — comportement original intact -->
      <template v-else>
        <div class="py-2">
          <button
            v-for="option in options" :key="option.id"
            @click="handleOptionClick(option)"
            class="w-full flex items-center gap-3 px-4 py-1 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <component v-if="option.icon" :is="option.icon" class="w-4 h-4" />
            <span class="text-gray-700 dark:text-gray-300 font-medium text-sm">{{ option.label }}</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { ChevronDown, MessageCircle, Mail } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface DropdownOption {
  id: string
  label: string
  icon?: any
  color?: string
  group?: any
}

interface Props {
  options: DropdownOption[]
  buttonText?: string
  buttonClass?: string
  dropdownClass?: string
  openOnHover?: boolean
}

interface Emits {
  (e: 'option-selected', option: DropdownOption): void
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Options',
  buttonClass: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600',
  dropdownClass: 'w-64',
  openOnHover: true
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const dropdownContainer = ref<HTMLElement | null>(null)
const instanceId = (getCurrentInstance()?.uid?.toString?.() || Math.random().toString(36).slice(2))

// Groupes
const hasGroups    = computed(() => props.options.some(o => o.group))
const printItems   = computed(() => props.options.filter(o => !o.group || o.group === 'print'))
const whatsappItems = computed(() => props.options.filter(o => o.group === 'whatsapp'))
const emailItems   = computed(() => props.options.filter(o => o.group === 'email'))

const onHoverOpen = () => {
  if (props.openOnHover) {
    isOpen.value = true
    window.dispatchEvent(new CustomEvent('button-dropdown-open', { detail: { id: instanceId } }))
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
  if (!props.openOnHover) toggleDropdown()
}

const handleOptionClick = (option: DropdownOption) => {
  emit('option-selected', option)
  isOpen.value = false
}

const handleClickOutside = (event: Event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as HTMLElement)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
  const handleGlobalOpen = (e: Event) => {
    const id = ((e as CustomEvent).detail as any)?.id as string | undefined
    if (id && id !== instanceId) isOpen.value = false
  }
  ;(window as any).__btnDropdownHandler__ = handleGlobalOpen
  window.addEventListener('button-dropdown-open', handleGlobalOpen as EventListener)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
  const handler = (window as any).__btnDropdownHandler__
  if (handler) window.removeEventListener('button-dropdown-open', handler as EventListener)
})
</script>