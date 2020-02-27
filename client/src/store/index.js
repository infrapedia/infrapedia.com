import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import editor from './modules/editor'
import * as types from './actionTypes'
import * as modes from '../config/sidebarModes'
import { dataActions, dataMutations } from './data'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ],
  devtools: true,
  state: {
    isDark: false,
    buyType: null,
    isOnline: true,
    isMobile: false,
    isDrawing: false,
    isSidebar: false,
    isLocating: false,
    isLoading: false,
    isBuyDialog: false,
    isIssueDialog: false,
    isAlertDialog: false,
    isMessageDialog: false,
    isVerificationDialog: false,
    sidebarMode: modes.CABLE_MODE,
    ixps: [],
    premium: [],
    networks: [],
    submarine: [],
    dataCenters: []
  },
  mutations: {
    ...dataMutations,
    [types.TOGGLE_DARK](state, bool) {
      state.isDark = bool
      const body = document.getElementById('html-wrapper')
      // I don't know if this is not supposed to be done but hey
      // in this case is necessary for style issues
      bool ? (body.className = 'dark') : (body.className = 'light')
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
    },
    [types.TOGGLE_BUY_DIALOG](state, bool) {
      state.isBuyDialog = bool
    },
    [types.TOGGLE_ALERT_DIALOG](state, bool) {
      state.isAlertDialog = bool
    },
    [types.TOGGLE_MESSAGE_DIALOG](state, bool) {
      state.isMessageDialog = bool
    },
    [types.TOGGLE_VERIFICATION_DIALOG](state, bool) {
      state.isVerificationDialog = bool
    },
    [types.BUY_TYPE](state, type) {
      state.buyType = type
    },
    [types.TOGGLE_ISSUES_DIALOG](state, bool) {
      state.isIssueDialog = bool
    }
  },
  actions: {
    changeSidebarMode({ commit }, num) {
      return commit(
        `${types.TOGGLE_SIDEBAR_MODE}`,
        num > 0 ? modes.DATA_CENTER_MODE : modes.CABLE_MODE
      )
    },
    ...dataActions
  },
  modules: {
    map,
    editor
  }
})
