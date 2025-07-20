<template>

  <div v-if="isLoading"
    class="fixed inset-0 z-[100000] flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
    <svg class="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
    </svg>

  </div>
  <aside>

    <div :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]">


      <div :class="[
        'pt-4 pb-10 flex  ',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]">
        <router-link to="/dashboard" class="flex items-center gap-2 ">


          <img v-if="isExpanded || isHovered || isMobileOpen" class="dark:hidden rounded-full w-10"
            src="/src/assets/images/header/logo2.png" alt="Logo" />

          <img v-if="isExpanded || isHovered || isMobileOpen" class="hidden dark:block rounded-full w-10"
            src="/src/assets/images/header/logo2.png" alt="Logo" />

          <img v-else class=" rounded-full w-10" src="/src/assets/images/header/logo2.png" alt="Logo" />
          <span v-if="isExpanded || isHovered || isMobileOpen"
            class="inline-flex text-xl text-gray-900 font-bold flex-wrap ">{{ serviceName }}</span>
        </router-link>
      </div>
      <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar mt-2"
        @mouseenter="!isExpanded && (isHovered = true)" @mouseleave="isHovered = false">
        <nav class="">
          <div class="flex flex-col gap-2">
            <div v-for="(menuGroup, groupIndex) in filteredMenu" :key="groupIndex">
              <ul class="flex flex-col gap-3 ">
                <li v-for="(item, index) in menuGroup.items" :key="item.name">
                  <button v-if="item.subItems && item.subItems.length > 0" @click="toggleSubmenu(groupIndex, index)"
                    :class="[
                      'menu-item group text-md w-full ',
                      {
                        'menu-item-active': isSubmenuOpen(groupIndex, index),
                        'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                      },
                      !isExpanded && !isHovered
                        ? 'lg:justify-center'
                        : 'lg:justify-start',
                    ]">
                    <span :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]">
                      <component :is="item.icon" />
                    </span>
                    <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text  ">{{ item.name }}</span>
                    <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen" :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]" />
                  </button>
                  <router-link v-else-if="item.path" :to="item.path" @click="startLoading" :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]">
                    <span :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]">
                      <component :is="item.icon" />
                    </span>
                    <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                  </router-link>
                  <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition"
                    @after-leave="endTransition">
                    <div v-show="isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                      ">
                      <ul class="mt-2 space-y-1 ml-9">
                        <li v-for="subItem in item.subItems" :key="subItem.name">
                          <!-- Submenu with sub-subitems -->
                          <div v-if="subItem.subItems && subItem.subItems.length > 0">
                            <button @click="toggleSubSubmenu(groupIndex, index, subItem.name)" :class="[
                              'menu-dropdown-item text-md flex items-center justify-between w-full',
                              {
                                'menu-dropdown-item-active': isSubSubmenuOpen(groupIndex, index, subItem.name) || isActive(subItem.path),
                                'menu-dropdown-item-inactive': !isSubSubmenuOpen(groupIndex, index, subItem.name) && !isActive(subItem.path),
                              },
                            ]">
                              <span>{{ subItem.name }}</span>
                              <ChevronDownIcon :class="[
                                'w-4 h-4 transition-transform duration-200',
                                {
                                  'rotate-180 text-purple-400': isSubSubmenuOpen(groupIndex, index, subItem.name),
                                },
                              ]" />
                            </button>

                            <!-- Sub-submenu items -->
                            <transition @enter="startTransition" @after-enter="endTransition"
                              @before-leave="startTransition" @after-leave="endTransition">
                              <ul v-show="isSubSubmenuOpen(groupIndex, index, subItem.name)"
                                class="mt-1 space-y-1 ml-4">
                                <li v-for="subSubItem in subItem.subItems" :key="subSubItem.name">
                                  <router-link :to="subSubItem.path" @click="startLoading" :class="[
                                    'menu-dropdown-item text-md',
                                    {
                                      'menu-dropdown-item-active': isActive(subSubItem.path),
                                      'menu-dropdown-item-inactive': !isActive(subSubItem.path),
                                    },
                                  ]">
                                    {{ subSubItem.name }}
                                  </router-link>
                                </li>
                              </ul>
                            </transition>
                          </div>

                          <!-- Regular submenu item -->
                          <router-link v-else :to="subItem.path" @click="startLoading" :class="[
                            'menu-dropdown-item text-md ',
                            {
                              'menu-dropdown-item-active': isActive(subItem.path),
                              'menu-dropdown-item-inactive': !isActive(subItem.path),
                            },
                          ]">
                            {{ subItem.name }}
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </li>
              </ul>
            </div>
          </div>
        </nav>

      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getMenuByCategoryName } from '@/menus';
import {

  ChevronDownIcon
} from "../../icons";
// import { Building2 } from 'lucide-vue-next'

import { useSidebar } from "@/composables/useSidebar";
import { isLoading } from '@/composables/spinner';
// import { CalendarCheck2 } from 'lucide-vue-next'
import { useServiceStore } from '@/composables/serviceStore';
import { getServices } from '@/services/api'
import { useI18n } from "vue-i18n";
import { useAuthStore } from '@/composables/user'

const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();
const serviceStore = useServiceStore();
const authStore = useAuthStore()
// const serviceName = ref('');
const { t } = useI18n();
const openSubSubmenu = ref<string | null>(null);

// const fetchService = async () => {
//   try {
//     const serviceId = serviceStore.serviceId;
//     const response = await getServices();

//     const foundService = response.data.data.find(
//       (service: any) => service.id === serviceId
//     );

//     if (foundService) {
//       serviceName.value = foundService.name;
//     } else {
//       serviceName.value = 'Unknown Service';
//     }

//     console.log("service", foundService);
//   } catch (error) {
//     console.error('fetch failed:', error);
//   }
// };

onMounted(() => {
  console.log("serviceStore",JSON.parse(serviceStore.currentService).name)
});
const serviceName = computed(() => {
  return JSON.parse(serviceStore.currentService).name
})


const startLoading = () => {
  isLoading.value = true;
};

// Stop loading on navigation end
watch(() => route.fullPath, () => {
  isLoading.value = false;
});

export interface BaseMenuItem {
  name: string;
  roles: number[];
  icon?: any;
}

export interface MenuLink extends BaseMenuItem {
  path: string;
  subItems?: never;
}

export interface MenuGroup extends BaseMenuItem {
  path?: string;
  subItems: (MenuLink | MenuGroup)[];
}

export type MenuItem = MenuLink | MenuGroup;

export interface MenuGroupWrapper {
  title: string;
  items: MenuItem[];
}


// const currentUserRoleId = computed(() => authStore.roleId);
// const currentCategoryName = computed(() => serviceStore.serviceCategory);


// // const rawMenu = computed(() => getMenuByCategoryName(currentCategoryName));
// const rawMenu = computed(() =>
//   getMenuByCategoryName(currentCategoryName.value)
// );




const filteredMenu = computed(() => {
  console.log('🔍 Permissions dans le store :', serviceStore.permissions.map(p => p.name))

  if (!serviceStore.permissions.length) {
    console.log(' Aucune permission trouvée, menu vide.')
    return []
  }

  const result = rawMenu.value
    .map((group: any) => {

      const filteredItems = group.items
        .map((item: any) => {
          const hasItemPermission = !item.permission || serviceStore.hasPermission(item.permission)

          const filteredSubItems = item.subItems?.map((subItem: any) => {
            const hasSubItemPermission = !subItem.permission || serviceStore.hasPermission(subItem.permission)

            const filteredSubSubItems = subItem.subItems?.filter((subSubItem: any) => {
              const hasSubSubPermission = !subSubItem.permission || serviceStore.hasPermission(subSubItem.permission)
              return hasSubSubPermission
            }) ?? []

            const isSubItemAllowed = hasSubItemPermission || filteredSubSubItems.length > 0
            if (!isSubItemAllowed) {
              return null
            }

            return {
              ...subItem,
              subItems: filteredSubSubItems,
            }
          }).filter(Boolean) ?? []

          const isItemAllowed = hasItemPermission || filteredSubItems.length > 0
          if (!isItemAllowed) {
            console.log(`❌ Item exclu : ${item.name ?? '??'}`)
            return null
          }

          return {
            ...item,
            subItems: filteredSubItems,
          }
        })
        .filter(Boolean)

      if (filteredItems.length === 0) {
        console.log(`📭 Groupe exclu (aucun item autorisé) : ${group.title ?? 'Sans titre'}`)
        return null
      }

      return {
        ...group,
        items: filteredItems,
      }
    })
    .filter(Boolean)

  console.log('✅ Menu final filtré :', result)
  return result
})


const currentUserRoleId = computed(() => authStore.roleId || 0);
const currentCategoryName = computed(() => serviceStore.serviceCategory || '');

// const rawMenu = computed(() => getMenuByCategoryName(currentCategoryName.value));
const rawMenu = computed(() => {
  const menu = getMenuByCategoryName(currentCategoryName.value, t);
  console.log("Raw Menu:", menu);
  return menu;
});

console.log("User Role ID:", currentUserRoleId.value);
console.log("Category Name:", currentCategoryName.value);



console.log("Type of Current User Role ID:", typeof currentUserRoleId.value);


// Vérifie si une route est active
const isActive = (path: string): boolean => route.path === path;

// Toggle l'ouverture/fermeture d'un sous-menu
const toggleSubmenu = (groupIndex: number, itemIndex: number): void => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

// Toggle l'ouverture/fermeture d'un sous-sous-menu
const toggleSubSubmenu = (groupIndex: number, itemIndex: number, subItemName: string): void => {
  const key = `${groupIndex}-${itemIndex}-${subItemName}`;
  openSubSubmenu.value = openSubSubmenu.value === key ? null : key;
};

// Vérifie si un sous-sous-menu est ouvert
const isSubmenuOpen = (groupIndex: number, itemIndex: number): boolean => {
  const key = `${groupIndex}-${itemIndex}`;
  const item = rawMenu.value[groupIndex]?.items[itemIndex];

  if (!item || !('subItems' in item) || !Array.isArray(item.subItems)) return false;

  const isSubSubmenuActive = item.subItems.some(
    (subItem: any) =>
      Array.isArray(subItem.subItems) &&
      subItem.subItems.some((subSubItem: any) => isActive(subSubItem.path))
  );

  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      (item.subItems.some((subItem: any) => isActive(subItem.path)) || isSubSubmenuActive))
  );
};

// const isSubSubmenuOpen = (groupIndex: number, itemIndex: number, subItemName: string): boolean => {
//   const key = `${groupIndex}-${itemIndex}-${subItemName}`;
//   const item = rawMenu.value[groupIndex]?.items[itemIndex];

//   if (!item || !('subItems' in item) || !Array.isArray(item.subItems)) return false;

//   const subItem = item.subItems.find((si:any) => si.name === subItemName);

//   return (
//     openSubSubmenu.value === key ||
//     (subItem?.subItems?.some((subSubItem:any) => isActive(subSubItem.path)) ?? false)
//   );
// };
const isSubSubmenuOpen = (
  groupIndex: number,
  itemIndex: number,
  subItemName: string
): boolean => {
  const key = `${groupIndex}-${itemIndex}-${subItemName}`;
  const item = rawMenu.value[groupIndex]?.items[itemIndex];

  // Vérifie que l'item a bien des sous-éléments
  if (!item || typeof item !== 'object' || !('subItems' in item) || !Array.isArray((item as any).subItems)) {
    return false;
  }

  // Accès au sous-menu correspondant au nom
  const subItem = (item as any).subItems.find((si: any) => si.name === subItemName);

  // Vérifie que le sous-élément a lui-même des sous-éléments actifs
  return (
    openSubSubmenu.value === key ||
    (subItem?.subItems?.some((subSubItem: any) => isActive(subSubItem.path)) ?? false)
  );
};





// Vérifie si un des sous-menus contient une route active
const isAnySubmenuRouteActive = computed<boolean>(() => {
  return rawMenu.value.some((group: any) =>
    group.items.some((item: any) =>
      item.subItems?.some((subItem: any) =>
        isActive(subItem.path) || subItem.subItems?.some((subSubItem: any) => isActive(subSubItem.path))
      )
    )
  );
});

// Vérifie si le sous-menu est ouvert ou contient une route active
// const isSubmenuOpen = (groupIndex: number, itemIndex: number): boolean | undefined => {
//   const key = `${groupIndex}-${itemIndex}`;
//   const item = rawMenu.value[groupIndex]?.items[itemIndex];

//   if (!item) return false;

//   const isSubSubmenuActive = item.subItems?.some((subItem: any) =>
//     subItem.subItems?.some((subSubItem: any) => isActive(subSubItem.path))
//   );

//   return (
//     openSubmenu.value === key ||
//     (isAnySubmenuRouteActive.value &&
//       (item.subItems?.some((subItem: any) => isActive(subItem.path)) || isSubSubmenuActive))
//   );
// };

// Transition pour ouvrir le menu avec animation
const startTransition = (el: Element): void => {
  // Assurez-vous que el est bien un HTMLElement
  const htmlEl = el as HTMLElement;

  htmlEl.style.height = 'auto';
  const height = htmlEl.scrollHeight;
  htmlEl.style.height = '0px';
  void htmlEl.offsetHeight; // force reflow
  htmlEl.style.height = height + 'px';
};

// Nettoie la transition
const endTransition = (el: Element): void => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
};
</script>
