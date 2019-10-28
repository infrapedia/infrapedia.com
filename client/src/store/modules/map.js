import * as mapTypes from '../actionTypes/map'

const state = {
  filter: ['all'],
  currentSelection: null
}

const mutations = {
  [mapTypes.CURRENT_SELECTION](state, selection) {
    state.currentSelection = selection
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
