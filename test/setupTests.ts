import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// Disable transition stubs globally
config.global.stubs = {
  transition: false,
}

// Provide minimal i18n instance for components using useI18n
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} }
})
config.global.plugins = [i18n]

// Basic DOM API stubs used by some components
if (typeof window !== 'undefined') {
  // Prevent tests from failing on scrollTo usage
  // @ts-ignore
  window.scrollTo = window.scrollTo || (() => {})
}

// ResizeObserver stub (used by some charts/components)
// @ts-ignore
globalThis.ResizeObserver = globalThis.ResizeObserver || class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// URL.createObjectURL stub if missing
if (typeof URL !== 'undefined' && typeof URL.createObjectURL !== 'function') {
  // @ts-ignore
  URL.createObjectURL = () => 'blob:mock-url'
}

// getBoundingClientRect stub for happy-dom
// @ts-ignore
if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {
  // @ts-ignore
  if (typeof HTMLElement.prototype.getBoundingClientRect !== 'function') {
    // @ts-ignore
    HTMLElement.prototype.getBoundingClientRect = function () {
      return {
        bottom: 100,
        height: 40,
        top: 60,
        left: 0,
        right: 0,
        width: 100,
        x: 0,
        y: 0,
        toJSON: () => '{}'
      }
    }
  }
}