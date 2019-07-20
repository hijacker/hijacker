import Vue from 'vue'
import VueRouter from 'vue-router'

// Import Pages
import Default from '@/pages/Default'
import History from '@/pages/History'

Vue.use(VueRouter)

export default new VueRouter({
  base: '/hijacker',
  // mode: 'history',
  routes: [
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
})
