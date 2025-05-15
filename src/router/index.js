import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // SP
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/SP/Login/Login.vue"),
  },
  {
    path: '/',
    redirect: '/Homepage'
  },
  {
    path: "/Homepage",
    name: "Homepage",
    component: () => import("../views/SP/Home/Homepage.vue"),
    meta: { title: "Home" }
  },
  {
    path: "/Barge",
    name: "Barge",
    component: () => import("../views/SP/Overview/BargeOverview.vue"),
    meta: { title: "Barge Overview" }
  },
  {
    path: "/Barge/:typeDeviceName",
    name: "BargeDetail",
    component: () => import("../views/SP/BargeDetails.vue"),
    props: true,
    meta: { title: "Barge Detail" }
  },
  {
    path: "/Generator/:deviceId",
    name: 'GeneratorDetails',
    component: () => import("../views/SP/GeneratorDetails.vue"),
    props: true,
    meta: { title: "Generator Detail" }
  },
  {
    path: "/StatusUpdateForm/:typeDeviceName",
    name: "StatusUpdateForm",
    component: () => import("../views/SP/StatusUpdateForm.vue"),
    props: true,
    meta: { title: "Status Update Form" }
  },
  {
    path: "/Tugboat",
    name: "Tugboat",
    component: () => import("../views/SP/Overview/TugboatOverview.vue"),
    meta: { title: "Tugboat Overview" }
  },
  {
    path: "/Tugboat/:deviceId",
    name: "TugboatDetail",
    component: () => import("../views/SP/TugboatDetails.vue"),
    props: true,
    meta: { title: "Tugboat Detail" }
  },
  {
    path: "/GPS/:deviceId",
    name: "GPSVessel",
    component: () => import("../views/SP/GPSVessel.vue"),
    props: true,
    meta: { title: "GPS" }
  },
  {
    path: "/RouteTracking",
    name: "RouteTracking",
    component: () => import("../views/SP/RouteTracking.vue"),
    meta: { title: "Route Tracker" }
  },
  {
    path: "/NotificationReport",
    name: "NotificationReport",
    component: () => import("../views/SP/Report/NotificationReport.vue"),
    meta: { title: "Notification Report" }
  },
  {
    path: "/HistoricalChart",
    name: "HistoricalChart",
    component: () => import("../views/SP/Report/ChartHistorical.vue"),
    meta: { title: "Historical Chart Report" }
  },
  {
    path: "/Tugboat/WindSpeedImpactReport",
    name: "WindSpeedImpactReport",
    component: () => import("../views/SP/Report/Report03.vue"),
    meta: { title: "Historical Chart Report" }
  },
  {
    path: "/Tugboat/EncounteringStormsReport",
    name: "EncounteringStormsReport",
    component: () => import("../views/SP/Report/Report04.vue"),
    meta: { title: "Report" }
  },
  {
    path: "/Barge/FuelRatePerRPMReport",
    name: "FuelRatePerRPMReport",
    component: () => import("../views/SP/Report/Report05.vue"),
    meta: { title: "Report" }
  },
  {
    path: "/Tugboat/ThrottleRPMFuelRateReport",
    name: "ThrottleRPMFuelRateReport",
    component: () => import("../views/SP/Report/Report06.vue"),
    meta: { title: "Report" }
  },
  {
    path: "/Barge/DailyFuelConsumtionReport",
    name: "DailyFuelConsumtionReport",
    component: () => import("../views/SP/Report/Report07.vue"),
    meta: { title: "Report" }
  },
  {
    path: "/Barge/BargeTiltReport",
    name: "BargeTiltReport",
    component: () => import("../views/SP/Report/Report08.vue"),
    meta: { title: "Report" }
  },
  {
    path: "/DeviceManagement",
    name: "DeviceManagementList",
    component: () => import("../views/SP/Setting/DeviceManagementList.vue"),
    meta: { title: "Device Management" }
  },
  {
    path: "/DeviceManagement/:deviceId",
    name: "DeviceManagementForm",
    component: () => import("../views/SP/Setting/DeviceManagementForm.vue"),
    props: true,
    meta: { title: "Device Management" }
  },
  {
    path: "/MemberManagement",
    name: "MemberManagementList",
    component: () => import("../views/SP/Setting/MemberManagementList.vue"),
    meta: { title: "Member Management" }
  },
  {
    path: "/MemberManagement/:memberId",
    name: "MemberManagementForm",
    component: () => import("../views/SP/Setting/MemberManagementForm.vue"),
    props: true,
    meta: { title: "Member Management" }
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "Page Not Found" }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/login');   
  }
  else if (isAuthenticated && to.path === '/login') {
    next('/Homepage');
  }
  else {
    next();
  }
});

// setting Title Page
const DEFAULT_TITLE = process.env.VUE_APP_DEFAULT_TITLE || "MIIOT Platform"
router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE
})

export default router;