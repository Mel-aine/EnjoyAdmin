import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/composables/user'
import { isLoading } from '@/composables/spinner'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
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
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },

    {
      path: '/signin',
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
  ],
})
router.beforeEach(async (to, from, next) => {
  isLoading.value = true;
  const authStore = useAuthStore();

  // Si on a un token mais pas d'utilisateur, on essaie de récupérer l'utilisateur
  if (authStore.token && !authStore.user) {
    console.log("We have a token but no user. You should fetch the user data here.");
  }

  // Si la route nécessite une authentification et qu'on a pas de token
  if (to.meta.requiresAuth && !authStore.token) {
    return next('/signin');
  }

  // Si on va vers /signin et qu'on est déjà connecté
  if (to.path === '/signin' && authStore.token) {
    return next('/');
  }

  next();
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


