import {
  Building2,
  CreditCard,
  Home,
  Settings,
  BarChart3,
  ClipboardList,
  Lock
} from 'lucide-vue-next'

export const getHotelMenu = (t: (key: string) => string) => {
  return [
    {
      title: 'Menu',
      items: [
        //From office
        {
          icon: Building2,
          name: t('front_office'),
          permission: 'dashboard_view',
          subItems: [
            {
              name: t('Dashboard'),
              path: '/front-office/dashboard',
              permission: 'dashboard_view',
            },
            {
              name: t('reservations'),
              path: '/reservations_grid',
              permission: 'dashboard_view',
            },
            {
              name: t('stay_view'),
              path: '/stay_view',
              permission: 'dashboard_view',
            },
            {
              name: t('room_view'),
              path: '/room_view',
              permission: 'dashboard_view',
            },
            {
              name: t('guest_database'),
              path: '/guest_database',
              permission: 'dashboard_view',
            },
           /* {
              name: t('insert_transaction'),
              path: '/insert_transaction',
              permission: 'dashboard_view',
            },*/
            {
              name: t('lost_and_found'),
              path: '/lost_and_found',
              permission: 'dashboard_view',
            },
           /*
            {
              name: t('guest_reviews'),
              path: '/guest_reviews',
              permission: 'dashboard_view',
            },*/
            {
              name: t('unsettled_folios'),
              path: '/front-office/unsettled_folios',
              permission: 'dashboard_view',
            },
          ]
        },
        //From Cashiering
        {
          icon: CreditCard,
          name: t('cashiering'),
          permission: 'dashboard_view',
          subItems: [
            {
              name: t('cashiering_center'),
              path: '/cashiering/center',
              permission: 'dashboard_view',
            },
            {
              name: t('travel_agent_database'),
              path: '/reservations',
              permission: 'dashboard_view',
            },
            {
              name: t('sales_person_database'),
              path: '/stay_view',
              permission: 'dashboard_view',
            },
            {
              name: t('company_database'),
              path: '/cashiering/company_database',
              permission: 'dashboard_view',
            },
            {
              name: t('expense_voucher'),
              path: '/room_view',
              permission: 'dashboard_view',
            },
            {
              name: t('pos'),
              path: '/guest_database',
              permission: 'dashboard_view',
            },
            {
              name: t('exchange_rate'),
              path: '/insert_transaction',
              permission: 'dashboard_view',
            }

          ]
        }
        ,
        // Housekeeping

        {
          icon: Home,
          name: t('Housekeeping'),
          subItems: [
            {
              name: t('house_status'),
              path: '/house_status',
              permission: 'bookings_read',
            },
            {
              name: t('maintenance_block'),
              path: '/maintenance_block',
              permission: 'bookings_create',
            },
            {
              name: t('work_order'),
              path: '/work_order',
              permission: 'bookings_create',
            },
          ],
        },

        //Night Audit
        {
              icon: ClipboardList,
              name: t('night_audit'),
              path: '/night_audit',
              permission: 'dashboard_view',
        },
        //Reports
        {
              icon: BarChart3,
              name: t('Reports'),
              path: '/reports',
              permission: 'dashboard_view',
        },
        //Net Locks
        {
              icon: Lock,
              name: t('net_locks'),
              path: '/net_locks',
              permission: 'dashboard_view',
        },
        //Configuration
        // {
        //   icon: Settings,
        //   name: t('configuration'),
        //   permission: 'dashboard_view',
        //   path: '/reports',
        // },
        //back office
        /*{
          name: t('Back Office'),
          path: '/all_booking',
          permission: 'bookings_read',
        },

        {
          icon: CalendarCheck2,
          name: t('Bookings'),

          subItems: [
            {
              name: t('AllBooking'),
              path: '/all_booking',
              permission: 'bookings_read',
            },
            {
              name: t('AddBooking'),
              path: '/add_booking',
              permission: 'bookings_create',
            },
          ],
        },
        {
          icon: Banknote,
          name: t('cash_register'),
          subItems: [
            {
              name: t('Expenses'),
              path: '/expense',
              permission: 'expenses_view',
            },
            {
              name: t('Payments'),
              path: '/allInvoice',
              permission: 'billing_manage',
            },
            { name: t('Refunds'), path: '/refunds' }, // Pas de permission spécifique définie
          ],
        },
        {
          icon: UsersRound,
          name: t('Customers'),
          path: '/customers',
          permission: 'customers_view',
        },
        {
          icon: BedDouble,
          name: t('Room'),
          permission: 'rooms_view',
          subItems: [
            {
              name: t('AllRooms'),
              path: '/all_room',
              permission: 'rooms_read',
            },
            {
              name: t('RoomTypes'),
              path: '/room_type',
              permission: 'rooms_manage',
            },
            {
              name: t('occupancy'),
              path: '/occupancy',
              permission: 'rooms_occupancy_view',
            },
          ],
        },
        /* {
          icon: CalendarDays,
          name: t('Calendar'),
          path: '/calendar',
          permission: 'calendar_view',
        },
        {
          icon: CommandIcon,
          name: t('amenities'),
          path: '/amenities',
        },
        {
          icon: ClipboardPlus,
          name: t('inventory_management'),
          permission: 'reports_view',
          subItems: [
            {
              name: t('StockList'),
              path: '/stock/product',
              permission: 'inventory_read',
            },
            {
              name: t('StockMovements'),
              path: '/stock/movements',
              permission: 'inventory_history_view',
            },
            {
              name: t('StockCategory'),
              path: '/stock/categorie',
              permission: 'inventory_category_view',
            },
            {
              name: t('Suppliers'),
              path: '/stock/suppliers',
              permission: 'suppliers_view',
            },
          ],
        },
        {
          icon: UserCircleIcon,
          name: t('RH'),
          permission: 'staff_view',
          subItems: [
            {
              name: t('Dashboard Overview'),
              path: '/staff_management/dashboard',
              permission: 'staff_dashboard_view',
            },
            {
              icon: Building2,
              name: t('Department'),
              path: '/department',
              permission: 'departments_view',
            },
            {
              name: t('Staff Management'),
              path: '/staff_management/staff_management',
              permission: 'staff_manage',
            },
            {
              name: t('Permission'),
              path: '/permission',
              permission: 'permissions_manage',
            },
            {
              name: t('Task Management'),
              path: '/staff_management/task_management',
              permission: 'task_manage',
            },
            {
              name: t('Staff Schedule'),
              path: '/staff_management/staff_schedule',
              permission: 'schedule_manage',
            },
            {
              name: t('Action History'),
              path: '/staff_management/action_history',
              permission: 'staff_history_view',
            },
          ],
        },
        {
          icon: SettingsIcon,
          name: t('Setting'),
          path: '/setting',
          permission: 'settings_manage',
        },
        {
          icon: FileText,
          name: t('Reports'),
          permission: 'dashboard_view',
          path: '/reports',
        },*/



      ],
    },
  ]
}
