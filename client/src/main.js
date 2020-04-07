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
// import * as bugsnag from './plugins/bugsnag'
import Vue2TouchEvents from 'vue2-touch-events'
import * as vueTour from './plugins/vue-tour'
import initiateCall from './plugins/freshchat'

Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => appErrorHandler(err, vm, info)

// Install vue2-touch-events
Vue.use(Vue2TouchEvents)

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  // additionalSignUpFields: [
  //   {
  //     name: 'companyname',
  //     placeholder: 'Enter your company name'
  //     // The following properties are optional
  //     // icon: 'https://example.com/assests/address_icon.png',
  //     // prefill: 'street 123',
  //     // validator: function(address) {
  //     //   return {
  //     //     valid: address.length >= 10,
  //     //     hint: 'Must have 10 or more chars' // optional
  //     //   }
  //     // }
  //   },
  //   {
  //     name: 'name',
  //     placeholder: 'Enter your name'
  //   },
  //   {
  //     name: 'lastname',
  //     placeholder: 'Enter your last name'
  //   }
  // ],
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
  // bugsnag,
  element,
  vueTour,
  vueTelInput,
  cockieconsent,
  render: h => h(App),
  async created() {
    window.addEventListener
      ? await window.addEventListener('load', initiateCall, !1)
      : await window.attachEvent('load', initiateCall, !1)

    setTimeout(() => {
      try {
        window.fcWidget.setExternalId(this.$auth.user.sub)
        window.fcWidget.user.setFirstName(this.$auth.user.name)
        window.fcWidget.user.setEmail(this.$auth.user.email)
        // window.fcWidget.user.setProperties({
        //   plan: 'Estate', // meta property 1
        //   status: 'Active' // meta property 2
        // })
      } catch (err) {
        console.error(err)
      }
    }, 11000)
  }
}).$mount('#app')
