
/**
 * Extrait toutes les routes d'un menu avec leurs permissions
 */
export const extractRoutesFromMenu = (menuItems: any[]): Array<{path: string, permission?: string, name: string}> => {
  const routes: Array<{path: string, permission?: string, name: string}> = [];

  const extractRoutes = (items: any[]) => {
    items.forEach(item => {
      // Si l'item a un path, l'ajouter aux routes
      if (item.path) {
        routes.push({
          path: item.path,
          permission: item.permission,
          name: item.name
        });
      }

      // Si l'item a des sous-items, les traiter récursivement
      if (item.subItems && Array.isArray(item.subItems)) {
        extractRoutes(item.subItems);
      }
    });
  };

  extractRoutes(menuItems);
  return routes;
};

/**
 * Filtre un menu selon les permissions de l'utilisateur
 */
export const filterMenuByPermissions = (
  menuItems: any[], 
  hasPermission: (permission: string) => boolean
): any[] => {
  return menuItems
    .map((item: any) => {
      // Vérifier la permission de l'item principal
      const hasItemPermission = !item.permission || hasPermission(item.permission);

      // Filtrer les sous-items récursivement
      const filteredSubItems = item.subItems 
        ? filterMenuByPermissions(item.subItems, hasPermission)
        : [];

      // L'item est autorisé s'il a la permission OU s'il a des sous-items autorisés
      const isItemAllowed = hasItemPermission || filteredSubItems.length > 0;

      if (!isItemAllowed) {
        return null;
      }

      return {
        ...item,
        subItems: filteredSubItems.length > 0 ? filteredSubItems : undefined,
      };
    })
    .filter(Boolean);
};

/**
 * Trouve la première route accessible dans un menu
 */
export const findFirstAccessibleRoute = (
  menuItems: any[], 
  hasPermission: (permission: string) => boolean
): {path: string, permission?: string, name: string} | null => {
  const routes = extractRoutesFromMenu(menuItems);
  
  // Ordre de priorité pour la redirection
  const priorityPermissions = [
    'dashboard_view',
    'bookings_view', 
    'rooms_view',
    'calendar_view',
    'customers_view'
  ];

  // Chercher d'abord dans les routes prioritaires
  for (const permission of priorityPermissions) {
    const route = routes.find(r => r.permission === permission);
    if (route && hasPermission(permission)) {
      return route;
    }
  }

  // Si aucune route prioritaire n'est accessible, prendre la première disponible
  return routes.find(route => 
    !route.permission || hasPermission(route.permission)
  ) || null;
};

/**
 * Compte le nombre total d'items accessibles dans un menu
 */
export const countAccessibleMenuItems = (
  menuItems: any[], 
  hasPermission: (permission: string) => boolean
): number => {
  let count = 0;

  const countItems = (items: any[]) => {
    items.forEach(item => {
      const hasItemPermission = !item.permission || hasPermission(item.permission);
      
      if (item.subItems) {
        const accessibleSubItems = item.subItems.filter((subItem: any) => 
          !subItem.permission || hasPermission(subItem.permission)
        );
        
        if (hasItemPermission || accessibleSubItems.length > 0) {
          count++;
          countItems(item.subItems);
        }
      } else if (hasItemPermission) {
        count++;
      }
    });
  };

  countItems(menuItems);
  return count;
};