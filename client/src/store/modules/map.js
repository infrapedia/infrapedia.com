// import * as types from '../actionTypes/map'
import { getSelectionData, getFacility } from '../../services/api/data'

const state = {
  filter: ['all'],
  currentSelection: null
}

const mutations = {
  CURRENT_SELECTION(state, selection) {
    state.currentSelection = selection
  },
  CURRENT_MAP_FILTER(state, filter) {
    state.filter = filter
  }
}

const actions = {
  async getCurrentSelectionData({ commit }, id) {
    const res = await getSelectionData(id)
    if (res && res.length) commit('CURRENT_SELECTION', res[0])
  },
  async getFacilityData({ commit }, id) {
    const res = await getFacility(id)
    if (res && res.length) commit('CURRENT_SELECTION', res)
    return res
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
