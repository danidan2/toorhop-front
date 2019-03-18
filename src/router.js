import Vue from 'vue'
import Router from 'vue-router'
import { store } from '@/store.js'
import vbclass from 'vue-body-class'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'

Vue.use(Router)

const routes = [
  { name: 'Home', path: '/', component: Home, meta: { bodyClass: 'home' } },
  { path: '*', component: NotFound }
]

const router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  linkActiveClass: 'active',
  routes: routes
})

router.beforeEach((to, from, next) => {
  const requiresGuideAuth = to.matched.some(record => record.meta.requiresGuideAuth)
  if (requiresGuideAuth && store.getters.user === null) {
    next('/login')
  }
  if (store.getters.user !== null && to.name === 'Register') {
    next('/guide/check')
  }
  if (requiresGuideAuth && store.getters.user !== null) {
    next()
  }
  next()
})

export default router

Vue.use(vbclass, router)
