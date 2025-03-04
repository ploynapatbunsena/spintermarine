import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
    name: 'GeneratorDetail',
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
    path: "/NotificationReport",
    name: "NotificationReport",
    component: () => import("../views/SP/Report/NotificationReport.vue"),
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
    name: "GPS_Tracker",
    component: () => import("../views/SP/GPSVessel.vue"),
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
    name: "ARC02",
    component: () => import("../views/CU/Dashboard.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// setting Title Page
const DEFAULT_TITLE = process.env.VUE_APP_DEFAULT_TITLE || "MFEC"
router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE
})

export default router;