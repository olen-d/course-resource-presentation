import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if(savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
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
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
      meta: {
        title: 'Contact Us'
      },
      beforeEnter: (to, from) => {
        const { path, meta: { title } } = from
        localStorage.setItem('NCGR_ROUTE_PREV_PATH', path)
        localStorage.setItem('NCGR_ROUTE_PREV_TITLE', title)
        return true
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
