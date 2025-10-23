/**
 * Lazy loading utilities for components and modules
 * Implements progressive loading to reduce initial bundle size
 */

import { defineAsyncComponent, type AsyncComponentLoader } from 'vue'
import type { Component } from 'vue'

/**
 * Create a lazy-loaded component with loading and error states
 */
export const createLazyComponent = (
  loader: AsyncComponentLoader,
  options: {
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
  } = {}
) => {
  return defineAsyncComponent({
    loader,
    loadingComponent: options.loadingComponent,
    errorComponent: options.errorComponent,
    delay: options.delay ?? 200,
    timeout: options.timeout ?? 10000,
    suspensible: options.suspensible ?? false
  })
}

/**
 * Lazy load chart components (ECharts based)
 */
export const LazyOccupancyRate = createLazyComponent(
  () => import('@/components/hotel/OccupancyRate.vue'),
  { delay: 100 }
)

export const LazyRevenueChart = createLazyComponent(
  () => import('@/components/hotel/RevenueChart.vue'),
  { delay: 100 }
)

export const LazyGuestDemographics = createLazyComponent(
  () => import('@/components/hotel/GuestDemographics.vue'),
  { delay: 100 }
)

export const LazyMonthlyBookings = createLazyComponent(
  () => import('@/components/hotel/MonthlyBookings.vue'),
  { delay: 100 }
)

/**
 * Lazy load heavy UI components
 */
export const LazyReservationCalendar = createLazyComponent(
  () => import('@/components/calendars/ReservationCalendar.vue'),
  { delay: 150 }
)

/**
 * Lazy load PDF and document components
 */
export const LazyPDFViewer = createLazyComponent(
  () => import('@/views/PDFViewer.vue'),
  { delay: 200 }
)

export const LazyPrintInvoice = createLazyComponent(
  () => import('@/components/invoice/PrintInvoice.vue'),
  { delay: 100 }
)

/**
 * Lazy load report components
 */
export const LazyReportsLayout = createLazyComponent(
  () => import('@/components/layout/ReportsLayout.vue'),
  { delay: 100 }
)

/**
 * Preload critical components on user interaction
 */
export const preloadCriticalComponents = () => {
  // Preload on user interaction (hover, focus, etc.)
  const preloadPromises = [
    import('@/components/hotel/OccupancyRate.vue'),
    import('@/components/hotel/RevenueChart.vue'),
    import('@/components/calendars/ReservationCalendar.vue')
  ]

  Promise.all(preloadPromises).catch(() => {
    // Silent fail for preload
  })
}

/**
 * Intersection Observer based lazy loading for components
 */
export const createIntersectionLazyComponent = (
  loader: AsyncComponentLoader,
  options: {
    rootMargin?: string
    threshold?: number
  } = {}
) => {
  let hasLoaded = false
  let componentPromise: Promise<any> | null = null

  return defineAsyncComponent({
    loader: () => {
      if (!hasLoaded && !componentPromise) {
        componentPromise = loader()
        hasLoaded = true
      }
      return componentPromise!
    },
    delay: 200
  })
}