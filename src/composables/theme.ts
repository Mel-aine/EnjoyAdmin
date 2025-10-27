import { inject, type ComputedRef } from 'vue'

export interface ThemeContext {
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