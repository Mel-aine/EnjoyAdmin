// import { ref } from 'vue'

// export function useSidebar() {
//   const isMobileOpen = ref(false)
//   const isDesktopOpen = ref(true)

//   const toggleSidebar = () => {
//     isDesktopOpen.value = !isDesktopOpen.value
//   }

//   const toggleMobileSidebar = () => {
//     isMobileOpen.value = !isMobileOpen.value
//   }

//   return {
//     isMobileOpen,
//     isDesktopOpen,
//     toggleSidebar,
//     toggleMobileSidebar,
//   }
// }

import { ref, computed, onMounted, onUnmounted, provide, inject } from 'vue'
import type { Ref } from 'vue' //

interface SidebarContextType {
  isExpanded: Ref<boolean>
  isMobileOpen: Ref<boolean>
  isHovered: Ref<boolean>
  activeItem: Ref<string | null>
  openSubmenu: Ref<string | null>
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  setIsHovered: (isHovered: boolean) => void
  setActiveItem: (item: string | null) => void
  toggleSubmenu: (item: string) => void
}

const SidebarSymbol = Symbol()

export function useSidebarProvider() {
  // Load initial state from localStorage, default to true if not found
  const savedExpandedState = localStorage.getItem('sidebar-expanded')
  const isExpanded = ref(savedExpandedState !== null ? JSON.parse(savedExpandedState) : true)
  const isMobileOpen = ref(false)
  const isMobile = ref(false)
  const isHovered = ref(false)
  const activeItem = ref<string | null>(null)
  const openSubmenu = ref<string | null>(null)

  const handleResize = () => {
    const mobile = window.innerWidth < 768
    isMobile.value = mobile
    if (!mobile) {
      isMobileOpen.value = false
    }
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  const toggleSidebar = () => {
    if (isMobile.value) {
      isMobileOpen.value = !isMobileOpen.value
    } else {
      isExpanded.value = !isExpanded.value
      // Save the new state to localStorage
      localStorage.setItem('sidebar-expanded', JSON.stringify(isExpanded.value))
    }
  }

  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  const setIsHovered = (value: boolean) => {
    isHovered.value = value
  }

  const setActiveItem = (item: string | null) => {
    activeItem.value = item
  }

  const toggleSubmenu = (item: string) => {
    openSubmenu.value = openSubmenu.value === item ? null : item
  }

  const context: SidebarContextType = {
    isExpanded: computed(() => isExpanded.value),
    isMobileOpen,
    isHovered,
    activeItem,
    openSubmenu,
    toggleSidebar,
    toggleMobileSidebar,
    setIsHovered,
    setActiveItem,
    toggleSubmenu,
  }

  provide(SidebarSymbol, context)

  return context
}

export function useSidebar(): SidebarContextType {
  const context = inject<SidebarContextType>(SidebarSymbol)
  if (!context) {
    throw new Error(
      'useSidebar must be used within a component that has SidebarProvider as an ancestor',
    )
  }
  return context
}
