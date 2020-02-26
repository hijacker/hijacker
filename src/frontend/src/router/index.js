import Vue from 'vue'
import VueRouter from 'vue-router'

// Import Pages
import Default from '@/views/Default'
import History from '@/views/History'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Default,
    name: 'home'
  },
  {
    path: '/history',
    component: History,
    name: 'history'
  }
]

const router = new VueRouter({
  base: '/hijacker',
  routes
})

export default router
