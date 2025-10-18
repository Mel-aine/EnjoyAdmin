import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/composables/user'
import { isLoading } from '@/composables/spinner'
import { useServiceStore } from '@/composables/serviceStore'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/setup',
      name: 'SetupSpace',
      component: () => import('../views/Pages/SetupSpace.vue'),
      meta: {
        title: 'Setting up your space',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/dashboard',
      name: 'dashboard',
      component: () => import('../views/Edashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/front-office/dashboard',
      name: 'FrontOfficeDashboard',
      component: () => import('../views/FrontOffice/FrontOfficeDashboard.vue'),
      meta: {
        title: 'Front Office Dashboard',
        requiresAuth: true,
      },
    },
    {
       path: '/front-office/unsettled_folios',
      name: 'UnsettledFolios',
      component: () => import('../views/FrontOffice/UnsettledFolios.vue'),
      meta: {
        title: 'Unsettled Folios',
        requiresAuth: true,
      },
    },
    {
      path: '/front-office/night-audit',
      name: 'NightAudit_Office',
      component: () => import('../views/FrontOffice/NightAudit.vue'),
      meta: {
        title: 'Night Audit',
        requiresAuth: false,
      },
    },

    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/Pages/Welcome.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/all_booking',
      name: 'All Booking',
      component: () => import('../views/Bookings/AllBooking.vue'),
      meta: {
        title: 'All Booking',
      },
    },
    {
      path: '/add_booking',
      name: 'Add Booking',
      component: () => import('../views/Bookings/AddBooking.vue'),
      meta: {
        title: 'Add Booking',
        requiresAuth: true,
      },
    },
    {
      path: '/new_booking',
      name: 'New Booking',
      component: () => import('../views/Bookings/BookingForm.vue'),
      meta: {
        title: 'New Booking',
        requiresAuth: true,
      },
    },
    {
      path: '/addbooking/:id',
      name: 'AddBooking',
      component: () => import('../views/Bookings/AddBooking.vue'),
      meta: {
        title: 'Edit Booking',
        requiresAuth: true,
      },

    },

    {
      path: '/add_booking/:id',
      name: 'EditBooking',
      component: () => import('../views/Bookings/AddBooking.vue'),
      props: true,
      meta: {
        title: 'Edit Booking',
        requiresAuth: true,
      },
    },
    {
      path: '/booking_detail/:id',
      name: 'BookingDetails',
      component: () => import('../views/Bookings/BookingDetails.vue'),
      props: true,
      meta: {
        title: 'Booking Details',
        requiresAuth: true,
      },
    },
    {
      path: '/customer_detail/:id',
      name: 'CustomerDetails',
      component: () => import('../views/Customers/CustomerDetails.vue'),
      props: true,
      meta: {
        title: 'Customers Details',
        requiresAuth: true,
      },
    },
    {
      path: '/customer_detail_log/:id',
      name: 'CustomerAuditLog',
      component: () => import('../views/Customers/CustomerDetailsLogs.vue'),
      props: true,
      meta: {
        title: 'Customers Details',
        requiresAuth: true,
      },
    },
    {
      path: '/room_detail/:id',
      name: 'RoomDetailsModal',
      component: () => import('../views/Room/RoomDetailsModal.vue'),
      props: true,
      meta: {
        title: 'Room Details',
        requiresAuth: true,
      },
    },
    {
      path: '/refunds',
      name: 'refunds',
      component: () => import('../views/Bookings/RefundsList.vue'),
      props: true,
      meta: {
        title: 'Refund',
        requiresAuth: true,
      },
    },
    {
      path: '/reservations_grid',
      name: 'ReservationGridView',
      component: () => import('../views/Bookings/ReservationGridView.vue'),
      meta: {
        title: 'Reservation Grid View',
        requiresAuth: true,
      },
    },
    {
      path: '/lost_and_found',
      name: 'LostAndFound',
      component: () => import('../views/FrontOffice/LostAndFound.vue'),
      meta: {
        title: 'Lost and Found',
        requiresAuth: true,
      },
    },
    {
      path: '/all_room',
      name: 'All Room',
      component: () => import('../views/Room/AllRoom.vue'),
      meta: {
        title: 'All Room',
        requiresAuth: true,
      },
    },
    {
      path: '/room_type',
      name: 'Room Type',
      component: () => import('../views/Room/RoomTypes.vue'),
      meta: {
        title: 'Room Type',
        requiresAuth: true,
      },
    },
    {
      path: '/room_view',
      name: 'Room view',
      component: () => import('../views/Room/OccupancyView.vue'),
      meta: {
        title: 'Room view',
        requiresAuth: true,
      },
    },

    {
      path: '/stock/product',
      name: 'stock product',
      component: () => import('../views/Reports/Stocks/ProductList.vue'),
      meta: {
        title: 'Stock product',
        requiresAuth: true,
      },
    },
    {
      path: '/stock/movements',
      name: 'stock movement',
      component: () => import('../views/Reports/Stocks/StockMovement.vue'),
      meta: {
        title: 'Stock movement',
        requiresAuth: true,
      },
    },
    {
      path: '/stock/categorie',
      name: 'stock categorie',
      component: () => import('../views/Reports/Stocks/StockCategorie.vue'),
      meta: {
        title: 'Stock categorie',
        requiresAuth: true,
      },
    },
    {
      path: '/stock/suppliers',
      name: 'supplier',
      component: () => import('../views/Reports/Stocks/SupplierList.vue'),
      meta: {
        title: 'Supplier',
        requiresAuth: true,
      },
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/Users/UsersTable.vue'),
      meta: {
        title: 'User',
        requiresAuth: true,
      },
    },
    {
      path: '/expense',
      name: 'expense',
      component: () => import('../views/Reports/ExpensesTable.vue'),
      meta: {
        title: 'Expense',
        requiresAuth: true,
      },
    },
    // Reports Routes
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('../views/Reports/ReportsIndex.vue'),
      meta: {
        title: 'Reports',
        requiresAuth: true,
      },
    },
    // Reservation Reports
    {
      path: '/reports/reservation/arrival-list',
      name: 'ArrivalList',
      component: () => import('../views/Reports/Reservation/ArrivalList.vue'),
      meta: {
        title: 'Arrival List',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/reservation/departure-list',
      name: 'DepartureList',
      component: () => import('../views/Reports/Reservation/DepartureList.vue'),
      meta: {
        title: 'Departure List',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/reservation/confirmed-reservations',
      name: 'ConfirmedReservations',
      component: () => import('../views/Reports/Reservation/ConfirmedReservations.vue'),
      meta: {
        title: 'Confirmed Reservations',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/reservation/cancelled-reservations',
      name: 'CancelledReservations',
      component: () => import('../views/Reports/Reservation/CancelledReservations.vue'),
      meta: {
        title: 'Cancelled Reservations',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/reservation/no-show-reservations',
      name: 'NoShowReservations',
      component: () => import('../views/Reports/Reservation/NoShowReservations.vue'),
      meta: {
        title: 'No Show Reservations',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/reservation/reservation-activity',
      name: 'reservationActivity',
      component: () => import('../views/Reports/Reservation/ReservationActivity.vue'),
      meta: {
        title: 'Reservation Activity',
        requiresAuth: true,
      },
    },    {
      path: '/reports/reservation/release-reservation-list',
      name: 'releaseReservationList',
      component: () => import('../views/Reports/Reservation/ReleaseReservations.vue'),
      meta: {
        title: 'Release Reservation List',
        requiresAuth: true,
      },
    },    {
      path: '/reports/reservation/country-wise-reservation-statistics',
      name: 'countryWiseReservationStatistics',
      component: () => import('../views/Reports/Reservation/CountryWiseReservations.vue'),
      meta: {
        title: 'Country Wise Reservation Statistics',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/reservation/void-reservation',
      name: 'voidReservation',
      component: () => import('../views/Reports/Reservation/VoidReservations.vue'),
      meta: {
        title: 'void Reservations',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/reservation/reservation-forecast',
      name: 'ReservationForecast',
      component: () => import('../views/Reports/Reservation/ReservationForecast.vue'),
      meta: {
        title: 'Reservation Forecast',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/reservation/daily-operation-report',
      name: 'DailyOperationReport',
      component: () => import('../views/Reports/Reservation/DailyOperationReport.vue'),
      meta: {
        title: 'Daily Operation Report',
        requiresAuth: true,
      },
    },
    // Front Office Reports
    {
      path: '/reports/front-office/guest-checked-in',
      name: 'GuestCheckedIn',
      component: () => import('../views/Reports/FrontOffice/GuestCheckedIn.vue'),
      meta: {
        title: 'Guest Checked In',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/guest-checked-out',
      name: 'GuestCheckedOut',
      component: () => import('../views/Reports/FrontOffice/GuestCheckedOut.vue'),
      meta: {
        title: 'Guest Checked Out',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/room-availability',
      name: 'RoomAvailability',
      component: () => import('../views/Reports/FrontOffice/RoomAvailability.vue'),
      meta: {
        title: 'Room Availability',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/night-audit',
      name: 'NightAudit',
      component: () => import('../views/Reports/FrontOffice/NightAudit.vue'),
      meta: {
        title: 'Night Audit',
        requiresAuth: true,
      },
    },
    // Back Office Reports
    {
      path: '/reports/back-office/revenue-reports',
      name: 'RevenueReports',
      component: () => import('../views/Reports/BackOffice/RevenueReports.vue'),
      meta: {
        title: 'Revenue Reports',
        requiresAuth: true,
      },
    },
    // TODO: Uncomment and update the path when the AdvanceDepositLedger component is created
    // {
    //   path: '/reports/back-office/advance-deposit-ledger',
    //   component: () => import('@/views/Reports/BackOffice/AdvanceDepositLedger.vue'),
    //   meta: {
    //     title: 'Advance Deposit Ledger',
    //     requiresAuth: true,
    //   },
    // },
    {
      path: '/reports/back-office/work-order-list',
      name: 'WorkOrderList',
      component: () => import('@/views/Reports/BackOffice/WorkOrderList.vue'),
      meta: {
        title: 'Work Order List',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/daily-receipt-detail',
      name: 'DailyReceiptDetail',
      component: () => import('../views/Reports/BackOffice/DailyReceiptDetail.vue'),
      meta: {
        title: 'Daily Receipt Detail',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/daily-receipt-summary',
      name: 'DailyReceiptSummary',
      component: () => import('../views/Reports/BackOffice/DailyReceiptSummary.vue'),
      meta: {
        title: 'Daily Receipt Summary',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/daily-revenue',
      name: 'DailyRevenue',
      component: () => import('../views/Reports/BackOffice/DailyRevenue.vue'),
      meta: {
        title: 'Daily Revenue',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/daily-refund-report',
      name: 'DailyRefundReport',
      component: () => import('../views/Reports/BackOffice/DailyRefundReport.vue'),
      meta: {
        title: 'Daily Refund Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/expense-voucher',
      name: 'ExpenseVoucher',
      component: () => import('../views/Reports/BackOffice/ExpenseVoucher.vue'),
      meta: {
        title: 'Expense Voucher',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/manager-report',
      name: 'ManagerReport',
      component: () => import('../views/Reports/BackOffice/ManagerReport.vue'),
      meta: {
        title: 'Manager Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/revenue-by-rate-type',
      name: 'RevenueByRateType',
      component: () => import('../views/Reports/BackOffice/RevenueByRateType.vue'),
      meta: {
        title: 'Revenue By Rate Type',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/revenue-by-room-type',
      name: 'RevenueByRoomType',
      component: () => import('../views/Reports/BackOffice/RevenueByRoomType.vue'),
      meta: {
        title: 'Revenue By Room Type',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/folio-list',
      name: 'FolioList',
      component: () => import('../views/Reports/BackOffice/FolioList.vue'),
      meta: {
        title: 'Folio List',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/daily-extra-charge-detail',
      name: 'DailyExtraChargeDetail',
      component: () => import('../views/Reports/BackOffice/DailyExtraCharge.vue'),
      meta: {
        title: 'Daily Extra Charge Detail',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/travel-agent-commission-detail',
      name: 'travelAgentCommissionDetail',
      component: () => import('../views/Reports/BackOffice/TravelAgentCommission.vue'),
      meta: {
        title: 'Travel Agent Commission Detail',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/audit/audit-trail',
      name: 'auditTrail',
      component: () => import('../views/Reports/Audit/AuditTrails.vue'),
      meta: {
        title: 'Audit Trail',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/audit/void-charge',
      name: 'voidCharge',
      component: () => import('../views/Reports/Audit/VoidCharge.vue'),
      meta: {
        title: 'Void Charge',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/audit/void-payment',
      name: 'voidPayment',
      component: () => import('../views/Reports/Audit/VoidPayment.vue'),
      meta: {
        title: 'Void Payment',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/audit/void-transaction',
      name: 'voidTransaction',
      component: () => import('../views/Reports/Audit/VoidTransaction.vue'),
      meta: {
        title: 'Void Transaction',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/house-status',
      name: 'HouseStatusReport',
      component: () => import('../views/Reports/BackOffice/HouseStatus.vue'),
      meta: {
        title: 'Folio List',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/travel-agent-commission-summary',
      name: 'TravelAgentCommissionSummary',
      component: () => import('../views/Reports/BackOffice/TravelAgent.vue'),
      meta: {
        title: 'Travel Agent Commission Summary',
        requiresAuth: true,
      },
    },
    // Statistical Reports
    {
      path: '/reports/statistical/occupancy-reports',
      name: 'OccupancyReports',
      component: () => import('../views/Reports/Statistical/OccupancyReports.vue'),
      meta: {
        title: 'Occupancy Reports',
        requiresAuth: true,
      },
    },
    // Custom Reports
    {
      path: '/reports/custom/monthly-occupancy',
      name: 'OccupancyMonth',
      component: () => import('../views/Reports/Custom/OccupancyMonthly.vue'),
      meta: {
        title: 'Occupancy Month',
        requiresAuth: true,
      },
    },
    // Custom Reports
    {
      path: '/reports/custom/monthly-revenue',
      name: 'MonthlyRevenu',
      component: () => import('../views/Reports/Custom/MonthlyRevenu.vue'),
      meta: {
        title: 'MonthRevenu',
        requiresAuth: true,
      },
    },
    {
      path: '/pdf-viewer',
      name: 'PDFViewer',
      component: () => import('@/views/PDFViewer.vue'),
      meta: {
        title: 'PDF Viewer',
        requiresAuth: true
      }
    },
    // Additional Front Office Reports
    {
      path: '/reports/front-office/guest-list',
      name: 'GuestList',
      component: () => import('../views/Reports/FrontOffice/GuestList.vue'),
      meta: {
        title: 'Guest List',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/guest-message',
      name: 'GuestMessage',
      component: () => import('../views/Reports/FrontOffice/GuestMessage.vue'),
      meta: {
        title: 'Guest Message',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/inclusion-report',
      name: 'InclusionReport',
      component: () => import('../views/Reports/FrontOffice/InclusionReport.vue'),
      meta: {
        title: 'Inclusion Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/inventory-by-room-type',
      name: 'InventoryByRoomType',
      component: () => import('../views/Reports/FrontOffice/InventoryByRoomType.vue'),
      meta: {
        title: 'Inventory By Room Type',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/invoice-breakdown',
      name: 'InvoiceBreakdown',
      component: () => import('../views/Reports/FrontOffice/InvoiceBreakdown.vue'),
      meta: {
        title: 'Invoice Breakdown',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/room-service-report',
      name: 'RoomServiceReport',
      component: () => import('../views/Reports/FrontOffice/RoomServiceReport.vue'),
      meta: {
        title: 'Room Service Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/pickup-dropoff',
      name: 'PickupDropoff',
      component: () => import('../views/Reports/FrontOffice/PickupDropoff.vue'),
      meta: {
        title: 'Pickup Dropoff',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/room-status-report',
      name: 'RoomStatusReport',
      component: () => import('../views/Reports/FrontOffice/RoomStatusReport.vue'),
      meta: {
        title: 'Room Status Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/front-office/task-list-report',
      name: 'TaskListReport',
      component: () => import('../views/Reports/FrontOffice/TaskListReport.vue'),
      meta: {
        title: 'Task List Report',
        requiresAuth: true,
      },
    },
    // Additional Back Office Reports
    {
      path: '/reports/back-office/expense-reports',
      name: 'ExpenseReports',
      component: () => import('../views/Reports/BackOffice/ExpenseReports.vue'),
      meta: {
        title: 'Expense Reports',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/accounts-receivable',
      name: 'AccountsReceivable',
      component: () => import('../views/Reports/BackOffice/AccountsReceivable.vue'),
      meta: {
        title: 'Accounts Receivable',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/accounts-payable',
      name: 'AccountsPayable',
      component: () => import('../views/Reports/BackOffice/AccountsPayable.vue'),
      meta: {
        title: 'Accounts Payable',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/cashier-reports',
      name: 'CashierReports',
      component: () => import('../views/Reports/BackOffice/CashierReport.vue'),
      meta: {
        title: 'Cashier Reports',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/financial-summary',
      name: 'FinancialSummary',
      component: () => import('../views/Reports/BackOffice/FinancialSummary.vue'),
      meta: {
        title: 'Financial Summary',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/back-office/payment-report',
      name: 'PaymentReport',
      component: () => import('../views/Reports/BackOffice/PaymentReport.vue'),
      meta: {
        title: 'Payment Report',
        requiresAuth: true,
      },
    },
    // Audit Reports
    {
      path: '/reports/audit/user-activity-log',
      name: 'UserActivityLog',
      component: () => import('../views/Reports/Audit/UserActivityLog.vue'),
      meta: {
        title: 'User Activity Log',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/audit/modification-log',
      name: 'ModificationLog',
      component: () => import('../views/Reports/Audit/ModificationLog.vue'),
      meta: {
        title: 'Modification Log',
        requiresAuth: true,
      },
    },
    // Additional Statistical Reports
    {
      path: '/reports/statistical/adr-report',
      name: 'ADRReport',
      component: () => import('../views/Reports/Statistical/ADRReport.vue'),
      meta: {
        title: 'ADR Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/statistical/revpar-report',
      name: 'RevPARReport',
      component: () => import('../views/Reports/Statistical/RevPARReport.vue'),
      meta: {
        title: 'RevPAR Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/statistical/market-segment-analysis',
      name: 'MarketSegmentAnalysis',
      component: () => import('../views/Reports/Statistical/MarketSegmentAnalysis.vue'),
      meta: {
        title: 'Market Segment Analysis',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/statistical/source-of-business-report',
      name: 'SourceOfBusinessReport',
      component: () => import('../views/Reports/Statistical/SourceOfBusinessReport.vue'),
      meta: {
        title: 'Source of Business Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/statistical/business-analysis',
      name: 'BusinessAnalysis',
      component: () => import('../views/Reports/Statistical/BusinessAnalysis.vue'),
      meta: {
        title: 'Source of Business Report',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/statistical/room-sale-statistics',
      name: 'RoomSaleStatistics',
      component: () => import('../views/Reports/Statistical/RoomSaleStatistics.vue'),
      meta: {
        title: 'Room Sale Statistics',
        requiresAuth: true,
      },
    },
    {
      path: '/reports/statistical/monthly-statistics',
      name: 'MonthlyStatistics',
      component: () => import('../views/Reports/Statistical/MonthlyStatistics.vue'),
      meta: {
        title: 'Monthly Statistics',
        requiresAuth: true,
      },
    },
    // Configuration Routes
    {
      path: '/configuration',
      name: 'Configuration',
      component: () => import('../views/Configuration/ConfigurationIndex.vue'),
      meta: {
        title: 'Configuration',
        requiresAuth: true,
      },
    },
    // Rooms Configuration
    {
      path: '/configuration/rooms/amenities',
      name: 'RoomAmenities',
      component: () => import('../views/Configuration/Rooms/RoomAmenities.vue'),
      meta: {
        title: 'Room Amenities',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rooms/room-type',
      name: 'RoomType',
      component: () => import('../views/Configuration/Rooms/RoomType.vue'),
      meta: {
        title: 'Room Type',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rooms/set-room-types',
      name: 'SetRoomTypes',
      component: () => import('../views/Configuration/Rooms/SetRoomTypes.vue'),
      meta: {
        title: 'Set Room Types',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rooms/bed-type',
      name: 'BedType',
      component: () => import('../views/Configuration/Rooms/BedType.vue'),
      meta: {
        title: 'Bed Type',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rooms/room-floor',
      name: 'RoomFloor',
      component: () => import('../views/Configuration/Rooms/RoomFloor.vue'),
      meta: {
        title: 'Room Floor',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rooms/status-color',
      name: 'StatusColor',
      component: () => import('../views/Configuration/Rooms/StatusColor.vue'),
      meta: {
        title: 'Status Color',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rooms/room-owner',
      name: 'RoomOwner',
      component: () => import('../views/Configuration/Rooms/RoomOwner.vue'),
      meta: {
        title: 'Room Owner',
        requiresAuth: true,
      },
    },
    // Rates Configuration
    {
      path: '/configuration/rates/rate-type',
      name: 'RateType',
      component: () => import('../views/Configuration/Rates/RateType.vue'),
      meta: {
        title: 'Rate Type',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rates/season',
      name: 'Season',
      component: () => import('../views/Configuration/Rates/Season.vue'),
      meta: {
        title: 'Season',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rates/room-rates',
      name: 'RoomRates',
      component: () => import('../views/Configuration/Rates/RoomRates.vue'),
      meta: {
        title: 'Room Rates',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rates/meal-plan-builder',
      name: 'MealPlanBuilder',
      component: () => import('../views/Configuration/Rates/MealPlanBuilder.vue'),
      meta: {
        title: 'Meal Plan Builder',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rates/taxes',
      name: 'Taxes',
      component: () => import('../views/Configuration/Rates/Taxes.vue'),
      meta: {
        title: 'Taxes',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/rates/set-offers',
      name: 'SetOffers',
      component: () => import('../views/Configuration/Rates/SetOffers.vue'),
      meta: {
        title: 'Set Offers',
        requiresAuth: true,
      },
    },
    // Housekeeping Configuration
    {
      path: '/configuration/housekeeping/housekeepers',
      name: 'Housekeepers',
      component: () => import('../views/Configuration/Housekeeping/Housekeepers.vue'),
      meta: {
        title: 'Housekeepers',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/housekeeping/units',
      name: 'Units',
      component: () => import('../views/Configuration/Housekeeping/Units.vue'),
      meta: {
        title: 'Units',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/housekeeping/status',
      name: 'HousekeepingStatus',
      component: () => import('../views/Configuration/Housekeeping/Status.vue'),
      meta: {
        title: 'Housekeeping Status',
        requiresAuth: true,
      },
    },
    // Master Configuration
    {
      path: '/configuration/master/currency',
      name: 'Currency',
      component: () => import('../views/Configuration/Master/Currency.vue'),
      meta: {
        title: 'Currency',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/pay-method',
      name: 'PayMethod',
      component: () => import('../views/Configuration/Master/PayMethod.vue'),
      meta: {
        title: 'Pay Method',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/extra-charge',
      name: 'ExtraCharge',
      component: () => import('../views/Configuration/Master/ExtraCharge.vue'),
      meta: {
        title: 'Extra Charge',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/identity-type',
      name: 'IdentityType',
      component: () => import('../views/Configuration/Master/IdentityType.vue'),
      meta: {
        title: 'Identity Type',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/reason',
      name: 'Reason',
      component: () => import('../views/Configuration/Master/Reason.vue'),
      meta: {
        title: 'Reason',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/discounts',
      name: 'Discounts',
      component: () => import('../views/Configuration/Master/Discounts.vue'),
      meta: {
        title: 'Discounts',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/transportation-mode',
      name: 'TransportationMode',
      component: () => import('../views/Configuration/Master/TransportationMode.vue'),
      meta: {
        title: 'Transportation Mode',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/payouts',
      name: 'Payouts',
      component: () => import('../views/Configuration/Master/Payouts.vue'),
      meta: {
        title: 'Payouts',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/template-category',
      name: 'TemplateCategory',
      component: () => import('../views/Configuration/Master/TemplateCategory.vue'),
      meta: {
        title: 'Template Category',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/template',
      name: 'Template',
      component: () => import('../views/Configuration/Master/Template.vue'),
      meta: {
        title: 'Template',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/black-list-reason',
      name: 'BlackListReason',
      component: () => import('../views/Configuration/Master/BlackListReason.vue'),
      meta: {
        title: 'Black List Reason',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/market-code',
      name: 'MarketCode',
      component: () => import('../views/Configuration/Master/MarketCode.vue'),
      meta: {
        title: 'Market Code',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/reservation-type',
      name: 'ReservationType',
      component: () => import('../views/Configuration/Master/ReservationType.vue'),
      meta: {
        title: 'Reservation Type',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/preference-type',
      name: 'PreferenceType',
      component: () => import('../views/Configuration/Master/PreferenceType.vue'),
      meta: {
        title: 'Preference Type',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/preference',
      name: 'Preference',
      component: () => import('../views/Configuration/Master/Preference.vue'),
      meta: {
        title: 'Preference',
        requiresAuth: true,
      },
    },

    {
      path: '/configuration/master/business-source',
      name: 'BusinessSource',
      component: () => import('../views/Configuration/Master/BusinessSource.vue'),
      meta: {
        title: 'Business Source',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/master/vip-status',
      name: 'VipStatus',
      component: () => import('../views/Configuration/Master/VipStatus.vue'),
      meta: {
        title: 'VIP Status',
        requiresAuth: true,
      },
    },
    // Settings Configuration
    {
      path: '/configuration/settings/email-accounts',
      name: 'EmailAccounts',
      component: () => import('../views/Configuration/Settings/EmailAccounts.vue'),
      meta: {
        title: 'Email Accounts',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/hotel-information',
      name: 'HotelInformation',
      component: () => import('../views/Configuration/Settings/HotelInformation.vue'),
      meta: {
        title: 'Hotel Information',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/formula',
      name: 'Formula',
      component: () => import('../views/Configuration/Settings/Formula.vue'),
      meta: {
        title: 'Formula',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/notices',
      name: 'Notices',
      component: () => import('../views/Configuration/Settings/Notices.vue'),
      meta: {
        title: 'Notices',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/document-numbering',
      name: 'DocumentNumbering',
      component: () => import('../views/Configuration/Settings/DocumentNumbering.vue'),
      meta: {
        title: 'Document Numbering',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/print-and-email-settings',
      name: 'PrintAndEmailSettings',
      component: () => import('../views/Configuration/Settings/PrintAndEmailSettings.vue'),
      meta: {
        title: 'Print and Email Settings',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/check-in-and-reservation-settings',
      name: 'CheckInAndReservationSettings',
      component: () => import('../views/Configuration/Settings/CheckInAndReservationSettings.vue'),
      meta: {
        title: 'Check In and Reservation Settings',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/display-settings',
      name: 'DisplaySettings',
      component: () => import('../views/Configuration/Settings/DisplaySettings.vue'),
      meta: {
        title: 'Display Settings',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/registration-settings',
      name: 'RegistrationSettings',
      component: () => import('../views/Configuration/Settings/RegistrationSettings.vue'),
      meta: {
        title: 'Registration Settings',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/settings/tac-configuration',
      name: 'TacConfiguration',
      component: () => import('../views/Configuration/Settings/TacConfiguration.vue'),
      meta: {
        title: 'Tax/Account Configuration',
        requiresAuth: true,
      },
    },
    //configuration staff
    {
      path: '/configuration/staff/department',
      name: 'department',
      component: () => import('../views/Configuration/Staff/DepartmentView.vue'),
      meta: {
        title: 'Department',
        requiresAuth: true,
      },
    },
      {
      path: '/configuration/staff/staff_management',
      name: 'Staff Management',
      component: () => import('../views/Configuration/Staff/EStaffStaffManager.vue'),
      meta: {
        title: 'Staff Management',
        requiresAuth: true,
      },
    },
      {
      path: '/users/new',
      name: 'newUser',
      component: () => import('../views/Configuration/Staff/UserUpsertForm.vue'),
      meta: {
        title: 'new User',
        requiresAuth: true,
      },
    },
      {
      path: '/users/new/:id',
      name: 'editUser',
      component: () => import('../views/Configuration/Staff/UserUpsertForm.vue'),
      meta: {
        title: 'new User',
        requiresAuth: true,
      },
      props : true
    },
     {
      path: '/configuration/staff/user_role',
      name: 'User Role',
      component: () => import('../views/Configuration/Staff/UserRoleView.vue'),
      meta: {
        title: 'User Role',
        requiresAuth: true,
      },
    },
    // Channel Manager Configuration Routes
    {
      path: '/configuration/channel-manager',
      name: 'ChannelManager',
       component: () => import('../views/Configuration/ChannelManager/Overview.vue'),
      meta: {
        title: 'Channel Manager',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/channel-manager/inventory-channel-booking',
      name: 'ChannelManagerInventoryChannelBooking',
      component: () => import('../views/Configuration/ChannelManager/InventoryChannelBooking.vue'),
      meta: {
        title: 'Inventory Channel Booking',
        requiresAuth: true,
      },
    },{
      path: '/configuration/channel-manager/channel-manager',
      name: 'channel',
      component: () => import('../views/Configuration/ChannelManager/ChannelManager.vue'),
      meta: {
        title: 'Channel Manager',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/channel-manager/channels-booking',
      name: 'ChannelManagerChannelsBooking',
      component: () => import('../views/Configuration/ChannelManager/ChannelsBooking.vue'),
      meta: {
        title: 'Channels Booking',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/channel-manager/rooms-rates',
      name: 'ChannelManagerRoomsRates',
      component: () => import('../views/Configuration/ChannelManager/RoomsRates.vue'),
      meta: {
        title: 'Rooms & Rates',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/channel-manager/properties',
      name: 'ChannelManagerProperties',
      component: () => import('../views/Configuration/ChannelManager/Properties.vue'),
      meta: {
        title: 'Properties',
        requiresAuth: true,
      },
    },
    {
      path: '/configuration/channel-manager/iframe',
      name: 'ChannelManagerIframe',
      component: () => import('../views/Configuration/ChannelManager/IframeView.vue'),
      meta: {
        title: 'Channel Manager Iframe',
        requiresAuth: true,
      },
    },
    {
      path: '/departments/:id',
      name: 'departmentDetails',
      component: () => import('../views/departments/DepartmentDetails.vue'),
      meta: {
        title: 'Department Details',
        requiresAuth: true,
      },
    },
    {
      path: '/allInvoice',
      name: 'allInvoice',
      component: () => import('../views/Payment/InvoiceList.vue'),
      meta: {
        title: 'All Invoice',
        requiresAuth: true,
      },
    },
    {
      path: '/invoice',
      name: 'invoice',
      component: () => import('../views/Payment/InvoiceDetail.vue'),
      meta: {
        title: 'Invoice',
        requiresAuth: true,
      },
    },
    {
      path: '/booking/:id/invoice',
      name: 'BookingInvoice',
      component: () => import('../components/invoice/HotelInvoice.vue'),
      meta: {
        title: 'Booking Invoice',
        requiresAuth: true,
      },
    },
    {
      path: '/booking/bookinginvoice',
      name: 'BookingInvoices',
      component: () => import('../components/common/templates/BookingInvoice.vue'),
      meta: {
        title: 'Booking Invoices',
        requiresAuth: true,
      },
    },
    {
      path: '/booking/invoice',
      name: 'Invoice',
      component: () => import('../components/invoice/Invoicehotel.vue'),
      meta: {
        title: 'Invoice',
        requiresAuth: true,
      },
    },
    {
      path: '/invoice/:id',
      name: 'ViewInvoice',
      component: () => import('../views/Payment/InvoiceDetail.vue'),
      meta: {
        title: 'View Invoice',
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/customers',
      name: 'Customers',
      component: () => import('../views/Customers/CustomersTable.vue'),
      meta: {
        title: 'Customers',
        requiresAuth: true,
      },
    },
    {
      path: '/setting',
      name: 'Setting',
      component: () => import('../views/Setting/Setting.vue'),
      meta: {
        title: 'Setting',
        requiresAuth: true,
      },
    },

    {
      path: '/service',
      name: 'Service',
      component: () => import('../views/Services/ServiceView.vue'),
      meta: {
        title: 'Service',
        requiresAuth: true,
      },
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../components/calendars/ReservationCalendarInterface.vue'),
      meta: {
        title: 'Reservation Calendar',
        requiresAuth: true,
      },
    },
   
     {
      path: '/stay_view',
      name: 'ReservationCalendar',
      component: () => import('../views/Bookings/BookinCalender.vue'),
      meta: {
        title: 'Reservation Calendar',
        requiresAuth: true,
      },
    },
    {
      path: '/audit-trail',
      name: 'AuditTrail',
      component: () => import('../views/Others/AuditTrailDetails.vue'),
      meta: {
        title: 'Audit Trail',
        requiresAuth: true,
      },
    },
    {
      path: '/audit-trail/:entityType/:entityId',
      name: 'AuditTrailEntity',
      component: () => import('../views/Others/AuditTrailDetails.vue'),
      props: true,
      meta: {
        title: 'Audit Trail Details',
        requiresAuth: true,
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
        requiresAuth: true,
      },
    },
        {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
        requiresAuth: true,
      },
    },

    {
      path: '/',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    //restaurants

    {
      path: '/guest_database',
      name: 'Customer',
      component: () => import('../views/Customers/CustomersTable.vue'),
      meta: {
        title: 'Customer',
        requiresAuth: true,
      },
    },

    {
      path: '/amenities',
      name: 'amenities',
      component: () => import('../views/Setting/AmenitiesPay.vue'),
      meta: {
        title: 'Amenities',
        requiresAuth: true,
      },
    },
    {
      path: '/amenities/:id/view',
      name: 'amenitiesView',
      component: () => import('../views/hotelServices/HotelServiceDetails.vue'),
      meta: {
        title: 'Amenities',
        requiresAuth: true,
      },
    },
   {
      path: '/amenities_booking_view/:id',
      name: 'Amenities Booking Interface',
      component: () => import('../views/hotelServices/AmenitiesBookingInterface.vue'),
      meta: {
        title: 'Amenities',
        requiresAuth: true,
      },
    },


    /// Staff Management

    {
      path: '/staff_management/dashboard',
      name: 'Dashboard Overview',
      component: () => import('../views/StaffManagement/EStaffDashboardView.vue'),
      meta: {
        title: 'Dashboard Overview',
        requiresAuth: true,
      },
    },
    {
      path: '/staff_management/task_management',
      name: 'Task Management',
      component: () => import('../views/StaffManagement/EStaffTaskManager.vue'),
      meta: {
        title: 'Task Management',
        requiresAuth: true,
      },
    },
    {
      path: '/staff_management/staff_schedule',
      name: 'Staff Schedule',
      component: () => import('../views/StaffManagement/EStaffScheduleView.vue'),
      meta: {
        title: 'Staff Schedule',
        requiresAuth: true,
      },
    },

    {
      path: '/staff_management/action_history',
      name: 'Action History',
      component: () => import('../views/StaffManagement/EStaffActionHistory.vue'),
      meta: {
        title: 'Action History',
        requiresAuth: true,
      },
    },
    {
      path: '/users/:id/view',
      name: 'usersDetails',
      component: () => import('../views/StaffManagement/EStaffDetails.vue'),
      meta: {
        title: 'Users Details',
        requiresAuth: true,
      },
    },

    {
      path: '/custom-guest-table',
      name: 'Custom Guest Table',
      component: () => import('../views/Tables/CustomGuestTable.vue'),
      meta: {
        title: 'Custom Guest Table',
        requiresAuth: true,
      },
    },
    {
        path: '/new',
        name: 'CustomerCreate',
        component: () => import('@/views/Customers/CustomerEditPage.vue'),
      },

      {
        path: '/edit/:id',
        name: 'CustomerEdit',
        component: () => import('@/views/Customers/CustomerEditPage.vue'),
        props: true
      },
    {
      path: '/reusable-table-example',
      name: 'Reusable Table Example',
      component: () => import('../views/Tables/ReusableTableExample.vue'),
      meta: {
        title: 'Reusable Table Example',
        requiresAuth: true,
      },
    },
    {
      path: '/front-office/reservation/:id',
      name: 'ReservationDetails',
      component: () => import('../views/FrontOffice/reservation/ReservationDetails.vue'),
      props: true,
      meta: {
        title: 'Reservation Details',
        requiresAuth: true,
      },
    },
    // Cashiering routes
    {
      path: '/cashiering/center',
      name: 'CashieringCenter',
      component: () => import('../views/Cashiering/CashieringCenter.vue'),
      meta: {
        title: 'Cashiering Center',
        requiresAuth: true,
      },
    },
    {
      path: '/cashiering/new-payment',
      name: 'NewPaymentCityLedger',
      component: () => import('../views/Cashiering/NewPaymentCityLedger.vue'),
      meta: {
        title: 'New Payment',
        requiresAuth: true,
      },
    },
    {
      path: '/cashiering/company_database',
      name: 'CompanyDatabase',
      component: () => import('../views/Cashiering/CompanyDatabase.vue'),
      meta: {
        title: 'Company Database',
        requiresAuth: true,
      },
    },
    {
      path: '/Cashiering/new_company',
      name: 'AddCompany',
      component: () => import('../views/Cashiering/AddCompany.vue'),
      meta: {
        title: 'Add Company',
        requiresAuth: true,
      },
    },
    {
      path: '/Cashiering/edit_company/:id',
      name: 'EditCompany',
      component: () => import('../views/Cashiering/AddCompany.vue'),
      meta: {
        title: 'Edit Company',
        requiresAuth: true,
      },
    },
    {
      path: '/Cashiering/company_details/:id',
      name: 'CompanyDetails',
      component: () => import('../views/Cashiering/CompanyDetails.vue'),
      meta: {
        title: 'Company Details',
        requiresAuth: true,
      },
    },
    {
      path: '/cashiering/exchange-rate',
      name: 'ExchangeRate',
      component: () => import('../views/Cashiering/ExchangeRatePage.vue'),
      meta: {
        title: 'Exchange Rate',
        requiresAuth: true,
      },
    },
    {
      path: '/cashiering/pos',
      name: 'PosInterface',
      component: () => import('../views/Cashiering/PosInterface.vue'),
      meta: {
        title: 'POS - Incidental Invoice',
        requiresAuth: true,
      },
    },
    // Catch-all route for 404 pages - must be last
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 - Page Not Found',
      },
    },
    //Housekeeping routes
    {
      path: '/house_status',
      name: 'HouseStatus',
      component: () => import('../views/Housekeeping/HouseStatus/HouseStatusView.vue'),
      props: true,
      meta: {
        title: 'House Status',
        requiresAuth: true,
      },
    },
    {
      path: '/work_order',
      name: 'WorkOrder',
      component: () => import('../views/Housekeeping/WorkOrder/WorkOrderView.vue'),
      props: true,
      meta: {
        title: 'Work Order',
        requiresAuth: true,
      },
    },
    {
      path: '/maintenance_block',
      name: 'MaintenanceBlock',
      component: () => import('../views/Housekeeping/MaintenanceBlock/MaintenanceBlockView.vue'),
      props: true,
      meta: {
        title: 'Maintenance Block',
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  isLoading.value = true

  const authStore = useAuthStore()

  try {
    const { token, user, UserId, roleId } = authStore


    // Utiliser la getter isFullyAuthenticated
    const isAuthenticated = authStore.isFullyAuthenticated

    // Si la route nécessite une auth
    if (to.meta.requiresAuth && !isAuthenticated) {
      console.log(' Redirection - auth manquante')
      return next('/')
    }

    // Redirection dashboard seulement si COMPLÈTEMENT authentifié
    if (to.path === '/' && isAuthenticated) {
      console.log(' Redirection vers dashboard - utilisateur complètement connecté')
      return next('/front-office/dashboard')
    }
    if (to.path === '/reports' || to.path === '/reports/') {
      return next('/reports/dashboard')
    }

    if (to.path === '/') {
      console.log(' Accès à la page de login autorisé')
    }

    return next()
  } catch (error) {
    console.error('Error in navigation guard:', error)
    return next('/')
  } finally {
    isLoading.value = false
  }
})

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 3000)
})

export default router
