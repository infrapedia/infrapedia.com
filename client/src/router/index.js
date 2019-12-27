import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
// import authGuard from '../auth/authGuard'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

// router.beforeEach(authGuard)

export default router
