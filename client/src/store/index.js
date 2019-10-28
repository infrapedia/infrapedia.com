import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import auth from './modules/auth'
import * as types from './actionTypes'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  devtools: true,
  state: {
    isDark: false,
    isOnline: true,
    isMobile: false,
    isDrawing: false,
    isLocating: false
  },
  mutations: {
    [types.TOGGLE_DARK](state, bool) {
      state.isDark = bool
    },
    [types.SHARE_LINK](state) {
      return state
    },
    [types.IS_MOBILE](state, bool) {
      state.isMobile = bool
    },
    [types.IS_DRAWING](state, bool) {
      state.isDrawing = bool
    },
    [types.LOCATE_USER](state, bool) {
      state.isLocating = bool
    },
  },
  actions: {},
  modules: {
    map,
    auth
  }
})
