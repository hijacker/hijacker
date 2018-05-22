import Vue from 'vue'
import VueRouter from 'vue-router'

// Import Pages
import Default from '@/pages/Default'

Vue.use(VueRouter)

export default new VueRouter({
  base: '/hijacker',
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Default
    }
  ]
})