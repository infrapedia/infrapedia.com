import * as types from '../actionTypes/editor'

const state = {
  scene: {
    features: {
      list: [],
      selected: null
    },
    creation: null,
    edition: null
  },
  isMapFormLoading: false
}

const mutations = {
  [types.BEGIN_CREATION](state) {
    state.scene.edition = false
    state.scene.creation = true
  },
  [types.BEGIN_EDITION](state) {
    state.scene.edition = true
    state.scene.creation = false
  },
  [types.CONFIRM_CREATION](state, feature) {
    state.scene.features.list.push(feature)
  },
  [types.EDIT_FEATURE_PROPS](state) {
    return state
  },
  [types.CANCEL](state) {
    return state
  },
  [types.TOGGLE_MAP_FORM_LOADING](state, bool) {
    state.isMapFormLoading = bool
  },
  [types.EDIT_FEATURE](state, features) {
    state.scene.features.list.forEach((feat, i) => {
      for (let featEdit of features) {
        if (feat.id === featEdit.id) {
          state.scene.features.list[i] = { ...featEdit }
        }
      }
    })
  },
  [types.DELETE_FEATURE](state, id) {
    state.scene.features.list = state.scene.features.list.filter(
      feat => feat.id !== id
    )
  },
  [types.SELECTION](state, featuresSelected) {
    state.scene.features.selected = featuresSelected
  },
  [types.RESET_LIST](state) {
    state.scene.features.list = []
  },
  [types.SET_LIST](state, list) {
    state.scene.features.list = list
  },
  [types.RESET_SCENE](state) {
    state.scene.edition = null
    state.scene.creation = null
    state.scene.features.selected = null
  }
}

const actions = {
  beginCreation({ commit }) {
    return commit(`${types.BEGIN_CREATION}`)
  },
  beginEdition({ commit }) {
    return commit(`${types.BEGIN_EDITION}`)
  },
  selectionChange({ commit }, selection) {
    return commit(`${types.SELECTION}`, selection.features)
  },
  resetScene({ commit }) {
    return commit(`${types.RESET_SCENE}`)
  },
  editFeature({ commit }, features) {
    return commit(`${types.EDIT_FEATURE}`, features)
  },
  confirmCreation({ commit }, feature) {
    return commit(`${types.CONFIRM_CREATION}`, feature)
  },
  setList({ commit }, featuresList) {
    return commit(`${types.SET_LIST}`, featuresList)
  },
  resetList({ commit }) {
    return commit(`${types.RESET_LIST}`)
  },
  cancel({ commit }) {
    return commit(`${types.CANCEL}`)
  },
  deleteFeature({ commit }, id) {
    return commit(`${types.DELETE_FEATURE}`, id)
  },
  toggleMapFormLoading({ commit }, bool) {
    return commit(`${types.TOGGLE_MAP_FORM_LOADING}`, bool)
  }
}
const getters = {
  isCreation: state => state.scene.creation,
  isEdition: state => state.scene.edition
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
