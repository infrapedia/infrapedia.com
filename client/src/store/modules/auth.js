import createAuth0Client from '@auth0/auth0-spa-js'
import * as types from '../actionTypes/auth'

const state = {
  isAuthenticated: false,
  auth0Client: null,
  loading: true,
  user: {},
  popupOpen: false,
  error: null
}

const mutations = {
  [types.AUTH_CLIENT](state, client) {
    state.auth0Client = client
  },
  [types.IS_LOADING](state, bool) {
    state.loading = bool
  },
  [types.IS_AUTH](state, bool) {
    state.isAuthenticated = bool
  },
  [types.IS_POPUP](state, bool) {
    state.popupOpen = bool
  },
  [types.AUTH_ERROR](state, err) {
    state.err = err
  },
  [types.USER_DATA](state, data) {
    state.user = data
  },
  [types.RESET_AUTH](state) {
    state.isAuthenticated = false
    state.auth0Client = null
    state.loading = true
    state.user = {}
    state.popupOpen = false
    state.error = null
  }
}

const actions = {
  async createClient({ commit, dispatch }, { options, redirectUri }) {
    const res = await createAuth0Client({
      domain: options.domain,
      client_id: options.clientId,
      audience: options.audience,
      redirect_uri: redirectUri
    })
    commit(`${types.AUTH_CLIENT}`, res)
    dispatch('toggleLoading', false)
  },
  async getUserData({ commit, state }) {
    const res = await state.auth0Client.getUser()
    if (res) {
      commit(`${types.USER_DATA}`, res)
      commit(`${types.IS_AUTH}`, true)
    }
  },
  async isAuthenticated({ commit, state }) {
    const res = await state.auth0Client.isAuthenticated()
    commit(`${types.IS_AUTH}`, res)
  },
  toggleLoading({ commit }, bool) {
    commit(`${types.IS_LOADING}`, bool)
  },
  resetAuth({ commit }) {
    commit(`${types.RESET_AUTH}`)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
