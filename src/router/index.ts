import { ElStep } from 'element-plus'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { DynamicRouting } from './addrouters'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [],
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/threeJsLogin',
    name: 'threeJsLogin',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/3dLoginView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/LoginView.vue'),
  },
]

// 动态路由，注意每一个路由必须加children，即使是空的，使用用来识别的

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

// 将动态路由加入路由表单中
if (router.getRoutes().length === 4) {
  DynamicRouting.forEach((item) => {
    if (item && item.children) {
      router.addRoute('home', {
        path: item.path,
        name: item.name,
        meta: item.meta,
        component: item.component,
        children: item.children,
      })
    } else {
      router.addRoute('home', {
        path: item.path,
        name: item.name,
        meta: item.meta,
        component: item.component,
      })
    }
  })
}

// 路由拦截，路由跳转之前执行
router.beforeEach((to, form, next) => {
  NProgress.start()
  if (to.path == '/login') {
    if (localStorage.getItem('token')) {
      return
    } else {
      next()
    }
  } else {
    if (localStorage.getItem('token')) {
      next()
    } else {
      next('login')
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
export default router
