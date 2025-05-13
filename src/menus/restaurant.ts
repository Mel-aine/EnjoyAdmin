import {
  LayoutDashboard,
  Banknote,
  SettingsIcon,
  CalendarDays,
  UsersRound,
  UserCircleIcon,
  CookingPot,
  HandPlatter,
  Beef,
  Database
} from  'lucide-vue-next';

export const getRestaurantMenu = (t: (key: string) => string) => {


  return [
    {
      title: 'Restaurant',
      items: [
        {
          icon: LayoutDashboard,
          name: t('Dashboard'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('Dashboard'), path: '/dashboard', roles: [1, 2, 3] },
            { name: t('order'), path: '/order', roles: [1, 2, 3] },
          ],
        },
        {
          icon: CookingPot,
          name: t('menus'),
          path: '/menu',
          roles: [1, 2, 3],
        },
        {
          icon:  HandPlatter,
          name: t('plat'),
          path: '/plates',
          roles: [1, 2, 3],
        },
        {
          icon: Beef,
          name: t('product'),
          path: '/products',
          roles: [1, 2, 3],
        },
        {
          icon: CalendarDays,
          name: t('Calendar'),
          path: '/calendar',
          roles: [1, 2, 3],
        },
        {
          icon: Database,
          name: t('Stocks'),
          path: '/Stocks',
          roles: [1, 2, 3],
        },
        {
          icon: UsersRound,
          name: t('Customers'),
          path: '/customer',
          roles: [1, 2, 3],
        },
        // {
        //   icon:  Banknote,
        //   name: t('Payments'),
        //   roles: [1, 2, 3],
        //   subItems: [
        //     { name: t('InvoiceList'), path: '/allInvoice', roles: [1, 2, 3] },
        //     { name: t('InvoiceDetails'), path: '/invoice', roles: [1, 2, 3] },
        //   ],
        // },
        {
          icon: UserCircleIcon,
          name: t('User'),
          path: '/users',
          roles: [1, 2],
        },
        {
          icon: SettingsIcon,
          name: t('Setting'),
          path: '/setting',
          roles: [1, 2],
        },
      ],
    },
  ];
};
