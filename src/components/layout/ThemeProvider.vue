<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, onMounted, watch, computed, type ComputedRef } from 'vue'
import { useThemeStore } from '@/composables/themeStore'

const themeStore = useThemeStore()

const isDarkMode = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggle()
}

onMounted(() => {
  themeStore.markInitialized()
  // Apply current theme to document
  if (themeStore.isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

watch(() => themeStore.theme, (newTheme) => {
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

interface ThemeContext {
  isDarkMode: ComputedRef<boolean>
  toggleTheme: () => void
}

provide<ThemeContext>('theme', {
  isDarkMode,
  toggleTheme,
})
</script>

<script lang="ts">
import { inject} from 'vue'

interface ThemeContext {
  isDarkMode: ComputedRef<boolean>
  toggleTheme: () => void
}

export function useTheme(): ThemeContext {
  const theme = inject<ThemeContext>('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>
