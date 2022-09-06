import { createRouter, createWebHistory } from "vue-router";

/* Async Components */
const HomeView = () => import("../views/HomeView.vue");
const MarketplaceView = () => import("../views/MarketplaceView.vue");

/* Create our Router */
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return window.scrollTo({
        top: document.querySelector(to.hash).offsetTop - 135,
        behavior: "smooth",
      });
    } else {
      return savedPosition || { top: 0, left: 0 };
    }
  },
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/marketplace",
      name: "marketplace",
      component: MarketplaceView,
    },
  ],
});

export default router;
