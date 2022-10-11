import Vue from 'vue'
import createAuth0Client from '@auth0/auth0-spa-js'
import { bus } from '../helpers/eventBus'
import { AUTH_USER } from '../events/auth'

let instance

const sessionStorageCache = {
  get: function (key) {
    return JSON.parse(sessionStorage.getItem(key));
  },

  set: function (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  remove: function (key) {
    sessionStorage.removeItem(key);
  },

  // Optional
  allKeys: function () {
    return Object.keys(sessionStorage);
  }
}

export const getInstance = () => instance

export const useAuth0 = ({
  onRedirectCallback = () =>
    window.history.replaceState({}, document.title, window.location.pathname),
  redirectUri = options.redirectUri,
  ...options
}) => {
  if (instance) return instance
  instance = new Vue({
    data: () => ({
      loading: true,
      isAuthenticated: false,
      user: {},
      auth0Client: null,
      popupOpen: false,
      error: null
    }),
    computed: {
      isUserAnAdmin() {
        const userId =
          this.$auth.user && this.$auth.user.sub ? this.$auth.user.sub : ''
        const admIDs = process.env.VUE_APP_RESTRICTED_IDS
          ? process.env.VUE_APP_RESTRICTED_IDS.split(',')
          : []
        return admIDs.includes(userId)
      }
    },
    async created() {
      await this.createAuthClient()
    },
    methods: {
      async createAuthClient() {
        // Create a new instance of the SDK client using members of the given options object
        this.auth0Client = await createAuth0Client({
          domain: options.domain,
          client_id: options.clientId,
          audience: options.audience,
          redirect_uri: redirectUri,
          cache: sessionStorageCache
        })
        try {
          // If the user is returning to the app after authentication..
          if (
            window.location.search.includes('code=') &&
            window.location.search.includes('state=')
          ) {
            // handle the redirect and retrieve tokens
            const { appState } = await this.auth0Client.handleRedirectCallback()

            // Notify subscribers that the redirect callback has happened, passing the appState
            // (useful for retrieving any pre-authentication state)
            onRedirectCallback(appState)
          }
        } catch (e) {
          this.error = e
        } finally {
          // Initialize our internal authentication state
          this.isAuthenticated = await this.auth0Client.isAuthenticated()
          this.user = (await this.auth0Client.getUser()) || {}
          this.loading = false
        }
      },
      async getUserID() {
        return this.user && this.user.sub ? this.user.sub : ''
      },
      async checkAuthStatus() {
        if (this.auth0Client) {
          return await this.auth0Client.isAuthenticated()
        }
      },
      /** Authenticates the user using a popup window */
      async loginWithPopup(o) {
        this.popupOpen = true

        try {
          await this.auth0Client.loginWithPopup(o)
        } catch (e) {
          console.error(e)
        } finally {
          this.popupOpen = false
        }

        this.user = await this.auth0Client.getUser()
        this.isAuthenticated = true
      },
      /** Handles the callback when logging in using a redirect */
      async handleRedirectCallback() {
        this.loading = true
        try {
          await this.auth0Client.handleRedirectCallback()
          this.user = await this.auth0Client.getUser()
          this.isAuthenticated = true
          bus.$emit(`${AUTH_USER}`)
        } catch (e) {
          this.error = e
        } finally {
          this.loading = false
        }
      },
      /** Authenticates the user using the redirect method */
      loginWithRedirect(o) {
        if (this.loading) {
          setTimeout(() => this.loginWithRedirect(o), 1000)
        } else {
          this.auth0Client.loginWithRedirect(o)
        }
      },
      /** Returns all the claims present in the ID token */
      getIdTokenClaims(o) {
        return this.auth0Client.getIdTokenClaims(o)
      },
      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently(o) {
        return this.auth0Client.getTokenSilently(o)
      },
      /** Gets the access token using a popup window */
      getTokenWithPopup(o) {
        return this.auth0Client.getTokenWithPopup(o)
      },
      /** Logs the user out and removes their session on the authorization server */
      logout(o) {
        this.auth0Client.logout(o)
      }
    }
  })
  return instance
}

export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options)
  }
}
