<template>
  <div v-if="isLoading"
    class="fixed inset-0 z-[100000] flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
    <svg class="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
    </svg>
  </div>

  <aside >
    <div :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-19 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[250px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]">

      

      <!-- Zone de navigation scrollable -->
      <div class="flex-1 overflow-hidden"
        @mouseenter="!isExpanded && (isHovered = true)"
        @mouseleave="isHovered = false">

        <nav class="h-full overflow-y-auto sidebar-scroll px-2 py-2">
          <div class="flex flex-col gap-2 pb-6">
            <div v-for="(menuGroup, groupIndex) in filteredMenu" :key="groupIndex">
              <ul class="flex flex-col gap-3" v-if="menuGroup">
                <li v-for="(item, index) in menuGroup.items" :key="item.name" >

                  <!-- Menu avec sous-éléments -->
                  <button v-if="item.subItems && item.subItems.length > 0"
                    @click="toggleSubmenu(groupIndex, index)"
                    :class="[
                      'menu-item group text-md w-full',
                      {
                        'menu-item-active': isSubmenuOpen(groupIndex, index),
                        'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                      },
                      !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                    ]">
                    <span :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]">
                      <component :is="item.icon" />
                    </span>
                    <span v-if="isExpanded || isHovered || isMobileOpen"
                      class="menu-item-text">
                      {{ item.name }}
                    </span>
                    <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen"
                      :class="[
                        'ml-auto w-5 h-5 transition-transform duration-200',
                        {
                          'rotate-180 text-purple-400': isSubmenuOpen(groupIndex, index),
                        },
                      ]" />
                  </button>

                  <!-- Menu sans sous-éléments -->
                  <router-link v-else-if="item.path"
                    :to="item.path"
                    @click="startLoading"
                    :class="[
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
                    <span v-if="isExpanded || isHovered || isMobileOpen"
                      class="menu-item-text">
                      {{ item.name }}
                    </span>
                  </router-link>

                  <!-- Sous-menus avec transition -->
                  <transition @enter="startTransition" @after-enter="endTransition"
                    @before-leave="startTransition" @after-leave="endTransition">
                    <div v-show="isSubmenuOpen(groupIndex, index) && (isExpanded || isHovered || isMobileOpen)">
                      <ul class="mt-2 space-y-1 ml-9">
                        <li v-for="subItem in item.subItems" :key="subItem.name">

                          <!-- Submenu avec sous-sous-éléments -->
                          <div v-if="subItem.subItems && subItem.subItems.length > 0">
                            <button @click="toggleSubSubmenu(groupIndex, index, subItem.name)"
                              :class="[
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

                            <!-- Sous-sous-menu -->
                            <transition @enter="startTransition" @after-enter="endTransition"
                              @before-leave="startTransition" @after-leave="endTransition">
                              <ul v-show="isSubSubmenuOpen(groupIndex, index, subItem.name)"
                                class="mt-1 space-y-1 ml-4">
                                <li v-for="subSubItem in subItem.subItems" :key="subSubItem.name">
                                  <router-link :to="subSubItem.path"
                                    @click="startLoading"
                                    :class="[
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

                          <!-- Submenu simple -->
                          <router-link v-else
                            :to="subItem.path"
                            @click="startLoading"
                            :class="[
                              'menu-dropdown-item text-md',
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
import { useSidebar } from "@/composables/useSidebar";
import { isLoading } from '@/composables/spinner';
import { useServiceStore } from '@/composables/serviceStore';
import { useI18n } from "vue-i18n";
import { useAuthStore } from '@/composables/user'
import { filterMenuByPermissions } from '@/utils/menuUtil'

const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();
const serviceStore = useServiceStore();
const authStore = useAuthStore()
const { t } = useI18n();
const openSubSubmenu = ref<string | null>(null);


const serviceName = computed(() => {
  try {
    console.log('currentService:', serviceStore.currentService)
    const service = JSON.parse(serviceStore.currentService || '{}');
    return service.hotelName;
  } catch (e) {
    console.error('Erreur lors du parsing de currentService:', e);
    return 'Nom inconnu';
  }
});



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




const filteredMenu = computed(() => {
  try {
    console.log(' Permissions dans le store :', serviceStore.permissions.map(p => p.name))

    if (!serviceStore.permissions.length) {
      console.log(' Aucune permission trouvée, menu vide.')
      return []
    }

    const categoryName = 'hotel'
    console.log(' Catégorie de service:', categoryName)

    const menuGroups = getMenuByCategoryName(categoryName, t)
    console.log(' Groupes de menu récupérés:', menuGroups.length)

    if (!Array.isArray(menuGroups) || menuGroups.length === 0) {
      console.warn(' Aucun menu trouvé pour la catégorie:', categoryName)
      return []
    }

    // Filtrer chaque groupe de menu
    const result = menuGroups.map(group => {
      if (!group || !Array.isArray(group.items)) {
        console.warn(' Groupe de menu invalide:', group)
        return null
      }

      const filteredItems = filterMenuByPermissions(group.items, serviceStore.hasPermission)

      if (filteredItems.length === 0) {
        console.log(` Groupe exclu (aucun item autorisé): ${group.title}`)
        return null
      }

      return {
        ...group,
        items: filteredItems,
      }
    }).filter(Boolean)

    console.log(' Menu final filtré:', result.length, 'groupes')
    return result

  } catch (error) {
    console.error(' Erreur dans filteredMenu:', error)
    return []
  }
})



const isSubmenuOpen = (groupIndex: number, itemIndex: number): boolean => {
  const key = `${groupIndex}-${itemIndex}`;
  const item = filteredMenu.value[groupIndex]?.items[itemIndex];

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
const currentService = computed(() => {
  try {
    return JSON.parse(serviceStore.currentService || '{}');
  } catch (e:any) {
    return {};
  }
});


const isSubSubmenuOpen = (
  groupIndex: number,
  itemIndex: number,
  subItemName: string
): boolean => {
  const key = `${groupIndex}-${itemIndex}-${subItemName}`;

  const item = filteredMenu.value[groupIndex]?.items[itemIndex];

  if (!item || typeof item !== 'object' || !('subItems' in item) || !Array.isArray((item as any).subItems)) {
    return false;
  }

  const subItem = (item as any).subItems.find((si: any) => si.name === subItemName);

  return (
    openSubSubmenu.value === key ||
    (subItem?.subItems?.some((subSubItem: any) => isActive(subSubItem.path)) ?? false)
  );
};

const isAnySubmenuRouteActive = computed<boolean>(() => {
  return filteredMenu.value.some((group: any) =>
    group.items.some((item: any) =>
      item.subItems?.some((subItem: any) =>
        isActive(subItem.path) || subItem.subItems?.some((subSubItem: any) => isActive(subSubItem.path))
      )
    )
  );
});



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


// Transition pour ouvrir le menu avec animation
const startTransition = (el: Element): void => {
  const htmlEl = el as HTMLElement;

  htmlEl.style.height = 'auto';
  const height = htmlEl.scrollHeight;
  htmlEl.style.height = '0px';
  void htmlEl.offsetHeight;
  htmlEl.style.height = height + 'px';
};

// Nettoie la transition
const endTransition = (el: Element): void => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
};
</script>
<style scoped>
@reference "tailwindcss";

.sidebar-scroll {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}

.sidebar-scroll::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
</style>
