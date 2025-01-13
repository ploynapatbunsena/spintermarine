import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { title: "Login"}
  },
  {
    path: "/Homepage",
    name: "Homepage",
    component: () => import("../views/Homepage.vue"),
    meta: { title: "Homepage"}
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