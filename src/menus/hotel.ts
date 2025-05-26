import {

  CalendarCheck2,
  Building2,
  LayoutDashboard,
  UserCircleIcon,
  SettingsIcon,
  BedDouble,CalendarDays,ClipboardPlus,UsersRound, Banknote
} from 'lucide-vue-next';

export const getHotelMenu = (t: (key: string) => string) => {


  return [
    {
      title: 'Menu',
      items: [
        {
          icon: LayoutDashboard,
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
          icon: BedDouble,
          name: t('Room'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('AllRooms'), path: '/all_room', roles: [1, 2, 3] },
            // { name: t('RoomTypes'), path: '/type_room', roles: [1, 2] },
            { name: t('occupancy'), path: '/occupancy', roles: [1, 2] },
          ],
        },
        {
          icon: CalendarDays,
          name: t('Calendar'),
          path: '/calendar',
          roles: [1, 2, 3],
        },
        {
          icon: Building2,
          name: t('Department'),
          path: '/department',
          roles: [1, 2],
        },
        {
          icon: ClipboardPlus,
          name: t('Reports'),
          roles: [1, 2],
          subItems: [
            {
              name: t('Stocks'),
              path: '/stock',
              roles: [1, 2],
              subItems: [
                { name: t('StockList'), path: '/stock/product', roles: [1, 2] },
                { name: t('StockMovements'), path: '/stock/movements', roles: [1, 2] },
                { name: t('StockCategory'), path: '/stock/categorie', roles: [1, 2] },
                { name: t('Suppliers'), path: '/stock/suppliers', roles: [1, 2] },
              ],
            },
            { name: t('Expenses'), path: '/expense', roles: [1, 2] },
          ],
        },
        {
          icon: UsersRound,
          name: t('Customers'),
          path: '/customers',
          roles: [1, 2, 3],
        },
        {
          icon:  Banknote,
          name: t('Payments'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('InvoiceList'), path: '/allInvoice', roles: [1, 2, 3] },
            { name: t('InvoiceDetails'), path: '/invoice', roles: [1, 2, 3] },
          ],
        },
        {
          icon: UserCircleIcon,
          name: t('User'),
          path: '/user',
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
