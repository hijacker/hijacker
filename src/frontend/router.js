import VueRouter from 'vue-router'

import Rules from './pages/Rules.vue'
import Log from './pages/Log.vue'

const Router = new VueRouter({
  base: '/hijacker',
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Rules
    },
    {
      path: '/log',
      component: Log
    }
  ]
})

export default Router
