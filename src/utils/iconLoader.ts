/**
 * Dynamic icon loader to reduce bundle size
 * Only imports icons when they are actually needed
 */

type IconName = string
type IconComponent = any

const iconCache = new Map<IconName, IconComponent>()

/**
 * Dynamically load a Lucide icon by name
 * @param iconName - The name of the icon (e.g., 'User', 'Calendar')
 * @returns Promise<IconComponent>
 */
export const loadIcon = async (iconName: IconName): Promise<IconComponent> => {
  // Check cache first
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!
  }

  try {
    // Dynamic import of specific icon
    const iconModule = await import(`lucide-vue-next/dist/esm/icons/${iconName.toLowerCase()}.js`)
    const IconComponent = iconModule.default || iconModule[iconName]
    
    // Cache the loaded icon
    iconCache.set(iconName, IconComponent)
    return IconComponent
  } catch (error) {
    console.warn(`Failed to load icon: ${iconName}`, error)
    // Return a fallback icon or null
    return null
  }
}

/**
 * Preload commonly used icons
 */
export const preloadCommonIcons = async () => {
  const commonIcons = [
    'User', 'Calendar', 'Search', 'Plus', 'Edit', 'Trash2', 
    'Eye', 'ChevronDown', 'ChevronRight', 'X', 'Check'
  ]

  const loadPromises = commonIcons.map(iconName => 
    loadIcon(iconName).catch(() => null) // Silent fail for preload
  )

  await Promise.all(loadPromises)
}

/**
 * Clear icon cache (useful for memory management)
 */
export const clearIconCache = () => {
  iconCache.clear()
}

/**
 * Get cache size for debugging
 */
export const getIconCacheSize = () => {
  return iconCache.size
}