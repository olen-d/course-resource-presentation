import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: 'About'
      }
    },
    {
      path: "/courses/:slug",
      component: () => import("../views/CourseView.vue"),
      meta: {
        title: 'Courses'
      }
    }
  ],
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} \u00ab ${import.meta.env.VITE_TITLE}`
  next()
})

export default router
