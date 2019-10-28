import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as element from './plugins/element-ui'
import * as icons from './plugins/fontAwesome'
import * as cockieconsent from './plugins/cookieConsent'
import appErrorHandler from './services/notifications/errors'
import axios from 'axios'
import VueAxios from './plugins/axios'
import * as vueTelInput from './plugins/vue-tel-input'

Vue.config.productionTip = false
// eslint-disable-next-line
Vue.config.errorHandler = (err, vm, info) => appErrorHandler(err, vm, info)

Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  icons,
  element,
  vueTelInput,
  cockieconsent,
  render: h => h(App)
}).$mount('#app')
