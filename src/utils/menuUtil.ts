// src/utils/menuUtils.ts

export const extractRoutesFromMenu = (
  menuItems: any[]
): { permission: string; path: string }[] => {
  const result: { permission: string; path: string }[] = []

  const flatten = (items: any[]) => {
    for (const item of items) {
      if (item.path && item.permission) {
        result.push({ permission: item.permission, path: item.path })
      }

      if (item.subItems) {
        flatten(item.subItems)
      }
    }
  }

  flatten(menuItems)
  return result
}
