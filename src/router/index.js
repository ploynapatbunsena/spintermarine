import { createRouter, createWebHistory } from 'vue-router'

const NotificationReport = () => import('@/views/SP/Report/NotificationReport.vue');
const ChartHistorical = () => import('@/views/SP/Report/ChartHistorical.vue');
const Report03 = () => import('@/views/SP/Report/Report03.vue');
const Report04 = () => import('@/views/SP/Report/Report04.vue');
const Report05 = () => import('@/views/SP/Report/Report05.vue');
const Report06 = () => import('@/views/SP/Report/Report06.vue');
const Report07 = () => import('@/views/SP/Report/Report07.vue');
const Report08 = () => import('@/views/SP/Report/Report08.vue');

const routes = [
  { path: '/report/report01', name: 'NotificationReport', component: NotificationReport },
  { path: '/report/report02', name: 'ChartHistorical', component: ChartHistorical },
  { path: '/report/report03', name: 'Report03', component: Report03 },
  { path: '/report/report04', name: 'Report04', component: Report04 },
  { path: '/report/report05', name: 'Report05', component: Report05 },
  { path: '/report/report06', name: 'Report06', component: Report06 },
  { path: '/report/report07', name: 'Report07', component: Report07 },
  { path: '/report/report08', name: 'Report08', component: Report08 },
  
  // SP
  {
    path: "/",
    name: "Login",
    component: () => import("../views/SP/Login/Login.vue"),
  },
  {
    path: "/Homepage",
    name: "Homepage",
    component: () => import("../views/SP/Home/Homepage.vue"),
  },
  {
    path: "/Barge",
    name: "Barge",
    component: () => import("../views/SP/Overview/BargeOverview.vue"),
  },
  {
    path: "/Tugboat",
    name: "Tugboat",
    component: () => import("../views/SP/Overview/TugboatOverview.vue"),
  },
  {
    path: "/Barge/:id",
    name: "BargeDetail",
    component: () => import("../views/SP/BargeDetails.vue"),
    props: true,
  },
  {
    path: "/Barge/:id/:itemId",
    name: 'GeneratorDetails',
    component: () => import("../views/SP/GeneratorDetails.vue"),
    props: true
  },
  {
    path: "/Barge/:id/EditForm",
    name: "StatusEditForm",
    component: () => import("../views/SP/StatusEditForm.vue"),
    props: true
  },
  {
    path: "/Tugboat/:id",
    name: "TugboatDetail",
    component: () => import("../views/SP/TugboatDetails.vue"),
    props: true,
  },
  {
    path: "/Tugboat/:id/GPS",
    name: "GPSVessel",
    component: () => import("../views/SP/GPSVessel.vue"),
    props: true,
  },
  {
    path: "/GPS_Tracker",
    name: "GPS_Tracker",
    component: () => import("../views/SP/GPSTracker.vue"),
  },
  {
    path: "/NotificationReport",
    name: "NotificationReport",
    component: () => import("../views/SP/Report/NotificationReport.vue"),
  },
  {
    path: "/ChartHistoricalReport",
    name: "ChartHistorical",
    component: () => import("../views/SP/Report/ChartHistorical.vue"),
  },
  {
    path: "/Tugboat/WindSpeedImpactReport",
    name: "WindSpeedImpactReport",
    component: () => import("../views/SP/Report/Report03.vue"),
  },
  {
    path: "/Tugboat/EncounteringStormsReport",
    name: "EncounteringStormsReport",
    component: () => import("../views/SP/Report/Report04.vue"),
  },
  {
    path: "/Barge/FuelRatePerRPMReport",
    name: "FuelRatePerRPMReport",
    component: () => import("../views/SP/Report/Report05.vue"),
  },
  {
    path: "/Tugboat/ThrottleRPMFuelRateReport",
    name: "ThrottleRPMFuelRateReport",
    component: () => import("../views/SP/Report/Report06.vue"),
  },
  {
    path: "/Barge/DailyFuelConsumtionReport",
    name: "DailyFuelConsumtionReport",
    component: () => import("../views/SP/Report/Report07.vue"),
  },
  {
    path: "/Barge/BargeTiltReport",
    name: "BargeTiltReport",
    component: () => import("../views/SP/Report/Report08.vue"),
  },
  {
    path: "/Management",
    name: "Management",
    component: () => import("../views/SP/Setting/ManagementTable.vue"),
  },
  {
    // path: "/ManagementForm",
    path: "/Management/:deviceId",
    name: "ManagementForm",
    component: () => import("../views/SP/Setting/ManagementForm.vue"),
    props: true,
  },
  {
    path: "/:catchAll(.*)", // 404 Not found
    name: "Not Found",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "Page Not Found" }
  },
  // CU
  {
    path: "/ArchDashboard",
    name: "ArchDashboard",
    component: () => import("../views/CU/Dashboard.vue"),
  },
  // Floor Plan
  {
    path: "/DemoCU",
    name: "DemoCU",
    component: () => import("../views/CU/DemoCU.vue"), 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  
  // ตรวจสอบว่าเส้นทางนี้ต้องการการ Authenticate หรือไม่
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // ถ้าต้องการ Authenticate แต่ยังไม่ได้ Login
  if (requiresAuth && !isAuthenticated) {
    next('/'); // Redirect ไปหน้า Login
  } 
  // ถ้า Login แล้ว แต่พยายามเข้าไปหน้า Login อีก
  else if (isAuthenticated && to.path === '/') {
    next('/Homepage'); // Redirect ไปหน้า Homepage
  }
  else {
    next();
  }
});

// setting Title Page
const DEFAULT_TITLE = process.env.VUE_APP_DEFAULT_TITLE || "MFEC"
router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE
})

export default router;