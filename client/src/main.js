import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import App from './App.vue'
import store from './store/'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/directives'
import '@/sass/main.scss'

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(Vuex)

const app = new Vue({
  router,
  store,
  render: (h) => h(App)
})

// Connection socket websocket

store.dispatch('WS/COWS')
store.dispatch('user/autoLogin').finally(() => {
  app.$mount('#app')
})