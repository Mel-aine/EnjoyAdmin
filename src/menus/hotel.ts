
import {
  CalendarCheck2,
  Building2,
  LayoutDashboard,
  UserCircleIcon,
  SettingsIcon,
  BedDouble,
  CalendarDays,
  ClipboardPlus,
  UsersRound,
  Banknote,
} from 'lucide-vue-next';

export const getHotelMenu = (t: (key: string) => string) => {
  return [
    {
      title: 'Menu',
      items: [
        {
          icon: LayoutDashboard,
          name: t('Dashboard'),
          path: '/dashboard',
          permission: 'dashboard_view',
        },
        {
          icon: CalendarCheck2,
          name: t('Bookings'),
          // permission: 'bookings_view',
          subItems: [
            { name: t('AllBooking'), path: '/all_booking', permission: 'bookings_read' },
            { name: t('AddBooking'), path: '/add_booking', permission: 'bookings_create' },
          ],
        },
        {
          icon: BedDouble,
          name: t('Room'),
          // permission: 'rooms_view',
          subItems: [
            { name: t('AllRooms'), path: '/all_room', permission: 'rooms_read' },
            { name: t('RoomTypes'), path: '/room_type', permission: 'rooms_manage' },
            { name: t('occupancy'), path: '/occupancy', permission: 'rooms_occupancy_view' },
          ],
        },
        {
          icon: CalendarDays,
          name: t('Calendar'),
          path: '/calendar',
          permission: 'calendar_view',
        },
        {
          icon: Building2,
          name: t('Department'),
          path: '/department',
          permission: 'departments_view',
        },
        {
          icon: ClipboardPlus,
          name: t('Reports'),
          // permission: 'reports_view',
          subItems: [
            {
              name: t('Stocks'),
              path: '/stock',
              permission: 'inventory_view',
              subItems: [
                { name: t('StockList'), path: '/stock/product', permission: 'inventory_read' },
                { name: t('StockMovements'), path: '/stock/movements', permission: 'inventory_history_view' },
                { name: t('StockCategory'), path: '/stock/categorie', permission: 'inventory_category_view' },
                { name: t('Suppliers'), path: '/stock/suppliers', permission: 'suppliers_view' },
              ],
            },
            { name: t('Expenses'), path: '/expense', permission: 'expenses_view' },
          ],
        },
        {
          icon: UsersRound,
          name: t('Customers'),
          path: '/customers',
          permission: 'customers_view',
        },
        {
          icon: Banknote,
          name: t('Payments'),
          path: '/allInvoice',
          permission: 'billing_manage',
        },
        {
          icon: UserCircleIcon,
          name: t('Staff Management'),
          // permission: 'staff_view',
          subItems: [
            { name: t('Dashboard Overview'), path: '/staff_management/dashboard', permission: 'staff_dashboard_view' },
            { name: t('Staff Management'), path: '/staff_management/staff_management', permission: 'staff_manage' },
            { name: t('Permission'), path: '/permission', permission: 'permissions_manage' },
            { name: t('Task Management'), path: '/staff_management/task_management', permission: 'task_manage' },
            { name: t('Staff Schedule'), path: '/staff_management/staff_schedule', permission: 'schedule_manage' },
            { name: t('Action History'), path: '/staff_management/action_history', permission: 'staff_history_view' },
          ],
        },
        {
          icon: SettingsIcon,
          name: t('Setting'),
          path: '/setting',
          permission: 'settings_manage',
        },
      ],
    },
  ];
};
