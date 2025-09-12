/**
 * Dynamic chart library loader to reduce main bundle size
 * Only loads ECharts when actually needed by components
 * Uses tree-shaken ECharts modules for optimal bundle size
 */

import { registerEChartsComponents } from './treeShaking'

let echartsInstance: any = null

export const loadECharts = async () => {
  if (echartsInstance) {
    return echartsInstance
  }
  
  try {
    // Load only necessary ECharts components for tree shaking
    echartsInstance = await registerEChartsComponents()
    return echartsInstance
  } catch (error) {
    console.error('Failed to load ECharts:', error)
    // Fallback to full ECharts if tree-shaken version fails
    try {
      const echarts = await import('echarts')
      echartsInstance = echarts
      return echarts
    } catch (fallbackError) {
      console.error('Failed to load fallback ECharts:', fallbackError)
      throw fallbackError
    }
  }
}

// Preload ECharts on user interaction (hover, click) for better UX
export const preloadECharts = () => {
  if (!echartsInstance) {
    loadECharts().catch(() => {
      // Silent fail for preload
    })
  }
}

// Utility to check if ECharts is already loaded
export const isEChartsLoaded = () => {
  return echartsInstance !== null
}