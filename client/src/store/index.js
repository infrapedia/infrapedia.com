import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import auth from './modules/auth'
import * as types from './actionTypes'
import * as modes from '../config/sidebarModes'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  devtools: true,
  state: {
    isDark: false,
    isOnline: true,
    isMobile: false,
    isDrawing: false,
    isSidebar: false,
    isLocating: false,
    isLoading: false,
    sidebarMode: modes.CABLE_MODE
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
    [types.TOGGLE_SIDEBAR](state, bool) {
      state.isSidebar = bool
    },
    [types.TOGGLE_LOADING](state, bool) {
      state.isLoading = bool
    },
    [types.TOGGLE_SIDEBAR_MODE](state, mode) {
      state.sidebarMode = mode
    }
  },
  actions: {
    changeSidebarMode({ commit }, num) {
      commit(
        `${types.TOGGLE_SIDEBAR_MODE}`,
        num > 0 ? modes.DATA_CENTER_MODE : modes.CABLE_MODE
      )
    }
  },
  modules: {
    map,
    auth
  }
})
