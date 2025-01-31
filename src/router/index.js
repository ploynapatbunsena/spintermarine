import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login/Login.vue"),
  }, 
  {
    path: "/Homepage",
    name: "Homepage",
    component: () => import("../views/Home/Homepage.vue"),
  },
  {
    path: "/Barge",
    name: "Barge",
    component: () => import("../views/Overview/BargeOverview.vue"),
  },
  {
    path: "/Tugboat",
    name: "Tugboat",
    component: () => import("../views/Overview/TugboatOverview.vue"),
  },
  {
    path: "/Barge/:id",
    name: "BargeDetail",
    component: () => import("../views/BargeDetails.vue"),
    props: true,
  },
  {
    path: "/Barge/:id/:itemId",
    name: 'GeneratorDetail',
    component: () => import("../views/GeneratorDetails.vue"),
    props: true
  },
  {
    path: "/ArchDashboard",
    name: "ARC02",
    component: () => import("../views/CU/Dashboard.vue"),
  },
  {
    path: "/:catchAll(.*)", // 404 Not found
    name: "Not Found",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "Page Not Found" }
  }
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