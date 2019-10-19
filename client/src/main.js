import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as element from './plugins/element-ui'
import * as icons from './plugins/fontAwesome'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  icons,
  element,
  render: h => h(App)
}).$mount('#app')
