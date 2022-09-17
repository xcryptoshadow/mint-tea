import { createRouter, createWebHistory } from "vue-router";

/* Async Components */
const HomeView = () => import("../views/HomeView.vue");
const ExploreView = () => import("../views/ExploreView.vue");
const AccountView = () => import("../views/AccountView.vue");

/* Create our Router */
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return window.scrollTo({
        top: document.querySelector(to.hash).offsetTop + 140,
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
      path: "/explore",
      name: "explore",
      component: ExploreView,
    },
    {
      path: "/account",
      name: "account",
      component: AccountView,
    },
  ],
});

export default router;
