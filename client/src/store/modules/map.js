// import * as types from '../actionTypes/map'
import { getSelectionData } from '../../services/api/data'
import * as modes from '../../config/sidebarModes'

const state = {
  filter: ['all'],
  currentSelection: null,
  sidebarMode: modes.CABLE_MODE
}

const mutations = {
  CURRENT_SELECTION(state, selection) {
    state.currentSelection = selection
  },
  CURRENT_MAP_FILTER(state, filter) {
    state.filter = filter
  },
  TOGGLE_SIDEBAR_MODE(state, mode) {
    state.sidebarMode = mode
  }
}

const actions = {
  async getCurrentSelectionData({ commit }, id) {
    const data = await getSelectionData(id)
    if (data && data.length) commit('CURRENT_SELECTION', data[0])
  },
  changeSidebarMode({ commit }, num) {
    commit('TOGGLE_SIDEBAR_MODE', num > 0 ? modes.DATA_CENTER_MODE : modes.CABLE_MODE)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
