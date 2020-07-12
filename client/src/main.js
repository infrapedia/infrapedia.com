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
import { bus } from './helpers/eventBus'
import { AUTH_USER } from './events/auth'
import injectInitialState from './helpers/injectInitialState'
import VueMeta from 'vue-meta'

Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => appErrorHandler(err, vm, info)

// Install vue2-touch-events
Vue.use(Vue2TouchEvents)

// Install VueMeta here for SEO enhancement
if (process.env.NODE_ENV == 'production') {
  Vue.use(VueMeta, {
    refreshOnceOnNavigation: true,
    keyName: 'head'
  })
}

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  redirectUri: process.env.VUE_APP_REDIRECT_URI,
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

const app = new Vue({
  router,
  store,
  icons,
  // bugsnag,
  element,
  vueTour,
  vueTelInput,
  cockieconsent,
  render: h => h(App),
  created() {
    window.addEventListener
      ? window.addEventListener('load', initiateCall, !1)
      : window.attachEvent('load', initiateCall, !1)

    bus.$on(`${AUTH_USER}`, this.handleSetUserData)
  },
  beforeDestroy() {
    window.removeEventListener
      ? window.addEventListener('load', initiateCall, !1)
      : window.attachEvent('load', initiateCall, !1)

    bus.$off(`${AUTH_USER}`, this.handleSetUserData)
  },
  methods: {
    async handleSetUserData() {
      if (window.fcWidget) {
        window.fcWidget.setExternalId(await this.$auth.getUserID())
        window.fcWidget.user.setEmail(this.$auth.user.email)
        window.fcWidget.user.setFirstName(this.$auth.user.name)
      }
    }
  }
})

if (process.env.NODE_ENV == 'production') {
  router.beforeResolve(async (to, from, next) => {
    try {
      const components = router.getMatchedComponents(to)

      // By using `await` we make sure to wait
      // for the API request made by the `fetch()`
      // method to resolve before rendering the view.
      await Promise.all(components.map(x => x.fetch && x.fetch({ store })))

      // The `injectInitialState()` function injects
      // the current state as a global variable
      // `__INITIAL_STATE__` if the page is currently
      // pre-rendered.
      if (window.__PRERENDER_INJECTED) injectInitialState(store.state)
    } catch (error) {
      // This is the place for error handling in
      // case the API request fails for example.
      console.log(error)
    }

    return next()
  })
}

app.$mount('#app')
