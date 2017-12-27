import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import App from './App.vue'
import router from './router'


Vue.use(VueRouter)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
