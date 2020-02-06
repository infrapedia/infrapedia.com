import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as element from './plugins/element-ui'
import * as icons from './plugins/fontAwesome'
import * as cockieconsent from './plugins/cookieConsent'
import appErrorHandler from './services/notifications/errors'
import VueAxios from './plugins/axios'
import * as vueTelInput from './plugins/vue-tel-input'
import { domain, clientId } from './auth/config.json'
import { Auth0Plugin } from './auth'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => appErrorHandler(err, vm, info)

// Install vue2-touch-events
Vue.use(Vue2TouchEvents)

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})

// Install axios
Vue.use(VueAxios, {
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000
})

new Vue({
  router,
  store,
  icons,
  element,
  vueTelInput,
  cockieconsent,
  render: h => h(App)
}).$mount('#app')
