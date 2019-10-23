import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as element from './plugins/element-ui'
import * as icons from './plugins/fontAwesome'
import * as cockieconsent from './plugins/cookieConsent'
import appErrorHandler from './services/errors/appErrorHandler'
import axios from 'axios'
import VueAxios from './plugins/axios'

Vue.config.productionTip = false
Vue.config.errorHandler = appErrorHandler()

Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  icons,
  element,
  cockieconsent,
  render: h => h(App)
}).$mount('#app')
