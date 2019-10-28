// import * as types from '../actionTypes/map'
import { getSelectionData } from '../../services/api/data'

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
    const data = await getSelectionData(id)
    if (data && data.length) commit('CURRENT_SELECTION', data[0])
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
