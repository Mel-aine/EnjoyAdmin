import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/composables/user'
import { isLoading } from '@/composables/spinner'
import { useServiceStore } from '@/composables/serviceStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Edashboard.vue'),
      meta: { requiresAuth: true },
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
      path: '/reservation_details/:id',
      name: 'reservationDetails',
      component: () => import('../views/Bookings/ReservationDetails.vue'),
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
      path: '/occupancy',
      name: 'Occupancy',
      component: () => import('../views/Room/OccupancyView.vue'),
      meta: {
        title: 'Occupancy',
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
    {
      path: '/department',
      name: 'department',
      component: () => import('../views/DepartmentView.vue'),
      meta: {
        title: 'Department',
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
      path: '/permission',
      name: 'Permission',
      component: () => import('../views/Users/Permission.vue'),
      meta: {
        title: 'Permission',
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
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
        requiresAuth: true,
      },
    },
     {
      path: '/reservation_calendar',
      name: 'ReservationCalendar',
      component: () => import('../views/Bookings/BookinCalender.vue'),
      meta: {
        title: 'Reservation Calendar',
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
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
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
      path: '/customer',
      name: 'Customer',
      component: () => import('../views/Customers/CustomerTable.vue'),
      meta: {
        title: 'Customer',
        requiresAuth: true,
      },
    },

    //travel
    {
      path: '/dashboardTravel',
      name: 'dashboard travel',
      component: () => import('../views/Travel/DashboardTravel.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/all_routes',
      name: 'all routes',
      component: () => import('../views/Travel/ItineraryView.vue'),
    },
    {
      path: '/vehicle_fleet',
      name: 'vehicle fleet',
      component: () => import('../views/Travel/Equipement/VehicleView.vue'),
    },
    {
      path: '/scheduled_trips',
      name: 'scheduled trips',
      component: () => import('../views/Travel/TravelManagement.vue/TravelList.vue'),
    },
    {
      path: '/schedules',
      name: 'schedules',
      component: () => import('../views/Travel/Planning/ScheduleView.vue'),
      meta: {
        title: 'Schedules',
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
    {
      path: '/driver',
      name: 'driver',
      component: () => import('../views/Travel/DriverView.vue'),
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
      path: '/staff_management/staff_management',
      name: 'Staff Management',
      component: () => import('../views/StaffManagement/EStaffStaffManager.vue'),
      meta: {
        title: 'Staff Management',
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
      path: '/vehicle_assignment',
      name: 'vehicle assigment',
      component: () => import('../views/Travel/Planning/VehicleAssignement.vue'),
      meta: {
        title: 'Vehicle assigment',
        requiresAuth: true,
      },
    },
  ],
})
// router.beforeEach(async (to, from, next) => {
//   isLoading.value = true

//   const authStore = useAuthStore()
//   // const serviceStore = useServiceStore();

//   try {
//     console.log('user', authStore.user)
//     console.log('token', authStore.token)
//     console.log('UserId', authStore.UserId)
//     // Si la route nécessite une auth mais qu’on n’est pas connecté
//     if (to.meta.requiresAuth && (!authStore.token || !authStore.user)) {
//       return next('/')
//     }
//     if (to.path === '/' && authStore.token && authStore.user && authStore.UserId) {
//       next('/dashboard')
//     }

//     return next()
//   } catch (error) {
//     console.error('Error in navigation guard:', error)
//     return next('/')
//   }
// })
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
      return next('/dashboard')
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
