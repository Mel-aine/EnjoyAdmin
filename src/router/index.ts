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
      meta: { requiresAuth: true }
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
      },
    },
    {
      path: '/add_booking/:id',
      name: 'EditBooking',
      component: () => import('../views/Bookings/AddBooking.vue'),
      props: true
    },
    {
      path: '/all_room',
      name: 'All Room',
      component: () => import('../views/Room/AllRoom.vue'),
      meta: {
        title: 'All Room',
      },
    },
    {
      path: '/type_room',
      name: 'Room Type',
      component: () => import('../views/Room/RoomTypes.vue'),
      meta: {
        title: 'Room Type',
      },
    },
    {
      path: '/occupancy',
      name: 'Occupancy',
      component: () => import('../views/Room/OccupancyView.vue'),
    },

    {
      path: '/stock/product',
      name: 'stock product',
      component: () => import('../views/Reports/Stocks/ProductList.vue'),
    },
    {
      path: '/stock/movements',
      name: 'stock movement',
      component: () => import('../views/Reports/Stocks/StockMovement.vue'),
    },
    {
      path: '/stock/categorie',
      name: 'stock categorie',
      component: () => import('../views/Reports/Stocks/StockCategorie.vue'),
    },
    {
      path: '/stock/suppliers',
      name: 'supplier',
      component: () => import('../views/Reports/Stocks/SupplierList.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/Users/UsersTable.vue'),
    },
    {
      path: '/expense',
      name: 'expense',
      component: () => import('../views/Reports/ExpensesTable.vue'),
    },
    {
      path: '/department',
      name: 'department',
      component: () => import('../views/DepartmentView.vue'),
    },
    {
      path: '/allInvoice',
      name: 'allInvoice',
      component: () => import('../views/Payment/InvoiceList.vue'),
    },
    {
      path: '/invoice',
      name: 'invoice',
      component: () => import('../views/Payment/InvoiceDetail.vue'),
    },
    {
      path: '/invoice/:id',
      name: 'ViewInvoice',
      component: () => import('../views/Payment/InvoiceDetail.vue'),
      props: true
    },
    {
      path: '/customers',
      name: 'Customers',
      component: () => import('../views/Customers/CustomersTable.vue'),
    },
    {
      path: '/setting',
      name: 'Setting',
      component: () => import('../views/Setting/Setting.vue'),
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },

    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
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
      path: '/dashboard',
      name: 'dashboard restau',
      component: () => import('../views/Restaurants/Rdashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/customer',
      name: 'Customer',
      component: () => import('../views/Customers/CustomerTable.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/Restaurants/OrderView.vue'),
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../views/Restaurants/Menus/MenuView.vue'),
    },
    {
      path: '/products',
      name: 'product',
      component: () => import('../views/Restaurants/ProductView/ProductView.vue')
    },
    {
      path: '/products/:productcode/:action',
      name: 'productaction',
      component: () => import('../views/Restaurants/ProductView/ProductDetails.vue'),
      meta: {
        title: 'Users',
      }
    },
    {
      path: '/Stocks',
      name: 'EntreeStocks',
      component: () => import('../views/Restaurants/Stocks/StocksEntree.vue')
    },
    {
      path: '/plates',
      name: 'plates',
      component: () => import('../views/Restaurants/PlateView/PlateView.vue')
    },
    {
      path: '/plates/:platecode/:action',
      name: 'platetaction',
      component: () => import('../views/Restaurants/PlateView/PlateDetail.vue'),
      meta: {
        title: 'Users',
      }
    },
    {
      path: '/menus/:menucode/:action',
      name: 'menuaction',
      component: () => import('../views/Restaurants/Menus/MenuDetails.vue'),
      meta: {
        title: 'Users',
      }
    },
    {
      path: '/tickets/:ticketcode/:action',
      name: 'ticket',
      component: () => import('../views/Restaurants/TicketView/TicketDetail.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/Users/UserTableResto.vue'),
    },

    //travel
    {
      path: '/dashboardTravel',
      name: 'dashboard travel',
      component: () => import('../views/Travel/DashboardTravel.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/all_routes',
      name:'all routes',
      component : ()=>import ('../views/Travel/ItineraryView.vue')
    },
    {
      path: '/vehicle_fleet',
      name:'vehicle fleet',
      component : ()=>import ('../views/Travel/Equipement/VehicleView.vue')
    },
    {
      path: '/scheduled_trips',
      name:'scheduled trips',
      component : ()=>import ('../views/Travel/TravelManagement.vue/TravelList.vue')
    },
    {
      path: '/schedules',
      name:'schedules',
      component : ()=>import ('../views/Travel/Planning/ScheduleView.vue')
    },
    {
      path: '/driver',
      name:'driver',
      component : ()=>import ('../views/Travel/DriverView.vue')
    },
    {
      path: '/vehicle_assignment',
      name:'vehicle assigment',
      component : ()=>import ('../views/Travel/Planning/VehicleAssignement.vue')
    }
  ],
})
router.beforeEach(async (to, from, next) => {
  isLoading.value = true;

  const authStore = useAuthStore();
  // const serviceStore = useServiceStore();

  try {
    // Si on a un token mais pas encore de données utilisateur, on les récupère
    if (authStore.token && !authStore.user) {
      // await authStore.fetchUser(); // Implémente cette méthode dans ton store
    }

    // Si la route nécessite une auth mais qu’on n’est pas connecté
    if (to.meta.requiresAuth && !authStore.token) {
      return next('/');
    }

    // if (to.path === '/signin' && authStore.token) {
    //   const category = serviceStore.serviceCategory?.toLowerCase();

    //   switch (category) {
    //     case 'hotel':
    //       return next('/');
    //     case 'restaurant':
    //       return next('/dashboard');
    //     default:
    //       return next('/');
    //   }
    // }
    return next();
  } catch (error) {
    console.error('Error in navigation guard:', error);
    return next('/');
  }
});


router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});


export default router

// router.beforeEach((to, from, next) => {
//   // document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
//   document.title = "Enjoy"
//   next()
// })


