import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'

import store from './store'
import App from './App.vue'
import router from './router'


Vue.use(VueRouter)
Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
