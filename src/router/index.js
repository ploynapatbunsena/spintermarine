import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
    path: "/Barge/:typeDeviceName",
    name: "BargeDetail",
    component: () => import("../views/SP/BargeDetails.vue"),
    props: true,
  },
  {
    // path: "/Barge/:typeDeviceName/:id",
    path: "/Barge/:typeDeviceName/Generator/:deviceId",
    name: 'GeneratorDetails',
    component: () => import("../views/SP/GeneratorDetails.vue"),
    props: true
  },
  {
    path: "/Barge/:typeDeviceName/StatusEdit",
    name: "StatusEditForm",
    component: () => import("../views/SP/StatusEditForm.vue"),
    props: true
  },
  {
    path: "/Tugboat",
    name: "Tugboat",
    component: () => import("../views/SP/Overview/TugboatOverview.vue"),
  },
  {
    path: "/Tugboat/:deviceId",
    name: "TugboatDetail",
    component: () => import("../views/SP/TugboatDetails.vue"),
    props: true,
  },
  {
    path: "/Tugboat/:deviceId/GPS",
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
    path: "/DeviceManagement",
    name: "DeviceManagementList",
    component: () => import("../views/SP/Setting/DeviceManagementList.vue"),
  },
  {
    path: "/DeviceManagement/:deviceId",
    name: "DeviceManagementForm",
    component: () => import("../views/SP/Setting/DeviceManagementForm.vue"),
    props: true,
  },
  {
    path: "/MemberManagement",
    name: "MemberManagementList",
    component: () => import("../views/SP/Setting/MemberManagementList.vue"),
  },
  {
    path: "/MemberManagement/:memberId",
    name: "MemberManagementForm",
    component: () => import("../views/SP/Setting/MemberManagementForm.vue"),
    props: true,
  },
  {
    path: "/:catchAll(.*)",
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