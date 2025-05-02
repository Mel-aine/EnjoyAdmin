<template>

  <div v-if="isLoading" class="fixed inset-0 z-[100000] flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
      <svg class="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
      </svg>

  </div>
    <aside>

      <div
      :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
      ]"

      >


      <div
      :class="[
      'pt-4 pb-10 flex  ',
      !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
      >
      <router-link to="/" class="flex items-center gap-2 ">


        <img
        v-if="isExpanded || isHovered || isMobileOpen"
        class="dark:hidden rounded-full w-10"
        src="/src/assets/images/header/logo2.png"
        alt="Logo"

        />

        <img
        v-if="isExpanded || isHovered || isMobileOpen"
        class="hidden dark:block rounded-full w-10"
        src="/src/assets/images/header/logo2.png"
        alt="Logo"

        />

        <img
        v-else
        class=" rounded-full w-10"
        src="/src/assets/images/header/logo2.png"
        alt="Logo"

        />
        <span v-if="isExpanded || isHovered || isMobileOpen" class="inline-flex text-xl text-gray-900 font-bold flex-wrap ">{{ serviceName }}</span>
      </router-link>
    </div>
    <div
    class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar mt-2"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
    >
    <nav class="">
      <div class="flex flex-col gap-2">
        <div v-for="(menuGroup, groupIndex) in filteredMenu" :key="groupIndex">
          <ul class="flex flex-col gap-3 ">
            <li v-for="(item, index) in menuGroup.items" :key="item.name">
              <button
              v-if="item.subItems && item.subItems.length > 0"
              @click="toggleSubmenu(groupIndex, index)"
              :class="[
              'menu-item group text-md w-full ',
              {
                'menu-item-active': isSubmenuOpen(groupIndex, index),
                'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
              },
              !isExpanded && !isHovered
              ? 'lg:justify-center'
              : 'lg:justify-start',
              ]"
              >
              <span
              :class="[
              isSubmenuOpen(groupIndex, index)
              ? 'menu-item-icon-active'
              : 'menu-item-icon-inactive',
              ]"
              >
              <component :is="item.icon" />
            </span>
            <span
            v-if="isExpanded || isHovered || isMobileOpen"
            class="menu-item-text  "
            >{{ item.name }}</span
            >
            <ChevronDownIcon
            v-if="isExpanded || isHovered || isMobileOpen"
            :class="[
            'ml-auto w-5 h-5 transition-transform duration-200',
            {
              'rotate-180 text-purple-400': isSubmenuOpen(
              groupIndex,
              index
              ),
            },
            ]"
            />
          </button>
          <router-link
          v-else-if="item.path"
          :to="item.path"
          @click="startLoading"
          :class="[
          'menu-item group',
          {
            'menu-item-active': isActive(item.path),
            'menu-item-inactive': !isActive(item.path),
          },
          ]"
          >
          <span
          :class="[
          isActive(item.path)
          ? 'menu-item-icon-active'
          : 'menu-item-icon-inactive',
          ]"
          >
          <component :is="item.icon" />
        </span>
        <span
        v-if="isExpanded || isHovered || isMobileOpen"
        class="menu-item-text"
        >{{ item.name }}</span
        >
      </router-link>
      <transition
      @enter="startTransition"
      @after-enter="endTransition"
      @before-leave="startTransition"
      @after-leave="endTransition"
      >
      <div
      v-show="
      isSubmenuOpen(groupIndex, index) &&
      (isExpanded || isHovered || isMobileOpen)
      "
      >
      <ul class="mt-2 space-y-1 ml-9">
        <li v-for="subItem in item.subItems" :key="subItem.name">
          <!-- Submenu with sub-subitems -->
          <div v-if="subItem.subItems && subItem.subItems.length > 0">
            <button
              @click="toggleSubSubmenu(groupIndex, index, subItem.name)"
              :class="[
                'menu-dropdown-item text-md flex items-center justify-between w-full',
                {
                  'menu-dropdown-item-active': isSubSubmenuOpen(groupIndex, index, subItem.name) || isActive(subItem.path),
                  'menu-dropdown-item-inactive': !isSubSubmenuOpen(groupIndex, index, subItem.name) && !isActive(subItem.path),
                },
              ]"
            >
              <span>{{ subItem.name }}</span>
              <ChevronDownIcon
                :class="[
                  'w-4 h-4 transition-transform duration-200',
                  {
                    'rotate-180 text-purple-400': isSubSubmenuOpen(groupIndex, index, subItem.name),
                  },
                ]"
              />
            </button>

            <!-- Sub-submenu items -->
            <transition
              @enter="startTransition"
              @after-enter="endTransition"
              @before-leave="startTransition"
              @after-leave="endTransition"
            >
              <ul v-show="isSubSubmenuOpen(groupIndex, index, subItem.name)" class="mt-1 space-y-1 ml-4">
                <li v-for="subSubItem in subItem.subItems" :key="subSubItem.name">
                  <router-link
                    :to="subSubItem.path"
                    @click="startLoading"
                    :class="[
                      'menu-dropdown-item text-md',
                      {
                        'menu-dropdown-item-active': isActive(subSubItem.path),
                        'menu-dropdown-item-inactive': !isActive(subSubItem.path),
                      },
                    ]"
                  >
                    {{ subSubItem.name }}
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>

          <!-- Regular submenu item -->
          <router-link
            v-else
            :to="subItem.path"
            @click="startLoading"
            :class="[
              'menu-dropdown-item text-md ',
              {
                'menu-dropdown-item-active': isActive(subItem.path),
                'menu-dropdown-item-inactive': !isActive(subItem.path),
              },
            ]"
          >
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

  import {
    GridIcon,
    CalenderIcon,
    UserCircleIcon,
    ChevronDownIcon,
    ListIcon,
    SettingsIcon,
    UserGroupIcon,
    RoomIcon,
    PaymentIcon
  } from "../../icons";
  import { Building2 } from 'lucide-vue-next'

  import { useSidebar } from "@/composables/useSidebar";
  import { isLoading } from '@/composables/spinner';
  import { CalendarCheck2 } from 'lucide-vue-next'
  import { useServiceStore } from '@/composables/serviceStore';
  import { getServices} from '@/services/api'
  import { useI18n } from "vue-i18n";
  import { useAuthStore } from '@/composables/user'

  const route = useRoute();
  const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();
  const serviceStore = useServiceStore();
  const authStore = useAuthStore()
  const serviceName = ref('');
  const { t } = useI18n();
  const openSubSubmenu = ref<string | null>(null);

  const fetchService = async () => {
    try {
      const serviceId = serviceStore.serviceId;
      const response = await getServices();

      const foundService = response.data.data.find(
        (service: any) => service.id === serviceId
      );

      if (foundService) {
        serviceName.value = foundService.name;
      } else {
        serviceName.value = 'Unknown Service';
      }

      console.log("service", foundService);
    } catch (error) {
      console.error('fetch failed:', error);
    }
  };

  onMounted(() => {
    fetchService();
  });

  const startLoading = () => {
    isLoading.value = true;
  };

  // Stop loading on navigation end
  watch(() => route.fullPath, () => {
    isLoading.value = false;
  });

  // === Interfaces de typage ===
  // interface SubSubItem {
  //   name: string;
  //   path: string;
  //   roles?: number[]
  // }

  // interface SubItem {
  //   name: string;
  //   path: string;
  //   pro?: boolean;
  //   roles?: number[];
  //   subItems?: SubSubItem[];
  // }

  // interface MenuItem {
  //   icon?: any;
  //   name: string;
  //   path?: string;
  //   subItems?: SubItem[];
  //   roles?: number[]
  // }

  // interface MenuGroup {
  //   title: string;
  //   items: MenuItem[];
  // }

  const menuGroups: any[] = [
    {
      title: 'Menu',
      items: [
        {
          icon: GridIcon,
          name: t('Dashboard'),
          path: '/',
          roles: [1, 2, 3],
        },
        {
          icon: CalendarCheck2,
          name: t('Bookings'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('AllBooking'), path: '/all_booking', roles: [1, 2, 3] },
            { name: t('AddBooking'), path: '/add_booking', roles: [1, 2, 3] },
          ],
        },
        {
          icon: RoomIcon,
          name: t('Room'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('AllRooms'), path: '/all_room', roles: [1, 2, 3] },
            { name: t('RoomTypes'), path: '/type_room', roles: [1, 2] },
          ],
        },
        {
          name: t('Calendar'),
          icon: CalenderIcon,
          path: '/calendar',
          roles: [1, 2, 3],
        },
        {
          name: t('Department'),
          icon: Building2,
          path: '/department',
          roles: [1, 2],
        },
        {
          name: t('Reports'),
          icon: ListIcon,
          roles: [1, 2],
          subItems: [
            {
              name: t('Stocks'),
              path: '/stock',
              roles: [1, 2],
              subItems: [
                //  { name: t('Stock'), path: '/stock', roles: [1, 2] },
                { name: t('StockList'), path: '/stock/product', roles: [1, 2] },
                { name: t('StockMovements'), path: '/stock/movements', roles: [1, 2] },
                { name: t('StockCategory'), path: '/stock/categorie', roles: [1, 2] },
                { name: t('Suppliers'), path: '/stock/suppliers', roles: [1,2] }, // Fournisseurs
                // { name: t('Orders'), path: '/stock/orders', roles: [1, 2] },     // Commandes
                // { name: t('Alerts'), path: '/stock/alerts', roles: [1, 2] },     // Alertes de seuil
                // { name: t('StockReports'), path: '/stock/reports', roles: [1,2] }  // Rapports ou export Excel/PDF
              ]
            },
            { name: t('Expenses'), path: '/expense', roles: [1, 2] },
            // { name: t('Booking'), path: '/booking', roles: [1, 2] },
          ],
        },
        {
          name: t('Customers'),
          icon: UserGroupIcon,
          path: '/customers',
          roles: [1, 2, 3],
        },
        {
          name: t('Payments'),
          icon: PaymentIcon,
          roles: [1, 2, 3],
          subItems: [
            { name: t('InvoiceList'), path: '/allInvoice', roles: [1, 2, 3] },
            { name: t('InvoiceDetails'), path: '/invoice', roles: [1, 2, 3] },
          ],
        },
        {
          name: t('User'),
          icon: UserCircleIcon,
          path: '/user',
          roles: [1, 2],
        },
        {
          name: t('Setting'),
          icon: SettingsIcon,
          path: '/setting',
          roles: [1, 2],
        },
      ],
    },
  ];

  const currentUserRoleId = authStore.roleId;
  const filteredMenu = computed(() => {
    if (currentUserRoleId == null) return [];

    return menuGroups
      .map((group: any) => {
        const filteredItems = group.items
          .map((item: any) => {
            const filteredSubItems = item.subItems?.map((subItem: any) => {
              const filteredSubSubItems = subItem.subItems?.filter((subSubItem: any) =>
                subSubItem.roles?.includes(currentUserRoleId!)
              );

              const isSubItemAllowed =
                subItem.roles?.includes(currentUserRoleId!) || (filteredSubSubItems?.length ?? 0) > 0;

              if (!isSubItemAllowed) return null;

              return {
                ...subItem,
                subItems: filteredSubSubItems,
              };
            }).filter(Boolean);

            const isItemAllowed =
              item.roles?.includes(currentUserRoleId!) || (filteredSubItems?.length ?? 0) > 0;

            if (!isItemAllowed) return null;

            return {
              ...item,
              subItems: filteredSubItems,
            };
          })
          .filter(Boolean);

        if (filteredItems.length === 0) return null;

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter(Boolean);
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

  // Vérifie si un sous-sous-menu est ouvert
  const isSubSubmenuOpen = (groupIndex: number, itemIndex: number, subItemName: string): boolean => {
    const key = `${groupIndex}-${itemIndex}-${subItemName}`;
    const item = menuGroups[groupIndex]?.items[itemIndex];
    const subItem = item?.subItems?.find((si:any) => si.name === subItemName);

    return (
      openSubSubmenu.value === key ||
      (subItem?.subItems?.some((subSubItem:any) => isActive(subSubItem.path)) ?? false)
    );
  };

  // Vérifie si un des sous-menus contient une route active
  const isAnySubmenuRouteActive = computed<boolean>(() => {
    return menuGroups.some((group) =>
      group.items.some((item: any) =>
        item.subItems?.some((subItem: any) =>
          isActive(subItem.path) || subItem.subItems?.some((subSubItem: any) => isActive(subSubItem.path))
        )
      )
    );
  });

  // Vérifie si le sous-menu est ouvert ou contient une route active
  const isSubmenuOpen = (groupIndex: number, itemIndex: number): boolean | undefined => {
    const key = `${groupIndex}-${itemIndex}`;
    const item = menuGroups[groupIndex]?.items[itemIndex];

    if (!item) return false;

    const isSubSubmenuActive = item.subItems?.some((subItem: any) =>
      subItem.subItems?.some((subSubItem: any) => isActive(subSubItem.path))
    );

    return (
      openSubmenu.value === key ||
      (isAnySubmenuRouteActive.value &&
        (item.subItems?.some((subItem: any) => isActive(subItem.path)) || isSubSubmenuActive))
    );
  };

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
