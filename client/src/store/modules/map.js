// import * as types from '../actionTypes/map'
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

const actions = {}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
